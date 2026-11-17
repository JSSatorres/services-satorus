"use client"

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react"
import { ArrowRight, Check, FileText, Paperclip, Phone, PhoneMissed, Voicemail } from "lucide-react"
import { track } from "@vercel/analytics"
import {
  BUSINESS,
  SCENE_MS,
  scenes,
  type BadScreen,
  type ChatListMessage,
  type GoodScreen,
} from "@/lib/hero-scenes"

/**
 * Portada: el mismo momento de un negocio en dos móviles a la vez.
 * Izquierda, sin Satorus: los mensajes, correos y llamadas se acumulan.
 * Derecha, con Satorus: el asistente contesta, manda el presupuesto y avisa
 * del pedido. Cuatro escenas que pasan solas (o con las pestañas).
 *
 * Todo sale de `elapsed`, los milisegundos desde que empezó la escena: cada
 * pantalla pinta lo que ya ha llegado (`at <= elapsed`). En móvil sólo cabe un
 * teléfono: se ve el de «sin Satorus» y, a mitad de escena, pasa solo al de
 * «con Satorus» (o con el interruptor).
 */

const TICK_MS = 100
/** En móvil, momento de la escena en que se pasa al teléfono con Satorus. */
const FLIP_AT = 0.42

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)"
function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED_QUERY)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}

