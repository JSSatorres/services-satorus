"use client"

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react"
import gsap from "gsap"
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

/**
 * En móvil se lee una página cada vez. Punto de reposo de la izquierda de
 * cada doble página: ya sellada y antes de que la cámara pase a la derecha.
 */
const MOBILE_LEFT_REST = 0.24

/** Última página en móvil: portada (0), y luego izquierda y derecha de cada doble página. */
const LAST_MOBILE_PAGE = spreads.length * 2

/** Dónde se lee la página `page` en móvil, como posición del recorrido. */
function mobilePageU(page: number) {
  if (page <= 0) return 0
  const spread = Math.ceil(page / 2)
  return spread + (page % 2 === 1 ? MOBILE_LEFT_REST : TIMING.mobile.rest)
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
 * Cómo se lee el libro:
 * - `scroll`: escritorio. El scroll abre el libro y pasa las hojas.
 * - `deck`: móvil en vertical. El libro ocupa una pantalla y cada gesto pasa
 *   una página, por rápido que sea: la inercia del dedo no puede saltárselo.
 * - `off`: móvil en horizontal (demasiado bajo para una página) o movimiento
 *   reducido. Dobles páginas planas, una tras otra.
 */
type Mode = "scroll" | "deck" | "off"

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)"
/** Móvil tumbado: no cabe una página legible. Mismo criterio en `app/layout.tsx`. */
const LANDSCAPE_PHONE_QUERY = "(orientation: landscape) and (max-height: 500px)"
const NARROW_QUERY = "(max-width: 900px)"

function currentMode(): Mode {
  if (window.matchMedia(REDUCED_QUERY).matches) return "off"
  if (window.matchMedia(LANDSCAPE_PHONE_QUERY).matches) return "off"
  return window.matchMedia(NARROW_QUERY).matches ? "deck" : "scroll"
}

/** El modo cambia con la pantalla (girar el móvil, reducir movimiento). */
function subscribeMode(onChange: () => void) {
  const queries = [REDUCED_QUERY, LANDSCAPE_PHONE_QUERY, NARROW_QUERY].map((query) =>
    window.matchMedia(query),
  )
  queries.forEach((query) => query.addEventListener("change", onChange))
  return () => queries.forEach((query) => query.removeEventListener("change", onChange))
}

/** Cuánto hay que mover el dedo para pasar una página. */
const SWIPE_MIN = 36

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

/** Lleva la ventana a `y`, con el motor de scroll activo si lo hay. */
function scrollWindowTo(y: number, duration: number, immediate = false) {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(y, { immediate, duration })
  } else {
    window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" })
  }
}

type Navigator = {
  /** Anterior / siguiente: doble página en escritorio, página en móvil. */
  step: (direction: 1 | -1) => void
  /** Abre la doble página `index` (0 = portada). */
  goTo: (index: number, immediate?: boolean) => void
}

