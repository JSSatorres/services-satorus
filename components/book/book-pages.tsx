import Image from "next/image"
import type { CSSProperties, ReactNode } from "react"
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Check,
  FileCheck2,
  Handshake,
  Lightbulb,
  MessageCircle,
  PhoneCall,
  Receipt,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react"
import { TicketDrawing } from "@/components/book/desk-objects"
import { LiveCounter } from "@/components/book/live-counter"
import { processSteps } from "@/lib/home-content"
import { problemList, processDetails, unansweredChats, type AppModule } from "@/lib/book-content"
import { allProjects } from "@/lib/project-catalog"

/**
 * Desorden de partida de cada pieza que se asienta en una página derecha.
 * Determinista (sin `Math.random`) para que servidor y cliente pinten igual.
 */
function settle(index: number): CSSProperties {
  const sx = ((index * 37) % 28) - 14
  const sy = ((index * 53) % 36) - 18
  const sr = ((index * 29) % 14) - 7
  return { "--k": index, "--sx": sx, "--sy": sy, "--sr": sr } as CSSProperties
}

function LeftPage({
  number,
  title,
  stamp = true,
  children,
}: {
  number: number
  title: string
  /** La última página es la del cliente: aún está en blanco, no se sella. */
  stamp?: boolean
  children: ReactNode
}) {
  return (
    <div className="bk-page bk-page--left">
      <p className="bk-hand bk-page-title">{title}</p>
      <div className="bk-page-body">{children}</div>
      {stamp ? (
        <span className="bk-stamp" aria-hidden="true">
          Arreglado por Satorus <Check size="1em" strokeWidth={3} />
        </span>
      ) : null}
      <span className="bk-folio" aria-hidden="true">{number}</span>
    </div>
  )
}

function RightPage({
  number,
  kicker,
  title,
  children,
}: {
  number: number
  kicker: string
  title: string
  children: ReactNode
}) {
  return (
    <div className="bk-page bk-page--right">
      <p className="bk-kicker">{kicker}</p>
      <h2 className="bk-page-heading">{title}</h2>
      <div className="bk-page-body">{children}</div>
      <span className="bk-folio" aria-hidden="true">{number}</span>
    </div>
  )
}

export function BookCover() {
  return (
    <div className="bk-cover">
      <div className="bk-cover-label">
        <span className="bk-hand">Cuaderno de</span>
        <strong className="bk-hand">tu negocio</strong>
      </div>
      <span className="bk-cover-imprint">satorus.</span>
      <span className="bk-band" aria-hidden="true" />
    </div>
  )
}

const goblin = allProjects.find((project) => project.slug === "goblintrader")!
const enrolla = allProjects.find((project) => project.slug === "enrolla2")!
const pidoteca = allProjects.find((project) => project.slug === "pidoteca")!
const angel = allProjects.find((project) => project.slug === "angel-mendoza")!

/* ------------------------------------------------ 1 · El lío (dos páginas) */

/** Posición de una pieza del caos en su página (porcentajes y giro). */
function at(left: string, top: string, rotate: string, width?: string): CSSProperties {
  return { left, top, width, "--r": rotate } as CSSProperties
}

/**
 * Presupuesto en borrador que cruza el lomo: se pinta en las dos páginas con
 * la misma geometría, desplazado una página, y cada cara recorta su mitad.
 */
function DraftBudget({ side }: { side: "left" | "right" }) {
  return (
    <div
      className="bk-cx-budget"
      aria-hidden={side === "right" || undefined}
      style={at(side === "left" ? "70%" : "-30%", "40%", "4deg", "50%")}
    >
      <p className="bk-cx-budget-title">Presupuesto nº 031</p>
      <span className="bk-cx-draft">Borrador</span>
      <span className="bk-cx-lines" />
      <p className="bk-cx-budget-total">Total: ______ €</p>
      <p className="bk-hand bk-cx-budget-note">
        enviar el <s>lunes</s> <s>jueves</s> … hace 3 semanas
      </p>
    </div>
  )
}

