import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Boxes, Globe2 } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { appProjects, type ProjectCatalogItem, webProjects } from "@/lib/project-catalog";
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

function AppProject({ project, index }: { project: ProjectCatalogItem; index: number }) {
  return (
    <article className={styles.appProject} data-accent={project.accent}>
      <div className={styles.projectIndex}>{String(index + 1).padStart(2, "0")}</div>
      <div className={styles.appCopy}>
        <p className={styles.projectEyebrow}>{project.eyebrow}</p>
        <h3>{project.name}</h3>
        <p className={styles.projectSummary}>{project.summary}</p>
        <Link href={project.href} className={styles.projectLink}>
          Ver el proyecto <ArrowUpRight aria-hidden="true" size={20} />
        </Link>
      </div>
      <Link href={project.href} className={styles.appVisual} aria-label={`Ver ${project.name}`}>
        <span>{project.status}</span>
        <div className={styles.appImage} data-phone={project.slug === "lector-bilingue" || undefined}>
          <Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 760px) 88vw, 48vw" />
        </div>
      </Link>
    </article>
  );
}

function WebProject({ project, index }: { project: ProjectCatalogItem; index: number }) {
  return (
    <article className={styles.webProject} data-accent={project.accent}>
      <Link href={project.href} className={styles.browserFrame} aria-label={`Ver el caso de ${project.name}`}>
        <div className={styles.browserBar} aria-hidden="true">
          <i /><i /><i />
          <span>{project.slug === "angel-mendoza" ? "angelmendoza.es" : "Enrolla2 · Valencia"}</span>
        </div>
        <div className={styles.webImage}>
          <Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 760px) 92vw, 44vw" />
        </div>
      </Link>
      <div className={styles.webCopy}>
        <p className={styles.projectEyebrow}>{String(index + 1).padStart(2, "0")} · {project.eyebrow}</p>
        <div><h3>{project.name}</h3><span>{project.status}</span></div>
        <p>{project.summary}</p>
        <Link href={project.href} className={styles.projectLink}>
          Leer el caso completo <ArrowUpRight aria-hidden="true" size={20} />
        </Link>
      </div>
    </article>
  );
}

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
            <nav aria-label="Categorías de proyectos">
              <a href="#apps"><Boxes size={19} aria-hidden="true" /> Apps <b>{appProjects.length}</b></a>
              <a href="#webs"><Globe2 size={19} aria-hidden="true" /> Webs <b>{webProjects.length}</b></a>
            </nav>
          </div>
          <ArrowDown className={styles.heroArrow} aria-hidden="true" size={32} />
        </section>

        <section id="apps" className={styles.appsSection} aria-labelledby="apps-title">
          <header className={styles.sectionHeading}>
            <div className={styles.categoryMark}><Boxes aria-hidden="true" /><span>01</span></div>
            <div><p>Productos que nacen en casa</p><h2 id="apps-title">Apps</h2></div>
            <p>Cuando un problema cotidiano pide una herramienta, la construimos y la llevamos hasta el uso real.</p>
          </header>
          <div className={styles.appList}>
            {appProjects.map((project, index) => <AppProject key={project.slug} project={project} index={index} />)}
          </div>
        </section>

        <section id="webs" className={styles.websSection} aria-labelledby="webs-title">
          <header className={styles.sectionHeading}>
            <div className={styles.categoryMark}><Globe2 aria-hidden="true" /><span>02</span></div>
            <div><p>Negocios que ya tienen algo que decir</p><h2 id="webs-title">Webs</h2></div>
            <p>Ordenamos la historia, encontramos una dirección visual propia y construimos una web pensada para convertir visitas en conversaciones.</p>
          </header>
          <div className={styles.webGrid}>
            {webProjects.map((project, index) => <WebProject key={project.slug} project={project} index={index} />)}
          </div>
          <div className={styles.nextSlot}><span>Siguiente caso</span><p>Esta colección seguirá creciendo.</p></div>
        </section>

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
