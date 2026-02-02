import { Factory, Smartphone, Globe, ArrowRight } from "lucide-react"
import Link from "next/link"
import { clsx } from "clsx"

const services = [
  {
    title: "ERPs de Gestión Integral y Verifactu",
    description:
      "¿Tu software actual se queda corto? Desarrollamos ERPs a medida adaptados al 100% a tus flujos de trabajo.",
    details: [
      "Gestión Total: Control de stock, almacén y pedidos web.",
      "RRHH Integrado: Fichaje y gestión de empleados.",
      "Cumplimiento Legal: Adaptados a Verifactu y Ley Antifraude.",
    ],
    target: "Comercios, almacenes y empresas de servicios.",
    icon: Factory,
  },
  {
    title: "Hostelería Inteligente: Pedidos desde el Móvil",
    description:
      "Moderniza tu bar o restaurante sin pagar comisiones abusivas a terceros.",
    details: [
      "Sistema QR: Escanear, pedir y pagar desde la mesa.",
      "Sin esperas: Reduce carga de trabajo de camareros.",
      "Ejemplo Real: Soluciones ágiles como Satorus.",
    ],
    target: "Bares, cafeterías y restaurantes.",
    icon: Smartphone,
  },
  {
    title: "Diseño Web y Sistemas de Reservas",
    description:
      "Tu escaparate digital debe vender por ti. No hacemos simples webs, creamos herramientas de negocio.",
    details: [
      "Webs Corporativas: Diseño moderno y rápido.",
      "Citas Online: Automatiza la agenda de tu negocio.",
      "SEO Local: Posicionate en tu ciudad.",
    ],
    target: "Peluquerías, clínicas y negocios locales.",
    icon: Globe,
  },
]

export function Services() {
  return (
    <section className="py-20 bg-slate-50" id="services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            ¿Qué necesitas hoy?
          </h2>
          <p className="text-slate-600 text-lg">
            Soluciones tecnológicas diseñadas para resolver problemas reales de
            tu Pyme.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-6 text-primary-600">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-slate-600 mb-6">{service.description}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {service.details.map((detail, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-sm text-slate-700"
                    >
                      <ArrowRight
                        size={16}
                        className="text-primary-500 mr-2 mt-1 shrink-0"
                      />
                      {detail}
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t border-slate-100">
                  <p className="text-sm font-medium text-slate-500">
                    Ideal para:{" "}
                    <span className="text-slate-900">{service.target}</span>
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
