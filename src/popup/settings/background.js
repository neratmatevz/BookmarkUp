/**
 * "Open in background" preference: when on, bookmarks open in a background tab
 * so the popup stays put. Read live by the tree when opening a bookmark.
 */

import { KEYS } from "../../shared/constants.js";
import { els } from "../dom.js";

let openInBackground = false;

/** Current value, read by the tree at open time. */
export function isOpenInBackground() {
  return openInBackground;
}

export async function initBackground() {
  openInBackground = await load();
  els.backgroundToggle.checked = openInBackground;
  els.backgroundToggle.addEventListener("change", () => {
    openInBackground = els.backgroundToggle.checked;
    chrome.storage.local
      .set({ [KEYS.openInBackground]: openInBackground })
      .catch(() => {
        /* preference is best-effort; ignore write failures */
      });
  });
}

async function load() {
  try {
    const stored = await chrome.storage.local.get(KEYS.openInBackground);
    return stored[KEYS.openInBackground] === true;
  } catch {
    return false;
  }
}
