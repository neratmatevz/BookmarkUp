/**
 * Persisted preferences, cached in memory so the navigation and bookmark
 * listeners can read them synchronously. The service worker is the single
 * writer; the popup mirrors these and drives changes through messages.js.
 */

import { KEYS } from "../shared/constants.js";

export const state = {
  /** Open bookmarks in a background tab. */
  openInBackground: false,

  /**
   * Whether BookmarkUp marks bookmarks at all (default true). The master
   * "Bookmark bar functionality" switch flips this off: the markers are
   * stripped and the listeners stop re-applying them, so the bar behaves
   * natively until it is turned back on.
   */
  markingEnabled: true,

  /**
   * Bookmark ids the user has opted out of the new-tab behavior. An opted-out
   * bookmark is left unmarked so it behaves natively. Absence = opted in.
   */
  optedOut: new Set(),

  /**
   * Search-engine ids set to open bookmarks in the SAME tab. A bookmark clicked
   * while on one of these engines loads in the current tab instead of a new
   * one. Absence = new tab (the default).
   */
  sameTabEngines: new Set(),

  /**
   * Whether a bookmark for the domain the current tab is already on opens in
   * that tab instead of a new one (default false = new tab). Compared on the
   * full hostname (a leading "www." ignored), so only the exact same domain
   * counts, not other subdomains.
   */
  sameSite: false,

  /**
   * While true, the bookmark listeners stop marking. Set during an uninstall so
   * the unmark isn't instantly undone by onChanged re-marking each bookmark.
   * Not persisted.
   */
  markingSuspended: false,
};

/**
 * Resolves once the persisted preferences are loaded. Marking waits on this so
 * a startup sync can't act before we know the user's choices (the in-memory
 * defaults - marking on, nothing opted out - apply only until this settles).
 */
export const ready = chrome.storage.local
  .get([
    KEYS.openInBackground,
    KEYS.markingEnabled,
    KEYS.optedOut,
    KEYS.sameTabEngines,
    KEYS.sameSite,
  ])
  .then((stored) => {
    state.openInBackground = stored[KEYS.openInBackground] === true;
    state.markingEnabled = stored[KEYS.markingEnabled] !== false; // default on
    state.optedOut = new Set(
      Array.isArray(stored[KEYS.optedOut]) ? stored[KEYS.optedOut] : [],
    );
    state.sameTabEngines = new Set(
      Array.isArray(stored[KEYS.sameTabEngines])
        ? stored[KEYS.sameTabEngines]
        : [],
    );
    state.sameSite = stored[KEYS.sameSite] === true;
  })
  .catch(() => {});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if (KEYS.openInBackground in changes) {
    state.openInBackground = changes[KEYS.openInBackground].newValue === true;
  }
  if (KEYS.markingEnabled in changes) {
    state.markingEnabled = changes[KEYS.markingEnabled].newValue !== false;
  }
  if (KEYS.optedOut in changes) {
    const next = changes[KEYS.optedOut].newValue;
    state.optedOut = new Set(Array.isArray(next) ? next : []);
  }
  if (KEYS.sameTabEngines in changes) {
    const next = changes[KEYS.sameTabEngines].newValue;
    state.sameTabEngines = new Set(Array.isArray(next) ? next : []);
  }
  if (KEYS.sameSite in changes) {
    state.sameSite = changes[KEYS.sameSite].newValue === true;
  }
});
