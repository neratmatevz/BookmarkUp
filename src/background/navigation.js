/**
 * Navigation interception: turns a marked bookmark click into a new tab, or the
 * current tab for same-site / same-tab-engine behavior, without disturbing the
 * page the user is on. See service-worker.js for the marker + 204 mechanism.
 */

import { hasMarker, stripMarker } from "../shared/url.js";
import { matchEngine } from "../shared/search-engines.js";
import { KEYS, NEW_TAB_GRACE_MS } from "../shared/constants.js";
import { state } from "./state.js";
import { logError } from "./util.js";

/* ------------------------------------------------------------------ *
 * New-tab detection
 * ------------------------------------------------------------------ */

/**
 * Recently created tabs (tabId -> createdAt ms). A bookmark opened via
 * middle/ctrl-click lands in a brand-new tab; that tab should become the
 * bookmark itself rather than spawning a second tab.
 */
const recentTabs = new Map();

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.id !== undefined && tab.id !== chrome.tabs.TAB_ID_NONE) {
    recentTabs.set(tab.id, Date.now());
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  recentTabs.delete(tabId);
});

function isNewTab(tabId) {
  const createdAt = recentTabs.get(tabId);
  if (createdAt !== undefined && Date.now() - createdAt < NEW_TAB_GRACE_MS) {
    recentTabs.delete(tabId);
    return true;
  }
  return false;
}

/* ------------------------------------------------------------------ *
 * Interception
 * ------------------------------------------------------------------ */

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return;
  if (hasMarker(details.url)) {
    handleMarkedNavigation(details);
    return;
  }
  // Clean URLs (no marker) are normal navigation, so forget any recent tab
  if (/^https?:/i.test(details.url)) {
    recentTabs.delete(details.tabId);
  }
});

async function handleMarkedNavigation(details) {
  const cleanUrl = stripMarker(details.url);

  if (isNewTab(details.tabId)) {
    // Middle/ctrl-click already opened a fresh tab for this bookmark (which the
    // 204 rule would otherwise blank). Load the real page there instead.
    chrome.tabs.update(details.tabId, { url: cleanUrl }).catch(logError);
    return;
  }

  // Left-click in an existing tab: the 204 redirect keeps that tab put, so we
  // normally open the real page in a new tab. But same-site behavior or a
  // search engine set to same-tab can send it to the current tab instead.
  if (await shouldOpenInCurrentTab(details.tabId, cleanUrl)) {
    chrome.tabs.update(details.tabId, { url: cleanUrl }).catch(logError);
  } else {
    chrome.tabs
      .create({ url: cleanUrl, active: !state.openInBackground })
      .catch(logError);
  }
}

/**
 * True when the clicked bookmark should load in the current tab rather than a
 * new one - either the bookmark is for the same domain the tab is already on
 * (same-site behavior), or that domain is a search engine set to same-tab.
 * Reads the current tab once and checks both.
 */
async function shouldOpenInCurrentTab(tabId, cleanUrl) {
  if (!state.sameSite && state.sameTabEngines.size === 0) return false;
  try {
    const tab = await chrome.tabs.get(tabId);
    if (!tab?.url) return false;
    const currentHost = new URL(tab.url).hostname;

    // Same-site: the bookmark's destination is the domain we're already on.
    if (state.sameSite) {
      try {
        const bookmarkHost = new URL(cleanUrl).hostname;
        if (baseHost(bookmarkHost) === baseHost(currentHost)) return true;
      } catch {
        /* unparseable bookmark URL - fall through to the engine check */
      }
    }

    // Search engine the user set to open bookmarks in the same tab.
    if (state.sameTabEngines.size > 0) {
      const engine = matchEngine(currentHost);
      if (engine && state.sameTabEngines.has(engine.id)) return true;
    }

    return false;
  } catch {
    return false;
  }
}

/** Hostname normalized for same-site comparison: lowercased, "www." dropped. */
function baseHost(hostname) {
  return hostname.toLowerCase().replace(/^www\./, "");
}

/**
 * Set whether a search engine opens bookmarks in a new tab (default) or the
 * same tab. Navigation-only, so nothing to reconcile. Invoked from messages.js.
 */
export async function setSearchEngine(id, newTab) {
  if (newTab) state.sameTabEngines.delete(id);
  else state.sameTabEngines.add(id);
  await chrome.storage.local
    .set({ [KEYS.sameTabEngines]: [...state.sameTabEngines] })
    .catch(() => {});
}
