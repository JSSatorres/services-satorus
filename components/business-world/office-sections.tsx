"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Plus,
  Check,
  MessageCircle,
  CalendarCheck,
  FileCheck2,
  PhoneCall,
  Receipt,
  Users,
} from "lucide-react";
import { processSteps, faqs } from "@/lib/home-content";
import { processDetails, problemList } from "@/lib/book-content";
import {
  officeOffers,
  officeModules,
  officeSupports,
} from "@/lib/office-content";
import { allProjects } from "@/lib/project-catalog";
import { ContactForm } from "@/components/contact-form";
import styles from "./office-tour.module.css";

// development b406de2: the book's explanations, adapted to the three physical screens.
export function ProcessScreen() {
  const [selected, setSelected] = useState(0);
  return (
    <>
      <header className={styles.sectionHeading}>
        <p>01 / CÓMO TRABAJAMOS</p>
        <h2>
          Primero, tu día a día.
          <br />
          Después, la herramienta.
        </h2>
        <p>
          Una charla sin tecnicismos. Un plan que entiendes. Y algo concreto que
          te llevas en cada paso.
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
            <li
              key={step.title}
              data-selected={selected === index}
              id={`paso-${index + 1}`}
            >
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
                <p>{processDetails[index].text}</p>
                <div className={styles.takeaway}>
                  <b>Te llevas</b>
                  <p>{processDetails[index].takeaway}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
const icons = [
  MessageCircle,
  CalendarCheck,
  FileCheck2,
  PhoneCall,
  Receipt,
  Users,
];
export function SolutionsScreen() {
  const [selected, setSelected] = useState(0);
  return (
    <>
      <header className={styles.sectionHeading}>
        <p>02 / LO QUE CONSTRUIMOS</p>
        <h2>
          Tu lista,
          <br />
          convertida en una app.
        </h2>
        <p>
          La escribimos contigo en la primera charla. Elige un problema y mira
          la pieza que lo resuelve.
        </p>
      </header>
      <div className={styles.solutionLayout}>
        <div className={styles.problemList}>
          <p className={styles.kicker}>TU LISTA DE PROBLEMAS</p>
          {problemList.map((item, i) => (
            <button
              key={item.module}
              onClick={() => setSelected(i)}
              aria-pressed={selected === i}
              aria-controls="business-app-example"
            >
              <span>0{i + 1}</span>
              <div>
                <strong>{item.problem}</strong>
                <small>→ {item.fix}</small>
              </div>
              <ArrowUpRight size={18} aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className={styles.appExample} id="business-app-example">
          <header>
            <span className={styles.appLights} aria-hidden="true">
              ● ● ●
            </span>
            <strong>Panel de tu negocio</strong>
            <small>hecho por satorus.</small>
          </header>
          <div className={styles.appModules}>
            {officeModules.map((item, i) => {
              const Icon = icons[i];
              return (
                <section
                  key={item.title}
                  data-active={selected === i}
                  aria-label={item.title}
                >
                  <h3>
                    <Icon size={18} aria-hidden="true" />
                    {item.title}
                  </h3>
                  {item.lines.map((line, n) => (
                    <p key={line} data-reply={i === 0 && n === 1}>
                      {line}
                    </p>
                  ))}
                  <footer>
                    <Check size={14} aria-hidden="true" />
                    {item.status}
                  </footer>
                </section>
              );
            })}
          </div>
          <p className={styles.exampleNote}>
            Ejemplo ilustrativo. Construimos los módulos que tu negocio
            necesita.
          </p>
        </div>
      </div>
    </>
  );
}
export function ProjectsScreen() {
  return (
    <>
      <header className={styles.sectionHeading}>
        <p>03 / QUÉ HACEMOS · PROYECTOS</p>
        <h2>
          Lo que hacemos,
          <br />
          dicho claro.
        </h2>
        <p>
          Cada encargo empieza con algo que necesitas resolver. Estos son cuatro
          ejemplos.
        </p>
        <a href="/productos">
          Mira algunos de nuestros proyectos{" "}
          <ArrowUpRight size={20} aria-hidden="true" />
        </a>
      </header>
      <div className={styles.projectDoors}>
        {officeOffers.map((offer) => {
          const project = allProjects.find((item) => item.slug === offer.slug)!;
          return (
            <article key={project.slug}>
              <blockquote>«{offer.request}»</blockquote>
              <a className={styles.projectImage} href={project.href}>
                <Image
                  src={offer.image ?? project.image}
                  alt={offer.alt ?? project.imageAlt}
                  fill
                  sizes="(max-width: 760px) 85vw, 42vw"
                  style={{
                    objectPosition: offer.top ? "top" : "center",
                    objectFit:
                      !offer.image && project.imageFit === "contain"
                        ? "contain"
                        : "cover",
                  }}
                />
              </a>
              <span>{project.name}</span>
              <h3>{offer.title}</h3>
              <p>{offer.text}</p>
              <a href={project.href}>
                Ejemplo: {project.name}{" "}
                <ArrowUpRight size={20} aria-hidden="true" />
              </a>
            </article>
          );
        })}
      </div>
      <section className={styles.plainTalk} id="hablamos-claro">
        <p>La IA no va a esperarte.</p>
        <h2>Tu competencia tampoco.</h2>
        <p>
          No tienes que saber de tecnología. Apóyate en nosotros: ponemos la
          herramienta, el conocimiento y la compañía para que tu negocio crezca.
        </p>
        <a href="#contacto">
          Hablemos de tu negocio <ArrowUpRight size={20} aria-hidden="true" />
        </a>
      </section>
    </>
  );
}
export function ContactLetter() {
  return (
    <>
      <div className={styles.letterMark} aria-hidden="true">
        S
      </div>
      <ul className={styles.supports}>
        {officeSupports.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
      <div className={styles.contactLayout}>
        <header className={styles.sectionHeading}>
          <p>04 / TU SIGUIENTE PASO</p>
          <h2>La siguiente historia es la tuya.</h2>
          <p>
            Cuéntanos a qué se dedica tu negocio y qué te gustaría ordenar.
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
          <p>NOTAS AL MARGEN</p>
          <h2>Lo que casi todos preguntan antes.</h2>
          <p>Si tu duda no está aquí, escríbenos.</p>
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
