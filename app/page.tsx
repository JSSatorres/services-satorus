import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { DesktopScrollStory } from "@/components/desktop-scroll-story"
import { Hero } from "@/components/hero"
import { MobileFlowReveal } from "@/components/mobile-flow-reveal"
import { PlainTalk } from "@/components/plain-talk"
import { ProcessRoute } from "@/components/process-route"
import { SectionCurtainStack } from "@/components/section-curtain-stack"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ServiceShowcase } from "@/components/service-showcase"

const steps = [
  {
    title: "Entendemos tu negocio",
    body: "Nos cuentas cómo trabajas, qué quieres conseguir y dónde encuentras dificultades. Revisamos también las herramientas que ya utilizas.",
    image: "/images/process-discovery.png",
    imageAlt:
      "Reunión de escucha entre el equipo de Satorus y una clienta en torno a una mesa de trabajo",
  },
  {
    title: "Definimos la propuesta",
    body: "Concretamos la solución, el alcance, la inversión y los plazos. Sabes qué incluye el proyecto antes de empezar.",
    image: "/images/process-proposal.png",
    imageAlt:
      "Consultora entrega una propuesta visual a un cliente en una mesa de trabajo",
  },
  {
    title: "Construimos y probamos contigo",
    body: "Revisas la solución con ejemplos de tu día a día. Ajustamos lo necesario para que encaje con el trabajo real.",
    image: "/images/process-cocreate.png",
    imageAlt:
      "Equipo de Satorus y cliente revisan juntos una aplicación en una pantalla",
  },
  {
    title: "La ponemos en marcha",
    body: "Te explicamos cómo utilizarla y dejamos acordados el soporte y el mantenimiento que necesite.",
    image: "/images/process-momentum.png",
    imageAlt:
      "Equipo de una pequeña empresa trabaja con agilidad usando su nuevo sistema",
  },
]

const projects = [
  {
    id: "apps",
    label: "Apps a medida",
    title: "Del móvil al escritorio, una herramienta que encaja contigo.",
    description:
      "Diseñamos aplicaciones para equipos, clientes y gestión: deporte, restauración, lectura y el siguiente reto de tu negocio.",
    href: "/productos",
    linkLabel: "Explora nuestros proyectos",
    image: "/images/apps-showcase.png",
    imageAlt:
      "Composición ilustrativa de aplicaciones para deporte, restauración y lectura en móvil y escritorio",
  },
  {
    id: "webs",
    label: "Webs con carácter",
    title: "Una web que invita a entrar y hace fácil elegirte.",
    description:
      "De la energía de Entrolla2 a la mirada personal de Ángel Mendoza: diseñamos webs que cuentan bien quién eres y por qué elegirte.",
    href: "/productos",
    linkLabel: "Explora nuestros proyectos",
    image: "/images/webs-showcase.png",
    imageAlt:
      "Composición ilustrativa de una web para hostelería y una web de portfolio profesional en portátil y móvil",
  },
]

const faqs = [
  {
    question: "¿Necesito saber de programación o inteligencia artificial?",
    answer:
      "Puedes empezar explicándonos qué haces y qué te gustaría mejorar. Nosotros traducimos esa necesidad en una propuesta que puedas entender y valorar.",
  },
  {
    question: "¿Podemos aprovechar mi web y mis herramientas actuales?",
    answer:
      "Primero revisamos lo que ya tienes. La solución puede consistir en mejorarlo, conectarlo con otras herramientas o desarrollar únicamente la parte que falta.",
  },
  {
    question: "¿La inteligencia artificial tiene sentido para cualquier tarea?",
    answer:
      "Su utilidad depende de la tarea y de la información disponible. Valoramos dónde puede ayudarte y cuándo basta con una automatización sencilla.",
  },
  {
    question: "¿Qué ocurre si la IA se equivoca?",
    answer:
      "Puede cometer errores. Por eso definimos qué información utiliza, cómo probamos sus respuestas y qué pasos necesitan revisión antes de utilizarlas o enviarlas.",
  },
  {
    question: "¿Qué pasa con los datos de mi negocio?",
    answer:
      "Antes de incorporar una herramienta, revisamos qué información necesita y cómo se tratará. Las condiciones de acceso, uso y conservación forman parte de la definición de la solución.",
  },
  {
    question: "¿Cuánto cuesta y cuánto tarda?",
    answer:
      "La inversión y los plazos se concretan después de conocer tu caso. La propuesta detalla el trabajo incluido y los costes de herramientas externas o mantenimiento que correspondan.",
  },
  {
    question: "¿Puedo empezar por una parte pequeña?",
    answer:
      "Sí. Podemos plantear una primera fase centrada en una necesidad concreta y valorar después qué merece la pena ampliar.",
  },
]

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" data-reveal-scope="lines">
        <SectionCurtainStack>
        <Hero />

          <PlainTalk />

          <section
          className="services-section"
          id="servicios"
          aria-labelledby="services-title"
        >
          <div className="services-heading">
            <h2 id="services-title">Qué podemos mejorar contigo.</h2>
            <p>
              Partimos de lo que quieres conseguir y elegimos la combinación
              adecuada de web, herramientas y automatización.
            </p>
          </div>

          <ServiceShowcase />
          </section>

          <DesktopScrollStory />
          <MobileFlowReveal />

          <section
            className="projects-section"
            id="proyectos"
            aria-labelledby="projects-title"
          >
            <div className="projects-heading">
              <h2 id="projects-title">Una idea puede acabar en una app o en una web.</h2>
              <p>
                Dos puertas de entrada a lo que hacemos. Dentro de cada
                proyecto, todo el detalle.
              </p>
              <a className="projects-cta" href="/productos">
                Mira todos nuestros proyectos
                <ArrowUpRight aria-hidden="true" size={20} />
              </a>
            </div>

            <div className="project-list">
              {projects.map((project) => (
                <article className="project-card" key={project.id}>
                  <div className="project-shot">
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes="(max-width: 900px) 100vw, 46vw"
                    />
                  </div>
                  <span className="project-label">{project.label}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <a href={project.href}>
                    {project.linkLabel}
                    <ArrowUpRight aria-hidden="true" size={20} />
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section
          className="process-section"
          id="como-trabajamos"
          aria-labelledby="process-title"
        >
          <ProcessRoute
            heading={
              <h2 id="process-title">Una mejora concreta. Un plan claro.</h2>
            }
            intro={
              <>
                Antes de construir, acordamos qué queremos mejorar, qué vamos a
                entregar y cómo comprobaremos que funciona.
              </>
            }
            steps={steps}
          />
          </section>

          <section
          className="faq-section"
          id="preguntas"
          aria-labelledby="faq-title"
        >
          <div className="faq-heading">
            <h2 id="faq-title">Antes de dar el paso.</h2>
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
              Veamos cuál puede ser tu siguiente paso.
            </h2>
            <p>
              Cuéntanos a qué se dedica tu negocio y qué te gustaría mejorar.
              Revisaremos tu consulta y te contactaremos para entender mejor lo
              que necesitas.
            </p>
            <a href="mailto:info@satorus.es">info@satorus.es</a>
          </div>
          <ContactForm />
          </section>
        </SectionCurtainStack>
      </main>
      <SiteFooter />
    </>
  )
}
