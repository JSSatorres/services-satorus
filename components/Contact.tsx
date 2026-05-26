"use client"

import { useEffect, useRef } from "react"
import { ContactForm } from "./ContactForm"
import Link from "next/link"

export function ContactSection() {
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
    <section
      ref={ref}
      id="contacto"
      style={{ padding: "140px 0 80px", borderTop: "1px solid var(--border)" }}
    >
      <div style={{ maxWidth: "var(--max)", margin: "0 auto", padding: "0 var(--pad)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 80, alignItems: "start" }} className="contact-grid-resp sec-pad-resp">

          {/* Left */}
          <div className="reveal">
            <div className="eyebrow warm" style={{ marginBottom: 24 }}>
              <span className="dot" /> 05 · Hablemos
            </div>
            <h2 style={{ fontSize: "clamp(40px, 5.5vw, 80px)", marginBottom: 24 }}>
              Cuéntanos qué{" "}
              <em style={{ fontStyle: "italic", color: "var(--accent)" }}>te frena</em>.
            </h2>
            <p style={{
              color: "var(--text-mid)",
              fontSize: "clamp(15px, 1.3vw, 18px)",
              lineHeight: 1.65,
              maxWidth: 480,
              marginBottom: 48,
            }}>
              Una llamada de 30 minutos. Sin venta, sin compromiso.
              Salimos con un diagnóstico y, si encaja, una propuesta concreta en 5 días.
            </p>

            <div style={{ display: "grid", gap: 24 }}>
              {[
                {
                  icon: (
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={1.5}>
                      <path d="M3 7l9 6 9-6M3 7v10h18V7" />
                    </svg>
                  ),
                  label: "Email",
                  value: "hola@satorus.es",
                  href: "mailto:hola@satorus.es",
                },
                {
                  icon: (
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={1.5}>
                      <path d="M5 4h4l2 5-3 2a14 14 0 006 6l2-3 5 2v4a2 2 0 01-2 2A18 18 0 013 6a2 2 0 012-2z" />
                    </svg>
                  ),
                  label: "Teléfono",
                  value: "+34 900 000 000",
                  href: "tel:+34900000000",
                },
                {
                  icon: (
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={1.5}>
                      <path d="M12 22s8-7 8-13a8 8 0 10-16 0c0 6 8 13 8 13z" />
                      <circle cx={12} cy={9} r={3} />
                    </svg>
                  ),
                  label: "Oficina",
                  value: "Alicante, España · remoto-friendly",
                  href: null,
                },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <span style={{
                    width: 36, height: 36,
                    borderRadius: 8,
                    border: "1px solid var(--border-hi)",
                    background: "var(--surface)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                    {row.icon}
                  </span>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: 3 }}>
                      {row.label}
                    </div>
                    {row.href ? (
                      <a href={row.href} style={{ color: "var(--text-mid)", fontSize: 15, transition: "color .2s" }}
                        onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--text)" }}
                        onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--text-mid)" }}
                      >
                        {row.value}
                      </a>
                    ) : (
                      <p style={{ color: "var(--text-mid)", fontSize: 15, margin: 0 }}>{row.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div
            className="reveal d1 contact-form-resp"
            style={{
              padding: "40px",
              border: "1px solid var(--border-hi)",
              borderRadius: 16,
              background: "var(--surface)",
            }}
          >
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      padding: "36px var(--pad)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 16,
    }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.06em" }}>
        © 2025 Satorus · Software & IA para pymes · Alicante
      </div>
      <div style={{ display: "flex", gap: 28, fontSize: 13, color: "var(--text-dim)" }}>
        <Link href="/aviso-legal" className="footer-link" style={{ transition: "color .2s" }}>Aviso legal</Link>
        <Link href="/politica-de-privacidad" className="footer-link" style={{ transition: "color .2s" }}>Privacidad</Link>
        <a href="https://linkedin.com" target="_blank" rel="noopener" className="footer-link" style={{ transition: "color .2s" }}>LinkedIn</a>
      </div>
    </footer>
  )
}
