"use client"

import { createContext, useContext } from "react"

type StationState = {
  /** La mesa está en modo espacial (cámara, estaciones y vuelo). */
  spatial: boolean
  /** La cámara se ha posado en esta estación. En modo plano siempre es cierto. */
  arrived: boolean
}

export const StationContext = createContext<StationState>({
  spatial: false,
  arrived: true,
})

/** Estado de la estación que contiene al componente. */
export function useStation() {
  return useContext(StationContext)
}
