# Chrome Web Store listing - BookmarkUp

Privacy policy URL: https://neratmatevz.github.io/BookmarkUp/privacy.html
Homepage URL: https://neratmatevz.github.io/BookmarkUp/
Category: Productivity
Language: English (primary)

---

## Short summary (<= 132 characters)

Open any bookmark in a new tab with one left click - your current tab stays put. Free, private, no tracking.

---

## Detailed description

BookmarkUp turns a plain left click on a bookmark into a new tab, and leaves the
tab you are on exactly as it was - same page, same scroll position, even text you
had typed but not yet submitted.

In every browser, left-clicking a bookmark replaces whatever you were doing in the
current tab. To get a new tab instead, you normally have to middle-click or
Ctrl+click, which is fiddly on a laptop trackpad. BookmarkUp flips the default so a
normal left click just works.

What you get:

- Left-click a bookmark to open it in a new tab, straight from your bookmarks bar.
  No new habits to learn.
- Your current tab is never disturbed - no reload, no flicker.
- Middle-click and Ctrl+click keep working exactly as before.
- A searchable popup (Ctrl+Shift+U) lists every bookmark: type to filter, arrow
  keys to move, Enter to open.
- Fine-grained control in Settings: turn the new-tab behavior on or off for the
  whole bar or per bookmark, keep search engines in the same tab, or reopen a
  bookmark in the current tab when it points to the site you are already on.
- Open in background mode, so you can queue several bookmarks at once.
- Light, dark, or system theme, and an interface available in 12 languages.
- An About panel with the version and quick links.

Privacy first: no accounts, no tracking, no analytics. Your bookmarks never leave
your device. BookmarkUp is free and open source.

---

## Single purpose

BookmarkUp opens bookmarks in a new tab with a single left click, without
disturbing the tab you are currently on.

---

## Permission justifications

Paste each into the matching box in the Privacy practices tab.

**bookmarks**
Required to read the user's bookmarks so the extension can list them in the
toolbar popup, open them, and apply or remove the small invisible marker that
enables the new-tab behavior. It also restores the original bookmark URLs when the
behavior is turned off or the extension is removed. Bookmarks are used only locally
on the device and are never transmitted.

**storage**
Used to save the user's own settings (theme, language, and the new-tab behavior
toggles) in local extension storage so they persist between sessions. No personal
data is stored.

**favicon**
Used to display each site's small icon next to bookmarks and search engines in the
popup, via Chrome's built-in _favicon endpoint.

**webNavigation**
The extension listens for navigations to its own marked bookmark URLs so that, at
the moment a marked bookmark is activated, it can cancel the placeholder navigation
and open the real page in a new tab (or, if the user enabled it, the same tab). It
does not observe or record general browsing.

**declarativeNetRequest**
A single static rule redirects an activated marked-bookmark request to an empty
page that returns HTTP 204. That empty response is what stops the user's current
tab from navigating while the real page opens in a new tab. The rule matches only
the extension's own marker and does not read or modify any other requests.

**host permissions (<all_urls>)**
Broad host access is required because a bookmark can point to any website, so the
extension must be able to (a) redirect the marked request to the 204 placeholder
and open the real URL on any domain, and (b) when the same-tab or search-engine
options are enabled, read the address of the current tab to decide whether to open
in the same tab. Page contents are never read; only the URL of the active tab is
checked, and only at the moment a bookmark is clicked. No data leaves the device.

**Remote code**
No. All code is bundled in the extension package; the extension loads and executes
no remote or externally hosted code.

---

## Data usage disclosures (Privacy practices form)

- Data collected: none. BookmarkUp does not collect or transmit any user data.
- Certify: not sold to third parties.
- Certify: not used or transferred for purposes unrelated to the item's single
  purpose.
- Certify: not used or transferred to determine creditworthiness or for lending.
