"use client"

import { useEffect, useRef } from "react"
import { ContactForm } from "./ContactForm"
import Link from "next/link"

export function ContactSection() {
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
      id="contacto"
      style={{
        padding: "130px 0 80px",
        background: "linear-gradient(180deg, var(--bg-1) 0%, var(--bg) 100%)",
      }}
    >
      <div style={{ maxWidth: "var(--max)", margin: "0 auto", padding: "0 var(--pad)" }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 60, alignItems: "start" }}
          className="contact-grid-resp"
        >
          {/* Left side */}
          <div className="reveal">
            <div className="eyebrow warm" style={{ marginBottom: 22 }}>· 05 / Hablemos</div>
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
              Cuéntanos qué{" "}
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>te frena</em>.
            </h2>
            <p
              style={{
                color: "var(--text-mid)",
                fontSize: "clamp(16px, 1.4vw, 19px)",
                maxWidth: 620,
                marginBottom: 36,
              }}
            >
              Una llamada de 30 minutos. Sin venta, sin compromiso. Salimos con un diagnóstico
              y, si encaja, una propuesta concreta en 5 días.
            </p>

            <div
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: 28,
                display: "grid",
                gap: 18,
              }}
            >
              {[
                {
                  icon: (
                    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={1.6}>
                      <path d="M3 7l9 6 9-6M3 7v10h18V7" />
                    </svg>
                  ),
                  label: "Email",
                  value: "hola@satorus.es",
                  href: "mailto:hola@satorus.es",
                },
                {
                  icon: (
                    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={1.6}>
                      <path d="M5 4h4l2 5-3 2a14 14 0 006 6l2-3 5 2v4a2 2 0 01-2 2A18 18 0 013 6a2 2 0 012-2z" />
                    </svg>
                  ),
                  label: "Teléfono",
                  value: "+34 900 000 000",
                  href: "tel:+34900000000",
                },
                {
                  icon: (
                    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={1.6}>
                      <path d="M12 22s8-7 8-13a8 8 0 10-16 0c0 6 8 13 8 13z" />
                      <circle cx={12} cy={9} r={3} />
                    </svg>
                  ),
                  label: "Oficina",
                  value: "Alicante, España · remoto-friendly",
                  href: null,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 14, alignItems: "start" }}
                >
                  <span style={{ marginTop: 4 }}>{row.icon}</span>
                  <div>
                    <h5
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 13,
                        fontWeight: 500,
                        margin: "0 0 2px",
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {row.label}
                    </h5>
                    {row.href ? (
                      <a href={row.href} style={{ color: "var(--text-mid)", fontSize: 14 }}>
                        {row.value}
                      </a>
                    ) : (
                      <p style={{ color: "var(--text-mid)", fontSize: 14, margin: 0 }}>
                        {row.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div
            className="reveal d1"
            style={{
              padding: 36,
              border: "1px solid var(--border)",
              borderRadius: "var(--rad-lg)",
              background: "var(--surface)",
            }}
          >
            <ContactForm />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .contact-grid-resp { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "40px var(--pad)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 20,
      }}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)" }}>
        © 2025 Satorus · Software & IA para pymes · Alicante
      </div>
      <div style={{ display: "flex", gap: 24, fontSize: 13, color: "var(--text-mid)" }}>
        <Link href="/aviso-legal" style={{ transition: "color .2s" }} className="footer-link">
          Aviso legal
        </Link>
        <Link href="/politica-de-privacidad" style={{ transition: "color .2s" }} className="footer-link">
          Privacidad
        </Link>
        <a href="https://linkedin.com" target="_blank" rel="noopener" style={{ transition: "color .2s" }} className="footer-link">
          LinkedIn
        </a>
      </div>
      <style>{`.footer-link:hover { color: var(--text) !important; }`}</style>
    </footer>
  )
}
