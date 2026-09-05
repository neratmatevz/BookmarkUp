/**
 * BookmarkUp background service worker — "native bar" mode via the marker + 204
 * technique.
 *
 * The browser's built-in bookmarks bar can't be hooked directly, and an
 * extension can't cancel the navigation a bookmark click starts. So instead of
 * reacting after the fact, BookmarkUp makes the bookmark itself un-navigable:
 *
 *   1. Every managed http/https bookmark URL is rewritten to carry a marker in
 *      its userinfo — `https://example.com` -> `https://newtab@example.com`
 *      (see markAllBookmarks / the chrome.bookmarks listeners below).
 *   2. A declarativeNetRequest rule (src/rules/newtab-204.json) redirects any
 *      main-frame request to a `newtab@` URL to an endpoint that returns HTTP
 *      204 No Content. Per the HTTP spec a 204 tells the browser to stay on the
 *      current document, so the current tab never navigates — no flash, no
 *      reload.
 *   3. This worker sees the navigation attempt (webNavigation.onBeforeNavigate),
 *      strips the marker, and opens the real URL in a new tab.
 *
 * Because only BookmarkUp's own bookmarks carry the marker, ordinary browsing
 * is never touched.
 */

import { addMarker, hasMarker, shouldMark, stripMarker } from "../shared/url.js";

const STORAGE_KEY = "openInBackground";
const MARKING_KEY = "markingEnabled";
const NEW_TAB_GRACE_MS = 2500;

/**
 * Recently created tabs (tabId -> createdAt ms). A bookmark opened via
 * middle/ctrl-click lands in a brand-new tab; that tab should become the
 * bookmark itself rather than spawning a second tab.
 */
const recentTabs = new Map();

// Cached preference so onBeforeNavigate can react synchronously.
let openInBackground = false;

/**
 * Whether BookmarkUp marks bookmarks at all (persisted, default true). The
 * "Unmark bookmarks" setting flips this off: the markers are stripped and the
 * listeners below stop re-applying them, so the bookmarks bar behaves natively
 * until the user turns it back on.
 */
let markingEnabled = true;

// Resolves once the persisted preferences are loaded. Marking waits on this so
// a startup markAllBookmarks() can't re-mark before we know the user turned it
// off (markingEnabled defaults to true in memory until this settles).
const ready = chrome.storage.local
  .get([STORAGE_KEY, MARKING_KEY])
  .then((stored) => {
    openInBackground = stored[STORAGE_KEY] === true;
    markingEnabled = stored[MARKING_KEY] !== false; // default on
  })
  .catch(() => {});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if (STORAGE_KEY in changes) {
    openInBackground = changes[STORAGE_KEY].newValue === true;
  }
  if (MARKING_KEY in changes) {
    markingEnabled = changes[MARKING_KEY].newValue !== false;
  }
});

/* ------------------------------------------------------------------ *
 * New-tab detection
 * ------------------------------------------------------------------ */

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.id !== undefined && tab.id !== chrome.tabs.TAB_ID_NONE) {
    recentTabs.set(tab.id, Date.now());
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  recentTabs.delete(tabId);
});

function isNewTab(tabId) {
  const createdAt = recentTabs.get(tabId);
  if (createdAt !== undefined && Date.now() - createdAt < NEW_TAB_GRACE_MS) {
    recentTabs.delete(tabId);
    return true;
  }
  return false;
}

/* ------------------------------------------------------------------ *
 * Navigation interception
 * ------------------------------------------------------------------ */

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return;
  if (!hasMarker(details.url)) return;

  const cleanUrl = stripMarker(details.url);

  if (isNewTab(details.tabId)) {
    // Middle/ctrl-click already opened a fresh tab for this bookmark (which the
    // 204 rule would otherwise blank). Load the real page there instead.
    chrome.tabs.update(details.tabId, { url: cleanUrl }).catch(logError);
  } else {
    // Left-click in an existing tab: the 204 redirect keeps that tab where it
    // is, so open the real page in a new tab.
    chrome.tabs
      .create({ url: cleanUrl, active: !openInBackground })
      .catch(logError);
  }
});

/* ------------------------------------------------------------------ *
 * Bookmark marker management
 * ------------------------------------------------------------------ */

