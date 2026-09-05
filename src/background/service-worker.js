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
 *      (see syncAllBookmarks / the chrome.bookmarks listeners below). Bookmarks
 *      the user opts out of, individually or globally, are left unmarked.
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
import { matchEngine } from "../shared/search-engines.js";

const STORAGE_KEY = "openInBackground";
const MARKING_KEY = "markingEnabled";
const OPTOUT_KEY = "optedOut";
const SAMETAB_KEY = "sameTabEngines";
const SAMESITE_KEY = "sameSite";
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

/**
 * Bookmark ids the user has opted out of the new-tab behavior (persisted). An
 * opted-out bookmark is left unmarked so it behaves natively. Absence = opted
 * in (the default).
 */
let optedOut = new Set();

/**
 * Search-engine ids the user set to open bookmarks in the SAME tab (persisted).
 * A bookmark clicked while on one of these engines loads in the current tab
 * instead of a new one. Absence = new tab (the default).
 */
let sameTabEngines = new Set();

/**
 * Whether a bookmark for the domain the current tab is already on opens in that
 * tab instead of a new one (persisted, default false = new tab). Compared on
 * the full hostname — only the exact same domain counts, not other domains or
 * subdomains.
 */
let sameSite = false;

// Resolves once the persisted preferences are loaded. Marking waits on this so
// a startup sync can't act before we know the user's choices (the defaults in
// memory — marking on, nothing opted out — apply only until this settles).
const ready = chrome.storage.local
  .get([STORAGE_KEY, MARKING_KEY, OPTOUT_KEY, SAMETAB_KEY, SAMESITE_KEY])
  .then((stored) => {
    openInBackground = stored[STORAGE_KEY] === true;
    markingEnabled = stored[MARKING_KEY] !== false; // default on
    optedOut = new Set(
      Array.isArray(stored[OPTOUT_KEY]) ? stored[OPTOUT_KEY] : [],
    );
    sameTabEngines = new Set(
      Array.isArray(stored[SAMETAB_KEY]) ? stored[SAMETAB_KEY] : [],
    );
    sameSite = stored[SAMESITE_KEY] === true;
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
  if (OPTOUT_KEY in changes) {
    const next = changes[OPTOUT_KEY].newValue;
    optedOut = new Set(Array.isArray(next) ? next : []);
  }
  if (SAMETAB_KEY in changes) {
    const next = changes[SAMETAB_KEY].newValue;
    sameTabEngines = new Set(Array.isArray(next) ? next : []);
  }
  if (SAMESITE_KEY in changes) {
    sameSite = changes[SAMESITE_KEY].newValue === true;
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
  handleMarkedNavigation(details);
});

async function handleMarkedNavigation(details) {
  const cleanUrl = stripMarker(details.url);

  if (isNewTab(details.tabId)) {
    // Middle/ctrl-click already opened a fresh tab for this bookmark (which the
    // 204 rule would otherwise blank). Load the real page there instead.
    chrome.tabs.update(details.tabId, { url: cleanUrl }).catch(logError);
    return;
  }

  // Left-click in an existing tab: the 204 redirect keeps that tab put, so we
  // normally open the real page in a new tab. But same-site behavior or a
  // search engine set to same-tab can send it to the current tab instead.
  if (await shouldOpenInCurrentTab(details.tabId, cleanUrl)) {
    chrome.tabs.update(details.tabId, { url: cleanUrl }).catch(logError);
  } else {
    chrome.tabs
      .create({ url: cleanUrl, active: !openInBackground })
      .catch(logError);
  }
}

/**
 * True when the clicked bookmark should load in the current tab rather than a
 * new one — either the bookmark is for the same domain the tab is already on
 * (same-site behavior), or that domain is a search engine set to same-tab.
 * Reads the current tab once and checks both.
 */
async function shouldOpenInCurrentTab(tabId, cleanUrl) {
  if (!sameSite && sameTabEngines.size === 0) return false;
  try {
    const tab = await chrome.tabs.get(tabId);
    if (!tab?.url) return false;
    const currentHost = new URL(tab.url).hostname;

    // Same-site: the bookmark's destination is the domain we're already on.
    // A leading "www." is ignored on both so youtube.com and www.youtube.com
    // count as the same site.
    if (sameSite) {
      try {
        const bookmarkHost = new URL(cleanUrl).hostname;
        if (baseHost(bookmarkHost) === baseHost(currentHost)) return true;
      } catch {
        /* unparseable bookmark URL — fall through to the engine check */
      }
    }

    // Search engine the user set to open bookmarks in the same tab.
    if (sameTabEngines.size > 0) {
      const engine = matchEngine(currentHost);
      if (engine && sameTabEngines.has(engine.id)) return true;
    }

    return false;
  } catch {
    return false;
  }
}

/** Hostname normalized for same-site comparison: lowercased, "www." dropped. */
function baseHost(hostname) {
  return hostname.toLowerCase().replace(/^www\./, "");
}

/* ------------------------------------------------------------------ *
 * Bookmark marker management
 * ------------------------------------------------------------------ */

// Reconcile all bookmarks on install/update and at browser startup. New and
// edited bookmarks are handled live by the listeners below.
chrome.runtime.onInstalled.addListener(syncAllBookmarks);
chrome.runtime.onStartup.addListener(syncAllBookmarks);

chrome.bookmarks.onCreated.addListener((id, node) => syncBookmark(id, node.url));
chrome.bookmarks.onChanged.addListener((id, changeInfo) =>
  syncBookmark(id, changeInfo.url),
);

/** True for the http/https bookmarks BookmarkUp can manage (mark or has marked). */
function isManageable(url) {
  return hasMarker(url) || shouldMark(url);
}

/**
 * The URL a bookmark should have given the current settings: marked when the
 * behavior is on and the bookmark isn't opted out, otherwise unmarked. Returns
 * the input unchanged for anything BookmarkUp doesn't manage.
 */
function targetUrl(id, url) {
  if (!isManageable(url)) return url;
  const wantMarked = markingEnabled && !optedOut.has(id);
  if (wantMarked) return hasMarker(url) ? url : addMarker(url);
  return hasMarker(url) ? stripMarker(url) : url;
}

/**
 * Bring every bookmark into line with the current settings. Used on
 * install/startup and whenever a global setting changes. Returns how many
 * bookmarks were rewritten.
 */
async function syncAllBookmarks() {
  await ready;
  if (markingSuspended) return 0;
  try {
    const tree = await chrome.bookmarks.getTree();
    const updates = [];
    walkBookmarks(tree, (node) => {
      if (!node.url) return;
      const next = targetUrl(node.id, node.url);
      if (next !== node.url) updates.push([node.id, next]);
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

// Bring a single bookmark into line. Rewriting it fires onChanged again, but the
// URL is now already at its target so targetUrl() returns it unchanged and this
// does not loop.
async function syncBookmark(id, url) {
  await ready;
  if (markingSuspended || !url) return;
  const next = targetUrl(id, url);
  if (next !== url) {
    chrome.bookmarks.update(id, { url: next }).catch(() => {});
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
    syncAllBookmarks().finally(() => sendResponse({ ok: true }));
    return true;
  }
  if (message?.type === "setMarking") {
    setMarking(message.enabled === true)
      .then((count) => sendResponse({ ok: true, count }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }));
    return true;
  }
  if (message?.type === "setBookmarkMarking") {
    setBookmarkMarking(message.id, message.enabled === true)
      .then(() => sendResponse({ ok: true }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }));
    return true;
  }
  if (message?.type === "setSearchEngine") {
    setSearchEngine(message.id, message.newTab === true)
      .then(() => sendResponse({ ok: true }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }));
    return true;
  }
  return undefined; // not ours
});

/**
 * Set whether a search engine opens bookmarks in a new tab (default) or the
 * same tab. Only affects navigation handling, so nothing to reconcile.
 */
async function setSearchEngine(id, newTab) {
  if (newTab) sameTabEngines.delete(id);
  else sameTabEngines.add(id);
  await chrome.storage.local
    .set({ [SAMETAB_KEY]: [...sameTabEngines] })
    .catch(() => {});
}

/**
 * Turn the whole new-tab behavior on or off — the master over the per-bookmark
 * switches. Turning it ON also clears every per-bookmark opt-out (so all the
 * individual switches turn on too); turning it OFF gates them all off. Persists
 * before syncing so the onChanged listener doesn't fight the updates. Returns
 * how many bookmarks changed.
 */
async function setMarking(enabled) {
  markingEnabled = enabled;
  const toStore = { [MARKING_KEY]: enabled };
  if (enabled) {
    optedOut.clear();
    toStore[OPTOUT_KEY] = [];
  }
  await chrome.storage.local.set(toStore).catch(() => {});
  return syncAllBookmarks();
}

/**
 * Opt a single bookmark in (enabled) or out of the new-tab behavior. Persists
 * the opt-out set first — before syncing the bookmark — so syncBookmark() sees
 * the new choice and doesn't undo it.
 */
async function setBookmarkMarking(id, enabled) {
  if (enabled) optedOut.delete(id);
  else optedOut.add(id);
  await chrome.storage.local
    .set({ [OPTOUT_KEY]: [...optedOut] })
    .catch(() => {});
  const [node] = await chrome.bookmarks.get(id).catch(() => []);
  if (node?.url) await syncBookmark(id, node.url);
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
