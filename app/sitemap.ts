import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Fecha del último cambio de contenido de cada ruta: actualízala al editar la página.
const publicRoutes: { path: string; lastModified: string }[] = [
  { path: "/", lastModified: "2026-10-25" },
  { path: "/productos", lastModified: "2026-10-25" },
  { path: "/proyectos/goblintrader", lastModified: "2026-09-23" },
  { path: "/lector-bilingue", lastModified: "2026-09-14" },
  { path: "/aviso-legal", lastModified: "2026-10-24" },
  { path: "/politica-de-privacidad", lastModified: "2026-10-24" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map(({ path, lastModified }) => ({
    url: absoluteUrl(path),
    lastModified,
  }));
}
