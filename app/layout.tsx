import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/atkinson-hyperlegible-next";
import "./globals.css";
import { MaskedHeadings } from "@/components/masked-headings";
import { MotionProvider } from "@/components/motion-provider";
import { ScrollProgressRail } from "@/components/scroll-progress-rail";
import { SmoothScroll } from "@/components/smooth-scroll";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body id="top">
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <SmoothScroll />
        <ScrollProgressRail />
        <MaskedHeadings />
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
