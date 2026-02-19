"use client"

import { FileSpreadsheet, Unplug, BarChart3 } from "lucide-react"

const problems = [
  {
    icon: FileSpreadsheet,
    title: "Hojas de cálculo infinitas",
    description:
      "Datos duplicados y errores humanos que cuestan dinero. Un Excel no es un sistema de gestión.",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
  },
  {
    icon: Unplug,
    title: "Herramientas desconectadas",
    description:
      "Tu inventario no habla con tu facturación ni con tu equipo. Cada departamento va por libre.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
  },
  {
    icon: BarChart3,
    title: "Falta de control real",
    description:
      "No sabes cuánto ganas por cada proyecto o cliente en tiempo real. Gestionas a ciegas.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
]

export function Problem() {
  return (
    <section className="py-24 bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-800/50 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
            El problema real
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Adiós al Caos Operativo
          </h2>
          <p className="text-xl text-slate-300 font-medium">
            ¿Sientes que tu empresa te gestiona a ti?
          </p>
          <p className="text-slate-300 mt-3">
            La mayoría de Pymes en España intentan crecer con herramientas que
            no fueron diseñadas para ellas. Esto tiene un coste real.
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {problems.map((problem) => {
            const Icon = problem.icon
            return (
              <div
                key={problem.title}
                className={`glass-card rounded-2xl p-8 border ${problem.border} bg-gradient-to-br from-slate-800/50 to-dark-900 group hover:scale-[1.02] transition-all duration-300`}
              >
                <div
                  className={`w-14 h-14 ${problem.bg} ${problem.border} border rounded-xl flex items-center justify-center mb-6`}
                >
                  <Icon size={28} className={problem.color} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {problem.title}
                </h3>
                <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
                  {problem.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* CTA bridge */}
        <div className="text-center">
          <div className="inline-block glass-card rounded-2xl px-8 py-6 border border-primary-500/20">
            <p className="text-white font-semibold text-lg mb-1">
              Nosotros hacemos lo contrario
            </p>
            <p className="text-slate-300">
              Adaptamos la tecnología a ti, no al revés. Software diseñado
              exactamente para tus procesos.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
