import { Trophy } from "lucide-react"
import Image from "next/image"

// Using provided PNG logos for major clients
// GoblinTrader logo is kept as SVG as it's not in the logos folder yet

function GoblinTraderLogo() {
  return (
    <svg viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-20 w-auto opacity-100">
      {/* Goblin head simple icon */}
      <circle cx="22" cy="22" r="14" fill="#4ade80" />
      <ellipse cx="17" cy="19" rx="3" ry="4" fill="#166534" />
      <ellipse cx="27" cy="19" rx="3" ry="4" fill="#166534" />
      <path d="M14 28 Q22 34 30 28" stroke="#166534" strokeWidth="2" fill="none" strokeLinecap="round" />
      <polygon points="22,8 18,14 26,14" fill="#166534" />
      {/* GoblinTrader wordmark */}
      <text x="44" y="28" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="18" fill="#4ade80">
        Goblin
      </text>
      <text x="44" y="48" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="18" fill="#ffffff">
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

        {/* Glowing Glass Podium */}
        <div className="max-w-6xl mx-auto mb-24 px-4 relative">
          <p className="text-center text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mb-12">
            Empresas y sectores que confían en nosotros
          </p>
          
          <div className="relative group">
            {/* Podium Top Layer */}
            <div className="podium-top rounded-xl py-6 md:py-8 px-10 flex flex-wrap items-center justify-center gap-12 md:gap-20 relative z-10 transition-transform duration-500 group-hover:-translate-y-1">
              {clients.map((client) => (
                <div
                  key={client.name}
                  className="relative h-6 md:h-7 w-28 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                >
                  {client.image ? (
                    <Image
                      src={client.image}
                      alt={client.name}
                      fill
                      className="object-contain"
                      sizes="150px"
                    />
                  ) : (
                    client.Logo && <client.Logo />
                  )}
                </div>
              ))}
              
              {/* Sector Icons/Badges */}
              {successCases.map((sc) => (
                <div key={sc.label} className="flex items-center gap-2 text-primary-300/50 hover:text-primary-300 transition-colors">
                   <span className="text-lg">🛠️</span>
                   <span className="text-[10px] font-black uppercase tracking-widest">{sc.label.split(' ')[0]}</span>
                </div>
              ))}
            </div>

            {/* Podium Depth/Edge */}
            <div className="podium-edge mx-4 relative z-0" />
            
            {/* Soft Glow below the podium */}
            <div className="absolute -inset-x-20 -bottom-20 h-40 bg-primary-500/10 blur-[100px] pointer-events-none" />
          </div>
        </div>

        {/* Success case badges */}
        <div className="border-t border-slate-800/50 pt-12">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold text-center mb-8">
            También trabajamos con Pymes locales
          </p>
          <div className="grid grid-cols-1 sm:flex sm:flex-wrap justify-center gap-4">
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
