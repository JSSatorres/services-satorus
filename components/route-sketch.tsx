"use client"

import { useEffect, useId, useRef, useState } from "react"
import { motion, useInView } from "motion/react"
import { useHydratedReducedMotion } from "@/components/use-hydrated-reduced-motion"

const routeTransition = {
  duration: 1.3,
  ease: [0.22, 1, 0.36, 1],
} as const

/**
 * Extremos del barrido que descubre el trazo, en unidades del viewBox: cubren
 * la ruta completa (de x -30 a x 1230) con un margen para el grosor del trazo.
 */
const REVEAL_FROM = -40
const REVEAL_TO = 1245

export function RouteSketch() {
  const sketchRef = useRef<HTMLDivElement>(null)
  const hasEnteredViewport = useInView(sketchRef, { amount: 0.4, once: true })
  const reduceMotion = useHydratedReducedMotion()
  const [hasMounted, setHasMounted] = useState(false)
  const clipId = `route-reveal-${useId().replace(/:/g, "")}`

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHasMounted(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const shouldAnimate = hasMounted && !reduceMotion && hasEnteredViewport
  const shouldHideUntilViewport = hasMounted && !reduceMotion && !hasEnteredViewport
  const routeState = shouldHideUntilViewport ? 0 : 1
  const labelState = shouldHideUntilViewport ? 0 : 1

  return (
    <div ref={sketchRef} className="route-sketch" aria-hidden="true">
      {/* `preserveAspectRatio="none"` estira la ruta a lo ancho de la banda, y
          por eso el trazo no puede dibujarse con `pathLength`: el patrón de
          guiones que usa esa animación se mide en unidades del viewBox mientras
          `vector-effect: non-scaling-stroke` traza en píxeles de pantalla, así
          que la línea se quedaba a medias —y cuanto más ancha la pantalla, más
          corta—. La ruta va siempre de izquierda a derecha, así que un barrido
          con `clipPath` la descubre igual y es exacto a cualquier ancho. */}
      <svg viewBox="0 0 1200 300" preserveAspectRatio="none">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <motion.rect
              x={REVEAL_FROM}
              y={-300}
              height={900}
              initial={false}
              animate={{ width: routeState * (REVEAL_TO - REVEAL_FROM) }}
              transition={shouldAnimate ? routeTransition : { duration: 0 }}
            />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <path d="M-30 188 C160 258 286 64 492 158 S790 252 952 76 S1128 130 1230 184" />
          <path className="route-arrow" d="M1180 144 L1230 184 L1180 224" />
        </g>
      </svg>
      <motion.span
        className="sketch-start"
        initial={false}
        animate={{ opacity: labelState }}
        transition={shouldAnimate ? { duration: 0.2, delay: 0.08 } : { duration: 0 }}
      >
        Esperar
      </motion.span>
      <motion.span
        className="sketch-end"
        initial={false}
        animate={{ opacity: labelState }}
        transition={shouldAnimate ? { duration: 0.2, delay: 1.3 } : { duration: 0 }}
      >
        Avanzar
      </motion.span>
    </div>
  )
}
