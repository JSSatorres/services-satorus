"use client"

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, Calculator, CalendarDays, Check, FileSpreadsheet, MessageCircle, NotebookPen, Sparkles } from "lucide-react"

/**
 * Seis propuestas de portada para comparar (`/portadas`). Cada una es una
 * sección completa con su titular, su botón y su animación. Los datos son de
 * ejemplo.
 */

const REDUCED = "(prefers-reduced-motion: reduce)"
function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED)
  query.addEventListener("change", onChange)
  return () => query.removeEventListener("change", onChange)
}
function useReduced() {
  return useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false)
}

/** `true` mientras el elemento está en pantalla: las animaciones se paran fuera. */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, inView] as const
}

function Option({ n, name, note }: { n: number; name: string; note: string }) {
  return (
    <p className="pt-option">
      <b>Opción {n}</b> {name}
      <small>{note}</small>
    </p>
  )
}

function Cta({ children = "Hablemos de tu negocio" }: { children?: ReactNode }) {
  return (
    <Link className="hv-cta" href="/#contacto">
      {children}
      <ArrowRight aria-hidden="true" size={24} strokeWidth={2.2} />
    </Link>
  )
}

/* =============================================== 1 · Pregúntale a tu negocio */

type Answer =
  | { kind: "table"; title: string; rows: [string, string, string][]; foot: string }
  | { kind: "list"; title: string; rows: [string, string, string][]; action: string }
  | { kind: "done"; title: string; lines: string[] }

const QUESTIONS: { q: string; a: Answer }[] = [
  {
    q: "¿Cuántos pedidos tengo para mañana?",
    a: {
      kind: "table",
      title: "Mañana tienes 14 pedidos",
      rows: [
        ["9:00", "Pedro", "2 docenas de croissants"],
        ["10:30", "Hotel Alhambra", "40 desayunos"],
        ["13:00", "Marta", "Tarta de queso entera"],
      ],
      foot: "Y 11 más · 412,50 € en total",
    },
  },
  {
    q: "¿Quién me debe dinero?",
    a: {
      kind: "list",
      title: "3 clientes tienen pagos pendientes",
      rows: [
        ["Catering Ruiz", "180,00 €", "hace 12 días"],
        ["Bar Central", "96,50 €", "hace 5 días"],
        ["Laura Gómez", "45,00 €", "señal de la comunión"],
      ],
      action: "Enviar un recordatorio a los 3",
    },
  },
  {
    q: "Contesta a todos los que preguntan por precios",
    a: {
      kind: "done",
      title: "Hecho: 12 conversaciones contestadas",
      lines: ["Con la lista de precios de esta semana.", "3 quieren encargar: te los he dejado en Pedidos."],
    },
  },
  {
    q: "Prepara el presupuesto de la boda Sánchez",
    a: {
      kind: "done",
      title: "Presupuesto 0418 listo · 540,00 €",
      lines: ["Tarta de 3 pisos y mesa dulce para 120 personas.", "Enviado por WhatsApp y por correo."],
    },
  },
]

