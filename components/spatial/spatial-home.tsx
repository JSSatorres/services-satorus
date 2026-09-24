"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import gsap from "gsap"
import { ArrowUpRight } from "lucide-react"
import { BusinessBottleneck } from "@/components/business-bottleneck"
import { ContactForm } from "@/components/contact-form"
import { Hero } from "@/components/hero"
import { SiteFooter } from "@/components/site-footer"
import { SpatialCompass } from "@/components/spatial/spatial-compass"
import { SpatialPlainTalk } from "@/components/spatial/spatial-plain-talk"
import { SpatialProcess } from "@/components/spatial/spatial-process"
import { StationContext } from "@/components/spatial/station-context"
import { TableDecor } from "@/components/spatial/table-decor"
import {
  GAP_X,
  GAP_Y,
  STATION_SPOTS,
  type StationId,
} from "@/components/spatial/table-layout"
import { faqs, processSteps, projectDoors } from "@/lib/home-content"
import { jumpToScrollTop } from "@/lib/lenis"
import {
  SPATIAL_DIVE_KEY,
  SPATIAL_RETURN_KEY,
  announceSpatialStation,
  registerSpatialNavigator,
} from "@/lib/spatial-nav"

/**
 * Dos eventos de rueda separados por menos que esto son el mismo gesto
 * —inercia del trackpad, rueda girada en continuo— y no pueden encadenar dos
 * vuelos. Es el mismo criterio que usaba el relevo de cortinas.
 */
const GESTURE_GAP_MS = 90
const MIN_WHEEL_DELTA = 4

/**
 * Pausa tras aterrizar: la inercia del trackpad que queda del gesto que lanzó
 * el vuelo no puede lanzar otro. El tiempo para ver que la sección se acaba lo
 * dan los márgenes vacíos de cada hoja (`--sheet-rest` en `app/spatial.css`).
 */
const ARRIVAL_COOLDOWN_MS = 450
const SWIPE_THRESHOLD = 60
/** Paso de la rejilla mayor de la alfombrilla de corte: ver `.spatial-mat`. */
const MAT_TILE = 240
const MOBILE_QUERY = "(max-width: 900px)"

type Direction = 1 | -1

const stationContent: Record<StationId, ReactNode> = {
  inicio: <Hero />,
  "como-trabajamos": <SpatialProcess steps={processSteps} />,
  proyectos: (
    <section
      className="projects-section"
      id="proyectos"
      aria-labelledby="projects-title"
    >
      <div className="projects-heading">
        <h2 id="projects-title">Una idea puede acabar en una app o en una web.</h2>
        <div className="projects-heading-aside">
          <p>
            Dos puertas de entrada a lo que hacemos. Dentro de cada proyecto,
            todo el detalle.
          </p>
          <a className="projects-cta" href="/productos">
            Mira algunos de nuestros proyectos
            <ArrowUpRight aria-hidden="true" size={20} />
          </a>
        </div>
      </div>

      <div className="project-list">
        {projectDoors.map((project, index) => (
          <article
            className="project-card"
            key={project.id}
            style={{ "--rise-i": index + 1 } as CSSProperties}
          >
            <div
              className="project-shot"
              data-depth=""
              style={{ "--depth": 12 + index * 8 } as CSSProperties}
            >
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes="(max-width: 900px) 100vw, 46vw"
              />
            </div>
            <span className="project-label">{project.label}</span>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <a href={project.href}>
              {project.linkLabel}
              <ArrowUpRight aria-hidden="true" size={20} />
            </a>
          </article>
        ))}
      </div>
    </section>
  ),
  "hablamos-claro": <SpatialPlainTalk />,
  diagnostico: <BusinessBottleneck />,
  preguntas: (
    <section className="faq-section" id="preguntas" aria-labelledby="faq-title">
      <div className="faq-heading">
        <h2 id="faq-title">Antes de dar el paso.</h2>
        <p>
          Si la tuya no está aquí, escríbenos como la explicarías a alguien de tu
          equipo.
        </p>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <details
            key={faq.question}
            style={{ "--rise-i": index + 1 } as CSSProperties}
          >
            <summary>
              {faq.question}
              <span aria-hidden="true" />
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  ),
  contacto: (
    <>
      <section
        className="contact-section"
        id="contacto"
        aria-labelledby="contact-title"
      >
        <div className="contact-copy">
          <h2 id="contact-title">Veamos cuál puede ser tu siguiente paso.</h2>
          <p>
            Cuéntanos a qué se dedica tu negocio y qué te gustaría mejorar.
            Revisaremos tu consulta y te contactaremos para entender mejor lo que
            necesitas.
          </p>
          <a href="mailto:info@satorus.es">info@satorus.es</a>
        </div>
        <ContactForm />
      </section>
      <SiteFooter />
    </>
  ),
}


