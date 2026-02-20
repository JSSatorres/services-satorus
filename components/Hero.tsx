import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center pt-12 overflow-hidden bg-dark-950">
      {/* SATORUS LOGO at Top Center */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
         <div className="w-6 h-6 bg-primary-500 rounded flex items-center justify-center">
            <span className="text-white text-[10px] font-black">S</span>
         </div>
         <span className="text-white font-black tracking-tighter text-sm uppercase">Satorus</span>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-24 md:pt-32">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-950/50 border border-primary-500/20 text-[10px] text-primary-300 mb-8 uppercase tracking-widest font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              Software Factory de Alto Rendimiento
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] mb-6 tracking-tight text-white max-w-xl">
              Satorus: Desarrollamos el Software que <br/>
              <span className="text-gradient">Controla y Escala tu Pyme.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-slate-400 text-lg max-w-lg mb-10 leading-relaxed">
              No instalamos programas genéricos. Creamos aplicaciones web y
              móviles y médica gestión a eliminen fricción operativa.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-b from-primary-500 to-primary-700 text-white font-bold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-[1.02] border border-white/10"
              >
                Solicitar Auditoría y Presupuesto Técnico
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center px-10 py-4 glass-card text-white font-bold rounded-lg hover:bg-white/5 transition-all duration-300 border border-white/10"
              >
                Ver Soluciones
              </Link>
            </div>
          </div>

          {/* Isometric Image Placeholder */}
          <div className="flex-1 w-full max-w-[600px] visible">
            <div className="iso-tilt relative">
               <div className="w-full aspect-[4/3] bg-white rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] border-[12px] border-dark-800 flex items-center justify-center">
                  <div className="text-center">
                     <p className="font-black text-2xl text-dark-900 opacity-20 uppercase tracking-tighter">Isometric View</p>
                     <p className="text-dark-900 opacity-10 mt-2">Dashboard Visuals Here</p>
                  </div>
               </div>
               {/* Luminous glow below the board */}
               <div className="absolute -inset-4 bg-primary-500/20 blur-3xl -z-10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown size={24} className="text-slate-400" />
      </div>
    </section>
  )
}
