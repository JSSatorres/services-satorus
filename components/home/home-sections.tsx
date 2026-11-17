import type { CSSProperties } from "react"
import { ArrowRight, ArrowUpRight, Handshake, Lightbulb, Sparkles, type LucideIcon } from "lucide-react"
import { ParallaxImage, PathsChart, Reveal } from "@/components/home/motion-bits"
import { FixedBand } from "@/components/home/fixed-band"
import { OfferStack, ScrubWords } from "@/components/home/stack-motion"
import { Enrolla2Mosaic, ProjectsCta } from "@/components/home/offer-extras"
import { allProjects, type ProjectCatalogItem } from "@/lib/project-catalog"

const project = (slug: string) => allProjects.find((item) => item.slug === slug)!

/* ------------------------------------------------------------ Foto a sangre */

export function DeskBand() {
  return (
    <FixedBand poster="/images/clear-flow.png" startAt={4}>
      <p className="hs-band-title">
        Del enredo <em>a una ruta clara.</em>
      </p>
      <p className="hs-band-text">Así lo hacemos, paso a paso.</p>
    </FixedBand>
  )
}

/* ---------------------------------------------------------- Qué hacemos */

type Offer = {
  /** Lo que nos dice el cliente, tal cual. */
  request: string
  /** Lo que en realidad necesita. */
  need: string
  title: string
  text: string
  project: ProjectCatalogItem
  /** Web real del proyecto: el enlace va directo a ella, en otra pestaña. */
  site?: string
  image?: { src: string; alt: string; top?: boolean }
  /** En vez de una foto, el mosaico de capturas de la web (Enrolla2). */
  mosaic?: boolean
}

const offers: Offer[] = [
  {
    request: "«Quiero que me encuentren en Google y me llamen.»",
    need: "una web",
    title: "Webs que traen clientes",
    text: "Tu escaparate en internet: que te encuentren, entiendan qué ofreces y te escriban.",
    project: project("enrolla2"),
    site: "https://enrolla2.com/",
    mosaic: true,
  },
  {
    request: "«Mis clientes quieren pedir y reservar desde el móvil.»",
    need: "una aplicación",
    title: "Aplicaciones para tus clientes",
    text: "Para que pidan, reserven o sigan su pedido desde el móvil, sin tener que llamarte.",
    project: project("pidoteca"),
    site: "https://pidoteca.com/",
    image: {
      src: "/projects/pidoteca/customer-ordering-journey-wide.png",
      alt: "Dos móviles sobre la mesa de un restaurante con la carta de Pidoteca: un plato añadido al pedido y el pedido listo",
    },
  },
  {
    request: "«Uso cinco programas y ninguno se habla con otro.»",
    need: "un programa de gestión",
    title: "Un programa para llevar todo el negocio",
    text: "Caja, compras, stock, equipo y fichajes en un solo sitio, hecho a tu medida.",
    project: project("goblintrader"),
  },
]

export function OffersSection() {
  return (
    <section className="hs hs-offers" id="que-hacemos" aria-labelledby="que-hacemos-title">
      <div className="hs-wrap">
        <header className="hs-head">
          <div>
            <p className="hs-kicker">
              <span>Qué hacemos</span>
            </p>
            <h2 className="hs-title" id="que-hacemos-title">
              Lo que nos piden y lo que hacemos.
            </h2>
          </div>
          <p className="hs-lead">
            Tres peticiones que oímos a menudo, cada una con un proyecto real que puedes abrir.
          </p>
        </header>

        <OfferStack className="hs-offer-list">
          {offers.map((offer, index) => (
            <li
              className="hs-offer"
              key={offer.title}
              style={{ "--i": index } as CSSProperties}
              data-count={`${index + 1}/${offers.length}`}
            >
              {offer.mosaic ? (
                <Enrolla2Mosaic />
              ) : (
                <ParallaxImage
                  className="hs-offer-shot"
                  src={offer.image?.src ?? offer.project.image}
                  alt={offer.image?.alt ?? offer.project.imageAlt}
                  sizes="(max-width: 900px) 92vw, 48vw"
                  data-top={offer.image?.top || undefined}
                />
              )}
              <Reveal className="hs-offer-copy" from={index % 2 === 0 ? "right" : "left"} delay={0.1}>
                <p className="hs-offer-request">{offer.request}</p>
                <p className="hs-offer-need">→ {offer.need}</p>
                <h3>{offer.title}</h3>
                <p className="hs-offer-text">{offer.text}</p>
                <a
                  className="hs-offer-link"
                  href={offer.site ?? offer.project.href}
                  {...(offer.site ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  Ver {offer.project.name}
                  <ArrowUpRight aria-hidden="true" size={18} />
                </a>
              </Reveal>
            </li>
          ))}
        </OfferStack>

        <ProjectsCta />
      </div>
    </section>
  )
}

/* ---------------------------------------------------- Tu siguiente paso */

const supports: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Sparkles, title: "Tecnología e IA", text: "que trabajan por ti mientras tú atiendes tu negocio." },
  { icon: Lightbulb, title: "Conocimiento", text: "te decimos qué merece la pena y qué no, sin venderte humo." },
  { icon: Handshake, title: "Compañía", text: "seguimos a tu lado después de entregar, para que crezcas." },
]

export function NextStepSection() {
  return (
    <section className="hs-next" id="tu-siguiente-paso" aria-labelledby="tu-siguiente-paso-title">
      <div className="hs-wrap hs-next-grid">
        <Reveal className="hs-next-copy">
          <p className="hs-kicker hs-kicker--light">
            <span>Tu siguiente paso</span>
          </p>
          <ScrubWords
            className="hs-title"
            id="tu-siguiente-paso-title"
            parts={[{ text: "La IA no va a esperarte." }, { text: "Tu competencia tampoco.", em: true }]}
          />
          <p className="hs-next-lead">
            No tienes que saber de tecnología. Apóyate en nosotros: ponemos la herramienta, el conocimiento y la
            compañía para que tu negocio crezca.
          </p>
          <ul className="hs-supports">
            {supports.map((item) => (
              <li key={item.title}>
                <item.icon aria-hidden="true" size={22} />
                <p>
                  <strong>{item.title}</strong> {item.text}
                </p>
              </li>
            ))}
          </ul>
          <a className="hv-cta" href="#contacto">
            Hablemos de tu negocio
            <ArrowRight aria-hidden="true" size={24} strokeWidth={2.2} />
          </a>
        </Reveal>

        <Reveal className="hs-paths-wrap" from="right" delay={0.15}>
          <figure className="hs-paths">
            <p className="hs-paths-title">Dos caminos</p>
            <PathsChart />
            <figcaption>
              La IA ya ha llegado a tu sector. La pregunta es si la usas tú… o solo tu competencia.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
