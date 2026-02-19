import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Aviso Legal | Satorus",
  description: "Aviso legal de Satorus — Información legal sobre el titular del sitio web.",
}

export default function AvisoLegal() {
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
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Aviso Legal</h1>
        <p className="text-slate-500 text-sm mb-12">Última actualización: febrero de {currentYear}</p>

        <div className="space-y-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-3 [&_p]:leading-relaxed [&_p]:text-slate-400 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:text-slate-400">

          <section>
            <h2>1. Titular del sitio web</h2>
            <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos identificativos del titular del presente sitio web:</p>
            <ul>
              <li><strong className="text-slate-300">Denominación:</strong> Satorus (Software a Medida)</li>
              <li><strong className="text-slate-300">Actividad:</strong> Desarrollo de software a medida, aplicaciones web y móviles, y soluciones de digitalización para empresas.</li>
              <li><strong className="text-slate-300">Domicilio:</strong> España</li>
              <li><strong className="text-slate-300">Correo electrónico de contacto:</strong> info@satorus.es</li>
            </ul>
          </section>

          <section>
            <h2>2. Objeto y ámbito de aplicación</h2>
            <p>
              El presente Aviso Legal regula el acceso y uso del sitio web, así como los servicios ofrecidos a través del mismo. El acceso al sitio web implica la aceptación de las presentes condiciones.
            </p>
          </section>

          <section>
            <h2>3. Propiedad intelectual e industrial</h2>
            <p>
              Todos los contenidos del sitio web, incluyendo textos, imágenes, diseño gráfico, código fuente, logotipos y cualquier otro elemento, son titularidad de Satorus o de terceros que han autorizado su uso, y están protegidos por la legislación española e internacional sobre propiedad intelectual e industrial.
            </p>
            <p className="mt-2">
              Queda expresamente prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otra forma de explotación de los contenidos del sitio web sin autorización previa y por escrito del titular.
            </p>
          </section>

          <section>
            <h2>4. Exclusión de responsabilidad</h2>
            <p>
              Satorus no se responsabiliza de los daños o perjuicios de cualquier naturaleza que puedan derivarse del acceso o uso del sitio web, incluyendo los producidos en los sistemas informáticos o los derivados de la introducción de virus informáticos.
            </p>
            <p className="mt-2">
              El titular no garantiza la disponibilidad continua del sitio web, pudiendo suspender, cancelar o restringir el acceso cuando lo estime necesario.
            </p>
          </section>

          <section>
            <h2>5. Legislación aplicable y jurisdicción</h2>
            <p>
              Las presentes condiciones se rigen por la legislación española. Para la resolución de cualquier conflicto derivado del acceso o uso del sitio web, las partes se someten a los Juzgados y Tribunales españoles competentes, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.
            </p>
          </section>

          <section>
            <h2>6. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con el presente Aviso Legal, puede ponerse en contacto con nosotros a través del formulario disponible en el sitio web o mediante el correo electrónico indicado anteriormente.
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
