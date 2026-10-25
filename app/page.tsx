import { SiteHeader } from "@/components/site-header"
import { BookHome } from "@/components/book/book-home"
import { homeFaqJsonLd, jsonLdScript } from "@/lib/structured-data"

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(homeFaqJsonLd)}
      />
      <SiteHeader />
      <main id="contenido">
        <BookHome />
      </main>
    </>
  )
}
