"use client"

import { useEffect, useRef, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { playScrolled } from "@/lib/sound/gsap"

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Baraja de tarjetas: cada `.hs-offer` es sticky (CSS) y, cuando llega la
 * siguiente, la de debajo se encoge y se apaga un poco, como en un mazo.
 */
export function OfferStack({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLOListElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      // En móvil sólo si la pantalla es lo bastante alta para que cada tarjeta
      // quepa entera mientras está fija (misma condición que en el CSS).
      mm.add(
        "(min-width: 901px) and (prefers-reduced-motion: no-preference), (max-width: 900px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)",
        () => {
        const cards = gsap.utils.toArray<HTMLElement>(".hs-offer", root.current)
        cards.forEach((card, index) => {
          const next = cards[index + 1]
          if (!next) return
          // Sin `filter`: una capa oscura (::after) que sólo llega al 10 %.
          gsap.fromTo(
            card,
            { scale: 1, "--dim": 0 },
            {
              scale: 0.94 + index * 0.012,
              "--dim": 0.1,
              ease: "none",
              scrollTrigger: {
                trigger: next,
                start: "top 85%",
                end: "top 25%",
                scrub: true,
                // Sonido: carta que cae sobre el mazo al llegar la siguiente.
                onEnter: (self) => playScrolled("card", self.direction),
                onLeaveBack: (self) => playScrolled("card", self.direction),
              },
            },
          )
        })
        },
      )
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <ol className={className} ref={root}>
      {children}
    </ol>
  )
}

/**
 * Titular que se «enciende» palabra a palabra con el scroll: cada palabra
 * pasa de casi transparente a opaca según cruza la pantalla.
 */
export function ScrubWords({
  parts,
  className,
  id,
}: {
  parts: { text: string; em?: boolean }[]
  className?: string
  id?: string
}) {
  const root = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          gsap.utils.toArray<HTMLElement>(".sw-word", root.current),
          { opacity: 0.14, y: 12 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 90%", end: "bottom 62%", scrub: true },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <h2 className={className} id={id} ref={root} data-reveal="off">
      {parts.map((part, partIndex) => {
        const words = part.text.split(" ").filter(Boolean)
        const content = words.map((word, index) => (
          <span key={`${partIndex}-${index}`} className="sw-word">
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        ))
        return part.em ? (
          <em key={partIndex}>
            {" "}
            {content}
          </em>
        ) : (
          <span key={partIndex}>{content}</span>
        )
      })}
    </h2>
  )
}

/**
 * Si la página cambia de alto después de medir (fotos que cargan, el libro,
 * las fuentes), los triggers se quedan desfasados. Vuelve a medir, con un
 * pequeño retraso, cada vez que cambia el alto del documento.
 */
export function ScrollRefresh() {
  useEffect(() => {
    let timer = 0
    let lastHeight = document.body.scrollHeight
    const observer = new ResizeObserver(() => {
      const height = document.body.scrollHeight
      if (Math.abs(height - lastHeight) < 2) return
      lastHeight = height
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    })
    observer.observe(document.body)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [])
  return null
}
