/**
 * BookmarkUp popup entry. Wires the bookmark tree and the settings features,
 * then coordinates the two views (bookmark list <-> settings).
 *
 * All bookmark titles and URLs are treated as untrusted and are only ever
 * written to the DOM via textContent / element attributes built with the DOM
 * API, never innerHTML, so a crafted bookmark cannot inject markup. See dom.js
 * for the shared element references and view helpers.
 */

import { els, setSettingsStatus } from "./dom.js";
import { initTree, clearSearch } from "./tree.js";
import { initTheme } from "./settings/theme.js";
import { initBackground } from "./settings/background.js";
import { initMarking } from "./settings/marking.js";
import { initPerBookmark } from "./settings/per-bookmark.js";
import { initSearchEngines } from "./settings/search-engines.js";
import { initSameSite } from "./settings/same-site.js";
import { initDelete, resetDelete } from "./settings/delete.js";

init();

async function init() {
  // Load persisted settings up front so the settings UI opens in the right state.
  await Promise.all([
    initTheme(),
    initBackground(),
    initMarking(),
    initSearchEngines(),
    initSameSite(),
  ]);

  // Lazy panels: just attach their disclosure handlers.
  initPerBookmark();
  initDelete();

  els.settingsOpen.addEventListener("click", () => showSettings(true));
  els.settingsBack.addEventListener("click", () => showSettings(false));
  wireCollapsibleGroups();
  document.addEventListener("keydown", onGlobalKeydown);

  await initTree();
}

function showSettings(on) {
  els.viewMain.hidden = on;
  els.viewSettings.hidden = !on;
  if (on) {
    resetDelete();
    els.themeSelect.focus();
  } else {
    setSettingsStatus("");
    els.search.focus();
  }
}

/** Each `.group-header` toggles its associated `.group-content`. */
function wireCollapsibleGroups() {
  for (const header of document.querySelectorAll(".group-header")) {
    const content = document.getElementById(
      header.getAttribute("aria-controls"),
    );
    if (!content) continue;
    header.addEventListener("click", () => {
      const open = header.getAttribute("aria-expanded") !== "true";
      header.setAttribute("aria-expanded", String(open));
      content.hidden = !open;
    });
  }
}

function onGlobalKeydown(event) {
  if (event.key !== "Escape") return;
  // In settings, Escape returns to the bookmark list first; otherwise clear search.
  if (!els.viewSettings.hidden) {
    showSettings(false);
  } else if (els.search.value) {
    clearSearch();
  }
}
