"use client"

import { useEffect, useRef } from "react"

const services = [
  {
    num: "01",
    title: "Desarrollo a medida",
    desc: "Plataformas, ERPs y backoffices diseñados para la realidad de tu pyme. Stack moderno, código auditable, deploys en horas. Sustituimos esa madeja de Excel + email por una sola herramienta.",
    tags: ["FastAPI", "React", "PostgreSQL", "Docker", "AWS"],
    icon: (
      <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 5l-5 7 5 7M16 5l5 7-5 7M14 4l-4 16" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Integración y automatización",
    desc: "Conectamos tu CRM, ERP, pasarela de pago y herramientas existentes para que la información viaje sola. Flujos n8n, APIs y webhooks que eliminan el copy-paste.",
    tags: ["n8n", "Stripe", "HubSpot", "Holded", "Webhooks"],
    icon: (
      <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeLinecap="round">
        <circle cx={6} cy={6} r={2.5} /><circle cx={18} cy={6} r={2.5} />
        <circle cx={6} cy={18} r={2.5} /><circle cx={18} cy={18} r={2.5} />
        <path d="M8.5 6h7M6 8.5v7M18 8.5v7M8.5 18h7" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Agent as a Service",
    badge: "NUEVO",
    desc: "Agentes de IA que leen, deciden y actúan dentro de tus sistemas. No son chatbots: hacen el trabajo. Atienden clientes, procesan facturas, califican leads — y aprenden con cada interacción.",
    tags: ["GPT-4o", "Claude", "LangChain", "RAG", "Function calling"],
    icon: (
      <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="var(--accent)" strokeWidth={1.5}>
        <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z" />
      </svg>
    ),
  },
]

export function Services() {
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
    <section ref={ref} id="servicios" style={{ padding: "140px 0 100px" }}>
      <div style={{ maxWidth: "var(--max)", margin: "0 auto", padding: "0 var(--pad)" }}>

        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 60, alignItems: "end", marginBottom: 64 }} className="sec-head-grid">
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 20 }}>
              <span className="dot" /> 02 · Servicios
            </div>
            <h2 style={{ fontSize: "clamp(40px, 6vw, 88px)" }}>
              Tres formas de{" "}
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>tomar el control</em>.
            </h2>
          </div>
          <div className="reveal d1" style={{ color: "var(--text-mid)", fontSize: 17, lineHeight: 1.65 }}>
            De la idea al producto, del caos al ERP a medida, del proceso manual al agente autónomo.
            Cada servicio se entrega como software propio — sin dependencias eternas.
          </div>
        </div>

        {/* Service list */}
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {services.map((s, i) => (
            <article
              key={s.num}
              className={`reveal${i > 0 ? ` d${i}` : ""} serv-row-item`}
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr 2fr 64px",
                gap: 32,
                padding: "40px 0",
                borderBottom: "1px solid var(--border)",
                alignItems: "start",
                position: "relative",
                cursor: "default",
              }}
            >
              {/* Number */}
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--text-faint)",
                paddingTop: 4,
                letterSpacing: "0.1em",
              }}>
                /{s.num}
              </span>

              {/* Title */}
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(22px, 2.2vw, 30px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                maxWidth: 240,
              }}>
                {s.title}
                {s.badge && (
                  <span style={{
                    display: "inline-block",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.12em",
                    color: "var(--accent-warm)",
                    border: "1px solid rgba(255,106,53,0.35)",
                    padding: "2px 7px",
                    borderRadius: 3,
                    verticalAlign: "middle",
                    marginLeft: 10,
                    fontWeight: 500,
                  }}>
                    {s.badge}
                  </span>
                )}
              </h3>

              {/* Desc + tags */}
              <div>
                <p style={{ color: "var(--text-mid)", fontSize: 15, lineHeight: 1.65, margin: 0 }}>
                  {s.desc}
                </p>
                <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {s.tags.map((t) => (
                    <span key={t} style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--text-dim)",
                      padding: "4px 9px",
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--border-hi)",
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Icon box */}
              <div className="serv-glyph" style={{
                width: 56, height: 56,
                borderRadius: 10,
                border: "1px solid var(--border-hi)",
                background: "var(--surface)",
                display: "grid",
                placeItems: "center",
                transition: "transform .35s var(--ease-out), border-color .25s, background .25s",
              }}>
                {s.icon}
              </div>

              {/* Hover accent line */}
              <div className="serv-bar" style={{
                position: "absolute",
                left: 0, top: -1,
                height: 1,
                background: "var(--accent)",
                width: 0,
                transition: "width .6s cubic-bezier(0.16,1,0.3,1)",
              }} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
