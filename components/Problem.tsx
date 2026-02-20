"use client"

import { FileSpreadsheet, Unplug, BarChart3 } from "lucide-react"

const problems = [
  {
    title: "Errores en Excel",
    description: "Identifica el error humano, las versiones de infinitas en la mano y pérdida de ingresos que ahora existen.",
    color: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    icon: "X",
  },
  {
    title: "Herramientas Desconectadas",
    description: "Deja de saltar entre 5 pestañas diferentes. Satorus crea una sola plataforma centralizada.",
    color: "text-amber-400",
    glow: "shadow-amber-500/20",
    icon: "🔗",
  },
  {
    title: "Falta de Control",
    description: "Sabes cuánto ganas por hora? Tomas decisiones basadas en datos reales en un panel unificado.",
    color: "text-blue-400",
    glow: "shadow-blue-500/20",
    icon: "📊",
  },
]

export function Problem() {
  return (
    <section className="py-24 bg-dark-950 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
            Adiós al Caos Operativo
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
            Identificamos los cuellos de botella que frenan tu crecimiento diario.
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto px-4">
          {problems.map((problem) => {
            return (
              <div
                key={problem.title}
                className="flex flex-col items-center group text-center"
              >
                {/* 3D Isometric Platform (Circuit Board Look) */}
                <div className="relative w-full aspect-square max-w-[240px] mb-8">
                   <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-40 bg-dark-800 border-b-[8px] border-dark-900 border-x border-t border-white/5 rounded-2xl luminous-board group-hover:scale-105 transition-transform duration-500">
                      {/* Glow inside the board */}
                      <div className={`absolute inset-0 bg-primary-500/5 blur-xl opacity-50`} />
                      
                      {/* Visual on top of the platform */}
                      <div className="absolute -top-12 inset-x-0 flex items-center justify-center">
                         <div className={`w-24 h-24 flex items-center justify-center text-4xl transform -rotate-12 group-hover:scale-110 transition-transform duration-500 ${problem.color}`}>
                            {problem.icon}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="px-4">
                  <h3 className="text-xl font-black text-white mb-3 leading-tight uppercase tracking-wider">
                    {problem.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-[1.6] max-w-[240px] mx-auto opacity-70 group-hover:opacity-100 transition-opacity">
                    {problem.description}
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
