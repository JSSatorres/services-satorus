"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Boxes, Globe2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { ProjectCatalogItem } from "@/lib/project-catalog";
import { PidotecaJourneyScene } from "@/components/pidoteca-journey-scene";
import styles from "./project-showcase.module.css";

type ProjectShowcaseProps = {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  items: ProjectCatalogItem[];
};

/** Recorrido vertical de la imagen dentro de su marco, en % de su propio alto. */
const DRIFT = 3;
/** Tramo entre un texto y el siguiente, normalizado. */
const STEP = 1;
/**
 * Cuánto aguanta el marco en el proyecto que se está leyendo antes de soltar el
 * relevo. Sin esta espera el barrido se reparte por todo el hueco y a mitad de
 * camino la imagen ya va por la mitad, cuando el texto de ese proyecto todavía
 * se lee entero: la foto parecía ir por delante.
 */
const HOLD = 0.34;
/** Ventana en la que ocurre el relevo, dentro del tramo. */
const SWAP = 0.44;
/** Holgura para que ese recorrido nunca descubra un borde del marco. */
const MEDIA_SCALE = 1 + (DRIFT * 2) / 100 + 0.04;

const KIND_COPY = {
  app: { label: "App", link: "Ver el proyecto", anchor: "apps" },
  web: { label: "Web", link: "Leer el caso completo", anchor: "webs" },
} as const;

function KindIcon({ kind }: { kind: ProjectCatalogItem["kind"] }) {
  const Icon = kind === "app" ? Boxes : Globe2;
  return <Icon aria-hidden="true" />;
}

function LectorScreenCollage() {
  const screens = [
    { src: "/products/lector-bilingue/08-biblioteca-con-libro.png", alt: "Biblioteca con un libro emparejado" },
    { src: "/products/lector-bilingue/04-lectura-y-navegacion.png", alt: "Pantalla de lectura" },
    { src: "/products/lector-bilingue/05-traduccion-bilingue.png", alt: "Consulta bilingüe de un fragmento" },
  ];

  return (
    <div className={styles.lectorScreens}>
      {screens.map((screen) => (
        <div className={styles.lectorPhone} key={screen.src}>
          <Image src={screen.src} alt={screen.alt} fill sizes="(max-width: 860px) 28vw, 8rem" />
        </div>
      ))}
    </div>
  );
}

function LectorLanguagePairs() {
  return (
    <div className={styles.lectorLanguages} aria-label="Dos ejemplos de parejas de libros en inglés y español">
      <span className={styles.lectorLanguagesHeading}><Globe2 aria-hidden="true" /> Elige una pareja de EPUB</span>
      <div className={styles.languagePair}>
        <span className={styles.languageChoice}><i className={styles.flagUk} aria-hidden="true" /><span><strong>Inglés</strong><small>Reino Unido</small></span></span>
        <span className={styles.languagePlus} aria-hidden="true">+</span>
        <span className={styles.languageChoice}><i className={styles.flagSpain} aria-hidden="true" /><span><strong>Español</strong><small>España</small></span></span>
      </div>
      <div className={styles.languagePair}>
        <span className={styles.languageChoice}><i className={styles.flagUs} aria-hidden="true" /><span><strong>Inglés</strong><small>EE. UU.</small></span></span>
        <span className={styles.languagePlus} aria-hidden="true">+</span>
        <span className={styles.languageChoice}><i className={styles.flagMexico} aria-hidden="true" /><span><strong>Español</strong><small>México</small></span></span>
      </div>
    </div>
  );
}

function headerOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-height");
  return Number.parseFloat(raw) || 0;
}

/**
 * Vitrina de proyectos con el marco de imagen fijo y relevo por máscara.
 *
 * Apps y webs comparten un único recorrido: mientras la columna de texto pasa
 * de largo, el marco se queda quieto en el centro y la imagen visible se retira
 * de abajo hacia arriba (`clip-path`) dejando ver la siguiente, que ya estaba
 * debajo en la pila. El fondo de la sección viaja al color del proyecto que
 * entra. Lo que separa una app de una web es la etiqueta de categoría y el
 * marco: las webs se enseñan dentro de una ventana de navegador.
 *
 * En móvil la misma mecánica se reparte en vertical: el marco se queda pegado
 * bajo la cabecera y el texto va rotando por debajo, un proyecto por pantalla.
 *
 * Quedarse quieto es cosa de `position: sticky` (ver el módulo CSS), no del
 * `pin` de ScrollTrigger: aquí sólo se scrubea la máscara y el color.
 *
 * La deriva de la imagen va en `transform` y no en `object-position` como en la
 * referencia: las capturas mezclan proporciones (escritorio ancho, página
 * completa muy alta, móvil vertical) y `object-position` sólo se mueve cuando
 * el recorte deja margen en ese eje, así que en la mitad no haría nada. El
 * `transform` vive en la imagen y la máscara en un envoltorio sin transformar,
 * para que el corte del relevo siga siendo recto.
 */
