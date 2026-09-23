import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/atkinson-hyperlegible-next";
import "./globals.css";
import "./spatial.css";
import { MaskedHeadings } from "@/components/masked-headings";
import { MotionProvider } from "@/components/motion-provider";
import { ScrollProgressRail } from "@/components/scroll-progress-rail";
import { SmoothScroll } from "@/components/smooth-scroll";
import { SpatialLanding } from "@/components/spatial/spatial-landing";
import { absoluteUrl, siteUrl } from "@/lib/site";

const socialImage = absoluteUrl("/opengraph-image");
const socialImageAlt = "Satorus — Tu negocio puede llegar más lejos";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: {
    default: "Satorus | Webs, herramientas e IA para pymes",
    template: "%s | Satorus",
  },
  description:
    "Webs, herramientas e inteligencia artificial para pequeñas y medianas empresas. Te ayudamos a captar clientes, atender mejor y reducir el trabajo manual.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Satorus — Tu negocio puede llegar más lejos",
    description:
      "Webs, herramientas e inteligencia artificial para pequeñas y medianas empresas.",
    url: siteUrl,
    siteName: "Satorus",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: socialImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Satorus — Tu negocio puede llegar más lejos",
    description:
      "Webs, herramientas e inteligencia artificial para pequeñas y medianas empresas.",
    images: [{ url: socialImage, alt: socialImageAlt }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f2f1ea",
  colorScheme: "light",
};

const directionContract = `<!--
THESIS: El trabajo cotidiano entra enredado y sale claro; se rechaza la portada SaaS de hero centrado y mosaico de tarjetas.
OWN-WORLD: Azul herramienta, naranja impulso, lima de etiqueta, grafito y papel frío; escenas materiales, recortes y una ruta continua.
STORY: El visitante reconoce su atasco, entiende que no necesita hablar tecnología y cuenta qué le frena.
FIRST VIEWPORT: Promesa grande sobre papel frío, mesa diagonal protagonista y CTA naranja integrado en la ruta.
FORM: Taller en movimiento, opción B aprobada, semilla b92b95d0.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`;

/* Sin JavaScript nadie retira `data-hero-motion` ni arranca GSAP: el hero se muestra entero. */
const heroMotionFallback = `html[data-hero-motion="prepare"] .hero-kinetic-brand,
html[data-hero-motion="prepare"] .hero-kinetic-copy { visibility: visible !important; }`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-hero-motion="prepare" suppressHydrationWarning>
      <body id="top">
        <Script id="prepare-hero-motion" strategy="beforeInteractive">
          {`var root = document.documentElement;
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            delete root.dataset.heroMotion;
          } else if (window.location.pathname === "/") {
            root.dataset.spatial = "on";
            if (!window.location.hash) root.dataset.spatialIntro = "on";
          }`}
        </Script>
        <noscript>
          <style>{heroMotionFallback}</style>
        </noscript>
        <div
          hidden
          aria-hidden="true"
          data-direction-contract="b92b95d0"
          dangerouslySetInnerHTML={{ __html: directionContract }}
        />
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <SmoothScroll />
        <ScrollProgressRail />
        <MaskedHeadings />
        <SpatialLanding />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
