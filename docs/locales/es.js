/** Spanish copy for the BookmarkUp site. Missing keys fall back to English.
 *  Machine-assisted draft - native review welcome. */
export default {
  // Meta / nav
  navFeatures: "Funciones",
  navHow: "Cómo funciona",
  navFaq: "Preguntas frecuentes",
  navGithub: "GitHub",
  themeLabel: "Tema",
  themeSystem: "Sistema",
  themeLight: "Claro",
  themeDark: "Oscuro",
  langLabel: "Idioma",

  // Hero
  heroTagline: "Abre cualquier marcador en una pestaña nueva con un solo clic izquierdo.",
  heroSub:
    "Una extensión Manifest V3 ligera y privada para navegadores Chromium. Tu pestaña actual nunca se mueve - misma página, mismo desplazamiento, incluso texto a medio escribir.",
  ctaInstall: "Instalar",
  ctaGithub: "Ver en GitHub",
  heroNote: "Gratis y de código abierto. Sin cuentas, sin seguimiento.",

  // Features
  featuresTitle: "Qué hace",
  f1Title: "Clic izquierdo, pestaña nueva",
  f1Body:
    "Funciona con los marcadores que ya tienes, directamente desde la barra de marcadores. Sin nuevos hábitos.",
  f2Title: "Tu pestaña se queda quieta",
  f2Body:
    "La página en la que estás queda congelada - sin recargar, sin parpadeos - así que el texto sin guardar y el desplazamiento sobreviven.",
  f3Title: "Clic central sin cambios",
  f3Body: "El clic central y Ctrl+clic siguen funcionando exactamente como antes.",
  f4Title: "Ventana emergente con búsqueda",
  f4Body:
    "Una ventana emergente en la barra de herramientas (Ctrl+Mayús+U) lista todos los marcadores. Escribe para filtrar, flechas para moverte, Enter para abrir.",
  f5Title: "Control preciso",
  f5Body:
    "Cambia el comportamiento de pestaña nueva para toda la barra, por marcador, por buscador o para enlaces del mismo sitio.",
  f6Title: "Temas e idiomas",
  f6Body:
    "Tema claro, oscuro o del sistema, y una interfaz disponible en 12 idiomas que sigue a tu navegador.",

  // How it works
  howTitle: "Cómo funciona",
  howIntro:
    "La barra del navegador no se puede interceptar directamente, así que BookmarkUp hace que el propio marcador no sea navegable y luego abre la página real por ti.",
  how1Title: "1. Marcar",
  how1Body:
    "Las URL de los marcadores gestionados reciben un marcador diminuto e invisible. Siguen apuntando al mismo sitio y es totalmente reversible.",
  how2Title: "2. Quedarse quieto",
  how2Body:
    "Una regla redirige un clic marcado a una página vacía que devuelve HTTP 204, por lo que tu pestaña actual nunca navega.",
  how3Title: "3. Abrir",
  how3Body:
    "La extensión ve el clic, quita el marcador y abre la página real en una pestaña nueva.",

  // Screenshots
  shotsTitle: "Echa un vistazo",
  shotPopup: "La ventana de marcadores",
  shotSettings: "Ajustes",

  // Privacy
  privacyTitle: "Privacidad ante todo",
  privacy1: "Sin cuentas, sin seguimiento, sin analíticas. No se recopila ni se vende nada.",
  privacy2:
    "Tus marcadores solo se leen para mostrarlos y abrirlos, nunca se suben.",
  privacy3:
    "Abrir un marcador hace una única solicitud de red vacía y sin contenido que no lleva ninguno de tus datos.",

  // Install
  installTitle: "Instalar",
  installIntro:
    "Una publicación en Chrome Web Store está en camino. Mientras tanto, instala directamente desde GitHub:",
  install1: "Descarga el ZIP de la última versión y descomprímelo.",
  install2: "Abre la página de extensiones del navegador y activa el modo de desarrollador.",
  install3: "Haz clic en Cargar descomprimida y selecciona la carpeta descomprimida.",
  install4: "Ancla BookmarkUp y empieza a hacer clic izquierdo en tus marcadores.",
  installReq: "Funciona en navegadores Chromium, versión 116 o posterior.",

  // FAQ
  faqTitle: "Preguntas frecuentes",
  q1: "¿Qué navegadores son compatibles?",
  a1: "Cualquier navegador basado en Chromium (Chrome, Brave, Edge y más) en la versión 116 o posterior.",
  q2: "¿Cambia mis marcadores?",
  a2:
    "Añade una pequeña etiqueta invisible a los enlaces de los marcadores para reconocer tus clics. Es totalmente reversible - al quitar la extensión se restauran primero los originales.",
  q3: "¿Se recopilan mis datos?",
  a3: "No. Sin cuentas, seguimiento ni analíticas. Tus marcadores nunca salen de tu equipo.",
  q4: "¿Por qué abrir en una pestaña nueva?",
  a4:
    "Para que un clic izquierdo nunca pierda la página en la que estás. También puedes volver a la misma pestaña para cualquier marcador, buscador o enlace del mismo sitio en Ajustes.",
  q5: "¿Cómo la elimino?",
  a5:
    "Usa Eliminar extensión en Ajustes - restaura tus marcadores originales, borra los ajustes guardados y se desinstala.",

  // Footer
  footerTagline: "Abre cualquier marcador en una pestaña nueva con un solo clic izquierdo.",
  footerRepo: "Repositorio",
  footerIssues: "Incidencias",
  footerDiscussions: "Debates",
  footerReleases: "Versiones",
  footerSupport: "Apóyanos (Ko-fi)",
  footerLicense: "Licencia MIT",
};
