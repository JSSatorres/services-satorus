"use client"

import { useEffect, useRef, useState } from "react"
import { track } from "@vercel/analytics"
import { Check, Scissors, ShoppingBag, Stethoscope, Utensils, type LucideIcon } from "lucide-react"
import { demoBusinesses, type DemoBusinessId } from "@/lib/demo-content"

const icons: Record<DemoBusinessId, LucideIcon> = {
  bar: Utensils,
  peluqueria: Scissors,
  tienda: ShoppingBag,
  clinica: Stethoscope,
}

/** Cuánto «escribe» el asistente antes de contestar. */
const TYPING_MS = 900
/** Pausa entre el mensaje del cliente y el «escribiendo…». */
const READ_MS = 350

/**
 * Demo del asistente de WhatsApp. El visitante elige un tipo de negocio y
 * pulsa una pregunta de cliente; el asistente «escribe» y contesta. Las
 * respuestas están escritas de antemano (`lib/demo-content.ts`): no hay
 * ninguna llamada a un modelo.
 *
 * La primera pregunta se contesta sola cuando la demo entra en pantalla, para
 * que se vea viva sin tener que tocar nada. Con movimiento reducido aparece ya
 * contestada, sin «escribiendo…».
 */
export function AssistantDemo() {
  const [businessId, setBusinessId] = useState<DemoBusinessId>("bar")
  /** Preguntas ya hechas en este negocio, por orden. */
  const [asked, setAsked] = useState<number[]>([])
  /** Pregunta a la que el asistente aún está contestando. */
  const [pending, setPending] = useState<number | null>(null)
  const [typing, setTyping] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const autoPlayed = useRef(false)
  /** Copia al día de lo ya preguntado: la lee el arranque automático, que se programa al montar. */
  const askedRef = useRef<number[]>([])
  const busyRef = useRef(false)

  const business = demoBusinesses.find((item) => item.id === businessId) ?? demoBusinesses[0]

  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
  }

  useEffect(() => clearTimers, [])

  const ask = (index: number, byVisitor: boolean) => {
    if (busyRef.current || askedRef.current.includes(index)) return
    if (byVisitor) track("demo_pregunta", { negocio: businessId })
    askedRef.current = [...askedRef.current, index]
    setAsked(askedRef.current)

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    busyRef.current = true
    setPending(index)
    timers.current.push(
      window.setTimeout(() => setTyping(true), READ_MS),
      window.setTimeout(() => {
        busyRef.current = false
        setTyping(false)
        setPending(null)
      }, READ_MS + TYPING_MS),
    )
  }

  const chooseBusiness = (id: DemoBusinessId) => {
    if (id === businessId) return
    clearTimers()
    track("demo_negocio", { negocio: id })
    setBusinessId(id)
    askedRef.current = []
    busyRef.current = false
    setAsked([])
    setPending(null)
    setTyping(false)
  }

  // La primera pregunta se lanza sola al entrar en pantalla.
  useEffect(() => {
    const root = rootRef.current
    if (!root || autoPlayed.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || autoPlayed.current) return
        autoPlayed.current = true
        observer.disconnect()
        // Si el visitante ya ha tocado algo, no se le pisa.
        timers.current.push(
          window.setTimeout(() => {
            if (askedRef.current.length === 0) ask(0, false)
          }, 700),
        )
      },
      { threshold: 0.5 },
    )
    observer.observe(root)
    return () => observer.disconnect()
    // Sólo al montar: `ask` lee el estado inicial, que es el que toca.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // El último mensaje queda a la vista dentro del chat, sin mover la página.
  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [asked, typing, pending])

  const remaining = business.questions
    .map((question, index) => ({ question, index }))
    .filter(({ index }) => !asked.includes(index))

  return (
    <div className="demo" ref={rootRef}>
      <fieldset className="demo-picker">
        <legend>Elige tu tipo de negocio</legend>
        <div className="demo-picker-options">
          {demoBusinesses.map((item) => {
            const Icon = icons[item.id]
            return (
              <button
                type="button"
                key={item.id}
                aria-pressed={item.id === businessId}
                onClick={() => chooseBusiness(item.id)}
              >
                <Icon aria-hidden="true" size={18} />
                {item.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="demo-phone">
        <header className="demo-chat-head">
          <span className="demo-avatar" aria-hidden="true">
            {business.name.charAt(0)}
          </span>
          <p>
            <b>{business.name}</b>
            <small>{typing ? "escribiendo…" : "Asistente · responde al momento"}</small>
          </p>
          <span className="demo-tag">Ejemplo</span>
        </header>

        <div
          className="demo-log"
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-label={`Conversación de ejemplo con ${business.name}`}
          data-lenis-prevent
        >
          <p className="demo-day">Hoy</p>
          {asked.map((index) => {
            const question = business.questions[index]
            const answered = pending !== index
            return (
              <div className="demo-turn" key={`${business.id}-${index}`}>
                <p className="demo-msg demo-msg--client">
                  <span className="sr-only">Cliente: </span>
                  {question.ask}
                </p>
                {answered ? (
                  <>
                    <p className="demo-msg demo-msg--assistant">
                      <span className="sr-only">Asistente: </span>
                      {question.reply}
                    </p>
                    <p className="demo-did">
                      <Check aria-hidden="true" size={14} strokeWidth={3} />
                      {question.did}
                    </p>
                  </>
                ) : typing ? (
                  <p className="demo-msg demo-msg--assistant demo-typing" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>

        <div className="demo-asks">
          {remaining.length > 0 ? (
            <>
              <p>Pregunta como si fueras un cliente:</p>
              <div className="demo-asks-list">
                {remaining.map(({ question, index }) => (
                  <button
                    type="button"
                    key={`${business.id}-${index}`}
                    disabled={pending !== null}
                    onClick={() => ask(index, true)}
                  >
                    {question.ask}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="demo-asks-done">
              Así contestaría el tuyo: con tus horarios, tus precios y tu agenda.{" "}
              <a href="#contacto">Quiero uno para mi negocio</a>
            </p>
          )}
        </div>
      </div>

      <p className="demo-foot">
        Conversación de ejemplo con respuestas preparadas. El asistente de tu negocio contesta con tus datos.
      </p>
    </div>
  )
}
