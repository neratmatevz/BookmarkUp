# BookmarkUp

A tiny Chrome extension that opens any bookmark **in a new tab with a single
left click** — no middle-click, no `Ctrl`+click. Built for laptops where those
gestures are awkward on a touchpad.

It works two ways: an experimental **native bar mode** that intercepts clicks
on the browser's own bookmarks bar, and a **popup** you open from the toolbar.

## Native bar mode (experimental)

Extensions **cannot** change what the browser's built-in bookmarks bar does on
click — that bar is native UI with no click hook, and no extension API can
cancel the navigation it triggers. BookmarkUp works around this:

1. When you click a native bookmark, the browser reports the navigation with
   `transitionType === "auto_bookmark"`.
2. BookmarkUp opens that URL in a **new tab**…
3. …and sends the original tab **back** to the page it was on, via session
   history (usually an instant back/forward-cache restore).

The net effect: single left-click on a native bookmark opens it in a new tab.

**Trade-offs — read these:**

- There is a **brief flash**: the source tab starts loading the bookmark before
  bouncing back. With a foreground new tab (default) your focus has already
  moved, so it's mostly hidden; in *Background* mode it's visible.
- It applies to bookmarks opened from the **bar, the menu, and the bookmark
  manager** alike — the browser doesn't distinguish them.
- **Middle-click / Ctrl-click** (which already open a new tab) are detected and
  left untouched, so you won't get duplicates.
- Only top-frame `auto_bookmark` navigations are touched; ordinary browsing is
  untouched.

This mode needs the `webNavigation` permission (no host permissions).

## Popup

Click the toolbar icon (or press `Ctrl+Shift+U` / `⌘+Shift+U`) to open a popup
listing your bookmarks. Left-click one and it opens in a fresh tab.

## Features

- **One left click → new tab.** That's the whole point.
- **Background mode.** Flip the *Background* toggle to open bookmarks in a
  background tab and keep the popup open, so you can fire off several at once.
  The choice is remembered.
- **Live search** across bookmark titles and URLs.
- **Collapsible folders** mirroring your real bookmark structure.
- **Keyboard friendly.** Type to search, `Enter` opens the first match,
  `↑`/`↓` move through the list, `Esc` clears the search.
- **Light & dark** themes follow your system.

## Install (development / unpacked)

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked** and select this repository's root folder (the one
   containing `manifest.json`).
4. Pin **BookmarkUp** from the extensions menu for one-click access.

The extension loads straight from source — there is no build step.

### Test native bar mode

1. Make sure your bookmarks bar is visible (`Ctrl+Shift+B`) with a bookmark or
   two on it.
2. On any normal page, **left-click** a bookmark in the bar → it should open in
   a **new tab** while your original tab stays where it was.
3. **Middle-click** a bookmark → still opens one new tab (no duplicate).
4. If something misbehaves, open `chrome://extensions` → BookmarkUp →
   **service worker** → *Inspect* to see its console.

## Permissions & privacy

BookmarkUp requests the minimum it needs and **sends nothing anywhere** — there
are no network requests, no analytics, and no external servers. Everything runs
locally in the popup.

| Permission | Why |
| ---------- | --- |
| `bookmarks` | Read your bookmarks to list them. Never modified. |
| `storage`   | Remember the *Background* toggle (local only). |
| `favicon`   | Show each site's icon via Chrome's built-in favicon cache. |
| `webNavigation` | Detect native bookmark clicks (`auto_bookmark`) for native bar mode. |

No `host_permissions` and no `tabs` permission are requested: neither
`webNavigation` nor `chrome.tabs.create`/`goBack` requires access to your
browsing data.

## Security notes

- Bookmark titles and URLs are treated as untrusted input. The popup builds its
  DOM exclusively with `createElement` / `textContent` — never `innerHTML` — so
  a bookmark cannot inject markup or script into the UI.
- Before opening, each URL's scheme is checked against an allowlist
  (`http`, `https`, `ftp`, `file`, `chrome`, …). `javascript:`, `data:`, and
  other risky schemes are refused.
- Manifest V3's strict content security policy is used as-is; there is no inline
  script and no remote code.

## Project layout

```
manifest.json          # MV3 manifest (extension root)
src/popup/             # popup UI: html, css, js (ES module)
src/background/        # service worker: native bar interception
icons/                 # generated PNG icons (16/32/48/128)
tools/generate_icons.py# regenerates the icons from code
```

## Development

There is no build step — edit the source and reload the extension at
`chrome://extensions`.

To change the icons, edit `tools/generate_icons.py` and regenerate them:

```bash
pip install pillow
python tools/generate_icons.py
```

## License

[MIT](LICENSE)
