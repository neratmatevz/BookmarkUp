/** German copy for the BookmarkUp site. Missing keys fall back to English.
 *  Machine-assisted draft - native review welcome. */
export default {
  // Meta / nav
  navFeatures: "Funktionen",
  navHow: "So funktioniert es",
  navFaq: "FAQ",
  navGithub: "GitHub",
  themeLabel: "Design",
  themeSystem: "System",
  themeLight: "Hell",
  themeDark: "Dunkel",
  langLabel: "Sprache",

  // Hero
  heroTagline: "Öffnen Sie jedes Lesezeichen mit einem einzigen Linksklick in einem neuen Tab.",
  heroSub:
    "Eine schlanke, private Manifest-V3-Erweiterung für Chromium-Browser. Ihr aktueller Tab bleibt unberührt - dieselbe Seite, dieselbe Scroll-Position, sogar halb eingegebener Text.",
  ctaInstall: "Installieren",
  ctaGithub: "Auf GitHub ansehen",
  heroNote: "Kostenlos und quelloffen. Keine Konten, kein Tracking.",

  // Features
  featuresTitle: "Was es kann",
  f1Title: "Linksklick, neuer Tab",
  f1Body:
    "Funktioniert mit den Lesezeichen, die Sie bereits haben, direkt aus der Lesezeichenleiste. Keine neuen Gewohnheiten.",
  f2Title: "Ihr Tab bleibt stehen",
  f2Body:
    "Die Seite, auf der Sie sind, bleibt eingefroren - kein Neuladen, kein Flackern - damit ungespeicherte Eingaben und die Scroll-Position erhalten bleiben.",
  f3Title: "Mittelklick unverändert",
  f3Body: "Mittelklick und Strg+Klick funktionieren genau wie zuvor.",
  f4Title: "Durchsuchbares Popup",
  f4Body:
    "Ein Symbolleisten-Popup (Strg+Umschalt+U) listet jedes Lesezeichen auf. Tippen zum Filtern, Pfeiltasten zum Navigieren, Enter zum Öffnen.",
  f5Title: "Feine Steuerung",
  f5Body:
    "Schalten Sie das Neuer-Tab-Verhalten für die ganze Leiste, pro Lesezeichen, pro Suchmaschine oder für Links derselben Website um.",
  f6Title: "Designs und Sprachen",
  f6Body:
    "Helles, dunkles oder System-Design und eine Oberfläche in 12 Sprachen, die Ihrem Browser folgt.",

  // How it works
  howTitle: "So funktioniert es",
  howIntro:
    "Die Browserleiste lässt sich nicht direkt abfangen, daher macht BookmarkUp das Lesezeichen selbst nicht navigierbar und öffnet dann die echte Seite für Sie.",
  how1Title: "1. Markieren",
  how1Body:
    "Verwaltete Lesezeichen-URLs erhalten eine winzige unsichtbare Markierung. Sie zeigen weiterhin auf dieselbe Website und ist vollständig umkehrbar.",
  how2Title: "2. Stehen bleiben",
  how2Body:
    "Eine Regel leitet einen markierten Klick auf eine leere Seite um, die HTTP 204 zurückgibt, sodass Ihr aktueller Tab nie navigiert.",
  how3Title: "3. Öffnen",
  how3Body:
    "Die Erweiterung erkennt den Klick, entfernt die Markierung und öffnet die echte Seite in einem neuen Tab.",

  // Screenshots
  shotsTitle: "Ein Blick darauf",
  shotPopup: "Das Lesezeichen-Popup",
  shotSettings: "Einstellungen",

  // Privacy
  privacyTitle: "Datenschutz zuerst",
  privacy1: "Keine Konten, kein Tracking, keine Analyse. Es wird nichts gesammelt oder verkauft.",
  privacy2:
    "Ihre Lesezeichen werden nur gelesen, um sie anzuzeigen und zu öffnen, nie hochgeladen.",
  privacy3:
    "Das Öffnen eines Lesezeichens sendet eine einzige leere, inhaltslose Netzwerkanfrage, die keine Ihrer Daten enthält.",

  // Install
  installTitle: "Installieren",
  installIntro:
    "Eine Veröffentlichung im Chrome Web Store ist unterwegs. Installieren Sie in der Zwischenzeit direkt von GitHub:",
  install1: "Laden Sie die neueste Release-ZIP herunter und entpacken Sie sie.",
  install2: "Öffnen Sie die Erweiterungsseite des Browsers und aktivieren Sie den Entwicklermodus.",
  install3: "Klicken Sie auf Entpackt laden und wählen Sie den entpackten Ordner.",
  install4: "Heften Sie BookmarkUp an und beginnen Sie, Ihre Lesezeichen per Linksklick zu öffnen.",
  installReq: "Funktioniert in Chromium-Browsern, Version 116 oder neuer.",

  // FAQ
  faqTitle: "FAQ",
  q1: "Welche Browser werden unterstützt?",
  a1: "Jeder Chromium-basierte Browser (Chrome, Brave, Edge und mehr) in Version 116 oder neuer.",
  q2: "Ändert es meine Lesezeichen?",
  a2:
    "Es fügt Lesezeichen-Links eine kleine unsichtbare Kennung hinzu, um Ihre Klicks zu erkennen. Es ist vollständig umkehrbar - beim Entfernen der Erweiterung werden zuerst die Originale wiederhergestellt.",
  q3: "Werden meine Daten gesammelt?",
  a3: "Nein. Keine Konten, kein Tracking, keine Analyse. Ihre Lesezeichen verlassen nie Ihr Gerät.",
  q4: "Warum überhaupt in einem neuen Tab öffnen?",
  a4:
    "Damit ein Linksklick nie die Seite verliert, auf der Sie sind. In den Einstellungen können Sie jedes Lesezeichen, jede Suchmaschine oder jeden Link derselben Website wieder auf denselben Tab umstellen.",
  q5: "Wie entferne ich es?",
  a5:
    "Verwenden Sie Erweiterung löschen in den Einstellungen - es stellt Ihre ursprünglichen Lesezeichen wieder her, löscht gespeicherte Einstellungen und deinstalliert sich.",

  // Footer
  footerTagline: "Öffnen Sie jedes Lesezeichen mit einem einzigen Linksklick in einem neuen Tab.",
  footerRepo: "Repository",
  footerIssues: "Probleme",
  footerDiscussions: "Diskussionen",
  footerReleases: "Releases",
  footerSupport: "Unterstützen (Ko-fi)",
  footerLicense: "MIT-Lizenz",
};