export function ProjectShowcase({ id, eyebrow, title, lead, items }: ProjectShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();

      media.add(
        {
          // `stack` es el complemento de `side` y tiene que estar escrito: si
          // ninguna condición encaja, gsap.matchMedia no llega a llamar.
          side: "(min-width: 861px)",
          stack: "(max-width: 860px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { side, reduceMotion } = context.conditions ?? {};
          if (reduceMotion || items.length < 2) return;

          const section = sectionRef.current;
          const stage = section?.querySelector<HTMLElement>(`.${styles.stage}`);
          const visuals = stage?.querySelector<HTMLElement>(`.${styles.visuals}`);
          const frames = stage?.querySelector<HTMLElement>(`.${styles.frames}`);
          if (!section || !stage || !visuals || !frames) return;

          // El reparto con las imágenes apiladas sólo se monta aquí: en reposo
          // el marcado se lee intercalado y completo.
          stage.dataset.motion = side ? "side" : "stack";

          const select = gsap.utils.selector(stage);
          const frameBoxes = select<HTMLElement>(`.${styles.frame}`);
          const clips = select<HTMLElement>(`.${styles.frameClip}`);
          const images = frameBoxes.map((frame) =>
            Array.from(frame.querySelectorAll<HTMLImageElement>(`.${styles.frameMedia} img`))
              .find((image) => getComputedStyle(image).display !== "none"),
          );
          const infos = select<HTMLElement>(`.${styles.info}`);

          const stageColors = infos.map((info) =>
            getComputedStyle(info).getPropertyValue("--stage-bg").trim(),
          );

          // Sin deriva en dos casos. Una captura que se muestra entera sobre su
          // color no tiene recorte de sobra, y ampliarla le comería los bordes.
          // Y en apilado el marco es pequeño: el 10% de zoom que pide la deriva
          // se lleva por delante el titular de la captura, que es justo lo que
          // hay que leer. El relevo por máscara ya carga con el efecto.
          const driftOf = (index: number) =>
            side && frameBoxes[index]?.dataset.fit !== "contain" && frameBoxes[index]?.dataset.imageFit !== "contain" ? DRIFT : 0;

          gsap.set(clips, { clipPath: "inset(0px)" });
          images.forEach((image, index) => {
            if (image) gsap.set(image, {
              scale: driftOf(index) ? MEDIA_SCALE : 1,
              yPercent: driftOf(index),
            });
          });
          // El marco apilado lleva su propio fondo a juego, porque se sale del
          // margen de página para tapar el texto que pasa por detrás.
          const tinted = [section, visuals];
          gsap.set(tinted, { backgroundColor: stageColors[0] });

          // Donde descansa el texto: en lateral es el centro de la ventana; en
          // apilado, el centro del hueco que queda bajo el marco.
          const restCenter = () => {
            const header = headerOffset();
            const top = side ? header : header + visuals.getBoundingClientRect().height;
            return top + (window.innerHeight - top) / 2;
          };

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              // Anclado a los propios bloques de texto: cada relevo cae justo
              // cuando el siguiente proyecto llega a su sitio de lectura, sin
              // depender de cuánto mida el marco en cada reparto.
              trigger: infos[0],
              start: () => `center top+=${restCenter()}`,
              endTrigger: infos[infos.length - 1],
              end: () => `center top+=${restCenter()}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          // Un relevo por bloque de texto. Cada tramo dura `STEP`, que es lo que
          // mide el hueco entre un texto y el siguiente: el barrido espera
          // `HOLD` y se resuelve en `SWAP`, así que la imagen aguanta mientras
          // su texto se lee y ya está puesta cuando llega el siguiente. La
          // deriva sí recorre el tramo entero: es un movimiento de fondo.
          clips.forEach((clip, index) => {
            const next = clips[index + 1];
            if (!next) return;

            const swap = gsap
                .timeline()
                .to(
                  tinted,
                  {
                    backgroundColor: stageColors[index + 1],
                    duration: SWAP + 0.12,
                    ease: "power2.inOut",
                  },
                  HOLD - 0.06,
                )
                .to(
                  clip,
                  {
                    clipPath: "inset(0px 0px 100%)",
                    duration: SWAP,
                    ease: "power2.inOut",
                  },
                  HOLD,
                );
            const currentImage = images[index];
            const nextImage = images[index + 1];
            if (currentImage) swap.to(currentImage, { yPercent: -driftOf(index), duration: STEP }, 0);
            if (nextImage) swap.to(nextImage, { yPercent: 0, duration: STEP }, 0);
            timeline.add(swap);
          });

          return () => {
            delete stage.dataset.motion;
            gsap.set(tinted, { clearProps: "backgroundColor" });
          };
        },
      );

      return () => media.revert();
    },
    { scope: sectionRef, dependencies: [items] },
  );

  let appSeen = 0;
  let webSeen = 0;

  return (
    <section
      id={id}
      ref={sectionRef}
      className={styles.section}
      aria-labelledby={`${id}-title`}
    >
      <header className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        <p>{lead}</p>
      </header>

      <div className={styles.stage}>
        <div className={styles.column}>
          {items.map((project, index) => {
            const kind = KIND_COPY[project.kind];
            const external = project.href.startsWith("https://");
            const linkLabel = external
              ? project.kind === "app" ? "Visitar la aplicación" : "Visitar la web"
              : kind.link;
            const familyIndex = project.kind === "app" ? ++appSeen : ++webSeen;

            return (
              <article
                key={project.slug}
                className={styles.info}
                data-accent={project.accent}
                // Los enlaces antiguos a #apps y #webs siguen cayendo en el
                // primero de su familia, que es justo su relevo del recorrido.
                id={familyIndex === 1 ? kind.anchor : undefined}
                style={{ "--order": index } as CSSProperties}
              >
                <p className={styles.infoHead}>
                  <span className={styles.kind}>
                    <KindIcon kind={project.kind} />
                    {kind.label}
                  </span>
                  <span className={styles.status}>{project.status}</span>
                </p>
                <p className={styles.eyebrow}>{project.eyebrow}</p>
                <h3>{project.name}</h3>
                <p className={styles.summary}>{project.summary}</p>
                <dl className={styles.story}>
                  <div>
                    <dt><span className={styles.stepNumber}>01</span> El reto</dt>
                    <dd>{project.challenge}</dd>
                  </div>
                  <div>
                    <dt><span className={styles.stepNumber}>02</span> Qué mejoramos</dt>
                    <dd>{project.improvement}</dd>
                  </div>
                  <div>
                    <dt><span className={styles.stepNumber}>03</span> Por qué así</dt>
                    <dd>{project.reason}</dd>
                  </div>
                </dl>
                {project.highlights && (
                  <ul className={styles.highlights} aria-label={`Módulos de ${project.name}`}>
                    {project.highlights.map((module) => <li key={module}>{module}</li>)}
                  </ul>
                )}
                {project.details.length > 0 && (
                  <div
                    className={styles.mobileDetails}
                    aria-label={`Detalles visuales de ${project.name}`}
                  >
                    {project.details.slice(0, 2).map((detail) => (
                      <figure className={styles.mobileDetail} key={detail.image}>
                        <div className={styles.mobileDetailMedia} data-fit={detail.portrait ? "contain" : undefined} data-focus={detail.focus}>
                          <Image
                            src={detail.image}
                            alt={detail.alt}
                            fill
                            sizes="(max-width: 860px) 44vw, 16rem"
                          />
                        </div>
                        <figcaption>{detail.label}</figcaption>
                      </figure>
                    ))}
                  </div>
                )}
                {external ? (
                  <a href={project.href} className={styles.link}>
                    {linkLabel}
                    <ArrowUpRight aria-hidden="true" size={19} />
                  </a>
                ) : (
                  <Link href={project.href} className={styles.link}>
                    {linkLabel}
                    <ArrowUpRight aria-hidden="true" size={19} />
                  </Link>
                )}
              </article>
            );
          })}
        </div>

        <div className={styles.visuals}>
          <div className={styles.frames}>
            {items.map((project, index) => (
              <div
                key={project.slug}
                className={styles.frame}
                data-accent={project.accent}
                data-project={project.slug}
                data-fit={project.portrait ? "contain" : undefined}
                data-image-fit={project.imageFit}
                style={{ "--order": index, zIndex: items.length - index } as CSSProperties}
              >
                <div className={styles.frameClip}>
                  <div className={styles.visualEnsemble}>
                    <div className={styles.primaryVisual}>
                      {project.kind === "web" && (
                        <div className={styles.browserBar} aria-hidden="true">
                          <i />
                          <i />
                          <i />
                          <span>{project.domain}</span>
                        </div>
                      )}
                      {project.slug === "pidoteca" ? (
                        <PidotecaJourneyScene compact />
                      ) : (
                        <div className={styles.frameMedia}>
                          <Image
                            src={project.image}
                            alt={project.imageAlt}
                            fill
                            sizes="(max-width: 860px) 100vw, 42rem"
                            className={project.mobileImage ? styles.desktopImage : undefined}
                          />
                          {project.mobileImage && (
                            <Image
                              src={project.mobileImage}
                              alt={project.imageAlt}
                              fill
                              sizes="(max-width: 860px) 100vw, 42rem"
                              className={styles.mobileImage}
                            />
                          )}
                        </div>
                      )}
                    </div>
                    <div className={styles.detailRow} data-count={project.details.length}>
                      {project.slug === "lector-bilingue" ? (
                        <>
                          <div className={styles.detailShot}>
                            <LectorScreenCollage />
                            <span className={styles.detailCaption}>Biblioteca · Lectura · Traducción</span>
                          </div>
                          <div className={styles.detailShot}>
                            <LectorLanguagePairs />
                            <span className={styles.detailCaption}>Idiomas en pareja</span>
                          </div>
                        </>
                      ) : project.details.map((detail) => (
                        <div className={styles.detailShot} key={detail.image}>
                          <div className={styles.detailMedia} data-fit={detail.portrait ? "contain" : undefined} data-focus={detail.focus}>
                            <Image
                              src={detail.image}
                              alt={detail.alt}
                              fill
                              sizes="(max-width: 860px) 80vw, 19rem"
                            />
                          </div>
                          <span className={styles.detailCaption}>{detail.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
