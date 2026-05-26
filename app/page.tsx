import { Hero } from "@/components/Hero"
import { ScrollVideo } from "@/components/ScrollVideo"
import { Problem } from "@/components/Problem"
import { Services } from "@/components/Services"
import { AaaSShowcase } from "@/components/AaaSShowcase"
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
      <ScrollVideo />
      <Problem />
      <Services />
      <AaaSShowcase />
      <Methodology />
      <ContactSection />
      <Footer />
    </main>
  )
}
