/**
 * BookmarkUp popup.
 *
 * Renders the user's bookmark tree and opens any bookmark in a new tab with a
 * single left click. All bookmark titles and URLs are treated as untrusted and
 * are only ever written to the DOM via textContent / element attributes built
 * with the DOM API — never innerHTML — so a crafted bookmark cannot inject
 * markup into the popup.
 */

import { isSafeUrl, shouldMark, stripMarker } from "../shared/url.js";

const STORAGE_KEY = "openInBackground";
const MARKING_KEY = "markingEnabled";
const OPTOUT_KEY = "optedOut";
const THEME_KEY = "theme";
const THEMES = new Set(["system", "light", "dark"]);
const MAX_SEARCH_RESULTS = 300;

/** @type {{ id: string, title: string, url: string }[]} */
let searchIndex = [];
/** Cached bookmark tree from init(), reused when the search box is cleared. */
let cachedRoots = [];
let openInBackground = false;
let markingEnabled = true;
/** Bookmark ids opted out of the new-tab behavior (mirrors the SW's set). */
let optedOut = new Set();
let perBookmarkRendered = false;
let folderSeq = 0;

const els = {
  tree: document.getElementById("tree"),
  search: document.getElementById("search-input"),
  status: document.getElementById("status"),
  backgroundToggle: document.getElementById("background-toggle"),
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
  deleteData: document.getElementById("delete-data"),
  deleteCancel: document.getElementById("delete-cancel"),
  deleteConfirm: document.getElementById("delete-confirm"),
};

init();

async function init() {
  // Read preferences up front so the UI opens in the right state.
  const [theme, background, marking, optOut] = await Promise.all([
    loadTheme(),
    loadBackgroundPreference(),
    loadMarkingEnabled(),
    loadOptedOut(),
  ]);

  applyTheme(theme);
  els.themeSelect.value = theme;
  els.themeSelect.addEventListener("change", onThemeChange);

  openInBackground = background;
  els.backgroundToggle.checked = openInBackground;
  els.backgroundToggle.addEventListener("change", onBackgroundToggle);

  updateMarkingUI(marking);
  els.markingToggle.addEventListener("click", onMarkingToggle);

  optedOut = optOut;
  els.perBookmarkToggle.addEventListener("click", onPerBookmarkToggle);

  els.settingsOpen.addEventListener("click", () => showSettings(true));
  els.settingsBack.addEventListener("click", () => showSettings(false));
  els.deleteData.addEventListener("click", onDeleteData);
  els.deleteCancel.addEventListener("click", resetDeleteButton);
  wireCollapsibleGroups();

  els.search.addEventListener("input", debounce(onSearch, 90));
  els.tree.addEventListener("keydown", onTreeKeydown);
  document.addEventListener("keydown", onGlobalKeydown);

  try {
    cachedRoots = await chrome.bookmarks.getTree();
    buildSearchIndex(cachedRoots);
    renderTree(cachedRoots);
    els.search.focus();
  } catch (err) {
    showError(err);
  }
}

/* ------------------------------------------------------------------ *
 * Rendering
 * ------------------------------------------------------------------ */

function renderTree(roots) {
  els.tree.replaceChildren();

  // getTree() returns a single hidden root; render its top-level folders.
  const topLevel = roots[0]?.children ?? [];
  const list = buildNodeList(topLevel, 0);

  if (!list.childElementCount) {
    els.tree.append(makeEmpty("No bookmarks yet."));
  } else {
    els.tree.append(list);
  }
  setStatus(`${searchIndex.length} bookmarks`);
}

/**
 * @param {chrome.bookmarks.BookmarkTreeNode[]} nodes
 * @param {number} depth
 * @returns {HTMLUListElement}
 */
function buildNodeList(nodes, depth) {
  const ul = document.createElement("ul");
  ul.className = "node-list";

  for (const node of nodes) {
    if (node.url === undefined) {
      ul.append(buildFolder(node, depth));
    } else {
      ul.append(buildBookmark(node));
    }
  }
  return ul;
}

