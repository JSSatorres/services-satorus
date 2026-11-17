export type ProjectKind = "app" | "web";

export type ProjectVisualDetail = {
  image: string;
  alt: string;
  label: string;
  portrait?: boolean;
  focus?: "middle" | "lower";
  /** Captura panorámica: se enseña entera, a todo lo ancho de la tablet, sin recortar los lados. */
  wide?: boolean;
};

export type ProjectCatalogItem = {
  slug: string;
  kind: ProjectKind;
  name: string;
  eyebrow: string;
  status: string;
  summary: string;
  challenge: string;
  improvement: string;
  reason: string;
  href: string;
  image: string;
  mobileImage?: string;
  imageAlt: string;
  imageFit?: "contain";
  details: ProjectVisualDetail[];
  accent: "blue" | "orange" | "lime" | "cyan" | "rose" | "green" | "gold";
  /** Módulos que se enseñan como chips bajo el relato: marcan un proyecto destacado. */
  highlights?: string[];
  /** La captura es vertical (móvil): se muestra entera sobre su color, sin recortar. */
  portrait?: boolean;
  /** Rótulo de la barra de navegador con la que se enseñan las webs. */
  domain?: string;
  /** Empresa externa que encargó el proyecto: se enseña bajo el nombre, con enlace a su web. */
  client?: { name: string; url: string; domain: string };
  /** Títulos propios para los tres pasos del relato (por defecto: reto, mejora, motivo). */
  storyLabels?: [string, string, string];
};

