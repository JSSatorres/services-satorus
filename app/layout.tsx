import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/atkinson-hyperlegible-next";
import "./globals.css";
import { MotionProvider } from "@/components/motion-provider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.satorus.es";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Satorus | Webs y automatizaciones para pymes",
    template: "%s | Satorus",
  },
  description:
    "Webs, herramientas a medida y automatizaciones para pymes, explicadas sin tecnicismos.",
  openGraph: {
    title: "Satorus — Tu negocio, menos enredado",
    description:
      "Webs, herramientas a medida y automatizaciones para pymes, explicadas sin tecnicismos.",
    url: siteUrl,
    siteName: "Satorus",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Satorus — Tu negocio, menos enredado",
    description:
      "Webs, herramientas a medida y automatizaciones para pymes, explicadas sin tecnicismos.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body id="top">
        <div
          hidden
          aria-hidden="true"
          data-direction-contract="b92b95d0"
          dangerouslySetInnerHTML={{ __html: directionContract }}
        />
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
