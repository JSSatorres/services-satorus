import { Hero } from "@/components/Hero"
import { Problem } from "@/components/Problem"
import { Services } from "@/components/Services"
import { Partners } from "@/components/Partners"
import { LegalTech } from "@/components/LegalTech"
import { Methodology } from "@/components/Methodology"
import { ContactSection, Footer } from "@/components/Contact"

export default function Home() {
  return (
    <main className="min-h-screen">
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