function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target.matches("input, textarea, select, [role='textbox']")
  )
}

/** ¿Puede algo entre `target` y la estación desplazarse en esa dirección? */
function canScrollWithin(
  target: EventTarget | null,
  station: HTMLElement,
  direction: Direction,
) {
  let node = target instanceof Element ? target : null
  if (!node || !station.contains(node)) node = station

  while (node) {
    if (node instanceof HTMLElement) {
      const overflow = getComputedStyle(node).overflowY
      const scrollable =
        node === station || overflow === "auto" || overflow === "scroll"

      if (scrollable && node.scrollHeight > node.clientHeight + 1) {
        const atEnd =
          direction > 0
            ? node.scrollTop + node.clientHeight >= node.scrollHeight - 2
            : node.scrollTop <= 2
        if (!atEnd) return true
      }
    }

    if (node === station) break
    node = node.parentElement
  }

  return false
}

/**
 * Tramo de mesa entre dos hojas del documento plano (móvil y movimiento
 * reducido): el cable baja hasta la hoja siguiente, que ya asoma con su
 * etiqueta. Es el aire que avisa de que la sección se acaba antes de que se
 * acabe. En la mesa de escritorio no se muestra.
 */
function SheetGap({ index, label }: { index: number; label: string }) {
  return (
    <div className="spatial-gap" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M22 0 C22 30 44 34 40 52 S18 78 22 100" />
      </svg>
      <span className="spatial-gap-tag">
        <b>{String(index + 1).padStart(2, "0")}</b>
        {label}
      </span>
    </div>
  )
}

/**
 * Home como mesa de trabajo.
 *
 * Las secciones son estaciones repartidas sobre una mesa azul y unidas por el
 * cable naranja. La pantalla es una cámara: un gesto de rueda, un deslizamiento
 * o una flecha la levantan, la inclinan y la llevan volando a la estación
 * siguiente, donde vuelve a posarse plana. Nada es 3D de verdad: son capas
 * planas con `perspective`, `rotateX/Y` y `translateZ`.
 *
 * El HTML del servidor es el documento vertical de siempre. Con movimiento
 * permitido, `layout.tsx` marca `data-spatial` antes de pintar y el CSS lo
 * convierte en mesa; con movimiento reducido o sin JavaScript se queda como
 * documento plano y todo el contenido sigue ahí.
 */
