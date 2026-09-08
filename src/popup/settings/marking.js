/**
 * Master "Bookmark bar functionality" toggle - the switch over the per-bookmark
 * grid. Turning it on/off asks the service worker to re-mark or unmark every
 * bookmark (the SW is the single writer); turning it on also clears every
 * per-bookmark opt-out.
 */

import { KEYS, MSG } from "../../shared/constants.js";
import { els } from "../dom.js";
import { marking } from "./marking-state.js";
import { refreshPerBookmark } from "./per-bookmark.js";

export async function initMarking() {
  const [enabled, optedOut] = await Promise.all([loadEnabled(), loadOptedOut()]);
  marking.optedOut = optedOut;
  updateMarkingUI(enabled);
  els.markingToggle.addEventListener("click", onMarkingToggle);
}

/** Reflect the current marking state in the button, heading, and hint. */
function updateMarkingUI(enabled) {
  marking.enabled = enabled;

  // Button label is the action; colour it to match (blue = turn on, red = off).
  els.markingToggle.textContent = enabled ? "Turn OFF" : "Turn ON";
  els.markingToggle.classList.toggle("btn-red", enabled);
  els.markingToggle.classList.toggle("btn-blue", !enabled);

  // Coloured ON/OFF word sits in the setting's heading.
  els.markingState.textContent = enabled ? "ON" : "OFF";
  els.markingState.className = enabled ? "state-on" : "state-off";

  els.markingHint.textContent = enabled
    ? "Left-click a bookmark to open it in a new tab."
    : "Bookmarks open in the current tab, default behavior.";

  // Keep the nested per-bookmark switches in sync with the master.
  refreshPerBookmark();
}

/**
 * Toggle the new-tab behavior. The service worker persists the choice and
 * either strips the markers from every bookmark or re-applies them.
 */
async function onMarkingToggle() {
  const next = !marking.enabled;
  els.markingToggle.disabled = true;
  try {
    const res = await chrome.runtime.sendMessage({
      type: MSG.setMarking,
      enabled: next,
    });
    if (!res || res.ok !== true) {
      throw new Error(res?.error || "Could not update bookmarks.");
    }
    // Turning the master on re-includes every bookmark (SW cleared the set).
    if (next) marking.optedOut.clear();
    updateMarkingUI(next);
  } catch (err) {
    // Leave the UI on the previous state; nothing changed on failure.
    console.error("BookmarkUp:", err);
  } finally {
    els.markingToggle.disabled = false;
  }
}

async function loadEnabled() {
  try {
    const stored = await chrome.storage.local.get(KEYS.markingEnabled);
    return stored[KEYS.markingEnabled] !== false; // default on
  } catch {
    return true;
  }
}

async function loadOptedOut() {
  try {
    const stored = await chrome.storage.local.get(KEYS.optedOut);
    const list = stored[KEYS.optedOut];
    return new Set(Array.isArray(list) ? list : []);
  } catch {
    return new Set();
  }
}