// Mark existing bookmarks on install/update and at browser startup. New and
// edited bookmarks are handled live by the listeners below.
chrome.runtime.onInstalled.addListener(markAllBookmarks);
chrome.runtime.onStartup.addListener(markAllBookmarks);

chrome.bookmarks.onCreated.addListener((_id, node) => maybeMark(_id, node.url));
chrome.bookmarks.onChanged.addListener((id, changeInfo) =>
  maybeMark(id, changeInfo.url),
);

async function markAllBookmarks() {
  await ready;
  if (!markingEnabled || markingSuspended) return 0;
  try {
    const tree = await chrome.bookmarks.getTree();
    const updates = [];
    walkBookmarks(tree, (node) => {
      if (node.url && shouldMark(node.url)) {
        updates.push([node.id, addMarker(node.url)]);
      }
    });
    for (const [id, url] of updates) {
      await chrome.bookmarks.update(id, { url }).catch(() => {});
    }
    return updates.length;
  } catch (err) {
    logError(err);
    return 0;
  }
}

// Marking a bookmark fires onChanged again, but the marked URL no longer
// satisfies shouldMark(), so this does not loop.
async function maybeMark(id, url) {
  await ready;
  if (!markingEnabled || markingSuspended) return;
  if (url && shouldMark(url)) {
    chrome.bookmarks.update(id, { url: addMarker(url) }).catch(() => {});
  }
}

function walkBookmarks(nodes, fn) {
  for (const node of nodes) {
    fn(node);
    if (node.children) walkBookmarks(node.children, fn);
  }
}

/* ------------------------------------------------------------------ *
 * Settings messages (from the popup)
 * ------------------------------------------------------------------ */

/**
 * While true, the bookmark listeners stop marking. Set during an uninstall so
 * unmarkAllBookmarks() isn't instantly undone by onChanged re-marking each
 * bookmark. The popup calls uninstallSelf itself (it needs a user gesture); if
 * that fails it sends "resumeMarking" to restore normal operation.
 */
let markingSuspended = false;

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "prepareUninstall") {
    prepareUninstall()
      .then(() => sendResponse({ ok: true }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }));
    return true; // keep the message channel open for the async response
  }
  if (message?.type === "resumeMarking") {
    markingSuspended = false;
    markAllBookmarks().finally(() => sendResponse({ ok: true }));
    return true;
  }
  if (message?.type === "setMarking") {
    setMarking(message.enabled === true)
      .then((count) => sendResponse({ ok: true, count }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }));
    return true;
  }
  return undefined; // not ours
});

/**
 * Turn the whole new-tab behavior on or off. Persists the choice, then either
 * marks every eligible bookmark or strips the markers back off. The flag is set
 * before the bookmark updates so the onChanged listener doesn't fight them.
 * Returns how many bookmarks changed.
 */
async function setMarking(enabled) {
  markingEnabled = enabled;
  await chrome.storage.local.set({ [MARKING_KEY]: enabled }).catch(() => {});
  return enabled ? markAllBookmarks() : unmarkAllBookmarks();
}

/**
 * Restore every bookmark to its original URL and clear stored settings, in
 * preparation for the popup uninstalling the extension. Marking is suspended
 * first so the unmark sticks (see markingSuspended).
 */
async function prepareUninstall() {
  markingSuspended = true;
  await unmarkAllBookmarks();
  await chrome.storage.local.clear().catch(() => {});
}

/**
 * Escape hatch: removes BookmarkUp's marker from every bookmark, restoring the
 * original URLs. Run `bookmarkupUnmarkAll()` from the service-worker console to
 * revert. Returns the number of bookmarks changed.
 */
async function unmarkAllBookmarks() {
  const tree = await chrome.bookmarks.getTree();
  const updates = [];
  walkBookmarks(tree, (node) => {
    if (node.url && hasMarker(node.url)) {
      updates.push([node.id, stripMarker(node.url)]);
    }
  });
  for (const [id, url] of updates) {
    await chrome.bookmarks.update(id, { url }).catch(() => {});
  }
  console.info(`BookmarkUp: unmarked ${updates.length} bookmark(s)`);
  return updates.length;
}
globalThis.bookmarkupUnmarkAll = unmarkAllBookmarks;

function logError(err) {
  console.error("BookmarkUp:", err);
}
