/**
 * Same-site behavior toggle. When on, a bookmark for the domain the current tab
 * is already on opens in that tab instead of a new one. Navigation-only: the
 * popup just writes the preference and the service worker reads it via
 * storage.onChanged, so there's no message or reconcile.
 */

import { KEYS } from "../../shared/constants.js";
import { els } from "../dom.js";

export async function initSameSite() {
  els.sameSiteToggle.checked = await load();
  els.sameSiteToggle.addEventListener("change", onToggle);
}

function onToggle() {
  chrome.storage.local
    .set({ [KEYS.sameSite]: els.sameSiteToggle.checked })
    .catch(() => {
      /* preference is best-effort; ignore write failures */
    });
}

async function load() {
  try {
    const stored = await chrome.storage.local.get(KEYS.sameSite);
    return stored[KEYS.sameSite] === true; // default off (new tab)
  } catch {
    return false;
  }
}
