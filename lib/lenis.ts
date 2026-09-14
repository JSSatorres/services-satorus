import type Lenis from "lenis";

let instance: Lenis | null = null;

/** Registra la instancia activa de Lenis (sólo la monta `SmoothScroll`). */
export function setLenis(next: Lenis | null) {
  instance = next;
}

/**
 * Devuelve la instancia activa, o `null` si el scroll suavizado está apagado
 * (movimiento reducido, o antes de montar). Quien la use debe tener siempre un
 * camino alternativo con el scroll nativo.
 */
export function getLenis() {
  return instance;
}

/** Salta a una posición del documento respetando el motor de scroll activo. */
export function jumpToScrollTop(top: number) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(top, { immediate: true, force: true });
    return;
  }

  window.scrollTo({ top, behavior: "auto" });
}