function ChaosPage({ side, number, children }: { side: "left" | "right"; number: number; children: ReactNode }) {
  return (
    <div className={`bk-page bk-page--left bk-page--chaos${side === "right" ? " bk-page--mirror" : ""}`}>
      <div className="bk-chaos">{children}</div>
      <span className="bk-folio" aria-hidden="true">{number}</span>
    </div>
  )
}

const chaosLeft = (
  <ChaosPage side="left" number={1}>
    <p className="bk-hand bk-page-title bk-cx-title">Así está tu mesa hoy</p>

    <div className="bk-cx-phone bk-cx-buzz" style={at("5%", "15%", "-7deg", "46%")}>
      <p className="bk-cx-phone-head">
        WhatsApp
        <b className="bk-cx-badge" aria-label="mensajes sin leer">
          <LiveCounter from={47} to={63} />
        </b>
      </p>
      <ul>
        {unansweredChats.map((chat) => (
          <li key={chat.name}>
            <b>{chat.name}</b>
            <span>{chat.text}</span>
            <small>{chat.when}</small>
            <i>{chat.unread}</i>
          </li>
        ))}
      </ul>
    </div>

    <div className="bk-cx-card bk-cx-calls" style={at("53%", "12%", "5deg", "44%")}>
      <span className="bk-cx-dot" aria-hidden="true" />
      <b>3 llamadas perdidas</b>
      <small>Número desconocido · 11:15</small>
    </div>

    <span className="bk-cx-coffee" style={at("12%", "70%", "0deg")} aria-hidden="true" />

    <p className="bk-hand bk-cx-postit" style={at("60%", "27%", "-6deg")}>¡¡llamar a Marta!!</p>
    <p className="bk-hand bk-cx-postit bk-cx-slip" style={at("40%", "66%", "9deg")}>¿pedido de Luis?</p>
    <p className="bk-hand bk-cx-postit bk-cx-postit--pink" style={at("24%", "80%", "-12deg")}>
      ¿ticket del día 3?
    </p>

    <DraftBudget side="left" />
  </ChaosPage>
)

const chaosRight = (
  <ChaosPage side="right" number={2}>
    <DraftBudget side="right" />

    <div className="bk-cx-card bk-cx-inbox" style={at("8%", "30%", "-4deg", "40%")}>
      <b>Entrada (124)</b>
      <span />
      <span />
      <span />
    </div>

    <div className="bk-cx-card bk-cx-review" style={at("30%", "8%", "-5deg", "56%")}>
      <span className="bk-cx-stars" aria-label="2 de 5 estrellas">
        ★★<i>★★★</i>
      </span>
      <p>«Pregunté dos veces y nunca me contestaron.»</p>
      <small>— reseña en Google</small>
    </div>

    <span className="bk-cx-ticket" style={at("62%", "30%", "24deg", "18%")}>
      <TicketDrawing />
    </span>
    <span className="bk-cx-ticket bk-cx-ticket--torn" style={at("78%", "44%", "-16deg", "17%")}>
      <TicketDrawing />
    </span>
    <span className="bk-cx-ticket" style={at("10%", "89%", "12deg", "18%")}>
      <TicketDrawing />
    </span>

    <div className="bk-cx-card bk-cx-agenda" style={at("30%", "52%", "4deg", "48%")}>
      <b>Martes</b>
      <p>
        <span>10:00</span> Sra. López
      </p>
      <p>
        <span>10:00</span> Revisión · Pedro
      </p>
      <em className="bk-hand">¿¿??</em>
    </div>

    <p className="bk-hand bk-cx-note" style={at("12%", "80%", "-4deg")}>
      Luis se ha ido a la competencia
    </p>
    <p className="bk-hand bk-cx-question">¿Te suena?</p>
  </ChaosPage>
)

/* --------------------------------- 1 · Lo que construimos (dos páginas) */

/** Número que une cada problema de la lista con su pieza en la app. */
function Num({ n }: { n: number }) {
  return (
    <i className="bk-num" aria-hidden="true">
      {n}
    </i>
  )
}

