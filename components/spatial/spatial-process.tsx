"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type CSSProperties } from "react"
import type { ProcessStep } from "@/lib/home-content"
import { useStation } from "@/components/spatial/station-context"

/** Tiempo que el cable tarda en ir de un pin al siguiente al llegar la cámara. */
const STEP_INTERVAL_MS = 1100
/** Respiro antes de empezar a tirar del cable: deja terminar el aterrizaje. */
const START_DELAY_MS = 450

type SpatialProcessProps = {
  steps: ProcessStep[]
}

/**
 * "Cómo trabajamos" como estación de la mesa.
 *
 * La versión de scroll recorría la ruta con ScrollTrigger; aquí no hay scroll
 * de documento que escuchar, así que el cable se tira solo la primera vez que
 * la cámara se posa en la estación: de pin en pin, mientras la pila de fotos
 * pasa a la siguiente. Después manda el visitante: cada pin es un botón que
 * pone su foto encima de la pila.
 */
export function SpatialProcess({ steps }: SpatialProcessProps) {
  const { spatial, arrived } = useStation()
  const lastStep = steps.length - 1
  // Sin mesa —movimiento reducido, sin JS— la ruta está entera desde el principio.
  const [current, setCurrent] = useState(0)
  const [reached, setReached] = useState(lastStep)
  const playedRef = useRef(false)
  const takenOverRef = useRef(false)

  useEffect(() => {
    if (!spatial || playedRef.current) return

    // La primera pintura en modo mesa ya parte de la ruta vacía.
    const reset = window.requestAnimationFrame(() => {
      if (playedRef.current) return
      setReached(0)
      setCurrent(0)
    })

    return () => window.cancelAnimationFrame(reset)
  }, [spatial])

  useEffect(() => {
    if (!spatial || !arrived || playedRef.current) return
    playedRef.current = true

    let started = false
    const timers: number[] = []
    for (let step = 1; step <= lastStep; step += 1) {
      timers.push(
        window.setTimeout(
          () => {
            started = true
            if (takenOverRef.current) return
            setReached(step)
            setCurrent(step)
          },
          START_DELAY_MS + step * STEP_INTERVAL_MS,
        ),
      )
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      // Si la cámara se va antes de que el cable arranque, se vuelve a tirar
      // en la próxima llegada.
      if (!started) playedRef.current = false
    }
  }, [spatial, arrived, lastStep])

  function show(index: number) {
    takenOverRef.current = true
    setCurrent(index)
    setReached((value) => Math.max(value, index))
  }

  return (
    <section
      className="sp-process"
      id="como-trabajamos"
      aria-labelledby="process-title"
    >
      <div className="sp-process-head sp-rise">
        <span className="sp-kicker">Cómo trabajamos</span>
        <h2 id="process-title">Una mejora concreta. Un plan claro.</h2>
        <p>
          Antes de construir, acordamos qué queremos mejorar, qué vamos a
          entregar y cómo comprobaremos que funciona.
        </p>
      </div>

      <div className="sp-process-prints sp-rise" aria-hidden="true">
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
                sizes="(max-width: 900px) 80vw, 34vw"
              />
              <figcaption>
                {String(index + 1).padStart(2, "0")} · {step.answer}
              </figcaption>
            </figure>
          )
        })}
      </div>

      <ol className="sp-process-steps sp-rise">
        {steps.map((step, index) => (
          <li
            key={step.title}
            data-reached={index <= reached || undefined}
            data-filled={index < reached || undefined}
            data-current={index === current || undefined}
            // `pointermove` y no `mouseenter`: al aterrizar, el paso puede
            // colocarse bajo un cursor quieto, y eso no es tomar el mando.
            onPointerMove={(event) => {
              if (event.pointerType === "mouse" && index !== current) show(index)
            }}
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
    </section>
  )
}
