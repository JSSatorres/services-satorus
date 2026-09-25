"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Plus,
  RotateCcw,
} from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { faqs, processSteps } from "@/lib/home-content";
import { getChapterIndex } from "@/lib/journey-progress";
import { BusinessWorld } from "./business-world";
import styles from "./business-world.module.css";

const chapters = [
  {
    id: "inicio",
    label: "Tu negocio",
    eyebrow: "SATORUS · WEBS, APPS Y AUTOMATIZACIÓN",
    title: ["Tu negocio.", "Por dentro."],
    description:
      "Detrás de cada negocio hay personas, ideas y muchas cosas pasando a la vez. Vamos a hacer que encajen.",
    change: "Entra. Esta historia empieza con tu día a día.",
    next: "Entrar en el negocio",
  },
  {
    id: "como-trabajamos",
    label: "Entender",
    eyebrow: "PRIMERO, ESCUCHAR",
    title: ["Antes de construir,", "te entendemos."],
    description:
      "Nos cuentas cómo trabajas y dónde encuentras dificultades. Dibujamos contigo lo que hace falta.",
    change: "La solución empieza por entender tu negocio.",
    next: "Construir el escaparate",
  },
  {
    id: "diagnostico",
    label: "Tu web",
    eyebrow: "LA PRIMERA PIEZA · TU WEB",
    title: ["Que se vea", "lo que vales."],
    description:
      "Un escaparate digital que cuenta bien lo que haces, muestra por qué elegirte y pone fácil contactar contigo.",
    change: "Quien llega entiende qué ofreces y cómo dar el siguiente paso.",
    next: "Ordenar el trabajo",
  },
  {
    id: "herramientas",
    label: "Tu gestión",
    eyebrow: "LA SEGUNDA PIEZA · TU APLICACIÓN",
    title: ["Cada cosa,", "en su sitio."],
    description:
      "Pedidos, equipo, reservas o almacén. Una herramienta hecha alrededor de tu manera de trabajar.",
    change: "La información encuentra su sitio. Tu equipo sabe qué toca.",
    next: "Conectar los pasos",
  },
  {
    id: "automatizacion",
    label: "Conectar",
    eyebrow: "LA TERCERA PIEZA · AUTOMATIZACIÓN + IA",
    title: ["Y el trabajo", "sigue su camino."],
    description:
      "Conectamos herramientas y quitamos tareas repetitivas. La IA entra cuando ayuda; tú mantienes el control.",
    change: "De una consulta a su siguiente paso, con revisión humana.",
    next: "Ver trabajos reales",
  },
  {
    id: "proyectos",
    label: "Proyectos",
    eyebrow: "DE LA MAQUETA A LA REALIDAD",
    title: ["Esto ya", "existe."],
    description:
      "Cada proyecto empieza con una necesidad concreta. Aquí puedes ver lo que construimos para resolverla.",
    change: "Capturas reales. Proyectos con su propia historia.",
    next: "Resolver tus dudas",
  },
  {
    id: "preguntas",
    label: "Tus dudas",
    eyebrow: "ANTES DE DAR EL PASO",
    title: ["Las cosas,", "claras."],
    description:
      "También las condiciones, los límites y lo que necesitas saber antes de empezar.",
    change: "Elige una pregunta. Tómate el tiempo que necesites.",
    next: "Hablar de tu negocio",
  },
  {
    id: "contacto",
    label: "Hablemos",
    eyebrow: "AHORA, IMAGINA EL TUYO",
    title: ["La siguiente", "historia es tuya."],
    description:
      "Una web que se ha quedado atrás. Un trabajo que repites demasiado. Una idea que no sabes cómo construir.",
    change: "Cuéntanoslo con tus palabras. Empezamos por escucharte.",
    next: "",
  },
];

export type JourneyProject = {
  slug: string;
  name: string;
  eyebrow: string;
  status: string;
  challenge: string;
  href: string;
  image: string;
  imageAlt: string;
};

