"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Boxes, Globe2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { ProjectCatalogItem } from "@/lib/project-catalog";
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

  const appCount = items.filter((item) => item.kind === "app").length;
  const webCount = items.length - appCount;

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
          const images = select<HTMLElement>(`.${styles.frameMedia} img`);
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
            side && frameBoxes[index]?.dataset.fit !== "contain" ? DRIFT : 0;

          gsap.set(clips, { clipPath: "inset(0px)" });
          gsap.set(images, {
            scale: (index: number) => (driftOf(index) ? MEDIA_SCALE : 1),
            yPercent: (index: number) => driftOf(index),
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

          // Un relevo por pantalla de scroll: cada bloque de texto mide lo que
          // mide el marco, así que el reparto sale solo.
          clips.forEach((clip, index) => {
            const next = clips[index + 1];
            if (!next) return;

            timeline.add(
              gsap
                .timeline()
                .to(tinted, {
                  backgroundColor: stageColors[index + 1],
                  duration: 1.5,
                  ease: "power2.inOut",
                })
                .to(clip, { clipPath: "inset(0px 0px 100%)", duration: 1.5 }, 0)
                .to(images[index], { yPercent: -driftOf(index), duration: 1.5 }, 0)
                .to(images[index + 1], { yPercent: 0, duration: 1.5 }, 0),
            );
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
        <div className={styles.headingMain}>
          <div className={styles.legend}>
            <span>
              <Boxes aria-hidden="true" /> Apps <b>{appCount}</b>
            </span>
            <span>
              <Globe2 aria-hidden="true" /> Webs <b>{webCount}</b>
            </span>
          </div>
          <div>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h2 id={`${id}-title`}>{title}</h2>
          </div>
        </div>
        <p>{lead}</p>
      </header>

      <div className={styles.stage}>
        <div className={styles.column}>
          {items.map((project, index) => {
            const kind = KIND_COPY[project.kind];
            const familyIndex = project.kind === "app" ? ++appSeen : ++webSeen;
            const familyTotal = project.kind === "app" ? appCount : webCount;

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
                    <b>
                      {String(familyIndex).padStart(2, "0")}/{String(familyTotal).padStart(2, "0")}
                    </b>
                  </span>
                  <span className={styles.status}>{project.status}</span>
                </p>
                <p className={styles.eyebrow}>{project.eyebrow}</p>
                <h3>{project.name}</h3>
                <p className={styles.summary}>{project.summary}</p>
                <Link href={project.href} className={styles.link}>
                  {kind.link}
                  <ArrowUpRight aria-hidden="true" size={19} />
                </Link>
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
                data-fit={project.portrait ? "contain" : undefined}
                style={{ "--order": index, zIndex: items.length - index } as CSSProperties}
              >
                <div className={styles.frameClip}>
                  {project.kind === "web" && (
                    <div className={styles.browserBar} aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <span>{project.domain}</span>
                    </div>
                  )}
                  <div className={styles.frameMedia}>
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes="(max-width: 860px) 100vw, 38rem"
                    />
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
