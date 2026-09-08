/**
 * Search-engine behavior. One switch per engine; on = open bookmarks in a new
 * tab (default), off = same tab as the engine. Built lazily on first open. The
 * choice is navigation-only, so the service worker (single writer) persists it.
 */

import { SEARCH_ENGINES } from "../../shared/search-engines.js";
import { KEYS, MSG } from "../../shared/constants.js";
import { els } from "../dom.js";

/** Engine ids set to open bookmarks in the same tab (mirrors the SW). */
let sameTabEngines = new Set();
let rendered = false;

export async function initSearchEngines() {
  sameTabEngines = await load();
  els.searchEngineToggle.addEventListener("click", onToggle);
}

/** Show/hide the search-engine panel; build its list lazily on first open. */
function onToggle() {
  const open = els.searchEngineToggle.getAttribute("aria-expanded") !== "true";
  els.searchEngineToggle.setAttribute("aria-expanded", String(open));
  els.searchEnginePanel.hidden = !open;
  if (open && !rendered) {
    render();
    rendered = true;
  }
}

/** Two engines per row: on = open bookmarks in a new tab; off = same tab. */
function render() {
  els.searchEnginePanel.replaceChildren();
  const grid = document.createElement("div");
  grid.className = "engine-grid";
  for (const engine of SEARCH_ENGINES) {
    grid.append(makeRow(engine));
  }
  els.searchEnginePanel.append(grid);
}

/** @param {{ id: string, label: string, home: string }} engine */
function makeRow(engine) {
  const row = document.createElement("div");
  row.className = "engine-row";

  // Bundled engine logos (icons/engines/<id>.png).
  const icon = document.createElement("img");
  icon.className = "pb-icon";
  icon.width = 16;
  icon.height = 16;
  icon.alt = "";
  icon.src = `../../icons/engines/${engine.id}.png`;
  icon.addEventListener("error", () => {
    icon.style.visibility = "hidden";
  });

  const name = document.createElement("span");
  name.className = "engine-name";
  name.textContent = engine.label;
  name.title = engine.label;

  const toggle = document.createElement("label");
  toggle.className = "switch";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = !sameTabEngines.has(engine.id); // on = new tab (default)
  input.setAttribute("aria-label", `Open bookmarks in a new tab on ${engine.label}`);
  input.addEventListener("change", () => onEngineToggle(engine.id, input));
  const track = document.createElement("span");
  track.className = "switch-track";
  track.setAttribute("aria-hidden", "true");
  toggle.append(input, track);

  row.append(icon, name, toggle);
  return row;
}

function onEngineToggle(id, input) {
  const newTab = input.checked; // on = new tab; off = same tab
  if (newTab) sameTabEngines.delete(id);
  else sameTabEngines.add(id);
  chrome.runtime
    .sendMessage({ type: MSG.setSearchEngine, id, newTab })
    .catch(() => {
      /* best-effort; the local mirror already reflects the intent */
    });
}

async function load() {
  try {
    const stored = await chrome.storage.local.get(KEYS.sameTabEngines);
    const list = stored[KEYS.sameTabEngines];
    return new Set(Array.isArray(list) ? list : []);
  } catch {
    return new Set();
  }
}
