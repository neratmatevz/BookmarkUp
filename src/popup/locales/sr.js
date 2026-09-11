/**
 * Serbian UI strings (Cyrillic). Same keys as
 * en.js; missing keys fall back to English. Language names stay as endonyms.
 * 
 * Machine-assisted draft - native review appreciated (open GH issue). 
 * 
 * (If a Latin Serbian is preferred instead, the whole file can be transliterated.)
 */
export default {
  // Shell / chrome
  settings: "Подешавања",
  bookmarks: "Обележивачи",
  backLabel: "Назад на обележиваче",
  backTitle: "Назад",
  searchPlaceholder: "Претражи обележиваче…",
  searchLabel: "Претражи обележиваче",

  // General
  groupGeneral: "Опште",
  themeLabel: "Тема",
  themeSystem: "Системска",
  themeLight: "Светла",
  themeDark: "Тамна",
  languageLabel: "Језик",
  languageSystem: "Системски",
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
  groupBehavior: "Понашање",
  backgroundLabel: "Отвори у позадини",
  backgroundHint: "Обележивачи се отварају без затварања искачућег прозора додатка",
  markingLabel: "Функција траке са обележивачима",
  markingStateOn: "УКЉУЧЕНО",
  markingStateOff: "ИСКЉУЧЕНО",
  markingTurnOn: "Укључи",
  markingTurnOff: "Искључи",
  markingHintOn: "Кликните обележивач левим тастером да се отвори у новој картици.",
  markingHintOff: "Обележивачи се отварају у истој картици, подразумевано понашање.",
  perBookmarkLabel: "По обележивачу",
  perBookmarkHint: "Замени горњи прекидач за појединачне обележиваче",
  perBookmarkEmpty: "Нема веб обележивача за подешавање.",
  perBookmarkItemAria: "Понашање нове картице за $1",
  searchEngineLabel: "Понашање претраживача",
  searchEngineHint:
    "На претраживачу: укључено = нова картица, искључено = иста картица",
  engineItemAria: "Отвори обележиваче у новој картици на $1",
  sameSiteLabel: "Исти сајт у тренутној картици",
  sameSiteHint:
    "Када обележивач води на сајт на ком сте већ, отвори га у истој картици",

  // Delete extension
  deleteConfirm:
    "Да ли сте сигурни? Ово враћа ваше обележиваче и уклања BookmarkUp - не може се опозвати.",
  keepLabel: "Задржи додатак",
  deleteButton: "Избриши додатак",
  deleteArmed: "Да, избриши додатак",
  deleteRemoving: "Уклањање…",
  deleteRestoring: "Враћање обележивача и брисање података…",
  deleteFailed: "Додатак није могуће уклонити: $1",

  // Status line / tree (colon format avoids the Slavic multi-form plural)
  statusBookmarks: "Обележивачи: $1",
  statusResultsZero: "Резултати: 0",
  statusResultOne: "Резултати: $1",
  statusResultOther: "Резултати: $1",
  statusResultsMax: "Резултати: $1+",
  emptyNoBookmarks: "Још нема обележивача.",
  emptyNoMatches: "Нема резултата.",
  untitledFolder: "Неименована фасцикла",
  blockedUrl: "Неподржана веза је блокирана.",
  loadError: "Дошло је до грешке при учитавању обележивача.",
  // About
  about: "О проширењу",
  aboutTitle: "О проширењу",
  aboutVersion: "Верзија $1",
  aboutTagline: "Отворите било који обележивач у новој картици једним левим кликом.",
  aboutWebsite: "Веб-сајт",
  aboutSource: "Изворни код",
  aboutSupport: "Подржите нас (Ko-fi)",
  aboutLicense: "Објављено под MIT лиценцом.",
};
