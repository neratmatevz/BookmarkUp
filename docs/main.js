import en from "./locales/en.js";
import sl from "./locales/sl.js";
import de from "./locales/de.js";
import fr from "./locales/fr.js";
import es from "./locales/es.js";
import hr from "./locales/hr.js";
import bs from "./locales/bs.js";
import sr from "./locales/sr.js";
import ru from "./locales/ru.js";
import hi from "./locales/hi.js";
import ar from "./locales/ar.js";
import zh from "./locales/zh.js";

const DICTS = { en, sl, de, fr, es, hr, bs, sr, ru, hi, ar, zh };
const SUPPORTED = ["en", "sl", "de", "fr", "es", "hr", "bs", "sr", "ru", "hi", "ar", "zh"];
const FALLBACK = "en";
// Right-to-left languages: the page flips to dir="rtl" for these.
const RTL = new Set(["ar"]);
let active = en;

/* ------------------------------------------------------------------ i18n */

function resolveSystemLang() {
  const langs = navigator.languages || [navigator.language || "en"];
  for (const l of langs) {
    const base = String(l).toLowerCase().split("-")[0];
    if (SUPPORTED.includes(base)) return base;
  }
  return FALLBACK;
}

function langPref() {
  try {
    return localStorage.getItem("lang") || "system";
  } catch {
    return "system";
  }
}

function setLang(pref) {
  const lang = SUPPORTED.includes(pref) ? pref : resolveSystemLang();
  active = DICTS[lang] || DICTS[FALLBACK];
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL.has(lang) ? "rtl" : "ltr";
}

function t(key) {
  return active[key] ?? en[key] ?? key;
}

function applyI18n(root = document) {
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

const THEME_ICONS = { system: "◐", light: "☀", dark: "☾" };
const THEME_KEYS = { system: "themeSystem", light: "themeLight", dark: "themeDark" };

/** Compose "<icon> <translated label>" into each theme option. */
function decorateThemeOptions() {
  const sel = document.getElementById("theme-select");
  if (!sel) return;
  for (const opt of sel.options) {
    opt.textContent = `${THEME_ICONS[opt.value] || ""} ${t(THEME_KEYS[opt.value] || "")}`.trim();
  }
}

/* ----------------------------------------------------------------- theme */

function themePref() {
  try {
    return localStorage.getItem("theme") || "system";
  } catch {
    return "system";
  }
}

function applyTheme(pref) {
  const root = document.documentElement;
  if (pref === "light" || pref === "dark") root.dataset.theme = pref;
  else delete root.dataset.theme;
}

/* ------------------------------------------------------------------ init */

function init() {
  applyTheme(themePref());
  const themeSel = document.getElementById("theme-select");
  if (themeSel) {
    themeSel.value = themePref();
    themeSel.addEventListener("change", () => {
      try {
        localStorage.setItem("theme", themeSel.value);
      } catch {
        /* ignore */
      }
      applyTheme(themeSel.value);
    });
  }

  const pref = langPref();
  setLang(pref);
  const sel = document.getElementById("lang-select");
  if (sel) {
    sel.value = pref;
    sel.addEventListener("change", () => {
      try {
        localStorage.setItem("lang", sel.value);
      } catch {
        /* ignore */
      }
      setLang(sel.value);
      applyI18n();
      decorateThemeOptions();
    });
  }
  applyI18n();
  decorateThemeOptions();

  for (const q of document.querySelectorAll(".faq-q")) {
    q.addEventListener("click", () => {
      const open = q.getAttribute("aria-expanded") === "true";
      q.setAttribute("aria-expanded", String(!open));
      const a = document.getElementById(q.getAttribute("aria-controls"));
      if (a) a.hidden = open;
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

init();
