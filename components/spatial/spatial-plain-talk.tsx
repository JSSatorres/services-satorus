"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ArrowRight } from "lucide-react"
import { RouteSketch } from "@/components/route-sketch"
import { useStation } from "@/components/spatial/station-context"

/**
 * "Tu competencia tampoco" como estación de la mesa.
 *
 * Mismo marcado y estilos que la versión de scroll (`PlainTalk`), sin su pista
 * de 235svh: la escena mide lo que la estación. En lugar de crecer con el
 * scroll, el remate cae sobre la mesa cada vez que la cámara se posa aquí —
 * grande, girado y desde delante—, como un sello.
 */
export function SpatialPlainTalk() {
  const sectionRef = useRef<HTMLElement>(null)
  const { spatial, arrived } = useStation()

  useGSAP(
    () => {
      if (!spatial || !arrived) return

      const section = sectionRef.current
      const intro = section?.querySelector<HTMLElement>(".plain-talk-intro")
      const punch = section?.querySelector<HTMLElement>(".plain-talk-punch")
      const rest = section?.querySelectorAll<HTMLElement>(
        ".plain-talk-copy p, .plain-talk-cta",
      )
      if (!intro || !punch || !rest) return

      gsap
        .timeline({ defaults: { clearProps: "transform,opacity" } })
        .from(intro, { xPercent: -8, opacity: 0, duration: 0.7, ease: "expo.out" })
        .from(
          punch,
          {
            scale: 1.9,
            rotation: -7,
            opacity: 0,
            duration: 0.75,
            ease: "back.out(1.5)",
          },
          0.18,
        )
        .from(
          rest,
          { y: 26, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" },
          0.55,
        )
    },
    { scope: sectionRef, dependencies: [spatial, arrived] },
  )

  return (
    <section
      className="plain-talk sp-plain"
      ref={sectionRef}
      aria-labelledby="plain-talk-title"
    >
      <div className="plain-talk-stage">
        <div className="plain-talk-zoom">
          <div className="plain-talk-copy">
            <h2 id="plain-talk-title">
              <span className="plain-talk-intro">
                La inteligencia artificial
                <br />
                no va a esperarte.
              </span>
              <span className="plain-talk-punch">
                Tu <br className="plain-talk-punch-break" />
                competencia
                <br />
                tampoco.
              </span>
            </h2>
            <p>El momento de empezar no es mañana. Es antes que ellos.</p>
            <a className="plain-talk-cta" href="#contacto">
              Empezar ahora
              <ArrowRight aria-hidden="true" size={20} />
            </a>
          </div>

          <RouteSketch />
        </div>
      </div>
    </section>
  )
}
