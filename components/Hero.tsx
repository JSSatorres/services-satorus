"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

function getNextQuarter(): string {
  const now = new Date()
  const month = now.getMonth()
  const year = now.getFullYear()
  const currentQ = Math.floor(month / 3) + 1
  const nextQ = currentQ === 4 ? 1 : currentQ + 1
  const nextYear = currentQ === 4 ? year + 1 : year
  return `Q${nextQ} ${nextYear}`
}

/* ── Agente en vivo — panel derecho del hero ── */
function AgentPanel() {
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const steps = [
      { delay: 600,  text: "Conectando con ERP...",           dim: true },
      { delay: 1400, text: "Leyendo 847 pedidos pendientes",  dim: false },
      { delay: 2200, text: "Clasificando por prioridad...",   dim: true },
      { delay: 3000, text: "Enviando alertas a proveedor",    dim: false },
      { delay: 3800, text: "Actualizando stock en tiempo real", dim: false },
      { delay: 4600, text: "✓ 847 órdenes procesadas",        dim: false, accent: true },
    ]
    let timers: ReturnType<typeof setTimeout>[] = []
    steps.forEach(({ delay, text, dim, accent }) => {
      timers.push(setTimeout(() => {
        if (!logRef.current) return
        const line = document.createElement("div")
        line.style.cssText = `
          display:flex; align-items:flex-start; gap:8px;
          font-size:11px; line-height:1.5;
          color:${accent ? "var(--accent)" : dim ? "var(--text-faint)" : "var(--text-dim)"};
          opacity:0; transition:opacity .35s;
        `
        const dot = document.createElement("span")
        dot.style.cssText = `
          flex-shrink:0; margin-top:5px;
          width:4px; height:4px; border-radius:50%;
          background:${accent ? "var(--accent)" : dim ? "var(--text-faint)" : "rgba(200,255,61,0.4)"};
        `
        const span = document.createElement("span")
        span.textContent = text
        line.appendChild(dot)
        line.appendChild(span)
        logRef.current.appendChild(line)
        requestAnimationFrame(() => { line.style.opacity = "1" })
        logRef.current.scrollTop = logRef.current.scrollHeight
      }, delay))
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div style={{
      background: "var(--bg-1)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      overflow: "hidden",
      fontFamily: "var(--font-mono)",
      minWidth: 0,
    }}>
      {/* Header barra */}
      <div style={{
        padding: "10px 14px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57","#febc2e","#28c840"].map((c, i) => (
            <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.8 }} />
          ))}
        </div>
        <span style={{ fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.1em", flex: 1, textAlign: "center" }}>
          satorus · agente-operaciones
        </span>
        <span style={{
          fontSize: 9, padding: "2px 7px", borderRadius: 4,
          background: "rgba(200,255,61,0.12)", color: "var(--accent)",
          letterSpacing: "0.08em",
        }}>
          LIVE
        </span>
      </div>

      {/* Prompt */}
      <div style={{
        padding: "12px 14px",
        borderBottom: "1px solid var(--border)",
        fontSize: 11,
        color: "var(--text-dim)",
        lineHeight: 1.5,
      }}>
        <span style={{ color: "var(--accent)", marginRight: 8 }}>›</span>
        Procesa todos los pedidos con retraso y notifica proveedores
      </div>

      {/* Log */}
      <div
        ref={logRef}
        style={{
          padding: "12px 14px",
          minHeight: 168,
          maxHeight: 168,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          scrollbarWidth: "none",
        }}
      />

      {/* Footer métrica */}
      <div style={{
        padding: "10px 14px",
        borderTop: "1px solid var(--border)",
        display: "flex",
        gap: 20,
        fontSize: 9,
        letterSpacing: "0.12em",
        color: "var(--text-faint)",
        textTransform: "uppercase",
      }}>
        {[["Tiempo", "4.2 s"],["Tokens", "1,847"],["Ahorro", "6 h"]].map(([k, v]) => (
          <div key={k}>
            <span style={{ color: "var(--accent)", marginRight: 4 }}>{v}</span>{k}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const els = heroRef.current?.querySelectorAll(".reveal")
    if (!els) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target) } }),
      { threshold: 0.1 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <Nav />
      <header
        ref={heroRef}
        className="hero-header-resp"
        style={{
          padding: "160px var(--pad) 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ghost letter background */}
        <div aria-hidden style={{
          position: "absolute",
          right: "-4%",
          top: "2%",
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(300px, 38vw, 580px)",
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.025)",
          pointerEvents: "none",
          userSelect: "none",
          letterSpacing: "-0.05em",
        }}>
          S
        </div>

        <div style={{
          maxWidth: "var(--max)",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(48px, 6vw, 96px)",
          alignItems: "center",
        }}
        className="hero-grid-resp">

          {/* ── Left: headline + CTAs ── */}
          <div>
            {/* Chips */}
            <div
              className="reveal in"
              style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, flexWrap: "wrap" }}
            >
              <span className="chip">
                <i className="dot" /> Aceptando proyectos · {getNextQuarter()}
              </span>
              <span className="chip warm">
                <i className="dot" /> Agent as a Service
              </span>
            </div>

            {/* Headline */}
            <h1
              className="reveal in d1"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(44px, 5.5vw, 84px)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                margin: 0,
              }}
            >
              Software{" "}
              <em style={{
                fontStyle: "italic",
                color: "var(--accent)",
                fontWeight: 700,
              }}>
                preciso
              </em>
              <br />
              <span style={{ color: "var(--text-mid)" }}>+ IA que</span>
              <br />
              trabaja{" "}
              <em style={{
                fontStyle: "italic",
                color: "var(--accent-warm)",
                fontWeight: 700,
              }}>
                sola
              </em>
            </h1>

            {/* Sub */}
            <p
              className="reveal in d2"
              style={{
                marginTop: 32,
                maxWidth: 460,
                color: "var(--text-mid)",
                fontSize: "clamp(15px, 1.3vw, 17px)",
                lineHeight: 1.7,
                fontWeight: 400,
              }}
            >
              Construimos plataformas, ERPs y{" "}
              <strong style={{ color: "var(--text)", fontWeight: 600 }}>agentes autónomos</strong>{" "}
              para pymes que ya no tienen paciencia con las herramientas genéricas.
            </p>

            {/* CTAs */}
            <div
              className="reveal in d3"
              style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              <Link href="#aaas" className="btn btn-primary">
                Conoce los Agentes <span className="arrow">→</span>
              </Link>
              <Link href="#contacto" className="btn">
                Auditoría gratuita
              </Link>
            </div>
          </div>

          {/* ── Right: agente en vivo ── */}
          <div className="reveal in d2 hero-panel-resp" style={{ minWidth: 0 }}>
            {/* Label */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--text-faint)",
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "var(--accent)",
                boxShadow: "0 0 8px var(--accent)",
                animation: "pulse-dot 2.4s ease-in-out infinite",
              }} />
              Agente ejecutándose ahora
            </div>
            <AgentPanel />
          </div>
        </div>

        {/* Stats row */}
        <div
          className="reveal in d4 stats-grid-resp"
          style={{
            maxWidth: "var(--max)",
            margin: "72px auto 0",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            borderTop: "1px solid var(--border)",
          }}
        >
          {[
            { num: "12", suffix: "+", label: "Proyectos en producción" },
            { num: "94", suffix: "%", label: "Horas admin ahorradas" },
            { num: "24", suffix: "/7", label: "Agentes sin descanso" },
            { num: "48", suffix: "h",  label: "Primera propuesta" },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "28px 24px 28px 0",
                borderRight: i < 3 ? "1px solid var(--border)" : "none",
              }}
            >
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}>
                <em style={{ color: "var(--accent)", fontStyle: "normal" }}>{s.num}</em>
                <span style={{ color: "var(--text-dim)", fontWeight: 700 }}>{s.suffix}</span>
              </div>
              <div style={{
                color: "var(--text-faint)",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginTop: 10,
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[
            "Python", "FastAPI", "React", "Next.js", "PostgreSQL",
            "Docker", "OpenAI", "LangChain", "n8n", "Supabase",
            "AWS", "Stripe", "Twilio", "TypeScript", "Redis",
          ].map((t) => (
            <span key={t}>{t}<em>·</em></span>
          ))}
          {[
            "Python", "FastAPI", "React", "Next.js", "PostgreSQL",
            "Docker", "OpenAI", "LangChain", "n8n", "Supabase",
            "AWS", "Stripe", "Twilio", "TypeScript", "Redis",
          ].map((t) => (
            <span key={t + "_2"}>{t}<em>·</em></span>
          ))}
        </div>
      </div>
    </>
  )
}