const problemsLeft = (
  <LeftPage number={3} title="Tu lista de problemas">
    <ol className="bk-problems">
      {problemList.map((item, index) => (
        <li key={item.module} style={{ "--k": index } as CSSProperties}>
          <Num n={index + 1} />
          <span className="bk-hand bk-problem">{item.problem}</span>
          <span className="bk-fix">→ {item.fix}</span>
        </li>
      ))}
    </ol>
    <p className="bk-hand bk-problems-note">la escribimos contigo en la primera charla</p>
  </LeftPage>
)

const moduleIcons: Record<AppModule, LucideIcon> = {
  whatsapp: MessageCircle,
  agenda: CalendarCheck,
  budgets: FileCheck2,
  calls: PhoneCall,
  till: Receipt,
  clients: Users,
}

function AppCard({
  index,
  title,
  status,
  wide,
  children,
}: {
  index: number
  title: string
  status: string
  wide?: boolean
  children: ReactNode
}) {
  const item = problemList[index]
  const Icon = moduleIcons[item.module]
  return (
    <section className={`bk-app-card bk-settle${wide ? " bk-app-card--wide" : ""}`} style={settle(index)}>
      <header>
        <Num n={index + 1} />
        <Icon aria-hidden="true" size="1.1em" />
        {title}
      </header>
      <div className="bk-app-card-body">{children}</div>
      <footer>
        <Check aria-hidden="true" size="1em" strokeWidth={3} /> {status}
      </footer>
    </section>
  )
}

const appRight = (
  <RightPage number={4} kicker="Capítulo 1 · Lo que construimos" title="Tu lista, convertida en una app.">
    <div className="bk-app">
      <div className="bk-app-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <b>Panel de tu negocio</b>
        <em>hecho por satorus.</em>
      </div>
      <div className="bk-app-body">
        <AppCard index={0} title="Asistente de WhatsApp · IA" status="0 sin contestar · responde al momento" wide>
          <p className="bk-app-msg bk-app-msg--in">¿Tenéis hueco hoy?</p>
          <p className="bk-app-msg bk-app-msg--out">Sí, a las 17:30. ¿Te lo reservo?</p>
        </AppCard>
        <AppCard index={1} title="Agenda" status="sin solapes">
          <p className="bk-app-row">
            <b>10:00</b> Sra. López
          </p>
          <p className="bk-app-row">
            <b>11:00</b> Revisión · Pedro
          </p>
        </AppCard>
        <AppCard index={2} title="Presupuestos" status="3 de 3 enviados">
          <p className="bk-app-row">
            <b>Nº 031</b> enviado hoy
          </p>
        </AppCard>
        <AppCard index={3} title="Llamadas" status="nadie sin respuesta">
          <p className="bk-app-row">
            <b>11:15</b> perdida → WhatsApp enviado
          </p>
        </AppCard>
        <AppCard index={4} title="Caja" status="todo registrado">
          <p className="bk-app-row">
            <b>42</b> tickets · caja cuadrada
          </p>
        </AppCard>
        <AppCard index={5} title="Clientes" status="seguimiento automático" wide>
          <p className="bk-app-row">
            <b>Luis G.</b> te escribimos el jueves
          </p>
        </AppCard>
      </div>
    </div>
  </RightPage>
)

/* ------------------------------------------ 2 · Cómo trabajamos (4 páginas) */

/**
 * Un paso por página: dónde estás en el camino, qué pasa en ese paso y qué te
 * llevas al acabarlo. Las dos páginas de cada doble página se leen a la vez,
 * así que no siguen la regla antes/después: las dos están en limpio.
 */
function StepPage({ index, side, number }: { index: number; side: "left" | "right"; number: number }) {
  const step = processSteps[index]
  const detail = processDetails[index]
  return (
    <div className={`bk-page bk-page--step bk-page--step-${side}`}>
      <ol className="bk-step-map" aria-label={`Paso ${index + 1} de ${processSteps.length}`}>
        {processSteps.map((item, position) => (
          <li
            key={item.title}
            data-state={position < index ? "done" : position === index ? "current" : undefined}
          >
            {position < index ? <Check size="1em" strokeWidth={3.2} aria-hidden="true" /> : position + 1}
          </li>
        ))}
      </ol>
      <p className="bk-kicker">
        {index === 0 ? "Cómo trabajamos · " : ""}Paso {index + 1} · {step.answer}
      </p>
      <h2 className="bk-page-heading">{step.title}</h2>
      <figure className="bk-step-photo bk-settle" style={settle(0)}>
        <Image src={step.image} alt={step.imageAlt} fill sizes="(max-width: 900px) 80vw, 30vw" />
      </figure>
      <p className="bk-step-text">{detail.text}</p>
      <div className="bk-step-takeaway bk-settle" style={settle(1)}>
        <span>Te llevas</span>
        <p>{detail.takeaway}</p>
      </div>
      <span className="bk-folio" aria-hidden="true">
        {number}
      </span>
    </div>
  )
}

