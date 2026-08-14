import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página solicitada no existe en el sitio web de Satorus.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <main className="legal-page" id="contenido">
        <Link className="legal-back" href="/">
          <ArrowLeft aria-hidden="true" size={19} />
          Volver al inicio
        </Link>
        <article className="legal-article">
          <p className="legal-updated">Error 404</p>
          <h1>Esta página no existe.</h1>
          <p>
            Puede que el enlace haya cambiado o que la dirección no esté completa.
            Puedes volver al inicio o consultar nuestros productos.
          </p>
          <p>
            <Link href="/productos">Ver productos de Satorus</Link>
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
