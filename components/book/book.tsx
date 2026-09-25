"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { BookCover, leftPages, rightPages } from "@/components/book/book-pages"
import { getLenis } from "@/lib/lenis"
import { BOOK_SPREAD_EVENT, spreads } from "@/lib/book-content"

/** Tramos del recorrido: abrir el libro (1) y una unidad por doble página. */
const UNITS = spreads.length + 1

/**
 * Cuándo pasa cada cosa dentro de la unidad de una doble página.
 * En escritorio se ven las dos páginas: se asienta la derecha, se sella la
 * izquierda y se pasa la hoja. En móvil sólo cabe una página: se lee la
 * izquierda, se sella, la cámara pasa a la derecha, se asienta y, al pasar la
 * hoja, la cámara vuelve a la izquierda siguiendo al papel.
 */
const TIMING = {
  desktop: { settle: [0.02, 0.42], stamp: [0.4, 0.52], pan: [0, 0], flip: [0.64, 1], rest: 0.55 },
  mobile: { settle: [0.4, 0.6], stamp: [0.12, 0.22], pan: [0.26, 0.4], flip: [0.7, 1], rest: 0.64 },
} as const

function timingFor(mobile: boolean) {
  return mobile ? TIMING.mobile : TIMING.desktop
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

/**
 * El home como libro. Al principio está cerrado sobre la mesa, en
 * perspectiva y lleno de papeles que asoman. El scroll lo abre y pasa las
 * hojas: en cada doble página la derecha se asienta en orden, la izquierda
 * queda sellada como «arreglado por Satorus», un papel suelto se guarda y sale una
 * pestaña en el canto. Al final el libro está limpio y con sus pestañas.
 *
 * Todo el estado sale de una sola cifra (`u`, de 0 a `UNITS`) calculada a
 * partir del scroll, así que avanzar y retroceder son el mismo cálculo. Sin
 * `html[data-book="on"]` (sin JS o con movimiento reducido) el libro se pinta
 * como una sucesión de dobles páginas planas, ya pasadas a limpio.
 */
export function Book() {
  const trackRef = useRef<HTMLElement>(null)
  const bookRef = useRef<HTMLDivElement>(null)
  const pagesRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLParagraphElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const leafRefs = useRef<(HTMLDivElement | null)[]>([])
  const baseRef = useRef<HTMLDivElement>(null)
  const looseRefs = useRef<(HTMLSpanElement | null)[]>([])
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const leftBoardRef = useRef<HTMLDivElement>(null)
  const mobileRef = useRef(false)
  const [current, setCurrent] = useState(0)

  // Llegando por navegación interna el script previo al pintado no vuelve a
  // correr: se pone la misma marca aquí, antes de pintar.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    document.documentElement.dataset.book = "on"
  }, [])

  /** Posición de scroll en la que la doble página `index` (0 = portada) se lee en reposo. */
  const scrollFor = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return 0
    const u = index <= 0 ? 0 : Math.min(UNITS, index + timingFor(mobileRef.current).rest)
    const top = track.getBoundingClientRect().top + window.scrollY
    return top + (u / UNITS) * (track.offsetHeight - window.innerHeight)
  }, [])

  const goTo = useCallback(
    (index: number, immediate = false) => {
      const target = Math.max(0, Math.min(spreads.length, index))
      const y = scrollFor(target)
      const lenis = getLenis()
      if (lenis) {
        lenis.scrollTo(y, {
          immediate,
          duration: 0.9 + Math.min(4, Math.abs(target - current)) * 0.35,
        })
      } else {
        window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" })
      }
    },
    [current, scrollFor],
  )

  useEffect(() => {
    if (document.documentElement.dataset.book !== "on") return
    const track = trackRef.current
    const book = bookRef.current
    const pages = pagesRef.current
    if (!track || !book || !pages) return

    const mobileQuery = window.matchMedia("(max-width: 900px)")
    let pageWidth = pages.offsetWidth / 2
    let frame = 0
    let lastVisible = ""
    let lastCurrent = -1

    const measure = () => {
      mobileRef.current = mobileQuery.matches
      pageWidth = pages.offsetWidth / 2
    }

    const render = () => {
      frame = 0
      const mobile = mobileRef.current
      const range = track.offsetHeight - window.innerHeight
      const u = clamp01(-track.getBoundingClientRect().top / Math.max(1, range)) * UNITS

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
        const timing = timingFor(mobile)
        settles.push(smooth(timing.settle, local))
        leftSettles.push(mobile ? smooth([0.02, 0.2], local) : settles[index])
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
        // cuenta de lo perdido se tacha a la vez.
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
      if (mobile) {
        let viewRight: number
        if (u < 1) {
          viewRight = 1 - cover
        } else {
          const k = spreadAt(u)
          const flip = k < spreads.length ? flips[k] : 0
          viewRight = smooth(timingFor(true).pan, localAt(u, k - 1)) * (1 - flip)
        }
        offset = pageWidth / 2 - viewRight * pageWidth
      } else {
        offset = lerp(-pageWidth / 2, 0, slide)
      }
      const bump = flips.slice(1).reduce((sum, flip) => sum + Math.sin(Math.PI * flip), 0)
      const tilt = lerp(lerp(mobile ? 30 : 36, mobile ? 30 : 24, slide), mobile ? 4 : 7, open) + bump * 4
      const turn = lerp(lerp(-9, -4, slide), 0, open)
      const scale = lerp(mobile ? 0.82 : 0.98, 1, open)
      // El desplazamiento se mide en páginas a tamaño real; el libro cerrado
      // está a escala, así que la cámara se mueve lo mismo de escalado.
      offset *= scale
      book.style.transform = `translate3d(${offset.toFixed(1)}px, 0, 0) rotateX(${tilt.toFixed(2)}deg) rotateZ(${turn.toFixed(2)}deg) scale(${scale.toFixed(3)})`

      const hint = introRef.current
      if (hint) hint.style.opacity = (1 - smooth([0, 0.15], u)).toFixed(3)
      const controls = controlsRef.current
      if (controls) {
        controls.style.opacity = open.toFixed(3)
        controls.style.visibility = open <= 0 ? "hidden" : "visible"
      }

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

      const spread = spreadAt(u)
      if (spread !== lastCurrent) {
        lastCurrent = spread
        setCurrent(spread)
        window.dispatchEvent(
          new CustomEvent(BOOK_SPREAD_EVENT, {
            detail: spread === 0 ? null : spreads[spread - 1].id,
          }),
        )
      }
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render)
    }
    const onResize = () => {
      measure()
      schedule()
    }

    measure()
    render()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  // Enlaces `#historia` (cabecera, pestañas, índice) y flechas del teclado.
  useEffect(() => {
    if (document.documentElement.dataset.book !== "on") return

    const indexOf = (href: string | null) => {
      const id = href?.split("#")[1]
      const index = spreads.findIndex((spread) => spread.id === id)
      return index < 0 ? -1 : index + 1
    }

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest?.("a[href*='#']")
      const href = anchor?.getAttribute("href") ?? null
      if (!href || !(href.startsWith("#") || href.startsWith("/#"))) return
      const index = indexOf(href)
      if (index < 0) return
      event.preventDefault()
      window.history.pushState(null, "", `#${spreads[index - 1].id}`)
      goTo(index)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
      if (isEditable(event.target)) return
      const rect = trackRef.current?.getBoundingClientRect()
      if (!rect || rect.bottom < window.innerHeight * 0.5 || rect.top > 0) return
      event.preventDefault()
      goTo(current + (event.key === "ArrowRight" ? 1 : -1))
    }

    document.addEventListener("click", onClick, true)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("click", onClick, true)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [current, goTo])

  // Entrada con `/#historia`: el libro se abre ya por esa página.
  useEffect(() => {
    if (document.documentElement.dataset.book !== "on") return
    const id = window.location.hash.slice(1)
    const index = spreads.findIndex((spread) => spread.id === id)
    if (index >= 0) window.requestAnimationFrame(() => goTo(index + 1, true))
    // Sólo al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const label = current === 0 ? "Portada" : spreads[current - 1].tab

  return (
    <section
      className="bk"
      ref={trackRef}
      aria-label="El cuaderno de tu negocio"
      style={{ "--units": UNITS } as CSSProperties}
    >
      <div className="bk-stage">
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

              <nav className="bk-tabs" aria-label="Historias del cuaderno">
                {spreads.map((spread, index) => (
                  <a
                    key={spread.id}
                    href={`#${spread.id}`}
                    data-tone={index % 3}
                    aria-current={current === index + 1 ? "page" : undefined}
                    ref={(element) => {
                      tabRefs.current[index] = element
                    }}
                    style={{ top: `${6 + index * 15}%` } as CSSProperties}
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

        <p className="bk-hint" ref={introRef} aria-hidden="true">
          Baja para abrirlo
          <span>↓</span>
        </p>

        <div className="bk-controls" ref={controlsRef}>
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            disabled={current <= 0}
            aria-label="Página anterior"
          >
            <ArrowLeft aria-hidden="true" size={20} />
          </button>
          <p aria-live="polite">
            <b>
              {String(current).padStart(2, "0")} / {String(spreads.length).padStart(2, "0")}
            </b>{" "}
            {label}
          </p>
          <button
            type="button"
            onClick={() => goTo(current + 1)}
            disabled={current >= spreads.length}
            aria-label="Página siguiente"
          >
            <ArrowRight aria-hidden="true" size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
