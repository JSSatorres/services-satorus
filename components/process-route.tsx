"use client"

import { useRef, useState, type ReactNode } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

type ProcessStep = {
  title: string
  body: string
}

type ProcessRouteProps = {
  heading: ReactNode
  steps: ProcessStep[]
}

const stepAnswers = [
  "Te escuchamos.",
  "Lo dejamos por escrito.",
  "Lo pruebas tú.",
  "Tú sigues al mando.",
]

// Fracción del recorrido de la pista que dibuja la ruta. El resto es reposo:
// el cable entero y los cuatro pasos en azul se quedan quietos en pantalla
// antes de que el relevo de cortina traiga la sección siguiente. Sin este
// reposo la ruta terminaba justo en la frontera del relevo y el último paso no
// llegaba a verse.
const ROUTE_TRAVEL = 0.74

// Sobrante mínimo del panel para que merezca la pena repartir el recorrido
// entre el scroll. Por debajo de esto el cable daría un salto, no un trazo.
const MIN_RUNWAY = 120

// Sin ese sobrante la ruta se dibuja sola —una vez— al llegar la sección.
const MOBILE_DRAW_DURATION = 1.2

// El pin se enciende justo cuando el cable llega a él; este margen lo adelanta
// un pelo para que el color no vaya por detrás del trazo.
const REACH_LEAD = 0.12

/**
 * Recorrido de los pasos, replicando la sección `rethink` de lenis.dev: en
 * escritorio la escena se queda quieta con `sticky` y la pista se desplaza en X
 * mientras el visitante hace scroll vertical.
 *
 * Es el efecto que mejor encaja aquí porque la ruta de esta sección ya era
 * horizontal: recorrerla de verdad refuerza la metáfora en vez de sustituirla.
 *
 * El cable se dibuja tramo a tramo —uno por paso, del centro de su pin al
 * centro del siguiente—, así que el trazo pasa exactamente por donde va la
 * vista y termina en el último pin, ni antes ni después.
 */
export function ProcessRoute({ heading, steps }: ProcessRouteProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [motionEnabled, setMotionEnabled] = useState(false)
  const [progress, setProgress] = useState(1)

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

      gsap.registerPlugin(ScrollTrigger)

      const root = sectionRef.current
      const track = root?.querySelector<HTMLElement>(".process-track")
      const stage = root?.querySelector<HTMLElement>(".process-stage")
      const rail = root?.querySelector<HTMLElement>(".process-steps")
      if (!root || !track || !stage || !rail) return

      const horizontal = window.matchMedia("(min-width: 901px)").matches

      setProgress(0)
      setMotionEnabled(true)

      if (!horizontal) {
        let trigger: ScrollTrigger | null = null
        let drawing: gsap.core.Tween | null = null

        // La pista de scroll de móvil la abre `SectionCurtainStack` al montarse
        // y su efecto corre DESPUÉS que el de este componente —los hijos van
        // primero—, así que medir aquí mismo daría siempre un panel de una
        // pantalla. Un frame de espera y el panel ya tiene su altura buena.
        const frame = window.requestAnimationFrame(() => {
          // En móvil la pista no es la del recorrido horizontal —aquí mide lo
          // que el contenido— sino el sobrante del panel: la sección se queda
          // pegada ocupando la pantalla mientras el panel pasa por debajo, y
          // ese scroll es el que llena el cable de un pin al siguiente.
          const panel = root.closest<HTMLElement>(".section-curtain-panel")
          const runway = (panel?.offsetHeight ?? 0) - window.innerHeight

          if (panel && runway > MIN_RUNWAY) {
            trigger = ScrollTrigger.create({
              trigger: panel,
              start: "top top",
              end: "bottom bottom",
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                setProgress(Math.min(1, self.progress / ROUTE_TRAVEL))
              },
            })

            return
          }

          // Red de seguridad: sin ese sobrante —la pista retirada de la hoja de
          // estilos, una pantalla larguísima— no hay recorrido que repartir y
          // engancharse a él daría un cable que salta de golpe en vez de un
          // trazo. Entonces el dibujo se cuenta solo, una vez, al llegar.
          const draw = { value: 0 }
          drawing = gsap.to(draw, {
            value: 1,
            duration: MOBILE_DRAW_DURATION,
            ease: "power1.inOut",
            paused: true,
            onUpdate: () => setProgress(draw.value),
          })

          // Tres puertas para un mismo dibujo, porque a esta sección se llega
          // de tres maneras: bajando (`onEnter`), subiendo desde las preguntas
          // (`onEnterBack`) y cayendo dentro con la sección ya en pantalla —un
          // enlace del menú, recargar a media página—, que no dispara ninguna
          // de las dos y es lo que atiende `onRefresh`. Reproducir una línea de
          // tiempo terminada no la rebobina: sigue contándose una sola vez.
          trigger = ScrollTrigger.create({
            trigger: root,
            start: "top 85%",
            onEnter: () => drawing?.play(),
            onEnterBack: () => drawing?.play(),
            onRefresh: (self) => {
              if (self.isActive) drawing?.play()
            },
          })
        })

        return () => {
          window.cancelAnimationFrame(frame)
          trigger?.kill()
          drawing?.kill()
        }
      }

      // Lo que la pista sobresale de la escena es exactamente lo que hay que
      // recorrer; se recalcula en cada refresh para que resista un resize.
      const overflow = () => Math.max(0, rail.scrollWidth - stage.clientWidth)

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setProgress(Math.min(1, self.progress / ROUTE_TRAVEL))
          },
        },
      })

      timeline.to(rail, { x: () => -overflow(), duration: ROUTE_TRAVEL }, 0)
      // El tramo vacío es el reposo: alarga la línea de tiempo hasta el final
      // de la pista sin mover nada más.
      timeline.to({}, { duration: 1 }, 0)
    },
    { scope: sectionRef, dependencies: [steps.length] },
  )

  // El cable avanza de pin en pin: `progress` recorre los tramos que hay entre
  // los pasos, no los pasos.
  const lastStep = Math.max(1, steps.length - 1)
  const drawn = motionEnabled ? progress * lastStep : lastStep

  return (
    <div className="process-route" ref={sectionRef}>
      <div className="process-track">
        <div className="process-stage">
          <div className="process-heading">{heading}</div>

          <ol className="process-steps">
            {steps.map((step, index) => {
              const fill = Math.min(1, Math.max(0, drawn - index))

              return (
                <li
                  key={step.title}
                  data-reached={drawn + REACH_LEAD >= index || undefined}
                  style={{ "--step-fill": fill } as React.CSSProperties}
                >
                  <span className="step-pin" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div>
                    <p className="process-step-answer">{stepAnswers[index]}</p>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}
