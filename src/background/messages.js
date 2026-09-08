/**
 * Settings messages from the popup. Each handler returns true to keep the
 * message channel open for its async sendResponse.
 */

import { MSG } from "../shared/constants.js";
import {
  setMarking,
  setBookmarkMarking,
  prepareUninstall,
  resumeMarking,
} from "./marking.js";
import { setSearchEngine } from "./navigation.js";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === MSG.prepareUninstall) {
    prepareUninstall()
      .then(() => sendResponse({ ok: true }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }));
    return true;
  }
  if (message?.type === MSG.resumeMarking) {
    resumeMarking().finally(() => sendResponse({ ok: true }));
    return true;
  }
  if (message?.type === MSG.setMarking) {
    setMarking(message.enabled === true)
      .then((count) => sendResponse({ ok: true, count }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }));
    return true;
  }
  if (message?.type === MSG.setBookmarkMarking) {
    setBookmarkMarking(message.id, message.enabled === true)
      .then(() => sendResponse({ ok: true }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }));
    return true;
  }
  if (message?.type === MSG.setSearchEngine) {
    setSearchEngine(message.id, message.newTab === true)
      .then(() => sendResponse({ ok: true }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }));
    return true;
  }
  return undefined; // not ours
});
