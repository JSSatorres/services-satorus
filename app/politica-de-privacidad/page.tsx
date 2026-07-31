import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad y protección de datos de Satorus.",
};

export default function PrivacyPage() {
  return (
    <>
      <main className="legal-page" id="contenido">
        <Link className="legal-back" href="/">
          <ArrowLeft aria-hidden="true" size={19} />
          Volver al inicio
        </Link>
        <article className="legal-article">
          <h1>Política de privacidad</h1>
          <p className="legal-updated">Última actualización: febrero de 2026</p>

          <section>
            <h2>1. Responsable del tratamiento</h2>
            <ul>
              <li><strong>Responsable:</strong> Satorus (Software a Medida)</li>
              <li>
                <strong>Finalidad:</strong> gestión de solicitudes de contacto y
                presupuesto.
              </li>
              <li><strong>Contacto:</strong> info@satorus.es</li>
            </ul>
          </section>

          <section>
            <h2>2. Datos que recopilamos</h2>
            <p>
              A través del formulario de contacto recogemos los siguientes datos
              personales:
            </p>
            <ul>
              <li>Nombre y apellidos.</li>
              <li>Nombre de la empresa (opcional).</li>
              <li>Correo electrónico.</li>
              <li>
                Información sobre el proyecto o necesidad indicada voluntariamente.
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Finalidad y base jurídica del tratamiento</h2>
            <table>
              <thead>
                <tr>
                  <th>Finalidad</th>
                  <th>Base jurídica</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Responder a tu solicitud de contacto o presupuesto.</td>
                  <td>Consentimiento del interesado (art. 6.1.a RGPD).</td>
                </tr>
                <tr>
                  <td>Gestión de la relación comercial y envío de propuestas.</td>
                  <td>Ejecución de un precontrato (art. 6.1.b RGPD).</td>
                </tr>
                <tr>
                  <td>Cumplimiento de obligaciones legales.</td>
                  <td>Obligación legal (art. 6.1.c RGPD).</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>4. Conservación de datos</h2>
            <p>
              Los datos personales se conservarán durante el tiempo necesario para
              atender tu solicitud y, en su caso, durante la vigencia de la relación
              contractual, más los plazos legales de prescripción aplicables (con
              carácter general, 5 años para obligaciones mercantiles y 4 años para
              obligaciones tributarias).
            </p>
          </section>

          <section>
            <h2>5. Destinatarios</h2>
            <p>
              No se cederán datos a terceros salvo obligación legal. Los datos
              podrán ser accedidos por proveedores de servicios tecnológicos
              (alojamiento web, correo electrónico) que actúan como encargados del
              tratamiento bajo las garantías contractuales exigidas por el RGPD.
            </p>
          </section>

          <section>
            <h2>6. Tus derechos</h2>
            <p>
              Puedes ejercer en cualquier momento los siguientes derechos enviando
              un correo a <strong>info@satorus.es</strong>:
            </p>
            <ul>
              <li><strong>Acceso:</strong> conocer qué datos tratamos sobre ti.</li>
              <li>
                <strong>Rectificación:</strong> corregir datos inexactos o
                incompletos.
              </li>
              <li><strong>Supresión:</strong> solicitar la eliminación de tus datos.</li>
              <li>
                <strong>Oposición y limitación:</strong> oponerte al tratamiento o
                solicitar su limitación.
              </li>
              <li>
                <strong>Portabilidad:</strong> recibir tus datos en formato
                estructurado.
              </li>
            </ul>
            <p>
              Si consideras que el tratamiento no se ajusta a la normativa, tienes
              derecho a presentar una reclamación ante la{" "}
              <a href="https://www.aepd.es" rel="noreferrer">
                Agencia Española de Protección de Datos
              </a>.
            </p>
          </section>

          <section>
            <h2>7. Cookies</h2>
            <p>
              Este sitio web utiliza únicamente cookies técnicas estrictamente
              necesarias para el funcionamiento del sitio. No se utilizan cookies
              de rastreo, analítica o publicidad de terceros que requieran
              consentimiento.
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
