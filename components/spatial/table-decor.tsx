import Image from "next/image"
import type { CSSProperties } from "react"
import {
  CABLE_BOX,
  CABLE_END,
  CABLE_SCALE,
  GAP_X,
  GAP_Y,
  STATION_SPOTS,
  cablePath,
} from "@/components/spatial/table-layout"

type Placed = {
  /** Centro, en unidades de pantalla. */
  x: number
  y: number
  /** Giro sobre la mesa, en grados. */
  r: number
  /** Altura sobre la mesa, en píxeles: cuanto más alto, más paralaje al volar. */
  z: number
}

type Print = Placed & { src: string; w: number; tape?: string }
type Tag = Placed & { text: string; tone?: "lime" | "paper" | "orange" }

/**
 * Fotos sueltas sobre la mesa. Todas caen enteras en los huecos entre
 * estaciones: en reposo la estación llena la pantalla y ninguna asoma; al
 * levantar la cámara aparecen alrededor, y como flotan a distinta altura cada
 * una se desplaza a su ritmo —eso es lo que da la profundidad.
 */
const PRINTS: Print[] = [
  { src: "/images/daily-tangle.png", x: -0.74, y: 0.22, r: 5, z: 70, w: 0.2, tape: "¿Te suena?" },
  { src: "/images/hero-workbench.png", x: 0.68, y: -0.2, r: -7, z: 150, w: 0.19 },
  { src: "/images/process-discovery.png", x: 2.04, y: 0.22, r: 8, z: 100, w: 0.19 },
  { src: "/images/clear-flow.png", x: 3.5, y: 0.28, r: -5, z: 80, w: 0.22 },
  { src: "/images/apps-showcase.png", x: 1.16, y: 0.67, r: -3, z: 120, w: 0.17 },
  { src: "/images/webs-showcase.png", x: 1.58, y: 0.7, r: 4, z: 190, w: 0.17, tape: "Webs con carácter" },
  { src: "/images/process-momentum.png", x: 2.04, y: 1.12, r: 6, z: 60, w: 0.18 },
  { src: "/images/process-cocreate.png", x: 1.12, y: 2.46, r: 5, z: 130, w: 0.2 },
  { src: "/images/process-proposal.png", x: 2.62, y: 2.3, r: -6, z: 80, w: 0.19, tape: "Por escrito" },
]

/** Etiquetas del enredo: lo que hoy tiene el negocio repartido por todas partes. */
const TAGS: Tag[] = [
  { text: "WhatsApp", x: -1.08, y: -0.42, r: -9, z: 60, tone: "paper" },
  { text: "Facturas", x: -0.42, y: -0.86, r: 6, z: 110, tone: "paper" },
  { text: "Pedidos", x: 0.3, y: -0.72, r: -4, z: 40, tone: "paper" },
  { text: "Presupuestos", x: 1.0, y: -0.78, r: 7, z: 90, tone: "paper" },
  { text: "Hojas de cálculo", x: -1.2, y: 0.72, r: 4, z: 50, tone: "paper" },
  { text: "Menos caos. Más avance.", x: 0.68, y: 1.52, r: -4, z: 90, tone: "lime" },
  { text: "Todo en un mismo lugar", x: 2.2, y: 2.02, r: 3, z: 70, tone: "lime" },
]

function placedStyle({ x, y, r, z }: Placed, extra?: Record<string, number>) {
  return {
    "--x": x,
    "--y": y,
    "--r": `${r}deg`,
    "--z": `${z}px`,
    ...extra,
  } as CSSProperties
}

export function TableDecor() {
  const d = cablePath()

  return (
    <div className="spatial-decor" aria-hidden="true">
      <svg
        className="spatial-cable"
        style={
          {
            "--x": CABLE_BOX.x,
            "--y": CABLE_BOX.y,
            "--w": CABLE_BOX.width,
            "--h": CABLE_BOX.height,
          } as CSSProperties
        }
        viewBox={`${CABLE_BOX.x * CABLE_SCALE} ${CABLE_BOX.y * CABLE_SCALE} ${CABLE_BOX.width * CABLE_SCALE} ${CABLE_BOX.height * CABLE_SCALE}`}
        preserveAspectRatio="none"
      >
        <path className="spatial-cable-shadow" d={d} />
        <path className="spatial-cable-line" d={d} />
      </svg>

      <span
        className="spatial-exit"
        style={placedStyle({ x: CABLE_END[0], y: CABLE_END[1] - 0.12, r: -3, z: 60 })}
      >
        La salida clara →
      </span>

      {STATION_SPOTS.map((spot, index) => (
        <span
          className="spatial-station-tag"
          key={spot.id}
          style={placedStyle({
            x: spot.col * GAP_X - 0.5,
            y: spot.row * GAP_Y - 0.5,
            r: index % 2 === 0 ? -1.5 : 1.5,
            z: 30,
          })}
        >
          <b>{String(index + 1).padStart(2, "0")}</b>
          {spot.label}
        </span>
      ))}

      {TAGS.map((tag) => (
        <span
          className="spatial-tag"
          data-tone={tag.tone}
          key={tag.text}
          style={placedStyle(tag)}
        >
          {tag.text}
        </span>
      ))}

      {PRINTS.map((print) => (
        <figure
          className="spatial-print"
          key={print.src}
          style={placedStyle(print, { "--w": print.w })}
        >
          {/* `eager`: la carga diferida mide la distancia al viewport sin
              contar la cámara, y las fotos aparecerían en blanco al volar. */}
          <Image src={print.src} alt="" fill sizes="22vw" loading="eager" />
          {print.tape ? <span>{print.tape}</span> : null}
        </figure>
      ))}

      <span
        className="spatial-sticker"
        style={placedStyle({ x: 1.95, y: 2.78, r: -10, z: 40 })}
      >
        satorus.
      </span>
    </div>
  )
}
