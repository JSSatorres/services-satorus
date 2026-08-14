import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const publicRoutes = [
  "/",
  "/productos",
  "/aviso-legal",
  "/politica-de-privacidad",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({ url: absoluteUrl(route) }));
}
