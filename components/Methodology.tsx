import { ClipboardList, FileText, Code2, Key, CheckCircle2 } from "lucide-react"

const steps = [
  {
    day: "Día 1",
    icon: ClipboardList,
    title: "Auditoría de Procesos bajo NDA",
    description:
      "Analizamos tu negocio en profundidad bajo Acuerdo de Confidencialidad. Identificamos cuellos de botella, ineficiencias y oportunidades de digitalización.",
    color: "text-primary-400",
    bg: "bg-primary-400/10",
    border: "border-primary-400/20",
    lineColor: "bg-primary-500",
  },
  {
    day: "Día 6",
    icon: FileText,
    title: "Propuesta Técnica y Presupuesto Cerrado",
    description:
      "Entrega de propuesta técnica detallada y presupuesto cerrado. Sin sorpresas. Sabes exactamente qué vas a recibir y cuánto va a costar.",
    color: "text-accent-400",
    bg: "bg-accent-400/10",
    border: "border-accent-400/20",
    lineColor: "bg-accent-500",
  },
  {
    day: "Desarrollo",
    icon: Code2,
    title: "Programación Ágil — Entregas cada 15 días",
    description:
      "Metodología ágil con sprints de 15 días. Cada dos semanas recibes una entrega funcional que puedes probar y validar con tu equipo.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    lineColor: "bg-emerald-500",
  },
  {
    day: "Entrega",
    icon: Key,
    title: "El Código y la Base de Datos son Tuyos al 100%",
    description:
      "Sin dependencias, sin lock-in. Recibes el código fuente completo y la base de datos. Tu inversión te pertenece para siempre.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    lineColor: "bg-yellow-500",
  },
]

export function Methodology() {
  return (
    <section className="py-24 bg-dark-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
            <CheckCircle2 size={14} />
            Metodología de Trabajo
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Nuestra{" "}
            <span className="text-gradient">Hoja de Ruta</span>
          </h2>
          <p className="text-slate-300 text-lg">
            Un proceso transparente y predecible. Sin sorpresas, sin costes
            ocultos.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.day}
                className={`glass-card rounded-2xl p-6 md:p-8 border ${step.border} bg-gradient-to-br from-slate-800/50 to-dark-900 flex gap-6 items-start hover:scale-[1.01] transition-all duration-300 group`}
              >
                {/* Step number / icon */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <div
                    className={`w-14 h-14 ${step.bg} rounded-xl flex items-center justify-center`}
                  >
                    <Icon size={26} className={step.color} />
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-0.5 h-8 ${step.lineColor} opacity-50`}
                    />
                  )}
                </div>

                <div>
                  <div
                    className={`text-xs font-bold uppercase tracking-widest ${step.color} mb-1`}
                  >
                    {step.day}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
                    {step.description}
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