/* ------------------------------------------------------- 3 · Qué hacemos */

const requestsLeft = (
  <LeftPage number={9} title="Lo que nos piden">
    <ul className="bk-requests">
      <li>
        <span className="bk-hand">«Quiero que me encuentren en Google y me llamen.»</span>
        <b>→ una web</b>
      </li>
      <li>
        <span className="bk-hand">«Soy consultor y quiero que las clínicas entiendan lo que ofrezco.»</span>
        <b>→ una web personal</b>
      </li>
      <li>
        <span className="bk-hand">«Mis clientes quieren pedir y reservar desde el móvil.»</span>
        <b>→ una aplicación</b>
      </li>
      <li>
        <span className="bk-hand">«Uso cinco programas y ninguno se habla con otro.»</span>
        <b>→ un programa de gestión</b>
      </li>
    </ul>
  </LeftPage>
)

function Offer({
  index,
  title,
  text,
  project,
  image,
}: {
  index: number
  title: string
  text: string
  project: typeof goblin
  /**
   * Imagen propia para el libro cuando la de la ficha no es la que mejor lo
   * cuenta. `top`: una captura de página entera, de la que interesa el principio.
   */
  image?: { src: string; alt: string; top?: boolean }
}) {
  return (
    <li className="bk-offer bk-settle" style={settle(index)}>
      <figure
        className="bk-offer-shot"
        data-fit={image ? undefined : project.imageFit}
        data-top={image?.top || undefined}
      >
        <Image
          src={image?.src ?? project.image}
          alt={image?.alt ?? project.imageAlt}
          fill
          sizes="(max-width: 900px) 40vw, 14vw"
        />
      </figure>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
        <a className="bk-link" href={project.href}>
          Ejemplo: {project.name} <ArrowUpRight size="1.05em" aria-hidden="true" />
        </a>
      </div>
    </li>
  )
}

const offersRight = (
  <RightPage number={10} kicker="Capítulo 3 · Lo que hacemos" title="Lo que hacemos, dicho claro.">
    <ol className="bk-offers">
      <Offer
        index={0}
        title="Webs que traen clientes"
        text="Tu escaparate en internet: que te encuentren, entiendan qué ofreces y te escriban."
        project={enrolla}
      />
      <Offer
        index={1}
        title="Webs personales que dan confianza"
        text="Si vendes tu experiencia, una web que explica quién eres, qué ofreces y por qué elegirte."
        project={angel}
        image={{
          src: "/projects/angel-mendoza/site-desktop.png",
          alt: "Portada de la web de Ángel Mendoza con su foto y su propuesta para clínicas",
          top: true,
        }}
      />
      <Offer
        index={2}
        title="Aplicaciones para tus clientes"
        text="Para que pidan, reserven o sigan su pedido desde el móvil, sin tener que llamarte."
        project={pidoteca}
        image={{
          src: "/projects/pidoteca/customer-ordering-journey-wide.png",
          alt: "Dos móviles sobre la mesa de un restaurante con la carta de Pidoteca: un plato añadido al pedido y el pedido listo",
        }}
      />
      <Offer
        index={3}
        title="Un programa para llevar todo el negocio"
        text="Caja, compras, stock, equipo y fichajes en un solo sitio. Lo que en informática llaman ERP, hecho a tu medida."
        project={goblin}
      />
    </ol>
  </RightPage>
)

/* ------------------------------------------------ 4 · Tu siguiente paso */

