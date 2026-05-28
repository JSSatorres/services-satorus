"use client"

import { useEffect, useRef } from "react"

export function Stats() {
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const els = rowRef.current?.querySelectorAll<HTMLElement>("[data-count]")
    if (!els) return
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const el = e.target as HTMLElement
        const target = Number(el.dataset.count)
        const suffix = el.dataset.suffix || ""
        const dur = 1400
        const t0 = performance.now()
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / dur)
          const eased = 1 - Math.pow(1 - k, 3)
          el.textContent = Math.round(target * eased) + suffix
          if (k < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        io.unobserve(el)
      }
    }, { threshold: 0.4 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className="stats">
      <div className="container stats__row" ref={rowRef}>
        <div className="stat">
          <span className="stat__num" data-count="12" data-suffix="+">0</span>
          <span className="stat__lbl">proyectos en producción</span>
        </div>
        <div className="stat">
          <span className="stat__num" data-count="94" data-suffix="%">0</span>
          <span className="stat__lbl">horas administrativas ahorradas</span>
        </div>
        <div className="stat">
          <span className="stat__num">24<span className="stat__divider">/</span>7</span>
          <span className="stat__lbl">agentes operando sin descanso</span>
        </div>
        <div className="stat">
          <span className="stat__num" data-count="48" data-suffix="h">0</span>
          <span className="stat__lbl">primera propuesta técnica</span>
        </div>
      </div>
    </section>
  )
}

export function Marquee() {
  const items = ["Python","FastAPI","React","Node.js","PostgreSQL","Docker","OpenAI","LangChain","n8n","Supabase","AWS","Stripe","Twilio"]
  const track = [...items, ...items]
  return (
    <section className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {track.map((t, i) => (
          <span key={i}>{t}<span className="dot"> ·</span></span>
        ))}
      </div>
    </section>
  )
}

export function Problem() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible")
          io.unobserve(e.target)
        }
      }
    }, { threshold: 0.15 })
    gridRef.current?.querySelectorAll(".pcard").forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className="problem" id="problema">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow"><span className="eyebrow__dot"></span> 01 / EL PROBLEMA</span>
          <h2 className="section-title">El <em className="serif">caos operativo</em><br/>ya no es una opción.</h2>
          <p className="section-lede">Hojas de cálculo que se rompen, correos olvidados, herramientas que no hablan entre sí. Cada hora que dedicas a copiar y pegar datos es una hora que tu competencia dedica a crecer.</p>
        </header>

        <div className="problem__grid" ref={gridRef}>
          <article className="pcard">
            <span className="pcard__num mono">01</span>
            <h3>Procesos sin <em className="serif">trazabilidad</em></h3>
            <p>Pedidos, facturas y partes de trabajo viven en Excel, WhatsApp y archivadores. Nadie sabe dónde está la versión buena.</p>
            <div className="pcard__viz">
              <div className="pcard__viz-row"><span>excel.xlsx</span><span className="pcard__viz-tag">v17_final_FINAL</span></div>
              <div className="pcard__viz-row"><span>whatsapp</span><span className="pcard__viz-tag">312 unread</span></div>
              <div className="pcard__viz-row"><span>email</span><span className="pcard__viz-tag">no responde</span></div>
            </div>
          </article>

          <article className="pcard">
            <span className="pcard__num mono">02</span>
            <h3>Horas robadas a tareas <em className="serif">manuales</em></h3>
            <p>Tu equipo dedica el 40% de su jornada a transcribir, reenviar y reconciliar. Trabajo invisible que no genera valor.</p>
            <div className="pcard__viz pcard__viz--bar">
              <div className="pcard__bar"><span style={{"--w": "40%"} as React.CSSProperties} data-bar></span><label className="mono small">manual <b>40%</b></label></div>
              <div className="pcard__bar"><span style={{"--w": "22%"} as React.CSSProperties} data-bar></span><label className="mono small">reuniones <b>22%</b></label></div>
              <div className="pcard__bar"><span style={{"--w": "38%"} as React.CSSProperties} data-bar></span><label className="mono small">producir <b>38%</b></label></div>
            </div>
          </article>

          <article className="pcard">
            <span className="pcard__num mono">03</span>
            <h3>VeriFactu y <em className="serif">compliance</em> pendiente</h3>
            <p>La AEAT exige facturación verificable desde 2026. Si tu software no está listo, el riesgo legal es real.</p>
            <div className="pcard__viz pcard__viz--countdown">
              <div className="pcard__cd"><span className="pcard__cd-n">07</span><label className="mono small">meses</label></div>
              <div className="pcard__cd"><span className="pcard__cd-n">14</span><label className="mono small">días</label></div>
              <div className="pcard__cd"><span className="pcard__cd-n">02</span><label className="mono small">horas</label></div>
              <span className="mono small dim pcard__cd-cap">→ deadline AEAT</span>
            </div>
          </article>
        </div>

        <div className="problem__footer">
          <span className="mono small dim">// SATORUS</span>
          <p>Reescribimos esos procesos como software propio — y, cuando tiene sentido, los entregamos a un <b>agente que los ejecuta solo</b>.</p>
        </div>
      </div>
    </section>
  )
}
