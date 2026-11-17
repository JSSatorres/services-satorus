"use client"

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react"
import gsap from "gsap"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { BookCover, leftPages, rightPages } from "@/components/book/book-pages"
import { spreads } from "@/lib/book-content"

/**
 * Cuándo pasa cada cosa dentro de la unidad de una doble página.
 * En escritorio se ven las dos páginas: se asienta la derecha, se sella la
 * izquierda y se pasa la hoja. En móvil sólo cabe una página: se lee la
 * izquierda, se sella, la cámara pasa a la derecha, se asienta y, al pasar la
 * hoja, la cámara vuelve a la izquierda siguiendo al papel.
 */
const TIMING = {
  wide: { settle: [0.02, 0.42], stamp: [0.4, 0.52], pan: [0, 0], flip: [0.64, 1], rest: 0.55 },
  narrow: { settle: [0.4, 0.6], stamp: [0.12, 0.22], pan: [0.26, 0.4], flip: [0.7, 1], rest: 0.64 },
} as const

/** Dónde descansa la página izquierda en móvil, ya asentada y sellada. */
const LEFT_END = 0.24

/**
 * Paradas: los únicos puntos en los que el cuaderno se queda quieto. `page`
 * es lo que cuenta el contador: dobles páginas en escritorio, páginas en
 * móvil (0 = portada).
 */
type Stop = { u: number; page: number }

const WIDE_STOPS: Stop[] = [
  { u: 0, page: 0 },
  ...spreads.map((_, index) => ({ u: index + 1 + TIMING.wide.rest, page: index + 1 })),
]

const NARROW_STOPS: Stop[] = [{ u: 0, page: 0 }]
for (let page = 1; page <= spreads.length * 2; page += 1) {
  const spread = Math.ceil(page / 2)
  const left = page % 2 === 1
  NARROW_STOPS.push({ u: spread + (left ? LEFT_END : TIMING.narrow.rest), page })
}

/** Doble página abierta en `u` (1-based; 0 = portada). */
function spreadAt(u: number) {
  return u < 1 ? 0 : Math.min(spreads.length, Math.floor(u))
}

/** Progreso dentro de la doble página `index` (0-based), de 0 a 1. */
function localAt(u: number, index: number) {
  return u - (index + 1)
}

/** Papeles que asoman del libro al principio: cada historia guarda uno. */
const LOOSE = [
  { kind: "postit", style: { left: "60%", top: "-6%", "--r": "-8deg", "--dx": "0", "--dy": "4em" } },
  { kind: "ticket", style: { left: "95%", top: "14%", "--r": "82deg", "--dx": "-5em", "--dy": "0" } },
  { kind: "photo", style: { left: "68%", top: "86%", "--r": "-7deg", "--dx": "0", "--dy": "-5em" } },
  { kind: "card", style: { left: "94%", top: "58%", "--r": "12deg", "--dx": "-5em", "--dy": "0" } },
  { kind: "flag", style: { left: "84%", top: "-4%", "--r": "4deg", "--dx": "0", "--dy": "3em" } },
  { kind: "letter", style: { left: "53%", top: "90%", "--r": "5deg", "--dx": "0", "--dy": "-5em" } },
] as const

/**
 * Cómo se lee el cuaderno:
 * - `wide`: escritorio. Se ven las dos páginas; un toque pasa la doble página.
 * - `narrow`: móvil en vertical. Se ve una página; un toque pasa una página.
 * - `rotate`: móvil en horizontal. Con ~390 px de alto una página tendría el
 *   texto a unos 7 px: se muestra el cuaderno cerrado y se pide girar el móvil.
 * - `off`: movimiento reducido. Páginas planas, una tras otra.
 *
 * En ningún modo el cuaderno toca el scroll de la página.
 */
type Mode = "wide" | "narrow" | "rotate" | "off"

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)"
/** Móvil tumbado: no cabe una página legible. Mismo criterio en `app/layout.tsx`. */
const LANDSCAPE_PHONE_QUERY = "(orientation: landscape) and (max-height: 500px)"
const NARROW_QUERY = "(max-width: 900px)"

function currentMode(): Mode {
  if (window.matchMedia(REDUCED_QUERY).matches) return "off"
  if (window.matchMedia(LANDSCAPE_PHONE_QUERY).matches) return "rotate"
  return window.matchMedia(NARROW_QUERY).matches ? "narrow" : "wide"
}

