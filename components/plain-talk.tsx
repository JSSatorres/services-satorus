"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { RouteSketch } from "@/components/route-sketch";

/**
 * Zoom de enunciado, replicando la sección `solution` de lenis.dev: la escena
 * se queda quieta y una frase corta crece de forma lineal hasta que el
 * visitante la atraviesa.
 *
 * La escena se fija con `position: sticky`, igual que la referencia, y no con
 * el pin de ScrollTrigger. El curtain deja un transform identidad en cada
 * `.section-curtain-panel`, y eso basta para que el panel sea bloque contenedor
 * de lo que esté en `position: fixed`: un pin anidado se anclaría al panel en
 * vez de al viewport. `sticky` no sufre ese problema.
 *
 * Diferencia deliberada con la referencia: allí sólo hay una frase centrada
 * sobre un fondo WebGL y pueden escalar el bloque entero. Aquí la sección tiene
 * dos columnas, y escalarlas juntas dejaba media pantalla vacía. Por eso el
 * párrafo y el boceto se retiran primero y el titular se queda solo creciendo.
 */
export function PlainTalk() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      const track = section?.querySelector<HTMLElement>(".plain-talk-track");
      const title = section?.querySelector<HTMLElement>(".plain-talk-copy h2");
      const lead = section?.querySelector<HTMLElement>(".plain-talk-copy p");
      const cta = section?.querySelector<HTMLElement>(".plain-talk-cta");
      const sketch = section?.querySelector<HTMLElement>(".route-sketch");
      if (!section || !track || !title) return;

      const mobile = window.matchMedia("(max-width: 900px)").matches;
      track.dataset.motionEnabled = "true";

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      if (mobile) {
        timeline
          .to(
            [lead, cta, sketch].filter(Boolean),
            { autoAlpha: 0, yPercent: 10, duration: 0.24, stagger: 0.035 },
            0,
          )
          .to(title, { scale: 1.8, transformOrigin: "0% 38%", duration: 1 }, 0)
          .to(title, { autoAlpha: 0, duration: 0.22 }, 0.78);
      } else {
        timeline
          .to(
            [lead, cta, sketch].filter(Boolean),
            { autoAlpha: 0, yPercent: 12, duration: 0.25, stagger: 0.04 },
            0,
          )
          .to(title, { scale: 2.55, transformOrigin: "0% 42%", duration: 1 }, 0)
          .to(title, { autoAlpha: 0, duration: 0.22 }, 0.78);
      }
    },
    { scope: sectionRef },
  );

  return (
    <section className="plain-talk" ref={sectionRef} aria-labelledby="plain-talk-title">
      <div className="plain-talk-track">
        <div className="plain-talk-stage">
          <div className="plain-talk-zoom">
            <div className="plain-talk-copy">
              <h2 id="plain-talk-title" data-reveal="off">
                <span className="plain-talk-intro">
                  La inteligencia artificial
                  <br />
                  no va a esperarte.
                </span>
                <span className="plain-talk-punch">
                  Tu competencia
                  <br />
                  tampoco.
                </span>
              </h2>
              <p>
                El momento de empezar no es mañana. Es antes que ellos.
              </p>
              <a className="plain-talk-cta" href="#contacto">
                Empezar ahora
                <ArrowRight aria-hidden="true" size={20} />
              </a>
            </div>

            <RouteSketch />
          </div>
        </div>
      </div>
    </section>
  );
}