/**
 * El home como libro. Al principio está cerrado sobre la mesa, en
 * perspectiva y lleno de papeles que asoman. Se abre y pasa las hojas: en
 * cada doble página la derecha se asienta en orden, la izquierda queda
 * sellada como «arreglado por Satorus», un papel suelto se guarda y sale una
 * pestaña en el canto. Al final el libro está limpio y con sus pestañas.
 *
 * Todo el estado sale de una sola cifra (`u`, de 0 a `UNITS`): en escritorio
 * la da el scroll; en móvil, la página a la que se ha llegado con el dedo.
 * Avanzar y retroceder son el mismo cálculo. Sin `html[data-book="on"]` el
 * libro se pinta como una sucesión de dobles páginas planas.
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
  const navRef = useRef<Navigator | null>(null)
  const mode = useSyncExternalStore<Mode>(subscribeMode, currentMode, () => "off")
  const [current, setCurrent] = useState(0)
  /** Página que se lee en móvil (`null` en escritorio, donde se ven las dos). */
  const [mobilePage, setMobilePage] = useState<number | null>(null)

  // La marca en `<html>` activa el CSS del libro. El script previo al pintado
  // de `app/layout.tsx` la pone en la primera carga; aquí se mantiene al día
  // (navegación interna, girar el móvil) antes de pintar.
  useLayoutEffect(() => {
    if (mode === "off") delete document.documentElement.dataset.book
    else document.documentElement.dataset.book = "on"
  }, [mode])

  useEffect(() => {
    if (mode === "off") return
    const track = trackRef.current
    const book = bookRef.current
    const pages = pagesRef.current
    if (!track || !book || !pages) return

    const leftBoard = leftBoardRef.current
    const hintNode = introRef.current
    const controlsNode = controlsRef.current
    const baseNode = baseRef.current
    const leaves = [...leafRefs.current]
    const loose = [...looseRefs.current]
    const tabs = [...tabRefs.current]

    const deck = mode === "deck"
    const timing = deck ? TIMING.mobile : TIMING.desktop
    let pageWidth = pages.offsetWidth / 2
    let frame = 0
    let lastVisible = ""
    let lastCurrent = -1
    let lastMobilePage: number | null = -1

    /** En móvil `u` no sale del scroll: lo anima el paso de página. */
    const deckState = { u: 0, page: 0 }
    let deckTween: gsap.core.Tween | null = null

    const scrollU = () => {
      const range = track.offsetHeight - window.innerHeight
      return clamp01(-track.getBoundingClientRect().top / Math.max(1, range)) * UNITS
    }

    const render = () => {
      frame = 0
      const u = deck ? deckState.u : scrollU()

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
        leftSettles.push(deck ? smooth([0.02, 0.2], local) : settles[index])
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
      if (deck) {
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
      const tilt = lerp(lerp(deck ? 30 : 36, deck ? 30 : 24, slide), deck ? 4 : 7, open) + bump * 4
      const turn = lerp(lerp(-9, -4, slide), 0, open)
      const scale = lerp(deck ? 0.82 : 0.98, 1, open)
      // El desplazamiento se mide en páginas a tamaño real; el libro cerrado
      // está a escala, así que la cámara se mueve lo mismo de escalado.
      offset *= scale
      book.style.transform = `translate3d(${offset.toFixed(1)}px, 0, 0) rotateX(${tilt.toFixed(2)}deg) rotateZ(${turn.toFixed(2)}deg) scale(${scale.toFixed(3)})`

      const hint = introRef.current
      if (hint) hint.style.opacity = (1 - smooth([0, 0.15], u)).toFixed(3)
      const controls = controlsRef.current
      // En móvil los botones están siempre: desde la portada, «siguiente» abre
      // el libro. En escritorio aparecen al abrirlo con el scroll.
      if (controls) {
        const shown = deck ? 1 : open
        controls.style.opacity = shown.toFixed(3)
        controls.style.visibility = shown <= 0 ? "hidden" : "visible"
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

      const page = deck ? deckState.page : null
      if (page !== lastMobilePage) {
        lastMobilePage = page
        setMobilePage(page)
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

    /* --- Escritorio: el scroll manda ----------------------------------- */

    /** Posición de la ventana para leer en `u`. */
    const scrollYFor = (u: number) => {
      const top = track.getBoundingClientRect().top + window.scrollY
      return top + (Math.min(UNITS, Math.max(0, u)) / UNITS) * (track.offsetHeight - window.innerHeight)
    }

    /* --- Móvil: cada gesto, una página --------------------------------- */

    const trackTop = () => track.getBoundingClientRect().top + window.scrollY
    const root = document.documentElement

    const showPage = (page: number, immediate = false) => {
      const target = Math.max(0, Math.min(LAST_MOBILE_PAGE, page))
      const distance = Math.abs(mobilePageU(target) - deckState.u)
      deckState.page = target
      deckTween?.kill()
      deckTween = gsap.to(deckState, {
        u: mobilePageU(target),
        duration: immediate ? 0 : Math.min(1.8, 0.75 + distance * 0.4),
        ease: "power2.inOut",
        onUpdate: schedule,
      })
      schedule()
    }

    const canStep = (direction: 1 | -1) =>
      direction === 1 ? deckState.page < LAST_MOBILE_PAGE : deckState.page > 0

    // El libro atrapa el scroll. En cuanto entra en pantalla —bajando o
    // subiendo, despacio o con un gesto muy rápido— se fija ocupando la
    // pantalla y el scroll queda bloqueado: sólo se lee pasando páginas. Desde
    // arriba empieza en la portada; desde abajo, en la última página. Se sale
    // deslizando más allá de la primera o de la última página.
    let locked = false
    /** Listo para atrapar: se rearma cuando el libro casi ha salido de pantalla. */
    let armed = true
    const CAPTURE_AT = 0.35
    const REARM_BELOW = 0.2

    const lock = () => {
      locked = true
      armed = false
      root.dataset.bookLock = ""
    }
    const unlock = () => {
      locked = false
      delete root.dataset.bookLock
    }

    /** Fija el libro en pantalla, abierto por `page`. */
    const enter = (page: number) => {
      lock()
      scrollWindowTo(trackTop(), 0, true)
      showPage(page, true)
    }

    /** Sale del libro hacia arriba (-1, a la portada de la web) o abajo (1). */
    const exit = (direction: 1 | -1) => {
      unlock()
      const top = trackTop()
      scrollWindowTo(
        direction === 1 ? top + track.offsetHeight : top - window.innerHeight * 0.9,
        0.8,
      )
    }

    const onDeckScroll = () => {
      const rect = track.getBoundingClientRect()
      const vh = window.innerHeight
      const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0)) / vh
      if (locked) {
        // La inercia de un gesto rápido sigue moviendo la página después de
        // atraparla: se devuelve a su sitio.
        if (Math.abs(rect.top) > 1) scrollWindowTo(trackTop(), 0, true)
        return
      }
      if (visible < REARM_BELOW) {
        armed = true
        return
      }
      if (armed && visible >= CAPTURE_AT) enter(rect.top >= 0 ? 0 : LAST_MOBILE_PAGE)
    }

    // Un enlace a otra sección (cabecera, «Hablemos de tu negocio») suelta el
    // libro antes de que el enlace mueva la página. Los enlaces a historias
    // del libro los atiende `goTo` sin soltarlo.
    const onLinkClick = (event: MouseEvent) => {
      if (!locked) return
      const anchor = (event.target as Element | null)?.closest?.("a[href]")
      const id = anchor?.getAttribute("href")?.split("#")[1]
      if (!anchor || spreads.some((spread) => spread.id === id)) return
      unlock()
    }

    navRef.current = deck
      ? {
          step: (direction) => showPage(deckState.page + direction),
          goTo: (index, immediate = false) => {
            const page = index <= 0 ? 0 : index * 2 - 1
            if (locked) showPage(page, immediate)
            else enter(page)
          },
        }
      : {
          step: (direction) => {
            const target = Math.max(0, Math.min(spreads.length, spreadAt(scrollU()) + direction))
            scrollWindowTo(scrollYFor(target <= 0 ? 0 : target + timing.rest), 1.25)
          },
          goTo: (index, immediate = false) => {
            const target = Math.max(0, Math.min(spreads.length, index))
            const distance = Math.abs(target - spreadAt(scrollU()))
            scrollWindowTo(
              scrollYFor(target <= 0 ? 0 : target + timing.rest),
              0.9 + Math.min(4, distance) * 0.35,
              immediate,
            )
          },
        }

    // Con el libro fijado, ningún gesto hace scroll: cada gesto, al soltar,
    // pasa una página (arriba o izquierda, adelante; abajo o derecha, atrás),
    // por rápido que sea. Más allá de la primera o la última página, un gesto
    // vertical sale del libro.
    let touch: { x: number; y: number } | null = null
    const onTouchStart = (event: TouchEvent) => {
      touch =
        locked && event.touches.length === 1
          ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
          : null
    }
    const onTouchMove = (event: TouchEvent) => {
      if (locked && event.cancelable) event.preventDefault()
    }
    const onTouchEnd = (event: TouchEvent) => {
      if (!locked || !touch) return
      const end = event.changedTouches[0]
      const dx = end.clientX - touch.x
      const dy = end.clientY - touch.y
      touch = null
      const horizontal = Math.abs(dx) > Math.abs(dy)
      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_MIN) return
      const direction: 1 | -1 = (horizontal ? dx : dy) < 0 ? 1 : -1
      if (canStep(direction)) showPage(deckState.page + direction)
      else if (!horizontal) exit(direction)
    }

    // Rueda (ventana estrecha con ratón): el mismo trato, una página por gesto.
    let wheelLock = 0
    const onWheel = (event: WheelEvent) => {
      if (!locked) return
      event.preventDefault()
      const now = performance.now()
      if (now < wheelLock || Math.abs(event.deltaY) < 4) return
      wheelLock = now + 650
      const direction: 1 | -1 = event.deltaY > 0 ? 1 : -1
      if (canStep(direction)) showPage(deckState.page + direction)
      else exit(direction)
    }

    const onResize = () => {
      pageWidth = pages.offsetWidth / 2
      schedule()
    }

    render()
    window.addEventListener("resize", onResize)
    if (deck) {
      // Lenis no debe suavizar la rueda sobre el libro: la gestiona el libro.
      track.dataset.lenisPrevent = ""
      window.addEventListener("scroll", onDeckScroll, { passive: true })
      document.addEventListener("touchstart", onTouchStart, { passive: true })
      document.addEventListener("touchmove", onTouchMove, { passive: false })
      document.addEventListener("touchend", onTouchEnd)
      window.addEventListener("wheel", onWheel, { passive: false })
      document.addEventListener("click", onLinkClick, true)
      onDeckScroll()
    } else {
      window.addEventListener("scroll", schedule, { passive: true })
    }

    return () => {
      window.cancelAnimationFrame(frame)
      deckTween?.kill()
      navRef.current = null
      unlock()
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("scroll", onDeckScroll)
      document.removeEventListener("touchstart", onTouchStart)
      document.removeEventListener("touchmove", onTouchMove)
      document.removeEventListener("touchend", onTouchEnd)
      window.removeEventListener("wheel", onWheel)
      document.removeEventListener("click", onLinkClick, true)
      delete track.dataset.lenisPrevent

      // Al cambiar de modo (girar el móvil) no puede quedar nada del anterior:
      // el libro plano no lleva giros, transformaciones ni caras inertes.
      book.style.removeProperty("transform")
      pages.style.removeProperty("--open")
      leftBoard?.style.removeProperty("opacity")
      hintNode?.style.removeProperty("opacity")
      controlsNode?.style.removeProperty("opacity")
      controlsNode?.style.removeProperty("visibility")
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
      setMobilePage(null)
    }
  }, [mode])

  // Enlaces `#historia` (cabecera, pestañas) y flechas del teclado.
  useEffect(() => {
    if (mode === "off") return

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
      navRef.current?.goTo(index)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
      if (isEditable(event.target)) return
      const rect = trackRef.current?.getBoundingClientRect()
      if (!rect || rect.bottom < window.innerHeight * 0.5 || rect.top > window.innerHeight * 0.5) return
      event.preventDefault()
      navRef.current?.step(event.key === "ArrowRight" ? 1 : -1)
    }

    document.addEventListener("click", onClick, true)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("click", onClick, true)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [mode])

  // Entrada con `/#historia`: el libro se abre ya por esa página.
  useEffect(() => {
    if (mode === "off") return
    const id = window.location.hash.slice(1)
    const index = spreads.findIndex((spread) => spread.id === id)
    if (index >= 0) window.requestAnimationFrame(() => navRef.current?.goTo(index + 1, true))
  }, [mode])

  // En móvil se cuenta por páginas (se pasa de una en una); en escritorio,
  // por dobles páginas.
  const position = mobilePage ?? current
  const total = mobilePage === null ? spreads.length : LAST_MOBILE_PAGE
  const spreadShown = mobilePage === null ? current : Math.ceil(mobilePage / 2)
  const label = spreadShown === 0 ? "Portada" : spreads[spreadShown - 1].tab

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
          {mode === "deck" ? "Desliza para abrirlo" : "Baja para abrirlo"}
          <span>{mode === "deck" ? "↑" : "↓"}</span>
        </p>

        <div className="bk-controls" ref={controlsRef}>
          <button
            type="button"
            onClick={() => navRef.current?.step(-1)}
            disabled={position <= 0}
            aria-label="Página anterior"
          >
            <ArrowLeft aria-hidden="true" size={20} />
          </button>
          <p aria-live="polite">
            <b>
              {String(position).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </b>{" "}
            {label}
          </p>
          <button
            type="button"
            onClick={() => navRef.current?.step(1)}
            disabled={position >= total}
            aria-label="Página siguiente"
          >
            <ArrowRight aria-hidden="true" size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
