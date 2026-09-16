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

  initCarousel();
}

/* --------------------------------------------------------------- carousel */

function initCarousel() {
  const root = document.getElementById("carousel");
  const track = root?.querySelector(".car-track");
  const slides = root ? Array.from(root.querySelectorAll(".car-slide")) : [];
  const dotsWrap = document.getElementById("car-dots");
  if (!root || !track || slides.length === 0) return;

  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbDotsWrap = document.getElementById("lb-dots");
  let index = 0;
  let lastFocus = null;

  const makeDots = (container, cls) =>
    slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = cls;
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Image ${i + 1} of ${slides.length}`);
      dot.addEventListener("click", () => go(i));
      container?.append(dot);
      return dot;
    });
  const dots = makeDots(dotsWrap, "car-dot");
  const lbDots = lbDotsWrap ? makeDots(lbDotsWrap, "lb-dot") : [];

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    for (const set of [dots, lbDots]) {
      set.forEach((dot, di) => dot.setAttribute("aria-selected", String(di === index)));
    }
    if (lightbox && lbImg && !lightbox.hidden) {
      lbImg.src = slides[index].src;
      lbImg.alt = slides[index].alt;
    }
  }

  root.querySelector(".car-prev")?.addEventListener("click", () => go(index - 1));
  root.querySelector(".car-next")?.addEventListener("click", () => go(index + 1));
  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") go(index - 1);
    else if (event.key === "ArrowRight") go(index + 1);
  });

  /* ------- Lightbox ------- */
  if (lightbox && lbImg) {
    const open = (i) => {
      lastFocus = document.activeElement;
      go(i);
      lbImg.src = slides[index].src;
      lbImg.alt = slides[index].alt;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      lightbox.querySelector(".lb-close")?.focus();
    };
    const close = () => {
      lightbox.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    };

    slides.forEach((slide, i) => slide.addEventListener("click", () => open(i)));
    lightbox.querySelector(".lb-prev")?.addEventListener("click", () => go(index - 1));
    lightbox.querySelector(".lb-next")?.addEventListener("click", () => go(index + 1));
    lightbox.querySelector(".lb-close")?.addEventListener("click", close);
    // Click on the dimmed backdrop (not the image or buttons) closes.
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });

    document.addEventListener("keydown", (event) => {
      if (lightbox.hidden) return;
      if (event.key === "Escape") close();
      else if (event.key === "ArrowLeft") go(index - 1);
      else if (event.key === "ArrowRight") go(index + 1);
      else if (event.key === "Tab") {
        // Trap focus within the lightbox's buttons.
        const btns = lightbox.querySelectorAll("button");
        if (!btns.length) return;
        const first = btns[0];
        const last = btns[btns.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          last.focus();
          event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === last) {
          first.focus();
          event.preventDefault();
        }
      }
    });

    // Swipe left/right on touch.
    let startX = 0;
    lbImg.addEventListener("touchstart", (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
    lbImg.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  go(0);
}

init();
