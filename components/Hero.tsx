"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in")
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    )
    heroRef.current?.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      {/* ── Nav ── */}
      <Nav />

      {/* ── Hero ── */}
      <header
        ref={heroRef}
        className="hero"
        style={{
          padding: "170px var(--pad) 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "var(--max)", margin: "0 auto", position: "relative", zIndex: 2 }}>
          {/* Eyebrow chips */}
          <div
            className="reveal in"
            style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, flexWrap: "wrap" }}
          >
            <span className="chip">
              <i className="dot" /> Aceptando proyectos · Q4 2025
            </span>
            <span className="chip warm">
              <i className="dot" /> Nuevo: Agent as a Service
            </span>
            <span className="mono">_basados en Alicante</span>
          </div>

          {/* Headline */}
          <h1
            className="reveal in d1"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(54px, 9vw, 128px)",
              fontWeight: 400,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              maxWidth: "14ch",
              margin: 0,
            }}
          >
            Software a medida<br />
            e <em style={{ fontStyle: "italic", color: "var(--accent)" }}>inteligencia</em><br />
            que se ejecuta sola
          </h1>

          {/* Sub */}
          <p
            className="reveal in d2"
            style={{
              marginTop: 28,
              maxWidth: 600,
              color: "var(--text-mid)",
              fontSize: 18,
              lineHeight: 1.55,
            }}
          >
            Construimos plataformas, ERPs y{" "}
            <strong style={{ color: "var(--text)", fontWeight: 500 }}>agentes de IA autónomos</strong>{" "}
            que sustituyen tareas repetitivas. Diseñados para pymes que se han quedado sin paciencia
            con las herramientas genéricas.
          </p>

          {/* CTAs */}
          <div className="reveal in d3" style={{ marginTop: 36, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="#aaas" className="btn btn-primary">
              Conoce los Agentes <span className="arrow">→</span>
            </Link>
            <Link href="#contacto" className="btn">
              Auditoría gratuita
            </Link>
          </div>

          {/* Stats */}
          <div
            className="reveal in d4"
            style={{
              marginTop: 80,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {[
              { num: "12", suffix: "+", label: "Proyectos en producción" },
              { num: "94", suffix: "%", label: "Horas administrativas ahorradas" },
              { num: "24", suffix: "/7", label: "Agentes operando sin descanso" },
              { num: "48", suffix: "h", label: "Primera propuesta técnica" },
            ].map((s, i) => (
              <div
                key={s.label}
                style={{
                  padding: "28px 24px 28px 0",
                  borderRight: i < 3 ? "1px solid var(--border)" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(40px, 4vw, 56px)",
                    lineHeight: 1,
                  }}
                >
                  <em style={{ color: "var(--accent)", fontStyle: "normal" }}>{s.num}</em>
                  {s.suffix}
                </div>
                <div
                  style={{
                    color: "var(--text-dim)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginTop: 10,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Marquee ── */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <span>Python <em>·</em>FastAPI <em>·</em>React <em>·</em>Node.js <em>·</em>PostgreSQL <em>·</em>Docker <em>·</em>OpenAI <em>·</em>LangChain <em>·</em>n8n <em>·</em>Supabase <em>·</em>AWS <em>·</em>Stripe <em>·</em>Twilio <em>·</em></span>
          <span>Python <em>·</em>FastAPI <em>·</em>React <em>·</em>Node.js <em>·</em>PostgreSQL <em>·</em>Docker <em>·</em>OpenAI <em>·</em>LangChain <em>·</em>n8n <em>·</em>Supabase <em>·</em>AWS <em>·</em>Stripe <em>·</em>Twilio <em>·</em></span>
        </div>
      </div>
    </>
  )
}

/* ── Nav component ── */
function Nav() {
  useEffect(() => {
    const nav = document.getElementById("nav")
    if (!nav) return
    const onScroll = () => {
      if (window.scrollY > 12) nav.classList.add("scrolled")
      else nav.classList.remove("scrolled")
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
        padding: "14px var(--pad)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        background: "linear-gradient(to bottom, rgba(10,10,11,0.7), rgba(10,10,11,0.3))",
        borderBottom: "1px solid transparent",
        transition: "border-color .3s, background .3s",
      }}
    >
      <style>{`
        #nav.scrolled {
          border-color: var(--border) !important;
          background: rgba(10,10,11,0.85) !important;
        }
      `}</style>

      <Link href="#" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "var(--accent)",
            color: "#0a0a0b",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontStyle: "italic",
            boxShadow: "0 0 24px -4px rgba(200,255,61,0.7)",
          }}
        >
          s
        </span>
        <b style={{ fontWeight: 600, fontSize: 16, letterSpacing: "-0.01em" }}>Satorus</b>
      </Link>

      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {[
          { href: "#servicios", label: "Servicios" },
          { href: "#aaas", label: "AaaS · Agentes IA" },
          { href: "#proceso", label: "Proceso" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              fontSize: 13,
              color: "var(--text-mid)",
              transition: "color .2s",
            }}
            className="nav-link-item"
          >
            {l.label}
          </Link>
        ))}
        <Link href="#contacto" className="btn nav-cta" style={{ padding: "10px 16px", fontSize: 13 }}>
          Hablemos →
        </Link>
      </div>

      <style>{`
        .nav-link-item:hover { color: var(--text); }
        @media (max-width: 820px) {
          .nav-link-item { display: none; }
        }
      `}</style>
    </nav>
  )
}