/**
 * Dos caminos, dibujados a mano: seguir igual (la línea se hunde), la
 * competencia que ya usa IA, y crecer con nosotros. La línea naranja se
 * dibuja con `--s` al abrir la doble página.
 */
const pathsLeft = (
  <LeftPage number={11} title="Dos caminos" stamp={false}>
    <figure className="bk-paths">
      <svg viewBox="0 0 320 220" role="img" aria-label="Gráfica a mano: si sigues igual, los clientes bajan; tu competencia, con IA, sube; con Satorus, subes más.">
        <path className="bk-paths-axis" d="M24 196H306M24 196V18" />
        <path className="bk-paths-axis" d="M300 190L306 196L300 202M18 24L24 18L30 24" />
        <path className="bk-paths-same" d="M24 124C96 124 170 140 292 170" />
        <path className="bk-paths-rival" d="M24 124C100 118 170 96 292 74" />
        <path className="bk-paths-us" pathLength={1} d="M24 124C96 120 150 84 206 58S268 30 292 24" />
      </svg>
      <figcaption>
        <span className="bk-hand bk-paths-label bk-paths-label--us">con Satorus</span>
        <span className="bk-hand bk-paths-label bk-paths-label--rival">tu competencia, ya con IA</span>
        <span className="bk-hand bk-paths-label bk-paths-label--same">si sigues igual</span>
        <span className="bk-hand bk-paths-axis-label bk-paths-axis-label--y">clientes</span>
        <span className="bk-hand bk-paths-axis-label bk-paths-axis-label--x">tiempo</span>
      </figcaption>
    </figure>
    <p className="bk-hand bk-paths-note">
      La IA ya ha llegado a tu sector. La pregunta es si la usas tú… o solo tu competencia.
    </p>
    <ul className="bk-hand bk-paths-facts">
      <li>tu competencia ya contesta el WhatsApp con IA</li>
      <li>tus clientes esperan respuesta en minutos, no en días</li>
      <li>lo que hoy es ventaja, mañana será lo normal</li>
    </ul>
  </LeftPage>
)

const supports: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Sparkles, title: "Tecnología e IA", text: "que trabajan por ti mientras tú atiendes tu negocio." },
  { icon: Lightbulb, title: "Conocimiento", text: "te decimos qué merece la pena y qué no, sin venderte humo." },
  { icon: Handshake, title: "Compañía", text: "seguimos a tu lado después de entregar, para que crezcas." },
]

/** Última página del libro: en qué te apoyas en nosotros y la llamada a hablar. */
const finalRight = (
  <div className="bk-page bk-page--right bk-page--final">
    <p className="bk-kicker">Capítulo 4 · Tu siguiente paso</p>
    <h2 className="bk-page-heading">
      La IA no va a esperarte.
      <span> Tu competencia tampoco.</span>
    </h2>
    <p className="bk-final-lead">
      No tienes que saber de tecnología. Apóyate en nosotros: ponemos la herramienta, el
      conocimiento y la compañía para que tu negocio crezca.
    </p>
    <ul className="bk-final-supports">
      {supports.map((item, index) => (
        <li className="bk-settle" key={item.title} style={settle(index)}>
          <item.icon aria-hidden="true" size="1.3em" />
          <p>
            <strong>{item.title}</strong> {item.text}
          </p>
        </li>
      ))}
    </ul>
    <a className="bk-final-cta" href="#contacto">
      Hablemos de tu negocio <ArrowRight size="1.15em" aria-hidden="true" />
    </a>
    <p className="bk-final-note">Cuéntanos qué te frena y te decimos por dónde empezar.</p>
    <span className="bk-folio" aria-hidden="true">
      12
    </span>
  </div>
)

export const leftPages: ReactNode[] = [
  chaosLeft,
  problemsLeft,
  <StepPage key="paso-1" index={0} side="left" number={5} />,
  <StepPage key="paso-3" index={2} side="left" number={7} />,
  requestsLeft,
  pathsLeft,
]

export const rightPages: ReactNode[] = [
  chaosRight,
  appRight,
  <StepPage key="paso-2" index={1} side="right" number={6} />,
  <StepPage key="paso-4" index={3} side="right" number={8} />,
  offersRight,
  finalRight,
]
