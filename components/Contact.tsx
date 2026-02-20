import { ContactForm } from "./ContactForm"
import Link from "next/link"
import { Linkedin, Github, Mail, ArrowRight } from "lucide-react"

export function ContactSection() {
  return (
    <section className="py-24 bg-dark-950 relative overflow-hidden" id="contact">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[400px] bg-primary-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Luminous Form Frame */}
          <div className="relative p-[1px] rounded-[2.5rem] bg-gradient-to-br from-primary-500/40 via-transparent to-primary-500/40 shadow-2xl">
             <div className="absolute inset-0 bg-primary-500/5 blur-3xl rounded-[2.5rem]" />
             <div className="glass-card rounded-[2.5rem] p-8 md:p-16 bg-dark-900/90 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-8 uppercase tracking-tighter leading-none">
                      Nuestra <br/><span className="text-primary-400">Hoja de Ruta</span>
                    </h2>
                    <ContactForm />
                  </div>
                  
                  {/* Decorative Side */}
                  <div className="hidden lg:block relative">
                     <div className="w-full aspect-square bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-transparent" />
                        <div className="text-center p-12">
                           <div className="text-8xl mb-6 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">✉️</div>
                           <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">¿Hablamos de tu escalabilidad?</h3>
                           <p className="text-slate-400 text-sm leading-relaxed max-w-[280px] mx-auto opacity-70">
                              Auditamos tu proceso actual sin coste y te entregamos un mapa técnico de mejora en 48 horas.
                           </p>
                        </div>
                     </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-dark-950 py-20 border-t border-white/5">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col items-center gap-8">
           {/* Center Logo */}
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary-500 rounded flex items-center justify-center">
                 <span className="text-white text-[10px] font-black">S</span>
              </div>
              <span className="text-white font-black tracking-tighter text-sm uppercase">Satorus</span>
           </div>
           
           <nav className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              <Link href="/aviso-legal" className="hover:text-primary-400 transition-colors">Legal</Link>
              <Link href="/politica-de-privacidad" className="hover:text-primary-400 transition-colors">Privacidad</Link>
              <Link href="#" className="hover:text-primary-400 transition-colors">Cookies</Link>
           </nav>
           
           <p className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">
              © 2024 Satorus Software Factory. Todos los derechos reservados.
           </p>
        </div>
      </div>
    </footer>
  )
}
