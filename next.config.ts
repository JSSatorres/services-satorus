import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Páginas de proyecto retiradas por ahora (solo queda GoblinTrader): temporales
  // por si vuelven; sus tarjetas enlazan ya a la web de cada proyecto.
  async redirects() {
    return [
      "/productos/pidoteca",
      "/productos/sportapp",
      "/proyectos/angel-mendoza",
      "/proyectos/enrolla2",
    ].map((source) => ({ source, destination: "/productos", permanent: false }));
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), geolocation=(), microphone=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