export function BusinessJourney({ projects }: { projects: JourneyProject[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [selectedProject, setSelectedProject] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const chapter = chapters[active];
  const project = projects[selectedProject];

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const element = track.current;
      if (!element) return;
      const stage = element.querySelector<HTMLElement>("[data-world-stage]");
      if (!stage) return;
      const headerHeight =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-height",
          ),
        ) || 74;
      const start =
        element.getBoundingClientRect().top + window.scrollY - headerHeight;
      setActive(
        getChapterIndex(
          window.scrollY - start,
          stage.clientHeight,
          chapters.length,
        ),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pageshow", schedule);
    const observer = new ResizeObserver(schedule);
    if (track.current) observer.observe(track.current);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
    };
  }, []);

  function selectChapter(index: number) {
    const target = chapters[index];
    if (target) window.location.hash = target.id;
  }

  return (
    <div className={styles.experience}>
      <h1 className="sr-only">
        Satorus. Tu negocio, por dentro. Webs, aplicaciones y automatizaciones a
        medida.
      </h1>
      <div
        className={styles.track}
        ref={track}
        style={{ "--chapters": chapters.length } as CSSProperties}
      >
        <div
          className={styles.stage}
          data-world-stage=""
          data-chapter={active}
          data-document={active >= 5 ? "true" : "false"}
        >
          <div className={styles.scene}>
            <BusinessWorld chapter={active} replayKey={replayKey} />
          </div>
          <div className={styles.cornerLabel} aria-hidden="true">
            <span className={styles.statusDot} />
            {active === 0
              ? "TODO EMPIEZA AQUÍ"
              : active === 1
                ? "ENTENDER ANTES DE CONSTRUIR"
                : active < 5
                  ? "EL NEGOCIO VA ENCAJANDO"
                  : "DE LA IDEA AL TRABAJO REAL"}
          </div>
          <span className="sr-only" role="status" aria-atomic="true">
            Capítulo {active + 1} de {chapters.length}: {chapter.label}
          </span>
          <div className={styles.chapterCopy} key={chapter.id}>
            <p className={styles.eyebrow}>{chapter.eyebrow}</p>
            <h2>
              {chapter.title.map((line, index) => (
                <span
                  key={line}
                  className={index === 1 ? styles.titleAccent : undefined}
                >
                  {line}
                </span>
              ))}
            </h2>
            <p className={styles.description}>{chapter.description}</p>
            {active === 1 && (
              <ol className={styles.method}>
                {processSteps.map((step, index) => (
                  <li key={step.title}>
                    <span>0{index + 1}</span>
                    <div>
                      <strong>{step.answer}</strong>
                      <p>
                        {index === 0
                          ? "Entendemos tu negocio y lo que ya utilizas."
                          : index === 1
                            ? "Alcance, inversión y plazos por escrito."
                            : index === 2
                              ? "Construimos, pruebas y ajustamos contigo."
                              : "Acordamos el soporte que necesitas."}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
            {active >= 2 && active <= 4 && (
              <div
                className={styles.builtPieces}
                aria-label="Piezas construidas"
              >
                <span>
                  <Check size={13} /> Web
                </span>
                {active >= 3 && (
                  <span>
                    <Check size={13} /> Aplicación
                  </span>
                )}
                {active >= 4 && (
                  <span>
                    <Check size={13} /> Conexiones
                  </span>
                )}
              </div>
            )}
            <p className={styles.change}>{chapter.change}</p>
            {active === 0 && (
              <a href="#como-trabajamos" className={styles.enterLink}>
                Entra en el negocio{" "}
                <ArrowUpRight size={21} aria-hidden="true" />
              </a>
            )}
            {active === 4 && (
              <button
                className={styles.replay}
                onClick={() => setReplayKey((value) => value + 1)}
                type="button"
              >
                <RotateCcw size={15} aria-hidden="true" /> Ver el recorrido
              </button>
            )}
            {active === 5 && (
              <a className={styles.inlineLink} href="/productos">
                Todos los proyectos{" "}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            )}
            {active === 7 && (
              <a className={styles.inlineLink} href="mailto:info@satorus.es">
                info@satorus.es <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            )}
          </div>
          <aside
            className={styles.document}
            hidden={active !== 5}
            aria-label="Proyectos reales"
          >
            <div className={styles.documentHeader}>
              <span>TRABAJOS DEL TALLER</span>
              <span>
                0{selectedProject + 1} / 0{projects.length}
              </span>
            </div>
            <div className={styles.projectTabs}>
              {projects.map((item, index) => (
                <button
                  type="button"
                  key={item.slug}
                  onClick={() => setSelectedProject(index)}
                  aria-pressed={selectedProject === index}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <a className={styles.projectVisual} href={project.href}>
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes="(max-width: 760px) 90vw, 50vw"
              />
              <span>
                <ArrowUpRight size={23} aria-hidden="true" />
                <span className="sr-only">Ver {project.name}</span>
              </span>
            </a>
            <div className={styles.projectCaption}>
              <div>
                <p>
                  {project.eyebrow} · {project.status}
                </p>
                <h3>{project.name}</h3>
              </div>
              <a
                href={project.href}
                aria-label={`Ver proyecto ${project.name}`}
              >
                <ArrowUpRight size={24} />
              </a>
            </div>
            <p className={styles.projectChallenge}>{project.challenge}</p>
          </aside>
          <aside
            className={styles.document}
            hidden={active !== 6}
            aria-label="Preguntas frecuentes"
          >
            <div className={styles.documentHeader}>
              <span>ANTES DE EMPEZAR</span>
              <span>HABLEMOS CLARO</span>
            </div>
            <div className={styles.faqs}>
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
            <a href="#contacto" className={styles.documentLink}>
              ¿Te queda alguna duda? Cuéntanosla <ArrowRight size={17} />
            </a>
          </aside>
          <aside
            className={`${styles.document} ${styles.contactDocument}`}
            hidden={active !== 7}
            aria-label="Cuéntanos tu negocio"
          >
            <div className={styles.documentHeader}>
              <span>UN NUEVO PROYECTO</span>
              <span>EL TUYO</span>
            </div>
            <ContactForm />
          </aside>
          <div className={styles.chapterControls}>
            <div className={styles.mobileChapter}>
              <span>CAPÍTULO</span>
              <select
                value={active}
                aria-label="Ir a un capítulo"
                onChange={(event) => selectChapter(Number(event.target.value))}
              >
                {chapters.map((item, index) => (
                  <option key={item.id} value={index}>
                    {String(index + 1).padStart(2, "0")} · {item.label}
                  </option>
                ))}
              </select>
            </div>
            <nav
              className={styles.chapterIndex}
              aria-label="Capítulos del negocio"
            >
              {chapters.map((item, index) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={index === active ? "step" : undefined}
                  data-complete={index < active}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              ))}
            </nav>
            <div className={styles.stepControls}>
              <a
                href={`#${chapters[Math.max(0, active - 1)].id}`}
                aria-label="Capítulo anterior"
                aria-disabled={active === 0}
                tabIndex={active === 0 ? -1 : 0}
              >
                <ArrowLeft size={19} aria-hidden="true" />
              </a>
              {active < chapters.length - 1 ? (
                <a
                  href={`#${chapters[active + 1].id}`}
                  className={styles.nextChapter}
                  aria-label={chapter.next}
                >
                  <span>{chapter.next}</span>
                  <ArrowRight size={21} aria-hidden="true" />
                </a>
              ) : (
                <a href="#inicio" className={styles.nextChapter}>
                  <span>Volver al inicio</span>
                  <RotateCcw size={18} aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
          <div className={styles.scrollHint} aria-hidden="true">
            <ArrowDown size={12} /> Desliza para{" "}
            {active < 4 ? "construir" : "continuar"}
          </div>
        </div>
        {chapters.map((item, index) => (
          <section
            className={styles.chapterMarker}
            id={item.id}
            key={item.id}
            style={{ "--chapter": index } as CSSProperties}
            aria-hidden="true"
          />
        ))}
      </div>
      <footer className={styles.footer}>
        <a href="#inicio" translate="no">
          satorus.
        </a>
        <span>Webs, aplicaciones y automatizaciones para tu negocio.</span>
        <a href="/aviso-legal">Aviso legal</a>
        <a href="/politica-de-privacidad">Privacidad</a>
      </footer>
      <noscript>
        <style>{`.${styles.track}{display:none!important}`}</style>
        <div className={styles.fallback}>
          <h2>Tu negocio, por dentro.</h2>
          <p>
            Entendemos cómo trabajas y construimos la web, aplicación o
            automatización que necesitas.
          </p>
          <p>
            Primero te escuchamos. Definimos alcance, inversión y plazos por
            escrito. Construimos, probamos contigo y ponemos la solución en
            marcha.
          </p>
          <a href="/productos">Conoce nuestros proyectos</a>
          <a href="mailto:info@satorus.es">
            Cuéntanos tu caso: info@satorus.es
          </a>
        </div>
      </noscript>
    </div>
  );
}