function useHeroClock(paused: boolean) {
  const [scene, setScene] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const reduce = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  )

  useEffect(() => {
    if (reduce || paused) return
    const id = window.setInterval(() => {
      setElapsed((value) => {
        if (value + TICK_MS < SCENE_MS) return value + TICK_MS
        setScene((current) => (current + 1) % scenes.length)
        return 0
      })
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [paused, reduce])

  const goTo = (index: number) => {
    setScene(index)
    setElapsed(0)
  }

  // Con movimiento reducido cada escena se ve ya terminada.
  return { scene, elapsed: reduce ? SCENE_MS : elapsed, goTo, reduce }
}

export function HomeHero({ first = true }: { first?: boolean }) {
  const Heading = first ? "h1" : "h2"
  const stageRef = useRef<HTMLDivElement>(null)
  const [onScreen, setOnScreen] = useState(true)
  const { scene, elapsed, goTo, reduce } = useHeroClock(!onScreen)
  /** Interruptor del móvil: `null` = automático. Se guarda con su escena. */
  const [manual, setManual] = useState<{ scene: number; side: "bad" | "good" } | null>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    let inView = true
    const update = () => setOnScreen(inView && document.visibilityState === "visible")
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        update()
      },
      { threshold: 0.2 },
    )
    observer.observe(stage)
    document.addEventListener("visibilitychange", update)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", update)
    }
  }, [])

  const current = scenes[scene]
  const autoSide = elapsed < SCENE_MS * FLIP_AT ? "bad" : "good"
  // Al cambiar de escena el interruptor vuelve solo a automático.
  const mobileSide = manual && manual.scene === scene ? manual.side : autoSide
  const done = elapsed >= SCENE_MS * 0.82

  const choose = (index: number) => {
    track("portada_escena", { escena: scenes[index].id })
    setManual(null)
    goTo(index)
  }

  return (
    <section className="dh" id="con-y-sin" data-first={first || undefined} aria-labelledby="hero-title">
      <div className="dh-in">
        <div className="dh-copy">
          <p className="hs-kicker hs-kicker--light">
            <span>Webs, apps e IA para pymes</span>
          </p>
          <Heading id="hero-title">
            <span className="dh-line">
              <span>Que tu negocio</span>
            </span>
            <span className="dh-line">
              <span>conteste solo.</span>
            </span>
          </Heading>
          <p className="dh-lead">
            Asistentes que responden el WhatsApp y el correo, mandan los presupuestos y avisan de cada pedido.
            Mira el mismo día de un obrador, con y sin Satorus.
          </p>
          <div className="dh-actions">
            <a className="hv-cta" href="#contacto">
              Hablemos de tu negocio
              <ArrowRight aria-hidden="true" size={24} strokeWidth={2.2} />
            </a>
          </div>

          <div className="dh-tabs" role="tablist" aria-label="Qué cambia">
            {scenes.map((item, index) => (
              <button
                type="button"
                role="tab"
                key={item.id}
                aria-selected={index === scene}
                aria-controls="dh-stage"
                onClick={() => choose(index)}
              >
                <span className="dh-tab-num">{index + 1}</span>
                {item.tab}
                <span className="dh-tab-bar" aria-hidden="true">
                  <span
                    style={{
                      width: index === scene ? `${(elapsed / SCENE_MS) * 100}%` : index < scene ? "100%" : "0%",
                    }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="dh-stage" id="dh-stage" ref={stageRef} data-side={mobileSide}>
          <div className="dh-switch" role="group" aria-label="Ver móvil">
            <button type="button" aria-pressed={mobileSide === "bad"} onClick={() => setManual({ scene, side: "bad" })}>
              Sin Satorus
            </button>
            <button type="button" aria-pressed={mobileSide === "good"} onClick={() => setManual({ scene, side: "good" })}>
              Con Satorus
            </button>
          </div>

          <PhoneColumn side="bad" label="Sin Satorus" result={current.badResult} done={done}>
            <BadPhone key={`bad-${current.id}`} screen={current.bad} elapsed={elapsed} />
          </PhoneColumn>
          <PhoneColumn side="good" label="Con Satorus" result={current.goodResult} done={done}>
            <GoodPhone
              key={`good-${current.id}`}
              screen={current.good}
              elapsed={elapsed}
              reduce={reduce}
            />
          </PhoneColumn>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- Marco */

function PhoneColumn({
  side,
  label,
  result,
  done,
  children,
}: {
  side: "bad" | "good"
  label: string
  result: string
  done: boolean
  children: ReactNode
}) {
  return (
    <figure className="dh-col" data-side={side}>
      <figcaption className="dh-label">
        <span className="dh-dot" aria-hidden="true" />
        {label}
      </figcaption>
      <div className="dh-phone">
        <div className="dh-screen">
          <div className="dh-status" aria-hidden="true">
            <span>10:42</span>
            <span className="dh-island" />
            <span>5G</span>
          </div>
          {children}
        </div>
      </div>
      <p className="dh-result" data-done={done || undefined}>
        {side === "good" ? <Check aria-hidden="true" size={16} strokeWidth={3} /> : null}
        {result}
      </p>
    </figure>
  )
}

const visible = <T extends { at: number }>(items: T[], elapsed: number) => items.filter((item) => item.at <= elapsed)
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((part) => /[A-Za-zÁÉÍÓÚÑáéíóúñ0-9]/.test(part[0] ?? ""))
    .slice(0, 2)
    .map((part) => part[0])
    .join("")

/* ------------------------------------------------------- Sin Satorus */

function BadPhone({ screen, elapsed }: { screen: BadScreen; elapsed: number }) {
  if (screen.app === "chats") return <ChatList base={screen.base} items={visible(screen.items, elapsed)} />

  if (screen.app === "inbox") {
    const mails = visible(screen.items, elapsed)
    return (
      <div className="ap ap-inbox">
        <header className="ap-bar ap-bar--mail">
          <b>Bandeja de entrada</b>
          <span className="ap-count ap-count--alert">{screen.unreadBefore + mails.length} sin leer</span>
        </header>
        <ul className="ap-mails">
          {[...mails].reverse().map((mail) => (
            <li key={mail.at} className="is-new is-unread">
              <MailRow mail={mail} />
            </li>
          ))}
          {screen.base.map((mail) => (
            <li key={`base-${mail.subject}`} className="is-unread">
              <MailRow mail={mail} when="hace 3 días" />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (screen.app === "notes") {
    const banners = visible(screen.items, elapsed)
    return (
      <div className="ap ap-notes">
        <Banners items={banners.slice(-2)} />
        <header className="ap-bar ap-bar--notes">
          <b>{screen.title}</b>
          <span className="ap-count ap-count--alert">{screen.todo.length} sin enviar</span>
        </header>
        <ul className="ap-todo">
          {screen.todo.map((item) => (
            <li key={item.text}>
              <span className="ap-check" aria-hidden="true" />
              <span>
                {item.text}
                <small>{item.since}</small>
              </span>
            </li>
          ))}
        </ul>
        <p className="ap-scrawl">¡¡hacer esta noche!!</p>
      </div>
    )
  }

  const items = visible(screen.items, elapsed)
  const calls = items.flatMap((item) => (item.kind === "banner" ? [] : [item]))
  const banners = items.flatMap((item) => (item.kind === "banner" ? [item] : []))
  const missed = calls.filter((item) => item.kind === "missed").length
  return (
    <div className="ap ap-calls">
      <Banners items={banners.slice(-2)} />
      <header className="ap-bar ap-bar--calls">
        <b>Recientes</b>
        <span className="ap-count ap-count--alert">{missed} perdidas</span>
      </header>
      <ul className="ap-calllog">
        {[...calls].reverse().map((call) => (
          <li key={call.at} className="is-new">
            {call.kind === "missed" ? (
              <PhoneMissed aria-hidden="true" size={18} />
            ) : (
              <Voicemail aria-hidden="true" size={18} />
            )}
            <span>
              <b className={call.kind === "missed" ? "is-missed" : undefined}>{call.who}</b>
              <small>{call.detail}</small>
            </span>
            <em>ahora</em>
          </li>
        ))}
        <li>
          <Phone aria-hidden="true" size={18} />
          <span>
            <b>Harinas del Sur</b>
            <small>Llamada saliente</small>
          </span>
          <em>ayer</em>
        </li>
      </ul>
    </div>
  )
}

function ChatList({ base, items }: { base: ChatListMessage[]; items: ChatListMessage[] }) {
  // Una fila por contacto: su último mensaje y cuántos sin leer, el más reciente arriba.
  const rows = new Map<string, { last: ChatListMessage; unread: number }>()
  for (const message of base) rows.set(message.from, { last: message, unread: 0 })
  for (const message of items) {
    const previous = rows.get(message.from)
    rows.delete(message.from)
    rows.set(message.from, { last: message, unread: (previous?.unread ?? 0) + 1 })
  }
  const ordered = [...rows.entries()].reverse()
  return (
    <div className="ap ap-chats">
      <header className="ap-bar ap-bar--chats">
        <b>Chats</b>
        {items.length > 0 ? <span className="ap-count ap-count--chat">{items.length} sin leer</span> : null}
      </header>
      <ul className="ap-chatlist">
        {ordered.map(([name, row]) => (
          <li key={`${name}-${row.last.at}`} className={row.unread ? "is-new" : undefined}>
            <span className="ap-avatar" aria-hidden="true">
              {initials(name)}
            </span>
            <span className="ap-chat-main">
              <b>{name}</b>
              <small>{row.last.text}</small>
            </span>
            <span className="ap-chat-side">
              <em>{row.unread ? "ahora" : "ayer"}</em>
              {row.unread ? <i>{row.unread}</i> : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MailRow({
  mail,
  when = "ahora",
}: {
  mail: { from: string; subject: string; preview: string }
  when?: string
}) {
  return (
    <>
      <span className="ap-avatar ap-avatar--mail" aria-hidden="true">
        {initials(mail.from)}
      </span>
      <span className="ap-mail-main">
        <b>{mail.from}</b>
        <strong>{mail.subject}</strong>
        <small>{mail.preview}</small>
      </span>
      <em>{when}</em>
    </>
  )
}

function Banners({ items }: { items: { at: number; app: string; title: string; text: string; tone?: "alert" }[] }) {
  return (
    <div className="ap-banners">
      {[...items].reverse().map((item) => (
        <div key={item.at} className="ap-banner" data-tone={item.tone}>
          <span className="ap-banner-app">{item.app}</span>
          <b>{item.title}</b>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------- Con Satorus */

function GoodPhone({
  screen,
  elapsed,
  reduce,
}: {
  screen: GoodScreen
  elapsed: number
  reduce: boolean
}) {
  const logRef = useRef<HTMLDivElement>(null)
  const shown = (screen.items as { at: number }[]).filter((item) => item.at <= elapsed).length

  // La conversación baja sola hasta lo último, dentro del móvil.
  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: reduce ? "auto" : "smooth" })
  }, [shown, reduce])

  if (screen.app === "chat") {
    const turns = visible(screen.items, elapsed)
    const last = turns[turns.length - 1]
    return (
      <div className="ap ap-convo">
        <header className="ap-bar ap-bar--convo">
          <span className="ap-avatar" aria-hidden="true">
            {initials(screen.contact)}
          </span>
          <span>
            <b>{screen.contact}</b>
            <small>{last?.kind === "typing" ? "Asistente escribiendo…" : "en línea"}</small>
          </span>
        </header>
        <div className="ap-log" ref={logRef}>
          <p className="ap-day">Hoy</p>
          {turns.map((turn, index) => {
            if (turn.kind === "typing") {
              return index === turns.length - 1 ? (
                <p key={turn.at} className="ap-msg ap-msg--bot ap-typing" aria-label="Escribiendo">
                  <i />
                  <i />
                  <i />
                </p>
              ) : null
            }
            if (turn.kind === "card") {
              return (
                <div key={turn.at} className="ap-msg ap-msg--bot ap-ordercard">
                  <b>{turn.title}</b>
                  {turn.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                  <em>{turn.action}</em>
                </div>
              )
            }
            if (turn.kind === "status") {
              return (
                <p key={turn.at} className="ap-sys">
                  <Check aria-hidden="true" size={13} strokeWidth={3} /> {turn.text}
                </p>
              )
            }
            return (
              <p key={turn.at} className={`ap-msg ap-msg--${turn.kind}`}>
                {turn.text}
                {turn.kind === "bot" ? <small>Asistente de {BUSINESS}</small> : null}
              </p>
            )
          })}
        </div>
      </div>
    )
  }

  if (screen.app === "mail") {
    const steps = visible(screen.items, elapsed)
    const last = steps[steps.length - 1]
    return (
      <div className="ap ap-thread">
        <header className="ap-bar ap-bar--mail">
          <b>Correo</b>
          <span className="ap-count ap-count--ok">0 sin contestar</span>
        </header>
        <div className="ap-log" ref={logRef}>
          {steps.map((step) => {
            if (step.kind === "drafting") {
              return last === step ? (
                <p key={step.at} className="ap-drafting">
                  <span className="ap-spin" aria-hidden="true" /> El asistente está preparando la respuesta…
                </p>
              ) : null
            }
            if (step.kind === "status") {
              return (
                <p key={step.at} className="ap-sys">
                  <Check aria-hidden="true" size={13} strokeWidth={3} /> {step.text}
                </p>
              )
            }
            if (step.kind === "in") {
              return (
                <article key={step.at} className="ap-mailcard">
                  <b>{step.from}</b>
                  <strong>{step.subject}</strong>
                  <p>{step.text}</p>
                </article>
              )
            }
            return (
              <article key={step.at} className="ap-mailcard ap-mailcard--out">
                <b>{BUSINESS} · respondido por el asistente</b>
                <p>{step.text}</p>
                {step.attachment ? (
                  <span className="ap-attach">
                    <Paperclip aria-hidden="true" size={13} /> {step.attachment}
                  </span>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    )
  }

  if (screen.app === "quote") {
    const steps = visible(screen.items, elapsed)
    const fields = steps.flatMap((step) => (step.kind === "field" ? [step] : []))
    const total = steps.flatMap((step) => (step.kind === "total" ? [step] : []))[0]
    const statuses = steps.flatMap((step) => (step.kind === "status" ? [step] : []))
    return (
      <div className="ap ap-quote">
        <header className="ap-bar ap-bar--quote">
          <FileText aria-hidden="true" size={18} />
          <b>Presupuesto · {screen.client}</b>
        </header>
        <div className="ap-doc">
          <p className="ap-doc-head">
            <b>{BUSINESS}</b>
            <span>Presupuesto n.º 0418</span>
          </p>
          <dl>
            {fields.map((field) => (
              <div key={field.at} className="is-new">
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </div>
            ))}
          </dl>
          {total ? (
            <p className="ap-total is-new">
              <span>Total</span>
              <b>{total.value}</b>
            </p>
          ) : (
            <p className="ap-drafting">
              <span className="ap-spin" aria-hidden="true" /> Rellenando con los datos del cliente…
            </p>
          )}
        </div>
        <div className="ap-steps">
          {statuses.map((status) => (
            <p key={status.at} className="ap-sys">
              <Check aria-hidden="true" size={13} strokeWidth={3} /> {status.text}
            </p>
          ))}
        </div>
      </div>
    )
  }

  const notes = visible(screen.items, elapsed)
  return (
    <div className="ap ap-feed">
      <p className="ap-lockdate">lunes, 16 de noviembre</p>
      <p className="ap-lockclock">10:42</p>
      <div className="ap-feedlist">
        {[...notes].reverse().map((note) => (
          <div key={note.at} className="ap-note is-new">
            <span className="ap-note-ic" style={{ background: note.color }} aria-hidden="true" />
            <span className="ap-note-app">{note.app}</span>
            <em>ahora</em>
            <b>{note.title}</b>
            <span className="ap-note-text">{note.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
