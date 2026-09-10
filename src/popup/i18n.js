/**
 * Minimal UI internationalization for the popup.
 *
 * Chrome's built-in chrome.i18n picks the browser UI language and can't be
 * overridden at runtime, so a Language dropdown needs our own layer: we keep
 * per-language dictionaries and a stored `language` preference
 * ("system" | "en" | "sl") that the dropdown changes live. "system" resolves
 * to the best match among the user's accept-languages, falling back to English.
 *
 * Only BookmarkUp's own UI strings live here; the user's bookmarks and search
 * text are never translated.
 */

import en from "./locales/en.js";
import sl from "./locales/sl.js";
import de from "./locales/de.js";
import fr from "./locales/fr.js";
import es from "./locales/es.js";
import hr from "./locales/hr.js";
import sr from "./locales/sr.js";
import bs from "./locales/bs.js";
import ru from "./locales/ru.js";
import hi from "./locales/hi.js";
import ar from "./locales/ar.js";
import zh from "./locales/zh.js";

const DICTS = { en, sl, de, fr, es, hr, sr, bs, ru, hi, ar, zh };
const SUPPORTED = ["en", "sl", "de", "fr", "es", "hr", "sr", "bs", "ru", "hi", "ar", "zh"];
const FALLBACK = "en";

// Right-to-left languages: the popup flips to dir="rtl" for these.
const RTL = new Set(["ar"]);

let active = en;
let activeCode = FALLBACK;

/**
 * Resolve the "system" preference to a supported language via the user's
 * accept-languages order (e.g. ["en-US", "sl"] -> "en"), falling back to English.
 */
async function resolveSystem() {
  try {
    const langs = await chrome.i18n.getAcceptLanguages();
    for (const lang of langs || []) {
      const base = String(lang).toLowerCase().split("-")[0];
      if (SUPPORTED.includes(base)) return base;
    }
  } catch {
    /* fall through to the default */
  }
  return FALLBACK;
}

/**
 * Point the active dictionary at the given preference.
 * @param {"system"|"en"|"sl"} pref
 */
export async function setLanguage(pref) {
  const lang = SUPPORTED.includes(pref) ? pref : await resolveSystem();
  activeCode = DICTS[lang] ? lang : FALLBACK;
  active = DICTS[activeCode];
}

/** Text direction of the active language, for document.documentElement.dir. */
export function dir() {
  return RTL.has(activeCode) ? "rtl" : "ltr";
}

/**
 * Translate `key`, substituting $1..$n with `subs`. Falls back to the English
 * string for a key the active dictionary is missing, then to the key itself.
 */
export function t(key, ...subs) {
  let msg = active[key] ?? en[key] ?? key;
  subs.forEach((value, i) => {
    msg = msg.replaceAll(`$${i + 1}`, String(value));
  });
  return msg;
}

/**
 * Fill localized text under `root`:
 *   - [data-i18n="key"]            -> element.textContent
 *   - [data-i18n-attr="attr:key,..."] -> element attributes (aria-label, title, placeholder)
 */
export function applyStatic(root = document) {
  for (const el of root.querySelectorAll("[data-i18n]")) {
    el.textContent = t(el.dataset.i18n);
  }
  for (const el of root.querySelectorAll("[data-i18n-attr]")) {
    for (const pair of el.dataset.i18nAttr.split(",")) {
      const [attr, key] = pair.split(":").map((s) => s.trim());
      if (attr && key) el.setAttribute(attr, t(key));
    }
  }
}
