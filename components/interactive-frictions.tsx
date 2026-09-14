"use client"

import Image from "next/image"
import { useRef } from "react"
import { ArrowDown } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const frictions = [
  {
    text: "Un presupuesto se queda enterrado en WhatsApp.",
  },
  {
    text: "Copias el mismo pedido en dos o tres sitios.",
  },
  {
    text: "La web existe, pero no trae conversaciones.",
  },
  {
    text: "Cuando alguien falta, nadie sabe dónde estaba todo.",
  },
]

/** Separación en reposo entre tarjetas de la baraja, en píxeles. */
const REST_STEP_X = 26
const REST_STEP_Y = 62

/**
 * Baraja diagonal, replicando la sección `featuring` de lenis.dev: cada tarjeta
 * entra desde abajo a la derecha, se posa sobre la anterior y todas se quedan
 * a la vista formando un abanico.
 *
 * Encaja aquí y no en los pasos del proceso porque lo que hace la baraja es
 * **amontonar**: es literalmente de lo que habla esta sección.
 *
 * La escena se fija con `sticky` y no con el pin de ScrollTrigger, porque el
 * curtain deja un transform identidad en cada panel y un pin anidado se
 * anclaría al panel en vez de al viewport.
 */
export function InteractiveFrictions() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      // Por debajo de 900px la baraja no cabe: la lista se queda apilada y quieta.
      if (window.matchMedia("(max-width: 900px)").matches) return

      gsap.registerPlugin(ScrollTrigger)

      const section = sectionRef.current
      const track = section?.querySelector<HTMLElement>(".friction-track")
      const deck = section?.querySelector<HTMLElement>(".friction-deck")
      if (!section || !track || !deck) return

      const cards = gsap.utils.toArray<HTMLElement>(deck.children)
      if (cards.length === 0) return

      deck.dataset.motionEnabled = "true"

      // Distancia de entrada: la referencia usa ~0,49 alturas de viewport; aquí
      // la tarjeta es más pequeña, así que se recorta un poco.
      const travel = () => Math.round(window.innerHeight * 0.42)

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      })

      cards.forEach((card, index) => {
        const restX = index * REST_STEP_X
        const restY = index * REST_STEP_Y

        gsap.set(card, { zIndex: index + 1 })

        timeline.fromTo(
          card,
          {
            x: () => restX + travel(),
            y: () => restY + travel(),
            autoAlpha: 0,
          },
          { x: restX, y: restY, autoAlpha: 1, duration: 0.34 },
          index * 0.22,
        )
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      className="friction-section"
      id="que-resolvemos"
      aria-labelledby="friction-title"
      ref={sectionRef}
    >
      <div className="friction-track">
        <div className="friction-stage">
          <figure className="friction-photo">
            <Image
              src="/images/daily-tangle.png"
              alt="Mesa vista desde arriba con notas, un móvil y un cable naranja enredado."
              fill
              sizes="(max-width: 900px) 100vw, 52vw"
            />
            <span className="photo-tape">¿Te suena?</span>
          </figure>

          <div className="friction-copy">
            <h2 id="friction-title">
              Si tu día depende de acordarte de todo, algo se puede ordenar.
            </h2>
            <ul className="friction-deck">
              {frictions.map((friction) => (
                <li key={friction.text} className="friction-card">
                  <span aria-hidden="true" />
                  {friction.text}
                </li>
              ))}
            </ul>
            <a href="#contacto">
              Cuéntanos cuál es el tuyo
              <ArrowDown aria-hidden="true" size={22} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
