"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useHydratedReducedMotion } from "@/components/use-hydrated-reduced-motion";

/* Cada línea se compone con `white-space: nowrap`, así que el corte es parte del
   texto: se reparte para que el titular quepa también a 360px de ancho. */
const taglineLines = ["Tu negocio puede", "llegar más lejos."];
/* Cada línea se parte en tramos. En escritorio los tramos van en línea y se lee
   igual que antes; en móvil cada tramo baja a su propio renglón. Así el renglón
   más largo se acorta lo suficiente para subir el cuerpo de letra sin desbordar
   los 360px: con la línea entera el techo eran ~11px, ilegible. */
const descriptionLines = [
  ["Webs, herramientas e IA", "para pequeñas y medianas empresas."],
  ["Te ayudamos a aprovechar", "la tecnología para captar clientes,"],
  ["atender mejor y reducir el trabajo manual."],
  ["Diseñamos y ponemos en marcha la solución"],
  ["que encaja con tu negocio."],
];

const characterOffsets = [-520, 470, -390, 560, -450, 410, -580, 360];
const characterRotations = [-26, 18, -14, 29, -21, 12, 24, -17];

/** El hero mantiene su primer fotograma este tiempo antes de revelar marca y texto. */
const revealDelay = 0.5;

function KineticWords({ text }: { text: string }) {
  return text.split(" ").map((word, wordIndex, words) => (
    <span className="hero-kinetic-word" key={`${word}-${wordIndex}`}>
      {Array.from(word).map((character, characterIndex) => (
        <span
          className="hero-kinetic-character"
          data-kinetic-character
          key={`${character}-${characterIndex}`}
        >
          {character}
        </span>
      ))}
      {wordIndex < words.length - 1 ? "\u00a0" : null}
    </span>
  ));
}

