"use client"

import { useEffect, useRef } from "react"

const steps = [
  {
    marker: "01",
    title: "Auditoría operativa",
    desc: "Una semana en tus zapatos: dónde se rompe el flujo, qué tareas matan al equipo, qué automatizar primero.",
    odd: true,
  },
  {
    marker: "02",
    title: "Diseño & prototipo",
    desc: "Maquetamos el sistema en Figma + un prototipo clicable. Antes de escribir código, validamos contigo.",
    odd: false,
  },
  {
    marker: "03",
    title: "Build en sprints",
    desc: "Sprints de 2 semanas con demo y feedback. Despliegues continuos. Tú ves el progreso real cada lunes.",
    odd: true,
  },
  {
    marker: "04",
    title: "Operación y evolución",
    desc: "Monitorizamos, iteramos y entrenamos a los agentes con tus datos. El sistema mejora con el uso.",
    odd: false,
  },
]

export function Methodology() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target) }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    )
    ref.current?.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id="proceso"
      style={{ padding: "140px 0 100px", position: "relative" }}
    >
      <div style={{ maxWidth: "var(--max)", margin: "0 auto", padding: "0 var(--pad)", position: "relative" }}>

        {/* Header */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 60, alignItems: "end", marginBottom: 64 }}
          className="sec-head-grid"
        >
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 18 }}>· 05 / Proceso</div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 6vw, 84px)",
                fontWeight: 400,
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                maxWidth: "16ch",
              }}
            >
              De idea a{" "}
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>producción</em>,<br />en cuatro pasos.
            </h2>
          </div>
          <div className="reveal d1" style={{ color: "var(--text-mid)", fontSize: 17 }}>
            Trabajamos en sprints cortos con demos cada dos semanas. Ves el producto crecer,
            decides qué priorizar, y desde el primer mes ya hay algo funcionando.
          </div>
        </div>

        {/* Road */}
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative", marginTop: 30 }}
          className="road-grid-resp"
        >
          {/* Connector line */}
          <div
            style={{
              position: "absolute",
              top: 28,
              left: "6%",
              right: "6%",
              height: 1,
              background: "linear-gradient(90deg, var(--border) 0%, var(--accent) 50%, var(--border) 100%)",
            }}
            className="road-line-resp"
          />

          {steps.map((s, i) => (
            <div
              key={s.marker}
              className={`reveal${i > 0 ? ` d${i}` : ""}`}
              style={{ padding: "0 14px", position: "relative" }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--bg-1)",
                  border: `1px solid ${s.odd ? "var(--accent)" : "var(--border-hi)"}`,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: s.odd ? "var(--accent)" : "var(--text-mid)",
                  marginBottom: 22,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {s.marker}
              </div>
              <h4
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  fontSize: 16,
                  margin: "0 0 8px",
                  lineHeight: 1.3,
                  letterSpacing: "-0.005em",
                }}
              >
                {s.title}
              </h4>
              <p style={{ color: "var(--text-mid)", fontSize: 13.5, lineHeight: 1.55, margin: 0 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .sec-head-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .road-grid-resp { grid-template-columns: 1fr !important; gap: 28px !important; }
          .road-line-resp { display: none !important; }
        }
      `}</style>
    </section>
  )
}
