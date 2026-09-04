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

/**
 * Marker used to tag bookmarks that BookmarkUp manages. It is placed in the
 * URL's userinfo (username) slot — `https://example.com` becomes
 * `https://newtab@example.com` — which keeps the bookmark pointing at the same
 * site (so it still works if the extension is removed) while giving the
 * background redirect rule something to match on.
 */
export const MARKER_USERNAME = "newtab";

function isHttpProtocol(protocol) {
  return protocol === "http:" || protocol === "https:";
}

/** Only http/https bookmarks without existing credentials can carry the marker. */
export function shouldMark(raw) {
  try {
    const u = new URL(raw);
    return isHttpProtocol(u.protocol) && u.username === "";
  } catch {
    return false;
  }
}

/** @param {string} raw */
export function hasMarker(raw) {
  try {
    const u = new URL(raw);
    return u.username === MARKER_USERNAME && u.password === "";
  } catch {
    return false;
  }
}

/** Add the marker; returns the input unchanged if it can't/shouldn't be marked. */
export function addMarker(raw) {
  try {
    const u = new URL(raw);
    if (!isHttpProtocol(u.protocol) || u.username !== "") return raw;
    u.username = MARKER_USERNAME;
    return u.href;
  } catch {
    return raw;
  }
}

/** Remove the marker; returns the input unchanged if it isn't marked. */
export function stripMarker(raw) {
  try {
    const u = new URL(raw);
    if (u.username === MARKER_USERNAME && u.password === "") {
      u.username = "";
      return u.href;
    }
    return raw;
  } catch {
    return raw;
  }
}
