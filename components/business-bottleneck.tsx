import { ArrowRight, Check, Clock3, FileText, MessageCircleMore } from "lucide-react"

const inboxItems = [
  ["Solicitud de propuesta", "10:24"],
  ["Re: Seguimiento", "09:17"],
  ["Nueva consulta", "Ayer"],
  ["Recordatorio", "2 días"],
] as const

const nextSteps = [
  ["Responder consulta de Acme", "Hoy, 11:00"],
  ["Enviar presupuesto a Beta", "Hoy, 15:00"],
  ["Dar seguimiento a Gamma", "Mañana, 10:00"],
] as const

function WindowBar({ title }: { title: string }) {
  return (
    <div className="bottleneck-window-bar">
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <strong>{title}</strong>
    </div>
  )
}

function CurrentWorkScene() {
  return (
    <div className="bottleneck-chaos-scene" aria-hidden="true">
      <div className="bottleneck-window bottleneck-inbox">
        <WindowBar title="Entrada (124)" />
        <div className="bottleneck-window-content">
          {inboxItems.map(([label, time]) => (
            <span key={label}>
              <i aria-hidden="true" />
              {label}
              <small>{time}</small>
            </span>
          ))}
        </div>
      </div>

      <div className="bottleneck-window bottleneck-sheet">
        <WindowBar title="Clientes.xlsx" />
        <div className="bottleneck-sheet-grid" aria-hidden="true">
          <span>Acme</span><span>Propuesta</span><span>Duplicado</span>
          <span>Beta</span><span>Seguimiento</span><span>Seguimiento</span>
          <span>Gamma</span><span>Revisión</span><span>Revisión</span>
        </div>
      </div>

      <div className="bottleneck-window bottleneck-messages">
        <WindowBar title="Mensajes" />
        <div className="bottleneck-message-list">
          <span><b>Cliente</b> ¿Hay novedades?<i>3</i></span>
          <span><b>Proveedor</b> ¿Podrías confirmar?<i>1</i></span>
          <span><b>Cliente</b> Seguimos esperando…<i>4</i></span>
        </div>
      </div>

      <span className="bottleneck-note bottleneck-note--info">Información dispersa</span>
      <span className="bottleneck-note bottleneck-note--tasks">Tareas repetidas</span>
      <span className="bottleneck-note bottleneck-note--follow">Seguimientos olvidados</span>
      <span className="bottleneck-checkboxes" aria-hidden="true">
        Revisar propuesta<br />□ Enviar presupuesto<br />□ Dar seguimiento
      </span>
      <span className="bottleneck-scribble bottleneck-scribble--one" aria-hidden="true" />
      <span className="bottleneck-scribble bottleneck-scribble--two" aria-hidden="true" />
    </div>
  )
}

function OrganizedWorkScene() {
  return (
    <div className="bottleneck-order-scene" aria-hidden="true">
      <div className="bottleneck-dashboard">
        <WindowBar title="Tu espacio de trabajo" />
        <div className="bottleneck-dashboard-body">
          <div className="bottleneck-dashboard-nav">
            <strong><MessageCircleMore aria-hidden="true" /> Consultas</strong>
            <span><FileText aria-hidden="true" /> Presupuestos</span>
            <span><Clock3 aria-hidden="true" /> Seguimientos</span>
          </div>
          <div className="bottleneck-next-steps">
            <h3>Próximos pasos</h3>
            {nextSteps.map(([title, time]) => (
              <div className="bottleneck-next-step" key={title}>
                <span><Check aria-hidden="true" /></span>
                <p><strong>{title}</strong><small>{time}</small></p>
                <ArrowRight aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bottleneck-benefits" aria-hidden="true">
        <span>Todo en un mismo lugar</span>
        <span>El siguiente paso, siempre claro</span>
      </div>
    </div>
  )
}

export function BusinessBottleneck() {
  return (
    <section
      className="business-bottleneck"
      id="diagnostico"
      aria-labelledby="bottleneck-title"
    >
      <header className="bottleneck-heading">
        <h2 id="bottleneck-title">¿Dónde se está frenando tu negocio?</h2>
        <span className="bottleneck-emphasis" aria-hidden="true" />
      </header>

      <div className="bottleneck-comparison">
        <article className="bottleneck-panel bottleneck-panel--chaos">
          <h3>Ahora</h3>
          <p className="sr-only">
            Consultas, hojas de cálculo y tareas dispersas dificultan el seguimiento.
          </p>
          <CurrentWorkScene />
        </article>

        <div className="bottleneck-bridge" aria-hidden="true">
          <ArrowRight />
        </div>

        <article className="bottleneck-panel bottleneck-panel--order">
          <h3>Con Satorus</h3>
          <p className="sr-only">
            Reunimos el trabajo y dejamos visible cuál es el siguiente paso.
          </p>
          <OrganizedWorkScene />
        </article>
      </div>

      <footer className="bottleneck-footer">
        <div>
          <h3>Menos caos. Más avance.</h3>
          <p>Vemos el problema y lo convertimos en una solución útil.</p>
        </div>
        <a href="#contacto">
          Cuéntanos qué te frena
          <ArrowRight aria-hidden="true" />
        </a>
      </footer>
    </section>
  )
}
