"use client"

import { useEffect } from "react"
import { scrollToSection } from "@/lib/lenis"

/**
 * Los enlaces internos a secciones (`#preguntas`, `#contacto`) se desplazan con el mismo
 * motor que el scroll, sin saltos ni transiciones añadidas: pasar de página es
 * leer, no un efecto.
 */
export function SectionAnchors() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as Element | null)?.closest?.("a[href^='#']")
      const id = anchor?.getAttribute("href")?.slice(1)
      if (!id) return
      const section = document.getElementById(id)
      if (!section) return

      event.preventDefault()
      window.history.pushState(null, "", `#${id}`)
      scrollToSection(section)
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  return null
}
