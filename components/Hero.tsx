"use client"

import { useEffect, useRef } from "react"

export function Nav() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="#top" className="nav__brand">
          <span className="nav__mark"><span className="nav__mark-dot"></span></span>
          <span className="nav__brand-text"><b>satorus</b><span className="nav__brand-sub">/ es</span></span>
        </a>
        <nav className="nav__links">
          <a href="#servicios">Servicios</a>
          <a href="#aaas">Agentes IA</a>
          <a href="#capas">Arquitectura</a>
          <a href="#proceso">Proceso</a>
        </nav>
        <div className="nav__cta">
          <span className="nav__status"><span className="nav__status-dot"></span> Aceptando · Q3 2026</span>
          <a className="btn btn--pill btn--sm btn--primary" href="#contacto">Hablemos <span className="btn__arrow">→</span></a>
        </div>
      </div>
    </header>
  )
}

function AgentTerminal() {
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const body = bodyRef.current
    if (!body) return

    const script = [
      { lab: "usr", cls: "user", t: 800,  html: '<b>"hola, no me llegó la factura de pedido #4218"</b>' },
      { lab: "L2",  cls: "mem",  t: 700,  html: "memoria · buscando contexto cliente <em>ana.lopez@…</em>" },
      { lab: "L2",  cls: "mem",  t: 500,  html: "↳ 12 pedidos, último: hace 4 días · plan: <b>pro</b>" },
      { lab: "L4",  cls: "llm",  t: 900,  html: "razonamiento · plan en 3 pasos" },
      { lab: "L3",  cls: "tool", t: 700,  html: "erp.<em>get_invoice</em>(order_id=4218) → <b>OK</b>" },
      { lab: "L3",  cls: "tool", t: 600,  html: "mailer.<em>resend</em>(to=cliente, doc=inv_4218.pdf)" },
      { lab: "L1",  cls: "out",  t: 500,  html: "log → resuelta · 1.34s · $0.0021" },
      { lab: "out", cls: "out",  t: 700,  html: '<b>"¡Listo, Ana! Te la reenvié a ana.lopez@…"</b>' },
    ]

    let idx = 0
    let timeoutId: ReturnType<typeof setTimeout>

    const play = () => {
      body.innerHTML = ""
      idx = 0
      next()
    }

    const next = () => {
      if (idx >= script.length) {
        timeoutId = setTimeout(play, 3000)
        return
      }
      const s = script[idx++]
      const row = document.createElement("div")
      row.className = `aline aline--${s.cls}`
      row.innerHTML = `<span class="aline__lab">${s.lab}</span><span class="aline__txt">${s.html}</span>`
      body.appendChild(row)
      requestAnimationFrame(() => row.classList.add("on"))
      if (body.children.length > 8 && body.firstChild) body.removeChild(body.firstChild)
      timeoutId = setTimeout(next, s.t)
    }

    play()
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className="agent">
      <header className="agent__bar">
        <span className="agent__dot agent__dot--red"></span>
        <span className="agent__dot agent__dot--amb"></span>
        <span className="agent__dot agent__dot--grn"></span>
        <span className="agent__title mono small">agente-soporte · sesión #4218</span>
        <span className="agent__live"><span className="agent__live-dot"></span>LIVE</span>
      </header>
      <div className="agent__body" ref={bodyRef}></div>
      <footer className="agent__footer">
        <div className="agent__input">
          <span className="mono dim small">›</span>
          <span className="mono small agent__cursor">esperando entrada…</span>
        </div>
        <div className="agent__metrics">
          <span className="chip"><span className="chip__k">latencia</span><span className="chip__v">82ms</span></span>
          <span className="chip"><span className="chip__k">coste</span><span className="chip__v">$0.0021</span></span>
          <span className="chip"><span className="chip__k">tokens</span><span className="chip__v">3.4k</span></span>
        </div>
      </footer>
    </div>
  )
}

