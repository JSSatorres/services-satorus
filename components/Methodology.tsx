"use client"

import { useEffect, useRef } from "react"

export function Capas() {
  return (
    <section className="capas" id="capas">
      <div className="container capas__inner">
        <div className="capas__left">
          <span className="eyebrow"><span className="eyebrow__dot"></span> CÓMO FUNCIONA</span>
          <h2 className="capas__title"><em className="serif">Cinco capas,</em> un agente que trabaja por ti.</h2>
          <p className="capas__lede">Cada agente que entregamos se construye sobre el mismo stack robusto. Auditas las decisiones, controlas el coste y mantienes la propiedad de los datos. <b>Nada de cajas negras.</b></p>
          <a className="btn btn--pill btn--primary" href="#contacto">Diseña tu agente <span className="btn__arrow">→</span></a>

          <div className="capas__detail">
            <span className="mono small dim">// flujo · entrada → respuesta</span>
            <div className="capas__flow">
              <span>L5</span><span className="capas__arrow">→</span>
              <span>L4</span><span className="capas__arrow">→</span>
              <span>L3</span><span className="capas__arrow">→</span>
              <span>L2</span><span className="capas__arrow">→</span>
              <span>L1</span>
            </div>
            <span className="mono small dim">ciclo medio: ~1.4s · trazado completo</span>
          </div>
        </div>

        <ol className="capas__list">
          <li className="layer" data-accent="orange">
            <span className="layer__id mono">L5</span>
            <div className="layer__main">
              <h4>Interfaz <span className="layer__dot">·</span> <span className="layer__det">chat, email, WhatsApp, API</span></h4>
            </div>
            <span className="layer__tag mono small">user-facing</span>
            <span className="layer__pulse"></span>
          </li>
          <li className="layer" data-accent="amber">
            <span className="layer__id mono">L4</span>
            <div className="layer__main">
              <h4>Razonamiento <span className="layer__dot">·</span> <span className="layer__det">GPT-4 / Claude / Llama</span></h4>
            </div>
            <span className="layer__tag mono small">LLM</span>
            <span className="layer__pulse"></span>
          </li>
          <li className="layer" data-accent="yellow">
            <span className="layer__id mono">L3</span>
            <div className="layer__main">
              <h4>Herramientas <span className="layer__dot">·</span> <span className="layer__det">tu ERP, CRM, base de datos</span></h4>
            </div>
            <span className="layer__tag mono small">function calling</span>
            <span className="layer__pulse"></span>
          </li>
          <li className="layer" data-accent="mint">
            <span className="layer__id mono">L2</span>
            <div className="layer__main">
              <h4>Memoria <span className="layer__dot">·</span> <span className="layer__det">contexto + RAG sobre tu negocio</span></h4>
            </div>
            <span className="layer__tag mono small">vector store</span>
            <span className="layer__pulse"></span>
          </li>
          <li className="layer" data-accent="lime">
            <span className="layer__id mono">L1</span>
            <div className="layer__main">
              <h4>Trazabilidad <span className="layer__dot">·</span> <span className="layer__det">logs, métricas, guardrails</span></h4>
            </div>
            <span className="layer__tag mono small">observability</span>
            <span className="layer__pulse"></span>
          </li>
        </ol>
      </div>
    </section>
  )
}

export function Proceso() {
  const railRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible")
          io.unobserve(e.target)
        }
      }
    }, { threshold: 0.15 })
    if (railRef.current) io.observe(railRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <section className="proceso" id="proceso">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow"><span className="eyebrow__dot"></span> 04 / PROCESO</span>
          <h2 className="section-title">De idea a <em className="serif">producción</em>,<br/>en cuatro pasos.</h2>
          <p className="section-lede">Trabajamos en sprints cortos con demos cada dos semanas. Ves el producto crecer, decides qué priorizar, y desde el primer mes ya hay algo funcionando.</p>
        </header>

        <ol className="proceso__rail" ref={railRef}>
          <div className="proceso__line"><span className="proceso__line-fill"></span></div>
          <li className="step">
            <span className="step__id mono">01 · SEMANA 1</span>
            <h3>Auditoría <em className="serif">operativa</em></h3>
            <p>Una semana en tus zapatos: dónde se rompe el flujo, qué tareas matan al equipo, qué automatizar primero.</p>
            <ul className="step__check mono small">
              <li>→ shadowing del equipo</li>
              <li>→ mapa de procesos</li>
              <li>→ quick-wins detectados</li>
            </ul>
          </li>
          <li className="step">
            <span className="step__id mono">02 · SEMANA 2-3</span>
            <h3>Diseño &amp; <em className="serif">prototipo</em></h3>
            <p>Maquetamos el sistema en Figma + un prototipo clicable. Antes de escribir código, validamos contigo.</p>
            <ul className="step__check mono small">
              <li>→ wireframes hi-fi</li>
              <li>→ prototipo navegable</li>
              <li>→ arquitectura técnica</li>
            </ul>
          </li>
          <li className="step">
            <span className="step__id mono">03 · MES 1-3</span>
            <h3>Build en <em className="serif">sprints</em></h3>
            <p>Sprints de 2 semanas con demo y feedback. Despliegues continuos. Tú ves el progreso real cada lunes.</p>
            <ul className="step__check mono small">
              <li>→ demo cada 14 días</li>
              <li>→ CI/CD desde día 1</li>
              <li>→ tests &gt; 80% coverage</li>
            </ul>
          </li>
          <li className="step">
            <span className="step__id mono">04 · ONGOING</span>
            <h3>Operación &amp; <em className="serif">evolución</em></h3>
            <p>Monitorizamos, iteramos y entrenamos a los agentes con tus datos. El sistema mejora con el uso.</p>
            <ul className="step__check mono small">
              <li>→ observabilidad 24/7</li>
              <li>→ retraining mensual</li>
              <li>→ SLA &lt; 1h</li>
            </ul>
          </li>
        </ol>
      </div>
    </section>
  )
}

export function Methodology() {
  return (
    <>
      <Capas />
      <Proceso />
    </>
  )
}
