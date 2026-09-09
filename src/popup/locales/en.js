/**
 * English UI strings for the popup (the source-of-truth dictionary).
 * `$1`, `$2`, ... are positional placeholders filled by i18n.js `t()`.
 * Bookmark titles, folder names, and the user's search text are NOT here -
 * they are the user's own data and are never translated.
 */
export default {
  // Shell / chrome
  settings: "Settings",
  bookmarks: "Bookmarks",
  backLabel: "Back to bookmarks",
  backTitle: "Back",
  searchPlaceholder: "Search bookmarks…",
  searchLabel: "Search bookmarks",

  // General
  groupGeneral: "General",
  themeLabel: "Theme",
  themeSystem: "System",
  themeLight: "Light",
  themeDark: "Dark",
  languageLabel: "Language",
  languageSystem: "System",
  languageEnglish: "English",
  languageSlovenian: "Slovenščina",

  // Behavior
  groupBehavior: "Behavior",
  backgroundLabel: "Open in background",
  backgroundHint: "Bookmarks open without closing the extension popup",
  markingLabel: "Bookmark bar functionality",
  markingStateOn: "ON",
  markingStateOff: "OFF",
  markingTurnOn: "Turn ON",
  markingTurnOff: "Turn OFF",
  markingHintOn: "Left-click a bookmark to open it in a new tab.",
  markingHintOff: "Bookmarks open in the same tab, default behavior.",
  perBookmarkLabel: "Per bookmark",
  perBookmarkHint: "Override the switch above for individual bookmarks",
  perBookmarkEmpty: "No web bookmarks to configure.",
  perBookmarkItemAria: "New-tab behavior for $1",
  searchEngineLabel: "Search engine behavior",
  searchEngineHint: "On a search engine, on = new tab, off = same tab",
  engineItemAria: "Open bookmarks in a new tab on $1",
  sameSiteLabel: "Same-site in current tab",
  sameSiteHint:
    "When a bookmark points to the site you're already on, open it in same tab",

  // Delete extension
  deleteConfirm:
    "Are you sure? This restores your bookmarks and removes BookmarkUp - it can't be undone.",
  keepLabel: "Keep the extension",
  deleteButton: "Delete extension",
  deleteArmed: "Yes, delete extension",
  deleteRemoving: "Removing…",
  deleteRestoring: "Restoring bookmarks and clearing data…",
  deleteFailed: "Couldn't remove the extension: $1",

  // Status line / tree
  statusBookmarks: "$1 bookmarks",
  statusResultsZero: "0 results",
  statusResultOne: "$1 result",
  statusResultOther: "$1 results",
  statusResultsMax: "$1+ results",
  emptyNoBookmarks: "No bookmarks yet.",
  emptyNoMatches: "No matches.",
  untitledFolder: "Untitled folder",
  blockedUrl: "Blocked an unsupported link.",
  loadError: "Something went wrong loading bookmarks.",
};
