import { Hero } from "@/components/Hero"
import { Services } from "@/components/Services"
import { Portfolio } from "@/components/Portfolio"
import { Benefits } from "@/components/Benefits"
import { ContactSection, Footer } from "@/components/Contact"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <Portfolio />
      <Benefits />
      <ContactSection />
      <Footer />
    </main>
  )
}