export function HeroAsk() {
  const reduce = useReduced()
  const [ref, inView] = useInView<HTMLElement>()
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState(0)
  const [phase, setPhase] = useState<"typing" | "thinking" | "answer">("typing")
  const item = QUESTIONS[index]

  useEffect(() => {
    if (reduce || !inView) return
    let timer: number
    if (phase === "typing") {
      if (typed < item.q.length) timer = window.setTimeout(() => setTyped((t) => t + 1), 42)
      else timer = window.setTimeout(() => setPhase("thinking"), 450)
    } else if (phase === "thinking") {
      timer = window.setTimeout(() => setPhase("answer"), 1100)
    } else {
      timer = window.setTimeout(() => {
        setIndex((i) => (i + 1) % QUESTIONS.length)
        setTyped(0)
        setPhase("typing")
      }, 4600)
    }
    return () => window.clearTimeout(timer)
  }, [phase, typed, item.q.length, reduce, inView])

  const jump = (i: number) => {
    setIndex(i)
    setTyped(reduce ? QUESTIONS[i].q.length : 0)
    setPhase(reduce ? "answer" : "typing")
  }

  const shownTyped = reduce ? item.q.length : typed
  const shownPhase = reduce ? "answer" : phase
  const a = item.a

  return (
    <section className="pt pt-ask" ref={ref} aria-labelledby="pt1">
      <Option n={1} name="Pregúntale a tu negocio" note="La IA, funcionando en tu idioma" />
      <div className="pt-ask-in">
        <p className="hs-kicker hs-kicker--light">
          <span>Webs, apps e IA para pymes</span>
        </p>
        <h2 id="pt1" className="pt-title">
          Tu negocio, con <em>inteligencia propia.</em>
        </h2>
        <p className="pt-lead">
          Pregúntale como le preguntarías a tu encargado: pedidos, cobros, clientes, presupuestos. Contesta con tus datos y
          hace el trabajo.
        </p>

        <div className="pt-prompt" aria-live="polite">
          <div className="pt-prompt-box">
            <Sparkles aria-hidden="true" size={22} />
            <p>
              {item.q.slice(0, shownTyped)}
              {shownPhase === "typing" ? <span className="pt-caret" aria-hidden="true" /> : null}
            </p>
            <span className="pt-send" aria-hidden="true">
              <ArrowRight size={20} />
            </span>
          </div>

          <div className="pt-answer-slot">
            {shownPhase === "thinking" ? (
              <p className="pt-thinking">
                <i />
                <i />
                <i /> Mirando tus pedidos, clientes y facturas…
              </p>
            ) : null}
            {shownPhase === "answer" ? (
              <div className="pt-answer" key={index}>
                <p className="pt-answer-title">
                  <Check aria-hidden="true" size={18} strokeWidth={3} /> {a.title}
                </p>
                {a.kind === "table" ? (
                  <>
                    <table>
                      <tbody>
                        {a.rows.map((row) => (
                          <tr key={row[1]}>
                            <td>{row[0]}</td>
                            <td>{row[1]}</td>
                            <td>{row[2]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="pt-answer-foot">{a.foot}</p>
                  </>
                ) : null}
                {a.kind === "list" ? (
                  <>
                    <ul>
                      {a.rows.map((row) => (
                        <li key={row[0]}>
                          <b>{row[0]}</b>
                          <span>{row[1]}</span>
                          <small>{row[2]}</small>
                        </li>
                      ))}
                    </ul>
                    <span className="pt-answer-action">{a.action}</span>
                  </>
                ) : null}
                {a.kind === "done"
                  ? a.lines.map((line) => (
                      <p key={line} className="pt-answer-line">
                        {line}
                      </p>
                    ))
                  : null}
              </div>
            ) : null}
          </div>

          <div className="pt-suggest">
            {QUESTIONS.map((question, i) => (
              <button type="button" key={question.q} aria-pressed={i === index} onClick={() => jump(i)}>
                {question.q}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-actions">
          <Cta />
        </div>
      </div>
    </section>
  )
}

/* ================================================ 2 · Todo en un solo sitio */

const TOOLS = [
  { icon: MessageCircle, name: "WhatsApp", text: "23 sin leer", pos: [6, 14, -8] },
  { icon: FileSpreadsheet, name: "Pedidos.xlsx", text: "¿cuál es la última versión?", pos: [58, 6, 6] },
  { icon: NotebookPen, name: "Libreta", text: "apuntar: tarta de Marta", pos: [64, 62, -5] },
  { icon: CalendarDays, name: "Calendario", text: "martes: 2 citas a las 10:00", pos: [2, 64, 7] },
  { icon: Calculator, name: "Calculadora", text: "total presupuesto: ¿?", pos: [34, 78, -3] },
] as const

const SYSTEM_ROWS = ["Mensajes contestados", "Pedidos al día", "Notas y encargos", "Agenda sin solapes", "Presupuestos enviados"]

export function HeroUnify() {
  const reduce = useReduced()
  const [ref, inView] = useInView<HTMLElement>()
  const [ordered, setOrdered] = useState(false)

  useEffect(() => {
    if (reduce || !inView) return
    const timer = window.setTimeout(() => setOrdered((value) => !value), ordered ? 5200 : 2800)
    return () => window.clearTimeout(timer)
  }, [ordered, reduce, inView])

  const isOrdered = reduce || ordered

  return (
    <section className="pt pt-unify" ref={ref} aria-labelledby="pt2" data-ordered={isOrdered || undefined}>
      <Option n={2} name="Todo lo que usas, en un solo sitio" note="El cambio de herramienta, contado en 3 segundos" />
      <div className="pt-split">
        <div className="pt-copy">
          <p className="hs-kicker">
            <span>Webs, apps e IA para pymes</span>
          </p>
          <h2 id="pt2" className="pt-title">
            Deja de saltar <em>entre cinco sitios.</em>
          </h2>
          <p className="pt-lead">
            WhatsApp, el Excel, la libreta, el calendario y la calculadora. Lo juntamos en un solo sistema que contesta,
            apunta y calcula por ti.
          </p>
          <div className="pt-actions">
            <Cta />
          </div>
        </div>

        <div className="pt-unify-stage" aria-hidden="true">
          {TOOLS.map((tool, i) => {
            const Icon = tool.icon
            return (
              <div
                className="pt-tool"
                key={tool.name}
                style={{
                  left: `${tool.pos[0]}%`,
                  top: `${tool.pos[1]}%`,
                  rotate: `${tool.pos[2]}deg`,
                  animationDelay: `${i * -1.1}s`,
                  transitionDelay: `${i * 70}ms`,
                }}
              >
                <Icon size={20} />
                <span>
                  <b>{tool.name}</b>
                  <small>{tool.text}</small>
                </span>
              </div>
            )
          })}
          <div className="pt-system">
            <p className="pt-system-head">
              <b>satorus.</b> Tu sistema
            </p>
            <ul>
              {SYSTEM_ROWS.map((row, i) => (
                <li key={row} style={{ transitionDelay: `${350 + i * 120}ms` }}>
                  <Check size={16} strokeWidth={3} /> {row}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================== 3 · Palabras que se tachan */

const CHORES = ["Contestar.", "Presupuestar.", "Cobrar.", "Organizar."]

export function HeroStrike() {
  const reduce = useReduced()
  const [ref, inView] = useInView<HTMLElement>()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (reduce || !inView) return
    const timer = window.setTimeout(
      () => setStep((value) => (value >= CHORES.length + 2 ? 0 : value + 1)),
      step === 0 ? 1000 : step > CHORES.length ? 2200 : 1250,
    )
    return () => window.clearTimeout(timer)
  }, [step, reduce, inView])

  const done = reduce ? CHORES.length : Math.min(step, CHORES.length)

  return (
    <section className="pt pt-strike" ref={ref} aria-labelledby="pt3">
      <Option n={3} name="Palabras que se tachan" note="Seria, contundente y barata de hacer" />
      <div className="pt-split">
        <ul className="pt-chores" aria-label="Tareas que hace tu sistema">
          {CHORES.map((word, i) => (
            <li key={word} data-done={i < done || undefined}>
              <span className="pt-chore">{word}</span>
              <span className="pt-done">Hecho.</span>
            </li>
          ))}
        </ul>
        <div className="pt-copy">
          <p className="hs-kicker hs-kicker--light">
            <span>Webs, apps e IA para pymes</span>
          </p>
          <h2 id="pt3" className="pt-title pt-title--sm">
            Tú haz lo que sabes hacer. <em>Del resto se encarga tu sistema.</em>
          </h2>
          <p className="pt-lead">
            Un asistente que contesta, una web que vende, un programa que presupuesta y cobra. Hecho a la medida de tu
            negocio.
          </p>
          <div className="pt-actions">
            <Cta />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ============================================== 4 · Vídeo real con una frase */

export function HeroFilm() {
  const reduce = useReduced()
  return (
    <section className="pt pt-film" aria-labelledby="pt4">
      <Option n={4} name="Vídeo real con una frase" note="Aquí con el vídeo actual de la mesa; lo ideal es grabar dueños reales" />
      {reduce ? null : (
        <video className="pt-film-video" autoPlay muted loop playsInline poster="/images/daily-tangle.png" aria-hidden="true">
          <source src="/videos/satorus-hero-loop.mp4" type="video/mp4" />
        </video>
      )}
      <div className="pt-film-copy">
        <p className="hs-kicker hs-kicker--light">
          <span>Webs, apps e IA para pymes · Granada</span>
        </p>
        <h2 id="pt4" className="pt-title pt-title--xl">
          Tú haz lo que sabes hacer.
          <em>Del resto, nos encargamos.</em>
        </h2>
        <div className="pt-film-row">
          <p className="pt-lead">
            Webs que traen clientes, asistentes que contestan y programas que llevan la caja. Para negocios que no tienen
            tiempo para la tecnología.
          </p>
          <Cta />
        </div>
      </div>
    </section>
  )
}

/* ================================================ 5 · Red de inteligencia */

const VERBS = ["atiende.", "vende.", "organiza.", "responde."]

export function HeroNetwork() {
  const reduce = useReduced()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ref, inView] = useInView<HTMLElement>()
  const [verb, setVerb] = useState(0)

  useEffect(() => {
    if (reduce || !inView) return
    const timer = window.setInterval(() => setVerb((v) => (v + 1) % VERBS.length), 2200)
    return () => window.clearInterval(timer)
  }, [reduce, inView])

  useEffect(() => {
    const canvas = canvasRef.current
    const section = ref.current
    if (!canvas || !section) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0
    let frame = 0
    const mouse = { x: -9999, y: -9999 }
    type P = { x: number; y: number; vx: number; vy: number; r: number }
    let points: P[] = []

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      width = section.clientWidth
      height = section.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(130, (width * height) / 11000))
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const p of points) {
        if (!reduce) {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0 || p.x > width) p.vx *= -1
          if (p.y < 0 || p.y > height) p.vy *= -1
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const d = Math.hypot(dx, dy)
          if (d < 180) {
            p.x += (dx / d) * 0.35
            p.y += (dy / d) * 0.35
          }
        }
      }
      for (let i = 0; i < points.length; i++) {
        const a = points[i]
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 130) {
            ctx.strokeStyle = `rgba(140, 165, 255, ${(1 - d / 130) * 0.35})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
        const near = Math.hypot(mouse.x - a.x, mouse.y - a.y) < 160
        if (near) {
          ctx.strokeStyle = "rgba(223, 233, 122, 0.55)"
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
        ctx.fillStyle = near ? "#dfe97a" : "rgba(200, 212, 255, 0.85)"
        ctx.beginPath()
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2)
        ctx.fill()
      }
      if (!reduce) frame = requestAnimationFrame(draw)
    }

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect()
      mouse.x = event.clientX - rect.left
      mouse.y = event.clientY - rect.top
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()
    if (inView || reduce) draw()
    window.addEventListener("resize", resize)
    section.addEventListener("pointermove", onMove)
    section.addEventListener("pointerleave", onLeave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
      section.removeEventListener("pointermove", onMove)
      section.removeEventListener("pointerleave", onLeave)
    }
  }, [reduce, inView, ref])

  return (
    <section className="pt pt-network" ref={ref} aria-labelledby="pt5">
      <canvas ref={canvasRef} className="pt-canvas" aria-hidden="true" />
      <Option n={5} name="Red de inteligencia" note="Mueve el ratón por encima: la red reacciona" />
      <div className="pt-network-in">
        <p className="hs-kicker hs-kicker--light">
          <span>Webs, apps e IA para pymes</span>
        </p>
        <h2 id="pt5" className="pt-title pt-title--xl">
          Una inteligencia que{" "}
          <span className="pt-verb" key={verb}>
            {VERBS[reduce ? 0 : verb]}
          </span>
        </h2>
        <p className="pt-lead">
          Asistentes, webs y programas conectados a los datos de tu negocio. Trabajan juntos, a cualquier hora, para que tú
          no tengas que estar pendiente.
        </p>
        <div className="pt-actions">
          <Cta />
        </div>
      </div>
    </section>
  )
}

/* ============================================ 6 · Te devolvemos tu tarde */

const DAY_MIN = 12 * 60 // de 9:00 a 21:00
const TASKS = [
  { name: "Contestar WhatsApp", start: 20, min: 70 },
  { name: "Hacer presupuestos", start: 160, min: 40 },
  { name: "Devolver llamadas", start: 300, min: 30 },
  { name: "Caja y papeles", start: 620, min: 25 },
]
const R = 120
const CIRC = 2 * Math.PI * R

export function HeroTime() {
  const reduce = useReduced()
  const ref = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  // El progreso sale del scroll: según la sección cruza la pantalla, las tareas pasan al asistente.
  useEffect(() => {
    if (reduce) return
    const section = ref.current
    if (!section) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const value = (vh - rect.top) / (vh + rect.height * 0.35)
      setProgress(Math.max(0, Math.min(1, value)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [reduce])

  const shown = reduce ? 1 : progress
  const doneCount = TASKS.filter((_, i) => shown > 0.45 + i * 0.1).length
  const freed = TASKS.slice(0, doneCount).reduce((sum, task) => sum + task.min, 0)
  const total = TASKS.reduce((sum, task) => sum + task.min, 0)
  const format = (m: number) => `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")} min`

  return (
    <section className="pt pt-time" ref={ref} aria-labelledby="pt6">
      <Option n={6} name="Te devolvemos tu tarde" note="Baja despacio: las tareas pasan al asistente con el scroll" />
      <div className="pt-split">
        <div className="pt-copy">
          <p className="hs-kicker">
            <span>Webs, apps e IA para pymes</span>
          </p>
          <h2 id="pt6" className="pt-title">
            Las tareas que te comen el día, <em>hechas solas.</em>
          </h2>
          <p className="pt-lead">
            Contestar mensajes, hacer presupuestos, devolver llamadas, cuadrar la caja. Lo hace tu sistema mientras tú
            atiendes a tus clientes.
          </p>
          <div className="pt-actions">
            <Cta />
          </div>
          <p className="pt-small">Ejemplo de un día de 9:00 a 21:00 en un negocio pequeño.</p>
        </div>

        <div className="pt-clock">
          <svg viewBox="0 0 300 300" role="img" aria-label={`Tiempo en tareas: ${format(total)}. Libre gracias al asistente: ${format(freed)}.`}>
            <circle cx="150" cy="150" r={R} className="pt-ring" />
            {TASKS.map((task, i) => (
              <circle
                key={task.name}
                cx="150"
                cy="150"
                r={R}
                className="pt-seg"
                data-done={i < doneCount || undefined}
                strokeDasharray={`${(task.min / DAY_MIN) * CIRC} ${CIRC}`}
                strokeDashoffset={-(task.start / DAY_MIN) * CIRC}
              />
            ))}
            <text x="150" y="40" className="pt-hour">9:00</text>
            <text x="150" y="272" className="pt-hour">15:00</text>
          </svg>
          <div className="pt-clock-center">
            <small>{doneCount === TASKS.length ? "Libres cada día" : "En tareas cada día"}</small>
            <b data-done={doneCount === TASKS.length || undefined}>{format(doneCount === TASKS.length ? total : total - freed)}</b>
          </div>
          <ul className="pt-tasks">
            {TASKS.map((task, i) => (
              <li key={task.name} data-done={i < doneCount || undefined}>
                <span>{task.name}</span>
                <small>{i < doneCount ? "Lo hace tu asistente" : `Lo haces tú · ${task.min} min`}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