export const appProjects: ProjectCatalogItem[] = [
  {
    slug: "goblintrader",
    kind: "app",
    name: "GoblinTrader",
    eyebrow: "Encargo a medida · Tienda de juegos y hobby",
    status: "Proyecto para cliente",
    client: { name: "GoblinTrader", url: "https://www.goblintrader.es/", domain: "goblintrader.es" },
    summary:
      "GoblinTrader nos buscó con un problema claro: su día a día estaba repartido entre programas que no se hablaban. Le construimos a medida la aplicación que necesitaba: caja y tickets con Verifactu, compras, stock, empleados, fichaje y accesos en un mismo sistema.",
    storyLabels: ["Lo que nos pidió", "Lo que construimos", "Por qué a medida"],
    challenge: "Juntar caja, compras, almacén y equipo en una sola herramienta, hecha a su forma de trabajar y no al revés.",
    improvement: "Una aplicación propia donde cada venta, pedido y fichaje queda registrado en el mismo sitio, con los tickets listos para Verifactu.",
    reason: "En lugar de encajar su negocio en un programa genérico, partimos de cómo trabaja su equipo y lo construimos a partir de ahí.",
    href: "/proyectos/goblintrader",
    image: "/projects/goblintrader/overview-desktop.webp",
    mobileImage: "/projects/goblintrader/overview-mobile.webp",
    imageAlt: "Panel de GoblinTrader con la caja del día, un móvil con el control horario y un ticket con código Verifactu",
    details: [
      { image: "/projects/goblintrader/historico-material.webp", alt: "Histórico de material de GoblinTrader con los datos ocultos por ser información reservada", label: "Histórico de material · datos reservados" },
      { image: "/projects/goblintrader/panel-inicio.webp", alt: "Panel de inicio de GoblinTrader con los avisos internos ocultos por ser información reservada", label: "Panel del empleado · datos reservados" },
    ],
    accent: "green",
    highlights: ["Caja y tickets", "Verifactu", "Compras", "Stock y almacén", "Empleados", "Fichaje", "Control de accesos"],
  },
  {
    slug: "pidoteca",
    kind: "app",
    name: "Pidoteca",
    eyebrow: "Restauración",
    status: "Producto en uso",
    summary:
      "Carta, pedidos, sala, cocina y gestión conectados para que el turno avance sin reconstruirlo entre papeles y mensajes.",
    challenge: "Conectar la carta y los pedidos con el trabajo de sala y cocina.",
    improvement: "La carta y los pedidos dejan de ir por un lado mientras sala y cocina van por otro.",
    reason: "Un mismo recorrido permite seguir el turno sin volver a juntar papeles y mensajes.",
    href: "https://pidoteca.com/",
    image: "/projects/pidoteca/overview.png",
    imageAlt: "Landing y panel de gestión de Pidoteca",
    details: [
      { image: "/projects/pidoteca/customer-ordering-journey-wide.png", alt: "Recorrido de pedido de Pidoteca, de elegir un plato a revisar una cesta vacía", label: "De la carta al pedido" },
      { image: "/projects/pidoteca/table-status-dashboard.png", alt: "Panel de Pidoteca con el estado de las mesas del restaurante", label: "Estado de mesas" },
    ],
    accent: "blue",
  },
  {
    slug: "lector-bilingue",
    kind: "app",
    name: "Lector Bilingüe",
    eyebrow: "Lectura · Android",
    status: "Descarga gratuita",
    summary:
      "Una app para leer un EPUB en inglés con su versión en español siempre a mano, sin perder el hilo ni salir del libro.",
    challenge: "Consultar una traducción sin abandonar el libro.",
    improvement: "Leer en inglés deja de exigir saltar a otra pantalla cada vez que aparece una duda.",
    reason: "La traducción acompaña al texto para que la consulta no rompa la lectura.",
    href: "/lector-bilingue",
    image: "/products/lector-bilingue/reading-tablet-desktop.webp",
    mobileImage: "/products/lector-bilingue/reading-tablet-mobile.webp",
    imageAlt: "Tablet Android con un libro abierto en inglés y español y una frase conectada entre ambos idiomas",
    imageFit: "contain",
    details: [
      { image: "/products/lector-bilingue/08-biblioteca-con-libro.png", alt: "Biblioteca, lectura y consulta bilingüe de Lector Bilingüe", label: "Biblioteca · Lectura · Traducción", portrait: true },
      { image: "/products/lector-bilingue/02-emparejar-libros.png", alt: "Formulario para emparejar un EPUB en inglés con otro en español", label: "Idiomas en pareja", portrait: true },
    ],
    accent: "lime",
  },
  {
    slug: "sportapp",
    kind: "app",
    name: "SportApp",
    eyebrow: "Gestión deportiva",
    status: "Acceso anticipado",
    summary:
      "Sedes, equipos, personas, sesiones y documentos reunidos para que el trabajo del club no se quede disperso.",
    challenge: "Seguir la semana de un club entre sedes y equipos.",
    improvement: "La semana del club se puede consultar sin perseguir sesiones y documentos por separado.",
    reason: "Reunir la información por equipos y sedes facilita preparar el trabajo cotidiano.",
    href: "https://manage-sport-app.vercel.app/",
    image: "/projects/sportapp/panel-2026.webp",
    imageAlt: "Panel de rendimiento de SportApp con las sesiones de la semana por equipo, la asistencia y los documentos recientes del club",
    details: [
      { image: "/projects/sportapp/sesion-pizarra-2026.webp", alt: "Sesión de entrenamiento en SportApp: bloques con sus minutos y la pizarra con la jugada en la pista", label: "Cada sesión, con su pizarra" },
      { image: "/projects/sportapp/panel-movil-2026.webp", alt: "Panel de SportApp en el móvil con la semana y las sesiones del día", label: "También en el móvil", portrait: true },
    ],
    accent: "orange",
  },
  {
    slug: "oleoden-portal",
    kind: "app",
    name: "Portal Oleoden",
    eyebrow: "Encargo a medida · Laboratorio dental",
    status: "Proyecto para cliente",
    client: { name: "Oleoden", url: "https://www.oleoden.com/", domain: "oleoden.com" },
    summary:
      "Junto a su web, Oleoden necesitaba algo más: que cada clínica pudiera seguir sus trabajos sin tener que llamar. Le construimos un portal privado donde la clínica pide, adjunta archivos y ve en qué punto está cada caso, a cualquier hora.",
    storyLabels: ["Lo que nos pidió", "Lo que construimos", "Por qué a medida"],
    challenge: "Dar a las clínicas visibilidad de cada trabajo sin perder el trato cercano del teléfono.",
    improvement: "Un portal propio con pedidos, estados en tiempo real, escaneos y fotos del caso, historial y facturas, en escritorio y en móvil.",
    reason: "Un laboratorio de alta estética no encaja en un software genérico: el portal sigue su forma de trabajar, del pedido al envío.",
    href: "https://www.oleoden.com/#portal",
    image: "/projects/oleoden-portal/portal-v2-desktop.webp",
    mobileImage: "/projects/oleoden-portal/portal-mobile.webp",
    imageAlt: "Portal de clínicas de Oleoden en escritorio, con la lista de pedidos y el detalle de un caso, junto a un móvil con la misma lista",
    details: [
      { image: "/projects/oleoden-portal/seguimiento-pedido.webp", alt: "Detalle de un pedido en el portal de Oleoden con su progreso, fecha de entrega e importe", label: "Cada caso, paso a paso", wide: true },
      { image: "/projects/oleoden-portal/formulario-pedido.webp", alt: "Formulario de nuevo pedido del portal de clínicas de Oleoden", label: "Pedidos en un minuto", wide: true },
    ],
    accent: "gold",
    highlights: ["Pedidos online", "Estado en tiempo real", "Escaneos y fotos", "Historial del caso", "Facturas", "Versión móvil"],
  },
];

