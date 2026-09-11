# Contributing to BookmarkUp

Thanks for taking the time to contribute! BookmarkUp is a small, dependency-free
Manifest V3 extension for Chromium browsers.

## Ways to contribute

- **Report a bug** - open a [Bug report](../../issues/new/choose).
- **Suggest a feature** - open a [Feature request](../../issues/new/choose).
- **Add or fix a translation** - see [Translations](#translations) below.
- **Send a code change** - fork, branch, and open a pull request (see [Workflow](#workflow)).
- **Ask a question / share an idea** - use [Discussions](../../discussions), not the issue tracker.

## Development setup

There is **no build step**. The extension is vanilla JavaScript (ES modules),
HTML, and CSS.

1. Fork and clone the repo.
2. Open your browser's extensions page.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the repo root (the folder with `manifest.json`).
5. After editing files, click the **reload** icon on the extension card. Changes
   to the service worker or `manifest.json` always need a reload; popup-only
   changes just need the popup reopened.

Requires Chromium 116+.

## Project layout

```
manifest.json          extension manifest
_locales/<lang>/        manifest strings (native chrome.i18n: name, description, tooltip)
icons/                  app + search-engine icons
src/
  background/           service worker, split into modules
    service-worker.js     entry (imports the rest; registers listeners)
    state.js              cached preferences (+ storage.onChanged)
    navigation.js         marked-navigation interception
    marking.js            bookmark marker reconciler + settings actions
    messages.js           popup -> SW message router
  popup/
    popup.html, popup.js  popup entry
    dom.js                shared element refs + helpers
    tree.js               bookmark tree + search
    i18n.js               popup translation runtime
    locales/<lang>.js     popup UI translations
    settings/             one module per setting
    styles/               base.css / main.css / settings.css
  shared/                 constants, URL helpers, search-engine list
  rules/                  declarativeNetRequest rule (the 204 redirect)
```

The core mechanism (marker + HTTP 204) is documented at the top of
`src/background/service-worker.js` - worth reading before touching navigation.

## Workflow

1. Create a branch off `main` using the project convention:
   - `feat/<short-description>` - a new feature
   - `fix/<short-description>` - a bug fix
   - `style/<short-description>` - visual/CSS only
   - `chore/<short-description>` - fits neither above
2. Make your change; keep commits focused.
3. Open a pull request against `main`. `main` is protected, so all changes land
   through PRs.
4. A maintainer reviews and merges. PRs also get a SonarQube Cloud quality-gate
   check that a maintainer triggers, it must pass before
   merge.

Versioning and releases are handled by the maintainer - please **do not** bump
`manifest.json` `version` or add release notes in a PR.

## Translations

Translations are very welcome. English (`src/popup/locales/en.js`) is the source
of truth; every other locale mirrors its keys. Missing keys fall back to English,
so partial translations are fine, but please try to cover as many keys as possible.

To add a language in a PR:

1. Copy `src/popup/locales/en.js` to `src/popup/locales/<code>.js` and translate
   the values. Keep the keys unchanged and keep `$1`, `$2` placeholders in place.
   Language names (e.g. `languageGerman`) stay written in their own language.
2. Register it in `src/popup/i18n.js`: import the file, add it to `DICTS` and
   `SUPPORTED`. If the language is right-to-left, also add its code to `RTL`.
3. Add a `language<Name>` key to **every** locale file, and an `<option>` for it
   in the Language dropdown in `src/popup/popup.html`.
4. Optional: localize the manifest strings by adding
   `_locales/<code>/messages.json` (keys `appDesc`, `actionTitle`, `commandOpen`).

Not comfortable with the code part? Just open a **Translation** issue with the
translated strings and a maintainer will wire them up.

## Testing

There is no automated test suite yet - please test manually with the extension
loaded unpacked:

- Open the popup, search, and open a bookmark (both foreground and background).
- Middle-click a bookmark (should open in its own new tab).
- Toggle the settings you touched.
- Check both **light** and **dark** themes.
- If you touched UI strings, check at least one non-English language.

## Code style

- Match the surrounding code; avoid dependencies, no build tooling.
- Treat bookmark titles and URLs as untrusted: build DOM with
  `createElement` / `textContent`, **not** `innerHTML`.
- If you add or change a user-facing string, route it through the i18n layer
  (a `data-i18n` attribute or `t("key")`) and add the key to `en.js`.

By contributing, you agree that your contributions are licensed under the
project's [MIT License](LICENSE).
