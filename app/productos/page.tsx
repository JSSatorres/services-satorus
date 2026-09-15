import type { Metadata } from "next";
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
          <p className={styles.kicker}>Trabajo seleccionado · Satorus</p>
          <h1 id="projects-title">Lo que hacemos<span>se puede abrir.</span></h1>
          <div className={styles.heroBottom}>
            <p>Diseñamos productos propios y webs para negocios. Aquí enseñamos el resultado, pero también las decisiones que hay detrás.</p>
          </div>
          <ArrowDown className={styles.heroArrow} aria-hidden="true" size={32} />
        </section>

        <ProjectShowcase
          id="proyectos"
          eyebrow="Apps propias y webs para negocios"
          title="Proyectos"
          lead="Unos nacen en casa cuando un problema cotidiano pide una herramienta; otros parten de un negocio que ya tiene algo que decir. Todos se pueden abrir."
          items={[...appProjects, ...webProjects]}
        />

        <div className={styles.nextSlot}>
          <span>Siguiente caso</span>
          <p>Esta colección seguirá creciendo.</p>
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
