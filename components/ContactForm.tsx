"use client"

import { useState } from "react"

type Status = "idle" | "submitting" | "success" | "error"

const solutionTypes = [
  "Software a medida",
  "Integración / automatización",
  "Agente de IA (AaaS)",
  "Cumplimiento VeriFactu",
  "Aún no lo tengo claro",
]

const inputStyle: React.CSSProperties = {
  background: "var(--bg-1)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  padding: "12px 14px",
  borderRadius: 10,
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  width: "100%",
  outline: "none",
  transition: "border-color .2s",
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  color: "var(--text-dim)",
  display: "block",
  marginBottom: 6,
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("submitting")
    try {
      const formData = new FormData(e.currentTarget)
      const data = Object.fromEntries(formData.entries())
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Error en el envío")
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "48px 0", gap: 24 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(200,255,61,0.1)",
            border: "1px solid rgba(200,255,61,0.3)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 400, marginBottom: 8 }}>
            ¡Mensaje enviado!
          </h3>
          <p style={{ color: "var(--text-mid)", fontSize: 15 }}>
            Recibirás nuestra propuesta en menos de 48 horas.
          </p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
        >
          Enviar otra solicitud
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Name + company row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }} className="form-row-resp">
        <div>
          <label style={labelStyle}>Nombre</label>
          <input
            type="text"
            name="name"
            required
            placeholder="María García"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
        <div>
          <label style={labelStyle}>Empresa</label>
          <input
            type="text"
            name="company"
            placeholder="Tu pyme S.L."
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          name="email"
          required
          placeholder="maria@empresa.es"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>¿Qué buscas?</label>
        <select
          name="solution"
          style={{ ...inputStyle, appearance: "none" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        >
          {solutionTypes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Cuéntanos</label>
        <textarea
          name="message"
          rows={4}
          placeholder="Procesos que duelen, herramientas que usas, lo que sea..."
          style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn btn-primary"
        style={{
          width: "100%",
          justifyContent: "center",
          marginTop: 8,
          opacity: status === "submitting" ? 0.7 : 1,
          cursor: status === "submitting" ? "not-allowed" : "pointer",
        }}
      >
        {status === "submitting" ? "Enviando…" : <>Enviar mensaje <span className="arrow">→</span></>}
      </button>

      {status === "error" && (
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--accent-warm)", marginTop: 12 }}>
          Hubo un error. Inténtalo de nuevo o escribe a hola@satorus.es
        </p>
      )}

      <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-faint)", marginTop: 16, fontFamily: "var(--font-mono)" }}>
        Tus datos no serán compartidos con terceros.
      </p>

      <style>{`
        @media (max-width: 720px) {
          .form-row-resp { grid-template-columns: 1fr !important; }
        }
        select option { background: var(--bg-1); color: var(--text); }
      `}</style>
    </form>
  )
}
