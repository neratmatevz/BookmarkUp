/**
 * Theme setting (System / Light / Dark). Applied by toggling data-theme on
 * <html>; the CSS does the rest. The choice persists across sessions.
 */

import { KEYS } from "../../shared/constants.js";
import { els } from "../dom.js";

const THEMES = new Set(["system", "light", "dark"]);

export async function initTheme() {
  const theme = await load();
  applyTheme(theme);
  els.themeSelect.value = theme;
  els.themeSelect.addEventListener("change", onThemeChange);
}

/** Apply a theme by toggling data-theme on <html>; CSS does the rest. */
function applyTheme(theme) {
  if (theme === "light" || theme === "dark") {
    document.documentElement.dataset.theme = theme;
  } else {
    delete document.documentElement.dataset.theme;
  }
}

function onThemeChange() {
  const theme = THEMES.has(els.themeSelect.value)
    ? els.themeSelect.value
    : "system";
  applyTheme(theme);
  chrome.storage.local.set({ [KEYS.theme]: theme }).catch(() => {
    /* best-effort */
  });
}

async function load() {
  try {
    const stored = await chrome.storage.local.get(KEYS.theme);
    const value = stored[KEYS.theme];
    return THEMES.has(value) ? value : "system";
  } catch {
    return "system";
  }
}
