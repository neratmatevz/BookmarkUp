/**
 * Simplified Chinese UI strings. Same keys as en.js; missing keys fall back to
 * English. Language names stay as endonyms. Machine-assisted draft - native
 * review appreciated (open GH issue).
 */
export default {
  // Shell / chrome
  settings: "设置",
  bookmarks: "书签",
  backLabel: "返回书签",
  backTitle: "返回",
  searchPlaceholder: "搜索书签…",
  searchLabel: "搜索书签",

  // General
  groupGeneral: "常规",
  themeLabel: "主题",
  themeSystem: "系统",
  themeLight: "浅色",
  themeDark: "深色",
  languageLabel: "语言",
  languageSystem: "系统",
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
  groupBehavior: "行为",
  backgroundLabel: "在后台打开",
  backgroundHint: "打开书签时不关闭扩展弹出窗口",
  markingLabel: "书签栏功能",
  markingStateOn: "开",
  markingStateOff: "关",
  markingTurnOn: "开启",
  markingTurnOff: "关闭",
  markingHintOn: "左键点击书签即可在新标签页中打开。",
  markingHintOff: "书签在当前标签页打开，默认行为。",
  perBookmarkLabel: "按书签",
  perBookmarkHint: "为单个书签覆盖上面的开关",
  perBookmarkEmpty: "没有可配置的网页书签。",
  perBookmarkItemAria: "$1 的新标签页行为",
  searchEngineLabel: "搜索引擎行为",
  searchEngineHint: "在搜索引擎上：开 = 新标签页，关 = 当前标签页",
  engineItemAria: "在 $1 上于新标签页打开书签",
  sameSiteLabel: "在当前标签页打开同一网站",
  sameSiteHint: "当书签指向你已在浏览的网站时，在当前标签页打开",

  // Delete extension
  deleteConfirm:
    "确定吗？这将恢复你的书签并移除 BookmarkUp - 无法撤销。",
  keepLabel: "保留扩展",
  deleteButton: "删除扩展",
  deleteArmed: "是的，删除扩展",
  deleteRemoving: "正在移除…",
  deleteRestoring: "正在恢复书签并清除数据…",
  deleteFailed: "无法移除扩展：$1",

  // Status line / tree
  statusBookmarks: "$1 个书签",
  statusResultsZero: "0 个结果",
  statusResultOne: "$1 个结果",
  statusResultOther: "$1 个结果",
  statusResultsMax: "$1+ 个结果",
  emptyNoBookmarks: "还没有书签。",
  emptyNoMatches: "没有匹配项。",
  untitledFolder: "未命名文件夹",
  blockedUrl: "已阻止不受支持的链接。",
  loadError: "加载书签时出错。",
  // About
  about: "关于",
  aboutTitle: "关于扩展",
  aboutVersion: "版本 $1",
  aboutTagline: "只需左键单击，即可在新标签页中打开任意书签。",
  aboutWebsite: "网站",
  aboutSource: "源代码",
  aboutSupport: "支持我们 (Ko-fi)",
  aboutLicense: "基于 MIT 许可证发布。",
};
