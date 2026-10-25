import { faqs } from "@/lib/home-content";
import { absoluteUrl, companyPhone, siteUrl } from "@/lib/site";

// Datos estructurados (JSON-LD) que Google usa para entender quién es Satorus,
// dónde trabaja y qué responde la portada. Solo hechos públicos y verificables.

const organizationId = `${siteUrl}/#organization`;

const places = [
  { "@type": "City", name: "Granada" },
  { "@type": "City", name: "Armilla" },
  { "@type": "Country", name: "España" },
];

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": organizationId,
      name: "Satorus",
      url: `${siteUrl}/`,
      logo: absoluteUrl("/brand/satorus-logo-transparent.png"),
      image: absoluteUrl("/opengraph-image"),
      description:
        "Equipo de ingenieros de software de Granada: páginas web, software a medida y automatizaciones con inteligencia artificial para pymes.",
      telephone: companyPhone.href.replace("tel:", ""),
      email: "info@satorus.es",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Armilla",
        addressRegion: "Granada",
        addressCountry: "ES",
      },
      areaServed: places,
      knowsAbout: [
        "Desarrollo de software a medida",
        "Diseño y desarrollo web",
        "Automatización de procesos con inteligencia artificial",
        "Verifactu",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "Satorus",
      inLanguage: "es-ES",
      publisher: { "@id": organizationId },
    },
  ],
};

export const homeFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

/** Serializa para un <script type="application/ld+json"> sin permitir cerrar la etiqueta. */
export function jsonLdScript(data: object) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
