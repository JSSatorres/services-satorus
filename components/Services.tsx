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

const serviceCategories = [
  { title: "Web & Mobile Apps", desc: "Desarrollo empresarial robusto, React, Node.js y móviles en múltiples entornos.", icon: "📱" },
  { title: "ERP & CRM a Medida", desc: "No adaptamos tu empresa al software. Creamos las herramientas que encajan en tu flujo de trabajo.", icon: "⚙️" },
  { title: "Digitalización de Procesos", desc: "Sistemas de reserva, e-stock inteligente y automatización de venta (POS).", icon: "📟" },
  { title: "AI & RPA", desc: "Automatización de tareas con IA y procesos repetitivos Agentes de IA.", icon: "🤖" },
  { title: "LegalTech", desc: "Cumplimiento nativo con normativa VeriFactu.", icon: "🛡️" },
  { title: "Tecnología de Vanguardia", desc: "Sistemas de reserva e-stock. Desarrollamos técnica de IA.", icon: "🏢" },
]

export function Services() {
  return (
    <section className="py-24 bg-dark-950 relative overflow-hidden" id="services">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary-600/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
            Soluciones de Software que hablan tu idioma de negocio
          </h2>
        </div>

        {/* Service cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 max-w-7xl mx-auto px-4">
          {serviceCategories.map((service) => {
            return (
              <div
                key={service.title}
                className="flex flex-col items-center group text-center"
              >
                {/* 3D Isometric Platform (Circuit Board Look) */}
                <div className="relative w-full aspect-square max-w-[280px] mb-8">
                   <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-44 bg-dark-800 border-b-[8px] border-dark-900 border-x border-t border-white/5 rounded-2xl luminous-board group-hover:scale-105 transition-transform duration-500">
                      {/* Glow inside the board */}
                      <div className="absolute inset-0 bg-primary-500/10 blur-2xl opacity-50" />
                      
                      {/* Floating Icon/Graphic */}
                      <div className="absolute -top-16 inset-x-0 flex items-center justify-center">
                         <div className="text-6xl transform -rotate-12 group-hover:-translate-y-4 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_20px_40px_rgba(59,130,246,0.3)]">
                            {service.icon}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="px-6">
                  <h3 className="text-xl font-black text-white mb-3 leading-tight uppercase tracking-wider">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-[1.6] max-w-[280px] mx-auto opacity-70 group-hover:opacity-100 transition-opacity">
                    {service.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
