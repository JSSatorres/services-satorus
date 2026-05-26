"use client"

import { useEffect, useRef } from "react"

const problems = [
  {
    num: "01",
    title: "Procesos sin trazabilidad",
    desc: "Pedidos, facturas y partes de trabajo viven en Excel, WhatsApp y archivadores. Nadie sabe dónde está la versión buena.",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M3 7h18M3 12h18M3 17h12" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Horas robadas a tareas manuales",
    desc: "Tu equipo dedica el 40% de su jornada a transcribir, reenviar y reconciliar. Trabajo invisible que no genera valor.",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <circle cx={12} cy={12} r={9} /><path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "VeriFactu y compliance pendiente",
    desc: "La AEAT exige facturación verificable desde 2026. Si tu software no está listo, el riesgo legal es real.",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
        <path d="M12 3l9 16H3L12 3z" /><path d="M12 10v4M12 17h.01" />
      </svg>
    ),
  },
]

export function Problem() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target) } }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    )
    ref.current?.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} id="problema" style={{ padding: "140px 0 100px", position: "relative" }}>
      <div style={{ maxWidth: "var(--max)", margin: "0 auto", padding: "0 var(--pad)" }}>

        {/* Section header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 60, alignItems: "end", marginBottom: 72 }} className="sec-head-grid">
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 20 }}>
              <span className="dot" /> 01 · El problema
            </div>
            <h2 style={{ fontSize: "clamp(40px, 6vw, 88px)" }}>
              El{" "}
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>caos operativo</em>
              <br />ya no es una opción.
            </h2>
          </div>
          <div className="reveal d1" style={{ color: "var(--text-mid)", fontSize: 17, lineHeight: 1.65 }}>
            Hojas de cálculo que se rompen, correos olvidados, herramientas que no hablan entre sí.
            Cada hora que dedicas a copiar y pegar datos es una hora que tu competencia dedica a crecer.
          </div>
        </div>

        {/* Problem cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--border)" }} className="problem-grid-resp">
          {problems.map((p, i) => (
            <article
              key={p.num}
              className={`reveal${i > 0 ? ` d${i}` : ""}`}
              style={{
                padding: "40px 32px",
                background: "var(--bg-1)",
                position: "relative",
                transition: "background .3s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-2)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-1)" }}
            >
              {/* Number */}
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.15em",
                color: "var(--text-faint)",
                marginBottom: 28,
              }}>
                {p.num}
              </div>

              {/* Icon */}
              <div style={{
                width: 40, height: 40,
                borderRadius: 8,
                background: "rgba(255,106,53,0.08)",
                border: "1px solid rgba(255,106,53,0.18)",
                display: "grid",
                placeItems: "center",
                color: "var(--accent-warm)",
                marginBottom: 24,
              }}>
                {p.icon}
              </div>

              <h3 style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                marginBottom: 12,
                lineHeight: 1.1,
              }}>
                {p.title}
              </h3>
              <p style={{ color: "var(--text-mid)", fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                {p.desc}
              </p>
            </article>
          ))}
        </div>

        {/* Answer bar */}
        <div
          className="reveal d2"
          style={{
            marginTop: 2,
            padding: "28px 32px",
            background: "var(--bg-1)",
            border: "none",
            borderTop: "2px solid var(--accent)",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 28,
            alignItems: "center",
          }}
        >
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "var(--bg)",
            background: "var(--accent)",
            padding: "7px 14px",
            borderRadius: 4,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}>
            SATORUS
          </span>
          <p style={{
            margin: 0,
            fontSize: "clamp(16px, 1.4vw, 20px)",
            color: "var(--text)",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontStyle: "italic",
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
          }}>
            Reescribimos esos procesos como software propio — y cuando tiene sentido, los entregamos a un agente que los ejecuta solo.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .problem-grid-resp { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
