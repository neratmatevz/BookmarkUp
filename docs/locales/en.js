/** English copy for the BookmarkUp site. Keys mirror across locales; missing
 *  keys fall back to English (see main.js). */
export default {
  // Meta / nav
  navFeatures: "Features",
  navHow: "How it works",
  navFaq: "FAQ",
  navGithub: "GitHub",
  themeLabel: "Theme",
  themeSystem: "System",
  themeLight: "Light",
  themeDark: "Dark",
  langLabel: "Language",

  // Hero
  heroTagline: "Open any bookmark in a new tab with a single left click.",
  heroSub:
    "A lightweight, private Manifest V3 extension for Chromium browsers. Your current tab never moves - same page, same scroll, even half-typed text.",
  ctaInstall: "Install",
  ctaGithub: "View on GitHub",
  heroNote: "Free and open source. No accounts, no tracking.",

  // Features
  featuresTitle: "What it does",
  f1Title: "Left-click, new tab",
  f1Body:
    "Works with the bookmarks you already have, right from the bookmarks bar. No new habits.",
  f2Title: "Your tab stays put",
  f2Body:
    "The page you are on is frozen in place - no reload, no flicker - so unsaved input and scroll survive.",
  f3Title: "Middle-click unchanged",
  f3Body: "Middle-click and Ctrl+click keep working exactly as before.",
  f4Title: "Searchable popup",
  f4Body:
    "A toolbar popup (Ctrl+Shift+U) lists every bookmark. Type to filter, arrow keys to move, Enter to open.",
  f5Title: "Fine-grained control",
  f5Body:
    "Toggle the new-tab behavior for the whole bar, per bookmark, per search engine, or for same-site links.",
  f6Title: "Themes and languages",
  f6Body:
    "Light, dark, or system theme, and a UI available in 12 languages that follows your browser.",

  // How it works
  howTitle: "How it works",
  howIntro:
    "The browser bar cannot be hooked directly, so BookmarkUp makes the bookmark itself un-navigable, then opens the real page for you.",
  how1Title: "1. Mark",
  how1Body:
    "Managed bookmark URLs get a tiny invisible marker. It keeps pointing at the same site and is fully reversible.",
  how2Title: "2. Stay put",
  how2Body:
    "A rule redirects a marked click to an empty page that returns HTTP 204, so your current tab never navigates.",
  how3Title: "3. Open",
  how3Body:
    "The extension sees the click, strips the marker, and opens the real page in a new tab.",

  // Screenshots
  shotsTitle: "Take a look",
  shotPopup: "The bookmark popup",
  shotSettings: "Settings",

  // Privacy
  privacyTitle: "Privacy first",
  privacy1: "No accounts, no tracking, no analytics. Nothing is collected or sold.",
  privacy2: "Your bookmarks are read only to show and open them, never uploaded.",
  privacy3:
    "Opening a bookmark makes a single empty, no-content network request that carries none of your data.",

  // Install
  installTitle: "Install",
  installIntro:
    "A Chrome Web Store release is on the way. In the meantime, install straight from GitHub:",
  install1: "Download the latest release ZIP and unzip it.",
  install2:
    "Open browser extensions site and turn on Developer mode.",
  install3: "Click Load unpacked and select the unzipped folder.",
  install4: "Pin BookmarkUp and start left-clicking your bookmarks.",
  installReq: "Works in Chromium browsers, version 116 or newer.",

  // FAQ
  faqTitle: "FAQ",
  q1: "Which browsers are supported?",
  a1: "Any Chromium-based browser (Chrome, Brave, Edge, and more) on version 116 or newer.",
  q2: "Does it change my bookmarks?",
  a2:
    "It adds a small invisible tag to bookmark links so it can recognise your clicks. It is fully reversible - removing the extension restores the originals first.",
  q3: "Is my data collected?",
  a3: "No. No accounts, tracking, or analytics. Your bookmarks never leave your machine.",
  q4: "Why open in a new tab at all?",
  a4:
    "So a left-click never loses the page you are on. You can also flip any bookmark, engine, or same-site link back to same-tab in Settings.",
  q5: "How do I remove it?",
  a5:
    "Use Delete extension in Settings - it restores your original bookmarks, clears saved settings, and uninstalls.",

  // Footer
  footerTagline: "Open any bookmark in a new tab with a single left click.",
  footerRepo: "Repository",
  footerIssues: "Issues",
  footerDiscussions: "Discussions",
  footerReleases: "Releases",
  footerSupport: "Support (Ko-fi)",
  footerLicense: "MIT License",
};
