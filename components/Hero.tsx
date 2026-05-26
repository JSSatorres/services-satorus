"use client"

import { useEffect, useRef } from "react"
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
        style={{
          padding: "180px var(--pad) 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Large background number */}
        <div aria-hidden style={{
          position: "absolute",
          right: "-2%",
          top: "8%",
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(260px, 30vw, 520px)",
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.03)",
          pointerEvents: "none",
          userSelect: "none",
          letterSpacing: "-0.05em",
        }}>
          S
        </div>

        <div style={{ maxWidth: "var(--max)", margin: "0 auto", position: "relative", zIndex: 2 }}>

          {/* Top chips */}
          <div
            className="reveal in"
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48, flexWrap: "wrap" }}
          >
            <span className="chip">
              <i className="dot" /> Aceptando proyectos · {getNextQuarter()}
            </span>
            <span className="chip warm">
              <i className="dot" /> Agent as a Service
            </span>
          </div>

          {/* Headline — editorial, large, with tight leading */}
          <h1
            className="reveal in d1"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(60px, 10.5vw, 148px)",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              maxWidth: "13ch",
              margin: 0,
            }}
          >
            Software{" "}
            <span style={{
              display: "inline-block",
              fontStyle: "italic",
              fontWeight: 700,
              color: "var(--accent)",
              position: "relative",
            }}>
              preciso
            </span>
            <br />
            <span style={{ color: "var(--text-mid)", fontWeight: 700 }}>+ IA que</span>
            <br />
            trabaja sola
          </h1>

          {/* Sub */}
          <p
            className="reveal in d2"
            style={{
              marginTop: 36,
              maxWidth: 520,
              color: "var(--text-mid)",
              fontSize: "clamp(16px, 1.4vw, 18px)",
              lineHeight: 1.65,
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
            style={{ marginTop: 44, display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            <Link href="#aaas" className="btn btn-primary">
              Conoce los Agentes <span className="arrow">→</span>
            </Link>
            <Link href="#contacto" className="btn">
              Auditoría gratuita
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="reveal in d4"
            style={{
              marginTop: 96,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              borderTop: "1px solid var(--border)",
            }}
          >
            {[
              { num: "12", suffix: "+", label: "Proyectos en producción" },
              { num: "94", suffix: "%", label: "Horas admin ahorradas" },
              { num: "24", suffix: "/7", label: "Agentes sin descanso" },
              { num: "48", suffix: "h", label: "Primera propuesta" },
            ].map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: "32px 24px 32px 0",
                  borderRight: i < 3 ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(40px, 4.5vw, 64px)",
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
                  marginTop: 12,
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Marquee — tech stack */}
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
  useEffect(() => {
    const nav = document.getElementById("nav")
    if (!nav) return
    const onScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 12)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      id="nav"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
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
      {/* Logo */}
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

      {/* Links */}
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        {[
          { href: "#servicios", label: "Servicios" },
          { href: "#aaas", label: "Agentes IA" },
          { href: "#proceso", label: "Proceso" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="nav-link-item"
            style={{ fontSize: 13, fontWeight: 500, color: "var(--text-dim)", transition: "color .2s", letterSpacing: "-0.01em" }}
          >
            {l.label}
          </Link>
        ))}
        <Link href="#contacto" className="btn" style={{ padding: "9px 16px", fontSize: 13 }}>
          Hablemos →
        </Link>
      </div>
    </nav>
  )
}
