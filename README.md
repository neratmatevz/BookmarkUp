<div align="center">

<img src="icons/icon-128.png" width="96" height="96" alt="BookmarkUp" />

# BookmarkUp

**Open any bookmark in a new tab with a single left click.**

Built for laptops and touchpads, where middle-click and Ctrl+click are awkward.

</div>

---

## Why BookmarkUp?

In every browser, left-clicking a bookmark opens it **in your current tab** - replacing
whatever you were doing. Lost your scroll position. Lost the search you were half-way
through typing. To get a new tab instead, you have to middle-click or Ctrl+click, which
is fiddly on a trackpad.

BookmarkUp flips the default: **a plain left click opens the bookmark in a new tab, and
your current tab stays exactly as it was** - same page, same scroll position, even text
you'd typed but not yet submitted. Nothing is lost.

## What it does

- **Left-click a bookmark → new tab.** Works with the bookmarks you already have, right
  from your browser's bookmarks bar. No new habits to learn.
- **Your current tab is never disturbed.** BookmarkUp keeps the page you're on frozen in
  place - no reload, no flicker - so unsaved input and scroll position survive.
- **Middle-click still works** exactly as before.
- **A handy popup**, too. Click the BookmarkUp toolbar button (or press **Ctrl+Shift+U**)
  for a searchable list of all your bookmarks - click any to open it in a new tab.
- **Background mode.** Flip one switch in Settings and bookmarks open quietly in background
  tabs so you can line up several at once.
- **Search & keyboard-friendly.** Type to filter, arrow keys to move, Enter to open.
- **Light, dark, or system.** Pick a theme in Settings, or let it follow your system.
- **Built-in settings.** A gear in the popup opens a settings panel - choose your theme,
  toggle background mode, and, if you ever want to, cleanly remove the extension in one
  step (it restores your bookmarks first).

## How to use it

1. Click a bookmark on your bookmarks bar with a normal **left click**.
2. It opens in a **new tab** - and the tab you were on doesn't budge.

That's it. For a full, searchable list of your bookmarks, click the **BookmarkUp** icon in
the toolbar or press **Ctrl+Shift+U**.

## Settings

Open the popup and click the **⚙ gear** in the top corner (press **Esc** or the back arrow
to return to your bookmarks). Inside you'll find:

- **Theme** - **System**, **Light**, or **Dark**. Your choice is remembered.
- **Open in background** - when on, bookmarks open in a background tab so you stay on your
  current page while queueing up several.
- **Delete extension** - a clean way to back out completely. It restores your bookmarks to
  their original links, clears BookmarkUp's saved settings, and uninstalls the extension.
  It asks you to confirm first, so it can't happen by accident.

## Install

BookmarkUp is at **v1.1.0**. A public release on the **Chrome Web Store** is on the way - in
the meantime you can install it straight from GitHub:

1. Download `BookmarkUp-<version>.zip` from the [**latest release**](https://github.com/neratmatevz/BookmarkUp/releases/latest) and unzip it.
2. Open `chrome://extensions` (or `brave://extensions`) and turn on **Developer mode**
   (top-right).
3. Click **Load unpacked** and select the unzipped folder (the one containing
   `manifest.json`).
4. Pin BookmarkUp and start left-clicking your bookmarks.

Works in Chrome, Brave, and other Chromium-based browsers (version 116 or newer).

> Browsers show a "developer mode extensions" reminder on startup for anything installed
> this way; it disappears once BookmarkUp is on the Chrome Web Store.

## Privacy

BookmarkUp is built to respect you:

- **No accounts, no tracking, no analytics.** It doesn't collect, store, or sell any
  personal data.
- **Your bookmarks stay yours.** They're read to show and open them - never uploaded
  anywhere.

To open a bookmark without disturbing your current page, a click makes a single **empty,
no-content network request** (it carries none of your data and returns nothing).

## Good to know

To recognise which clicks are yours to handle, BookmarkUp adds a small, invisible tag to
your bookmark links. This keeps each bookmark pointing at the same website, so everything
keeps working normally - and it's fully reversible: **Delete extension** in Settings strips
the tags and restores your original bookmarks before it removes itself.

## License

BookmarkUp is released under the [MIT License](LICENSE) - free to use, modify, and share.