"use client"

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { useHydratedReducedMotion } from "@/components/use-hydrated-reduced-motion"

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* ------------------------------------------------------ Mosaico Enrolla2 */

const M = "/projects/enrolla2/mosaic"

/** Cada hueco del mosaico va pasando por varias capturas reales de la web. */
const slots = [
  {
    area: "main",
    every: 4200,
    shots: [
      { src: `${M}/main-rolls.webp`, alt: "Galería de rolls en arco de la web de Enrolla2: «Mucho rollo, desde todos los ángulos»" },
      { src: `${M}/main-helados.webp`, alt: "Sección de helados y smoothies de la web de Enrolla2 con dos vídeos en vertical" },
      { src: `${M}/main-resenas.webp`, alt: "Reseña de Google de cinco estrellas en la web de Enrolla2" },
    ],
  },
  {
    area: "phone",
    every: 3600,
    shots: [
      { src: `${M}/m-hero.webp`, alt: "Portada de Enrolla2 en el móvil" },
      { src: `${M}/m-carta.webp`, alt: "La carta de Enrolla2 en el móvil" },
      { src: `${M}/m-promo.webp`, alt: "Promociones de Enrolla2 en el móvil" },
    ],
  },
  {
    area: "a",
    every: 3900,
    shots: [
      { src: `${M}/sm-carta.webp`, alt: "La carta de Enrolla2 como un libro que se pasa" },
      { src: `${M}/sm-encargos.webp`, alt: "Encargos de Enrolla2 en tres pasos: elige la fecha, crea tu caja y recoge" },
    ],
  },
  {
    area: "b",
    every: 4600,
    shots: [
      { src: `${M}/sm-happy.webp`, alt: "Promoción Happy Hour de Enrolla2: todos los rolls a 3,50 €" },
      { src: `${M}/sm-boxday.webp`, alt: "Promoción Box Day de Enrolla2: 3x4 los domingos" },
    ],
  },
] as const

function MosaicTile({ slot, active }: { slot: (typeof slots)[number]; active: boolean }) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (!active) return
    const id = window.setInterval(() => setIndex((value) => (value + 1) % slot.shots.length), slot.every)
    return () => window.clearInterval(id)
  }, [active, slot])

  return (
    <figure className="mz-tile" data-area={slot.area}>
      {slot.shots.map((shot, shotIndex) => (
        <Image
          key={shot.src}
          src={shot.src}
          alt={shotIndex === index ? shot.alt : ""}
          aria-hidden={shotIndex === index ? undefined : true}
          fill
          sizes={slot.area === "phone" ? "12rem" : "(max-width: 900px) 92vw, 30vw"}
          data-on={shotIndex === index || undefined}
        />
      ))}
      <span className="mz-dots" aria-hidden="true">
        {slot.shots.map((shot, shotIndex) => (
          <i key={shot.src} data-on={shotIndex === index || undefined} />
        ))}
      </span>
    </figure>
  )
}

/**
 * Mosaico de capturas reales de enrolla2.com: portada grande, un móvil y dos
 * secciones. Cada hueco va cambiando de captura solo; al bajar, las piezas se
 * desplazan a distinto ritmo (paralaje) y al pasar el ratón se levantan.
 */
