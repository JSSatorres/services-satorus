export type ProjectKind = "app" | "web";

export type ProjectCatalogItem = {
  slug: string;
  kind: ProjectKind;
  name: string;
  eyebrow: string;
  status: string;
  summary: string;
  improvement: string;
  reason: string;
  href: string;
  image: string;
  imageAlt: string;
  accent: "blue" | "orange" | "lime" | "cyan" | "rose";
  /** La captura es vertical (móvil): se muestra entera sobre su color, sin recortar. */
  portrait?: boolean;
  /** Rótulo de la barra de navegador con la que se enseñan las webs. */
  domain?: string;
};

export const appProjects: ProjectCatalogItem[] = [
  {
    slug: "pidoteca",
    kind: "app",
    name: "Pidoteca",
    eyebrow: "Restauración",
    status: "Producto en uso",
    summary:
      "Carta, pedidos, sala, cocina y gestión conectados para que el turno avance sin reconstruirlo entre papeles y mensajes.",
    improvement: "La carta y los pedidos dejan de ir por un lado mientras sala y cocina van por otro.",
    reason: "Un mismo recorrido permite seguir el turno sin volver a juntar papeles y mensajes.",
    href: "/productos/pidoteca",
    image: "/projects/pidoteca/overview.png",
    imageAlt: "Landing y panel de gestión de Pidoteca",
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
    improvement: "Leer en inglés deja de exigir saltar a otra pantalla cada vez que aparece una duda.",
    reason: "La traducción acompaña al texto para que la consulta no rompa la lectura.",
    href: "/lector-bilingue",
    image: "/products/lector-bilingue/05-traduccion-bilingue.png",
    imageAlt: "Pantalla de lectura y traducción de Lector Bilingüe",
    accent: "lime",
    portrait: true,
  },
  {
    slug: "sportapp",
    kind: "app",
    name: "SportApp",
    eyebrow: "Gestión deportiva",
    status: "Acceso anticipado",
    summary:
      "Sedes, equipos, personas, sesiones y documentos reunidos para que el trabajo del club no se quede disperso.",
    improvement: "La semana del club se puede consultar sin perseguir sesiones y documentos por separado.",
    reason: "Reunir la información por equipos y sedes facilita preparar el trabajo cotidiano.",
    href: "/productos/sportapp",
    image: "/projects/sportapp/dashboard.png",
    imageAlt: "Dashboard semanal de SportApp",
    accent: "orange",
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
    improvement: "La experiencia de Ángel se entiende como una propuesta concreta para clínicas.",
    reason: "Ordenamos especialización, servicios y contacto para que quien llega sepa si encaja y cómo hablar con él.",
    href: "/proyectos/angel-mendoza",
    image: "/projects/angel-mendoza/site-desktop.png",
    imageAlt: "Página web de Ángel Mendoza vista en escritorio",
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
    improvement: "Los rolls despiertan el apetito, pero la web también ayuda a elegir y encargar.",
    reason: "Producto, carta, obrador y local forman un recorrido claro en vez de competir por atención.",
    href: "/proyectos/enrolla2",
    image: "/projects/enrolla2/hero-desktop.png",
    imageAlt: "Portada de la página web de Enrolla2",
    accent: "rose",
    domain: "enrolla2.es · Valencia",
  },
];

export const allProjects = [...appProjects, ...webProjects];
