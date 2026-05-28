"use client"

export function AaaSShowcase() {
  return (
    <section className="aaas" id="aaas">
      <div className="container">
        <header className="section-head">
          <span className="eyebrow"><span className="eyebrow__dot"></span> AGENT AS A SERVICE · AaaS</span>
          <h2 className="section-title">Contrata un agente,<br/>no otra <em className="serif">herramienta</em>.</h2>
          <p className="section-lede">Diseñamos agentes de IA específicos para tu operación. Trabajan dentro de tus sistemas, toman decisiones con tus reglas y entregan resultados — facturas procesadas, leads calificados, clientes atendidos.</p>
        </header>

        <div className="aaas__hub">
          <div className="aaas__core">
            <div className="aaas__core-ring aaas__core-ring--1"></div>
            <div className="aaas__core-ring aaas__core-ring--2"></div>
            <div className="aaas__core-ring aaas__core-ring--3"></div>
            <div className="aaas__core-center">
              <span className="mono small dim">// satorus</span>
              <span className="aaas__core-title">agent.runtime</span>
              <span className="mono small"><span className="aaas__core-dot"></span> 4 agentes activos</span>
            </div>
          </div>

          <a className="aaas__node aaas__node--n" href="#contacto" data-accent="orange">
            <span className="mono small dim">agente</span>
            <span className="aaas__node-name">soporte 24/7</span>
            <span className="aaas__node-meta mono small">↑ 72% resolución autónoma</span>
          </a>
          <a className="aaas__node aaas__node--e" href="#contacto" data-accent="amber">
            <span className="mono small dim">agente</span>
            <span className="aaas__node-name">facturas</span>
            <span className="aaas__node-meta mono small">↓ 30h/sem manuales</span>
          </a>
          <a className="aaas__node aaas__node--s" href="#contacto" data-accent="mint">
            <span className="mono small dim">agente</span>
            <span className="aaas__node-name">comercial</span>
            <span className="aaas__node-meta mono small">↑ 3.2× reuniones cerradas</span>
          </a>
          <a className="aaas__node aaas__node--w" href="#contacto" data-accent="lime">
            <span className="mono small dim">agente</span>
            <span className="aaas__node-name">operaciones</span>
            <span className="aaas__node-meta mono small">↓ 92% incidencias atajadas</span>
          </a>

          <svg className="aaas__wires" viewBox="0 0 800 540" aria-hidden="true">
            <line x1="400" y1="270" x2="400" y2="90"  className="wire" data-accent="orange"/>
            <line x1="400" y1="270" x2="680" y2="270" className="wire" data-accent="amber"/>
            <line x1="400" y1="270" x2="400" y2="470" className="wire" data-accent="mint"/>
            <line x1="400" y1="270" x2="120" y2="270" className="wire" data-accent="lime"/>
          </svg>
        </div>

        <div className="aaas__stats">
          <div className="ministat"><b>↓ 87%</b><span>tiempo en tareas repetitivas</span></div>
          <div className="ministat"><b>3.2×</b><span>más leads atendidos</span></div>
          <div className="ministat"><b>&lt; 30s</b><span>primera respuesta media</span></div>
          <div className="ministat"><b>24/7</b><span>sin vacaciones ni bajas</span></div>
        </div>
      </div>
    </section>
  )
}
