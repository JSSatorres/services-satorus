import { CheckCircle2 } from "lucide-react"

export function Portfolio() {
  return (
    <section className="py-20 bg-white" id="portfolio">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
          Soluciones que ya están facturando
        </h2>

        <div className="space-y-20">
          {/* Case 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-slate-100 rounded-xl h-64 md:h-80 flex items-center justify-center border border-slate-200">
              <span className="text-slate-400 font-mono">
                [Mockup: Panel ERP GoblinTrader en iMac]
              </span>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                Gestión Total
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                ERP GoblinTrader
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    Desafío:
                  </h4>
                  <p className="text-slate-600">
                    Unificar ventas web, stock físico y gestión de personal.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    Solución:
                  </h4>
                  <p className="text-slate-600">
                    Un panel de control centralizado con alertas de stock,
                    gestión de usuarios y sistema de fichaje digital integrado.
                    Todo bajo control en una sola pantalla.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Case 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-1 md:order-2 bg-slate-100 rounded-xl h-64 md:h-80 flex items-center justify-center border border-slate-200">
              <span className="text-slate-400 font-mono">
                [Mockup: App Satorus en iPhone]
              </span>
            </div>
            <div className="order-2 md:order-1">
              <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                Hostelería Ágil
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Satorus
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    Desafío:
                  </h4>
                  <p className="text-slate-600">
                    Agilizar las comandas en hora punta.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    Solución:
                  </h4>
                  <p className="text-slate-600">
                    Web App progresiva para pedir desde la mesa. Rápida, sin
                    descargas y fácil de usar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Case 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-slate-100 rounded-xl h-64 md:h-80 flex items-center justify-center border border-slate-200">
              <span className="text-slate-400 font-mono">
                [Mockup: Web Rafa Moles]
              </span>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                Imagen y Reservas
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Rafa Moles
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    Solución:
                  </h4>
                  <p className="text-slate-600">
                    Web de alto impacto visual con carga inmediata y
                    optimización para móviles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
