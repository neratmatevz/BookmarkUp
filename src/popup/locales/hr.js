/**
 * Croatian UI strings (Latin). Same keys as en.js; missing keys fall back to
 * English. Language names stay as endonyms. 
 * 
 * Machine-assisted draft - native review appreciated (open GH issue).
 */
export default {
  // Shell / chrome
  settings: "Postavke",
  bookmarks: "Oznake",
  backLabel: "Natrag na oznake",
  backTitle: "Natrag",
  searchPlaceholder: "Pretraži oznake…",
  searchLabel: "Pretraži oznake",

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
  backgroundHint: "Oznake se otvaraju bez zatvaranja skočnog prozora proširenja",
  markingLabel: "Funkcija trake s oznakama",
  markingStateOn: "UKLJUČENO",
  markingStateOff: "ISKLJUČENO",
  markingTurnOn: "Uključi",
  markingTurnOff: "Isključi",
  markingHintOn: "Kliknite oznaku lijevom tipkom da se otvori u novoj kartici.",
  markingHintOff: "Oznake se otvaraju u istoj kartici, zadano ponašanje.",
  perBookmarkLabel: "Po oznaci",
  perBookmarkHint: "Nadjačaj gornji prekidač za pojedinačne oznake",
  perBookmarkEmpty: "Nema web oznaka za postavljanje.",
  perBookmarkItemAria: "Ponašanje nove kartice za $1",
  searchEngineLabel: "Ponašanje tražilice",
  searchEngineHint:
    "Na tražilici: uključeno = nova kartica, isključeno = ista kartica",
  engineItemAria: "Otvori oznake u novoj kartici na $1",
  sameSiteLabel: "Isto web-mjesto u trenutnoj kartici",
  sameSiteHint:
    "Kada oznaka vodi na web-mjesto na kojem već jeste, otvori je u istoj kartici",

  // Delete extension
  deleteConfirm:
    "Jeste li sigurni? Ovo vraća vaše oznake i uklanja BookmarkUp - ne može se poništiti.",
  keepLabel: "Zadrži proširenje",
  deleteButton: "Izbriši proširenje",
  deleteArmed: "Da, izbriši proširenje",
  deleteRemoving: "Uklanjanje…",
  deleteRestoring: "Vraćanje oznaka i brisanje podataka…",
  deleteFailed: "Proširenje nije moguće ukloniti: $1",

  // Status line / tree (colon format avoids the Slavic multi-form plural)
  statusBookmarks: "Oznake: $1",
  statusResultsZero: "Rezultati: 0",
  statusResultOne: "Rezultati: $1",
  statusResultOther: "Rezultati: $1",
  statusResultsMax: "Rezultati: $1+",
  emptyNoBookmarks: "Još nema oznaka.",
  emptyNoMatches: "Nema rezultata.",
  untitledFolder: "Neimenovana mapa",
  blockedUrl: "Nepodržana poveznica je blokirana.",
  loadError: "Došlo je do pogreške pri učitavanju oznaka.",
  // About
  about: "O proširenju",
  aboutTitle: "O proširenju",
  aboutVersion: "Verzija $1",
  aboutTagline: "Otvorite bilo koju oznaku u novoj kartici jednim lijevim klikom.",
  aboutWebsite: "Web stranica",
  aboutSource: "Izvorni kôd",
  aboutSupport: "Podržite nas (Ko-fi)",
  aboutLicense: "Objavljeno pod MIT licencom.",
};
