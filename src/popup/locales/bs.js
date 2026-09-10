/**
 * Bosnian UI strings (Latin). Same keys as en.js; missing keys fall back to
 * English. Language names stay as endonyms. 
 * 
 * Machine-assisted draft - native review appreciated (open GH issue).
 */
export default {
  // Shell / chrome
  settings: "Postavke",
  bookmarks: "Zabilješke",
  backLabel: "Nazad na zabilješke",
  backTitle: "Nazad",
  searchPlaceholder: "Pretraži zabilješke…",
  searchLabel: "Pretraži zabilješke",

  // General
  groupGeneral: "Općenito",
  themeLabel: "Tema",
  themeSystem: "Sistemska",
  themeLight: "Svijetla",
  themeDark: "Tamna",
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
  groupBehavior: "Ponašanje",
  backgroundLabel: "Otvori u pozadini",
  backgroundHint: "Zabilješke se otvaraju bez zatvaranja skočnog prozora proširenja",
  markingLabel: "Funkcija trake sa zabilješkama",
  markingStateOn: "UKLJUČENO",
  markingStateOff: "ISKLJUČENO",
  markingTurnOn: "Uključi",
  markingTurnOff: "Isključi",
  markingHintOn: "Kliknite zabilješku lijevim tasterom da se otvori u novoj kartici.",
  markingHintOff: "Zabilješke se otvaraju u istoj kartici, zadano ponašanje.",
  perBookmarkLabel: "Po zabilješci",
  perBookmarkHint: "Premosti gornji prekidač za pojedinačne zabilješke",
  perBookmarkEmpty: "Nema web zabilješki za postavljanje.",
  perBookmarkItemAria: "Ponašanje nove kartice za $1",
  searchEngineLabel: "Ponašanje pretraživača",
  searchEngineHint:
    "Na pretraživaču: uključeno = nova kartica, isključeno = ista kartica",
  engineItemAria: "Otvori zabilješke u novoj kartici na $1",
  sameSiteLabel: "Isto web-mjesto u trenutnoj kartici",
  sameSiteHint:
    "Kada zabilješka vodi na web-mjesto na kojem već jeste, otvori je u istoj kartici",

  // Delete extension
  deleteConfirm:
    "Jeste li sigurni? Ovo vraća vaše zabilješke i uklanja BookmarkUp - ne može se poništiti.",
  keepLabel: "Zadrži proširenje",
  deleteButton: "Izbriši proširenje",
  deleteArmed: "Da, izbriši proširenje",
  deleteRemoving: "Uklanjanje…",
  deleteRestoring: "Vraćanje zabilješki i brisanje podataka…",
  deleteFailed: "Proširenje nije moguće ukloniti: $1",

  // Status line / tree (colon format avoids the Slavic multi-form plural)
  statusBookmarks: "Zabilješke: $1",
  statusResultsZero: "Rezultati: 0",
  statusResultOne: "Rezultati: $1",
  statusResultOther: "Rezultati: $1",
  statusResultsMax: "Rezultati: $1+",
  emptyNoBookmarks: "Još nema zabilješki.",
  emptyNoMatches: "Nema rezultata.",
  untitledFolder: "Neimenovani folder",
  blockedUrl: "Nepodržani link je blokiran.",
  loadError: "Došlo je do greške pri učitavanju zabilješki.",
};
