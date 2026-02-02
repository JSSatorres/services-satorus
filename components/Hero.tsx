import Link from "next/link"

export function Hero() {
  return (
    <section className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 opacity-90 z-0" />

      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Tu socio tecnológico: <br />
            <span className="text-primary-500">Software a Medida</span> y
            Digitalización Real para Pymes
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-lg">
            Olvídate de los Excel y el software genérico. Creamos el ERP, la Web
            o la App de Pedidos que tu negocio necesita para crecer y cumplir
            con la ley Verifactu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#contact"
              className="inline-flex justify-center items-center px-8 py-3 text-base font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-primary-500/25"
            >
              Solicitar Consultoría Gratuita
            </Link>
          </div>
        </div>

        {/* Placeholder for Hero Image */}
        <div className="relative h-64 md:h-96 w-full rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 flex items-center justify-center text-slate-500">
            {/* Abstract representation of QR + Dashboard */}
            <div className="text-center p-6">
              <p className="mb-2 font-mono text-sm">
                [Imagen: Móvil escaneando QR + Pantalla ERP]
              </p>
              <div className="w-16 h-16 mx-auto bg-slate-700 rounded-lg mb-4 animate-pulse"></div>
              <div className="w-32 h-24 mx-auto bg-slate-600 rounded-lg shadow-inner"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
