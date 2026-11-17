"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { ArrowRight } from "lucide-react"
import { BackdropVideo } from "@/components/home/backdrop-video"

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Entrada del home. Primero la marca a todo el ancho con el vídeo de la mesa
 * dentro de las letras y la ruta naranja cruzándolas; al bajar, la cámara se
 * mete en el punto naranja, que llena la pantalla y se abre al vídeo. Entonces la sección se queda fija
 * mientras el paréntesis del titular se abre y se llena, una a una,
 * de las cosas que tiran de un negocio a lo largo del día. Al final todo se
 * aspira hacia el centro, donde la sección siguiente lo recoge en la «S».
 *
 * En móvil es la misma coreografía con la maqueta en columna (el paréntesis
 * más estrecho y las letras a lo ancho). Sin JS o con movimiento reducido se
 * ve ya terminada y sin fijar.
 */

/** Escritorio y móvil hacen la misma coreografía; con movimiento reducido, ninguna. */
const MOTION = {
  desktop: "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
}

type Chip = { text: string; tone?: "chat" | "note" | "alert" }

const chips: Chip[] = [
  { text: "¿Sigue disponible?", tone: "chat" },
  { text: "3 llamadas perdidas", tone: "alert" },
  { text: "¡¡llamar a Marta!!", tone: "note" },
  { text: "¿Me confirmas la hora?", tone: "chat" },
  { text: "Presupuesto n.º 631 · borrador" },
  { text: "2 citas a las 10:00", tone: "alert" },
  { text: "¿pedido de Luis?", tone: "note" },
  { text: "Hola??", tone: "chat" },
  { text: "clientes_v4_FINAL.xlsx" },
  { text: "¿ticket del día 3?", tone: "note" },
  { text: "Vale, lo miro en otro sitio", tone: "chat" },
  { text: "Contestar reseñas", tone: "alert" },
]

/** «satorus» letra a letra (la «o» sirve de punto de entrada del zoom) y el punto. */
function Wordmark() {
  return (
    <span className="ns-wordmark" translate="no">
      {"satorus".split("").map((letter, index) => (
        <span key={index} className={letter === "o" ? "ns-l ns-o" : "ns-l"}>
          {letter}
        </span>
      ))}
      <span className="ns-dot" />
    </span>
  )
}

