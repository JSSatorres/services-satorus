import { ArrowDown, ArrowRight } from "lucide-react"
import Image from "next/image"
import { ContactForm } from "@/components/contact-form"
import { DesktopScrollStory } from "@/components/desktop-scroll-story"
import { Hero } from "@/components/hero"
import { MobileFlowReveal } from "@/components/mobile-flow-reveal"
import { SectionCurtainStack } from "@/components/section-curtain-stack"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

const frictions = [
  "Un presupuesto se queda enterrado en WhatsApp.",
  "Copias el mismo pedido en dos o tres sitios.",
  "La web existe, pero no trae conversaciones.",
  "Cuando alguien falta, nadie sabe dónde estaba todo.",
]

const services = [
  {
    name: "Una web que vende por ti",
    type: "Web",
    description:
      "Explica en segundos qué haces, para quién y cuál es el siguiente paso. Clara en móvil, rápida y fácil de mantener.",
  },
  {
    name: "Una herramienta que encaja",
    type: "A medida",
    description:
      "Presupuestos, pedidos, clientes o partes de trabajo en un lugar hecho alrededor de tu forma de trabajar.",
  },
  {
    name: "Tareas que dejan de perseguirte",
    type: "Automatización",
    description:
      "Respuestas, avisos, documentos y pasos repetidos que pueden quedar preparados o hacerse solos, siempre con control.",
  },
]

const steps = [
  {
    title: "Hablamos el idioma de tu negocio",
    body: "Nos cuentas qué haces ahora, qué se atasca y qué tendría que pasar para que el día fuese más sencillo.",
  },
  {
    title: "Dibujamos el recorrido antes de construir",
    body: "Ves una propuesta clara: qué entra, qué ocurre y qué resultado sale. Sin capas, siglas ni sorpresas.",
  },
  {
    title: "Empezamos por lo que más desbloquea",
    body: "La solución se divide en partes que puedas entender, revisar y usar desde el principio.",
  },
  {
    title: "La tecnología se queda en su sitio",
    body: "Tú mantienes el control del negocio. Nosotros nos encargamos de que lo técnico funcione y siga teniendo sentido.",
  },
]

const faqs = [
  {
    question:
      "No sé si necesito una web, un programa o inteligencia artificial.",
    answer:
      "No necesitas decidirlo antes de hablar. Empezamos por el problema y elegimos después la solución más sencilla que lo resuelva. La IA solo entra si aporta algo útil.",
  },
  {
    question: "¿Tengo que cambiar las herramientas que ya usa mi empresa?",
    answer:
      "No necesariamente. Primero revisamos lo que ya tienes. Muchas veces el mayor cambio consiste en conectar mejor esas herramientas o quitar pasos duplicados.",
  },
  {
    question: "¿Trabajas solo con empresas grandes?",
    answer:
      "La web está pensada precisamente para pymes: negocios donde el tiempo de cada persona cuenta y una tarea repetida termina ocupando demasiado espacio.",
  },
  {
    question: "¿Cuánto cuesta y cuánto tarda?",
    answer:
      "Depende del alcance. Después de entender el problema, la propuesta deja por escrito qué se va a hacer, qué queda fuera, cuánto cuesta y qué tiempos manejamos antes de empezar.",
  },
  {
    question: "¿Puedo empezar por una parte pequeña?",
    answer:
      "La propuesta puede organizarse por fases para empezar por el atasco que más tiempo o más oportunidades está consumiendo.",
  },
]

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <SectionCurtainStack>
          <Hero />

          <section className="plain-talk" aria-labelledby="plain-talk-title">
          <div className="plain-talk-copy">
            <h2 id="plain-talk-title">
              Hablamos claro.
              <br />
              Te entiendes tú.
            </h2>
            <p>
              Aquí no hay tecnicismos. No hace falta pedir una “arquitectura de
              agentes”. Basta con decir: “los pedidos llegan por tres sitios y
              perdemos tiempo copiándolos”.
            </p>
          </div>

          <div className="route-sketch" aria-hidden="true">
            <svg viewBox="0 0 720 400" preserveAspectRatio="xMidYMid meet">
              <path d="M42 220 C128 72 216 340 318 190 S530 74 676 188" />
              <path className="route-arrow" d="M630 146 L682 188 L630 226" />
            </svg>
            <span className="sketch-start">Lo que te frena</span>
            <span className="sketch-end">Un recorrido claro</span>
          </div>
          </section>

          <section
          className="friction-section"
          id="que-resolvemos"
          aria-labelledby="friction-title"
        >
          <figure className="friction-photo">
            <Image
              src="/images/daily-tangle.png"
              alt="Mesa vista desde arriba con notas, un móvil y un cable naranja enredado."
              fill
              sizes="(max-width: 900px) 100vw, 52vw"
            />
            <span className="photo-tape">¿Te suena?</span>
          </figure>

          <div className="friction-copy">
            <h2 id="friction-title">
              Si tu día depende de acordarte de todo, algo se puede ordenar.
            </h2>
            <div className="friction-list">
              {frictions.map((item) => (
                <p key={item}>
                  <span aria-hidden="true" />
                  {item}
                </p>
              ))}
            </div>
            <a href="#contacto">
              Cuéntanos cuál es el tuyo
              <ArrowDown aria-hidden="true" size={22} />
            </a>
          </div>
          </section>

          <section
          className="services-section"
          id="servicios"
          aria-labelledby="services-title"
        >
          <div className="services-heading">
            <h2 id="services-title">
              No te vendemos tecnología. Resolvemos el atasco.
            </h2>
            <p>
              Incluimos inteligencia artificial cuando mejora el resultado. Si
              una regla sencilla lo hace mejor, usamos una regla sencilla.
            </p>
          </div>

          <div className="service-ledger">
            {services.map((service) => (
              <article key={service.name} className="service-row">
                <span className="service-type">{service.type}</span>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <ArrowRight aria-hidden="true" size={29} strokeWidth={1.8} />
              </article>
            ))}
          </div>
          </section>

          <DesktopScrollStory />
          <MobileFlowReveal />

          <section
          className="process-section"
          id="como-trabajamos"
          aria-labelledby="process-title"
        >
          <div className="process-heading">
            <h2 id="process-title">Nos cuentas el lío. Dibujamos la salida.</h2>
            <p>
              El trabajo empieza por tu día a día, no por una herramienta que
              haya que venderte.
            </p>
          </div>

          <ol className="process-steps">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="step-pin" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          </section>

          <section
          className="faq-section"
          id="preguntas"
          aria-labelledby="faq-title"
        >
          <div className="faq-heading">
            <h2 id="faq-title">
              Las dudas que suelen aparecer antes de hablar.
            </h2>
            <p>
              Si la tuya no está aquí, escríbenos como la explicarías a alguien
              de tu equipo.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <span aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
          </section>

          <section
          className="contact-section"
          id="contacto"
          aria-labelledby="contact-title"
        >
          <div className="contact-copy">
            <h2 id="contact-title">
              Cuéntanos qué te frena.
              <br />
              Aunque todavía no sepas cómo se llama.
            </h2>
            <p>
              Describe qué haces ahora, dónde pierdes tiempo y qué te gustaría
              que ocurriera. Con eso basta para empezar.
            </p>
            <a href="mailto:hola@satorus.es">hola@satorus.es</a>
          </div>
          <ContactForm />
          </section>
        </SectionCurtainStack>
      </main>
      <SiteFooter />
    </>
  )
}
