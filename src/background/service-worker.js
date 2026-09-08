/**
 * BookmarkUp background service worker — "native bar" mode via the marker + 204
 * technique.
 *
 * The browser's built-in bookmarks bar can't be hooked directly, and an
 * extension can't cancel the navigation a bookmark click starts. So instead of
 * reacting after the fact, BookmarkUp makes the bookmark itself un-navigable:
 *
 *   1. Every managed http/https bookmark URL is rewritten to carry a marker in
 *      its userinfo — `https://example.com` -> `https://newtab@example.com`
 *      (see marking.js). Bookmarks the user opts out of, individually or
 *      globally, are left unmarked.
 *   2. A declarativeNetRequest rule (src/rules/newtab-204.json) redirects any
 *      main-frame request to a `newtab@` URL to an endpoint that returns HTTP
 *      204 No Content. Per the HTTP spec a 204 tells the browser to stay on the
 *      current document, so the current tab never navigates — no flash, no
 *      reload. The endpoint lives on a neutral host (gstatic.com), never a site
 *      the user might be viewing: a 204 on the current page's own origin (e.g.
 *      google.com while on Google) collides with it and breaks the stay-put.
 *   3. This worker sees the navigation attempt (webNavigation.onBeforeNavigate),
 *      strips the marker, and opens the real URL in a new tab (see navigation.js).
 *
 * Because only BookmarkUp's own bookmarks carry the marker, ordinary browsing
 * is never touched.
 *
 * This entry only wires the pieces together; the logic lives in the modules it
 * imports. They register their chrome.* listeners at import time, which runs
 * synchronously on service-worker startup as MV3 requires:
 *   - state.js       cached preferences (+ storage.onChanged)
 *   - navigation.js  intercept marked navigations, open new/current tab
 *   - marking.js     keep bookmark markers in sync with the settings
 *   - messages.js    handle settings messages from the popup
 */

import "./state.js";
import "./navigation.js";
import "./marking.js";
import "./messages.js";
