import { Hero } from "@/components/Hero"
import { Problem } from "@/components/Problem"
import { Services } from "@/components/Services"
import { Partners } from "@/components/Partners"
import { LegalTech } from "@/components/LegalTech"
import { Methodology } from "@/components/Methodology"
import { ContactSection, Footer } from "@/components/Contact"

import { localBusinessSchema } from "@/lib/schema"

export default function Home() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Hero />
      <Problem />
      <Services />
      <Partners />
      <LegalTech />
      <Methodology />
      <ContactSection />
      <Footer />
    </main>
  )
}
