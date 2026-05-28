import { Nav, Hero } from "@/components/Hero"
import { Stats, Marquee, Problem } from "@/components/Problem"
import { Services } from "@/components/Services"
import { AaaSShowcase } from "@/components/AaaSShowcase"
import { Capas, Proceso } from "@/components/Methodology"
import { ContactSection, Footer } from "@/components/Contact"
import { Ambient } from "@/components/Ambient"

import { localBusinessSchema } from "@/lib/schema"

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Ambient />
      <div className="cursor-glow" aria-hidden="true"></div>
      <Nav />
      <main id="top">
        <Hero />
        <Stats />
        <Marquee />
        <Problem />
        <Services />
        <AaaSShowcase />
        <Capas />
        <Proceso />
        <ContactSection />
        <Footer />
      </main>
    </>
  )
}
