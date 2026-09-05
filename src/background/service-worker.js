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
const NEW_TAB_GRACE_MS = 2500;

/**
 * Recently created tabs (tabId -> createdAt ms). A bookmark opened via
 * middle/ctrl-click lands in a brand-new tab; that tab should become the
 * bookmark itself rather than spawning a second tab.
 */
const recentTabs = new Map();

// Cached preference so onBeforeNavigate can react synchronously.
let openInBackground = false;

chrome.storage.local
  .get(STORAGE_KEY)
  .then((stored) => {
    openInBackground = stored[STORAGE_KEY] === true;
  })
  .catch(() => {});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && STORAGE_KEY in changes) {
    openInBackground = changes[STORAGE_KEY].newValue === true;
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
  if (markingSuspended) return;
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
  } catch (err) {
    logError(err);
  }
}

// Marking a bookmark fires onChanged again, but the marked URL no longer
// satisfies shouldMark(), so this does not loop.
function maybeMark(id, url) {
  if (markingSuspended) return;
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
  return undefined; // not ours
});

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
