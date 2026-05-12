"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"

/* ── Agent scripts ── */
type Kind = "user" | "agent" | "think" | "action" | "note" | "step" | "done"
interface Line { d: number; kind: Kind; text: string; meta?: string }
interface Agent { title: string; script: Line[] }

const AGENTS: Record<string, Agent> = {
  soporte: {
    title: "agente-soporte · sesión #4218",
    script: [
      { d: 200, kind: "user", text: "Hola, no me deja entrar a la plataforma, dice que mi licencia ha caducado." },
      { d: 700, kind: "think", text: "Identificando cliente y revisando licencia…" },
      { d: 900, kind: "action", text: 'crm.lookup_customer(email="luis@acme.es")', meta: "ok · plan Pro · activo" },
      { d: 700, kind: "action", text: "billing.check_subscription(id=AC-2241)", meta: "pago fallido el 12/11" },
      { d: 800, kind: "agent", text: "¡Hola Luis! Veo que el cobro del 12/11 no se completó (tarjeta caducada). Reintento el pago ahora y te dejo entrar mientras tanto, ¿te parece?" },
      { d: 1200, kind: "user", text: "Sí, perfecto." },
      { d: 500, kind: "action", text: "billing.retry_payment(id=AC-2241)", meta: "✓ 89,00 €" },
      { d: 500, kind: "action", text: "auth.grant_access(user=luis@acme.es, hours=2)", meta: "✓ acceso temporal" },
      { d: 700, kind: "agent", text: "Listo. Cobro reintentado correctamente, ya tienes acceso. Te envío también la factura por email. Cualquier cosa, aquí estoy." },
      { d: 600, kind: "done", text: "Resuelto autónomamente · 14s · sin escalado humano" },
    ],
  },
  facturas: {
    title: "agente-facturas · lote #lote-1184",
    script: [
      { d: 300, kind: "note", text: "Llegan 8 facturas a contabilidad@empresa.es" },
      { d: 700, kind: "step", text: "Descargando adjuntos del buzón", meta: "8/8" },
      { d: 700, kind: "step", text: "OCR + extracción de campos", meta: "vision AI" },
      { d: 800, kind: "step", text: "Validando NIFs contra base de proveedores", meta: "7 ok · 1 nuevo" },
      { d: 700, kind: "agent", text: "⚠ Nuevo proveedor detectado: \"Suministros Levante SL\" (NIF B-12345678). Lo doy de alta provisional y aviso a Marta para que lo revise." },
      { d: 700, kind: "step", text: "Comparando importes con albaranes recibidos", meta: "cuadran" },
      { d: 700, kind: "step", text: "Registrando en Holded", meta: "8 asientos creados" },
      { d: 500, kind: "step", text: "Marcando emails como procesados", meta: "inbox limpio" },
      { d: 600, kind: "done", text: "8 facturas · 12.847 € · procesadas en 47s · ahorro estimado: 3h" },
    ],
  },
  ventas: {
    title: "agente-comercial · lead #L-8821",
    script: [
      { d: 300, kind: "note", text: "Nuevo lead desde el formulario web" },
      { d: 600, kind: "action", text: 'enrich.company(domain="acme-foods.com")', meta: "42 empleados · sector food" },
      { d: 700, kind: "think", text: "Cualificando con tus criterios ICP…" },
      { d: 700, kind: "agent", text: "Lead encaja: sector relevante, tamaño en rango, web activa. Score: 8.2/10. Respondo en su idioma y propongo agenda." },
      { d: 800, kind: "action", text: 'email.send(to="ana@acme-foods.com", template="lead-warm-es")', meta: "✓ enviado · 22s" },
      { d: 600, kind: "user", text: "Genial, ¿podemos hablar el jueves a las 10?" },
      { d: 600, kind: "action", text: 'calendar.check(host="comercial@satorus.es", day="jueves 10:00")', meta: "libre" },
      { d: 600, kind: "action", text: "calendar.book(meet, participants=[ana, comercial])", meta: "✓ invite enviada" },
      { d: 600, kind: "agent", text: "¡Perfecto Ana! Reunión confirmada para el jueves a las 10:00. Te paso el link de Google Meet. Adjunto también el caso de éxito de Veladia, que es de tu sector." },
      { d: 600, kind: "done", text: "Lead cualificado y reunión agendada · sin tocar el CRM" },
    ],
  },
  operaciones: {
    title: "agente-operaciones · turno nocturno",
    script: [
      { d: 300, kind: "note", text: "03:14 — escaneo periódico de inventario" },
      { d: 600, kind: "step", text: "Lectura de niveles de stock", meta: "247 SKUs" },
      { d: 700, kind: "step", text: "Cruzando con ventas últimas 14d", meta: "forecasting" },
      { d: 700, kind: "agent", text: "⚠ Detecto que el SKU AC-9912 cae bajo el umbral en 6 días al ritmo actual. Plazo del proveedor: 8 días. Lanzo pedido preventivo." },
      { d: 700, kind: "action", text: "erp.create_purchase_order(sku=AC-9912, qty=400)", meta: "borrador" },
      { d: 700, kind: "action", text: 'email.notify(to="compras@empresa.es")', meta: "✓ con razón y datos" },
      { d: 600, kind: "step", text: "Detectando anomalía en pedidos de Cataluña", meta: "−42% vs media" },
      { d: 700, kind: "agent", text: "Abro ticket en el equipo comercial: posible incidencia con un distribuidor." },
      { d: 500, kind: "done", text: "2 acciones preventivas · cero humanos despertados a las 3 AM" },
    ],
  },
}

