import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad y protección de datos de Satorus.",
  alternates: { canonical: "/politica-de-privacidad" },
  openGraph: {
    title: "Política de privacidad | Satorus",
    description: "Política de privacidad y protección de datos de Satorus.",
    url: "/politica-de-privacidad",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Política de privacidad | Satorus",
    description: "Política de privacidad y protección de datos de Satorus.",
  },
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
          <p className="legal-updated">Última actualización: septiembre de 2026</p>

          <section>
            <h2>1. Responsable del tratamiento</h2>
            <ul>
              <li><strong>Responsable:</strong> Satorus (Software a Medida)</li>
              <li>
                <strong>Finalidad:</strong> atender consultas, solicitudes de
                contacto y presupuesto, y reservar llamadas solicitadas desde el
                asistente.
              </li>
              <li><strong>Contacto:</strong> info@satorus.es</li>
            </ul>
          </section>

          <section>
            <h2>2. Datos que recopilamos</h2>
            <p>
              A través del formulario de contacto recogemos los siguientes datos:
            </p>
            <ul>
              <li>Nombre y apellidos.</li>
              <li>Nombre de la empresa (opcional).</li>
              <li>Correo electrónico.</li>
              <li>
                Información sobre el proyecto o necesidad indicada voluntariamente.
              </li>
            </ul>
            <p>
              Si utilizas el asistente, tratamos los mensajes que escribes y las
              últimas intervenciones de esa conversación para poder responderte.
              No incluyas contraseñas, datos de salud ni información sensible que
              no sea necesaria para tu consulta.
            </p>
            <p>
              Si dejas una consulta en el chat, recogemos tu nombre, correo,
              tipo de consulta y mensaje. Si reservas una llamada, recogemos tu
              nombre, correo, motivo y horario elegido. Para mostrar horarios
              disponibles consultamos los tramos ocupados del calendario de
              Satorus, sin mostrarte el contenido de otras citas.
            </p>
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
                  <td>Responder a los mensajes enviados al asistente con IA.</td>
                  <td>
                    Consentimiento manifestado al enviar la consulta tras recibir
                    la información del propio chat (art. 6.1.a RGPD).
                  </td>
                </tr>
                <tr>
                  <td>Responder a tu solicitud de contacto o presupuesto.</td>
                  <td>Consentimiento del interesado (art. 6.1.a RGPD).</td>
                </tr>
                <tr>
                  <td>
                    Comprobar disponibilidad, crear la cita solicitada y enviar
                    la invitación de Google Calendar con enlace de Meet.
                  </td>
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
            <p>
              Puedes dejar de utilizar el asistente o retirar el consentimiento
              escribiendo a info@satorus.es. La retirada no afecta a los
              tratamientos realizados antes de recibirla. El asistente genera
              respuestas automáticas, pero no toma decisiones con efectos
              jurídicos sobre ti.
            </p>
          </section>

          <section>
            <h2>4. Conservación de datos</h2>
            <p>
              La conversación del asistente se mantiene en la sesión del navegador
              y se envía al servidor para generar cada respuesta. El servidor no
              guarda un historial de esas conversaciones ni usa sus mensajes para
              entrenar el modelo de IA.
            </p>
            <p>
              Las solicitudes de contacto enviadas desde los formularios se
              conservan mientras sea necesario atenderlas y, en su caso, durante
              la relación contractual y los plazos legales aplicables. Las citas
              creadas permanecen en Google Calendar hasta que se cancelan o
              eliminan conforme a la gestión de la agenda. Puedes pedir la
              supresión de tus datos mediante el correo de contacto indicado.
            </p>
          </section>

          <section>
            <h2>5. Destinatarios</h2>
            <p>
              Los proveedores de alojamiento web y correo pueden acceder a los
              datos necesarios para prestar esos servicios. El asistente procesa
              los mensajes con un modelo Ollama configurado en el servidor del
              chat; los mensajes generales no se envían a Google Calendar.
            </p>
            <p>
              Si reservas una llamada, comunicamos a Google Calendar el nombre,
              correo, motivo y horario para crear el evento, añadirte como
              invitado y generar el enlace de Google Meet. Google tratará esos
              datos de acuerdo con sus condiciones y su{" "}
              <a href="https://policies.google.com/privacy" rel="noreferrer">
                política de privacidad
              </a>. No utilizamos los datos obtenidos de Google Calendar para
              publicidad ni para entrenar modelos de IA.
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
