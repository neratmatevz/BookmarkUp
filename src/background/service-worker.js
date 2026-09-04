/**
 * BookmarkUp background service worker — experimental "native bar" mode.
 *
 * The browser's built-in bookmarks bar/menu/manager is native UI that an
 * extension cannot hook into directly. But when a bookmark is clicked, the
 * browser navigates the CURRENT tab to it and reports the navigation with
 * `transitionType === "auto_bookmark"`.
 *
 * Extensions cannot cancel that navigation, so we do the next best thing:
 *   1. detect the auto_bookmark navigation in the top frame,
 *   2. open the same URL in a NEW tab,
 *   3. send the original tab back to where it was (via session history, which
 *      usually restores instantly from the back/forward cache).
 *
 * Known trade-offs (see README): a brief flash as the source tab commits the
 * target before bouncing back; it applies to bookmarks opened from the bar,
 * the menu, and the bookmark manager alike; middle/ctrl-click (already opens a
 * new tab) is detected and left untouched.
 *
 * Only top-frame `auto_bookmark` navigations are ever touched — ordinary link
 * clicks, typed URLs, reloads, and history navigation are ignored.
 */

import { isSafeUrl } from "../shared/url.js";

const STORAGE_KEY = "openInBackground";

/**
 * Recently created tabs (tabId -> createdAt ms). A bookmark opened via
 * middle-click / ctrl-click / "open in new tab" lands in a brand-new tab, so
 * its first commit must NOT be bounced (that would open a second tab). Unlike
 * onCreatedNavigationTarget, chrome.tabs.onCreated fires for tabs opened from
 * the native bookmarks bar too, so it is the reliable signal.
 */
const recentTabs = new Map();
const NEW_TAB_GRACE_MS = 2500;

// Last committed top-frame URL per tab, tracked from webNavigation (which
// reports URLs without the "tabs" permission). Used to restore the source tab
// if goBack() has no history entry to return to.
const tabLastUrl = new Map();
const RESTORE_CHECK_MS = 400;

// Cached preference so onCommitted can react synchronously (less flash).
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

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.id !== undefined && tab.id !== chrome.tabs.TAB_ID_NONE) {
    recentTabs.set(tab.id, Date.now());
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  recentTabs.delete(tabId);
  tabLastUrl.delete(tabId);
});

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return;

  const { tabId, url, transitionType, transitionQualifiers } = details;
  const isBackForward = (transitionQualifiers || []).includes("forward_back");

  // The URL the tab was on before this commit — the page to restore to.
  const prevUrl = tabLastUrl.get(tabId);
  tabLastUrl.set(tabId, url);

  // A forward/back navigation (including our own goBack) is never a fresh
  // bookmark click, even if the history entry originated from a bookmark.
  if (
    transitionType === "auto_bookmark" &&
    !isBackForward &&
    isSafeUrl(url) &&
    !isNewTab(tabId)
  ) {
    handleNativeBookmark(tabId, url, prevUrl);
  }
});

function isNewTab(tabId) {
  // A bookmark opened straight into a brand-new tab (middle/ctrl-click, "open
  // in new tab") — the browser already made the tab, so it must not be bounced.
  const createdAt = recentTabs.get(tabId);
  if (createdAt !== undefined && Date.now() - createdAt < NEW_TAB_GRACE_MS) {
    recentTabs.delete(tabId);
    return true;
  }
  return false;
}

function handleNativeBookmark(sourceTabId, url, prevUrl) {
  // Open the bookmark where the user wanted it: a new tab.
  chrome.tabs
    .create({ url, active: !openInBackground })
    .catch((err) => console.error("BookmarkUp:", err));

  // Send the source tab back off the bookmark. goBack() restores the previous
  // page instantly from the back/forward cache when possible.
  chrome.tabs.goBack(sourceTabId).catch(() => {});

  // Safety net: if the tab had no history to go back to, goBack() is a no-op
  // and the tab is left sitting on the bookmark (which looks like a duplicate
  // tab). Shortly after, if it is still on the bookmark's site, restore the
  // page we recorded before the click.
  if (prevUrl && !sameOrigin(prevUrl, url)) {
    setTimeout(() => restoreIfStuck(sourceTabId, url, prevUrl), RESTORE_CHECK_MS);
  }
}

function restoreIfStuck(tabId, bookmarkUrl, prevUrl) {
  // If goBack() worked, a forward_back commit will have updated tabLastUrl to
  // the previous page. If the tab is still on the bookmark's site, goBack() was
  // a no-op (no history) and we navigate it back explicitly.
  const current = tabLastUrl.get(tabId);
  if (current && sameOrigin(current, bookmarkUrl)) {
    chrome.tabs.update(tabId, { url: prevUrl }).catch(() => {});
  }
}

function sameOrigin(a, b) {
  try {
    return new URL(a).origin === new URL(b).origin;
  } catch {
    return false;
  }
}
