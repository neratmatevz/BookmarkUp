/**
 * Russian UI strings. Same keys as en.js; missing keys fall back to English.
 * Language names stay as endonyms. 
 * 
 * Machine-assisted draft - native review appreciated (open GH issue).
 */
export default {
  // Shell / chrome
  settings: "Настройки",
  bookmarks: "Закладки",
  backLabel: "Назад к закладкам",
  backTitle: "Назад",
  searchPlaceholder: "Поиск закладок…",
  searchLabel: "Поиск закладок",

  // General
  groupGeneral: "Общие",
  themeLabel: "Тема",
  themeSystem: "Системная",
  themeLight: "Светлая",
  themeDark: "Тёмная",
  languageLabel: "Язык",
  languageSystem: "Системный",
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
  groupBehavior: "Поведение",
  backgroundLabel: "Открывать в фоне",
  backgroundHint: "Закладки открываются, не закрывая всплывающее окно расширения",
  markingLabel: "Работа панели закладок",
  markingStateOn: "ВКЛ",
  markingStateOff: "ВЫКЛ",
  markingTurnOn: "Включить",
  markingTurnOff: "Выключить",
  markingHintOn: "Щёлкните закладку левой кнопкой, чтобы открыть её в новой вкладке.",
  markingHintOff: "Закладки открываются в той же вкладке, поведение по умолчанию.",
  perBookmarkLabel: "Для отдельной закладки",
  perBookmarkHint: "Переопределить переключатель выше для отдельных закладок",
  perBookmarkEmpty: "Нет веб-закладок для настройки.",
  perBookmarkItemAria: "Поведение новой вкладки для $1",
  searchEngineLabel: "Поведение поисковика",
  searchEngineHint: "На поисковике: вкл = новая вкладка, выкл = та же вкладка",
  engineItemAria: "Открывать закладки в новой вкладке на $1",
  sameSiteLabel: "Тот же сайт в текущей вкладке",
  sameSiteHint:
    "Когда закладка ведёт на сайт, на котором вы уже находитесь, открывать её в той же вкладке",

  // Delete extension
  deleteConfirm:
    "Вы уверены? Это восстановит ваши закладки и удалит BookmarkUp - отменить будет нельзя.",
  keepLabel: "Оставить расширение",
  deleteButton: "Удалить расширение",
  deleteArmed: "Да, удалить расширение",
  deleteRemoving: "Удаление…",
  deleteRestoring: "Восстановление закладок и очистка данных…",
  deleteFailed: "Не удалось удалить расширение: $1",

  // Status line / tree (colon format avoids the Russian multi-form plural)
  statusBookmarks: "Закладки: $1",
  statusResultsZero: "Результаты: 0",
  statusResultOne: "Результаты: $1",
  statusResultOther: "Результаты: $1",
  statusResultsMax: "Результаты: $1+",
  emptyNoBookmarks: "Пока нет закладок.",
  emptyNoMatches: "Ничего не найдено.",
  untitledFolder: "Папка без названия",
  blockedUrl: "Неподдерживаемая ссылка заблокирована.",
  loadError: "Произошла ошибка при загрузке закладок.",
};