/** El modo cambia con la pantalla (girar el móvil, reducir movimiento). */
function subscribeMode(onChange: () => void) {
  const queries = [REDUCED_QUERY, LANDSCAPE_PHONE_QUERY, NARROW_QUERY].map((query) =>
    window.matchMedia(query),
  )
  queries.forEach((query) => query.addEventListener("change", onChange))
  return () => queries.forEach((query) => query.removeEventListener("change", onChange))
}

/** Cuánto hay que mover el dedo de lado para pasar una página. */
const SWIPE_MIN = 48

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const smooth = ([from, to]: readonly [number, number], value: number) => {
  if (to <= from) return value >= to ? 1 : 0
  const t = clamp01((value - from) / (to - from))
  return t * t * (3 - 2 * t)
}
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function isEditable(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || target.matches("input, textarea, select"))
  )
}

type Navigator = {
  /** Parada anterior / siguiente. */
  step: (direction: 1 | -1) => void
  /** Va a la parada `stop`. */
  show: (stop: number) => void
  /** Abre la doble página `index` (1-based; 0 = portada). */
  goTo: (index: number, immediate?: boolean) => void
}

/**
 * El cuaderno del home: el antes («Así está tu mesa hoy») y el después («Tu
 * lista, convertida en una app») de un negocio.
 *
 * Entra cerrado y se abre solo cuando llega a la pantalla. A partir de ahí lo
 * maneja el visitante: un botón, un toque en la hoja, deslizar de lado o las
 * flechas del teclado pasan la página, y la animación se reproduce a su ritmo.
 * El scroll de la página no interviene: se puede seguir bajando en cualquier
 * momento.
 *
 * Todo el estado sale de una sola cifra (`u`): 0 cerrado, 1 abierto por la
 * primera doble página, 2 por la segunda. Sin `html[data-book="on"]` el
 * cuaderno se pinta como páginas planas, ya pasadas a limpio.
 */
