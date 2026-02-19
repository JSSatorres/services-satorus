import { ShieldCheck, FileCheck2, AlertTriangle } from "lucide-react"

export function LegalTech() {
  return (
    <section className="py-24 bg-dark-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main card */}
          <div className="glass-card rounded-3xl p-8 md:p-12 border border-green-500/30 bg-gradient-to-br from-green-500/10 via-dark-800/80 to-dark-900 relative overflow-hidden">
            {/* Decorative shield */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <ShieldCheck size={256} className="text-green-500" />
            </div>

            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck size={28} className="text-green-400" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold uppercase tracking-wider mb-3">
                    Cumplimiento Legal Garantizado — LegalTech
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    Adaptación VeriFactu y{" "}
                    <span className="text-green-400">Ley de Fichaje</span>
                  </h2>
                </div>
              </div>

              <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
                Todo nuestro software nace cumpliendo el{" "}
                <strong className="text-white">Real Decreto 1007/2023</strong>.
                Olvídate de multas de hasta{" "}
                <strong className="text-red-400">50.000€</strong>; tu
                facturación y registro de jornada serán siempre íntegros,
                trazables e inalterables.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-slate-800/80 to-dark-900 rounded-xl p-5 border border-slate-700/50 group hover:border-green-500/30 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <FileCheck2 size={20} className="text-green-400" />
                    <span className="font-semibold text-white">
                      VeriFactu Integrado
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Generación de facturas con código QR verificable, huella
                    digital y registro en la AEAT de forma automática.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-slate-800/80 to-dark-900 rounded-xl p-5 border border-slate-700/50 group hover:border-blue-500/30 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <ShieldCheck size={20} className="text-blue-400" />
                    <span className="font-semibold text-white">
                      Control de Jornada Legal
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Sistema de fichaje digital integrado que cumple con el Real
                    Decreto Ley de registro de jornada. Protege a tu empresa.
                  </p>
                </div>
              </div>

              {/* Warning callout */}
              <div className="mt-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <AlertTriangle
                  size={18}
                  className="text-red-400 shrink-0 mt-0.5"
                />
                <p className="text-sm text-slate-200">
                  <strong className="text-red-400">
                    Multas de hasta 50.000€
                  </strong>{" "}
                  por incumplimiento de VeriFactu. Desde el primer día, tu
                  software estará cubierto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
