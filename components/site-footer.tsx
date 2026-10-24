import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { FooterYear } from "@/components/footer-year";
import { companyPhone, companyWhatsappHref } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link
          className="wordmark footer-wordmark"
          href="/"
          aria-label="Satorus, volver al inicio"
          translate="no"
        >
          <BrandLogo />
        </Link>
        <p>
          Webs, herramientas e inteligencia artificial al servicio de tu negocio.
        </p>
      </div>
      <nav aria-label="Enlaces legales">
        <Link href="/aviso-legal">Aviso legal</Link>
        <Link href="/politica-de-privacidad">Privacidad</Link>
        <a
          href={companyWhatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir conversación de WhatsApp con Satorus en el ${companyPhone.display}`}
        >
          WhatsApp {companyPhone.display}
        </a>
        <Link href="mailto:info@satorus.es">
          info@satorus.es
          <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </nav>
      <p className="footer-meta">© <FooterYear initialYear={new Date().getFullYear()} /> Satorus</p>
    </footer>
  );
}
