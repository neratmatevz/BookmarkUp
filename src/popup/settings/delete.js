/**
 * Delete-extension flow: a two-step confirm, then restore bookmarks + clear
 * storage (via the service worker) and uninstall. uninstallSelf must run in a
 * user-gesture context, which a click handler has but a message handler does
 * not, so it is called here in the popup rather than the service worker.
 */

import { MSG } from "../../shared/constants.js";
import { els, setSettingsStatus } from "../dom.js";

let armed = false;

export function initDelete() {
  els.deleteData.addEventListener("click", onDeleteData);
  els.deleteCancel.addEventListener("click", resetDelete);
}

/** Return the button to its safe, un-armed state. Also called when settings open. */
export function resetDelete() {
  armed = false;
  els.deleteData.disabled = false;
  els.deleteData.classList.remove("armed");
  els.deleteCancel.hidden = true;
  els.deleteConfirm.hidden = true;
  els.deleteData.textContent = "Delete extension";
  setSettingsStatus("");
}

async function onDeleteData() {
  // First click arms: the button turns solid red and a back arrow appears to
  // cancel. A second click on the red button performs the delete.
  if (!armed) {
    armed = true;
    els.deleteData.classList.add("armed");
    els.deleteData.textContent = "Yes, delete extension";
    els.deleteCancel.hidden = false;
    els.deleteConfirm.hidden = false;
    return;
  }

  els.deleteData.disabled = true;
  els.deleteCancel.hidden = true;
  els.deleteConfirm.hidden = true;
  els.deleteData.textContent = "Removing…";
  setSettingsStatus("Restoring bookmarks and clearing data…");

  try {
    // Restore original bookmark URLs and clear stored settings first — once the
    // extension is uninstalled below, this code can no longer run.
    const res = await chrome.runtime.sendMessage({ type: MSG.prepareUninstall });
    if (!res || res.ok !== true) {
      throw new Error(res?.error || "Could not restore bookmarks.");
    }

    await chrome.management.uninstallSelf({ showConfirmDialog: false });
    // Not reached on success: the extension (and this popup) is gone by now.
    throw new Error("Uninstall did not complete.");
  } catch (err) {
    // Uninstall failed or was blocked — bring the markers back so BookmarkUp
    // keeps working, and tell the user what happened.
    chrome.runtime.sendMessage({ type: MSG.resumeMarking }).catch(() => {});
    console.error("BookmarkUp:", err);
    resetDelete();
    setSettingsStatus(`Couldn't remove the extension: ${err.message}`);
  }
}
