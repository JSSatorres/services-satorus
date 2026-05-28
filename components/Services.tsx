"use client"

export function Services() {
  return (
    <section className="services" id="servicios">
      <div className="container">
        <header className="section-head section-head--split">
          <div>
            <span className="eyebrow"><span className="eyebrow__dot"></span> 02 / SERVICIOS</span>
            <h2 className="section-title">Tres formas de <em className="serif">tomar el control</em>.</h2>
          </div>
          <p className="section-lede">De la idea al producto, de la operación caótica al ERP a medida, del proceso manual al agente autónomo. Cada servicio se entrega como software propio — sin dependencias eternas.</p>
        </header>

        <div className="services__grid">
          <article className="scard" data-accent="orange">
            <div className="scard__head">
              <span className="mono small dim">/ 01</span>
              <span className="scard__pill mono small">ENTREGA EN ~6 SEM.</span>
            </div>
            <h3>Desarrollo<br/><em className="serif">a medida</em></h3>
            <p>Plataformas, ERPs y backoffices diseñados para la realidad de tu pyme. Stack moderno, código auditable, deploys en horas.</p>
            <ul className="scard__tags mono small">
              <li>FastAPI</li><li>React</li><li>PostgreSQL</li><li>Docker</li><li>AWS</li>
            </ul>
            <div className="scard__cta">
              <span>Sustituye Excel + email + &ldquo;el de informática lo mira mañana&rdquo;</span>
              <span className="scard__arrow">→</span>
            </div>
          </article>

          <article className="scard" data-accent="amber">
            <div className="scard__head">
              <span className="mono small dim">/ 02</span>
              <span className="scard__pill mono small">SIN GLUE-CODE</span>
            </div>
            <h3>Integración &amp;<br/><em className="serif">automatización</em></h3>
            <p>Conectamos tu CRM, tu ERP, tu pasarela de pago y tus herramientas existentes para que la información viaje sola.</p>
            <ul className="scard__tags mono small">
              <li>n8n</li><li>Stripe</li><li>HubSpot</li><li>Holded</li><li>Webhooks</li>
            </ul>
            <div className="scard__cta">
              <span>Flujos, APIs y orquestación que no dependen de copy-paste</span>
              <span className="scard__arrow">→</span>
            </div>
          </article>

          <article className="scard scard--featured" data-accent="lime">
            <div className="scard__head">
              <span className="mono small dim">/ 03</span>
              <span className="scard__pill scard__pill--hot mono small">★ NEW · AaaS</span>
            </div>
            <h3>Agent<br/><em className="serif">as a Service</em></h3>
            <p>Agentes de IA que leen, deciden y actúan dentro de tus sistemas. No son chatbots: hacen el trabajo y aprenden con cada interacción.</p>
            <ul className="scard__tags mono small">
              <li>GPT-4</li><li>Claude</li><li>LangChain</li><li>RAG</li><li>Function calling</li>
            </ul>
            <div className="scard__cta">
              <span>Pagas por trabajo hecho, no por horas</span>
              <span className="scard__arrow">→</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
