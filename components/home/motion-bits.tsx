"use client"

import { useRef, type ReactNode } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"

/**
 * Piezas de movimiento del home. Ninguna toca el scroll: sólo lo leen.
 * Con movimiento reducido (`MotionProvider`) todo aparece en su sitio.
 */

const EASE = [0.16, 1, 0.3, 1] as const

/** Aparece subiendo cuando entra en pantalla, una sola vez. */
export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
}: {
  children: ReactNode
  className?: string
  delay?: number
  /** Desde dónde llega: abajo, izquierda o derecha. */
  from?: "up" | "left" | "right"
}) {
  const offset = from === "up" ? { y: 36 } : { x: from === "left" ? -48 : 48 }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Imagen que se destapa al entrar en pantalla y se desliza un poco más lenta
 * que la página mientras se baja (paralaje).
 */
export function ParallaxImage({
  src,
  alt,
  sizes,
  className,
  strength = 7,
  ...data
}: {
  src: string
  alt: string
  sizes: string
  className?: string
  /** Recorrido de la imagen dentro del marco, en % de su alto. */
  strength?: number
  "data-fit"?: string
  "data-top"?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`])

  return (
    <motion.figure
      ref={ref}
      className={className}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
      {...data}
    >
      <motion.div className="px-inner" style={{ y }}>
        <Image src={src} alt={alt} fill sizes={sizes} />
      </motion.div>
    </motion.figure>
  )
}

/** Banda de foto a sangre con una frase encima; la foto se mueve con paralaje. */
export function PhotoBand({ src, alt, children }: { src: string; alt: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])

  return (
    <section className="hs-band" ref={ref}>
      <motion.div className="hs-band-photo" style={{ y }}>
        <Image src={src} alt={alt} fill sizes="100vw" />
      </motion.div>
      <div className="hs-band-copy">{children}</div>
    </section>
  )
}

/** La gráfica «Dos caminos»: las líneas se dibujan al entrar en pantalla. */
export function PathsChart() {
  const draw = (delay: number, duration: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: "0px 0px -20% 0px" },
    transition: { duration, delay, ease: EASE },
  })
  const label = (delay: number) => ({
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "0px 0px -20% 0px" },
    transition: { duration: 0.5, delay },
  })

  return (
    <div className="hs-paths-chart">
      <svg
        viewBox="0 0 320 220"
        role="img"
        aria-label="Gráfica a mano: si sigues igual, los clientes bajan; tu competencia, con IA, sube; con Satorus, subes más."
      >
        <path className="hs-paths-axis" d="M24 196H306M24 196V18" />
        <path className="hs-paths-axis" d="M300 190L306 196L300 202M18 24L24 18L30 24" />
        <motion.path className="hs-paths-same" d="M24 124C96 124 170 140 292 170" {...draw(0.2, 0.9)} />
        <motion.path className="hs-paths-rival" d="M24 124C100 118 170 96 292 74" {...draw(0.7, 0.9)} />
        <motion.path
          className="hs-paths-us"
          d="M24 124C96 120 150 84 206 58S268 30 292 24"
          {...draw(1.3, 1.3)}
        />
      </svg>
      <motion.span className="hs-paths-label hs-paths-label--same" {...label(0.9)}>
        si sigues igual
      </motion.span>
      <motion.span className="hs-paths-label hs-paths-label--rival" {...label(1.4)}>
        tu competencia, ya con IA
      </motion.span>
      <motion.span className="hs-paths-label hs-paths-label--us" {...label(2.3)}>
        con Satorus
      </motion.span>
      <span className="hs-paths-label hs-paths-label--y">clientes</span>
      <span className="hs-paths-label hs-paths-label--x">tiempo</span>
    </div>
  )
}
