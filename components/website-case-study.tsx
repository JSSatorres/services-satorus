import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import styles from "@/app/project-detail.module.css";

type Decision = { title: string; body: string };
type GalleryImage = { src: string; alt: string; label: string; caption: string; fit?: "contain"; position?: "top" };

type WebsiteCaseStudyProps = {
  tone: "cyan" | "rose";
  eyebrow: string;
  title: string;
  accentTitle: string;
  lead: string;
  heroImage: string;
  heroAlt: string;
  domainLabel: string;
  challengeTitle: string;
  problem: string;
  response: string;
  decisionTitle: string;
  decisionIntro: string;
  decisions: Decision[];
  galleryTitle: string;
  galleryIntro: string;
  gallery: GalleryImage[];
  services: string[];
  ctaEyebrow: string;
  ctaTitle: string;
};

export function WebsiteCaseStudy(props: WebsiteCaseStudyProps) {
  return <>
    <SiteHeader />
    <main id="contenido" className={`${styles.page} ${styles[props.tone]}`}>
      <div className={styles.backRow}><Link href="/productos#webs"><ArrowLeft size={18} aria-hidden="true" /> Volver a Webs</Link></div>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>{props.eyebrow}</p>
          <h1>{props.title}<span>{props.accentTitle}</span></h1>
          <p className={styles.lead}>{props.lead}</p>
          <div className={styles.heroActions}><a className={styles.primary} href="#decisiones">Ver las decisiones</a><Link className={styles.secondary} href="/#contacto">Quiero una web así</Link></div>
        </div>
        <div className={styles.heroStage}>
          <div className={styles.heroShot}>
            <div className={styles.browserBar} aria-hidden="true"><i /><i /><i /><span>{props.domainLabel}</span></div>
            <Image src={props.heroImage} alt={props.heroAlt} fill priority sizes="(max-width:800px) 92vw,54vw" />
          </div>
        </div>
      </section>
      <section className={styles.intro}>
        <div><p className={styles.eyebrow}>El reto</p><h2>{props.challengeTitle}</h2></div>
        <div className={styles.introText}><p><strong>Lo que había que resolver</strong>{props.problem}</p><p><strong>La dirección</strong>{props.response}</p></div>
      </section>
      <section id="decisiones" className={styles.decisionSection}>
        <header className={styles.decisionHeading}><div><p className={styles.eyebrow}>Por qué está hecha así</p><h2>{props.decisionTitle}</h2></div><p>{props.decisionIntro}</p></header>
        <ol className={styles.decisions}>{props.decisions.map((decision, index) => <li key={decision.title}><span>{String(index + 1).padStart(2,"0")}</span><h3>{decision.title}</h3><p>{decision.body}</p></li>)}</ol>
      </section>
      <section className={styles.gallery}>
        <header className={styles.galleryHeading}><div><p className={styles.eyebrow}>La web en contexto</p><h2>{props.galleryTitle}</h2></div><p>{props.galleryIntro}</p></header>
        <div className={styles.galleryGrid}>{props.gallery.map((image) => <figure key={image.src}><div className={styles.imageFrame} data-fit={image.fit} data-position={image.position}><Image src={image.src} alt={image.alt} fill sizes="(max-width:800px) 92vw,58vw" /></div><figcaption><span>{image.label}</span><span>{image.caption}</span></figcaption></figure>)}</div>
      </section>
      <section className={styles.services}><p>Trabajo realizado</p><ul>{props.services.map((service) => <li key={service}>{service}</li>)}</ul></section>
      <section className={styles.cta}><p className={styles.eyebrow}>{props.ctaEyebrow}</p><h2>{props.ctaTitle}</h2><Link href="/#contacto">Hablemos de tu web <ArrowUpRight size={22} aria-hidden="true" /></Link></section>
    </main>
    <SiteFooter />
  </>;
}
