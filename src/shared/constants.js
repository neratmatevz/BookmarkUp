/**
 * Shared constants for BookmarkUp, imported by both the popup and the service
 * worker. Keeping the storage keys and message names in one place means the two
 * sides can never drift on a spelling: a mismatch here would silently break
 * marking or a settings toggle with no error.
 */

/** chrome.storage.local keys. */
export const KEYS = {
  openInBackground: "openInBackground",
  markingEnabled: "markingEnabled",
  optedOut: "optedOut",
  sameTabEngines: "sameTabEngines",
  sameSite: "sameSite",
  theme: "theme",
};

/** chrome.runtime.sendMessage `type` values (popup -> service worker). */
export const MSG = {
  prepareUninstall: "prepareUninstall",
  resumeMarking: "resumeMarking",
  setMarking: "setMarking",
  setBookmarkMarking: "setBookmarkMarking",
  setSearchEngine: "setSearchEngine",
};

/**
 * A tab created within this window (ms) of a marked navigation is treated as
 * the bookmark's own new tab (middle/ctrl-click), so it becomes the bookmark
 * rather than spawning a second tab.
 */
export const NEW_TAB_GRACE_MS = 2500;

/** Cap on rendered search results, to keep the popup responsive. */
export const MAX_SEARCH_RESULTS = 300;
