"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "motion/react"
import { useHydratedReducedMotion } from "@/components/use-hydrated-reduced-motion"

const routeTransition = {
  duration: 1.3,
  ease: [0.22, 1, 0.36, 1],
} as const

export function RouteSketch() {
  const sketchRef = useRef<HTMLDivElement>(null)
  const hasEnteredViewport = useInView(sketchRef, { amount: 0.4, once: true })
  const reduceMotion = useHydratedReducedMotion()
  const [hasMounted, setHasMounted] = useState(false)

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
      <svg viewBox="0 0 720 400" preserveAspectRatio="xMidYMid meet">
        <motion.path
          d="M42 220 C128 72 216 340 318 190 S530 74 676 188"
          initial={false}
          animate={{ pathLength: routeState }}
          transition={shouldAnimate ? routeTransition : { duration: 0 }}
        />
        <motion.path
          className="route-arrow"
          d="M630 146 L682 188 L630 226"
          initial={false}
          animate={{ opacity: routeState, pathLength: routeState }}
          transition={
            shouldAnimate
              ? { ...routeTransition, delay: 1.1, duration: 0.2 }
              : { duration: 0 }
          }
        />
      </svg>
      <motion.span
        className="sketch-start"
        initial={false}
        animate={{ opacity: labelState }}
        transition={shouldAnimate ? { duration: 0.2, delay: 0.08 } : { duration: 0 }}
      >
        Una tarea del día
      </motion.span>
      <motion.span
        className="sketch-end"
        initial={false}
        animate={{ opacity: labelState }}
        transition={shouldAnimate ? { duration: 0.2, delay: 1.3 } : { duration: 0 }}
      >
        Una mejora concreta
      </motion.span>
    </div>
  )
}
