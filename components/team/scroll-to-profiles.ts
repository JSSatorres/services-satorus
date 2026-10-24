import { getLenis } from "@/lib/lenis";

/**
 * Lleva a la sección de perfiles. Con un elemento como destino Lenis descuenta
 * a la vez el `scroll-padding-top` del documento y el `scroll-margin-top` de
 * la sección (los dos son la cabecera), así que se le pasa la posición exacta.
 */
export function scrollToProfiles() {
  const profiles = document.getElementById("perfiles");
  if (!profiles) return;

  const lenis = getLenis();
  if (lenis) {
    const margin = parseFloat(getComputedStyle(profiles).scrollMarginTop) || 0;
    lenis.scrollTo(profiles.getBoundingClientRect().top + window.scrollY - margin);
    return;
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  profiles.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
}
