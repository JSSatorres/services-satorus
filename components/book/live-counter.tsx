"use client"

import { useEffect, useState } from "react"

/**
 * Contador de mensajes sin contestar que no para de subir mientras nadie lo
 * atiende. Sólo corre en modo libro con movimiento permitido; si no, se queda
 * en la cifra de partida.
 */
export function LiveCounter({ from, to, everyMs = 2200 }: { from: number; to: number; everyMs?: number }) {
  const [value, setValue] = useState(from)

  useEffect(() => {
    if (document.documentElement.dataset.book !== "on") return
    const timer = window.setInterval(() => {
      setValue((current) => {
        if (current >= to) {
          window.clearInterval(timer)
          return current
        }
        return current + 1
      })
    }, everyMs)
    return () => window.clearInterval(timer)
  }, [to, everyMs])

  return <>{value}</>
}
