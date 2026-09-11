/**
 * Arabic UI strings (right-to-left). Same keys as en.js; missing keys fall back
 * to English. Language names stay as endonyms. Machine-assisted draft - native
 * review appreciated (open GH issue). The popup switches to dir="rtl" for this
 * language (see i18n.js `dir()` + popup.js).
 */
export default {
  // Shell / chrome
  settings: "الإعدادات",
  bookmarks: "الإشارات المرجعية",
  backLabel: "العودة إلى الإشارات المرجعية",
  backTitle: "رجوع",
  searchPlaceholder: "البحث في الإشارات المرجعية…",
  searchLabel: "البحث في الإشارات المرجعية",

  // General
  groupGeneral: "عام",
  themeLabel: "المظهر",
  themeSystem: "النظام",
  themeLight: "فاتح",
  themeDark: "داكن",
  languageLabel: "اللغة",
  languageSystem: "النظام",
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
  groupBehavior: "السلوك",
  backgroundLabel: "فتح في الخلفية",
  backgroundHint: "تُفتح الإشارات المرجعية دون إغلاق نافذة الإضافة المنبثقة",
  markingLabel: "وظيفة شريط الإشارات المرجعية",
  markingStateOn: "مُفعّل",
  markingStateOff: "مُعطّل",
  markingTurnOn: "تفعيل",
  markingTurnOff: "تعطيل",
  markingHintOn: "انقر بزر الفأرة الأيسر على إشارة مرجعية لفتحها في علامة تبويب جديدة.",
  markingHintOff: "تُفتح الإشارات المرجعية في نفس علامة التبويب، السلوك الافتراضي.",
  perBookmarkLabel: "لكل إشارة مرجعية",
  perBookmarkHint: "تجاوز المفتاح أعلاه لإشارات مرجعية فردية",
  perBookmarkEmpty: "لا توجد إشارات مرجعية ويب للتهيئة.",
  perBookmarkItemAria: "سلوك علامة التبويب الجديدة لـ $1",
  searchEngineLabel: "سلوك محرك البحث",
  searchEngineHint:
    "على محرك بحث: مُفعّل = علامة تبويب جديدة، مُعطّل = نفس علامة التبويب",
  engineItemAria: "فتح الإشارات المرجعية في علامة تبويب جديدة على $1",
  sameSiteLabel: "نفس الموقع في علامة التبويب الحالية",
  sameSiteHint:
    "عندما تشير إشارة مرجعية إلى الموقع الذي أنت فيه بالفعل، افتحها في نفس علامة التبويب",

  // Delete extension
  deleteConfirm:
    "هل أنت متأكد؟ سيؤدي هذا إلى استعادة إشاراتك المرجعية وإزالة BookmarkUp - لا يمكن التراجع عن ذلك.",
  keepLabel: "الاحتفاظ بالإضافة",
  deleteButton: "حذف الإضافة",
  deleteArmed: "نعم، احذف الإضافة",
  deleteRemoving: "جارٍ الإزالة…",
  deleteRestoring: "جارٍ استعادة الإشارات المرجعية ومسح البيانات…",
  deleteFailed: "تعذّر إزالة الإضافة: $1",

  // Status line / tree
  statusBookmarks: "$1 إشارة مرجعية",
  statusResultsZero: "0 نتيجة",
  statusResultOne: "$1 نتيجة",
  statusResultOther: "$1 نتيجة",
  statusResultsMax: "$1+ نتيجة",
  emptyNoBookmarks: "لا توجد إشارات مرجعية بعد.",
  emptyNoMatches: "لا توجد نتائج.",
  untitledFolder: "مجلد بدون عنوان",
  blockedUrl: "تم حظر رابط غير مدعوم.",
  loadError: "حدث خطأ أثناء تحميل الإشارات المرجعية.",
  // About
  about: "حول",
  aboutTitle: "حول الامتداد",
  aboutVersion: "الإصدار $1",
  aboutTagline: "افتح أي إشارة مرجعية في علامة تبويب جديدة بنقرة يسار واحدة.",
  aboutWebsite: "الموقع الإلكتروني",
  aboutSource: "الكود المصدري",
  aboutSupport: "ادعمنا (Ko-fi)",
  aboutLicense: "منشور بموجب رخصة MIT.",
};