export function NoiseSection() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION, (context) => {
        const { desktop } = context.conditions as { desktop: boolean }
        const q = gsap.utils.selector(root)
        const chipEls = q(".ns-chip")

        gsap.set(q(".ns-paren"), { "--open": 0, autoAlpha: 0 })
        gsap.set(chipEls, { autoAlpha: 0, scale: 0.4, y: 24 })
        gsap.set(q(".ns-side"), { autoAlpha: 0, y: 40 })
        gsap.set(q(".ns-after"), { autoAlpha: 0, y: 20 })

        // Entrada: la marca a todo el ancho con el vídeo dentro de las letras.
        // Al bajar, la cámara se mete en el punto naranja hasta llenar la
        // pantalla; se abre al vídeo y empieza «Demasiadas cosas…».
        const brands = q(".ns-brand") as HTMLElement[]
        const dot = q(".ns-brand--top .ns-dot")[0] as HTMLElement | undefined
        // Por posiciones de maqueta (offset*), no por las cajas en pantalla: las
        // letras aún pueden estar subiendo con su animación de entrada.
        // Centro del punto en coordenadas de la marca (por maqueta, sin
        // transformaciones: las letras aún pueden estar animándose).
        const dotCenter = () => {
          if (!dot) return { x: window.innerWidth / 2, y: window.innerHeight / 2 }
          let x = dot.offsetWidth / 2
          let y = dot.offsetHeight / 2
          let node: HTMLElement | null = dot
          while (node && !node.classList.contains("ns-brand")) {
            x += node.offsetLeft
            y += node.offsetTop
            node = node.offsetParent as HTMLElement | null
          }
          return { x, y }
        }
        const origin = () => `${dotCenter().x}px ${dotCenter().y}px`
        // El naranja se abre como un círculo recortado desde el punto: nada de
        // escalar capas enormes (a 70× la GPU se queda sin memoria y deja la
        // pantalla en blanco al volver arriba).
        const burst = (radius: number) => () => {
          const { x, y } = dotCenter()
          const r = radius || Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 40
          return `circle(${r}px at ${x}px ${y}px)`
        }
        gsap.set(q(".ns-veil"), { autoAlpha: 0 })
        gsap.set(q(".ns-video"), { filter: "blur(0px)" })

        // Las manchas del fondo siguen un poco al ratón (suavizado).
        const mesh = q(".ns-mesh")[0] as HTMLElement | undefined
        const toX = mesh ? gsap.quickTo(mesh, "--mx", { duration: 1.4, ease: "power3.out" }) : null
        const toY = mesh ? gsap.quickTo(mesh, "--my", { duration: 1.4, ease: "power3.out" }) : null
        const onPointer = (event: PointerEvent) => {
          toX?.((event.clientX / window.innerWidth - 0.5) * 2)
          toY?.((event.clientY / window.innerHeight - 0.5) * 2)
        }
        if (desktop) window.addEventListener("pointermove", onPointer, { passive: true })

        const intro = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=110%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        intro
          .to(q(".ns-intro-fade"), { autoAlpha: 0, y: -40, duration: 0.25, stagger: 0.03, ease: "power1.in" })
          .fromTo(
            brands,
            { scale: 1, transformOrigin: origin },
            { scale: 4, transformOrigin: origin, duration: 0.7, ease: "power2.in" },
            0,
          )
          .fromTo(
            q(".ns-burst"),
            { clipPath: burst(1) },
            { clipPath: burst(0), duration: 0.45, ease: "power2.in" },
            0.35,
          )
          .set(brands, { autoAlpha: 0 }, 0.8)
          .set(q(".ns-veil"), { autoAlpha: 1 }, 0.8)
          .set(q(".ns-video"), { filter: "blur(10px)" }, 0.8)
          .to(q(".ns-burst"), { autoAlpha: 0, duration: 0.2, ease: "power1.inOut" }, 0.85)

        // El vídeo del fondo se acerca despacio mientras dura la sección.
        gsap.fromTo(
          q(".ns-video"),
          { scale: 1.08 },
          {
            scale: 1.3,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          },
        )

        // Al salir, la tarjeta se recoge como un telón y deja paso al papel.
        gsap.fromTo(
          q(".ns-card"),
          { borderRadius: "0px 0px 0px 0px", scale: 1 },
          {
            borderRadius: "0px 0px 48px 48px",
            scale: 0.92,
            ease: "none",
            immediateRender: false,
            scrollTrigger: { trigger: root.current, start: "bottom bottom", end: "bottom top", scrub: true },
          },
        )

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: root.current,
            start: () => `top+=${window.innerHeight * 1.05} top`,
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })

        tl.to(q(".ns-side"), { autoAlpha: 1, y: 0, stagger: 0.15, duration: 0.5 })
          .to(q(".ns-paren"), { "--open": 1, autoAlpha: 1, duration: 0.6, ease: "power3.inOut" }, "<0.2")
          .to(chipEls, { autoAlpha: 1, scale: 1, y: 0, duration: 0.35, stagger: 0.18, ease: "back.out(2)" }, "<0.3")
          .to({}, { duration: 0.6 })
          // Todo se aspira hacia el centro: la sección siguiente lo ordena.
          .to(chipEls, {
            x: (_, el: HTMLElement) => {
              const box = el.getBoundingClientRect()
              return window.innerWidth / 2 - (box.left + box.width / 2)
            },
            y: (_, el: HTMLElement) => {
              const box = el.getBoundingClientRect()
              return window.innerHeight * 0.95 - (box.top + box.height / 2)
            },
            scale: 0.2,
            autoAlpha: 0,
            rotate: () => gsap.utils.random(-40, 40),
            duration: 0.7,
            stagger: { each: 0.03, from: "random" },
            ease: "power3.in",
          })
          .to(q(".ns-paren"), { "--open": 0, duration: 0.4, ease: "power3.inOut" }, "<0.3")
          .to(q(".ns-side"), { autoAlpha: 0, y: -30, duration: 0.4 }, "<")
          .to(q(".ns-after"), { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.2")

        return () => window.removeEventListener("pointermove", onPointer)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section className="ns" id="inicio" ref={root} aria-labelledby="ns-title">
      <div className="ns-sticky">
        <div className="ns-card">
          <BackdropVideo className="ns-video" />
          <div className="ns-veil" aria-hidden="true" />

          {/* Entrada. Tres capas con la misma marca, alineadas al píxel:
              1) «trama» (screen): fondo blanco y letras negras → el vídeo sólo
                 se ve dentro de las letras;
              2) «multiplicar»: fondo lima y letras blancas → pinta el fondo de
                 lima sin teñir el vídeo de las letras;
              3) arriba, transparente: el titular accesible y el punto naranja. */}
          <div className="ns-hero">
            <div className="ns-brand ns-brand--blend" aria-hidden="true">
              <Wordmark />
            </div>
            <div className="ns-brand ns-brand--tint" aria-hidden="true">
              <span className="ns-mesh">
                <i className="ns-blob ns-blob--lime" />
                <i className="ns-blob ns-blob--lav" />
                <i className="ns-blob ns-blob--peach" />
                <i className="ns-blob ns-blob--blue" />
                <i className="ns-grain" />
              </span>
              <Wordmark />
            </div>
            <h1 className="ns-brand ns-brand--top">
              <Wordmark />
              <span className="sr-only"> · Webs, apps e inteligencia artificial para pymes en Granada</span>
            </h1>

            <div className="ns-burst" aria-hidden="true" />

            <svg className="ns-route ns-intro-fade" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
              <path d="M-20 300C140 300 210 120 380 150S560 330 760 280 1000 60 1160 120 1330 290 1460 230" pathLength={1} />
            </svg>

            <div className="ns-bottom">
              <p className="ns-tagline ns-intro-fade">
                Ponemos orden en lo que hoy <em>tira de tu negocio.</em>
              </p>
              <div className="ns-bottom-side ns-intro-fade">
                <a className="hv-cta" href="#contacto">
                  Hablemos de tu negocio
                  <ArrowRight aria-hidden="true" size={22} strokeWidth={2.2} />
                </a>
                <span className="ns-cue" aria-hidden="true">
                  <span /> Baja
                </span>
              </div>
            </div>
          </div>
          <h2 className="ns-title" id="ns-title">
            <span className="ns-side ns-side--a">Demasiadas cosas tirando de ti</span>
            <span className="ns-paren" aria-hidden="true">
              <span className="ns-brace">(</span>
              <span className="ns-chips">
                {chips.map((chip) => (
                  <span key={chip.text} className="ns-chip" data-tone={chip.tone}>
                    {chip.text}
                  </span>
                ))}
              </span>
              <span className="ns-brace">)</span>
            </span>
            <span className="ns-side ns-side--b">
              <span className="ns-line">lejos de lo</span>{" "}
              <span className="ns-line">que importa:</span>{" "}
              <span className="ns-line">
                <em>tu negocio.</em>
              </span>
            </span>
          </h2>
          <ul className="sr-only">
            {chips.map((chip) => (
              <li key={chip.text}>{chip.text}</li>
            ))}
          </ul>
          <p className="ns-after">
            <span>¿Te suena?</span> Vamos a ordenarlo.
          </p>
        </div>
      </div>
    </section>
  )
}
