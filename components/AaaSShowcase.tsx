"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"

type Kind = "user" | "agent" | "think" | "action" | "note" | "step" | "done"
interface Line { d: number; kind: Kind; text: string; meta?: string }
interface Agent { title: string; script: Line[] }

const AGENTS: Record<string, Agent> = {
  soporte: {
    title: "agente-soporte · sesión #4218",
    script: [
      { d: 200, kind: "user",   text: "Hola, no me deja entrar a la plataforma, dice que mi licencia ha caducado." },
      { d: 700, kind: "think",  text: "Identificando cliente y revisando licencia…" },
      { d: 900, kind: "action", text: 'crm.lookup_customer(email="luis@acme.es")', meta: "ok · plan Pro · activo" },
      { d: 700, kind: "action", text: "billing.check_subscription(id=AC-2241)", meta: "pago fallido el 12/11" },
      { d: 800, kind: "agent",  text: "¡Hola Luis! Veo que el cobro del 12/11 no se completó (tarjeta caducada). Reintento el pago ahora y te dejo entrar mientras tanto." },
      { d: 1200, kind: "user",  text: "Sí, perfecto." },
      { d: 500, kind: "action", text: "billing.retry_payment(id=AC-2241)", meta: "✓ 89,00 €" },
      { d: 500, kind: "action", text: "auth.grant_access(user=luis@acme.es, hours=2)", meta: "✓ acceso temporal" },
      { d: 700, kind: "agent",  text: "Listo. Cobro reintentado, ya tienes acceso. Te envío la factura por email." },
      { d: 600, kind: "done",   text: "Resuelto autónomamente · 14s · sin escalado humano" },
    ],
  },
  facturas: {
    title: "agente-facturas · lote #1184",
    script: [
      { d: 300, kind: "note",   text: "Llegan 8 facturas a contabilidad@empresa.es" },
      { d: 700, kind: "step",   text: "Descargando adjuntos del buzón", meta: "8/8" },
      { d: 700, kind: "step",   text: "OCR + extracción de campos", meta: "vision AI" },
      { d: 800, kind: "step",   text: "Validando NIFs contra base de proveedores", meta: "7 ok · 1 nuevo" },
      { d: 700, kind: "agent",  text: "⚠ Nuevo proveedor detectado: \"Suministros Levante SL\". Lo doy de alta provisional y aviso a Marta." },
      { d: 700, kind: "step",   text: "Comparando importes con albaranes", meta: "cuadran" },
      { d: 700, kind: "step",   text: "Registrando en Holded", meta: "8 asientos creados" },
      { d: 500, kind: "step",   text: "Marcando emails como procesados", meta: "inbox limpio" },
      { d: 600, kind: "done",   text: "8 facturas · 12.847 € · procesadas en 47s · ahorro: 3h" },
    ],
  },
  ventas: {
    title: "agente-comercial · lead #L-8821",
    script: [
      { d: 300, kind: "note",   text: "Nuevo lead desde el formulario web" },
      { d: 600, kind: "action", text: 'enrich.company(domain="acme-foods.com")', meta: "42 empleados · food sector" },
      { d: 700, kind: "think",  text: "Cualificando con criterios ICP…" },
      { d: 700, kind: "agent",  text: "Lead encaja: sector relevante, tamaño en rango. Score: 8.2/10. Respondo y propongo agenda." },
      { d: 800, kind: "action", text: 'email.send(to="ana@acme-foods.com")', meta: "✓ enviado · 22s" },
      { d: 600, kind: "user",   text: "¿Podemos hablar el jueves a las 10?" },
      { d: 600, kind: "action", text: 'calendar.check(host="comercial@satorus.es")', meta: "libre" },
      { d: 600, kind: "action", text: "calendar.book(meet, participants=[ana, comercial])", meta: "✓ invite enviada" },
      { d: 600, kind: "agent",  text: "¡Perfecto! Reunión confirmada para el jueves a las 10:00. Adjunto el caso de éxito de Veladia." },
      { d: 600, kind: "done",   text: "Lead cualificado y reunión agendada · sin tocar el CRM" },
    ],
  },
  operaciones: {
    title: "agente-operaciones · turno nocturno",
    script: [
      { d: 300, kind: "note",   text: "03:14 — escaneo periódico de inventario" },
      { d: 600, kind: "step",   text: "Lectura de niveles de stock", meta: "247 SKUs" },
      { d: 700, kind: "step",   text: "Cruzando con ventas últimas 14d", meta: "forecasting" },
      { d: 700, kind: "agent",  text: "⚠ SKU AC-9912 cae bajo umbral en 6 días. Plazo proveedor: 8 días. Lanzo pedido preventivo." },
      { d: 700, kind: "action", text: "erp.create_purchase_order(sku=AC-9912, qty=400)", meta: "borrador" },
      { d: 700, kind: "action", text: 'email.notify(to="compras@empresa.es")', meta: "✓ con razón y datos" },
      { d: 600, kind: "step",   text: "Anomalía en pedidos de Cataluña", meta: "−42% vs media" },
      { d: 700, kind: "agent",  text: "Abro ticket en comercial: posible incidencia con distribuidor." },
      { d: 500, kind: "done",   text: "2 acciones preventivas · cero humanos despertados a las 3AM" },
    ],
  },
}

