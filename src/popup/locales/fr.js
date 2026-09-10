/**
 * French UI strings. Same keys as en.js; missing keys fall back to English.
 * Language names stay as endonyms. 
 * 
 * Machine-assisted draft - native review appreciated (open GH issue).
 */
export default {
  // Shell / chrome
  settings: "Paramètres",
  bookmarks: "Favoris",
  backLabel: "Retour aux favoris",
  backTitle: "Retour",
  searchPlaceholder: "Rechercher des favoris…",
  searchLabel: "Rechercher des favoris",

  // General
  groupGeneral: "Général",
  themeLabel: "Thème",
  themeSystem: "Système",
  themeLight: "Clair",
  themeDark: "Sombre",
  languageLabel: "Langue",
  languageSystem: "Système",
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
  groupBehavior: "Comportement",
  backgroundLabel: "Ouvrir en arrière-plan",
  backgroundHint: "Les favoris s'ouvrent sans fermer la fenêtre de l'extension",
  markingLabel: "Fonctionnement de la barre de favoris",
  markingStateOn: "ACTIVÉ",
  markingStateOff: "DÉSACTIVÉ",
  markingTurnOn: "Activer",
  markingTurnOff: "Désactiver",
  markingHintOn: "Cliquez sur un favori avec le bouton gauche pour l'ouvrir dans un nouvel onglet.",
  markingHintOff: "Les favoris s'ouvrent dans le même onglet, comportement par défaut.",
  perBookmarkLabel: "Par favori",
  perBookmarkHint: "Remplacer le réglage ci-dessus pour certains favoris",
  perBookmarkEmpty: "Aucun favori web à configurer.",
  perBookmarkItemAria: "Comportement de nouvel onglet pour $1",
  searchEngineLabel: "Comportement des moteurs de recherche",
  searchEngineHint:
    "Sur un moteur de recherche : activé = nouvel onglet, désactivé = même onglet",
  engineItemAria: "Ouvrir les favoris dans un nouvel onglet sur $1",
  sameSiteLabel: "Même site dans l'onglet actuel",
  sameSiteHint:
    "Quand un favori pointe vers le site où vous êtes déjà, l'ouvrir dans le même onglet",

  // Delete extension
  deleteConfirm:
    "Êtes-vous sûr ? Cela restaure vos favoris et supprime BookmarkUp - c'est irréversible.",
  keepLabel: "Conserver l'extension",
  deleteButton: "Supprimer l'extension",
  deleteArmed: "Oui, supprimer l'extension",
  deleteRemoving: "Suppression…",
  deleteRestoring: "Restauration des favoris et effacement des données…",
  deleteFailed: "Impossible de supprimer l'extension : $1",

  // Status line / tree
  statusBookmarks: "$1 favoris",
  statusResultsZero: "0 résultat",
  statusResultOne: "$1 résultat",
  statusResultOther: "$1 résultats",
  statusResultsMax: "$1+ résultats",
  emptyNoBookmarks: "Aucun favori pour l'instant.",
  emptyNoMatches: "Aucun résultat.",
  untitledFolder: "Dossier sans titre",
  blockedUrl: "Un lien non pris en charge a été bloqué.",
  loadError: "Une erreur s'est produite lors du chargement des favoris.",
};