export function Hero() {
  const heroRightRef = useRef<HTMLElement>(null)
  const calloutTopRef = useRef<HTMLDivElement>(null)
  const calloutBotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const agent = heroRightRef.current
    const cTop  = calloutTopRef.current
    const cBot  = calloutBotRef.current
    if (!agent) return

    const handler = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth  - 0.5
      const y = e.clientY / window.innerHeight - 0.5
      agent.style.transform = `translate3d(${x * -10}px, ${y * -8}px, 0)`
      if (cTop) cTop.style.transform = `translate3d(${x * 18}px, ${y * 12}px, 0)`
      if (cBot) cBot.style.transform = `translate3d(${x * -22}px, ${y * -14}px, 0)`
    }
    window.addEventListener("pointermove", handler)
    return () => window.removeEventListener("pointermove", handler)
  }, [])

  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden="true">
        <svg className="hero__lines" viewBox="0 0 1440 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lg1" x1="0" x2="1">
              <stop offset="0" stopColor="#FF6A1F" stopOpacity="0"/>
              <stop offset=".5" stopColor="#FF6A1F" stopOpacity=".6"/>
              <stop offset="1" stopColor="#FF6A1F" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="lg2" x1="0" x2="1">
              <stop offset="0" stopColor="#B4E04C" stopOpacity="0"/>
              <stop offset=".5" stopColor="#B4E04C" stopOpacity=".4"/>
              <stop offset="1" stopColor="#B4E04C" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M-50 620 Q 360 580 720 620 T 1490 600" stroke="url(#lg1)" strokeWidth="1" fill="none" className="hero__line hero__line--1"/>
          <path d="M-50 660 Q 360 700 720 660 T 1490 680" stroke="url(#lg2)" strokeWidth="1" fill="none" className="hero__line hero__line--2"/>
          <path d="M-50 580 Q 360 540 720 580 T 1490 560" stroke="#ffffff" strokeOpacity=".07" strokeWidth="1" fill="none" className="hero__line hero__line--3"/>
        </svg>
      </div>

      <div className="container hero__grid">
        <div className="hero__left">
          <span className="eyebrow"><span className="eyebrow__dot"></span> Software & IA — Alicante / remoto</span>
          <h1 className="hero__title">
            <span className="reveal-line"><span>Software a medida</span></span>
            <span className="reveal-line"><span>e <em className="serif">inteligencia</em></span></span>
            <span className="reveal-line"><span>que se ejecuta sola.</span></span>
          </h1>
          <p className="hero__lede">
            Construimos plataformas, ERPs y <b>agentes de IA autónomos</b> que sustituyen las tareas repetitivas. Para pymes que se quedaron sin paciencia con las herramientas genéricas.
          </p>
          <div className="hero__ctas">
            <a className="btn btn--pill btn--primary" href="#aaas">
              Conoce los agentes
              <span className="btn__arrow">→</span>
            </a>
            <a className="btn btn--ghost" href="#contacto">
              Auditoría gratuita <span className="btn__arrow">↗</span>
            </a>
          </div>

          <div className="hero__meta">
            <div className="hero__meta-item">
              <span className="mono small dim">// next slot</span>
              <span className="hero__meta-val">Q3·2026</span>
            </div>
            <div className="hero__meta-item">
              <span className="mono small dim">// first demo</span>
              <span className="hero__meta-val">en 14 días</span>
            </div>
            <div className="hero__meta-item">
              <span className="mono small dim">// stack</span>
              <span className="hero__meta-val">propio · auditable</span>
            </div>
          </div>
        </div>

        <aside className="hero__right" ref={heroRightRef}>
          <AgentTerminal />

          <div className="callout callout--top" ref={calloutTopRef}>
            <span className="mono small dim">L4 · razonamiento</span>
            <span className="callout__val">Claude · 0.8s</span>
          </div>
          <div className="callout callout--bot" ref={calloutBotRef}>
            <span className="mono small dim">L3 · function</span>
            <span className="callout__val">erp.crear_pedido()</span>
          </div>
        </aside>
      </div>
    </section>
  )
}
