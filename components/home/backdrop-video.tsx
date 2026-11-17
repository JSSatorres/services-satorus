"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useHydratedReducedMotion } from "@/components/use-hydrated-reduced-motion"

/**
 * Vídeo de fondo decorativo: el bucle de la mesa (del lío a lo ordenado).
 * No pide el vídeo hasta que el bloque se acerca a la pantalla, lo pausa al
 * salir y, con movimiento reducido, se queda en la foto fija.
 *
 * Se usa con `position: fixed` dentro de una ventana con `clip-path` para el
 * efecto de «fondo quieto y el contenido sube por encima».
 */

const SRC = "/videos/satorus-hero-loop-mobile.mp4"

export function BackdropVideo({
  className,
  poster = "/images/daily-tangle.png",
  startAt = 0,
}: {
  className?: string
  poster?: string
  /** Segundo en el que arranca (el bucle empieza con el lío y acaba ordenado). */
  startAt?: number
}) {
  const reduce = useHydratedReducedMotion()
  const boxRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    const box = boxRef.current
    if (!box || reduce) return
    let near = false
    const sync = () => {
      const video = videoRef.current
      if (!video) return
      if (near && document.visibilityState === "visible") void video.play().catch(() => undefined)
      else video.pause()
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting
        if (near) setLoad(true)
        sync()
      },
      { rootMargin: "50% 0px" },
    )
    observer.observe(box)
    document.addEventListener("visibilitychange", sync)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", sync)
    }
  }, [reduce])

  return (
    <div className={className} ref={boxRef} aria-hidden="true">
      <Image src={poster} alt="" fill sizes="100vw" />
      {load && !reduce ? (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          onLoadedMetadata={(event) => {
            if (startAt) event.currentTarget.currentTime = startAt
          }}
        >
          <source src={SRC} type="video/mp4" />
        </video>
      ) : null}
    </div>
  )
}
