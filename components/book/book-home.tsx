import { ContactForm } from "@/components/contact-form"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/hero"
import { Book } from "@/components/book/book"
import { SectionAnchors } from "@/components/book/section-anchors"
import { faqs } from "@/lib/home-content"

/**
 * Home: la portada con la mesa de trabajo, el libro (siete historias) que
 * entra al bajar y, detrás, las dudas y la página en blanco para escribirnos.
 */
export function BookHome() {
  return (
    <>
      <SectionAnchors />
      <Hero />
      <Book />

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
        </div>
        <div className="nb-contact-sheet">
          <ContactForm />
        </div>
      </section>
      <SiteFooter />
    </>
  )
}
