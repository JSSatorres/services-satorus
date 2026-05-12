"use client"

import { useEffect, useRef } from "react"

const problems = [
  {
    num: "01",
    title: "Procesos sin trazabilidad",
    desc: "Pedidos, facturas y partes de trabajo viven en Excel, WhatsApp y archivadores. Nadie sabe dónde está la versión buena.",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--accent-warm)" strokeWidth={1.6} strokeLinecap="round">
        <path d="M3 7h18M3 12h18M3 17h12" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Horas robadas a tareas manuales",
    desc: "Tu equipo dedica el 40% de su jornada a transcribir, reenviar y reconciliar. Trabajo invisible que no genera valor.",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--accent-warm)" strokeWidth={1.6} strokeLinecap="round">
        <circle cx={12} cy={12} r={9} />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "VeriFactu y compliance pendiente",
    desc: "La AEAT exige facturación verificable desde 2026. Si tu software no está listo, el riesgo legal es real.",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--accent-warm)" strokeWidth={1.6} strokeLinecap="round">
        <path d="M12 3l9 16H3L12 3z" />
        <path d="M12 10v4M12 17h.01" />
      </svg>
    ),
  },
]

export function Problem() {
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
      id="problema"
      style={{ padding: "140px 0 100px", position: "relative" }}
    >
      <div style={{ maxWidth: "var(--max)", margin: "0 auto", padding: "0 var(--pad)", position: "relative" }}>

        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 60,
            alignItems: "end",
            marginBottom: 64,
          }}
          className="sec-head-grid"
        >
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 18 }}>· 01 / El problema</div>
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
              El <em style={{ fontStyle: "italic", color: "var(--accent)" }}>caos operativo</em> ya no es una opción.
            </h2>
          </div>
          <div className="reveal d1" style={{ color: "var(--text-mid)", fontSize: 17 }}>
            Hojas de cálculo que se rompen, correos olvidados, herramientas que no hablan entre sí.
            Cada hora que dedicas a copiar y pegar datos es una hora que tu competencia dedica a crecer.
          </div>
        </div>

        {/* Cards */}
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}
          className="problem-grid-resp"
        >
          {problems.map((p, i) => (
            <article
              key={p.num}
              className={`reveal${i > 0 ? ` d${i}` : ""}`}
              style={{
                padding: "32px 26px",
                border: "1px solid var(--border)",
                borderRadius: "var(--rad-lg)",
                background: "linear-gradient(180deg, var(--surface) 0%, var(--bg-1) 100%)",
                position: "relative",
                overflow: "hidden",
                transition: "border-color .3s, transform .3s",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = "var(--border-hi)"
                ;(e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = "var(--border)"
                ;(e.currentTarget as HTMLElement).style.transform = "none"
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 20,
                  right: 22,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--text-faint)",
                }}
              >
                {p.num}
              </span>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(255, 106, 53, 0.1)",
                  border: "1px solid rgba(255, 106, 53, 0.25)",
                  marginBottom: 20,
                }}
              >
                {p.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 22,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  marginBottom: 10,
                }}
              >
                {p.title}
              </h3>
              <p style={{ color: "var(--text-mid)", fontSize: 14.5, lineHeight: 1.55, margin: 0 }}>
                {p.desc}
              </p>
            </article>
          ))}
        </div>

        {/* Contrast row */}
        <div
          className="reveal d2"
          style={{
            marginTop: 56,
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 28,
            alignItems: "center",
            padding: "26px 30px",
            borderRadius: "var(--rad-lg)",
            background: "linear-gradient(90deg, rgba(200,255,61,0.07), rgba(200,255,61,0.01))",
            border: "1px solid rgba(200,255,61,0.18)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.08em",
              color: "#0a0a0b",
              background: "var(--accent)",
              padding: "8px 14px",
              borderRadius: 999,
            }}
          >
            SATORUS
          </span>
          <p
            style={{
              margin: 0,
              fontSize: 20,
              color: "var(--text)",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              lineHeight: 1.3,
            }}
          >
            Reescribimos esos procesos como software propio — y cuando tiene sentido, los entregamos a un agente que los ejecuta solo.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .sec-head-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .problem-grid-resp { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
