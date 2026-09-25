"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import { processSteps, projectDoors, faqs } from "@/lib/home-content";
import { BusinessBottleneck } from "@/components/business-bottleneck";
import { ServiceShowcase } from "@/components/service-showcase";
import { ContactForm } from "@/components/contact-form";
import styles from "./office-tour.module.css";

// The copy and assets are preserved from development (f58b6fe), grouped by physical destination.
export function ProcessScreen() {
  const [selected, setSelected] = useState(0);
  return (
    <>
      <header className={styles.sectionHeading}>
        <p>01 / CÓMO TRABAJAMOS</p>
        <h2>
          Una mejora concreta.
          <br />
          Un plan claro.
        </h2>
        <p>
          Antes de construir, acordamos qué queremos mejorar, qué vamos a
          entregar y cómo comprobaremos que funciona.
        </p>
      </header>
      <div className={styles.processLayout}>
        <figure className={styles.processImage}>
          <Image
            loading="eager"
            src={processSteps[selected].image}
            alt={processSteps[selected].imageAlt}
            fill
            sizes="(max-width: 760px) 85vw, 42vw"
          />
          <figcaption>
            0{selected + 1} / {processSteps[selected].answer}
          </figcaption>
        </figure>
        <ol className={styles.processSteps}>
          {processSteps.map((step, index) => (
            <li key={step.title} data-selected={selected === index}>
              <button
                onClick={() => setSelected(index)}
                aria-label={`Ver paso ${index + 1}: ${step.title}`}
                aria-pressed={selected === index}
              >
                0{index + 1}
              </button>
              <div>
                <span>{step.answer}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
export function SolutionsScreen() {
  return (
    <>
      <p className={styles.kicker}>02 / SOLUCIONES PARA TU NEGOCIO</p>
      <div className={styles.diagnosis}>
        <BusinessBottleneck />
      </div>
      <div className={styles.services}>
        <ServiceShowcase />
      </div>
      <section className={styles.plainTalk} id="hablamos-claro">
        <p>
          La inteligencia artificial
          <br />
          no va a esperarte.
        </p>
        <h2>
          Tu competencia
          <br />
          tampoco.
        </h2>
        <p>El momento de empezar no es mañana. Es antes que ellos.</p>
        <a href="#contacto">
          Empezar ahora <ArrowUpRight size={20} aria-hidden="true" />
        </a>
      </section>
    </>
  );
}
export function ProjectsScreen() {
  return (
    <>
      <header className={styles.sectionHeading}>
        <p>03 / PROYECTOS</p>
        <h2>
          Una idea puede acabar
          <br />
          en una app o en una web.
        </h2>
        <p>
          Dos puertas de entrada a lo que hacemos. Dentro de cada proyecto, todo
          el detalle.
        </p>
        <a href="/productos">
          Mira algunos de nuestros proyectos{" "}
          <ArrowUpRight size={20} aria-hidden="true" />
        </a>
      </header>
      <div className={styles.projectDoors}>
        {projectDoors.map((project) => (
          <article key={project.id}>
            <a className={styles.projectImage} href={project.href}>
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes="(max-width: 760px) 85vw, 42vw"
              />
            </a>
            <span>{project.label}</span>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <a href={project.href}>
              {project.linkLabel} <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </>
  );
}
export function ContactLetter() {
  return (
    <>
      <div className={styles.letterMark} aria-hidden="true">
        S
      </div>
      <div className={styles.contactLayout}>
        <header className={styles.sectionHeading}>
          <p>04 / TU SIGUIENTE PASO</p>
          <h2>Veamos cuál puede ser tu siguiente paso.</h2>
          <p>
            Cuéntanos a qué se dedica tu negocio y qué te gustaría mejorar.
            Revisaremos tu consulta y te contactaremos para entender mejor lo
            que necesitas.
          </p>
          <a href="mailto:info@satorus.es">
            info@satorus.es <ArrowUpRight size={19} aria-hidden="true" />
          </a>
        </header>
        <ContactForm />
      </div>
      <section className={styles.faqs} id="preguntas">
        <header className={styles.sectionHeading}>
          <p>HABLEMOS CLARO</p>
          <h2>Antes de dar el paso.</h2>
          <p>
            Si la tuya no está aquí, escríbenos como la explicarías a alguien de
            tu equipo.
          </p>
        </header>
        {faqs.map((faq) => (
          <details key={faq.question}>
            <summary>
              {faq.question}
              <Plus size={18} aria-hidden="true" />
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </section>
      <footer className={styles.legal}>
        <a href="/aviso-legal">Aviso legal</a>
        <a href="/politica-de-privacidad">Privacidad</a>
      </footer>
    </>
  );
}