const TABS = [
  { key: "soporte",     label: "Soporte 24/7",    desc: "Resuelve tickets, escala lo crítico.",
    icon: <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"><path d="M21 12a9 9 0 11-3.5-7.1M21 4v5h-5"/></svg> },
  { key: "facturas",    label: "Facturas",         desc: "Lee PDFs/emails, valida y registra.",
    icon: <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg> },
  { key: "ventas",      label: "Comercial",        desc: "Califica leads y agenda reuniones.",
    icon: <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"><path d="M3 17l6-6 4 4 8-8M14 7h7v7"/></svg> },
  { key: "operaciones", label: "Operaciones",      desc: "Stock, KPIs, incidencias nocturnas.",
    icon: <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"><circle cx={12} cy={12} r={3}/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg> },
]

function sleep(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)) }

export function AaaSShowcase() {
  const ref     = useRef<HTMLElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const runId   = useRef(0)

  const [active, setActive] = useState("soporte")
  const [title,  setTitle]  = useState(AGENTS.soporte.title)
  const [lines,  setLines]  = useState<React.ReactNode[]>([])

  const renderLine = (item: Line): React.ReactNode => {
    const key = `${item.kind}-${Math.random()}`
    if (item.kind === "user")   return <div className="term-line" key={key}><span className="pr usr">user ›</span><span className="txt">{item.text}</span></div>
    if (item.kind === "agent")  return <div className="term-line" key={key}><span className="pr">agent ›</span><span className="txt">{item.text}</span></div>
    if (item.kind === "think")  return <div className="term-line" key={key}><span className="pr">···</span><span className="term-thinking">{item.text}</span></div>
    if (item.kind === "action") return <div className="term-line" key={key}><span className="pr">›</span><span className="ky">{item.text}</span>{item.meta && <span className="cm" style={{ marginLeft: 8 }}>// {item.meta}</span>}</div>
    if (item.kind === "note")   return <div className="term-line" key={key}><span className="pr">→</span><span className="cm">{item.text}</span></div>
    if (item.kind === "step")   return <div className="flow-step done" key={key}><span className="fnum">✓</span><span className="ftext">{item.text}</span>{item.meta && <span className="fmeta">{item.meta}</span>}</div>
    if (item.kind === "done")   return <div className="term-line" key={key} style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}><span className="pr ok">✓</span><span className="txt" style={{ color: "var(--accent)" }}>{item.text}</span></div>
    return null
  }

  const runAgent = useCallback(async (name: string) => {
    const conf = AGENTS[name]
    if (!conf) return
    const myId = ++runId.current
    setTitle(conf.title)
    setLines([])
    await sleep(300)
    if (myId !== runId.current) return
    for (const item of conf.script) {
      if (myId !== runId.current) return
      await sleep(item.d)
      setLines((p) => [...p, renderLine(item)])
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
    await sleep(3800)
    if (myId !== runId.current) return
    runAgent(name)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { runAgent("soporte") }, [runAgent])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target) } }),
      { threshold: 0.08 }
    )
    ref.current?.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id="aaas"
      className="sec-pad-resp"
      style={{
        position: "relative",
        padding: "160px 0 140px",
        background: `
          radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,106,53,0.08), transparent 55%),
          var(--bg)
        `,
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "var(--max)", margin: "0 auto", padding: "0 var(--pad)", position: "relative", zIndex: 2 }}>

        {/* Section header */}
        <div style={{ maxWidth: 900, marginBottom: 80 }}>
          <div className="reveal" style={{ marginBottom: 24 }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "5px 5px 5px 14px",
              borderRadius: 999,
              border: "1px solid rgba(255,106,53,0.25)",
              background: "rgba(255,106,53,0.06)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent-warm)",
            }}>
              Agent as a Service
              <span style={{
                fontSize: 10,
                padding: "4px 10px",
                borderRadius: 999,
                background: "var(--accent-warm)",
                color: "#1a0c05",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}>AaaS</span>
            </span>
          </div>

          <h2 className="reveal d1" style={{ fontSize: "clamp(40px, 6vw, 88px)", marginBottom: 24 }}>
            Contrata un{" "}
            <em style={{ color: "var(--accent-warm)", fontStyle: "italic" }}>agente</em>,<br />
            no otra{" "}
            <em style={{ color: "var(--accent)", fontStyle: "italic" }}>herramienta</em>.
          </h2>

          <p className="reveal d2" style={{ color: "var(--text-mid)", fontSize: "clamp(16px, 1.4vw, 19px)", lineHeight: 1.65, maxWidth: 640 }}>
            Diseñamos agentes específicos para tu operación. Trabajan dentro de tus sistemas,
            toman decisiones con tus reglas y entregan resultados.{" "}
            <strong style={{ color: "var(--text)", fontWeight: 600 }}>Pagas por trabajo hecho</strong>, no por horas.
          </p>
        </div>

        {/* Agent picker + terminal */}
        <div style={{ marginBottom: 96 }}>

          {/* ── Desktop: side-by-side grid ── */}
          <div className="aaas-desk-grid reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

            {/* Tabs — vertical list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {TABS.map((tab) => {
                const isActive = active === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => { setActive(tab.key); runAgent(tab.key) }}
                    style={{
                      textAlign: "left",
                      padding: "18px 20px",
                      border: `1px solid ${isActive ? "rgba(255,106,53,0.4)" : "var(--border)"}`,
                      borderRadius: 10,
                      background: isActive ? "rgba(255,106,53,0.07)" : "var(--surface)",
                      color: "var(--text)",
                      cursor: "pointer",
                      display: "flex",
                      gap: 14,
                      alignItems: "center",
                      transition: "border-color .2s, background .2s",
                    }}
                  >
                    <span style={{
                      width: 36, height: 36,
                      borderRadius: 8,
                      background: isActive ? "var(--accent-warm)" : "rgba(255,106,53,0.07)",
                      border: `1px solid ${isActive ? "var(--accent-warm)" : "rgba(255,106,53,0.15)"}`,
                      display: "grid",
                      placeItems: "center",
                      color: isActive ? "#1a0c05" : "var(--accent-warm)",
                      flexShrink: 0,
                      transition: "all .2s",
                    }}>
                      {tab.icon}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em", marginBottom: 2 }}>
                        {tab.label}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-dim)", letterSpacing: "-0.01em" }}>
                        {tab.desc}
                      </div>
                    </span>
                    <span style={{ color: isActive ? "var(--accent-warm)" : "var(--text-faint)", fontSize: 16, transition: "transform .2s", transform: isActive ? "translateX(2px)" : "none" }}>›</span>
                  </button>
                )
              })}
            </div>

            {/* Terminal — desktop */}
            <TerminalPanel title={title} bodyRef={bodyRef} lines={lines} />
          </div>

          {/* ── Mobile: chips row + terminal full width ── */}
          <div className="aaas-mob-grid">

            {/* Chip strip */}
            <div style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 4,
              scrollbarWidth: "none",
              marginBottom: 14,
            }}>
              {TABS.map((tab) => {
                const isActive = active === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => { setActive(tab.key); runAgent(tab.key) }}
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 16px",
                      borderRadius: 999,
                      border: `1px solid ${isActive ? "var(--accent-warm)" : "var(--border-hi)"}`,
                      background: isActive ? "rgba(255,106,53,0.12)" : "var(--surface)",
                      color: isActive ? "var(--accent-warm)" : "var(--text-dim)",
                      cursor: "pointer",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: "-0.01em",
                      transition: "border-color .2s, background .2s, color .2s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span style={{
                      color: isActive ? "var(--accent-warm)" : "var(--text-faint)",
                      display: "flex", alignItems: "center",
                    }}>
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Active tab description */}
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text-faint)",
              letterSpacing: "0.06em",
              marginBottom: 12,
              paddingLeft: 2,
            }}>
              {TABS.find((t) => t.key === active)?.desc}
            </p>

            {/* Terminal — mobile */}
            <TerminalPanel title={title} bodyRef={bodyRef} lines={lines} />
          </div>
        </div>

        {/* Metrics */}
        <div className="reveal aaas-metrics-resp" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          border: "1px solid var(--border-hi)",
          borderRadius: 14,
          overflow: "hidden",
          background: "var(--surface)",
        }}>
          {[
            { n: "↓87%", l: "Tiempo en tareas repetitivas" },
            { n: "3.2×",  l: "Más leads atendidos" },
            { n: "<30s",  l: "Primera respuesta media" },
            { n: "24/7",  l: "Sin vacaciones ni bajas" },
          ].map((m, i) => (
            <div key={m.l} style={{ padding: "32px 28px", borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 44, lineHeight: 1, color: "var(--accent-warm)", letterSpacing: "-0.04em", marginBottom: 10 }}>
                {m.n}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-dim)" }}>
                {m.l}
              </div>
            </div>
          ))}
        </div>

        {/* Use cases grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, marginTop: 1, background: "var(--border)" }} className="use-grid-resp">
          {[
            { title: "Procesamiento documental",  desc: "Albaranes, facturas y contratos — datos estructurados en tu base.", kpi: "↓ hasta 30h/semana" },
            { title: "Atención de primer nivel",  desc: "WhatsApp, email, web. Resuelve, deriva al humano cuando toca.", kpi: "↓ resolución autónoma 72%" },
            { title: "Calificación de leads",     desc: "Cada contacto: respuesta inmediata, cualificado y en el CRM listo.", kpi: "↑ +3.2× reuniones" },
            { title: "Monitorización inteligente",desc: "Vigila stock y KPIs. Detecta anomalías y abre el ticket.", kpi: "↓ 92% incidencias atajadas" },
            { title: "Orquestación entre sistemas",desc: "El agente entiende tus herramientas y dispara la acción correcta.", kpi: "↓ integraciones en días" },
            { title: "Reportes ejecutivos",       desc: "Cada mañana, un resumen de lo que importa. Sin Excel.", kpi: "↓ decisiones con datos" },
          ].map((c, i) => (
            <article key={c.title}
              className={`reveal${i % 3 > 0 ? ` d${i % 3}` : ""}`}
              style={{
                padding: "32px 28px",
                background: "var(--bg-1)",
                transition: "background .25s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-2)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-1)" }}
            >
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em", margin: "0 0 10px", lineHeight: 1.2 }}>
                {c.title}
              </h4>
              <p style={{ color: "var(--text-mid)", fontSize: 13, lineHeight: 1.65, margin: "0 0 16px" }}>
                {c.desc}
              </p>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", letterSpacing: "0.06em" }}>
                {c.kpi}
              </span>
            </article>
          ))}
        </div>

        {/* Stack + CTA */}
        <div
          className="reveal stack-grid-resp"
          style={{
            padding: "48px 48px",
            border: "1px solid var(--border-hi)",
            borderRadius: 14,
            background: "var(--surface)",
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 56,
            alignItems: "center",
            marginTop: 80,
          }}
        >
          <div>
            <div className="eyebrow warm" style={{ marginBottom: 18 }}>
              <span className="dot" /> Cómo funciona
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 34, letterSpacing: "-0.03em", marginBottom: 16, lineHeight: 1.05 }}>
              Cinco capas,<br />un agente que trabaja por ti.
            </h3>
            <p style={{ color: "var(--text-mid)", fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>
              Cada agente se construye sobre el mismo stack robusto. Auditas las decisiones,
              controlas el coste y mantienes la propiedad de los datos.{" "}
              <strong style={{ color: "var(--text)" }}>Nada de cajas negras.</strong>
            </p>
            <Link href="#contacto" className="btn btn-warm">
              Diseña tu agente <span className="arrow">→</span>
            </Link>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            {[
              { num: "L5", lbl: "Interfaz · chat, email, WhatsApp, API", meta: "user-facing" },
              { num: "L4", lbl: "Razonamiento · GPT-4o / Claude / Llama", meta: "LLM" },
              { num: "L3", lbl: "Herramientas · tu ERP, CRM, base de datos", meta: "function calling" },
              { num: "L2", lbl: "Memoria · contexto + RAG sobre tu negocio", meta: "vector store" },
              { num: "L1", lbl: "Trazabilidad · logs, métricas, guardrails", meta: "observability" },
            ].map((layer) => (
              <div key={layer.num} className="stack-layer">
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)", width: 24, letterSpacing: "0.05em" }}>
                  {layer.num}
                </span>
                <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 13, flex: 1 }}>
                  {layer.lbl}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-dim)" }}>
                  {layer.meta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
