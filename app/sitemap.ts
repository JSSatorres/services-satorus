import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const publicRoutes = [
  "/",
  "/productos",
  "/productos/pidoteca",
  "/productos/sportapp",
  "/lector-bilingue",
  "/proyectos/goblintrader",
  "/proyectos/angel-mendoza",
  "/proyectos/enrolla2",
  "/aviso-legal",
  "/politica-de-privacidad",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({ url: absoluteUrl(route) }));
}