/** @param {chrome.bookmarks.BookmarkTreeNode} node */
function buildFolder(node, depth) {
  const li = document.createElement("li");

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "row folder";
  // Top-level folders (e.g. the Bookmarks Bar) start expanded.
  const expanded = depth === 0;
  btn.setAttribute("aria-expanded", String(expanded));

  const twisty = document.createElement("span");
  twisty.className = "twisty";
  twisty.setAttribute("aria-hidden", "true");
  twisty.textContent = "▾";

  const label = document.createElement("span");
  label.className = "label";
  label.textContent = node.title || "Untitled folder";

  const count = document.createElement("span");
  count.className = "sub";
  count.textContent = String((node.children ?? []).length);

  btn.append(twisty, label, count);
  li.append(btn);

  const childList = buildNodeList(node.children ?? [], depth + 1);
  childList.id = `folder-${folderSeq++}`;
  childList.hidden = !expanded;
  btn.setAttribute("aria-controls", childList.id);
  li.append(childList);

  btn.addEventListener("click", () => {
    const nowExpanded = btn.getAttribute("aria-expanded") !== "true";
    btn.setAttribute("aria-expanded", String(nowExpanded));
    childList.hidden = !nowExpanded;
  });

  return li;
}

/** @param {chrome.bookmarks.BookmarkTreeNode} node */
function buildBookmark(node) {
  const li = document.createElement("li");
  li.append(makeBookmarkRow(node));
  return li;
}

/** @param {{ title: string, url: string }} node */
function makeBookmarkRow(node) {
  // Bookmarks may carry BookmarkUp's `newtab@` marker; show and open them clean.
  const url = stripMarker(node.url);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "row bookmark";
  btn.title = url;

  const icon = document.createElement("img");
  icon.className = "icon";
  icon.width = 16;
  icon.height = 16;
  icon.alt = "";
  icon.src = faviconUrl(url);
  icon.addEventListener("error", () => {
    icon.style.visibility = "hidden";
  });

  const label = document.createElement("span");
  label.className = "label";
  label.textContent = node.title || url;

  btn.append(icon, label);
  btn.addEventListener("click", () => openBookmark(url));
  return btn;
}

function makeEmpty(text) {
  const div = document.createElement("div");
  div.className = "empty";
  div.textContent = text;
  return div;
}

/* ------------------------------------------------------------------ *
 * Search
 * ------------------------------------------------------------------ */

function buildSearchIndex(roots) {
  searchIndex = [];
  const walk = (node) => {
    if (node.url !== undefined) {
      searchIndex.push({
        id: node.id,
        title: node.title || "",
        url: stripMarker(node.url),
      });
    }
    for (const child of node.children ?? []) walk(child);
  };
  for (const root of roots) walk(root);
}

function onSearch() {
  const query = els.search.value.trim().toLowerCase();
  if (!query) {
    renderTree(cachedRoots);
    return;
  }

  const matches = [];
  for (const entry of searchIndex) {
    if (
      entry.title.toLowerCase().includes(query) ||
      entry.url.toLowerCase().includes(query)
    ) {
      matches.push(entry);
      if (matches.length >= MAX_SEARCH_RESULTS) break;
    }
  }

  els.tree.replaceChildren();
  if (!matches.length) {
    els.tree.append(makeEmpty("No matches."));
    setStatus("0 results");
    return;
  }

  const ul = document.createElement("ul");
  ul.className = "node-list";
  for (const entry of matches) {
    const li = document.createElement("li");
    li.append(makeBookmarkRow(entry));
    ul.append(li);
  }
  els.tree.append(ul);
  setStatus(
    matches.length >= MAX_SEARCH_RESULTS
      ? `${MAX_SEARCH_RESULTS}+ results`
      : `${matches.length} result${matches.length === 1 ? "" : "s"}`,
  );
}

/* ------------------------------------------------------------------ *
 * Opening
 * ------------------------------------------------------------------ */

function openBookmark(rawUrl) {
  if (!isSafeUrl(rawUrl)) {
    setStatus("Blocked an unsupported link.");
    return;
  }
  chrome.tabs
    .create({ url: rawUrl, active: !openInBackground })
    .then(() => {
      // An active tab steals focus and Chrome closes the popup for us.
      // In background mode the popup stays open so several can be opened.
      if (openInBackground) els.search.focus();
    })
    .catch(showError);
}

/** Build a favicon URL via the privileged _favicon endpoint. */
function faviconUrl(pageUrl) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", pageUrl);
  url.searchParams.set("size", "32");
  return url.toString();
}

/* ------------------------------------------------------------------ *
 * Keyboard
 * ------------------------------------------------------------------ */

function onGlobalKeydown(event) {
  if (event.key === "Escape") {
    // In settings, Escape returns to the bookmark list first.
    if (!els.viewSettings.hidden) {
      showSettings(false);
    } else if (els.search.value) {
      els.search.value = "";
      onSearch();
    }
    return;
  }
  if (event.target === els.search) {
    // Enter opens the first result; ArrowDown jumps into the list.
    if (event.key === "Enter") {
      const first = els.tree.querySelector(".row.bookmark");
      if (first) first.click();
    } else if (event.key === "ArrowDown") {
      const first = els.tree.querySelector(".row");
      if (first) {
        event.preventDefault();
        first.focus();
      }
    }
  }
}

