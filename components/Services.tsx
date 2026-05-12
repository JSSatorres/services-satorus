"use client"

import { useEffect, useRef } from "react"

const services = [
  {
    num: "/ 01",
    title: "Desarrollo a medida",
    desc: 'Plataformas, ERPs y backoffices diseñados para la realidad de tu pyme. Stack moderno, código auditable, deploys en horas. Sustituimos esa madeja de Excel + email + "el de informática lo mira mañana" por una sola herramienta.',
    tags: ["FastAPI", "React", "PostgreSQL", "Docker", "AWS"],
    icon: (
      <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 5l-5 7 5 7M16 5l5 7-5 7M14 4l-4 16" />
      </svg>
    ),
  },
  {
    num: "/ 02",
    title: "Integración y automatización",
    desc: "Conectamos tu CRM, tu ERP, tu pasarela de pago y tus herramientas existentes para que la información viaje sola. Flujos n8n, APIs, webhooks y orquestación que dejan de depender de copy-paste.",
    tags: ["n8n", "Stripe", "HubSpot", "Holded", "Webhooks"],
    icon: (
      <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeLinecap="round">
        <circle cx={6} cy={6} r={2.5} />
        <circle cx={18} cy={6} r={2.5} />
        <circle cx={6} cy={18} r={2.5} />
        <circle cx={18} cy={18} r={2.5} />
        <path d="M8.5 6h7M6 8.5v7M18 8.5v7M8.5 18h7" />
      </svg>
    ),
  },
  {
    num: "/ 03",
    title: "Agent as a Service",
    titleBadge: true,
    desc: "Agentes de IA que leen, deciden y actúan dentro de tus sistemas. No son chatbots: hacen el trabajo. Atienden a clientes, procesan facturas, califican leads, gestionan inventario — y aprenden con cada interacción.",
    tags: ["GPT-4", "Claude", "LangChain", "RAG", "Function calling"],
    icon: (
      <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="var(--accent)" strokeWidth={1.6}>
        <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z" />
      </svg>
    ),
  },
]

export function Services() {
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
      id="servicios"
      style={{ padding: "140px 0 100px", position: "relative" }}
    >
      <div style={{ maxWidth: "var(--max)", margin: "0 auto", padding: "0 var(--pad)", position: "relative" }}>

        {/* Header */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 60, alignItems: "end", marginBottom: 64 }}
          className="sec-head-grid"
        >
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 18 }}>· 02 / Servicios</div>
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
              Tres formas de{" "}
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>tomar el control</em>.
            </h2>
          </div>
          <div className="reveal d1" style={{ color: "var(--text-mid)", fontSize: 17 }}>
            De la idea al producto, de la operación caótica al ERP a medida, del proceso manual al agente autónomo. Cada servicio se entrega como software propio — sin dependencias eternas.
          </div>
        </div>

        {/* Service rows */}
        <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid var(--border)" }}>
          {services.map((s, i) => (
            <article
              key={s.num}
              className={`reveal${i > 0 ? ` d${i}` : ""} serv-row-item`}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1.1fr 2fr 80px",
                gap: 32,
                padding: "36px 0",
                borderBottom: "1px solid var(--border)",
                alignItems: "start",
                position: "relative",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--text-faint)",
                  paddingTop: 6,
                }}
              >
                {s.num}
              </span>

              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 30,
                  fontWeight: 400,
                  maxWidth: 280,
                  lineHeight: 1.02,
                }}
              >
                {s.title}
                {s.titleBadge && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--accent-warm)",
                      verticalAlign: "super",
                      letterSpacing: ".1em",
                      marginLeft: 8,
                    }}
                  >
                    ★ NEW
                  </span>
                )}
              </h3>

              <div>
                <p style={{ color: "var(--text-mid)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                  {s.desc}
                </p>
                <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--text-dim)",
                        padding: "5px 9px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div
                className="serv-glyph"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 14,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  display: "grid",
                  placeItems: "center",
                  transition: "transform .4s, border-color .3s",
                }}
              >
                {s.icon}
              </div>

              {/* Hover top-line bar */}
              <div
                className="serv-bar"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: 2,
                  background: "var(--accent)",
                  width: 0,
                  transition: "width .6s cubic-bezier(.2,.7,.2,1)",
                }}
              />
            </article>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .serv-row-item {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
            padding: 28px 0 !important;
          }
          .serv-glyph { width: 50px !important; height: 50px !important; order: -1; }
        }
        .serv-row-item:hover .serv-bar { width: 100% !important; }
        .serv-row-item:hover .serv-glyph {
          transform: rotate(-4deg) scale(1.06) !important;
          border-color: var(--accent) !important;
        }
      `}</style>
    </section>
  )
}
