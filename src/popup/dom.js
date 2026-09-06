/**
 * Shared DOM references and small view helpers for the popup. Imported by the
 * entry module and every feature module so they all address the same elements.
 * Module scripts run after the document is parsed, so getElementById is safe here.
 */

export const els = {
  tree: document.getElementById("tree"),
  search: document.getElementById("search-input"),
  status: document.getElementById("status"),
  backgroundToggle: document.getElementById("background-toggle"),
  sameSiteToggle: document.getElementById("samesite-toggle"),
  viewMain: document.getElementById("view-main"),
  viewSettings: document.getElementById("view-settings"),
  settingsOpen: document.getElementById("settings-open"),
  settingsBack: document.getElementById("settings-back"),
  settingsStatus: document.getElementById("settings-status"),
  themeSelect: document.getElementById("theme-select"),
  markingToggle: document.getElementById("marking-toggle"),
  markingState: document.getElementById("marking-state"),
  markingHint: document.getElementById("marking-hint"),
  perBookmarkToggle: document.getElementById("perbookmark-toggle"),
  perBookmarkPanel: document.getElementById("perbookmark-panel"),
  searchEngineToggle: document.getElementById("searchengine-toggle"),
  searchEnginePanel: document.getElementById("searchengine-panel"),
  deleteData: document.getElementById("delete-data"),
  deleteCancel: document.getElementById("delete-cancel"),
  deleteConfirm: document.getElementById("delete-confirm"),
};

/** Build a favicon URL via the privileged _favicon endpoint. */
export function faviconUrl(pageUrl) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", pageUrl);
  url.searchParams.set("size", "32");
  return url.toString();
}

export function makeEmpty(text) {
  const div = document.createElement("div");
  div.className = "empty";
  div.textContent = text;
  return div;
}

export function isVisible(el) {
  return el.offsetParent !== null;
}

export function setStatus(text) {
  els.status.textContent = text;
}

export function setSettingsStatus(text) {
  els.settingsStatus.textContent = text;
}

export function showError(err) {
  console.error("BookmarkUp:", err);
  setStatus("Something went wrong loading bookmarks.");
}

export function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
