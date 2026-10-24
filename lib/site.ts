const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.satorus.es";

export const siteUrl = new URL(configuredSiteUrl).origin;

// Teléfono de empresa: se muestra agrupado y se marca en formato E.164.
export const companyPhone = {
  display: "614 43 18 97",
  href: "tel:+34614431897",
};

export const companyWhatsappHref = `https://wa.me/${companyPhone.href.replace("tel:+", "")}?text=${encodeURIComponent("Hola, vengo de satorus.es y quiero hacer una consulta.")}`;

export function absoluteUrl(pathname: string) {
  return new URL(pathname, `${siteUrl}/`).toString();
}
