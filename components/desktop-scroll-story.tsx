"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const storySteps = [
  {
    number: "01",
    title: "La solicitud queda registrada",
    body: "Un cliente escribe desde tu web. Su consulta y sus datos se reúnen en un lugar donde puedes darles seguimiento.",
  },
  {
    number: "02",
    title: "La IA prepara un borrador",
    body: "Con la información definida sobre tus servicios prepara una respuesta inicial y señala lo que falta.",
  },
  {
    number: "03",
    title: "Tú revisas y continúas",
    body: "Compruebas la propuesta, ajustas y decides qué enviar.",
  },
];

export function DesktopScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();

      media.add(
        {
          desktop: "(min-width: 901px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reduceMotion } = context.conditions ?? {};
          if (!desktop || reduceMotion) return;

          const section = sectionRef.current;
          const stage = section?.querySelector<HTMLElement>(".desktop-story-stage");
          if (!section || !stage) return;

          const storyStage = stage;

          const select = gsap.utils.selector(storyStage);
          const steps = select<HTMLElement>(".desktop-story-step");

          function setActiveChapter(chapter: number) {
            storyStage.dataset.activeChapter = String(chapter);
            steps.forEach((step, index) => {
              if (index + 1 === chapter) step.setAttribute("aria-current", "step");
              else step.removeAttribute("aria-current");
            });
          }

          storyStage.dataset.motionEnabled = "true";
          setActiveChapter(1);

          gsap.set(select(".desktop-story-clear"), { opacity: 0 });
          gsap.set(select(".desktop-story-note"), { xPercent: -118, opacity: 0 });
          gsap.set(select(".desktop-story-phone-pulse"), { scale: 0.45, opacity: 0 });
          gsap.set(select(".desktop-story-paper"), { xPercent: -18, yPercent: 14, rotation: -8 });
          gsap.set(select(".desktop-story-status"), { yPercent: 36, opacity: 0 });
          gsap.set(select(".desktop-story-steps > a"), { y: 12, opacity: 0.35 });
          gsap.set(select(".desktop-story-route path"), { strokeDashoffset: 1 });
          gsap.set(select(".desktop-story-progress span"), { scaleX: 0 });

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${Math.round(window.innerHeight * 1.85)}`,
              pin: storyStage,
              // Sin `pinReparent`: sacaba la escena del panel de cortina y la
              // colgaba del `<body>`, y ahi `position: fixed` con `z-index: auto`
              // pinta POR ENCIMA de `.section-curtain-stack` (posicionado con
              // `z-index: auto` y antes en el DOM). Al subir de FAQ a la historia,
              // el relevo devuelve el scroll al final del pin, la escena se
              // reactivaba y tapaba el panel de FAQ que estaba cubriendo: un
              // fogonazo de pantalla entera (medido con `elementsFromPoint`).
              // Lo pedia el curtain antiguo, que dejaba transform fijo en las
              // superficies; el de ahora las deja limpias en reposo, asi que el
              // pin se ancla al viewport sin salir de su panel.
              scrub: 0.45,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              fastScrollEnd: true,
              onUpdate: (trigger) => {
                setActiveChapter(Math.min(3, Math.floor(trigger.progress * 3) + 1));
              },
            },
          });

          timeline
            .addLabel("consulta")
            .to(select(".desktop-story-note"), { xPercent: 0, opacity: 1, duration: 0.62 })
            .to(
              select(".desktop-story-phone-pulse"),
              { scale: 1, opacity: 1, duration: 0.38 },
              "<0.12",
            )
            .addLabel("orden")
            .to(select(".desktop-story-clear"), { opacity: 1, duration: 0.86 })
            .to(
              select(".desktop-story-paper"),
              { xPercent: 0, yPercent: 0, rotation: 0, duration: 0.86, stagger: 0.08 },
              "<",
            )
            .to(select(".desktop-story-route path"), { strokeDashoffset: 0, duration: 0.86 }, "<")
            .addLabel("sigue")
            .to(select(".desktop-story-status"), { yPercent: 0, opacity: 1, duration: 0.56 })
            .to(select(".desktop-story-steps > a"), { y: 0, opacity: 1, duration: 0.56 }, "<0.1");

          timeline.to(
            select(".desktop-story-progress span"),
            { scaleX: 1, duration: timeline.duration(), ease: "none" },
            0,
          );

          return () => {
            delete storyStage.dataset.motionEnabled;
            storyStage.dataset.activeChapter = "3";
            steps.forEach((step) => step.removeAttribute("aria-current"));
          };
        },
      );

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      className="desktop-scroll-story"
      id="ia-aplicada"
      ref={sectionRef}
      aria-labelledby="desktop-story-title"
    >
      <div className="desktop-story-stage" data-active-chapter="3">
        <div className="desktop-story-heading">
          <p className="desktop-story-kicker">Automatización con IA</p>
          <h2 id="desktop-story-title">
            Una consulta llega. El siguiente paso queda preparado.
          </h2>
          <p>La tecnología prepara el trabajo. Tú mantienes la decisión.</p>
        </div>

        <figure className="desktop-story-visual">
          <div className="desktop-story-before">
            <Image
              src="/images/daily-tangle.png"
              alt="Mesa con notas y tareas desordenadas antes de simplificar el proceso."
              fill
              sizes="58vw"
            />
          </div>
          <div className="desktop-story-clear">
            <Image
              src="/images/clear-flow.png"
              alt="Mesa ordenada después de convertir las tareas en un recorrido claro."
              fill
              sizes="58vw"
            />
          </div>
          <div className="desktop-story-paper-stack" aria-hidden="true">
            <span className="desktop-story-paper desktop-story-paper-one" />
            <span className="desktop-story-paper desktop-story-paper-two" />
          </div>
          <div className="desktop-story-phone" aria-hidden="true">
            <span className="desktop-story-phone-pulse" />
            <span>Consulta</span>
          </div>
          <div className="desktop-story-note" aria-hidden="true">
            Nueva consulta
            <strong>Presupuesto · Web</strong>
          </div>
          <div className="desktop-story-status" aria-hidden="true">Borrador listo</div>
          <svg
            className="desktop-story-route"
            viewBox="0 0 1000 560"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M-40 360 C165 250 310 455 480 340 S760 215 1040 330" pathLength="1" />
          </svg>
          <figcaption>
            Escena ilustrativa de una posible aplicación · responde al scroll
          </figcaption>
        </figure>

        <div className="desktop-story-steps">
          {storySteps.map((step) => (
            <article className="desktop-story-step" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
          <a href="#contacto">
            Hablemos de tu negocio
            <ArrowRight aria-hidden="true" size={21} />
          </a>
        </div>

        <div className="desktop-story-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