const TAB_CONFIG = [
  {
    key: "soporte",
    title: "Agente de Soporte 24/7",
    desc: "Resuelve tickets, escala lo crítico, aprende del histórico.",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 11-3.5-7.1M21 4v5h-5" />
      </svg>
    ),
  },
  {
    key: "facturas",
    title: "Agente de Facturas",
    desc: "Lee PDFs/emails, extrae datos, valida y registra en tu ERP.",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    key: "ventas",
    title: "Agente Comercial",
    desc: "Califica leads, programa reuniones, sigue conversaciones por ti.",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l6-6 4 4 8-8M14 7h7v7" />
      </svg>
    ),
  },
  {
    key: "operaciones",
    title: "Agente de Operaciones",
    desc: "Monitoriza stock, lanza pedidos, alerta de incidencias.",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
        <circle cx={12} cy={12} r={3} />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
      </svg>
    ),
  },
]

function sleep(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)) }

export function AaaSShowcase() {
  const ref = useRef<HTMLElement>(null)
  const [activeAgent, setActiveAgent] = useState("soporte")
  const [title, setTitle] = useState(AGENTS.soporte.title)
  const [lines, setLines] = useState<React.ReactNode[]>([])
  const runIdRef = useRef(0)
  const bodyRef = useRef<HTMLDivElement>(null)

  const renderLine = (item: Line): React.ReactNode => {
    if (item.kind === "user") return (
      <div className="term-line" key={Math.random()}>
        <span className="pr usr">user ›</span>
        <span className="txt">{item.text}</span>
      </div>
    )
    if (item.kind === "agent") return (
      <div className="term-line" key={Math.random()}>
        <span className="pr">agent ›</span>
        <span className="txt">{item.text}</span>
      </div>
    )
    if (item.kind === "think") return (
      <div className="term-line" key={Math.random()}>
        <span className="pr">···</span>
        <span className="term-thinking">{item.text}</span>
      </div>
    )
    if (item.kind === "action") return (
      <div className="term-line" key={Math.random()}>
        <span className="pr">›</span>
        <span className="ky">{item.text}</span>
        {item.meta && <span className="cm" style={{ marginLeft: 8 }}>// {item.meta}</span>}
      </div>
    )
    if (item.kind === "note") return (
      <div className="term-line" key={Math.random()}>
        <span className="pr">→</span>
        <span className="cm">{item.text}</span>
      </div>
    )
    if (item.kind === "step") return (
      <div className="flow-step done" key={Math.random()}>
        <span className="fnum">✓</span>
        <span className="ftext">{item.text}</span>
        {item.meta && <span className="fmeta">{item.meta}</span>}
      </div>
    )
    if (item.kind === "done") return (
      <div
        className="term-line"
        key={Math.random()}
        style={{
          marginTop: 14,
          paddingTop: 14,
          borderTop: "1px dashed var(--border)",
        }}
      >
        <span className="pr ok" style={{ color: "var(--accent)" }}>✓ done</span>
        <span className="txt" style={{ color: "var(--accent)" }}>{item.text}</span>
      </div>
    )
    return null
  }

  const runAgent = useCallback(async (name: string) => {
    const conf = AGENTS[name]
    if (!conf) return
    const myId = ++runIdRef.current
    setTitle(conf.title)
    setLines([])

    await sleep(400)
    if (myId !== runIdRef.current) return

    for (const item of conf.script) {
      if (myId !== runIdRef.current) return
      await sleep(item.d)
      setLines((prev) => [...prev, renderLine(item)])
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }

    await sleep(4200)
    if (myId !== runIdRef.current) return
    runAgent(name)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    runAgent("soporte")
  }, [runAgent])

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

  const handleTabClick = (key: string) => {
    setActiveAgent(key)
    runAgent(key)
  }

  return (
    <section
      ref={ref}
      id="aaas"
      style={{
        position: "relative",
        padding: "160px 0 140px",
        marginTop: 40,
        background: `
          radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,106,53,0.12), transparent 60%),
          radial-gradient(ellipse 50% 40% at 20% 80%, rgba(200,255,61,0.06), transparent 60%),
          var(--bg)
        `,
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, #000 30%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, #000 30%, transparent 90%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "var(--max)", margin: "0 auto", padding: "0 var(--pad)", position: "relative", zIndex: 2 }}>

        {/* Hero text */}
        <div style={{ textAlign: "center", maxWidth: 980, margin: "0 auto 80px" }}>
          <div className="reveal" style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "6px 6px 6px 16px",
                borderRadius: 999,
                border: "1px solid rgba(255,106,53,0.35)",
                background: "rgba(255,106,53,0.06)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--accent-warm)",
              }}
            >
              Agent as a Service
              <span
                style={{
                  fontSize: 10,
                  padding: "5px 11px",
                  borderRadius: 999,
                  background: "var(--accent-warm)",
                  color: "#1a0c05",
                  fontWeight: 600,
                }}
              >
                AaaS
              </span>
            </span>
          </div>

          <h2
            className="reveal d1"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 6vw, 84px)",
              fontWeight: 400,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              marginBottom: 28,
            }}
          >
            Contrata un{" "}
            <span style={{ color: "var(--accent-warm)", fontStyle: "italic" }}>agente</span>,<br />
            no otra <em style={{ fontStyle: "italic", color: "var(--accent)" }}>herramienta</em>.
          </h2>

          <p className="reveal d2" style={{ color: "var(--text-mid)", fontSize: 19, maxWidth: 720, margin: "0 auto" }}>
            Diseñamos agentes de IA específicos para tu operación. Trabajan dentro de tus sistemas,
            toman decisiones con tus reglas y entregan resultados — facturas procesadas, leads
            calificados, clientes atendidos.{" "}
            <strong style={{ color: "var(--text)", fontWeight: 500 }}>Pagas por trabajo hecho</strong>, no por horas.
          </p>
        </div>

        {/* Agent picker + terminal */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 100 }}
          className="aaas-showcase-grid"
        >
          {/* Tabs */}
          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {TAB_CONFIG.map((tab) => {
              const isActive = activeAgent === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab.key)}
                  style={{
                    textAlign: "left",
                    padding: "20px 22px",
                    border: `1px solid ${isActive ? "var(--accent-warm)" : "var(--border)"}`,
                    borderRadius: "var(--rad)",
                    background: isActive
                      ? "linear-gradient(135deg, rgba(255,106,53,0.1), rgba(255,106,53,0.02))"
                      : "var(--surface)",
                    color: "var(--text)",
                    cursor: "pointer",
                    display: "grid",
                    gridTemplateColumns: "40px 1fr auto",
                    gap: 16,
                    alignItems: "center",
                    transition: "all .25s",
                  }}
                >
                  <span
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: isActive ? "var(--accent-warm)" : "rgba(255,106,53,0.08)",
                      display: "grid",
                      placeItems: "center",
                      border: `1px solid ${isActive ? "var(--accent-warm)" : "rgba(255,106,53,0.2)"}`,
                      color: isActive ? "#1a0c05" : "var(--accent-warm)",
                    }}
                  >
                    {tab.icon}
                  </span>
                  <span>
                    <div style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 15, marginBottom: 4 }}>
                      {tab.title}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-mid)" }}>{tab.desc}</div>
                  </span>
                  <span style={{ color: isActive ? "var(--accent-warm)" : "var(--text-faint)", transition: "transform .25s", transform: isActive ? "translateX(3px)" : "none" }}>
                    ›
                  </span>
                </button>
              )
            })}
          </div>

          {/* Terminal panel */}
          <div
            className="reveal d1"
            style={{
              background: "linear-gradient(180deg, #0d0d11 0%, #0a0a0d 100%)",
              border: "1px solid var(--border)",
              borderRadius: "var(--rad-lg)",
              boxShadow: "var(--shadow-lg)",
              minHeight: 480,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Panel header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 18px",
                borderBottom: "1px solid var(--border)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                {["#ff5f57","#febc2e","#28c840"].map((c) => (
                  <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, display: "block" }} />
                ))}
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-mid)" }}>
                {title}
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--text-dim)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    boxShadow: "0 0 10px var(--accent)",
                    display: "block",
                    animation: "pulse-dot 1.5s ease-in-out infinite",
                  }}
                />
                LIVE
              </span>
            </div>

            {/* Panel body */}
            <div
              ref={bodyRef}
              style={{
                padding: 24,
                flex: 1,
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                lineHeight: 1.7,
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              {lines.length === 0 ? (
                <div className="term-line">
                  <span className="pr">›</span>
                  <span className="txt">
                    <span className="cm">esperando entrada…</span>
                  </span>
                  <span className="cursor" />
                </div>
              ) : (
                lines
              )}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div
          className="reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            marginTop: 80,
            border: "1px solid var(--border)",
            borderRadius: "var(--rad-lg)",
            overflow: "hidden",
            background: "rgba(20,20,24,0.5)",
          }}
        >
          {[
            { n: "↓87%", l: "Tiempo en tareas repetitivas" },
            { n: "3.2x", l: "Más leads atendidos" },
            { n: "<30s", l: "Primera respuesta media" },
            { n: "24/7", l: "Sin vacaciones ni bajas" },
          ].map((m, i) => (
            <div
              key={m.l}
              style={{
                padding: "28px 24px",
                borderRight: i < 3 ? "1px solid var(--border)" : "none",
              }}
            >
              <div style={{ fontFamily: "var(--font-display)", fontSize: 44, lineHeight: 1, color: "var(--accent-warm)", marginBottom: 8 }}>
                {m.n}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-dim)" }}>
                {m.l}
              </div>
            </div>
          ))}
        </div>

        {/* Use cases grid */}
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: 70 }}
          className="use-grid-resp"
        >
          {[
            { title: "Procesamiento documental", desc: "Albaranes, facturas y contratos en cualquier formato — datos estructurados en tu base.", savings: "↓ hasta 30h/semana ahorradas" },
            { title: "Atención de primer nivel", desc: "WhatsApp, email y web. Resuelve, deriva al humano cuando toca, deja la conversación documentada.", savings: "↓ resolución autónoma del 72%" },
            { title: "Calificación de leads", desc: "Cada contacto recibe respuesta inmediata, se cualifica con tus reglas y entra al CRM listo.", savings: "↑ +3.2x reuniones cerradas" },
            { title: "Monitorización inteligente", desc: "Vigila stock, KPIs o sensores. Detecta anomalías antes que tú y abre el ticket por su cuenta.", savings: "↓ 92% incidencias atajadas pronto" },
            { title: "Orquestación entre sistemas", desc: "El agente entiende qué hace cada herramienta y dispara la acción correcta sin glue code frágil.", savings: "↓ integraciones en días, no meses" },
            { title: "Reportes ejecutivos", desc: "Cada mañana, un resumen de lo que importa en tu inbox. Cruzado entre fuentes, sin Excel.", savings: "↓ decisiones con datos, no intuición" },
          ].map((c, i) => (
            <article
              key={c.title}
              className={`reveal${i % 3 > 0 ? ` d${i % 3}` : ""}`}
              style={{
                padding: 26,
                border: "1px solid var(--border)",
                borderRadius: "var(--rad)",
                background: "rgba(20,20,24,0.6)",
                backdropFilter: "blur(10px)",
                transition: "border-color .25s, transform .3s",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = "var(--accent-warm)"
                ;(e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.borderColor = "var(--border)"
                ;(e.currentTarget as HTMLElement).style.transform = "none"
              }}
            >
              <h4 style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 16, margin: "0 0 8px", letterSpacing: "-0.01em" }}>
                {c.title}
              </h4>
              <p style={{ color: "var(--text-mid)", fontSize: 13.5, lineHeight: 1.55, margin: "0 0 14px" }}>
                {c.desc}
              </p>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", letterSpacing: "0.05em" }}>
                {c.savings}
              </span>
            </article>
          ))}
        </div>

        {/* Stack / how it works */}
        <div
          className="reveal stack-grid-resp"
          style={{
            marginTop: 100,
            padding: 50,
            border: "1px solid var(--border)",
            borderRadius: "var(--rad-lg)",
            background: "rgba(20,20,24,0.5)",
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 50,
            alignItems: "center",
          }}
        >
          <div>
            <div className="eyebrow warm" style={{ marginBottom: 18 }}>Cómo funciona</div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 34,
                fontWeight: 400,
                marginBottom: 14,
                lineHeight: 1.02,
              }}
            >
              Cinco capas, un agente que trabaja por ti.
            </h3>
            <p style={{ color: "var(--text-mid)", fontSize: 15, lineHeight: 1.65, marginBottom: 18 }}>
              Cada agente que entregamos se construye sobre el mismo stack robusto. Auditas las decisiones,
              controlas el coste y mantienes la propiedad de los datos.{" "}
              <strong style={{ color: "var(--text)", fontWeight: 500 }}>Nada de cajas negras.</strong>
            </p>
            <Link href="#contacto" className="btn btn-warm">
              Diseña tu agente <span className="arrow">→</span>
            </Link>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            {[
              { num: "L5", lbl: "Interfaz · chat, email, WhatsApp, API", meta: "user-facing" },
              { num: "L4", lbl: "Razonamiento · GPT-4 / Claude / Llama", meta: "LLM" },
              { num: "L3", lbl: "Herramientas · tu ERP, CRM, base de datos", meta: "function calling" },
              { num: "L2", lbl: "Memoria · contexto + RAG sobre tu negocio", meta: "vector store" },
              { num: "L1", lbl: "Trazabilidad · logs, métricas, guardrails", meta: "observability" },
            ].map((layer) => (
              <div key={layer.num} className="stack-layer">
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-faint)", width: 26 }}>
                  {layer.num}
                </span>
                <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 14, flex: 1 }}>
                  {layer.lbl}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-dim)", marginLeft: "auto" }}>
                  {layer.meta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .aaas-showcase-grid { grid-template-columns: 1fr !important; }
          .use-grid-resp { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .use-grid-resp { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 880px) {
          .stack-grid-resp { grid-template-columns: 1fr !important; padding: 32px !important; }
        }
      `}</style>
    </section>
  )
}
