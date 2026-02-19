import { Trophy } from "lucide-react"
import Image from "next/image"

// Using provided PNG logos for major clients
// GoblinTrader logo is kept as SVG as it's not in the logos folder yet

function GoblinTraderLogo() {
  return (
    <svg viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto opacity-90">
      {/* Goblin head simple icon */}
      <circle cx="22" cy="22" r="14" fill="#4ade80" />
      <ellipse cx="17" cy="19" rx="3" ry="4" fill="#166534" />
      <ellipse cx="27" cy="19" rx="3" ry="4" fill="#166534" />
      <path d="M14 28 Q22 34 30 28" stroke="#166534" strokeWidth="2" fill="none" strokeLinecap="round" />
      <polygon points="22,8 18,14 26,14" fill="#166534" />
      {/* GoblinTrader wordmark */}
      <text x="44" y="28" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="16" fill="#4ade80">
        Goblin
      </text>
      <text x="44" y="46" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="16" fill="#ffffff">
        Trader
      </text>
    </svg>
  )
}

const clients = [
  {
    name: "CaixaBank",
    detail: "Desarrollo aplicación interna nuevos clientes",
    image: "/logos/la caixa.png",
    accentColor: "border-blue-500/30",
    glowColor: "hover:shadow-blue-500/10",
  },
  {
    name: "Banco Santander",
    detail: "Desarrollo de herramienta de gestión interna",
    image: "/logos/santander.png",
    accentColor: "border-red-500/30",
    glowColor: "hover:shadow-red-500/10",
  },
  {
    name: "GoblinTrader",
    detail: "ERP de eCommerce, stock y gestión de pedidos",
    Logo: GoblinTraderLogo,
    accentColor: "border-green-500/30",
    glowColor: "hover:shadow-green-500/10",
  },
]

const successCases = [
  { emoji: "✂️", label: "Peluquerías de autor", detail: "Sistema de reservas online" },
  { emoji: "🔨", label: "Carpinterías industriales", detail: "Gestión de pedidos y materiales" },
  { emoji: "🔧", label: "Talleres locales", detail: "Control de tiempos y clientes" },
]

export function Partners() {
  return (
    <section className="py-24 bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900/30 to-dark-900/60 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-700/50 border border-slate-600/30 text-slate-300 text-sm font-medium mb-6">
            <Trophy size={14} className="text-yellow-400" />
            Clientes que ya confían en nosotros
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Empresas que ya operan con{" "}
            <span className="text-gradient">nuestro software</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Hemos desarrollado soluciones reales para estas empresas. No son
            partners, son clientes satisfechos cuyo negocio ya funciona con el
            software que construimos juntos.
          </p>
        </div>

        {/* Client logos grid */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
          {clients.map((client) => {
            return (
              <div
                key={client.name}
                className={`glass-card rounded-2xl p-6 flex flex-col items-center justify-between text-center border ${client.accentColor} bg-gradient-to-br from-slate-800/50 to-dark-900 hover:scale-105 transition-all duration-300 hover:shadow-xl ${client.glowColor} group min-h-[160px]`}
              >
                <div className="flex-1 flex items-center justify-center w-full mb-4">
                  {client.image ? (
                    <div className="relative w-full h-12">
                      <Image
                        src={client.image}
                        alt={client.name}
                        fill
                        className="object-contain"
                        sizes="(max-w-768px) 100vw, 250px"
                      />
                    </div>
                  ) : (
                    client.Logo && <client.Logo />
                  )}
                </div>
                <p className="text-slate-300 text-xs leading-relaxed mt-auto group-hover:text-slate-200 transition-colors">
                  {client.detail}
                </p>
              </div>
            )
          })}
        </div>

        {/* Success case badges */}
        <div className="border-t border-slate-800/50 pt-12">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold text-center mb-8">
            También trabajamos con Pymes locales
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {successCases.map((c) => (
              <div
                key={c.label}
                className="glass-card-light rounded-xl px-5 py-3 flex items-center gap-3 border border-slate-700/20"
              >
                <span className="text-xl">{c.emoji}</span>
                <div>
                  <div className="font-semibold text-white text-sm">{c.label}</div>
                  <div className="text-slate-300 text-xs">{c.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
