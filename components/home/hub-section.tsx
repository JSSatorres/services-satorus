"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { CalendarDays, FileText, MessageCircle, PhoneCall, Receipt, Users, type LucideIcon } from "lucide-react"
import { problemList, type AppModule } from "@/lib/book-content"
import { cue } from "@/lib/sound/gsap"

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * «Por eso existe Satorus»: los seis problemas aparecen como un mosaico de
 * fichas; al bajar se juntan en la «S» y vuelven a salir, ya ordenados, en
 * órbita alrededor de ella. Las mismas piezas cambian de forma: del lío a un
 * solo sitio.
 *
 * En móvil, lo mismo con el mosaico en dos columnas y la órbita en un óvalo
 * vertical. Sin JS o con movimiento reducido se ve la versión final: la «S» y
 * las fichas en una rejilla, sin fijar.
 */

/** Escritorio y móvil hacen la misma coreografía; con movimiento reducido, ninguna. */
const MOTION = {
  desktop: "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
}

const icons: Record<AppModule, LucideIcon> = {
  whatsapp: MessageCircle,
  agenda: CalendarDays,
  budgets: FileText,
  calls: PhoneCall,
  till: Receipt,
  clients: Users,
}

export function HubSection() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, (context) => {
        const { mobile } = context.conditions as { mobile: boolean }
        const q = gsap.utils.selector(root)
        const stage = q(".hub-stage")[0] as HTMLElement
        const tiles = q(".hub-tile") as HTMLElement[]
        root.current?.setAttribute("data-anim", "on")

        // Posiciones relativas al centro del escenario, recalculadas en cada refresh.
        const size = () => stage.getBoundingClientRect()
        const mosaic = (i: number) => {
          const { width, height } = size()
          if (mobile) {
            // Dos columnas y tres filas, algo montadas unas sobre otras.
            return { x: ((i % 2) - 0.5) * width * 0.52, y: (Math.floor(i / 2) - 1) * height * 0.31 }
          }
          const col = i % 3
          const row = Math.floor(i / 3)
          return { x: (col - 1) * width * 0.31, y: (row - 0.5) * height * 0.52 }
        }
        const radius = () => {
          const { width, height } = size()
          return Math.min(width * 0.36, height * 0.4)
        }
        // En móvil la pantalla es alta y estrecha: la órbita es un óvalo vertical.
        const ellipse = () => {
          const { width, height } = size()
          if (mobile) return { rx: width * 0.27, ry: Math.min(height * 0.42, width * 0.62) }
          const r = radius()
          return { rx: r * 1.25, ry: r }
        }
        const orbit = (i: number) => {
          const { rx, ry } = ellipse()
          const angle = (i / tiles.length) * Math.PI * 2 - Math.PI / 2
          return { x: Math.cos(angle) * rx, y: Math.sin(angle) * ry }
        }
        const placeRing = () => {
          const { rx, ry } = ellipse()
          gsap.set(q(".hub-ring"), { width: rx * 2, height: ry * 2 })
        }
        placeRing()

        gsap.set(tiles, {
          xPercent: -50,
          yPercent: -50,
          x: (i) => mosaic(i).x,
          y: (i) => mosaic(i).y,
          rotate: (i) => [-3, 2, -1.5, 2.5, -2, 1.5][i % 6],
        })
        gsap.set(tiles, { attr: { "data-compact": "false" } })
        gsap.set(q(".hub-core"), { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 })
        gsap.set(q(".hub-ring"), { xPercent: -50, yPercent: -50, scale: 0.4, autoAlpha: 0 })
        gsap.set(q(".hub-head--b"), { autoAlpha: 0, y: 30 })

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
            invalidateOnRefresh: true,
            onRefresh: placeRing,
          },
        })

        tl.to({}, { duration: 0.25 })
          // 1. Las fichas se juntan en el centro y aparece la «S».
          .to(tiles, { x: 0, y: 0, rotate: 0, scale: 0.3, duration: 0.8, stagger: { each: 0.04, from: "edges" } })
          .to(q(".hub-head--a"), { autoAlpha: 0, y: -30, duration: 0.4 }, "<0.2")
          .to(q(".hub-core"), { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.8)" }, "-=0.3")
          .to(tiles, { autoAlpha: 0, duration: 0.15 }, "<")
          .set(tiles, { attr: { "data-compact": "true" } })
          // 2. Salen ya ordenadas, en órbita.
          .to(q(".hub-ring"), { scale: 1, autoAlpha: 1, duration: 0.6 }, "+=0.1")
          .to(
            tiles,
            {
              x: (i) => orbit(i).x,
              y: (i) => orbit(i).y,
              scale: 1,
              autoAlpha: 1,
              duration: 0.9,
              stagger: 0.05,
              ease: "power3.out",
            },
            "<",
          )
          .to(q(".hub-head--b"), { autoAlpha: 1, y: 0, duration: 0.5 }, "<0.3")
          // 3. La órbita gira un poco mientras se termina de leer.
          .to(q(".hub-orbit"), { rotate: mobile ? 10 : 20, duration: 1, ease: "none" })
          .to(tiles, { rotate: mobile ? -10 : -20, duration: 1, ease: "none" }, "<")

        // Sonido (al final para no mover los «<» de arriba): aire al juntarse,
        // «clac» cuando aparece la S, una burbuja por ficha al salir en órbita
        // y una campana con el titular.
        const [, gather, , core, , , , orbitOut, headB] = tl.getChildren(false, true, true)
        cue(tl, gather.startTime() + 0.1, "whoosh", { volume: 0.7 })
        cue(tl, core.startTime() + 0.12, "snap")
        tiles.forEach((_, index) => cue(tl, orbitOut.startTime() + index * 0.05 + 0.08, "pop", { note: 5 + index, volume: 0.6 }))
        cue(tl, headB.startTime() + 0.2, "chime", { note: 9, volume: 0.6 })

        // La sección acaba de cambiar de alto: el resto de triggers debe volver a medir.
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
    <section className="hub" ref={root} aria-labelledby="hub-title">
      <div className="hub-sticky">
        <div className="hub-grid" aria-hidden="true" />

        <header className="hub-heads">
          <div className="hub-head hub-head--a" aria-hidden="true">
            <p className="hub-hand">tu lista de problemas</p>
            <p className="hub-headline">Seis cosas, seis sitios distintos.</p>
          </div>
          <div className="hub-head hub-head--b">
            <p className="hub-hand">por eso existe Satorus</p>
            <h2 className="hub-headline" id="hub-title">
              Todo tu negocio, <em>en un solo sitio.</em>
            </h2>
            <p className="hub-lead">
              Lo que hoy está repartido entre el móvil, una libreta y tres programas, conectado y trabajando solo.
            </p>
          </div>
        </header>

        <div className="hub-stage">
          <div className="hub-ring" aria-hidden="true" />

          <div className="hub-core" aria-hidden="true">
            <svg viewBox="0 0 48 48" focusable="false">
              <path
                d="M36.5 10.8C30.2 5.8 18.1 5.7 11.8 12.4C5.7 18.9 11.8 23.9 24 23.9C36.5 23.9 42.3 29 36.2 35.8C30.4 42.2 18 42.4 10.7 36.7"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="6.5"
              />
              <circle cx="10.7" cy="36.7" r="4.2" fill="currentColor" />
            </svg>
          </div>

          <ul className="hub-orbit">
            {problemList.map((item, index) => {
              const Icon = icons[item.module]
              return (
                <li key={item.module} className="hub-tile" data-i={index}>
                  <span className="hub-ic" aria-hidden="true">
                    <Icon size={22} strokeWidth={2.2} />
                  </span>
                  <span className="hub-name">{item.fix}</span>
                  <span className="hub-problem">{item.problem}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
