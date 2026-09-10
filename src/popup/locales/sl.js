/**
 * Slovenian UI strings. Same keys as en.js; any key missing here falls back to
 * English (see i18n.js `t()`). Language names stay as endonyms.
 *
 * DRAFT - please review. Choices flagged for a native speaker:
 *   - markingStateOn/Off: "VKLOPLJENO"/"IZKLOPLJENO" (vs "VKLOP"/"IZKLOP").
 *   - Count strings use a colon format ("Zaznamki: $1", "Zadetki: $1") to avoid
 *     Slovenian's 4-form plural (1 / 2 / 3-4 / 5+), which the code doesn't model.
 *   - "Zadetki" for search hits (vs "Rezultati").
 */
export default {
  // Shell / chrome
  settings: "Nastavitve",
  bookmarks: "Zaznamki",
  backLabel: "Nazaj na zaznamke",
  backTitle: "Nazaj",
  searchPlaceholder: "Iskanje zaznamkov…",
  searchLabel: "Iskanje zaznamkov",

  // General
  groupGeneral: "Splošno",
  themeLabel: "Tema",
  themeSystem: "Sistemska",
  themeLight: "Svetla",
  themeDark: "Temna",
  languageLabel: "Jezik",
  languageSystem: "Sistemski",
  languageEnglish: "English",
  languageSlovenian: "Slovenščina",
  languageGerman: "Deutsch",
  languageFrench: "Français",
  languageSpanish: "Español",
  languageCroatian: "Hrvatski",
  languageBosnian: "Bosanski",
  languageSerbian: "Српски",
  languageRussian: "Русский",
  languageHindi: "हिन्दी",
  languageArabic: "العربية",
  languageChinese: "简体中文",

  // Behavior
  groupBehavior: "Nastavitve delovanja",
  backgroundLabel: "Odpri v ozadju",
  backgroundHint: "Zaznamki se odprejo brez zapiranja pojavnega okna razširitve",
  markingLabel: "Delovanje vrstice z zaznamki",
  markingStateOn: "VKLOPLJENO",
  markingStateOff: "IZKLOPLJENO",
  markingTurnOn: "Vklopi",
  markingTurnOff: "Izklopi",
  markingHintOn: "Kliknite zaznamek z levim gumbom, da se odpre v novem zavihku.",
  markingHintOff: "Zaznamki se odprejo v istem zavihku, privzeto vedenje.",
  perBookmarkLabel: "Za posamezen zaznamek",
  perBookmarkHint: "Preglasi zgornje stikalo za posamezne zaznamke",
  perBookmarkEmpty: "Ni spletnih zaznamkov za nastavitev.",
  perBookmarkItemAria: "Vedenje novega zavihka za $1",
  searchEngineLabel: "Vedenje iskalnika",
  searchEngineHint:
    "Na iskalniku: vklopljeno = nov zavihek, izklopljeno = isti zavihek",
  engineItemAria: "Odpri zaznamke v novem zavihku na $1",
  sameSiteLabel: "Isto spletno mesto v trenutnem zavihku",
  sameSiteHint:
    "Ko zaznamek kaže na spletno mesto, na katerem že ste, ga odpri v istem zavihku",

  // Delete extension
  deleteConfirm:
    "Ali ste prepričani? To obnovi vaše zaznamke in odstrani BookmarkUp - dejanja ni mogoče razveljaviti.",
  keepLabel: "Obdrži razširitev",
  deleteButton: "Izbriši razširitev",
  deleteArmed: "Da, izbriši razširitev",
  deleteRemoving: "Odstranjevanje…",
  deleteRestoring: "Obnavljanje zaznamkov in brisanje podatkov…",
  deleteFailed: "Razširitve ni bilo mogoče odstraniti: $1",

  // Status line / tree
  statusBookmarks: "Zaznamki: $1",
  statusResultsZero: "Zadetki: 0",
  statusResultOne: "Zadetki: $1",
  statusResultOther: "Zadetki: $1",
  statusResultsMax: "Zadetki: $1+",
  emptyNoBookmarks: "Še ni zaznamkov.",
  emptyNoMatches: "Ni zadetkov.",
  untitledFolder: "Neimenovana mapa",
  blockedUrl: "Nepodprta povezava je blokirana.",
  loadError: "Pri nalaganju zaznamkov je prišlo do napake.",
};
