import { ContactForm } from "./ContactForm"
import Link from "next/link"
import { Linkedin, Github } from "lucide-react"

export function ContactSection() {
  return (
    <section className="py-20 bg-slate-50" id="contact">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side: Call to Action */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              ¿Hablamos de tu proyecto?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              No importa si eres una peluquería, un bar o una nave industrial.
              Si tienes un proceso que mejorar, tenemos el código para hacerlo.
            </p>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
              <h3 className="font-semibold text-slate-900 mb-2">
                ¿Por qué ahora?
              </h3>
              <p className="text-slate-600">
                La normativa Verifactu y el Kit Digital están impulsando la
                digitalización. No te quedes atrás.
              </p>
            </div>

            <div className="flex gap-4">
              {/* Socials Placeholders */}
              <Link
                href="#"
                className="p-3 bg-white rounded-full text-slate-600 hover:text-primary-600 hover:shadow-md transition-all"
              >
                <Linkedin size={24} />
              </Link>
              <Link
                href="#"
                className="p-3 bg-white rounded-full text-slate-600 hover:text-slate-900 hover:shadow-md transition-all"
              >
                <Github size={24} />
              </Link>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm">
            © {new Date().getFullYear()} Software a Medida. Todos los derechos
            reservados.
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="hover:text-white transition-colors">
              Aviso Legal
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Política de Privacidad
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Tecnología de alto rendimiento (Next.js/Vercel)
          </div>
        </div>
      </div>
    </footer>
  )
}
