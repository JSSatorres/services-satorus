import { ClipboardList, FileText, Code2, Key, CheckCircle2 } from "lucide-react"
import { clsx } from "clsx"

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

        {/* Roadmap Steps */}
        <div className="relative max-w-5xl mx-auto mt-24">
          {/* Horizontal Connecting Line */}
          <div className="hidden md:block absolute top-[72px] inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => {
              const isEven = (index + 1) % 2 === 0
              return (
                <div key={step.day} className="flex flex-col items-center group">
                  {/* Text for even steps (above sphere) */}
                  <div className={clsx(
                    "md:mb-10 md:h-24 transition-all duration-500",
                    !isEven && "md:invisible md:opacity-0"
                  )}>
                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 text-[10px] leading-relaxed max-w-[140px] mx-auto opacity-70">
                      {step.description}
                    </p>
                  </div>

                  {/* 3D Glowing Sphere */}
                  <div className="relative w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                     <div className="absolute inset-0 sphere-3d rounded-full overflow-hidden">
                        {/* Internal Glow/Highlight */}
                        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white/20 blur-md rounded-full" />
                     </div>
                     <span className="relative z-10 text-4xl font-black text-white/90 drop-shadow-2xl">{index + 1}</span>
                     
                     {/* Outer Aura Glow */}
                     <div className="absolute inset-x-0 bottom-0 h-1/2 bg-primary-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Text for odd steps (below sphere) */}
                  <div className={clsx(
                    "mt-10 md:h-24 transition-all duration-500",
                    isEven && "md:invisible md:opacity-0"
                  )}>
                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 text-[10px] leading-relaxed max-w-[140px] mx-auto opacity-70">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
