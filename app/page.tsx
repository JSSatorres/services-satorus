import { SiteHeader } from "@/components/site-header"
import { BookHome } from "@/components/book/book-home"

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <BookHome />
      </main>
    </>
  )
}
