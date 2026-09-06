/**
 * Per-bookmark opt-out grid, nested under the master switch. Each row is a
 * markable (http/https) bookmark with an on/off switch; on = gets the new-tab
 * behavior. Built lazily on first open, and re-rendered when the master changes.
 */

import { shouldMark } from "../../shared/url.js";
import { MSG } from "../../shared/constants.js";
import { els, faviconUrl } from "../dom.js";
import { getSearchIndex } from "../tree.js";
import { marking } from "./marking-state.js";

let rendered = false;

export function initPerBookmark() {
  els.perBookmarkToggle.addEventListener("click", onToggle);
}

/** Re-render the grid if it has been built, so switches track the master state. */
export function refreshPerBookmark() {
  if (rendered) render();
}

/** Show/hide the per-bookmark panel; build its grid lazily on first open. */
function onToggle() {
  const open = els.perBookmarkToggle.getAttribute("aria-expanded") !== "true";
  els.perBookmarkToggle.setAttribute("aria-expanded", String(open));
  els.perBookmarkPanel.hidden = !open;
  if (open && !rendered) {
    render();
    rendered = true;
  }
}

/** Build the 2-column grid of markable bookmarks, each with an on/off switch. */
function render() {
  // Only http/https bookmarks can carry the marker; others can't be toggled.
  const items = getSearchIndex().filter((entry) => shouldMark(entry.url));

  els.perBookmarkPanel.replaceChildren();
  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "pb-empty";
    empty.textContent = "No web bookmarks to configure.";
    els.perBookmarkPanel.append(empty);
    return;
  }

  const grid = document.createElement("div");
  grid.className = "perbookmark-grid";
  for (const entry of items) {
    grid.append(makeItem(entry));
  }
  els.perBookmarkPanel.append(grid);
}

/** @param {{ id: string, title: string, url: string }} entry */
function makeItem(entry) {
  const item = document.createElement("div");
  item.className = "pb-item";

  const icon = document.createElement("img");
  icon.className = "pb-icon";
  icon.width = 16;
  icon.height = 16;
  icon.alt = "";
  icon.src = faviconUrl(entry.url);
  icon.addEventListener("error", () => {
    icon.style.visibility = "hidden";
  });

  const title = document.createElement("span");
  title.className = "pb-title";
  title.textContent = entry.title || entry.url;
  title.title = entry.title ? `${entry.title}\n${entry.url}` : entry.url;

  const toggle = document.createElement("label");
  toggle.className = "switch";
  const input = document.createElement("input");
  input.type = "checkbox";
  // On = gets the new-tab behavior. Disabled while the master switch is off,
  // where per-bookmark choices don't apply.
  input.checked = marking.enabled && !marking.optedOut.has(entry.id);
  input.disabled = !marking.enabled;
  input.setAttribute("aria-label", `New-tab behavior for ${entry.title || entry.url}`);
  input.addEventListener("change", () => onItemToggle(entry.id, input));
  const track = document.createElement("span");
  track.className = "switch-track";
  track.setAttribute("aria-hidden", "true");
  toggle.append(input, track);

  item.append(icon, title, toggle);
  return item;
}

function onItemToggle(id, input) {
  const enabled = input.checked; // on = wants the new-tab behavior
  if (enabled) marking.optedOut.delete(id);
  else marking.optedOut.add(id);
  chrome.runtime
    .sendMessage({ type: MSG.setBookmarkMarking, id, enabled })
    .catch(() => {
      /* best-effort; the local mirror already reflects the intent */
    });
}
