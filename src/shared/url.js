/**
 * Shared URL safety helpers, imported by both the popup and the service
 * worker so the allowlist can never drift between them.
 *
 * These are the user's own bookmarks, but we still allowlist schemes rather
 * than blocklist so that javascript:, data:, blob: and similar never get
 * opened via chrome.tabs.create.
 */

export const SAFE_SCHEMES = new Set([
  "http:",
  "https:",
  "ftp:",
  "file:",
  "chrome:",
  "chrome-extension:",
  "edge:",
  "about:",
]);

/** @param {string} raw */
export function isSafeUrl(raw) {
  try {
    return SAFE_SCHEMES.has(new URL(raw).protocol);
  } catch {
    return false;
  }
}
