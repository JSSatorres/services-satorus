"use client"

import type { CSSProperties } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { STATION_SPOTS } from "@/components/spatial/table-layout"

type SpatialCompassProps = {
  active: number
  showHint: boolean
  onSelect: (index: number) => void
  onStep: (direction: 1 | -1) => void
}

const COLS = Math.max(...STATION_SPOTS.map((spot) => spot.col)) + 1
const ROWS = Math.max(...STATION_SPOTS.map((spot) => spot.row)) + 1

/** Recorrido del cable en la miniatura, en celdas (centro = +0.5). */
const MINI_ROUTE = STATION_SPOTS.map(
  (spot) => `${spot.col + 0.5},${spot.row + 0.5}`,
).join(" ")

/**
 * Brújula de la mesa: la miniatura del recorrido con la estación actual, y
 * los mandos de anterior/siguiente. Es también el camino para quien no usa
 * rueda ni gestos: cada casilla es un botón que manda la cámara allí.
 */
export function SpatialCompass({
  active,
  showHint,
  onSelect,
  onStep,
}: SpatialCompassProps) {
  const current = STATION_SPOTS[active]
  const total = STATION_SPOTS.length

  return (
    <nav className="spatial-compass" aria-label="Recorrido por la mesa">
      <button
        type="button"
        className="spatial-compass-step"
        aria-label="Estación anterior"
        disabled={active === 0}
        onClick={() => onStep(-1)}
      >
        <ArrowUp aria-hidden="true" size={18} />
      </button>

      <div
        className="spatial-compass-map"
        style={{ "--cols": COLS, "--rows": ROWS } as CSSProperties}
      >
        <svg
          viewBox={`0 0 ${COLS} ${ROWS}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline points={MINI_ROUTE} />
        </svg>
        <ol>
          {STATION_SPOTS.map((spot, index) => (
            <li
              key={spot.id}
              style={
                {
                  gridColumn: spot.col + 1,
                  gridRow: spot.row + 1,
                } as CSSProperties
              }
            >
              <button
                type="button"
                aria-label={`Ir a ${spot.label}`}
                aria-current={index === active ? "step" : undefined}
                data-visited={index < active || undefined}
                onClick={() => onSelect(index)}
              >
                <span aria-hidden="true">{index + 1}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <p className="spatial-compass-label" aria-live="polite">
        <span>
          {String(active + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
        {current.label}
      </p>

      <button
        type="button"
        className="spatial-compass-step"
        aria-label="Estación siguiente"
        disabled={active === total - 1}
        onClick={() => onStep(1)}
      >
        <ArrowDown aria-hidden="true" size={18} />
      </button>

      <p className="spatial-hint" data-hidden={!showHint || undefined}>
        Desliza, usa la rueda o las flechas para recorrer la mesa
      </p>
    </nav>
  )
}
