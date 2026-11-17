"use client"

import { useRef, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { BackdropVideo } from "@/components/home/backdrop-video"

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Ventana a un fondo quieto: el vídeo va `position: fixed` dentro de una
 * sección con `clip-path`, así que no se mueve con la página; la sección es
 * una ventana que pasa por encima y la siguiente lo tapa al subir. El texto
 * se queda centrado (sticky) y entra creciendo desde más grande.
 */
export function FixedBand({
  children,
  className,
  poster,
  startAt,
  tone = "blue",
}: {
  children: ReactNode
  className?: string
  poster?: string
  startAt?: number
  tone?: "blue" | "ink"
}) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root)
        gsap.fromTo(
          q(".fw-copy-in"),
          { scale: 1.35, autoAlpha: 0, filter: "blur(10px)" },
          {
            scale: 1,
            autoAlpha: 1,
            filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 5%", scrub: 0.6 },
          },
        )
        gsap.to(q(".fw-copy-in"), {
          yPercent: -30,
          autoAlpha: 0,
          ease: "power1.in",
          immediateRender: false,
          scrollTrigger: { trigger: root.current, start: "bottom 75%", end: "bottom 15%", scrub: 0.6 },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section className={`fw ${className ?? ""}`} data-tone={tone} ref={root}>
      <BackdropVideo className="fw-media" poster={poster} startAt={startAt} />
      <div className="fw-veil" aria-hidden="true" />
      <div className="fw-copy">
        <div className="fw-copy-in">{children}</div>
      </div>
    </section>
  )
}

/**
 * Palabras sueltas a distintas alturas que flotan y se separan con el scroll,
 * cada una a su ritmo (como el cierre de Loopsii).
 */
export function FloatingWords({ words, className }: { words: string[]; className?: string }) {
  const root = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".fl-word", root.current).forEach((word, index) => {
          const amount = window.innerWidth < 900 ? 0.6 : 1
          const depth = [1, -0.6, 1.4, -1.1, 0.7, -1.3][index % 6] * amount
          gsap.fromTo(
            word,
            { y: 90 * depth, rotate: depth * 3 },
            {
              y: -90 * depth,
              rotate: -depth * 3,
              ease: "none",
              scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
            },
          )
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <p className={`fl ${className ?? ""}`} ref={root}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="fl-word" style={{ animationDelay: `${index * -0.7}s` }}>
          <span>{word}</span>{" "}
        </span>
      ))}
    </p>
  )
}
