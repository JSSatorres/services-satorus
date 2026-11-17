"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import {
  Bell,
  CalendarDays,
  Check,
  FileText,
  Home,
  MessageCircle,
  PhoneCall,
  Receipt,
  Search,
  Users,
} from "lucide-react"
import { BUSINESS } from "@/lib/hero-scenes"
import { cue, recentStart } from "@/lib/sound/gsap"

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * «Así se ve tu negocio»: sobre un campo lima pixelado, el panel sube desde
 * abajo, crece hasta llenar la pantalla y empiezan a saltar avisos de lo que
 * el negocio ha resuelto solo. Los números cuentan hacia arriba con el scroll.
 *
 * En móvil, lo mismo con el panel compacto y los avisos cayendo desde arriba,
 * como notificaciones del teléfono. Sin JS o con movimiento reducido: el panel
 * quieto y los avisos debajo.
 */

/** Escritorio y móvil hacen la misma coreografía; con movimiento reducido, ninguna. */
const MOTION = {
  desktop: "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
}

const toasts = [
  { icon: CalendarDays, title: "Nueva reserva", text: "Sra. López · hoy a las 17:30", tone: "blue" },
  { icon: FileText, title: "Presupuesto aceptado", text: "N.º 0418 · Tarta de boda", tone: "lime" },
  { icon: PhoneCall, title: "Llamada perdida", text: "Le hemos escrito por WhatsApp", tone: "orange" },
  { icon: Receipt, title: "Caja cuadrada", text: "1.284,60 € · 42 tickets", tone: "ink" },
]

const agenda = [
  { time: "10:00", who: "Encargo · Marta R.", tag: "Recogida" },
  { time: "12:30", who: "Degustación · Boda Ruiz", tag: "Confirmada" },
  { time: "17:30", who: "Sra. López", tag: "Nueva" },
]

export function AppDemoSection() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, (context) => {
        const { mobile } = context.conditions as { mobile: boolean }
        const q = gsap.utils.selector(root)
        const counters = q("[data-count]") as HTMLElement[]

        gsap.set(q(".ad-window"), { yPercent: 70, scale: 0.62, rotateX: 18, transformPerspective: 1600 })
        gsap.set(q(".ad-frame"), { yPercent: 80, scale: 0.7 })
        gsap.set(q(".ad-toast"), mobile ? { autoAlpha: 0, y: -28, scale: 0.92 } : { autoAlpha: 0, x: 60, scale: 0.9 })
        counters.forEach((el) => (el.textContent = "0"))

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.7 },
        })

        tl.to(q(".ad-window"), { yPercent: 0, scale: 1, rotateX: 0, duration: 1.2, ease: "power3.out" })
          .to(q(".ad-frame"), { yPercent: 0, scale: 1, duration: 1.2, stagger: 0.08, ease: "power3.out" }, "<0.1")
          .to(q(".ad-head"), { yPercent: -60, autoAlpha: 0, duration: 0.8 }, "<0.3")
          .to(
            counters,
            {
              duration: 0.9,
              ease: "none",
              textContent: (_: number, el: HTMLElement) => el.dataset.count,
              snap: { textContent: 1 },
            },
            "-=0.4",
          )
          .to(q(".ad-toast"), { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.35, stagger: 0.45, ease: "back.out(1.6)" }, "<")
        // Sonido: el panel sube y crece; cada aviso, su doble nota.
        const toastsAt = recentStart(tl)
        tl.to({}, { duration: 0.5 })
        cue(tl, 0.05, "rise")
        q(".ad-toast").forEach((_: Element, index: number) =>
          cue(tl, toastsAt + index * 0.45 + 0.05, "notify", { note: [7, 5, 3, 8][index % 4], volume: 0.8 }),
        )
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section className="ad" ref={root} aria-labelledby="ad-title">
      <div className="ad-sticky">
        <div className="ad-pixels" aria-hidden="true" />

        <header className="ad-head">
          <p className="hub-hand">y así se ve</p>
          <h2 className="ad-title" id="ad-title">
            Tu negocio, trabajando mientras tú atiendes.
          </h2>
        </header>

        <div className="ad-scene">
          <span className="ad-frame ad-frame--blue" aria-hidden="true" />
          <span className="ad-frame ad-frame--orange" aria-hidden="true" />

          <div className="ad-window" role="img" aria-label={`Ejemplo del panel de ${BUSINESS}: agenda, mensajes, presupuestos y caja del día`}>
            <aside className="ad-side" aria-hidden="true">
              <span className="ad-logo">S</span>
              {[Home, MessageCircle, CalendarDays, FileText, Receipt, Users].map((Icon, index) => (
                <span key={index} className="ad-nav" data-active={index === 0 || undefined}>
                  <Icon size={17} />
                </span>
              ))}
            </aside>

            <div className="ad-main" aria-hidden="true">
              <div className="ad-bar">
                <span className="ad-search">
                  <Search size={14} /> Buscar cliente, pedido…
                </span>
                <span className="ad-bell">
                  <Bell size={15} />
                  <i />
                </span>
              </div>

              <p className="ad-hello">
                Buenos días, Lola <small>martes, 17 de noviembre</small>
              </p>

              <div className="ad-cards">
                <article className="ad-card ad-card--chat">
                  <p className="ad-card-label">
                    <MessageCircle size={14} /> Asistente de WhatsApp
                  </p>
                  <p className="ad-big">
                    <b data-count="23">23</b> respondidas
                  </p>
                  <p className="ad-bubble">¿Tenéis hueco hoy para una tarta de queso?</p>
                  <p className="ad-bubble ad-bubble--me">Sí, a las 17:30. ¿Te la reservo?</p>
                </article>

                <article className="ad-card ad-card--agenda">
                  <p className="ad-card-label">
                    <CalendarDays size={14} /> Agenda de hoy
                  </p>
                  <ul>
                    {agenda.map((item) => (
                      <li key={item.time}>
                        <b>{item.time}</b>
                        <span>{item.who}</span>
                        <em>{item.tag}</em>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="ad-card ad-card--quotes">
                  <p className="ad-card-label">
                    <FileText size={14} /> Presupuestos
                  </p>
                  <p className="ad-big">
                    <b data-count="6">6</b> enviados
                  </p>
                  <span className="ad-meter">
                    <span style={{ width: "66%" }} />
                  </span>
                  <small>4 aceptados esta semana</small>
                </article>

                <article className="ad-card ad-card--till">
                  <p className="ad-card-label">
                    <Receipt size={14} /> Caja
                  </p>
                  <p className="ad-big">
                    <b data-count="1284">1284</b> €
                  </p>
                  <small>
                    <Check size={13} /> cuadrada · Verifactu enviado
                  </small>
                </article>
              </div>
            </div>
          </div>

          <ul className="ad-toasts" aria-label="Avisos de ejemplo">
            {toasts.map((toast) => (
              <li key={toast.title} className="ad-toast" data-tone={toast.tone}>
                <span className="ad-toast-ic" aria-hidden="true">
                  <toast.icon size={16} />
                </span>
                <span>
                  <b>{toast.title}</b>
                  <small>{toast.text}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
