/**
 * Puente entre la mesa espacial del home y quien quiera moverse por ella.
 *
 * La mesa (`SpatialHome`) registra aquí su navegador al montarse. El header y
 * cualquier enlace `/#seccion` preguntan primero a la mesa: si está activa, la
 * cámara vuela a esa estación y el enlace no hace scroll. Si no hay mesa —otra
 * página, movimiento reducido— `navigateSpatial` devuelve `false` y el enlace
 * sigue su camino de siempre.
 */
type Navigator = (stationId: string) => boolean

let navigator: Navigator | null = null

export const SPATIAL_ACTIVE_EVENT = "satorus:spatial-active"

/** Clave de sesión con la estación a la que volver al regresar al home. */
export const SPATIAL_RETURN_KEY = "satorus:spatial-return"

/** Clave de sesión que avisa a la página siguiente de que llega en picado. */
export const SPATIAL_DIVE_KEY = "satorus:spatial-dive"

export function registerSpatialNavigator(next: Navigator | null) {
  navigator = next
}

export function navigateSpatial(stationId: string) {
  return navigator ? navigator(stationId) : false
}

export function isSpatialActive() {
  return navigator !== null
}

/** Publica la estación en la que se ha posado la cámara. */
export function announceSpatialStation(stationId: string) {
  window.dispatchEvent(
    new CustomEvent<string>(SPATIAL_ACTIVE_EVENT, { detail: stationId }),
  )
}