/* ── Nav ── */
function Nav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const nav = document.getElementById("nav")
    if (!nav) return
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = [
    { href: "#servicios", label: "Servicios" },
    { href: "#aaas", label: "Agentes IA" },
    { href: "#proceso", label: "Proceso" },
    { href: "#contacto", label: "Contacto" },
  ]

  return (
    <>
      <nav
        id="nav"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 50,
          padding: "16px var(--pad)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
          background: "rgba(8,8,9,0.6)",
          borderBottom: "1px solid transparent",
          transition: "border-color .4s, background .4s",
        }}
      >
        <Link href="#" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            width: 32, height: 32,
            borderRadius: 8,
            background: "var(--accent)",
            color: "var(--bg)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "-0.05em",
            boxShadow: "0 0 28px -4px rgba(200,255,61,0.65)",
          }}>
            S
          </span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.03em" }}>
            Satorus
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.slice(0, 3).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-link-item"
              style={{ fontSize: 13, fontWeight: 500, color: "var(--text-dim)", transition: "color .2s", letterSpacing: "-0.01em" }}
            >
              {l.label}
            </Link>
          ))}
          <Link href="#contacto" className="btn nav-cta-desk" style={{ padding: "9px 16px", fontSize: 13 }}>
            Hablemos →
          </Link>

          {/* Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setOpen((v: boolean) => !v)}
            aria-label="Menú"
            style={{
              display: "none",
              background: "none",
              border: "1px solid var(--border-hi)",
              borderRadius: 6,
              padding: "7px 9px",
              cursor: "pointer",
              color: "var(--text)",
              lineHeight: 1,
            }}
          >
            {open ? (
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          position: "fixed",
          top: 65,
          left: 0, right: 0,
          zIndex: 49,
          background: "rgba(8,8,9,0.97)",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(20px)",
          padding: "20px var(--pad) 28px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                padding: "14px 4px",
                fontSize: 17,
                fontWeight: 500,
                color: "var(--text-mid)",
                borderBottom: "1px solid var(--border)",
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.02em",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 980px) {
          .nav-hamburger  { display: flex !important; }
          .nav-cta-desk   { display: none !important; }
        }
      `}</style>
    </>
  )
}
