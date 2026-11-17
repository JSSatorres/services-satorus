"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { hushSound, playSound, unlockSound } from "@/lib/sound/engine"

gsap.registerPlugin(ScrollTrigger)

/** Lo que cuenta como «botón» para los sonidos de interfaz. */
const INTERACTIVE = 'a[href], button, summary, [role="tab"]'

const target = (node: EventTarget | null) =>
  node instanceof Element ? node.closest<HTMLElement>(INTERACTIVE) : null

const muted = (element: HTMLElement) =>
  element.closest('[data-sound="off"]') !== null ||
  element.matches(":disabled, [aria-disabled='true']")

/**
 * Sonido global (capa de interfaz):
 * - desbloquea el audio en el primer clic/tecla/toque si la persona ya lo
 *   tenía activado de otra visita;
 * - roce suave al pasar el ratón por botones y enlaces (sólo con ratón:
 *   en móvil no hay «pasar por encima»);
 * - toque al pulsar;
 * - silencio mientras ScrollTrigger vuelve a medir, que hace saltar los
 *   timelines y dispararía sus sonidos de golpe.
 */
export function SoundEffects() {
  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")

    const onGesture = () => unlockSound()

    const onOver = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType !== "mouse") return
      const element = target(event.target)
      if (!element || element === target(event.relatedTarget) || muted(element)) return
      playSound("hover")
    }

    const onClick = (event: MouseEvent) => {
      const element = target(event.target)
      if (!element || muted(element)) return
      if (element.matches("summary")) {
        const open = element.parentElement instanceof HTMLDetailsElement && !element.parentElement.open
        playSound("tick", { note: open ? 2 : 0 })
        return
      }
      playSound("click")
    }

    const onRefreshInit = () => hushSound(700)
    const onRefresh = () => hushSound(250)

    // Al cargar, los timelines se colocan en su sitio: que eso no suene.
    hushSound(1500)

    document.addEventListener("pointerdown", onGesture, { capture: true, passive: true })
    document.addEventListener("keydown", onGesture, { capture: true })
    document.addEventListener("touchend", onGesture, { capture: true, passive: true })
    document.addEventListener("pointerover", onOver, { passive: true })
    document.addEventListener("click", onClick, { capture: true })
    ScrollTrigger.addEventListener("refreshInit", onRefreshInit)
    ScrollTrigger.addEventListener("refresh", onRefresh)

    return () => {
      document.removeEventListener("pointerdown", onGesture, { capture: true })
      document.removeEventListener("keydown", onGesture, { capture: true })
      document.removeEventListener("touchend", onGesture, { capture: true })
      document.removeEventListener("pointerover", onOver)
      document.removeEventListener("click", onClick, { capture: true })
      ScrollTrigger.removeEventListener("refreshInit", onRefreshInit)
      ScrollTrigger.removeEventListener("refresh", onRefresh)
    }
  }, [])

  return null
}