export function Enrolla2Mosaic() {
  const root = useRef<HTMLDivElement>(null)
  const reduce = useHydratedReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tiles = gsap.utils.toArray<HTMLElement>(".mz-tile", root.current)
        tiles.forEach((tile, index) => {
          const depth = [-30, 50, 25, -15][index] ?? 0
          gsap.fromTo(
            tile,
            { y: depth },
            {
              y: -depth,
              ease: "none",
              scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
            },
          )
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div className="mz" ref={root}>
      {slots.map((slot) => (
        <MosaicTile key={slot.area} slot={slot} active={visible && !reduce} />
      ))}
    </div>
  )
}

/* -------------------------------------------- Ver todos los proyectos */

const previews = [
  { src: "/projects/sportapp/panel-2026.webp", alt: "" },
  { src: "/products/lector-bilingue/reading-tablet-desktop.webp", alt: "" },
  { src: "/projects/angel-mendoza/site-desktop.png", alt: "" },
  { src: "/projects/pidoteca/table-status-dashboard.png", alt: "" },
]

/**
 * Llamada grande a la página de proyectos. La flecha sigue al ratón dentro de
 * la tarjeta (imán), al pasar por encima se abren en abanico vistas de otros
 * proyectos y el texto corre como una cinta (en táctil, al entrar en pantalla). Al pulsar, un círculo naranja
 * crece desde el punto del clic hasta cubrir la pantalla y entonces navega.
 */
export function ProjectsCta({ href = "/productos" }: { href?: string }) {
  const router = useRouter()
  const reduce = useHydratedReducedMotion()
  const root = useRef<HTMLAnchorElement>(null)
  const arrow = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    router.prefetch(href)
  }, [router, href])

  // Sin ratón (móvil, tableta) no hay hover: la tarjeta se enciende sola
  // mientras está bien a la vista, con el mismo abanico, cinta y flecha.
  useEffect(() => {
    const element = root.current
    if (!element || reduce || !window.matchMedia("(hover: none)").matches) return
    const observer = new IntersectionObserver(
      ([entry]) => element.toggleAttribute("data-live", entry.isIntersecting),
      { threshold: 0.75 },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      element.removeAttribute("data-live")
    }
  }, [reduce])

  const onMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reduce || !arrow.current || !root.current) return
    const box = root.current.getBoundingClientRect()
    const x = event.clientX - box.left - box.width / 2
    const y = event.clientY - box.top - box.height / 2
    gsap.to(arrow.current, { x: x * 0.18, y: y * 0.35, rotate: x * 0.03, duration: 0.6, ease: "power3.out" })
  }
  const onLeave = () => {
    if (arrow.current) gsap.to(arrow.current, { x: 0, y: 0, rotate: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" })
  }

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reduce || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    const veil = document.createElement("div")
    veil.className = "pc-veil"
    veil.style.setProperty("--x", `${event.clientX}px`)
    veil.style.setProperty("--y", `${event.clientY}px`)
    veil.innerHTML = '<span class="pc-veil-label">Proyectos</span>'
    document.body.appendChild(veil)
    const radius = Math.hypot(window.innerWidth, window.innerHeight)
    gsap
      .timeline({ onComplete: () => router.push(href) })
      .fromTo(veil, { clipPath: `circle(0px at ${event.clientX}px ${event.clientY}px)` }, {
        clipPath: `circle(${radius}px at ${event.clientX}px ${event.clientY}px)`,
        duration: 0.75,
        ease: "power3.inOut",
      })
      .fromTo(veil.firstElementChild, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35 }, "-=0.3")
    // Al llegar a la otra página el velo se retira solo.
    window.setTimeout(() => {
      gsap.to(veil, { autoAlpha: 0, duration: 0.5, onComplete: () => veil.remove() })
    }, 2600)
  }

  return (
    <a className="pc" href={href} ref={root} onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}>
      <span className="pc-fan" aria-hidden="true">
        {previews.map((preview, index) => (
          <span key={preview.src} className="pc-card" style={{ "--n": index } as CSSProperties}>
            <Image src={preview.src} alt="" fill sizes="10rem" />
          </span>
        ))}
      </span>
      <span className="pc-copy">
        <span className="pc-kicker">y muchos más</span>
        <span className="pc-title">Ver todos los proyectos</span>
      </span>
      <span className="pc-marquee" aria-hidden="true">
        <span>
          Webs · Apps · Programas de gestión · IA · Webs · Apps · Programas de gestión · IA ·&nbsp;
        </span>
        <span>
          Webs · Apps · Programas de gestión · IA · Webs · Apps · Programas de gestión · IA ·&nbsp;
        </span>
      </span>
      <span className="pc-arrow" ref={arrow} aria-hidden="true">
        <ArrowUpRight size={34} strokeWidth={2.2} />
      </span>
    </a>
  )
}
