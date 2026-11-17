"use client"

import { useSyncExternalStore } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { isSoundEnabled, playSound, setSoundEnabled, subscribeSound } from "@/lib/sound/engine"
import { useHydratedReducedMotion } from "@/components/use-hydrated-reduced-motion"

/**
 * Altavoz del header. El sonido viene activado; aquí se silencia (y se vuelve
 * a activar). Con movimiento reducido no se ofrece.
 */
export function SoundToggle() {
  // En el servidor se pinta encendido, que es lo normal (activado por defecto).
  const on = useSyncExternalStore(subscribeSound, isSoundEnabled, () => true)
  const reduce = useHydratedReducedMotion()
  if (reduce) return null

  const toggle = () => {
    const next = !on
    setSoundEnabled(next)
    if (next) {
      // El contexto acaba de despertar: un instante para que arranque.
      window.setTimeout(() => playSound("toggle"), 60)
    }
  }

  return (
    <button
      type="button"
      className="sound-toggle"
      data-on={on || undefined}
      data-sound="off"
      aria-pressed={on}
      aria-label={on ? "Silenciar los sonidos de la web" : "Activar los sonidos de la web"}
      title={on ? "Silenciar" : "Activar sonido"}
      onClick={toggle}
    >
      {on ? <Volume2 aria-hidden="true" size={18} strokeWidth={2.2} /> : <VolumeX aria-hidden="true" size={18} strokeWidth={2.2} />}
      <span className="sound-toggle-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </button>
  )
}
