const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.satorus.es";

export const siteUrl = new URL(configuredSiteUrl).origin;

export function absoluteUrl(pathname: string) {
  return new URL(pathname, `${siteUrl}/`).toString();
}
