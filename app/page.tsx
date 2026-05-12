import { Hero } from "@/components/Hero"
import { Problem } from "@/components/Problem"
import { Services } from "@/components/Services"
import { AaaSShowcase } from "@/components/AaaSShowcase"
import { LegalTech } from "@/components/LegalTech"
import { Methodology } from "@/components/Methodology"
import { ContactSection, Footer } from "@/components/Contact"

import { localBusinessSchema } from "@/lib/schema"

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Hero />
      <Problem />
      <Services />
      <AaaSShowcase />
      <LegalTech />
      <Methodology />
      <ContactSection />
      <Footer />
    </main>
  )
}
