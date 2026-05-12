"use client"

import { useEffect, useRef } from "react"

const cards = [
  {
    title: "Registros de alta firmados",
    desc: "Cada factura genera un registro inmutable con hash encadenado y firma electrónica.",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeLinejoin="round">
        <path d="M9 12l2 2 4-4M12 3l8 4v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
      </svg>
    ),
  },
  {
    title: "Envío automático a la AEAT",
    desc: "Modo VeriFactu activado: comunicación en tiempo real, sin botones manuales.",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 11-3.5-7.1M21 4v5h-5" />
      </svg>
    ),
  },
  {
    title: "QR + URL de verificación",
    desc: "Tus facturas llevan QR validable por el receptor y la administración.",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--accent)" strokeWidth={1.6}>
        <rect x={4} y={4} width={16} height={16} rx={2} />
        <path d="M9 9h6v6H9z" />
      </svg>
    ),
  },
  {
    title: "Integrable en tu ERP existente",
    desc: "No te obligamos a migrar. Adaptamos lo que ya tienes funcionando.",
    icon: (
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeLinecap="round">
        <path d="M12 8v8M8 12h8" />
        <circle cx={12} cy={12} r={9} />
      </svg>
    ),
  },
]

export function LegalTech() {
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
      id="verifactu"
      style={{
        padding: "140px 0 100px",
        position: "relative",
        background: "linear-gradient(180deg, var(--bg) 0%, var(--bg-1) 100%)",
      }}
    >
      <div style={{ maxWidth: "var(--max)", margin: "0 auto", padding: "0 var(--pad)", position: "relative" }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}
          className="legal-grid-resp"
        >
          {/* Left */}
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 18 }}>· 04 / Compliance</div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 6vw, 84px)",
                fontWeight: 400,
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                marginBottom: 22,
              }}
            >
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>VeriFactu</em>,<br />resuelto.
            </h2>
            <p style={{ color: "var(--text-mid)", fontSize: "clamp(16px, 1.4vw, 19px)", maxWidth: 620, marginBottom: 0 }}>
              Adaptamos tu facturación al Reglamento de Sistemas Informáticos de Facturación.
              Cumples con la AEAT y, de paso, sales con un sistema mejor del que tenías.
            </p>
            <div
              style={{
                marginTop: 28,
                padding: "18px 22px",
                border: "1px dashed rgba(255,106,53,0.4)",
                borderRadius: "var(--rad)",
                background: "rgba(255,106,53,0.04)",
                fontSize: 13.5,
                color: "var(--text-mid)",
              }}
            >
              <strong style={{ color: "var(--accent-warm)", fontFamily: "var(--font-mono)" }}>⚠ DEADLINE</strong>
              {" "}Empresas:{" "}
              <strong style={{ color: "var(--text)" }}>1 enero 2026</strong>
              {" "}· Autónomos:{" "}
              <strong style={{ color: "var(--text)" }}>1 julio 2026</strong>.
              {" "}Si tu software no genera registros verificables, hay sanciones.
            </div>
          </div>

          {/* Right: cards */}
          <div className="reveal d1" style={{ display: "grid", gap: 14 }}>
            {cards.map((c) => (
              <div
                key={c.title}
                style={{
                  padding: "22px 26px",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--rad)",
                  background: "var(--surface)",
                  display: "grid",
                  gridTemplateColumns: "44px 1fr",
                  gap: 16,
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 11,
                    background: "rgba(200,255,61,0.08)",
                    border: "1px solid rgba(200,255,61,0.2)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {c.icon}
                </div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 16, margin: "0 0 6px", letterSpacing: "-0.005em" }}>
                    {c.title}
                  </h4>
                  <p style={{ fontSize: 13.5, color: "var(--text-mid)", margin: 0, lineHeight: 1.55 }}>
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .legal-grid-resp { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