function onTreeKeydown(event) {
  if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
  const rows = [...els.tree.querySelectorAll(".row")].filter(isVisible);
  if (!rows.length) return;

  event.preventDefault();
  const index = rows.indexOf(document.activeElement);
  let next;
  if (index === -1) {
    // Focus isn't on a row yet: ArrowDown → first, ArrowUp → last.
    next = event.key === "ArrowDown" ? rows[0] : rows[rows.length - 1];
  } else if (event.key === "ArrowDown") {
    next = rows[Math.min(index + 1, rows.length - 1)];
  } else {
    next = rows[Math.max(index - 1, 0)];
  }
  next.focus();
}

function isVisible(el) {
  return el.offsetParent !== null;
}

/* ------------------------------------------------------------------ *
 * Preferences + helpers
 * ------------------------------------------------------------------ */

async function loadBackgroundPreference() {
  try {
    const stored = await chrome.storage.local.get(STORAGE_KEY);
    return stored[STORAGE_KEY] === true;
  } catch {
    return false;
  }
}

function onBackgroundToggle() {
  openInBackground = els.backgroundToggle.checked;
  chrome.storage.local
    .set({ [STORAGE_KEY]: openInBackground })
    .catch(() => {
      /* preference is best-effort; ignore write failures */
    });
}

/* ------------------------------------------------------------------ *
 * Unmark / re-mark bookmarks
 * ------------------------------------------------------------------ */

async function loadMarkingEnabled() {
  try {
    const stored = await chrome.storage.local.get(MARKING_KEY);
    return stored[MARKING_KEY] !== false; // default on
  } catch {
    return true;
  }
}

/** Reflect the current marking state in the button, heading, and hint. */
function updateMarkingUI(enabled) {
  markingEnabled = enabled;

  // Button label is the action; colour it to match (blue = turn on, red = off).
  els.markingToggle.textContent = enabled ? "Turn OFF" : "Turn ON";
  els.markingToggle.classList.toggle("btn-red", enabled);
  els.markingToggle.classList.toggle("btn-blue", !enabled);

  // Coloured ON/OFF word sits in the setting's heading.
  els.markingState.textContent = enabled ? "ON" : "OFF";
  els.markingState.className = enabled ? "state-on" : "state-off";

  els.markingHint.textContent = enabled
    ? "Left-click a bookmark to open it in a new tab."
    : "Bookmarks open in the current tab, default behavior.";

  // Keep the nested per-bookmark switches in sync with the master.
  if (perBookmarkRendered) renderPerBookmark();
}

/**
 * Toggle the new-tab behavior. The service worker persists the choice and
 * either strips the markers from every bookmark or re-applies them.
 */
async function onMarkingToggle() {
  const next = !markingEnabled;
  els.markingToggle.disabled = true;
  try {
    const res = await chrome.runtime.sendMessage({
      type: "setMarking",
      enabled: next,
    });
    if (!res || res.ok !== true) {
      throw new Error(res?.error || "Could not update bookmarks.");
    }
    // Turning the master on re-includes every bookmark (SW cleared the set).
    if (next) optedOut.clear();
    updateMarkingUI(next);
  } catch (err) {
    // Leave the UI on the previous state; nothing changed on failure.
    console.error("BookmarkUp:", err);
  } finally {
    els.markingToggle.disabled = false;
  }
}

/* ------------------------------------------------------------------ *
 * Per-bookmark opt-out
 * ------------------------------------------------------------------ */

async function loadOptedOut() {
  try {
    const stored = await chrome.storage.local.get(OPTOUT_KEY);
    const list = stored[OPTOUT_KEY];
    return new Set(Array.isArray(list) ? list : []);
  } catch {
    return new Set();
  }
}

/** Show/hide the per-bookmark panel; build its grid lazily on first open. */
function onPerBookmarkToggle() {
  const open = els.perBookmarkToggle.getAttribute("aria-expanded") !== "true";
  els.perBookmarkToggle.setAttribute("aria-expanded", String(open));
  els.perBookmarkPanel.hidden = !open;
  if (open && !perBookmarkRendered) {
    renderPerBookmark();
    perBookmarkRendered = true;
  }
}

/** Build the 2-column grid of markable bookmarks, each with an on/off switch. */
function renderPerBookmark() {
  // Only http/https bookmarks can carry the marker; others can't be toggled.
  const items = searchIndex.filter((entry) => shouldMark(entry.url));

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
    grid.append(makePerBookmarkItem(entry));
  }
  els.perBookmarkPanel.append(grid);
}

