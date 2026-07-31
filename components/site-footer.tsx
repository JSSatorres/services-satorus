import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <a
          className="wordmark footer-wordmark"
          href="#top"
          aria-label="Satorus, volver al inicio"
          translate="no"
        >
          <BrandLogo />
        </a>
        <p>Webs, herramientas y automatizaciones para pymes.</p>
      </div>
      <nav aria-label="Enlaces legales">
        <a href="/aviso-legal">Aviso legal</a>
        <a href="/politica-de-privacidad">Privacidad</a>
        <a href="mailto:hola@satorus.es">
          hola@satorus.es
          <ArrowUpRight aria-hidden="true" size={16} />
        </a>
      </nav>
      <p className="footer-meta">© {new Date().getFullYear()} Satorus</p>
    </footer>
  );
}