export const webProjects: ProjectCatalogItem[] = [
  {
    slug: "angel-mendoza",
    kind: "web",
    name: "Ángel Mendoza",
    eyebrow: "Marca personal · Salud",
    status: "Web corporativa",
    summary:
      "Una web personal que convierte experiencia en una propuesta clara para clínicas y conduce hacia una primera conversación.",
    challenge: "Explicar la propuesta de Ángel a quienes trabajan en una clínica.",
    improvement: "La experiencia de Ángel se entiende como una propuesta concreta para clínicas.",
    reason: "Ordenamos especialización, servicios y contacto para que quien llega sepa si encaja y cómo hablar con él.",
    href: "https://angelmendoza.es/",
    image: "/projects/angel-mendoza/site-desktop.png",
    imageAlt: "Página web de Ángel Mendoza vista en escritorio",
    details: [
      { image: "/projects/angel-mendoza/site-mobile.png", alt: "Web de Ángel Mendoza vista en móvil", label: "También en móvil", portrait: true },
      { image: "/projects/angel-mendoza/angel-consulta.png", alt: "Sección de consulta de la web de Ángel Mendoza", label: "Camino al contacto" },
      { image: "/projects/angel-mendoza/angel-expodental.png", alt: "Ángel Mendoza en un evento del sector dental", label: "Experiencia en el sector", portrait: true },
    ],
    accent: "cyan",
    domain: "angelmendoza.es",
  },
  {
    slug: "enrolla2",
    kind: "web",
    name: "Enrolla2",
    eyebrow: "Restauración · Valencia",
    status: "Web de marca",
    summary:
      "Una experiencia digital con el mismo descaro que sus cinnamon rolls: producto, obrador, encargos y local en una sola ruta.",
    challenge: "Mostrar los rolls y facilitar que quien llega pueda elegir y encargar.",
    improvement: "Los rolls despiertan el apetito, pero la web también ayuda a elegir y encargar.",
    reason: "Producto, carta, obrador y local forman un recorrido claro en vez de competir por atención.",
    href: "https://enrolla2.com/",
    image: "/projects/enrolla2/galeria-rolls-centrada.png",
    mobileImage: "/projects/enrolla2/galeria-rolls-movil.png",
    imageAlt: "Galería verde de Enrolla2 con fotos de cinnamon rolls dispuestas en abanico",
    imageFit: "contain",
    details: [
      { image: "/projects/enrolla2/productos-carta.png", alt: "Sección de la carta de Enrolla2 con seis sabores de rolls", label: "La carta" },
      { image: "/projects/enrolla2/opiniones-desktop.png", alt: "Opiniones de clientes de Enrolla2 publicadas en Google", label: "Opiniones en Google" },
    ],
    accent: "rose",
    domain: "enrolla2.com · Valencia",
  },
  {
    slug: "oleoden",
    kind: "web",
    name: "Oleoden",
    eyebrow: "Laboratorio dental · Granada",
    status: "Web corporativa",
    summary:
      "Una web a la altura de lo que fabrica: prótesis dental fija de alta estética presentada con calma, detalle y un camino directo para que la clínica pida información.",
    challenge: "Que una clínica perciba la calidad del laboratorio antes de enviarle su primer caso.",
    improvement: "Servicios, valores y el acceso al portal de clínicas se recorren como una sola historia, con el mismo cuidado que cada pieza.",
    reason: "En alta estética el detalle lo es todo: fotografía de producto, tipografía fina y dorado sobrio para que la web transmita oficio, no catálogo.",
    href: "https://www.oleoden.com/",
    image: "/projects/oleoden/hero-desktop.webp",
    imageAlt: "Portada de la web de Oleoden con coronas dentales sobre fondo oscuro y el titular «Prótesis dental fija de alta estética»",
    details: [
      { image: "/projects/oleoden/hero-mobile.webp", alt: "Web de Oleoden vista en móvil", label: "También en móvil", portrait: true },
      { image: "/projects/oleoden/servicios.webp", alt: "Sección de servicios de Oleoden con fotografías de carillas, coronas e implantes", label: "Servicios con fotografía propia" },
      { image: "/projects/oleoden/mapa-envios.webp", alt: "Mapa en relieve de España con Granada marcada, de la sección de envíos de Oleoden", label: "Envíos a toda España" },
    ],
    accent: "gold",
    domain: "oleoden.com · Granada",
  },
];

export const allProjects = [...appProjects, ...webProjects];
