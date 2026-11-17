"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { processSteps } from "@/lib/home-content"
import { processDetails } from "@/lib/book-content"

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * «Cómo trabajamos» como una rueda: las cuatro cartas van montadas sobre un
 * arco discontinuo y, al bajar, la rueda gira y deja en el centro el paso que
 * toca; las demás se quedan inclinadas a los lados. La sección se queda fija
 * mientras gira.
 *
 * En móvil, la misma rueda más pequeña: la carta del centro ocupa casi todo
 * el ancho y las vecinas asoman inclinadas por los bordes. Sin JS o con
 * movimiento reducido: las cartas en columna.
 */

/** Grados entre carta y carta sobre la rueda. */
const STEP_DEG = 28

const tones = ["blue", "orange", "lime", "ink"] as const

export function ProcessSection() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root)
        root.current?.setAttribute("data-anim", "on")
        const last = processSteps.length - 1

        gsap.set(q(".pw-card"), { rotate: (i) => i * STEP_DEG })
        // La rueda gira hasta dejar el paso 4 centrado un pantallazo antes del
        // final; ese último tramo lo ocupa «Qué hacemos» subiendo por encima
        // (telón), así nunca se ve el corte de las cartas al soltar la sección.
        const rotateEnd = () => `bottom-=${window.innerHeight} bottom`
        gsap.fromTo(
          q(".pw-wheel"),
          { rotate: 14, y: 80 },
          {
            rotate: -last * STEP_DEG,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: rotateEnd,
              scrub: 0.8,
              // En móvil, al soltar el dedo la rueda se asienta con una carta
              // centrada en vez de quedarse a medias entre dos.
              snap: window.matchMedia("(max-width: 900px)").matches
                ? {
                    snapTo: [0, ...processSteps.map((_, i) => (14 + i * STEP_DEG) / (14 + last * STEP_DEG))],
                    duration: { min: 0.25, max: 0.6 },
                    delay: 0.08,
                    ease: "power2.inOut",
                    // Siempre a la carta más cercana: sin inercia, un gesto
                    // rápido no se salta pasos.
                    inertia: false,
                    directional: false,
                  }
                : undefined,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const raw = (self.progress * (last * STEP_DEG + 14) - 14) / STEP_DEG
                setActive(Math.max(0, Math.min(last, Math.round(raw))))
              },
            },
          },
        )
        gsap.fromTo(
          q(".pw-arc"),
          { strokeDashoffset: 0 },
          {
            strokeDashoffset: -240,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: rotateEnd, scrub: true, invalidateOnRefresh: true },
          },
        )
        // Mientras sube el telón, la rueda se aleja y se apaga debajo.
        gsap.fromTo(
          q(".pw-stage, .pw-head"),
          { scale: 1, autoAlpha: 1, filter: "brightness(1)" },
          {
            scale: 0.9,
            autoAlpha: 0.35,
            filter: "brightness(0.85)",
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: rotateEnd,
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )
        const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
        const section = root.current
        return () => {
          cancelAnimationFrame(frame)
          section?.removeAttribute("data-anim")
        }
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section className="pw" id="como-trabajamos" ref={root} aria-labelledby="como-trabajamos-title">
      <div className="pw-sticky">
        <header className="pw-head">
          <p className="hub-hand">cómo trabajamos</p>
          <h2 className="pw-title" id="como-trabajamos-title">
            Cuatro pasos y ninguna sorpresa.
          </h2>
          <ol className="pw-dots" aria-hidden="true">
            {processSteps.map((step, index) => (
              <li key={step.title} data-active={index === active || undefined} data-done={index < active || undefined}>
                {index + 1}
              </li>
            ))}
          </ol>
        </header>

        <div className="pw-stage">
          <svg className="pw-arc-svg" viewBox="0 0 1000 1000" aria-hidden="true">
            <circle className="pw-arc" cx="500" cy="500" r="497" />
          </svg>
          <ol className="pw-wheel">
            {processSteps.map((step, index) => (
              <li
                key={step.title}
                className="pw-card"
                data-tone={tones[index]}
                data-active={index === active || undefined}
              >
                <div className="pw-card-head">
                  <span className="pw-num">{String(index + 1).padStart(2, "0")}</span>
                  <span className="pw-answer">{step.answer}</span>
                </div>
                <figure className="pw-photo">
                  <Image src={step.image} alt={step.imageAlt} fill sizes="(max-width: 900px) 92vw, 24rem" />
                </figure>
                <div className="pw-body">
                  <h3>{step.title}</h3>
                  <p>{processDetails[index].text}</p>
                  <p className="pw-take">
                    <span>Te llevas</span>
                    {processDetails[index].takeaway}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
