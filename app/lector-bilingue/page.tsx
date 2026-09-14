import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDownToLine,
  ArrowRight,
  Bookmark,
  BookOpenText,
  Files,
  Languages,
  ListOrdered,
  ShieldCheck,
} from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl } from "@/lib/site";
import styles from "./lector-bilingue.module.css";

const downloadPath = "/downloads/Lector-Bilingue-Satorus-v6.apk";

export const metadata: Metadata = {
  title: "Lector Bilingüe para Android",
  description:
    "Lee EPUB en inglés con su versión en español siempre a mano. Software gratuito de Satorus para Android.",
  alternates: { canonical: "/lector-bilingue" },
  openGraph: {
    title: "Lector Bilingüe | Satorus",
    description: "Tu lectura en inglés, con el español siempre a mano.",
    url: "/lector-bilingue",
    images: [
      {
        url: "/products/lector-bilingue/05-traduccion-bilingue.png",
        width: 430,
        height: 932,
        alt: "Lector Bilingüe muestra el texto original y su traducción en español.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lector Bilingüe | Satorus",
    description: "Tu lectura en inglés, con el español siempre a mano.",
    images: ["/products/lector-bilingue/05-traduccion-bilingue.png"],
  },
};

const features = [
  {
    icon: Languages,
    title: "Original y traducción, juntos",
    body: "Selecciona un fragmento en inglés y consulta en el mismo panel el original y su equivalente en español.",
  },
  {
    icon: Files,
    title: "Una biblioteca de parejas",
    body: "Guarda varios EPUB emparejados y cambia de libro desde una sola biblioteca.",
  },
  {
    icon: BookOpenText,
    title: "Vocabulario que se queda contigo",
    body: "Conserva palabras y significados ordenados alfabéticamente, incluso sin conexión.",
  },
  {
    icon: Bookmark,
    title: "Marcadores con contexto",
    body: "Guarda una página junto a una frase o una nota para volver justo donde importa.",
  },
  {
    icon: ListOrdered,
    title: "Retoma o salta directo",
    body: "La app recuerda tu posición y también te deja ir a otra escribiendo su número.",
  },
];

const steps = [
  "Elige el EPUB original en inglés.",
  "Añade la versión correspondiente en español.",
  "Guarda la pareja y empieza a leer.",
  "Selecciona un fragmento cuando necesites consultarlo.",
];

const screenshots = [
  {
    src: "/products/lector-bilingue/02-emparejar-libros.png",
    alt: "Pantalla de Lector Bilingüe para emparejar un EPUB inglés con su versión en español.",
    caption: "Empareja los dos EPUB antes de empezar.",
  },
  {
    src: "/products/lector-bilingue/04-lectura-y-navegacion.png",
    alt: "Pantalla de lectura de Lector Bilingüe con navegación por posición.",
    caption: "Consulta la posición y ve a cualquier punto.",
  },
  {
    src: "/products/lector-bilingue/05-traduccion-bilingue.png",
    alt: "Panel de Lector Bilingüe que compara un fragmento en inglés y español.",
    caption: "Consulta la traducción sin perder el hilo.",
  },
  {
    src: "/products/lector-bilingue/06-vocabulario.png",
    alt: "Lista de vocabulario personal guardado en Lector Bilingüe.",
    caption: "Tu vocabulario, disponible sin conexión.",
  },
  {
    src: "/products/lector-bilingue/07-marcadores.png",
    alt: "Lista de marcadores guardados con contexto en Lector Bilingüe.",
    caption: "Guarda una idea para volver a ella.",
  },
  {
    src: "/products/lector-bilingue/08-biblioteca-con-libro.png",
    alt: "Biblioteca de Lector Bilingüe con un libro emparejado.",
    caption: "Vuelve a cualquiera de tus parejas.",
  },
];

const faqs = [
  {
    question: "¿La aplicación traduce libros por Internet?",
    answer:
      "No. Compara dos EPUB que ya tienes: uno en inglés y otro en español.",
  },
  {
    question: "¿Puedo añadir varios libros?",
    answer: "Sí. La biblioteca admite varias parejas de EPUB.",
  },
  {
    question: "¿Pierdo mi progreso al cerrar la aplicación?",
    answer:
      "No. Se conservan el último libro, la posición, los marcadores y el vocabulario.",
  },
  {
    question: "¿Está disponible para iPhone?",
    answer: "Esta descarga es una aplicación APK para Android.",
  },
  {
    question: "¿Tiene algún coste?",
    answer: "No. Es software gratuito creado por Satorus.",
  },
];

function DownloadButton({ className }: { className?: string }) {
  return (
    <a className={`${styles.downloadButton} ${className ?? ""}`} href={downloadPath} download>
      Descargar gratis para Android
      <ArrowDownToLine aria-hidden="true" size={22} />
    </a>
  );
}

export default function BilingualReaderPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Lector Bilingüe",
    applicationCategory: "BookApplication",
    operatingSystem: "Android 6 o posterior",
    softwareVersion: "1.5",
    downloadUrl: absoluteUrl(downloadPath),
    image: absoluteUrl("/products/lector-bilingue/05-traduccion-bilingue.png"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    publisher: { "@type": "Organization", name: "Satorus" },
  };

  return (
    <>
      <SiteHeader />
      <main id="contenido" className={styles.page}>
        <section className={styles.hero} aria-labelledby="reader-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Aplicación Android · Gratis</p>
            <h1 id="reader-title">
              Lee en inglés.
              <span>Sin perder el hilo.</span>
            </h1>
            <p className={styles.lead}>
              Empareja tu EPUB en inglés con su versión en español. Lee con comodidad y
              consulta la traducción solo cuando la necesites.
            </p>
            <DownloadButton />
            <p className={styles.downloadFacts}>
              Versión 1.5 <span aria-hidden="true">·</span> Android 6 o posterior
              <span aria-hidden="true">·</span> aprox. 4 MB
            </p>
          </div>

          <div className={styles.heroVisual} aria-label="Vista del panel bilingüe de la aplicación">
            <div className={styles.translationNote} aria-hidden="true">
              <span>English</span>
              <ArrowRight size={18} />
              <strong>Español</strong>
            </div>
            <div className={styles.phoneFrame}>
              <Image
                src="/products/lector-bilingue/05-traduccion-bilingue.png"
                alt="Lector Bilingüe muestra el texto original y su traducción en español."
                fill
                priority
                sizes="(max-width: 720px) 70vw, (max-width: 1100px) 42vw, 360px"
              />
            </div>
            <p className={styles.heroCaption}>Original y traducción, en el mismo gesto.</p>
          </div>
        </section>

        <section className={styles.featureSection} aria-labelledby="features-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Hecha para leer</p>
            <h2 id="features-title">El español acompaña. No interrumpe.</h2>
            <p>
              Lector Bilingüe se centra en la lectura: te da contexto cuando lo necesitas
              y deja que el libro siga siendo el protagonista.
            </p>
          </div>
          <ol className={styles.featureList}>
            {features.map(({ icon: Icon, title, body }, index) => (
              <li key={title}>
                <span className={styles.featureNumber}>{String(index + 1).padStart(2, "0")}</span>
                <Icon aria-hidden="true" size={25} />
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.processSection} aria-labelledby="how-title">
          <div className={styles.processHeading}>
            <p className={styles.eyebrow}>Cuatro pasos, sin cuenta</p>
            <h2 id="how-title">Tu pareja de libros, lista para leer.</h2>
          </div>
          <ol className={styles.stepList}>
            {steps.map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
          <figure className={styles.processShot}>
            <Image
              src="/products/lector-bilingue/02-emparejar-libros.png"
              alt="Formulario para seleccionar los EPUB en inglés y español en Lector Bilingüe."
              fill
              sizes="(max-width: 720px) 75vw, 310px"
            />
          </figure>
        </section>

        <section className={styles.gallerySection} aria-labelledby="gallery-title">
          <div className={styles.galleryHeading}>
            <p className={styles.eyebrow}>La app, por dentro</p>
            <h2 id="gallery-title">Cada consulta conserva el contexto.</h2>
          </div>
          <div className={styles.gallery}>
            {screenshots.map((screenshot) => (
              <figure key={screenshot.src}>
                <div className={styles.galleryImage}>
                  <Image src={screenshot.src} alt={screenshot.alt} fill sizes="(max-width: 720px) 68vw, 28vw" />
                </div>
                <figcaption>{screenshot.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className={styles.privacySection} aria-labelledby="privacy-title">
          <div className={styles.privacyIcon} aria-hidden="true"><ShieldCheck size={42} /></div>
          <div>
            <p className={styles.eyebrow}>Privacidad sencilla</p>
            <h2 id="privacy-title">Tus libros se quedan en tu dispositivo.</h2>
            <p>
              Los EPUB, el vocabulario, los marcadores y el progreso se guardan localmente.
              No necesitas crear una cuenta. La aplicación no traduce libros por Internet:
              compara los dos EPUB que tú aportas.
            </p>
            <small>Utiliza archivos para los que tengas los permisos o derechos necesarios.</small>
          </div>
        </section>

        <section className={styles.faqSection} aria-labelledby="faq-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Preguntas habituales</p>
            <h2 id="faq-title">Antes de abrir tu primer libro.</h2>
          </div>
          <div className={styles.faqList}>
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}<span aria-hidden="true" /></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.finalCta} aria-labelledby="download-title">
          <p className={styles.eyebrow}>Lector Bilingüe · Android</p>
          <h2 id="download-title">Tu lectura en inglés, con el español siempre a mano.</h2>
          <DownloadButton className={styles.finalButton} />
          <p>Software gratuito creado por Satorus.</p>
          <aside className={styles.installation} aria-label="Cómo instalar la aplicación">
            <strong>Instalación</strong>
            <span>Descarga el APK, ábrelo y autoriza la instalación desde el navegador si Android te lo solicita.</span>
          </aside>
          <details className={styles.verification}>
            <summary>Verificar el archivo descargado</summary>
            <code>SHA-256: 970BE139BDB3AEB0CB8F0248AED756632E35D840909690252402187BCB60C6BD</code>
          </details>
        </section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
    </>
  );
}
