import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ProjectShowcase } from "@/components/project-showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { appProjects, webProjects } from "@/lib/project-catalog";
import styles from "./catalogo.module.css";

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
          <h1 id="projects-title">Mira la pantalla.<span>Entiende la decisión.</span></h1>
          <div className={styles.heroProof} aria-label="Tres capturas reales de proyectos">
            <figure className={styles.proofPidoteca}>
              <div><Image src="/projects/pidoteca/overview.png" alt="Vista de Pidoteca, con carta y gestión conectadas" fill priority sizes="(max-width: 800px) 65vw, 25vw" /></div>
              <figcaption>Pidoteca <span>Una sala mejor conectada</span></figcaption>
            </figure>
            <figure className={styles.proofAngel}>
              <div><Image src="/projects/angel-mendoza/site-desktop.png" alt="Portada de la web de Ángel Mendoza" fill priority sizes="(max-width: 800px) 65vw, 25vw" /></div>
              <figcaption>Ángel Mendoza <span>Experiencia que se entiende</span></figcaption>
            </figure>
            <figure className={styles.proofEnrolla2}>
              <div><Image src="/projects/enrolla2/hero-desktop.png" alt="Portada de Enrolla2 con sus cinnamon rolls" fill priority sizes="(max-width: 800px) 65vw, 25vw" /></div>
              <figcaption>Enrolla2 <span>Antojo con camino al encargo</span></figcaption>
            </figure>
          </div>
          <div className={styles.heroBottom}>
            <p>Hacemos apps y webs para quitar fricción y contar mejor lo que hace especial a cada negocio. Aquí ves el resultado, qué queríamos mejorar y por qué elegimos ese camino. El resto está dentro de cada caso.</p>
            <a href="#proyectos" className={styles.heroLink}>Descubre los proyectos <ArrowDown aria-hidden="true" size={20} /></a>
          </div>
        </section>

        <ProjectShowcase
          id="proyectos"
          eyebrow="Apps propias y webs para negocios"
          title="Historias y decisiones"
          lead="Desliza para ver qué cambió y por qué. Cada captura es real; cada caso completo cuenta los detalles que aquí solo asomamos."
          items={[...appProjects, ...webProjects]}
        />

        <div className={styles.nextSlot}>
          <span>La próxima historia</span>
          <p>Esta colección seguirá creciendo. Quizá con tu proyecto.</p>
        </div>

        <section className={styles.finalCta} aria-labelledby="projects-cta-title">
          <p>¿Tu proyecto podría estar aquí?</p>
          <h2 id="projects-cta-title">Vamos a construir algo que merezca ser enseñado.</h2>
          <Link href="/#contacto">Cuéntanos qué necesitas <ArrowUpRight aria-hidden="true" size={24} /></Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
