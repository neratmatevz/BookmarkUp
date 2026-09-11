/**
 * Spanish UI strings. Same keys as en.js; missing keys fall back to English.
 * Language names stay as endonyms. 
 * 
 * Machine-assisted draft - native review appreciated (open GH issue).
 */
export default {
  // Shell / chrome
  settings: "Configuración",
  bookmarks: "Marcadores",
  backLabel: "Volver a los marcadores",
  backTitle: "Atrás",
  searchPlaceholder: "Buscar marcadores…",
  searchLabel: "Buscar marcadores",

  // General
  groupGeneral: "General",
  themeLabel: "Tema",
  themeSystem: "Sistema",
  themeLight: "Claro",
  themeDark: "Oscuro",
  languageLabel: "Idioma",
  languageSystem: "Sistema",
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
  groupBehavior: "Comportamiento",
  backgroundLabel: "Abrir en segundo plano",
  backgroundHint: "Los marcadores se abren sin cerrar la ventana de la extensión",
  markingLabel: "Funcionamiento de la barra de marcadores",
  markingStateOn: "ACTIVADO",
  markingStateOff: "DESACTIVADO",
  markingTurnOn: "Activar",
  markingTurnOff: "Desactivar",
  markingHintOn: "Haz clic izquierdo en un marcador para abrirlo en una pestaña nueva.",
  markingHintOff: "Los marcadores se abren en la misma pestaña, comportamiento predeterminado.",
  perBookmarkLabel: "Por marcador",
  perBookmarkHint: "Anular el interruptor de arriba para marcadores concretos",
  perBookmarkEmpty: "No hay marcadores web para configurar.",
  perBookmarkItemAria: "Comportamiento de pestaña nueva para $1",
  searchEngineLabel: "Comportamiento del buscador",
  searchEngineHint:
    "En un buscador: activado = pestaña nueva, desactivado = misma pestaña",
  engineItemAria: "Abrir marcadores en una pestaña nueva en $1",
  sameSiteLabel: "Mismo sitio en la pestaña actual",
  sameSiteHint:
    "Cuando un marcador apunta al sitio en el que ya estás, abrirlo en la misma pestaña",

  // Delete extension
  deleteConfirm:
    "¿Estás seguro? Esto restaura tus marcadores y elimina BookmarkUp - no se puede deshacer.",
  keepLabel: "Conservar la extensión",
  deleteButton: "Eliminar la extensión",
  deleteArmed: "Sí, eliminar la extensión",
  deleteRemoving: "Eliminando…",
  deleteRestoring: "Restaurando marcadores y borrando datos…",
  deleteFailed: "No se pudo eliminar la extensión: $1",

  // Status line / tree
  statusBookmarks: "$1 marcadores",
  statusResultsZero: "0 resultados",
  statusResultOne: "$1 resultado",
  statusResultOther: "$1 resultados",
  statusResultsMax: "$1+ resultados",
  emptyNoBookmarks: "Aún no hay marcadores.",
  emptyNoMatches: "Sin resultados.",
  untitledFolder: "Carpeta sin título",
  blockedUrl: "Se bloqueó un enlace no compatible.",
  loadError: "Se produjo un error al cargar los marcadores.",
  // About
  about: "Acerca de",
  aboutTitle: "Acerca de la extensión",
  aboutVersion: "Versión $1",
  aboutTagline: "Abre cualquier marcador en una pestaña nueva con un solo clic izquierdo.",
  aboutWebsite: "Sitio web",
  aboutSource: "Código fuente",
  aboutSupport: "Apóyanos (Ko-fi)",
  aboutLicense: "Publicado bajo la licencia MIT.",
};
