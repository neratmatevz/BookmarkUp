/** French copy for the BookmarkUp site. Missing keys fall back to English.
 *  Machine-assisted draft - native review welcome. */
export default {
  // Meta / nav
  navFeatures: "Fonctionnalités",
  navHow: "Comment ça marche",
  navFaq: "FAQ",
  navGithub: "GitHub",
  themeLabel: "Thème",
  themeSystem: "Système",
  themeLight: "Clair",
  themeDark: "Sombre",
  langLabel: "Langue",

  // Hero
  heroTagline: "Ouvrez n'importe quel favori dans un nouvel onglet d'un simple clic gauche.",
  heroSub:
    "Une extension Manifest V3 légère et privée pour les navigateurs Chromium. Votre onglet actuel ne bouge jamais - même page, même défilement, même texte à moitié saisi.",
  ctaInstall: "Installer",
  ctaGithub: "Voir sur GitHub",
  heroNote: "Gratuit et open source. Pas de comptes, pas de suivi.",

  // Features
  featuresTitle: "Ce qu'il fait",
  f1Title: "Clic gauche, nouvel onglet",
  f1Body:
    "Fonctionne avec les favoris que vous avez déjà, directement depuis la barre de favoris. Aucune nouvelle habitude.",
  f2Title: "Votre onglet reste en place",
  f2Body:
    "La page sur laquelle vous êtes reste figée - pas de rechargement, pas de scintillement - donc la saisie non enregistrée et le défilement survivent.",
  f3Title: "Clic du milieu inchangé",
  f3Body: "Le clic du milieu et Ctrl+clic continuent de fonctionner exactement comme avant.",
  f4Title: "Fenêtre de recherche",
  f4Body:
    "Une fenêtre dans la barre d'outils (Ctrl+Maj+U) liste tous les favoris. Tapez pour filtrer, flèches pour vous déplacer, Entrée pour ouvrir.",
  f5Title: "Contrôle précis",
  f5Body:
    "Basculez le comportement de nouvel onglet pour toute la barre, par favori, par moteur de recherche ou pour les liens du même site.",
  f6Title: "Thèmes et langues",
  f6Body:
    "Thème clair, sombre ou système, et une interface disponible en 12 langues qui suit votre navigateur.",

  // How it works
  howTitle: "Comment ça marche",
  howIntro:
    "La barre du navigateur ne peut pas être interceptée directement, alors BookmarkUp rend le favori lui-même non navigable, puis ouvre la vraie page pour vous.",
  how1Title: "1. Marquer",
  how1Body:
    "Les URL des favoris gérés reçoivent un minuscule marqueur invisible. Elles pointent toujours vers le même site et c'est entièrement réversible.",
  how2Title: "2. Rester en place",
  how2Body:
    "Une règle redirige un clic marqué vers une page vide qui renvoie HTTP 204, de sorte que votre onglet actuel ne navigue jamais.",
  how3Title: "3. Ouvrir",
  how3Body:
    "L'extension voit le clic, retire le marqueur et ouvre la vraie page dans un nouvel onglet.",

  // Screenshots
  shotsTitle: "Jetez un œil",
  shotPopup: "La fenêtre des favoris",
  shotSettings: "Paramètres",

  // Privacy
  privacyTitle: "La confidentialité d'abord",
  privacy1: "Pas de comptes, pas de suivi, pas d'analyse. Rien n'est collecté ni vendu.",
  privacy2:
    "Vos favoris ne sont lus que pour les afficher et les ouvrir, jamais téléversés.",
  privacy3:
    "Ouvrir un favori effectue une seule requête réseau vide, sans contenu, qui ne transporte aucune de vos données.",

  // Install
  installTitle: "Installer",
  installIntro:
    "Une publication sur le Chrome Web Store est en route. En attendant, installez directement depuis GitHub :",
  install1: "Téléchargez le ZIP de la dernière version et décompressez-le.",
  install2: "Ouvrez la page des extensions du navigateur et activez le mode développeur.",
  install3: "Cliquez sur Charger l'extension non empaquetée et sélectionnez le dossier décompressé.",
  install4: "Épinglez BookmarkUp et commencez à cliquer gauche sur vos favoris.",
  installReq: "Fonctionne dans les navigateurs Chromium, version 116 ou plus récente.",

  // FAQ
  faqTitle: "FAQ",
  q1: "Quels navigateurs sont pris en charge ?",
  a1: "Tout navigateur basé sur Chromium (Chrome, Brave, Edge et autres) en version 116 ou plus récente.",
  q2: "Modifie-t-il mes favoris ?",
  a2:
    "Il ajoute une petite balise invisible aux liens des favoris pour reconnaître vos clics. C'est entièrement réversible - retirer l'extension restaure d'abord les originaux.",
  q3: "Mes données sont-elles collectées ?",
  a3: "Non. Aucun compte, suivi ni analyse. Vos favoris ne quittent jamais votre machine.",
  q4: "Pourquoi ouvrir dans un nouvel onglet ?",
  a4:
    "Pour qu'un clic gauche ne perde jamais la page où vous êtes. Vous pouvez aussi rebasculer n'importe quel favori, moteur ou lien du même site vers le même onglet dans les Paramètres.",
  q5: "Comment le supprimer ?",
  a5:
    "Utilisez Supprimer l'extension dans les Paramètres - il restaure vos favoris d'origine, efface les réglages enregistrés et se désinstalle.",

  // Footer
  footerTagline: "Ouvrez n'importe quel favori dans un nouvel onglet d'un simple clic gauche.",
  footerRepo: "Dépôt",
  footerIssues: "Problèmes",
  footerDiscussions: "Discussions",
  footerReleases: "Versions",
  footerSupport: "Soutenir (Ko-fi)",
  footerLicense: "Licence MIT",
};
