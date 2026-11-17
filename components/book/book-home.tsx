import { ContactForm } from "@/components/contact-form"
import { SiteFooter } from "@/components/site-footer"
import { HomeHero } from "@/components/home/home-hero"
import { DeskBand, NextStepSection, OffersSection } from "@/components/home/home-sections"
import { ProcessSection } from "@/components/home/process-section"
import { NoiseSection } from "@/components/home/noise-section"
import { HubSection } from "@/components/home/hub-section"
import { AppDemoSection } from "@/components/home/app-demo-section"
import { FixedBand, FloatingWords } from "@/components/home/fixed-band"
import { ScrollRefresh } from "@/components/home/stack-motion"
import { IntroLoader } from "@/components/home/intro-loader"
// El cuaderno (`@/components/book/book`) está fuera del home por ahora; se
// guarda para reutilizarlo en otra página.
import { SectionAnchors } from "@/components/book/section-anchors"
import { faqs } from "@/lib/home-content"
import { companyPhone } from "@/lib/site"

/**
 * Home: la portada con la demo del asistente, el cuaderno con el antes y el
 * después, cómo trabajamos, qué hacemos, el siguiente paso, las dudas y la
 * página en blanco para escribirnos. Todo se lee con el scroll normal.
 */
export function BookHome() {
  return (
    <>
      <IntroLoader />
      <ScrollRefresh />
      <SectionAnchors />
      <NoiseSection />
      <HubSection />
      <AppDemoSection />
      <HomeHero first={false} />
      <DeskBand />
      <ProcessSection />
      <OffersSection />
      <NextStepSection />

      <div className="nb-after">
        <section className="nb-chapter" id="preguntas" aria-labelledby="preguntas-title">
          <header className="nb-chapter-head">
            <p className="nb-chapter-num">
              <span>Notas al margen</span>
            </p>
            <h2 id="preguntas-title">Lo que casi todos preguntan antes.</h2>
            <p className="nb-chapter-lead">
              Si tu duda no está aquí, escríbela en la página siguiente.
            </p>
          </header>
          <div className="nb-notes">
            {faqs.map((faq, index) => (
              <details className="nb-note" key={faq.question}>
                <summary>
                  <span className="nb-note-mark" aria-hidden="true">
                    {index + 1}
                  </span>
                  {faq.question}
                  <span className="nb-note-sign" aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <FixedBand className="fw--outro" tone="ink" poster="/images/clear-flow.png" startAt={7}>
        <FloatingWords className="fw-words" words={["Menos", "lío.", "Más", "negocio."]} />
        <p className="hs-band-text">Lo que te quita tiempo, déjanoslo a nosotros.</p>
      </FixedBand>

      <section className="nb-contact" id="contacto" aria-labelledby="contacto-title">
        <div className="nb-contact-copy">
          <p className="nb-chapter-num">
            <span>Tu página</span>
          </p>
          <h2 id="contacto-title">La siguiente historia es la tuya.</h2>
          <p>
            Cuéntanos a qué se dedica tu negocio y qué te gustaría ordenar.
            Revisaremos tu consulta y te contactaremos para entender mejor lo
            que necesitas.
          </p>
          <a href="mailto:info@satorus.es">info@satorus.es</a>
          <a href={companyPhone.href}>{companyPhone.display}</a>
        </div>
        <div className="nb-contact-sheet">
          <ContactForm />
        </div>
      </section>
      <SiteFooter />
    </>
  )
}