export function SpatialHome() {
  const router = useRouter()
  const viewportRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<HTMLDivElement>(null)
  const matRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const stationRefs = useRef<Array<HTMLDivElement | null>>([])

  const activeRef = useRef(0)
  const flyingRef = useRef(false)
  const flightRef = useRef<gsap.core.Timeline | null>(null)
  const flyRef = useRef<(index: number, direction?: Direction) => void>(() => {})

  // Cómo se llega a la mesa. Se lee una sola vez y se guarda aquí porque las
  // fuentes se consumen al leerlas, y el doble montaje de desarrollo las
  // perdería en la segunda pasada.
  const arrivalRef = useRef<{ intro: boolean; returnId: string | null } | null>(
    null,
  )

  const [spatial, setSpatial] = useState(false)
  const [active, setActive] = useState(0)
  // Estación de la que sale el vuelo en curso; -1 en reposo.
  const [from, setFrom] = useState(-1)
  // El vuelo en curso aleja tanto la cámara que se ve la mesa alrededor
  // (intro, saltos largos): sólo entonces se pintan las hojas vecinas.
  const [wide, setWide] = useState(false)
  const [arrived, setArrived] = useState(true)
  const [visited, setVisited] = useState(false)

  const flyTo = useCallback((index: number, direction?: Direction) => {
    flyRef.current(index, direction)
  }, [])

  // Antes de pintar: decide si hay mesa. Va en layout effect para que una
  // navegación en cliente desde otra página no enseñe un fotograma plano.
  useLayoutEffect(() => {
    const root = document.documentElement

    if (arrivalRef.current === null) {
      arrivalRef.current = {
        intro: root.dataset.spatialIntro === "on",
        returnId: window.sessionStorage.getItem(SPATIAL_RETURN_KEY),
      }
      window.sessionStorage.removeItem(SPATIAL_RETURN_KEY)
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")

    // El modo depende del navegador y tiene que fijarse antes de pintar. Se
    // vuelve a decidir si cambia la preferencia de movimiento.
    const sync = () => {
      const on = !reduced.matches
      if (on) {
        root.dataset.spatial = "on"
      } else {
        delete root.dataset.spatial
        delete root.dataset.spatialIntro
      }
      setSpatial(on)
    }

    sync()
    reduced.addEventListener("change", sync)

    // `data-spatial-intro` no se toca aquí: lo retira la propia intro al
    // acabar, y borrarlo en el doble montaje de desarrollo la cortaría.
    return () => {
      reduced.removeEventListener("change", sync)
      delete document.documentElement.dataset.spatial
    }
  }, [])

  // Documento plano (móvil): los enlaces a secciones —menú, CTAs `#contacto`—
  // dejan la sección arriba del todo, justo donde empieza su contenido y sin
  // enseñar el margen vacío de encima. La posición sale de `offsetTop`, que no
  // cuenta los transform: las hojas que aún no han entrado están encogidas
  // por su animación de scroll y `getBoundingClientRect` daría una posición
  // falsa. En captura, para adelantarse a la navegación propia del header.
  useEffect(() => {
    if (spatial) return

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as Element | null)?.closest?.("a[href]")
      const href = anchor?.getAttribute("href") ?? ""
      if (!href.startsWith("#") && !href.startsWith("/#")) return

      const id = decodeURIComponent(href.slice(href.indexOf("#") + 1))
      const target = document.getElementById(id)
      if (!target?.closest(".spatial-station")) return

      event.preventDefault()
      let top = 0
      for (
        let node: HTMLElement | null = target;
        node;
        node = node.offsetParent as HTMLElement | null
      ) {
        top += node.offsetTop
      }
      jumpToScrollTop(top)
      window.history.pushState(null, "", `/#${id}`)
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [spatial])

  useLayoutEffect(() => {
    if (!spatial) return

    const viewport = viewportRef.current
    const camera = cameraRef.current
    const mat = matRef.current
    const world = worldRef.current
    if (!viewport || !camera || !mat || !world) return

    const root = document.documentElement
    const stations = stationRefs.current
    const mobile = () => window.matchMedia(MOBILE_QUERY).matches

    let lastWheelAt = 0
    // El gesto de rueda que lanzó el vuelo sigue llegando como inercia; no
    // puede mover la estación nueva al aterrizar.
    let flightGesture = false
    const lastTops: number[] = []
    let arrivedAt = 0
    let cancelled = false

    const size = () => ({
      width: viewport.clientWidth,
      height: viewport.clientHeight,
    })

    const offsetOf = (index: number) => {
      const { width, height } = size()
      const spot = STATION_SPOTS[index]
      // Píxeles enteros: con decimales la estación queda a medio píxel y
      // asoma una línea de mesa por el borde.
      return {
        x: -Math.round(spot.col * GAP_X * width),
        y: -Math.round(spot.row * GAP_Y * height),
      }
    }

    // La alfombrilla no se mueve con el mundo —mediría decenas de pantallas—:
    // se desplaza sólo el resto de una baldosa, que a la vista es lo mismo.
    const syncMat = () => {
      const x = Number(gsap.getProperty(world, "x")) % MAT_TILE
      const y = Number(gsap.getProperty(world, "y")) % MAT_TILE
      gsap.set(mat, { x, y })
    }

    const applySize = () => {
      const { width, height } = size()
      viewport.style.setProperty("--sw", `${width}px`)
      viewport.style.setProperty("--sh", `${height}px`)
    }

    const stationIndexOf = (id: string) => {
      const element = document.getElementById(id)
      const station = element?.closest<HTMLElement>(".spatial-station")
      const byElement = station ? stations.indexOf(station as HTMLDivElement) : -1
      return byElement >= 0
        ? byElement
        : STATION_SPOTS.findIndex((spot) => spot.id === id)
    }

    const arrive = (index: number) => {
      flyingRef.current = false
      arrivedAt = performance.now()
      delete viewport.dataset.flying
      setFrom(-1)
      setWide(false)
      setArrived(true)

      const spot = STATION_SPOTS[index]
      announceSpatialStation(spot.id)
      const hash = index === 0 ? "" : `#${spot.id}`
      window.history.replaceState(window.history.state, "", `/${hash}`)

      // El foco sigue a la cámara si estaba en la mesa o en ningún sitio. Si
      // está en el header o en la brújula se queda ahí, para poder seguir
      // pulsando.
      const station = stations[index]
      const focused = document.activeElement
      if (
        station &&
        (!focused ||
          focused === document.body ||
          (viewport.contains(focused) && !station.contains(focused)))
      ) {
        station.focus({ preventScroll: true })
      }
    }

    // Límites del contenido de una estación, sin sus márgenes vacíos
    // (`::before` y `::after`). La estación es `position: absolute`, así que es
    // el `offsetParent` de sus hijos y `offsetTop` ya se mide desde ella.
    function contentStartTop(station: HTMLElement) {
      const first = station.firstElementChild as HTMLElement | null
      return first ? first.offsetTop : 0
    }

    function contentEndTop(station: HTMLElement) {
      const last = station.lastElementChild as HTMLElement | null
      if (!last) return station.scrollHeight
      const end = last.offsetTop + last.offsetHeight
      return Math.max(contentStartTop(station), end - station.clientHeight)
    }

    flyRef.current = (index, direction) => {
      if (index < 0 || index >= STATION_SPOTS.length) return
      if (index === activeRef.current && !flyingRef.current) return

      const from = STATION_SPOTS[activeRef.current]
      const to = STATION_SPOTS[index]
      const target = offsetOf(index)
      const station = stations[index]

      // Se llega al contenido, nunca al margen vacío: bajando o por
      // navegación, a donde empieza; subiendo, a donde acaba, como en un
      // documento continuo. El margen sólo se ve al seguir hacia la vecina.
      if (station) {
        station.scrollTop =
          direction === -1 ? contentEndTop(station) : contentStartTop(station)
        lastTops[index] = station.scrollTop
      }

      flyingRef.current = true
      setFrom(activeRef.current)
      activeRef.current = index
      setActive(index)
      setArrived(false)
      setVisited(true)
      viewport.dataset.flying = "true"
      flightRef.current?.kill()

      const dx = (to.col - from.col) * GAP_X
      const dy = (to.row - from.row) * GAP_Y
      const distance = Math.hypot(dx, dy)
      // Vuelo corto y contenido: la cámara se aleja lo justo para ver la
      // mesa alrededor, no para marear. Sólo los saltos largos (brújula,
      // header) se alejan más.
      const duration = gsap.utils.clamp(0.85, 1.3, 0.75 + distance * 0.2)
      const baseLift = mobile() ? 0.86 : 0.8
      const lift = gsap.utils.clamp(
        0.46,
        baseLift,
        baseLift - (distance - 1.4) * 0.12,
      )
      setWide(lift < 0.7)
      const peakX = mobile() ? 5 : 9
      const peakY = Math.sign(dx) * (mobile() ? 1.5 : 3)

      // La cámara hace UN solo movimiento: una campana, `sin(πp)`, que sube y
      // baja sin detenerse arriba. Antes eran dos tweens encadenados —subir y
      // bajar— y en la cumbre la velocidad llegaba a cero: ese era el parón a
      // mitad de vuelo. Parte de donde esté la cámara (un vuelo puede
      // redirigirse a medias) y termina siempre plana.
      const start = {
        scale: Number(gsap.getProperty(camera, "scale")),
        rotationX: Number(gsap.getProperty(camera, "rotationX")),
        rotationY: Number(gsap.getProperty(camera, "rotationY")),
      }
      const progress = { p: 0 }
      const renderCamera = () => {
        const p = progress.p
        const bell = Math.sin(Math.PI * p)
        gsap.set(camera, {
          scale: start.scale + (1 - start.scale) * p - (1 - lift) * bell,
          rotationX: start.rotationX * (1 - p) + peakX * bell,
          rotationY: start.rotationY * (1 - p) + peakY * bell,
          rotationZ: 0,
        })
      }

      flightRef.current = gsap
        .timeline({ onUpdate: syncMat, onComplete: () => arrive(index) })
        .to(world, { ...target, duration, ease: "power2.inOut" }, 0)
        .to(
          progress,
          { p: 1, duration, ease: "sine.inOut", onUpdate: renderCamera },
          0,
        )
    }

    const step = (direction: Direction) => {
      flightGesture = true
      flyRef.current(activeRef.current + direction, direction)
    }

    // ── Llegar al borde es cambiar ──────────────────────────────────────
    // El margen vacío de la hoja ya ha avisado: en cuanto el scroll toca el
    // final (bajando) o el principio (subiendo), la cámara sale sola. Sin
    // gesto extra, que era lo que hacía que pareciera atascado.
    const onStationScroll = (event: Event) => {
      const station = event.currentTarget as HTMLElement
      const index = stations.indexOf(station as HTMLDivElement)
      const top = station.scrollTop
      const previous = lastTops[index] ?? top
      lastTops[index] = top

      if (index !== activeRef.current || flyingRef.current) return
      if (performance.now() - arrivedAt < ARRIVAL_COOLDOWN_MS) return

      const max = station.scrollHeight - station.clientHeight
      if (top > previous && top >= max - 1) step(1)
      else if (top < previous && top <= 1) step(-1)
    }

    // ── Punto de partida ────────────────────────────────────────────────
    // Ni un `gsap.set` sobre la cámara aquí: GSAP leería su transform a mitad
    // de la intro CSS y lo dejaría fijado en línea al acabar.
    applySize()

    const hashId = decodeURIComponent(window.location.hash.slice(1))
    const { intro: introFromScript, returnId } = arrivalRef.current ?? {
      intro: false,
      returnId: null,
    }
    const startId = hashId || returnId || ""
    const startIndex = startId ? Math.max(0, stationIndexOf(startId)) : 0
    activeRef.current = startIndex
    setActive(startIndex)
    gsap.set(world, offsetOf(startIndex))
    syncMat()
    const startStation = stations[startIndex]
    if (startStation) startStation.scrollTop = contentStartTop(startStation)
    // Punto de partida de cada hoja, para saber hacia dónde va su primer scroll.
    stations.forEach((station, index) => {
      lastTops[index] = station?.scrollTop ?? 0
    })

    flyingRef.current = true
    setArrived(false)
    // La entrada cuenta como vuelo desde la propia estación: así, con la
    // cámara alejada, también se pintan las hojas vecinas de la mesa.
    setFrom(startIndex)
    setWide(introFromScript)
    viewport.dataset.flying = "true"

    let entrance: gsap.core.Timeline | null = null
    // La intro de la primera visita es una animación CSS (`spatial-intro` en
    // `app/spatial.css`): arranca con la primera pintura, sin esperar a que
    // React hidrate. Aquí sólo se espera a que acabe para posar la cámara.
    let introAnimations: Animation[] = introFromScript ? camera.getAnimations() : []

    const finishIntro = () => {
      introAnimations = []
      delete root.dataset.spatialIntro
      arrive(startIndex)
    }

    /** Cualquier gesto durante la intro la termina en el acto. */
    const skipIntro = () => {
      if (introAnimations.length === 0) return false
      introAnimations.forEach((animation) => animation.finish())
      return true
    }

    if (introFromScript) {
      if (introAnimations.length === 0) {
        finishIntro()
      } else {
        Promise.all(introAnimations.map((animation) => animation.finished))
          .catch(() => undefined)
          .then(() => {
            if (!cancelled) finishIntro()
          })
      }
    } else {
      // Vuelta desde otra página o entrada directa a una sección: la cámara
      // se echa un poco hacia atrás y se posa.
      entrance = gsap.timeline({ onComplete: () => arrive(startIndex) }).fromTo(
        camera,
        { scale: 1.12, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.8, ease: "power3.out" },
      )
    }

    // ── Rueda ───────────────────────────────────────────────────────────
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || document.body.classList.contains("menu-open")) return

      const now = performance.now()
      const continues = now - lastWheelAt < GESTURE_GAP_MS
      lastWheelAt = now

      if (skipIntro() || flyingRef.current) {
        event.preventDefault()
        return
      }

      if (flightGesture) {
        if (continues) {
          event.preventDefault()
          return
        }
        flightGesture = false
      }

      // Sólo vertical: el desplazamiento lateral del trackpad se escapa sin
      // querer y no puede cambiar de estación.
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      const pixels =
        event.deltaMode === 1
          ? event.deltaY * 40
          : event.deltaMode === 2
            ? event.deltaY * window.innerHeight
            : event.deltaY
      if (Math.abs(pixels) < MIN_WHEEL_DELTA && !continues) return
      const direction: Direction = pixels > 0 ? 1 : -1
      const station = stations[activeRef.current]
      if (!station) return

      if (canScrollWithin(event.target, station, direction)) {
        // Sobre el header o la brújula la rueda no llega a la estación.
        if (!station.contains(event.target as Node)) {
          event.preventDefault()
          station.scrollBy({ top: pixels })
        }
        return
      }

      // Ya en el borde sin scroll que hacer (llegó a él durante la pausa del
      // aterrizaje, o la rueda está fuera de la estación): el gesto cambia.
      event.preventDefault()
      if (performance.now() - arrivedAt < ARRIVAL_COOLDOWN_MS) return
      step(direction)
    }

    // ── Táctil ──────────────────────────────────────────────────────────
    // Sólo cuenta si la estación ya estaba en el borde al empezar a deslizar:
    // el deslizamiento que lleva el texto hasta el final no cambia de estación.
    let touchStart: {
      x: number
      y: number
      target: EventTarget | null
      canDown: boolean
      canUp: boolean
    } | null = null

    const onTouchStart = (event: TouchEvent) => {
      if (skipIntro()) return
      if (event.touches.length !== 1) {
        touchStart = null
        return
      }
      const point = event.touches[0]
      const station = stations[activeRef.current]
      touchStart = {
        x: point.clientX,
        y: point.clientY,
        target: event.target,
        canDown: station ? canScrollWithin(event.target, station, 1) : true,
        canUp: station ? canScrollWithin(event.target, station, -1) : true,
      }
    }

    const onTouchEnd = (event: TouchEvent) => {
      const start = touchStart
      touchStart = null
      if (!start || flyingRef.current) return
      if (document.body.classList.contains("menu-open")) return
      if (isEditable(start.target)) return
      if (performance.now() - arrivedAt < ARRIVAL_COOLDOWN_MS) return

      const point = event.changedTouches[0]
      const dx = start.x - point.clientX
      const dy = start.y - point.clientY
      if (Math.abs(dy) < Math.abs(dx) || Math.abs(dy) < SWIPE_THRESHOLD) return

      const direction: Direction = dy > 0 ? 1 : -1
      if (direction === 1 && start.canDown) return
      if (direction === -1 && start.canUp) return
      step(direction)
    }

    // ── Teclado ─────────────────────────────────────────────────────────
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
      if (document.body.classList.contains("menu-open")) return
      if (isEditable(event.target)) return

      const target = event.target as HTMLElement | null
      const onControl = target?.matches?.("button, summary, a, [role='button']")
      const station = stations[activeRef.current]
      if (!station) return

      let direction: Direction | null = null
      let amount = 0

      switch (event.key) {
        case "ArrowDown":
          direction = 1
          amount = 90
          break
        case "ArrowUp":
          direction = -1
          amount = 90
          break
        case "PageDown":
          direction = 1
          amount = station.clientHeight * 0.85
          break
        case "PageUp":
          direction = -1
          amount = station.clientHeight * 0.85
          break
        case " ":
          if (onControl) return
          direction = event.shiftKey ? -1 : 1
          amount = station.clientHeight * 0.85
          break
        case "ArrowRight":
          event.preventDefault()
          if (!skipIntro() && !flyingRef.current) step(1)
          return
        case "ArrowLeft":
          event.preventDefault()
          if (!skipIntro() && !flyingRef.current) step(-1)
          return
        case "Home":
          event.preventDefault()
          flyRef.current(0)
          return
        case "End":
          event.preventDefault()
          flyRef.current(STATION_SPOTS.length - 1)
          return
        default:
          return
      }

      event.preventDefault()
      if (skipIntro() || flyingRef.current) return

      if (canScrollWithin(station, station, direction)) {
        station.scrollBy({ top: direction * amount, behavior: "smooth" })
        return
      }

      // Una tecla es un gesto deliberado: basta con respetar el aterrizaje.
      if (performance.now() - arrivedAt < ARRIVAL_COOLDOWN_MS / 2) return
      step(direction)
    }

    // ── Enlaces ─────────────────────────────────────────────────────────
    // En captura, para adelantarse a `next/link`: si el clic ya llega
    // cancelado, `Link` no navega y la mesa puede hacer su picado antes.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as Element | null)?.closest?.("a[href]")
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (anchor.target && anchor.target !== "_self") return

      const href = anchor.getAttribute("href") ?? ""
      if (href.startsWith("#") || href.startsWith("/#") || href === "/") {
        const id = href === "/" ? "inicio" : href.slice(href.indexOf("#") + 1)
        const index = id === "inicio" ? 0 : stationIndexOf(id)
        if (index < 0) return
        event.preventDefault()
        if (index !== activeRef.current) flyRef.current(index)
        return
      }

      if (!href.startsWith("/") || href.startsWith("//")) return

      event.preventDefault()
      if (flyingRef.current && flightRef.current?.isActive()) return

      // Picado hacia la página: la cámara se hunde en el punto del clic.
      const rect = anchor.getBoundingClientRect()
      const originX = rect.left + rect.width / 2
      const originY = rect.top + rect.height / 2
      window.sessionStorage.setItem(
        SPATIAL_RETURN_KEY,
        STATION_SPOTS[activeRef.current].id,
      )
      window.sessionStorage.setItem(SPATIAL_DIVE_KEY, "1")
      flyingRef.current = true
      flightRef.current?.kill()
      flightRef.current = gsap
        .timeline({ onComplete: () => router.push(href) })
        .set(camera, { transformOrigin: `${originX}px ${originY}px` })
        .to(camera, {
          scale: 2.6,
          rotationX: -8,
          duration: 0.75,
          ease: "power3.in",
        })
        .to(viewport, { autoAlpha: 0, duration: 0.3, ease: "power1.in" }, 0.45)
    }

    // ── Paralaje con el puntero ────────────────────────────────────────
    // Sólo mueve las capas de dentro de la estación (`[data-depth]`). Inclinar
    // la escena entera descubría los bordes de la estación en reposo.
    const pointer = { x: 0, y: 0 }
    const renderPointer = () => {
      const station = stations[activeRef.current]
      if (!station) return
      station.style.setProperty("--px", pointer.x.toFixed(3))
      station.style.setProperty("--py", pointer.y.toFixed(3))
    }
    const pointerX = gsap.quickTo(pointer, "x", {
      duration: 0.8,
      ease: "power3.out",
      onUpdate: renderPointer,
    })
    const pointerY = gsap.quickTo(pointer, "y", {
      duration: 0.8,
      ease: "power3.out",
      onUpdate: renderPointer,
    })

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return
      const nx = (event.clientX / window.innerWidth) * 2 - 1
      const ny = (event.clientY / window.innerHeight) * 2 - 1
      pointerX(nx)
      pointerY(ny)
    }

    // ── Redimensionado ─────────────────────────────────────────────────
    const onResize = () => {
      applySize()
      if (!flyingRef.current) {
        gsap.set(world, offsetOf(activeRef.current))
        syncMat()
      }
    }

    registerSpatialNavigator((id) => {
      const index = id === "inicio" ? 0 : stationIndexOf(id)
      if (index < 0) return false
      if (index !== activeRef.current) flyRef.current(index)
      return true
    })

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchend", onTouchEnd, { passive: true })
    stations.forEach((station) =>
      station?.addEventListener("scroll", onStationScroll, { passive: true }),
    )
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("resize", onResize)
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    document.addEventListener("click", onClick, true)

    return () => {
      registerSpatialNavigator(null)
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      cancelled = true
      window.removeEventListener("touchend", onTouchEnd)
      stations.forEach((station) =>
        station?.removeEventListener("scroll", onStationScroll),
      )
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("click", onClick, true)
      entrance?.kill()
      flightRef.current?.kill()
      gsap.killTweensOf(pointer)
      // Si se sale de la mesa (la ventana cruza a móvil), el documento plano
      // no puede heredar la cámara ni los desplazamientos del vuelo.
      gsap.set([world, mat, ...stations.filter(Boolean)], { clearProps: "transform" })
      gsap.set(camera, { clearProps: "transform,transformOrigin,opacity,visibility" })
      gsap.set(viewport, { clearProps: "opacity,visibility" })
    }
  }, [spatial, router])

  return (
    <>
      <div className="spatial-viewport" ref={viewportRef} data-lenis-prevent="">
        <div className="spatial-camera" ref={cameraRef}>
          <div className="spatial-mat" ref={matRef} aria-hidden="true" />
          <div className="spatial-world" ref={worldRef}>
            {/* Sólo con mesa: en el documento plano sus fotos se descargarían
                para nada. */}
            {spatial ? <TableDecor /> : null}

            {STATION_SPOTS.map((spot, index) => {
              const isActive = index === active
              const next = STATION_SPOTS[index + 1]
              // En un vuelo se pintan la de salida y la de llegada. Sus vecinas
              // sólo cuando la cámara se aleja lo bastante para verlas (intro,
              // saltos largos). Pintar menos es lo que mantiene fluido el vuelo.
              const near =
                wide &&
                from >= 0 &&
                [from, active].some((other) => {
                  const a = STATION_SPOTS[other]
                  return (
                    Math.abs(a.col - spot.col) <= 1 &&
                    Math.abs(a.row - spot.row) <= 1
                  )
                })
              return (
                <Fragment key={spot.id}>
                <div
                  className="spatial-station"
                  ref={(element) => {
                    stationRefs.current[index] = element
                  }}
                  data-station={spot.id}
                  // Qué márgenes vacíos lleva la hoja: arriba si hay una
                  // anterior, abajo si hay una siguiente.
                  data-prev={index > 0 || undefined}
                  data-next={Boolean(next) || undefined}
                  data-active={(spatial && isActive) || undefined}
                  data-from={(spatial && index === from) || undefined}
                  data-near={(spatial && near) || undefined}
                  data-arrived={(spatial && isActive && arrived) || undefined}
                  inert={spatial && !isActive ? true : undefined}
                  tabIndex={spatial ? -1 : undefined}
                  style={{ "--col": spot.col, "--row": spot.row } as CSSProperties}
                >
                  <StationContext.Provider
                    value={{ spatial, arrived: !spatial || (isActive && arrived) }}
                  >
                    {stationContent[spot.id]}
                  </StationContext.Provider>
                </div>
                {next ? <SheetGap index={index + 1} label={next.label} /> : null}
                </Fragment>
              )
            })}
          </div>
        </div>
        <div className="spatial-vignette" aria-hidden="true" />
      </div>

      {spatial ? (
        <SpatialCompass
          active={active}
          showHint={!visited}
          onSelect={(index) => flyTo(index)}
          onStep={(direction) => flyTo(active + direction, direction)}
        />
      ) : null}
    </>
  )
}
