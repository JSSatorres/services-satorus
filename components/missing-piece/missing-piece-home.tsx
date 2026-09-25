import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { SiteFooter } from "@/components/site-footer";
import { faqs, processSteps } from "@/lib/home-content";
import { allProjects } from "@/lib/project-catalog";
import { MissingPieceScene } from "./missing-piece-scene";
import styles from "./missing-piece.module.css";

const services = [
  {
    type: "WEB",
    title: "Que te encuentren. Y te elijan.",
    description:
      "Una web que explica lo que haces, muestra por qué elegirte y pone fácil el siguiente paso.",
    example: "De «¿a qué os dedicáis?» a «quiero hablar con vosotros».",
  },
  {
    type: "APLICACIÓN",
    title: "Una herramienta a tu manera.",
    description:
      "Pedidos, reservas, equipo o gestión. Construimos alrededor de tu forma de trabajar y aprovechamos lo que ya te sirve.",
    example: "De buscar en tres sitios a tenerlo todo a mano.",
  },
  {
    type: "AUTOMATIZACIÓN + IA",
    title: "Lo repetitivo puede seguir solo.",
    description:
      "Conectamos herramientas y simplificamos tareas. Incorporamos IA cuando aporta una mejora concreta, con los controles que necesites.",
    example: "De copiar cada dato a revisar lo que importa.",
  },
];
const featuredProjects = ["goblintrader", "enrolla2", "pidoteca"].flatMap(
  (slug) => allProjects.filter((project) => project.slug === slug),
);

export function MissingPieceHome() {
  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-title" id="inicio">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <span className={styles.orangeDot} /> WEBS, APPS Y AUTOMATIZACIONES
            PARA PYMES
          </p>
          <h1 id="home-title">
            Tu negocio.
            <br />
            La pieza
            <br />
            <span>que faltaba.</span>
          </h1>
          <p className={styles.heroDescription}>
            Hay algo que podría funcionar mejor.
            <br />
            Lo entendemos contigo y construimos
            <br /> la solución que encaja.
          </p>
          <a className={styles.primaryLink} href="#contacto">
            Cuéntanos qué te frena <ArrowUpRight size={22} aria-hidden="true" />
          </a>
          <a className={styles.heroExplore} href="#diagnostico">
            <ArrowDown size={16} aria-hidden="true" /> Descubre dónde podemos
            ayudarte
          </a>
        </div>
        <MissingPieceScene />
        <div className={styles.heroFoot}>
          <span>Tu negocio pone la historia. Nosotros, las herramientas.</span>
          <span>Hecho a medida. Explicado en claro.</span>
        </div>
      </section>
      <section
        className={styles.solutions}
        id="diagnostico"
        aria-labelledby="solutions-title"
      >
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>LO QUE PODEMOS CONSTRUIR</p>
          <h2 id="solutions-title">
            Cada negocio tiene
            <br />
            su <span className={styles.underline}>pieza pendiente.</span>
          </h2>
          <p>
            Puede ser cómo te ven, cómo trabajas o lo que te toca repetir cada
            día. Empezamos por ahí.
          </p>
        </div>
        <div>
          {services.map((service) => (
            <details className={styles.service} key={service.type}>
              <summary>
                <span className={styles.serviceType}>{service.type}</span>
                <h3>{service.title}</h3>
                <span className={styles.serviceToggle}>
                  <Plus size={23} aria-hidden="true" />
                </span>
              </summary>
              <div className={styles.serviceBody}>
                <p>{service.description}</p>
                <p className={styles.serviceExample}>{service.example}</p>
                <a href="#contacto">
                  Hablemos de tu caso{" "}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </div>
            </details>
          ))}
        </div>
      </section>
      <section
        className={styles.work}
        id="proyectos"
        aria-labelledby="work-title"
      >
        <div className={styles.workHeading}>
          <div>
            <p className={styles.eyebrow}>DEL PROBLEMA A ALGO QUE PUEDES VER</p>
            <h2 id="work-title">
              Piezas que
              <br />
              ya encajan.
            </h2>
          </div>
          <Link className={styles.textLink} href="/productos">
            Todos los proyectos <ArrowUpRight size={21} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.projects}>
          {featuredProjects.map((project, index) => (
            <Link
              href={project.href}
              className={`${styles.project} ${index === 0 ? styles.featuredProject : ""}`}
              key={project.slug}
            >
              <div className={styles.projectImage} data-project={project.slug}>
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes={
                    index === 0
                      ? "(max-width: 760px) 92vw, 62vw"
                      : "(max-width: 760px) 92vw, 44vw"
                  }
                />
                <span className={styles.projectOpen}>
                  <ArrowUpRight size={26} aria-hidden="true" />
                </span>
              </div>
              <div className={styles.projectCopy}>
                <p className={styles.projectType}>
                  {project.eyebrow} · {project.status}
                </p>
                <h3>{project.name}</h3>
                <p>{project.challenge}</p>
                <span className={styles.projectRead}>
                  Ver qué construimos{" "}
                  <ArrowRight size={18} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section
        className={styles.process}
        id="como-trabajamos"
        aria-labelledby="process-title"
      >
        <div className={styles.processIntro}>
          <p className={styles.eyebrow}>ASÍ TRABAJAMOS</p>
          <h2 id="process-title">
            Primero escuchamos.
            <br />
            Después, encajamos.
          </h2>
          <p>
            No necesitas traer la solución pensada. Cuéntanos cómo trabajas y
            qué te gustaría mejorar.
          </p>
        </div>
        <ol className={styles.steps}>
          {processSteps.map((step, index) => (
            <li key={step.title}>
              <span className={styles.stepNumber}>0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
        <p className={styles.processNote}>
          Alcance, inversión y plazos por escrito antes de empezar.{" "}
          <ArrowUpRight size={20} aria-hidden="true" />
        </p>
      </section>
      <section
        className={styles.questions}
        aria-labelledby="questions-title"
        id="preguntas"
      >
        <div>
          <p className={styles.eyebrow}>ANTES DE DAR EL PASO</p>
          <h2 id="questions-title">Las cosas claras.</h2>
          <p>También lo que suele dar más dudas.</p>
        </div>
        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>
                {faq.question}
                <Plus size={19} aria-hidden="true" />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section
        className={styles.contact}
        id="contacto"
        aria-labelledby="contact-title"
      >
        <div className={styles.contactCopy}>
          <p className={styles.eyebrow}>LA SIGUIENTE PIEZA PUEDE SER LA TUYA</p>
          <h2 id="contact-title">
            ¿Qué parte
            <br />
            te está
            <br />
            <span>frenando?</span>
          </h2>
          <p>
            Una web que se ha quedado atrás. Un trabajo que repites demasiado.
            Una idea que todavía no sabes cómo construir.
          </p>
          <p>Cuéntanoslo con tus palabras.</p>
          <a href="mailto:info@satorus.es">
            info@satorus.es <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        </div>
        <ContactForm />
      </section>
      <SiteFooter />
    </div>
  );
}
