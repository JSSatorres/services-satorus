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
    title: "La consulta entra",
    body: "WhatsApp, formulario o correo: cada conversación empieza en un lugar reconocible.",
  },
  {
    number: "02",
    title: "El trabajo se ordena",
    body: "La información llega preparada, sin copiar el mismo dato en tres herramientas.",
  },
  {
    number: "03",
    title: "Tu equipo sigue",
    body: "Avisos, documentos y siguientes pasos aparecen cuando hacen falta.",
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

          const stage = sectionRef.current?.querySelector<HTMLElement>(".desktop-story-stage");
          if (!stage) return;

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=220%",
              pin: stage,
              pinReparent: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .fromTo(
              ".desktop-story-after",
              { xPercent: 104 },
              { xPercent: 0, duration: 1 },
              0,
            )
            .fromTo(
              ".desktop-story-before img",
              { scale: 1.08 },
              { scale: 1, duration: 1 },
              0,
            )
            .fromTo(
              ".desktop-story-route path",
              { strokeDashoffset: 1 },
              { strokeDashoffset: 0, duration: 1 },
              0,
            )
            .fromTo(
              ".desktop-story-progress span",
              { scaleX: 0 },
              { scaleX: 1, duration: 1 },
              0,
            )
            .fromTo(
              ".desktop-story-step",
              { opacity: 0.2, y: 28 },
              { opacity: 1, y: 0, stagger: 0.27, duration: 0.28 },
              0.08,
            );
        },
      );

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      className="desktop-scroll-story"
      ref={sectionRef}
      aria-labelledby="desktop-story-title"
    >
      <div className="desktop-story-stage">
        <div className="desktop-story-heading">
          <h2 id="desktop-story-title">Mueve la rueda. Mira cómo se desenreda.</h2>
          <p>
            Una solución útil no añade otra capa: convierte los pasos dispersos en un
            recorrido que el equipo puede seguir.
          </p>
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
          <div className="desktop-story-after">
            <Image
              src="/images/clear-flow.png"
              alt="Mesa ordenada después de convertir las tareas en un recorrido claro."
              fill
              sizes="58vw"
            />
          </div>
          <svg
            className="desktop-story-route"
            viewBox="0 0 1000 560"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M-40 360 C165 250 310 455 480 340 S760 215 1040 330" pathLength="1" />
          </svg>
          <figcaption>Escenas ilustrativas · el recorrido cambia con tu scroll</figcaption>
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
            Diseñemos tu recorrido
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
