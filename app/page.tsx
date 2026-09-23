import { SiteHeader } from "@/components/site-header"
import { SpatialHome } from "@/components/spatial/spatial-home"

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <SpatialHome />
      </main>
    </>
  )
}
