import {
  Smartphone,
  LayoutDashboard,
  MapPin,
  Bot,
  ArrowRight,
  Code2,
  Cpu,
} from "lucide-react"
import Link from "next/link"
import { clsx } from "clsx"

const nuclearServices = [
  {
    number: "I",
    icon: Smartphone,
    title: "Aplicaciones Web y Móviles a Medida",
    description:
      "Desarrollamos herramientas nativas y escalables pensadas para el uso real en el día a día de tu equipo.",
    tech: ["React", "Node.js", "Flutter"],
    color: "primary",
    gradient: "from-primary-600/20 to-primary-800/5",
    border: "border-primary-500/20",
    iconBg: "bg-primary-500/10",
    iconColor: "text-primary-400",
    badge: "bg-primary-500/10 text-primary-300 border-primary-500/20",
  },
  {
    number: "II",
    icon: LayoutDashboard,
    title: "ERP Personalizado para Pymes",
    description:
      "Tu propio sistema de gestión integral. Facturación, stock, proveedores y clientes en un solo panel diseñado solo para lo que tú necesitas, sin pagar por funciones que no usas.",
    tech: ["Facturación", "Stock", "RRHH"],
    color: "accent",
    gradient: "from-accent-500/20 to-accent-600/5",
    border: "border-accent-500/20",
    iconBg: "bg-accent-500/10",
    iconColor: "text-accent-400",
    badge: "bg-accent-500/10 text-accent-300 border-accent-500/20",
  },
  {
    number: "III",
    icon: MapPin,
    title: "Digitalización de Procesos Locales",
    description:
      "Soluciones específicas para negocios de proximidad. Desde sistemas de reserva para peluquerías hasta gestores de pedidos para carpinterías y talleres.",
    tech: ["Reservas", "Pedidos", "Inventario"],
    color: "emerald",
    gradient: "from-emerald-500/20 to-emerald-600/5",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
]

export function Services() {
  return (
    <section className="py-24 bg-dark-900 relative overflow-hidden" id="services">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
            <Code2 size={14} />
            Servicios Nucleares: Software y Gestión
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            ¿Qué{" "}
            <span className="text-gradient">necesitas</span> hoy?
          </h2>
          <p className="text-slate-300 text-lg">
            Soluciones tecnológicas diseñadas para resolver problemas reales de
            tu Pyme. Sin licencias. Sin ataduras.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {nuclearServices.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.number}
                className={clsx(
                  "relative glass-card rounded-2xl p-8 border flex flex-col group hover:scale-[1.02] transition-all duration-300",
                  service.border,
                  `bg-gradient-to-br ${service.gradient}`
                )}
              >
                {/* Number badge */}
                <div className="absolute top-6 right-6 text-4xl font-black text-slate-700/50 select-none">
                  {service.number}
                </div>

                <div
                  className={clsx(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-6",
                    service.iconBg
                  )}
                >
                  <Icon size={28} className={service.iconColor} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 leading-snug">
                  {service.title}
                </h3>
                <p className="text-slate-300 leading-relaxed flex-1 mb-6">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {service.tech.map((t) => (
                    <span
                      key={t}
                      className={clsx(
                        "text-xs px-3 py-1 rounded-full border font-medium",
                        service.badge
                      )}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* IA section highlight */}
        <div className="relative glass-card rounded-2xl p-8 md:p-12 border border-accent-500/20 bg-gradient-to-r from-accent-600/20 via-slate-800 to-primary-600/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-500/5 to-primary-500/5 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="w-20 h-20 bg-gradient-to-br from-accent-500/20 to-primary-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-accent-500/20">
              <Bot size={40} className="text-accent-400" />
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-medium mb-3">
                <Cpu size={12} />
                Capa de Inteligencia y Automatización
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Automatización RPA y Agentes IA
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                Una vez que tu software funciona, lo hacemos inteligente.
                Automatizamos el cierre de presupuestos, la atención por
                WhatsApp y las campañas de captación por email para que tu
                equipo se centre en{" "}
                <strong className="text-white">vender, no en picar datos</strong>.
              </p>
            </div>
            <Link
              href="#contact"
              className="group shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-accent-600 hover:bg-accent-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-accent-600/20"
            >
              Quiero esto
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
