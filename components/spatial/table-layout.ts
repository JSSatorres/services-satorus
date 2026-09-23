/**
 * Geometría de la mesa.
 *
 * Todo se mide en "pantallas": una unidad X es el ancho del viewport y una
 * unidad Y su alto. Cada estación ocupa exactamente una pantalla y su centro
 * cae en `(col * GAP_X, row * GAP_Y)`. El sobrante entre estaciones (0.36 de
 * ancho, 0.34 de alto) es mesa a la vista: ahí viven el cable, las fotos y las
 * etiquetas que se ven al levantar la cámara, y que en reposo quedan fuera de
 * pantalla.
 */
export const GAP_X = 1.36
export const GAP_Y = 1.34

export type StationId =
  | "inicio"
  | "como-trabajamos"
  | "proyectos"
  | "hablamos-claro"
  | "diagnostico"
  | "preguntas"
  | "contacto"

export type StationSpot = {
  id: StationId
  label: string
  col: number
  row: number
}

/**
 * Orden del recorrido = orden en que el cable pasa por ellas: una serpiente de
 * izquierda a derecha, vuelta de derecha a izquierda y bajada final al
 * contacto, donde el cable sale de la mesa.
 */
export const STATION_SPOTS: StationSpot[] = [
  { id: "inicio", label: "Inicio", col: 0, row: 0 },
  { id: "como-trabajamos", label: "Cómo trabajamos", col: 1, row: 0 },
  { id: "proyectos", label: "Proyectos", col: 2, row: 0 },
  { id: "hablamos-claro", label: "Sin esperar", col: 2, row: 1 },
  { id: "diagnostico", label: "Dónde se frena", col: 1, row: 1 },
  { id: "preguntas", label: "Preguntas", col: 0, row: 1 },
  { id: "contacto", label: "Hablemos", col: 0, row: 2 },
]

type Point = [x: number, y: number]

/**
 * Puntos por los que pasa el cable, en unidades de pantalla. Además de los
 * centros de las estaciones lleva desvíos en los huecos para que no sea una
 * línea de metro: entra enredado por arriba a la izquierda —el lío del día a
 * día— y sale limpio por abajo a la derecha.
 */
const CABLE_POINTS: Point[] = [
  [-1.25, -0.95],
  [-0.78, -0.4],
  [-1.02, -0.62],
  [-0.9, -0.82],
  [-0.62, -0.72],
  [-0.66, -0.2],
  [0, 0],
  [0.68, 0.16],
  [1.36, 0],
  [2.04, -0.14],
  [2.72, 0],
  [2.98, 0.67],
  [2.72, 1.34],
  [2.04, 1.5],
  [1.36, 1.34],
  [0.68, 1.2],
  [0, 1.34],
  [-0.24, 2.01],
  [0, 2.68],
  [0.7, 2.86],
  [1.4, 2.62],
  [2.2, 2.78],
  [2.9, 2.62],
]

export const CABLE_END = CABLE_POINTS[CABLE_POINTS.length - 1]

/** Unidades del viewBox por unidad de pantalla. */
export const CABLE_SCALE = 100

/** Caja que ocupa el SVG del cable, en unidades de pantalla. */
export const CABLE_BOX = { x: -1.5, y: -1.2, width: 4.9, height: 4.4 }

/**
 * Curva Catmull-Rom convertida a Bézier cúbicas: pasa por todos los puntos y
 * sin esquinas, que es lo que hace que parezca un cable y no una polilínea.
 */
export function cablePath(points: Point[] = CABLE_POINTS) {
  const scaled = points.map(([x, y]) => [x * CABLE_SCALE, y * CABLE_SCALE])
  let d = `M${scaled[0][0].toFixed(1)} ${scaled[0][1].toFixed(1)}`

  for (let index = 0; index < scaled.length - 1; index += 1) {
    const p0 = scaled[index - 1] ?? scaled[index]
    const p1 = scaled[index]
    const p2 = scaled[index + 1]
    const p3 = scaled[index + 2] ?? p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }

  return d
}
