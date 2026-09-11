/**
 * BookmarkUp popup entry. Wires the bookmark tree and the settings features,
 * then coordinates the two views (bookmark list <-> settings).
 *
 * All bookmark titles and URLs are treated as untrusted and are only ever
 * written to the DOM via textContent / element attributes built with the DOM
 * API, never innerHTML, so a crafted bookmark cannot inject markup. See dom.js
 * for the shared element references and view helpers.
 */

import { KEYS } from "../shared/constants.js";
import { els, setSettingsStatus } from "./dom.js";
import { setLanguage, applyStatic, dir, t } from "./i18n.js";
import { initTree, clearSearch, refreshTree } from "./tree.js";
import { initTheme } from "./settings/theme.js";
import { initBackground } from "./settings/background.js";
import { initMarking, refreshMarkingUI } from "./settings/marking.js";
import { initPerBookmark, refreshPerBookmark } from "./settings/per-bookmark.js";
import { initSearchEngines, refreshSearchEngines } from "./settings/search-engines.js";
import { initSameSite } from "./settings/same-site.js";
import { initDelete, resetDelete } from "./settings/delete.js";

init();

async function init() {
  // Resolve the language and fill static UI text before anything renders.
  await initI18n();

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

  els.settingsOpen.addEventListener("click", () => openView("settings"));
  els.settingsBack.addEventListener("click", () => openView("main"));
  els.aboutOpen.addEventListener("click", () => openView("about"));
  els.aboutBack.addEventListener("click", () => openView("main"));
  wireCollapsibleGroups();
  document.addEventListener("keydown", onGlobalKeydown);

  await initTree();
}

async function initI18n() {
  let pref = "system";
  try {
    const stored = await chrome.storage.local.get(KEYS.language);
    if (stored[KEYS.language]) pref = stored[KEYS.language];
  } catch {
    /* no stored preference: fall back to system */
  }
  await setLanguage(pref);
  applyStatic();
  fillAboutVersion();
  document.documentElement.dir = dir();
  els.languageSelect.value = pref;
  els.languageSelect.addEventListener("change", onLanguageChange);
}

/** The version line is dynamic (from the manifest) and localized, so fill it
 * in code rather than via a static data-i18n string. */
function fillAboutVersion() {
  const { version } = chrome.runtime.getManifest();
  els.aboutVersion.textContent = t("aboutVersion", version);
}

async function onLanguageChange() {
  const pref = els.languageSelect.value; // "system" | one of the supported codes
  chrome.storage.local.set({ [KEYS.language]: pref }).catch(() => {});
  await setLanguage(pref);
  document.documentElement.dir = dir();
  // Re-render everything that carries text: static labels, then the dynamic bits.
  applyStatic();
  fillAboutVersion();
  refreshMarkingUI();
  refreshPerBookmark();
  refreshSearchEngines();
  refreshTree();
}

/** Show exactly one of the three top-level views and move focus into it. */
function openView(name) {
  els.viewMain.hidden = name !== "main";
  els.viewSettings.hidden = name !== "settings";
  els.viewAbout.hidden = name !== "about";
  switch (name) {
    case "settings":
      resetDelete();
      els.themeSelect.focus();
      break;
    case "about":
      els.aboutBack.focus();
      break;
    default:
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
  // In settings or about, Escape returns to the bookmark list first; otherwise
  // clear the search.
  if (!els.viewSettings.hidden || !els.viewAbout.hidden) {
    openView("main");
  } else if (els.search.value) {
    clearSearch();
  }
}
