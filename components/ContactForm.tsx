"use client"

import { useState } from "react"

type Status = "idle" | "submitting" | "success" | "error"

const solutionTypes = [
  "Software a medida",
  "Integración / automatización",
  "Agente de IA (AaaS)",
  "Aún no lo tengo claro",
]

const inputBase: React.CSSProperties = {
  background: "var(--bg-1)",
  border: "1px solid var(--border-hi)",
  color: "var(--text)",
  padding: "11px 14px",
  borderRadius: 8,
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  width: "100%",
  outline: "none",
  transition: "border-color .2s",
  lineHeight: 1.5,
}

const labelBase: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  textTransform: "uppercase" as const,
  letterSpacing: "0.14em",
  color: "var(--text-dim)",
  display: "block",
  marginBottom: 7,
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelBase}>{label}</label>
      {children}
    </div>
  )
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("submitting")
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget).entries())
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error()
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  const focusOn  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderColor = "var(--accent)" }
  const focusOff = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderColor = "var(--border-hi)" }

  if (status === "success") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "56px 0", gap: 20 }}>
        <div style={{
          width: 56, height: 56,
          borderRadius: "50%",
          background: "rgba(200,255,61,0.08)",
          border: "1px solid rgba(200,255,61,0.25)",
          display: "grid",
          placeItems: "center",
        }}>
          <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 26, letterSpacing: "-0.02em", marginBottom: 8 }}>
            Mensaje recibido
          </h3>
          <p style={{ color: "var(--text-mid)", fontSize: 14, lineHeight: 1.6 }}>
            Recibirás nuestra propuesta en menos de 48 horas.
          </p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.06em" }}
        >
          Enviar otra solicitud →
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="form-row-resp">
        <Field label="Nombre">
          <input type="text" name="name" required placeholder="María García" style={inputBase} onFocus={focusOn} onBlur={focusOff} autoComplete="name" />
        </Field>
        <Field label="Empresa">
          <input type="text" name="company" placeholder="Tu pyme S.L." style={inputBase} onFocus={focusOn} onBlur={focusOff} autoComplete="organization" />
        </Field>
      </div>

      <Field label="Email">
        <input type="email" name="email" required placeholder="maria@empresa.es" style={inputBase} onFocus={focusOn} onBlur={focusOff} autoComplete="email" />
      </Field>

      <Field label="¿Qué buscas?">
        <select name="solution" style={{ ...inputBase, appearance: "none" }} onFocus={focusOn} onBlur={focusOff}>
          {solutionTypes.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>

      <Field label="Cuéntanos">
        <textarea
          name="message"
          rows={4}
          placeholder="Procesos que duelen, herramientas que usas, lo que sea..."
          style={{ ...inputBase, resize: "vertical", minHeight: 100 }}
          onFocus={focusOn}
          onBlur={focusOff}
        />
      </Field>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn btn-primary"
        style={{ width: "100%", justifyContent: "center", marginTop: 4, opacity: status === "submitting" ? 0.65 : 1 }}
      >
        {status === "submitting" ? "Enviando…" : <>Enviar mensaje <span className="arrow">→</span></>}
      </button>

      {status === "error" && (
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--accent-warm)", margin: 0 }}>
          Hubo un error. Escríbenos a hola@satorus.es
        </p>
      )}

      <p style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)", margin: 0, letterSpacing: "0.06em" }}>
        Tus datos no serán compartidos con terceros.
      </p>

      <style>{`
        select option { background: var(--bg-1); color: var(--text); }
      `}</style>
    </form>
  )
}
