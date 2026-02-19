import { ContactForm } from "./ContactForm"
import Link from "next/link"
import { Linkedin, Github, Mail, ArrowRight } from "lucide-react"

export function ContactSection() {
  return (
    <section className="py-24 bg-dark-900 relative overflow-hidden" id="contact">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left Side: CTA (2 cols) */}
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
              <Mail size={14} />
              Pide tu Presupuesto
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              ¿Hablamos de tu{" "}
              <span className="text-gradient">proyecto</span>?
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              No importa si eres una peluquería, un bar o una nave industrial.
              Si tienes un proceso que mejorar,{" "}
              <strong className="text-white">
                tenemos el código para hacerlo
              </strong>
              .
            </p>

            {/* Why now box */}
            <div className="glass-card rounded-2xl p-6 border border-primary-500/15">
              <div className="flex items-start gap-3">
                <ArrowRight size={18} className="text-primary-400 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    ¿Por qué ahora?
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    La normativa <strong className="text-white">VeriFactu</strong> y
                    el <strong className="text-white">Kit Digital</strong> están
                    impulsando la digitalización. No te quedes atrás mientras tu
                    competencia avanza.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form (3 cols) */}
          <div className="lg:col-span-3 glass-card rounded-3xl p-8 border border-slate-700/30">
            <h3 className="text-xl font-bold text-white mb-6">
              Solicitud de Proyecto
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-slate-800/50 py-10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-black text-sm">
              S
            </div>
            <span className="font-bold text-white">Satorus</span>
            <span className="text-slate-600 text-sm">
              © {new Date().getFullYear()}
            </span>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/aviso-legal" className="hover:text-slate-300 transition-colors">
              Aviso Legal
            </Link>
            <Link href="/politica-de-privacidad" className="hover:text-slate-300 transition-colors">
              Política de Privacidad
            </Link>
          </div>

     
        </div>
      </div>
    </footer>
  )
}
