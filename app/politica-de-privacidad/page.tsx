import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Política de Privacidad | Satorus",
  description: "Política de privacidad de Satorus — Cómo tratamos tus datos personales.",
}

export default function PoliticaPrivacidad() {
  const currentYear = new Date().getFullYear()

  return (
    <main className="min-h-screen bg-dark-900 text-slate-300">
      {/* Back nav */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        </div>
      </div>

      <article className="container mx-auto px-4 sm:px-6 py-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Política de Privacidad</h1>
        <p className="text-slate-500 text-sm mb-12">Última actualización: febrero de {currentYear}</p>

        <div className="space-y-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-3 [&_p]:leading-relaxed [&_p]:text-slate-400 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:text-slate-400 [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:text-white [&_th]:font-semibold [&_th]:pb-2 [&_td]:py-2 [&_td]:border-t [&_td]:border-slate-800">

          <section>
            <h2>1. Responsable del tratamiento</h2>
            <ul>
              <li><strong className="text-slate-300">Responsable:</strong> Satorus (Software a Medida)</li>
              <li><strong className="text-slate-300">Finalidad:</strong> Gestión de solicitudes de contacto y presupuesto</li>
              <li><strong className="text-slate-300">Contacto:</strong> info@satorus.es</li>
            </ul>
          </section>

          <section>
            <h2>2. Datos que recopilamos</h2>
            <p>A través del formulario de contacto recogemos los siguientes datos personales:</p>
            <ul>
              <li>Nombre y apellidos</li>
              <li>Nombre de la empresa (opcional)</li>
              <li>Correo electrónico</li>
              <li>Información sobre el proyecto o necesidad indicada voluntariamente</li>
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
                  <td>Responder a tu solicitud de contacto o presupuesto</td>
                  <td>Consentimiento del interesado (art. 6.1.a RGPD)</td>
                </tr>
                <tr>
                  <td>Gestión de la relación comercial y envío de propuestas</td>
                  <td>Ejecución de un precontrato (art. 6.1.b RGPD)</td>
                </tr>
                <tr>
                  <td>Cumplimiento de obligaciones legales</td>
                  <td>Obligación legal (art. 6.1.c RGPD)</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2>4. Conservación de datos</h2>
            <p>
              Los datos personales se conservarán durante el tiempo necesario para atender tu solicitud y, en su caso, durante la vigencia de la relación contractual, más los plazos legales de prescripción aplicables (con carácter general, 5 años para obligaciones mercantiles y 4 años para obligaciones tributarias).
            </p>
          </section>

          <section>
            <h2>5. Destinatarios</h2>
            <p>
              No se cederán datos a terceros salvo obligación legal. Los datos podrán ser accedidos por proveedores de servicios tecnológicos (alojamiento web, correo electrónico) que actúan como encargados del tratamiento bajo las garantías contractuales exigidas por el RGPD.
            </p>
          </section>

          <section>
            <h2>6. Tus derechos</h2>
            <p>Puedes ejercer en cualquier momento los siguientes derechos enviando un correo a <strong className="text-slate-300">info@satorus.es</strong>:</p>
            <ul>
              <li><strong className="text-slate-300">Acceso</strong> — conocer qué datos tratamos sobre ti.</li>
              <li><strong className="text-slate-300">Rectificación</strong> — corregir datos inexactos o incompletos.</li>
              <li><strong className="text-slate-300">Supresión</strong> — solicitar la eliminación de tus datos.</li>
              <li><strong className="text-slate-300">Oposición y limitación</strong> — oponerte al tratamiento o solicitar su limitación.</li>
              <li><strong className="text-slate-300">Portabilidad</strong> — recibir tus datos en formato estructurado.</li>
            </ul>
            <p className="mt-3">
              Si consideras que el tratamiento no se ajusta a la normativa, tienes derecho a presentar una reclamación ante la <strong className="text-slate-300">Agencia Española de Protección de Datos</strong> (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">www.aepd.es</a>).
            </p>
          </section>

          <section>
            <h2>7. Cookies</h2>
            <p>
              Este sitio web utiliza únicamente cookies técnicas estrictamente necesarias para el funcionamiento del sitio. No se utilizan cookies de rastreo, analítica o publicidad de terceros que requieran consentimiento.
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
