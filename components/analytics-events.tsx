"use client"

import { useEffect } from "react"
import { track } from "@vercel/analytics"

/**
 * Cuenta los contactos que salen de la web: clics en WhatsApp, en el teléfono
 * y en el correo. El envío del formulario lo cuenta `ContactForm`. No guarda
 * datos personales: sólo el tipo de contacto y la página.
 */
export function AnalyticsEvents() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const href = (event.target as Element | null)?.closest?.("a[href]")?.getAttribute("href")
      if (!href) return

      const page = window.location.pathname
      if (href.startsWith("https://wa.me/")) track("contacto_whatsapp", { pagina: page })
      else if (href.startsWith("tel:")) track("contacto_telefono", { pagina: page })
      else if (href.startsWith("mailto:")) track("contacto_correo", { pagina: page })
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  return null
}
