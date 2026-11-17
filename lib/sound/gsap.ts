import type gsap from "gsap"
import { playSound, type PlayOptions, type SoundName } from "@/lib/sound/engine"

/** Volumen relativo cuando se vuelve hacia arriba: se oye, pero no compite. */
const BACKWARDS = 0.5

/** Dirección del scroll del ScrollTrigger que mueve este timeline (o el de su padre). */
function directionOf(timeline: gsap.core.Timeline) {
  let node: gsap.core.Timeline | null | undefined = timeline
  while (node) {
    if (node.scrollTrigger) return node.scrollTrigger.direction
    node = node.parent
  }
  return 1
}

/**
 * Engancha un sonido a un punto de un timeline. En los timelines con `scrub`
 * suena cuando el cabezal pasa por ese punto, en cualquier sentido: hacia
 * abajo a volumen normal, hacia arriba más bajo.
 */
export function cue(
  timeline: gsap.core.Timeline,
  position: gsap.Position,
  name: SoundName,
  opts: PlayOptions = {},
) {
  timeline.call(
    () => {
      const factor = directionOf(timeline) < 0 ? BACKWARDS : 1
      playSound(name, { ...opts, volume: (opts.volume ?? 1) * factor })
    },
    undefined,
    position,
  )
}

/** Inicio de lo último que se añadió al timeline (para colocar sonidos respecto a ello). */
export function recentStart(timeline: gsap.core.Timeline) {
  return (timeline.recent() as gsap.core.Animation).startTime()
}

/** Como `playSound`, pero más bajo si el scroll va hacia arriba. */
export function playScrolled(name: SoundName, direction: number, opts: PlayOptions = {}) {
  playSound(name, { ...opts, volume: (opts.volume ?? 1) * (direction < 0 ? BACKWARDS : 1) })
}