export function Book() {
  const trackRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const bookRef = useRef<HTMLDivElement>(null)
  const pagesRef = useRef<HTMLDivElement>(null)
  const leafRefs = useRef<(HTMLDivElement | null)[]>([])
  const baseRef = useRef<HTMLDivElement>(null)
  const looseRefs = useRef<(HTMLSpanElement | null)[]>([])
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const leftBoardRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<Navigator | null>(null)
  /** Doble página leída: al girar el móvil y volver, se sigue por ella. */
  const savedSpreadRef = useRef(0)
  const mode = useSyncExternalStore<Mode>(subscribeMode, currentMode, () => "off")
  const [stop, setStop] = useState(0)

  // La marca en `<html>` activa el CSS del libro. El script previo al pintado
  // de `app/layout.tsx` la pone en la primera carga; aquí se mantiene al día
  // (navegación interna, girar el móvil) antes de pintar.
  useLayoutEffect(() => {
    if (mode === "off") delete document.documentElement.dataset.book
    else document.documentElement.dataset.book = mode === "rotate" ? "rotate" : "on"
  }, [mode])

  useEffect(() => {
    if (mode === "off" || mode === "rotate") return
    const track = trackRef.current
    const stage = stageRef.current
    const book = bookRef.current
    const pages = pagesRef.current
    if (!track || !stage || !book || !pages) return

    const leftBoard = leftBoardRef.current
    const baseNode = baseRef.current
    const leaves = [...leafRefs.current]
    const loose = [...looseRefs.current]
    const tabs = [...tabRefs.current]

    const narrow = mode === "narrow"
    const timing = narrow ? TIMING.narrow : TIMING.wide
    const stops = narrow ? NARROW_STOPS : WIDE_STOPS
    const lastStop = stops.length - 1
    /** Primera parada de la doble página `index` (1-based). */
    const stopOfSpread = (index: number) =>
      index <= 0 ? 0 : Math.min(lastStop, narrow ? index * 2 - 1 : index)

    let pageWidth = pages.offsetWidth / 2
    let frame = 0
    let lastVisible = ""

    const state = { u: 0, stop: 0 }
    let tween: gsap.core.Tween | null = null

    const render = () => {
      frame = 0
      const u = state.u

      // Abrir el libro, en dos tiempos. Primero el libro cerrado, centrado,
      // se desliza a su sitio (la portada pasa a ocupar la mitad derecha) y
      // se suelta la goma. Después la portada gira y el libro se endereza.
      const slide = easeInOut(smooth([0, 0.4], u))
      const band = smooth([0.08, 0.4], u)
      const cover = smooth([0.4, 1], u)
      const open = easeInOut(cover)
      // La tapa y el bloque de hojas de la izquierda sólo existen cuando la
      // portada ya se ha posado: mientras gira, a la izquierda no hay nada.
      const landed = smooth([0.9, 1], cover)
      const flips = [cover]
      const settles: number[] = []
      // En móvil la izquierda se lee antes de pasar a la derecha: se asienta
      // mientras está a la vista, no cuando la cámara ya se ha ido.
      const leftSettles: number[] = []
      const stamps: number[] = []
      spreads.forEach((_, index) => {
        const local = localAt(u, index)
        settles.push(smooth(timing.settle, local))
        leftSettles.push(narrow ? smooth([0.02, 0.2], local) : settles[index])
        stamps.push(smooth(timing.stamp, local))
        if (index < spreads.length - 1) flips.push(smooth(timing.flip, local))
      })

      // Hojas: giro y orden de apilado. Sin girar, la primera encima; ya
      // giradas, la última girada encima.
      flips.forEach((flip, index) => {
        const leaf = leafRefs.current[index]
        if (!leaf) return
        leaf.style.setProperty("--flip", flip.toFixed(4))
        leaf.style.zIndex = String(flip < 0.5 ? 40 - index : 50 + index)
      })
      leafRefs.current[0]?.style.setProperty("--band", band.toFixed(4))

      // Cada cara recibe el progreso de su doble página.
      leafRefs.current.forEach((leaf, index) => {
        const back = leaf?.querySelector<HTMLElement>(".bk-face--back")
        const front = leaf?.querySelector<HTMLElement>(".bk-face--front")
        back?.style.setProperty("--st", stamps[index].toFixed(4))
        // La izquierda también sabe cuánto se ha ordenado la derecha: la
        // lista de problemas se tacha a la vez.
        back?.style.setProperty("--s", leftSettles[index].toFixed(4))
        if (index > 0) front?.style.setProperty("--s", settles[index - 1].toFixed(4))
      })
      baseRef.current?.style.setProperty("--s", settles[spreads.length - 1].toFixed(4))

      // Los papeles sueltos se reparten entre las historias.
      looseRefs.current.forEach((paper, index) => {
        const spread = Math.floor((index * spreads.length) / LOOSE.length)
        paper?.style.setProperty("--t", settles[spread].toFixed(4))
      })
      tabRefs.current.forEach((tab, index) => {
        tab?.style.setProperty("--t", settles[index].toFixed(4))
      })
      leftBoardRef.current?.style.setProperty("opacity", landed.toFixed(3))
      pages.style.setProperty("--open", landed.toFixed(3))

      // Cámara: qué parte del libro queda centrada. Cerrado, la portada
      // (media anchura del libro) ocupa el centro de la escena.
      let offset: number
      if (narrow) {
        let viewRight: number
        if (u < 1) {
          viewRight = 1 - cover
        } else {
          const k = spreadAt(u)
          const flip = k < spreads.length ? flips[k] : 0
          viewRight = smooth(timing.pan, localAt(u, k - 1)) * (1 - flip)
        }
        offset = pageWidth / 2 - viewRight * pageWidth
      } else {
        offset = lerp(-pageWidth / 2, 0, slide)
      }
      const bump = flips.slice(1).reduce((sum, flip) => sum + Math.sin(Math.PI * flip), 0)
      const tilt = lerp(lerp(narrow ? 30 : 36, narrow ? 30 : 24, slide), narrow ? 4 : 7, open) + bump * 4
      const turn = lerp(lerp(-9, -4, slide), 0, open)
      const scale = lerp(narrow ? 0.82 : 0.98, 1, open)
      // El desplazamiento se mide en páginas a tamaño real; el libro cerrado
      // está a escala, así que la cámara se mueve lo mismo de escalado.
      offset *= scale
      book.style.transform = `translate3d(${offset.toFixed(1)}px, 0, 0) rotateX(${tilt.toFixed(2)}deg) rotateZ(${turn.toFixed(2)}deg) scale(${scale.toFixed(3)})`

      // Sólo las dos caras abiertas admiten foco: el resto está debajo.
      const flipped = flips.filter((flip) => flip >= 0.5).length
      const visible = `${flipped}`
      if (visible !== lastVisible) {
        lastVisible = visible
        leafRefs.current.forEach((leaf, index) => {
          const back = leaf?.querySelector<HTMLElement>(".bk-face--back")
          const front = leaf?.querySelector<HTMLElement>(".bk-face--front")
          if (back) back.inert = index !== flipped - 1
          if (front) front.inert = index !== flipped
        })
        if (baseRef.current) baseRef.current.inert = flipped !== flips.length
      }
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render)
    }

    /** Lleva el cuaderno a la parada `target`, animando lo que hay entre medias. */
    const show = (target: number, immediate = false) => {
      const next = Math.max(0, Math.min(lastStop, target))
      const distance = Math.abs(stops[next].u - state.u)
      state.stop = next
      savedSpreadRef.current = spreadAt(stops[next].u)
      setStop(next)
      tween?.kill()
      tween = gsap.to(state, {
        u: stops[next].u,
        duration: immediate ? 0 : Math.min(2, 0.6 + distance * 1.5),
        ease: "power2.inOut",
        onUpdate: schedule,
      })
      schedule()
    }

    navRef.current = {
      step: (direction) => show(state.stop + direction),
      show: (target) => show(target),
      goTo: (index, immediate = false) => show(stopOfSpread(index), immediate),
    }

    // Se abre solo, una vez, cuando el cuaderno ya ocupa buena parte de la
    // pantalla. Después manda el visitante.
    let opened = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (opened || !entry.isIntersecting) return
        opened = true
        observer.disconnect()
        if (state.stop === 0) show(1)
      },
      { threshold: 0.55 },
    )

    // Tocar la hoja pasa la página (los enlaces y botones siguen siendo suyos).
    const onBookClick = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest?.("a, button")) return
      if (window.getSelection()?.toString()) return
      if (state.stop < lastStop) show(state.stop + 1)
    }

    // Deslizar de lado también. El gesto vertical es del scroll de la página.
    let touch: { x: number; y: number } | null = null
    const onTouchStart = (event: TouchEvent) => {
      touch =
        event.touches.length === 1
          ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
          : null
    }
    const onTouchEnd = (event: TouchEvent) => {
      if (!touch) return
      const end = event.changedTouches[0]
      const dx = end.clientX - touch.x
      const dy = end.clientY - touch.y
      touch = null
      if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 1.5) return
      show(state.stop + (dx < 0 ? 1 : -1))
    }

    const onResize = () => {
      pageWidth = pages.offsetWidth / 2
      schedule()
    }

    // Entrada con `/#tu-app`, o vuelta de horizontal: abierto por su página.
    const hashIndex = spreads.findIndex((spread) => spread.id === window.location.hash.slice(1))
    const startSpread = hashIndex >= 0 ? hashIndex + 1 : savedSpreadRef.current
    if (startSpread > 0) {
      opened = true
      show(stopOfSpread(startSpread), true)
    } else {
      render()
      observer.observe(stage)
    }

    window.addEventListener("resize", onResize)
    book.addEventListener("click", onBookClick)
    book.addEventListener("touchstart", onTouchStart, { passive: true })
    book.addEventListener("touchend", onTouchEnd, { passive: true })

    return () => {
      window.cancelAnimationFrame(frame)
      tween?.kill()
      observer.disconnect()
      navRef.current = null
      window.removeEventListener("resize", onResize)
      book.removeEventListener("click", onBookClick)
      book.removeEventListener("touchstart", onTouchStart)
      book.removeEventListener("touchend", onTouchEnd)

      // Al cambiar de modo (girar el móvil) no puede quedar nada del anterior:
      // el libro plano no lleva giros, transformaciones ni caras inertes.
      book.style.removeProperty("transform")
      pages.style.removeProperty("--open")
      leftBoard?.style.removeProperty("opacity")
      leaves.forEach((leaf) => {
        leaf?.removeAttribute("style")
        leaf?.querySelectorAll<HTMLElement>(".bk-face").forEach((face) => {
          face.removeAttribute("style")
          face.inert = false
        })
      })
      if (baseNode) {
        baseNode.removeAttribute("style")
        baseNode.inert = false
      }
      loose.forEach((paper) => paper?.style.removeProperty("--t"))
      tabs.forEach((tab) => tab?.style.removeProperty("--t"))
      setStop(0)
    }
  }, [mode])

  // Flechas del teclado, con el cuaderno en pantalla.
  useEffect(() => {
    if (mode === "off" || mode === "rotate") return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
      if (isEditable(event.target)) return
      const rect = stageRef.current?.getBoundingClientRect()
      if (!rect || rect.bottom < window.innerHeight * 0.5 || rect.top > window.innerHeight * 0.5) return
      event.preventDefault()
      navRef.current?.step(event.key === "ArrowRight" ? 1 : -1)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [mode])

  const narrow = mode === "narrow"
  const stops = narrow ? NARROW_STOPS : WIDE_STOPS
  const lastStop = stops.length - 1
  const safeStop = Math.min(stop, lastStop)
  const page = stops[safeStop].page
  const total = stops[lastStop].page
  const spreadShown = spreadAt(stops[safeStop].u)
  const atEnd = safeStop >= lastStop

  let nextLabel = "Pasar página"
  if (safeStop === 0) nextLabel = "Abrir el cuaderno"
  else if (atEnd) nextLabel = "Volver a empezar"
  else if (spreadAt(stops[safeStop + 1].u) > spreadShown) nextLabel = "Ver cómo queda"

  return (
    <section className="bk bk--tap" ref={trackRef} aria-labelledby="cuaderno-title">
      <header className="bk-head">
        <div>
          <p className="hs-kicker">
            <span>El cuaderno de tu negocio</span>
          </p>
          <h2 className="hs-title" id="cuaderno-title">
            Del lío de hoy a una herramienta hecha para ti.
          </h2>
        </div>
        <p className="hs-lead">Toca la hoja o el botón naranja para pasar la página y ver cómo queda.</p>
      </header>

      {/* Móvil en horizontal: no cabe una página legible. */}
      <div className="bk-rotate" aria-live="polite">
        <div className="bk-rotate-book" aria-hidden="true">
          <BookCover />
        </div>
        <div className="bk-rotate-copy">
          <p className="bk-rotate-title">Gira el móvil para leer el cuaderno</p>
          <p>El cuaderno de tu negocio se lee en vertical, página a página.</p>
          <p className="bk-rotate-hint">O sigue bajando: cómo trabajamos y contacto ↓</p>
        </div>
      </div>

      <div className="bk-stage" ref={stageRef}>
        <div className="bk-scene">
          <div className="bk-book" ref={bookRef}>
            <div className="bk-board bk-board--right" aria-hidden="true" />
            <div className="bk-board bk-board--left" ref={leftBoardRef} aria-hidden="true" />

            <div className="bk-pages" ref={pagesRef}>
              {LOOSE.map((paper, index) => (
                <span
                  className="bk-loose"
                  data-kind={paper.kind}
                  key={paper.kind}
                  ref={(element) => {
                    looseRefs.current[index] = element
                  }}
                  style={paper.style as CSSProperties}
                  aria-hidden="true"
                />
              ))}

              <nav className="bk-tabs" aria-label="Páginas del cuaderno">
                {spreads.map((spread, index) => (
                  <a
                    key={spread.id}
                    href={`#${spread.id}`}
                    data-tone={index % 3}
                    aria-current={spreadShown === index + 1 ? "page" : undefined}
                    ref={(element) => {
                      tabRefs.current[index] = element
                    }}
                    style={{ top: `${6 + index * 15}%` } as CSSProperties}
                    onClick={(event) => {
                      if (!navRef.current) return
                      event.preventDefault()
                      navRef.current.goTo(index + 1)
                    }}
                  >
                    {spread.tab}
                  </a>
                ))}
              </nav>

              {spreads.map((spread, index) => (
                <div
                  className="bk-leaf"
                  key={spread.id}
                  ref={(element) => {
                    leafRefs.current[index] = element
                  }}
                >
                  <div className="bk-face bk-face--front" data-side={index === 0 ? "cover" : "right"}>
                    {index === 0 ? <BookCover /> : rightPages[index - 1]}
                  </div>
                  <div className="bk-face bk-face--back" data-side="left" id={spread.id}>
                    {leftPages[index]}
                  </div>
                </div>
              ))}

              {/* Después de las hojas: en el libro plano el orden del DOM es
                  el de lectura (portada, 1 izq., 1 der., 2 izq., …). */}
              <div className="bk-face bk-face--base" ref={baseRef} data-side="right">
                {rightPages[spreads.length - 1]}
              </div>
            </div>
          </div>
        </div>

        <div className="bk-controls">
          <button
            type="button"
            onClick={() => navRef.current?.step(-1)}
            disabled={safeStop <= 0}
            aria-label="Página anterior"
          >
            <ArrowLeft aria-hidden="true" size={20} />
          </button>
          <p aria-live="polite">
            <b>{page === 0 ? "Portada" : `${page} / ${total}`}</b>
            {spreadShown > 0 ? (
              <span className="bk-controls-label"> {spreads[spreadShown - 1].tab}</span>
            ) : null}
          </p>
          <button
            type="button"
            className="bk-next"
            onClick={() => (atEnd ? navRef.current?.show(1) : navRef.current?.step(1))}
          >
            {nextLabel}
            <ArrowRight aria-hidden="true" size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
