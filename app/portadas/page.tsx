import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { HeroAsk, HeroFilm, HeroNetwork, HeroStrike, HeroTime, HeroUnify } from "@/components/portadas/portadas"
import "./portadas.css"

/* Página de trabajo para elegir la portada: no se indexa ni está en el sitemap. */
export const metadata: Metadata = {
  title: "Propuestas de portada",
  robots: { index: false, follow: false },
}

export default function PortadasPage() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <div className="pt-intro">
          <p>
            <b>Seis propuestas de portada.</b> Baja para verlas una detrás de otra. Los datos son de ejemplo.
          </p>
          <nav aria-label="Propuestas">
            <a href="#pt1">1 · Pregúntale</a>
            <a href="#pt2">2 · Un solo sitio</a>
            <a href="#pt3">3 · Tachadas</a>
            <a href="#pt4">4 · Vídeo</a>
            <a href="#pt5">5 · Red</a>
            <a href="#pt6">6 · Tu tarde</a>
          </nav>
        </div>
        <HeroAsk />
        <HeroUnify />
        <HeroStrike />
        <HeroFilm />
        <HeroNetwork />
        <HeroTime />
      </main>
    </>
  )
}
