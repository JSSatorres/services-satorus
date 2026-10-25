import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/atkinson-hyperlegible-next";
import "@fontsource-variable/caveat";
import "./globals.css";
import "./book.css";
import "./home-sections.css";
import { MaskedHeadings } from "@/components/masked-headings";
import { MotionProvider } from "@/components/motion-provider";
import { ScrollProgressRail } from "@/components/scroll-progress-rail";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CompanyChat } from "@/components/company-chat";
import { absoluteUrl, siteUrl } from "@/lib/site";
import { jsonLdScript, organizationJsonLd } from "@/lib/structured-data";

const socialImage = absoluteUrl("/opengraph-image");
const socialImageAlt = "Satorus — Tu negocio puede llegar más lejos";
const socialDescription =
  "Software a medida, webs y automatizaciones con IA para pymes, desde Granada.";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: {
    default: "Software a medida, webs e IA para pymes en Granada | Satorus",
    template: "%s | Satorus",
  },
  description:
    "Ingenieros de software en Granada y Armilla: webs, software a medida y automatizaciones con IA para pymes de toda España, explicados sin tecnicismos.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Satorus — Tu negocio puede llegar más lejos",
    description: socialDescription,
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
    description: socialDescription,
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
            root.dataset.book = window.matchMedia("(orientation: landscape) and (max-height: 500px)").matches
              ? "rotate"
              : "on";
          }`}
        </Script>
        <noscript>
          <style>{heroMotionFallback}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(organizationJsonLd)}
        />
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <SmoothScroll />
        <ScrollProgressRail />
        <MaskedHeadings />
        <MotionProvider>{children}</MotionProvider>
        <CompanyChat />
        <Analytics />
      </body>
    </html>
  );
}
