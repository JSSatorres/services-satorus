"use client"

import { ArrowRight } from "lucide-react"
import { useState, type CSSProperties } from "react"

const services = [
  {
    id: "web",
    name: "Una web que ayuda a elegirte",
    type: "Web",
    previewLabel: "Antes y después de tu web",
    description:
      "Presenta lo que haces con claridad, muestra el valor de tu negocio y facilita que te pidan información, una cita o un presupuesto.",
    visualDescription:
      "Un navegador pasa de un mensaje confuso a una página clara con un botón visible para pedir cita.",
  },
  {
    id: "custom",
    name: "Una herramienta adaptada a tu trabajo",
    type: "A medida",
    previewLabel: "Así se organiza un pedido",
    description:
      "Reúne presupuestos, pedidos, clientes o tareas en un lugar pensado para tu forma de trabajar. La información queda disponible para quien la necesita.",
    visualDescription:
      "Notas y datos de pedido dispersos se reúnen en una herramienta sencilla.",
  },
  {
    id: "automation",
    name: "Automatizar con IA para avanzar",
    type: "Automatización",
    previewLabel: "Así fluye una consulta",
    description:
      "Conecta herramientas, automatiza recordatorios y utiliza la IA para preparar respuestas o trabajar con documentos. Definimos qué puede hacerse automáticamente y qué necesita tu revisión.",
    visualDescription:
      "Una consulta conecta un aviso al equipo, un presupuesto preparado y el siguiente paso mediante un cable naranja.",
  },
] as const

type ServiceId = (typeof services)[number]["id"]

function WebDemo() {
  return (
    <div className="demo-browser">
      <div className="demo-browser-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <i>satorus.es</i>
      </div>
      <div className="demo-browser-before">
        <strong>¿Qué hacemos?</strong>
        <span>Soluciones para todo</span>
        <span>Escríbenos si quieres</span>
      </div>
      <div className="demo-browser-after">
        <span className="demo-eyebrow">Taller de bicicletas</span>
        <strong>Reparamos tu bici sin marearte.</strong>
        <p>Trae tu bici, dinos qué falla y te damos cita.</p>
        <b>Pedir cita</b>
      </div>
    </div>
  )
}

function CustomDemo() {
  return (
    <div className="demo-orders">
      <span className="demo-note demo-note-one">Pedido de Marta</span>
      <span className="demo-note demo-note-two">2 estantes + montaje</span>
      <span className="demo-note demo-note-three">¿entrega jueves?</span>
      <div className="demo-order-tool">
        <div>
          <span>Pedido</span>
          <strong>#0248 · Marta</strong>
        </div>
        <div className="demo-order-field">
          Qué necesita
          <b>2 estantes + montaje</b>
        </div>
        <div className="demo-order-field">
          Entrega
          <b>Jueves, 10:00</b>
        </div>
        <em>Listo para preparar</em>
      </div>
    </div>
  )
}

function AutomationDemo() {
  return (
    <div className="demo-automation">
      <div className="demo-query">Nueva consulta: “Quiero presupuesto”</div>
      <svg className="demo-cable" viewBox="0 0 340 146" aria-hidden="true">
        <path d="M30 26 C108 26 84 73 169 73 S220 120 310 120" />
        <circle cx="30" cy="26" r="8" />
        <circle cx="169" cy="73" r="8" />
        <circle cx="310" cy="120" r="8" />
      </svg>
      <div className="demo-alert">Aviso al equipo</div>
      <div className="demo-document">
        <span>Presupuesto</span>
        <b>Preparado</b>
      </div>
      <div className="demo-next-step">Llamar a Ana · 11:30</div>
    </div>
  )
}

function ServiceDemo({ activeId }: { activeId: ServiceId }) {
  const service = services.find((item) => item.id === activeId) ?? services[0]

  return (
    <aside
      className="service-demo-panel"
      id="service-demo-panel"
      aria-label={`${service.previewLabel} (${service.type})`}
    >
      <div className="service-demo-panel-heading">
        <span aria-live="polite">{service.previewLabel}</span>
        <p>{service.type}</p>
      </div>
      <div
        className={`service-demo-art service-demo-art--${activeId}`}
        key={activeId}
        role="img"
        aria-label={service.visualDescription}
      >
        {activeId === "web" && <WebDemo />}
        {activeId === "custom" && <CustomDemo />}
        {activeId === "automation" && <AutomationDemo />}
      </div>
    </aside>
  )
}

export function ServiceShowcase() {
  const [activeId, setActiveId] = useState<ServiceId>(services[0].id)
  const activeIndex = services.findIndex((service) => service.id === activeId)
  const panelStyle = {
    "--active-panel-row": activeIndex * 2 + 2,
  } as CSSProperties

  return (
    <div className="service-showcase" style={panelStyle}>
      {services.map((service) => {
        const isActive = service.id === activeId

        return (
          <button
            key={service.id}
            className="service-row"
            data-service={service.id}
            data-active={isActive}
            type="button"
            aria-pressed={isActive}
            aria-controls="service-demo-panel"
            onPointerEnter={() => setActiveId(service.id)}
            onFocus={() => setActiveId(service.id)}
            onClick={() => setActiveId(service.id)}
          >
            <span className="service-type">{service.type}</span>
            <span className="service-row-copy">
              <span className="service-row-title">{service.name}</span>
              <span className="service-row-description">{service.description}</span>
            </span>
            <ArrowRight aria-hidden="true" size={29} strokeWidth={1.8} />
          </button>
        )
      })}
      <ServiceDemo activeId={activeId} />
    </div>
  )
}
