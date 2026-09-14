export type ProjectKind = "app" | "web";

export type ProjectCatalogItem = {
  slug: string;
  kind: ProjectKind;
  name: string;
  eyebrow: string;
  status: string;
  summary: string;
  href: string;
  image: string;
  imageAlt: string;
  accent: "blue" | "orange" | "lime" | "cyan" | "rose";
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
    href: "/lector-bilingue",
    image: "/products/lector-bilingue/05-traduccion-bilingue.png",
    imageAlt: "Pantalla de lectura y traducción de Lector Bilingüe",
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
    href: "/proyectos/angel-mendoza",
    image: "/projects/angel-mendoza/site-desktop.png",
    imageAlt: "Página web de Ángel Mendoza vista en escritorio",
    accent: "cyan",
  },
  {
    slug: "enrolla2",
    kind: "web",
    name: "Enrolla2",
    eyebrow: "Restauración · Valencia",
    status: "Web de marca",
    summary:
      "Una experiencia digital con el mismo descaro que sus cinnamon rolls: producto, obrador, encargos y local en una sola ruta.",
    href: "/proyectos/enrolla2",
    image: "/projects/enrolla2/hero-desktop.png",
    imageAlt: "Portada de la página web de Enrolla2",
    accent: "rose",
  },
];

export const allProjects = [...appProjects, ...webProjects];
