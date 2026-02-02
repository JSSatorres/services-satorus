import { ShieldCheck, Zap, Users, Lock } from "lucide-react"

export function Benefits() {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            La diferencia entre gastar en software o invertir en tu empresa
          </h2>
          <p className="text-slate-300 text-lg">
            Muchos negocios en España intentan adaptarse a programas gigantes
            que no entienden. Nosotros hacemos lo contrario: adaptamos la
            tecnología a ti.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <Zap className="w-10 h-10 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Escalabilidad</h3>
            <p className="text-slate-400">
              Tu sistema crece si tú creces. Sin límites artificiales.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <Users className="w-10 h-10 text-primary-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Soporte Cercano</h3>
            <p className="text-slate-400">
              Hablas con desarrolladores en España, no con robots.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <ShieldCheck className="w-10 h-10 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Sin Licencias</h3>
            <p className="text-slate-400">
              Paga por el desarrollo, no por el "alquiler" eterno de
              funcionalidades.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <Lock className="w-10 h-10 text-red-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Seguridad</h3>
            <p className="text-slate-400">
              Tus datos son tuyos. Cumplimiento total de normativas.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
