"use client"

import { useEffect, useRef } from "react"

const steps = [
  {
    marker: "01",
    title: "Auditoría operativa",
    desc: "Una semana en tus zapatos: dónde se rompe el flujo, qué tareas matan al equipo, qué automatizar primero.",
    accent: true,
  },
  {
    marker: "02",
    title: "Diseño & prototipo",
    desc: "Maquetamos el sistema en Figma + un prototipo clicable. Antes de escribir código, validamos contigo.",
    accent: false,
  },
  {
    marker: "03",
    title: "Build en sprints",
    desc: "Sprints de 2 semanas con demo y feedback. Despliegues continuos. Ves el progreso real cada lunes.",
    accent: true,
  },
  {
    marker: "04",
    title: "Operación y evolución",
    desc: "Monitorizamos, iteramos y entrenamos a los agentes con tus datos. El sistema mejora con el uso.",
    accent: false,
  },
]

export function Methodology() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target) } }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    )
    ref.current?.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} id="proceso" className="sec-pad-resp" style={{ padding: "140px 0 100px" }}>
      <div style={{ maxWidth: "var(--max)", margin: "0 auto", padding: "0 var(--pad)" }}>

        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 60, alignItems: "end", marginBottom: 80 }} className="sec-head-grid">
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 20 }}>
              <span className="dot" /> 04 · Proceso
            </div>
            <h2 style={{ fontSize: "clamp(40px, 6vw, 88px)" }}>
              De idea a{" "}
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>producción</em>
              ,<br />cuatro pasos.
            </h2>
          </div>
          <div className="reveal d1" style={{ color: "var(--text-mid)", fontSize: 17, lineHeight: 1.65 }}>
            Sprints cortos con demos cada dos semanas. Ves el producto crecer, decides qué priorizar,
            y desde el primer mes ya hay algo funcionando en producción.
          </div>
        </div>

        {/* Steps grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" }} className="road-grid-resp">

          {/* Connector line */}
          <div className="road-line-resp" style={{
            position: "absolute",
            top: 27,
            left: "3%", right: "3%",
            height: 1,
            background: "linear-gradient(90deg, transparent, var(--border-hi) 15%, var(--border-hi) 85%, transparent)",
          }} />

          {steps.map((s, i) => (
            <div
              key={s.marker}
              className={`reveal${i > 0 ? ` d${i}` : ""}`}
              style={{ padding: "0 20px 0 0", position: "relative" }}
            >
              {/* Marker circle */}
              <div style={{
                width: 54, height: 54,
                borderRadius: "50%",
                background: s.accent ? "rgba(200,255,61,0.08)" : "var(--bg-1)",
                border: `1px solid ${s.accent ? "var(--accent)" : "var(--border-hi)"}`,
                display: "grid",
                placeItems: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.1em",
                color: s.accent ? "var(--accent)" : "var(--text-dim)",
                marginBottom: 28,
                position: "relative",
                zIndex: 2,
                transition: "transform .3s var(--ease-out), box-shadow .3s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = "scale(1.08)"
                el.style.boxShadow = s.accent
                  ? "0 0 24px -4px rgba(200,255,61,0.4)"
                  : "0 0 16px -4px rgba(255,255,255,0.1)"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = "none"
                el.style.boxShadow = "none"
              }}
              >
                {s.marker}
              </div>

              <h4 style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 17,
                letterSpacing: "-0.02em",
                margin: "0 0 10px",
                lineHeight: 1.2,
              }}>
                {s.title}
              </h4>
              <p style={{ color: "var(--text-mid)", fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