/** @param {{ id: string, title: string, url: string }} entry */
function makePerBookmarkItem(entry) {
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
  input.checked = markingEnabled && !optedOut.has(entry.id);
  input.disabled = !markingEnabled;
  input.setAttribute("aria-label", `New-tab behavior for ${entry.title || entry.url}`);
  input.addEventListener("change", () => onBookmarkToggle(entry.id, input));
  const track = document.createElement("span");
  track.className = "switch-track";
  track.setAttribute("aria-hidden", "true");
  toggle.append(input, track);

  item.append(icon, title, toggle);
  return item;
}

function onBookmarkToggle(id, input) {
  const enabled = input.checked; // on = wants the new-tab behavior
  if (enabled) optedOut.delete(id);
  else optedOut.add(id);
  chrome.runtime
    .sendMessage({ type: "setBookmarkMarking", id, enabled })
    .catch(() => {
      /* best-effort; the local mirror already reflects the intent */
    });
}

/* ------------------------------------------------------------------ *
 * Settings
 * ------------------------------------------------------------------ */

function showSettings(on) {
  els.viewMain.hidden = on;
  els.viewSettings.hidden = !on;
  if (on) {
    resetDeleteButton();
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

async function loadTheme() {
  try {
    const stored = await chrome.storage.local.get(THEME_KEY);
    const value = stored[THEME_KEY];
    return THEMES.has(value) ? value : "system";
  } catch {
    return "system";
  }
}

/** Apply a theme by toggling data-theme on <html>; CSS does the rest. */
function applyTheme(theme) {
  if (theme === "light" || theme === "dark") {
    document.documentElement.dataset.theme = theme;
  } else {
    delete document.documentElement.dataset.theme;
  }
}

function onThemeChange() {
  const theme = THEMES.has(els.themeSelect.value)
    ? els.themeSelect.value
    : "system";
  applyTheme(theme);
  chrome.storage.local.set({ [THEME_KEY]: theme }).catch(() => {
    /* best-effort */
  });
}

/**
 * Deleting the extension is destructive and irreversible, so require a second
 * click to confirm. The actual uninstall (chrome.management.uninstallSelf) is
 * called here in the popup rather than the service worker: it must run in a
 * user-gesture context, which a click handler has but a message handler does
 * not. The service worker first restores the bookmarks and clears storage.
 */
let deleteArmed = false;

async function onDeleteData() {
  // First click arms: the button turns solid red and a back arrow appears to
  // cancel. A second click on the red button performs the delete.
  if (!deleteArmed) {
    deleteArmed = true;
    els.deleteData.classList.add("armed");
    els.deleteData.textContent = "Yes, delete extension";
    els.deleteCancel.hidden = false;
    els.deleteConfirm.hidden = false;
    return;
  }

  els.deleteData.disabled = true;
  els.deleteCancel.hidden = true;
  els.deleteConfirm.hidden = true;
  els.deleteData.textContent = "Removing…";
  setSettingsStatus("Restoring bookmarks and clearing data…");

  try {
    // Restore original bookmark URLs and clear stored settings first — once the
    // extension is uninstalled below, this code can no longer run.
    const res = await chrome.runtime.sendMessage({ type: "prepareUninstall" });
    if (!res || res.ok !== true) {
      throw new Error(res?.error || "Could not restore bookmarks.");
    }

    await chrome.management.uninstallSelf({ showConfirmDialog: false });
    // Not reached on success: the extension (and this popup) is gone by now.
    throw new Error("Uninstall did not complete.");
  } catch (err) {
    // Uninstall failed or was blocked — bring the markers back so BookmarkUp
    // keeps working, and tell the user what happened.
    chrome.runtime.sendMessage({ type: "resumeMarking" }).catch(() => {});
    console.error("BookmarkUp:", err);
    resetDeleteButton();
    setSettingsStatus(`Couldn't remove the extension: ${err.message}`);
  }
}

function resetDeleteButton() {
  deleteArmed = false;
  els.deleteData.disabled = false;
  els.deleteData.classList.remove("armed");
  els.deleteCancel.hidden = true;
  els.deleteConfirm.hidden = true;
  els.deleteData.textContent = "Delete extension";
  setSettingsStatus("");
}

function setSettingsStatus(text) {
  els.settingsStatus.textContent = text;
}

function setStatus(text) {
  els.status.textContent = text;
}

function showError(err) {
  console.error("BookmarkUp:", err);
  setStatus("Something went wrong loading bookmarks.");
}

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
