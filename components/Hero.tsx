import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden animated-bg noise">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-light text-sm text-primary-300 mb-8 border border-primary-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Software a medida para Pymes en España
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight">
            Software a Medida y{" "}
            <span className="text-gradient">Automatización IA</span> para tu
            empresa en <span className="text-gradient">Granada</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            No instalamos programas genéricos. Creamos aplicaciones web y
            móviles a medida que{" "}
            <strong className="text-white">centralizan tu gestión</strong>,
            eliminan el caos de los Excel y{" "}
            <strong className="text-white">
              profesionalizan cada proceso
            </strong>{" "}
            de tu negocio.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="#contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary-600/30 hover:shadow-primary-500/40 hover:scale-105"
            >
              Solicitar Auditoría y Presupuesto Técnico
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center gap-2 px-8 py-4 glass-card text-slate-200 font-medium rounded-xl hover:border-primary-500/40 transition-all duration-300"
            >
              Ver Soluciones
            </Link>
          </div>

          {/* Social proof stats */}
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
            {[
              { value: "100%", label: "Código tuyo" },
              { value: "48h", label: "Primera propuesta" },
              { value: "0€", label: "Licencias mensuales" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-gradient">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-300 mt-1">{stat.label}</div>
              </div>
            ))}
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