export function HeroKineticLockup() {
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const reduceMotion = useHydratedReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      const hero = root?.closest<HTMLElement>(".hero");
      if (!root || !hero) return;

      const characters = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-kinetic-character]"),
      );
      const leftCopy = root.querySelector<HTMLElement>(
        "[data-kinetic-copy='left']",
      );
      const rightCopy = root.querySelector<HTMLElement>(
        "[data-kinetic-copy='right']",
      );
      const brand = root.querySelector<HTMLElement>("[data-kinetic-brand]");
      const plate = root.querySelector<HTMLElement>("[data-kinetic-plate]");
      const tint = root.querySelector<HTMLElement>("[data-kinetic-tint]");
      const bursts = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-kinetic-burst]"),
      );
      const drawnLines = gsap.utils.toArray<SVGPathElement>(
        root.querySelectorAll("[data-kinetic-draw]"),
      );
      if (!leftCopy || !rightCopy || !brand || !plate || !tint) return;

      const media = gsap.matchMedia();

      media.add(
        {
          desktop: "(min-width: 901px)",
          mobile: "(max-width: 900px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reduceMotion: shouldReduceMotion } =
            context.conditions ?? {};

          if (shouldReduceMotion) {
            timelineRef.current = null;
            gsap.set(
              [
                ...characters,
                leftCopy,
                rightCopy,
                brand,
                plate,
                tint,
                ...bursts,
                ...drawnLines,
              ],
              { clearProps: "all" },
            );
            hero.dataset.kineticReady = "true";
            return;
          }

          const initialLeftX = desktop ? -12 : -6;
          const initialRightX = desktop ? 12 : 6;

          /* Primer fotograma: marca y texto invisibles; solo quedan el vídeo y el CTA naranja. */
          const firstFrame: Array<[gsap.TweenTarget, gsap.TweenVars]> = [
            [
              characters,
              {
                y: (index: number) =>
                  characterOffsets[index % characterOffsets.length],
                rotation: (index: number) =>
                  characterRotations[index % characterRotations.length],
                opacity: 0,
              },
            ],
            [leftCopy, { xPercent: initialLeftX }],
            [rightCopy, { xPercent: initialRightX }],
            [brand, { y: 0, opacity: 1 }],
            [plate, { scale: 0.94, opacity: 0, "--print-offset": 0 }],
            [tint, { opacity: 0 }],
            [bursts, { scale: 0, opacity: 0, transformOrigin: "center center" }],
            [drawnLines, { strokeDasharray: 1, strokeDashoffset: 1 }],
          ];

          /* Se aplica antes de soltar el `visibility: hidden` del CSS: así la espera de
             `revealDelay` nunca deja leer el estado final del hero. */
          firstFrame.forEach(([targets, vars]) => {
            gsap.set(targets, vars);
          });
          hero.dataset.kineticReady = "true";

          const timeline = gsap.timeline({ delay: revealDelay });
          timelineRef.current = timeline;

          firstFrame.forEach(([targets, vars]) => {
            timeline.set(targets, vars, 0);
          });

          timeline
            .to(
              characters,
              {
                y: 0,
                rotation: 0,
                opacity: 1,
                duration: 0.7,
                ease: "expo.out",
                stagger: {
                  from: "random",
                  amount: 0.3,
                },
              },
              0,
            )
            .to(
              plate,
              {
                opacity: 1,
                scale: 1,
                duration: 0.7,
                ease: "expo.out",
              },
              0,
            )
            /* El cartel entra como ventana al vídeo y el tinte lo convierte en la marca. */
            .to(
              tint,
              {
                opacity: 1,
                duration: 1.35,
                ease: "power2.inOut",
              },
              0.3,
            )
            .addLabel("explode", 1)
            .to(
              leftCopy,
              {
                xPercent: 0,
                duration: 2,
                ease: "elastic.out(1, 0.3)",
              },
              "explode",
            )
            .to(
              rightCopy,
              {
                xPercent: 0,
                duration: 2,
                ease: "elastic.out(1, 0.3)",
              },
              "explode",
            )
            .to(
              bursts,
              {
                scale: 1,
                opacity: 1,
                duration: 0.7,
                ease: "back.out(3)",
                stagger: 0.06,
              },
              "explode+=0.08",
            )
            /* Las placas de color salen de debajo del cartel, como un registro de imprenta. */
            .to(
              plate,
              {
                "--print-offset": 1,
                duration: 0.7,
                ease: "back.out(2.4)",
              },
              "explode+=0.08",
            )
            .to(
              drawnLines,
              {
                strokeDashoffset: 0,
                duration: 0.72,
                ease: "power2.inOut",
                stagger: 0.08,
              },
              "explode",
            );
        },
      );

      return () => media.revert();
    },
    { scope: rootRef },
  );

  const replay = () => {
    if (!reduceMotion) {
      /* Sin retardo: el clic salta al primer fotograma en el acto y evita releer el final. */
      timelineRef.current?.restart();
    }
  };

  return (
    <div className="hero-copy" ref={rootRef}>
      <h1 id="hero-title" className="sr-only">
        Satorus.es. Tu negocio puede llegar más lejos.
      </h1>
      <p className="sr-only">
        Webs, herramientas e inteligencia artificial para pequeñas y medianas
        empresas. Te ayudamos a aprovechar la tecnología para captar clientes,
        atender mejor y reducir el trabajo manual. Diseñamos y ponemos en marcha
        la solución que encaja con tu negocio.
      </p>

      <div className="hero-kinetic-scene">
        <button
          className="hero-kinetic-brand"
          data-kinetic-brand
          type="button"
          onClick={replay}
          disabled={reduceMotion}
          aria-label="Repetir animación de satorus.es"
          title="Repetir animación"
        >
          <span
            className="hero-logo-orbit"
            data-kinetic-burst
            aria-hidden="true"
          >
            <svg viewBox="0 0 600 230" focusable="false">
              <ellipse
                data-kinetic-draw
                pathLength="1"
                cx="300"
                cy="115"
                rx="245"
                ry="101"
              />
            </svg>
          </span>
          <span
            className="hero-logo-orbit-dot"
            data-kinetic-burst
            aria-hidden="true"
          />
          <span
            className="hero-kinetic-plate"
            data-kinetic-plate
            aria-hidden="true"
          >
            <span className="hero-plate-tint" data-kinetic-tint />
            <span className="hero-kinetic-brand-word">
              <KineticWords text="satorus.es" />
            </span>
          </span>
        </button>

        <div
          className="hero-kinetic-copy hero-kinetic-copy--left"
          data-kinetic-copy="left"
          aria-hidden="true"
        >
          {taglineLines.map((line) => (
            <span className="hero-kinetic-tagline-line" key={line}>
              <KineticWords text={line} />
            </span>
          ))}
        </div>

        <div
          className="hero-kinetic-copy hero-kinetic-copy--right"
          data-kinetic-copy="right"
          aria-hidden="true"
        >
          {descriptionLines.map((parts) => (
            <span
              className="hero-kinetic-description-line"
              key={parts.join(" ")}
            >
              {parts.map((part, partIndex) => (
                <span className="hero-kinetic-description-part" key={part}>
                  <KineticWords text={part} />
                  {partIndex < parts.length - 1 ? (
                    <span className="hero-kinetic-description-gap">
                      {"\u00a0"}
                    </span>
                  ) : null}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <p className="hero-support">
        Cuéntanos qué quieres mejorar. Te ayudamos a encontrar por dónde
        empezar.
      </p>
    </div>
  );
}
