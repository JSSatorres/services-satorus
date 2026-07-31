import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal del sitio web de Satorus.",
};

export default function LegalNoticePage() {
  return (
    <>
      <main className="legal-page" id="contenido">
        <Link className="legal-back" href="/">
          <ArrowLeft aria-hidden="true" size={19} />
          Volver al inicio
        </Link>
        <article className="legal-article">
          <h1>Aviso legal</h1>
          <p className="legal-updated">Última actualización: febrero de 2026</p>

          <section>
            <h2>1. Titular del sitio web</h2>
            <p>
              En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio,
              de Servicios de la Sociedad de la Información y de Comercio
              Electrónico (LSSI-CE), se informa de los datos identificativos del
              titular del presente sitio web:
            </p>
            <ul>
              <li><strong>Denominación:</strong> Satorus (Software a Medida)</li>
              <li>
                <strong>Actividad:</strong> desarrollo de software a medida,
                aplicaciones web y móviles, y soluciones de digitalización para
                empresas.
              </li>
              <li><strong>Domicilio:</strong> España</li>
              <li><strong>Correo electrónico:</strong> info@satorus.es</li>
            </ul>
          </section>

          <section>
            <h2>2. Objeto y ámbito de aplicación</h2>
            <p>
              El presente Aviso Legal regula el acceso y uso del sitio web, así
              como los servicios ofrecidos a través del mismo. El acceso al sitio
              web implica la aceptación de las presentes condiciones.
            </p>
          </section>

          <section>
            <h2>3. Propiedad intelectual e industrial</h2>
            <p>
              Todos los contenidos del sitio web, incluyendo textos, imágenes,
              diseño gráfico, código fuente, logotipos y cualquier otro elemento,
              son titularidad de Satorus o de terceros que han autorizado su uso,
              y están protegidos por la legislación española e internacional
              sobre propiedad intelectual e industrial.
            </p>
            <p>
              Queda expresamente prohibida la reproducción, distribución,
              comunicación pública, transformación o cualquier otra forma de
              explotación de los contenidos del sitio web sin autorización previa
              y por escrito del titular.
            </p>
          </section>

          <section>
            <h2>4. Exclusión de responsabilidad</h2>
            <p>
              Satorus no se responsabiliza de los daños o perjuicios de cualquier
              naturaleza que puedan derivarse del acceso o uso del sitio web,
              incluyendo los producidos en los sistemas informáticos o los
              derivados de la introducción de virus informáticos.
            </p>
            <p>
              El titular no garantiza la disponibilidad continua del sitio web,
              pudiendo suspender, cancelar o restringir el acceso cuando lo estime
              necesario.
            </p>
          </section>

          <section>
            <h2>5. Legislación aplicable y jurisdicción</h2>
            <p>
              Las presentes condiciones se rigen por la legislación española. Para
              la resolución de cualquier conflicto derivado del acceso o uso del
              sitio web, las partes se someten a los Juzgados y Tribunales españoles
              competentes, con renuncia expresa a cualquier otro fuero que pudiera
              corresponderles.
            </p>
          </section>

          <section>
            <h2>6. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con el presente Aviso Legal,
              puede ponerse en contacto mediante el formulario del sitio web o el
              correo electrónico indicado anteriormente.
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
