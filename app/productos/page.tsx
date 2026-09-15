import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, MoveUpRight } from "lucide-react";
import { ProjectShowcase } from "@/components/project-showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { appProjects, webProjects } from "@/lib/project-catalog";
import styles from "./catalogo.module.css";

const projectDestinations: Record<string, string> = {
  pidoteca: "https://pidoteca.com/",
  sportapp: "https://manage-sport-app.vercel.app/",
  "angel-mendoza": "https://angelmendoza.es/",
  enrolla2: "https://enrolla2.com/",
};

const showcasedProjects = [...appProjects, ...webProjects].map((project) => ({
  ...project,
  href: projectDestinations[project.slug] ?? project.href,
}));

export const metadata: Metadata = {
  title: "Proyectos: apps y webs",
  description: "Conoce las aplicaciones y páginas web que diseñamos y desarrollamos en Satorus.",
  alternates: { canonical: "/productos" },
  openGraph: {
    title: "Proyectos de Satorus",
    description: "Apps propias y webs creadas para negocios con algo claro que contar.",
    url: "/productos",
    images: [{ url: "/projects/pidoteca/overview.png" }],
  },
};

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className={styles.page}>
        <section className={styles.hero} aria-labelledby="projects-title">
          <div className={styles.heroCopy}>
            <p className={styles.heroLabel}>Proyectos reales. Decisiones visibles.</p>
            <h1 id="projects-title">No es solo<br />una pantalla.<br /><span>Es una decisión.</span></h1>
            <p className={styles.heroLead}>Hacemos apps y webs para quitar fricción y contar mejor lo que hace especial a cada negocio. Aquí puedes ver la solución y entender por qué tomó esa forma.</p>
            <a href="#proyectos" className={styles.heroLink}>Explorar proyectos <ArrowDown aria-hidden="true" size={19} /></a>
          </div>
          <div className={styles.heroProof} aria-label="Tres capturas reales de proyectos">
            <figure className={styles.proofPidoteca}>
              <div><Image src="/projects/pidoteca/customer-ordering-journey-wide.png" alt="Recorrido visual de Pidoteca desde la carta hasta el pedido" fill priority sizes="(max-width: 800px) 72vw, 23vw" /></div>
              <figcaption>Pidoteca <span>App · Restauración</span></figcaption>
            </figure>
            <figure className={styles.proofAngel}>
              <div><Image src="/projects/angel-mendoza/site-desktop.png" alt="Portada de la web de Ángel Mendoza" fill priority sizes="(max-width: 800px) 86vw, 29vw" /></div>
              <figcaption>Ángel Mendoza <span>Web · Marca personal</span></figcaption>
            </figure>
            <figure className={styles.proofEnrolla2}>
              <div><Image src="/projects/enrolla2/hero-desktop.png" alt="Portada de Enrolla2 con sus cinnamon rolls" fill priority sizes="(max-width: 800px) 70vw, 21vw" /></div>
              <figcaption>Enrolla2 <span>Web · Restauración</span></figcaption>
            </figure>
            <p className={styles.proofNote}>Tres formas distintas.<br />La misma pregunta: ¿qué necesita quien llega?</p>
          </div>
        </section>

        <ProjectShowcase
          id="proyectos"
          eyebrow="Un vistazo por dentro"
          title="La decisión detrás de cada proyecto"
          lead="Tres preguntas en cada proyecto: cuál era el reto, qué queríamos mejorar y por qué elegimos ese camino. Desliza para recorrerlos y abre cada proyecto desde su enlace."
          items={showcasedProjects}
        />

        <section className={styles.finalCta} aria-labelledby="projects-cta-title">
          <div className={styles.finalCopy}>
            <p className={styles.finalLabel}>De pantallas a personas</p>
            <h2 id="projects-cta-title">Tu negocio también tiene una <span>mejor versión.</span></h2>
            <p>Detrás de cada proyecto hay una conversación, muchas preguntas y una decisión: apostar por una web o una herramienta que ayude a avanzar de verdad. Hablemos de la tuya.</p>
            <Link href="/#contacto">Hablemos de tu proyecto <MoveUpRight aria-hidden="true" size={20} /></Link>
          </div>
          <div className={styles.finalSteps} aria-label="Nuestra forma de trabajar">
            <div><span>01</span><div><h3>Escuchamos tu contexto</h3><p>Cada negocio es distinto. Empezamos por entender el tuyo.</p></div></div>
            <div><span>02</span><div><h3>Diseñamos una solución a medida</h3><p>Sin plantillas por inercia: una web o app que encaje contigo.</p></div></div>
            <div><span>03</span><div><h3>Te acompañamos en el camino</h3><p>De la idea al lanzamiento, con pasos claros.</p></div></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
