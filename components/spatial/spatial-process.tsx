"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type CSSProperties } from "react"
import type { ProcessStep } from "@/lib/home-content"
import { useStation } from "@/components/spatial/station-context"

/**
 * En móvil los pasos van en columna bajo una franja fija con la foto; en
 * escritorio la escena entera se queda fija mientras la sección pasa por
 * debajo. Las dos cosas las decide el CSS; aquí sólo cambia cómo se lee el
 * scroll para saber en qué paso se está.
 */
const STACKED_QUERY = "(max-width: 900px)"

/**
 * Escritorio: fracción del recorrido de la sección que reparte los pasos. El
 * resto es reposo con el cable entero y el último paso a la vista, antes de
 * llegar al margen de la hoja.
 */
const STEPS_TRAVEL = 0.86

/** Móvil: altura de la línea de lectura, bajo la franja de la foto. */
const READING_LINE = 0.62

type SpatialProcessProps = {
  steps: ProcessStep[]
}

/**
 * "Cómo trabajamos" como estación de la mesa.
 *
 * Los pasos avanzan con el scroll, en los dos sentidos: al bajar se enciende
 * el pin siguiente, el cable crece hasta él y la pila de fotos pasa a la suya;
 * al subir, al revés. En escritorio la escena se queda fija (`sticky`) y la
 * sección mide varias pantallas de recorrido; en móvil los pasos se leen en
 * columna y el actual es el que cruza la línea de lectura. Los pines siguen
 * siendo botones, para quien navega con teclado.
 */
export function SpatialProcess({ steps }: SpatialProcessProps) {
  const { spatial } = useStation()
  const lastStep = steps.length - 1
  // Sin mesa ni scroll —movimiento reducido antes del primer scroll, sin JS—
  // la ruta está entera.
  const [current, setCurrent] = useState(0)
  const [reached, setReached] = useState(lastStep)
  const sectionRef = useRef<HTMLElement>(null)
  const stepsRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const list = stepsRef.current
    if (!section || !list) return

    const items = Array.from(list.querySelectorAll<HTMLLIElement>(":scope > li"))
    const scroller = section.closest<HTMLElement>(".spatial-station")
    let frame = 0

    const stepFromScroll = () => {
      if (window.matchMedia(STACKED_QUERY).matches) {
        const line = window.innerHeight * READING_LINE
        let index = 0
        items.forEach((item, position) => {
          if (item.getBoundingClientRect().top <= line) index = position
        })
        return index
      }

      const rect = section.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      if (travel <= 0) return lastStep
      const progress = Math.min(1, Math.max(0, -rect.top / travel))
      return Math.min(lastStep, Math.floor((progress / STEPS_TRAVEL) * steps.length))
    }

    const update = () => {
      frame = 0
      const index = stepFromScroll()
      setCurrent(index)
      setReached(index)
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    // En la mesa la ruta arranca vacía y la llena el scroll; la primera
    // lectura sale de donde haya dejado la hoja la cámara.
    if (spatial) schedule()

    scroller?.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      scroller?.removeEventListener("scroll", schedule)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [spatial, lastStep, steps.length])

  function show(index: number) {
    setCurrent(index)
    setReached(index)
  }

  return (
    <section
      className="sp-process"
      id="como-trabajamos"
      aria-labelledby="process-title"
      ref={sectionRef}
    >
      <div className="sp-process-stage">
        <div className="sp-process-head">
          <span className="sp-kicker">Cómo trabajamos</span>
          <h2 id="process-title">Una mejora concreta. Un plan claro.</h2>
          <p>
            Antes de construir, acordamos qué queremos mejorar, qué vamos a
            entregar y cómo comprobaremos que funciona.
          </p>
        </div>

        <div className="sp-process-prints" aria-hidden="true">
          {steps.map((step, index) => {
            const offset = index - current
            const style = {
              "--offset": offset,
              "--depth": 10 + index * 4,
              zIndex: steps.length - Math.abs(offset),
            } as CSSProperties

            return (
              <figure
                className="sp-print"
                data-depth=""
                data-state={
                  offset === 0 ? "current" : offset < 0 ? "past" : "next"
                }
                key={step.image}
                style={style}
              >
                <Image
                  src={step.image}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(max-width: 900px) 70vw, 34vw"
                />
                <figcaption>
                  {String(index + 1).padStart(2, "0")} · {step.answer}
                </figcaption>
              </figure>
            )
          })}
        </div>

        <ol className="sp-process-steps" ref={stepsRef}>
          {steps.map((step, index) => (
            <li
              key={step.title}
              data-reached={index <= reached || undefined}
              data-filled={index < reached || undefined}
              data-current={index === current || undefined}
            >
              <button
                type="button"
                className="sp-step-pin"
                aria-label={`Ver paso ${index + 1}: ${step.title}`}
                aria-pressed={index === current}
                onClick={() => show(index)}
              >
                {index + 1}
              </button>
              <div>
                <p className="sp-step-answer">{step.answer}</p>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
