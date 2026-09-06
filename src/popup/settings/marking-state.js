/**
 * Shared state for the new-tab behavior: the master on/off (`enabled`) and the
 * set of bookmark ids opted out of it. Both the master "Bookmark bar
 * functionality" toggle and the nested per-bookmark grid read and write this,
 * so it lives in one place. Mirrors what the service worker persists.
 */

export const marking = {
  enabled: true,
  /** @type {Set<string>} */
  optedOut: new Set(),
};
