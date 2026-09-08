/**
 * Bookmark marker management. A reconciler keeps every managed bookmark marked
 * or unmarked to match the current settings; the master + per-bookmark toggles
 * and the uninstall restore drive it. The service worker is the single writer.
 */

import { addMarker, hasMarker, shouldMark, stripMarker } from "../shared/url.js";
import { KEYS } from "../shared/constants.js";
import { state, ready } from "./state.js";
import { logError } from "./util.js";

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
  const wantMarked = state.markingEnabled && !state.optedOut.has(id);
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
  if (state.markingSuspended) return 0;
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
  if (state.markingSuspended || !url) return;
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
 * Toggles + uninstall (invoked from messages.js)
 * ------------------------------------------------------------------ */

/**
 * Turn the whole new-tab behavior on or off - the master over the per-bookmark
 * switches. Turning it ON also clears every per-bookmark opt-out (so all the
 * individual switches turn on too); turning it OFF gates them all off. Persists
 * before syncing so the onChanged listener doesn't fight the updates. Returns
 * how many bookmarks changed.
 */
export async function setMarking(enabled) {
  state.markingEnabled = enabled;
  const toStore = { [KEYS.markingEnabled]: enabled };
  if (enabled) {
    state.optedOut.clear();
    toStore[KEYS.optedOut] = [];
  }
  await chrome.storage.local.set(toStore).catch(() => {});
  return syncAllBookmarks();
}

/**
 * Opt a single bookmark in (enabled) or out of the new-tab behavior. Persists
 * the opt-out set first - before syncing the bookmark - so syncBookmark() sees
 * the new choice and doesn't undo it.
 */
export async function setBookmarkMarking(id, enabled) {
  if (enabled) state.optedOut.delete(id);
  else state.optedOut.add(id);
  await chrome.storage.local
    .set({ [KEYS.optedOut]: [...state.optedOut] })
    .catch(() => {});
  const [node] = await chrome.bookmarks.get(id).catch(() => []);
  if (node?.url) await syncBookmark(id, node.url);
}

/**
 * Restore every bookmark to its original URL and clear stored settings, in
 * preparation for the popup uninstalling the extension. Marking is suspended
 * first so the unmark sticks (see state.markingSuspended).
 */
export async function prepareUninstall() {
  state.markingSuspended = true;
  await unmarkAllBookmarks();
  await chrome.storage.local.clear().catch(() => {});
}

/** Resume marking after a cancelled uninstall and re-sync every bookmark. */
export function resumeMarking() {
  state.markingSuspended = false;
  return syncAllBookmarks();
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
