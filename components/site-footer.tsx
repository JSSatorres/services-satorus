import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

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
        <p>Webs, herramientas y automatizaciones para pymes.</p>
      </div>
      <nav aria-label="Enlaces legales">
        <Link href="/aviso-legal">Aviso legal</Link>
        <Link href="/politica-de-privacidad">Privacidad</Link>
        <Link href="mailto:hola@satorus.es">
          hola@satorus.es
          <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </nav>
      <p className="footer-meta">© {new Date().getFullYear()} Satorus</p>
    </footer>
  );
}
