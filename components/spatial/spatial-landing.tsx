"use client"

import { usePathname } from "next/navigation"
import { useEffect, useLayoutEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SPATIAL_DIVE_KEY, SPATIAL_RETURN_KEY } from "@/lib/spatial-nav"

/**
 * Aterrizaje de las páginas interiores.
 *
 * Cuando se sale de la mesa por un enlace, la cámara se hunde en él
 * (`SpatialHome`) y deja una marca en la sesión. La página que llega recoge la
 * marca y termina el movimiento: sube desde abajo, inclinada, y se asienta
 * plana. Sin marca —visita directa, recarga— no hace nada.
 */
export function SpatialLanding() {
  const pathname = usePathname()

  // Volver a la estación de la que se salió es cosa del botón "atrás". Un
  // enlace explícito al inicio (el logo) tiene que llevar al inicio.
  useEffect(() => {
    if (pathname === "/") return

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]")
      if (anchor?.getAttribute("href") === "/") {
        window.sessionStorage.removeItem(SPATIAL_RETURN_KEY)
      }
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [pathname])

  useLayoutEffect(() => {
    if (pathname === "/") return
    if (window.sessionStorage.getItem(SPATIAL_DIVE_KEY) !== "1") return
    window.sessionStorage.removeItem(SPATIAL_DIVE_KEY)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const main = document.querySelector<HTMLElement>("main")
    if (!main) return

    // El transform se retira al acabar: dejarlo puesto convertiría `main` en
    // bloque contenedor y rompería los `sticky` y los pins de la página.
    const tween = gsap.fromTo(
      main,
      {
        autoAlpha: 0,
        y: 90,
        scale: 0.92,
        rotationX: 12,
        transformPerspective: 1400,
        transformOrigin: "50% 0%",
      },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1.05,
        ease: "expo.out",
        clearProps: "all",
        onComplete: () => {
          gsap.registerPlugin(ScrollTrigger)
          ScrollTrigger.refresh()
        },
      },
    )

    // Terminar en vez de matar: la marca ya se ha consumido, y un tween cortado
    // dejaría la página invisible (el doble montaje de desarrollo lo provoca).
    return () => {
      tween.progress(1)
    }
  }, [pathname])

  return null
}
