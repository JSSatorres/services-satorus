"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { RouteSketch } from "@/components/route-sketch";

/**
 * Tope del zoom del remate, y el número que decide cuánto puede crecer sin
 * salirse. La línea larga ("TU COMPETENCIA") mide 8.12 veces su cuerpo, el
 * cuerpo en reposo son 7 unidades de escena y el titular arranca a 4 unidades
 * del borde izquierdo: 4 + 7 x 1.65 x 8.12 ≈ 98 de las 100 unidades que mide el
 * ancho de la escena. Es decir, acaba llenando la pantalla justo antes del
 * borde. Si cambia el cuerpo en reposo (`--pt-unit` en `.plain-talk-punch`),
 * este tope hay que recalcularlo.
 */
const PUNCH_ZOOM = 1.65;

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
 * sobre un fondo WebGL y pueden escalar el bloque entero. Aquí quien crece es
 * sólo el remate ("Tu competencia tampoco"): el enunciado, el párrafo, el CTA y
 * el boceto se retiran antes para dejárselo todo. Escalar el titular completo
 * empujaba el remate fuera de pantalla, porque su origen quedaba entre las dos
 * líneas y cada una se iba por un lado.
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
      const intro = section?.querySelector<HTMLElement>(".plain-talk-intro");
      const punch = section?.querySelector<HTMLElement>(".plain-talk-punch");
      const lead = section?.querySelector<HTMLElement>(".plain-talk-copy p");
      const cta = section?.querySelector<HTMLElement>(".plain-talk-cta");
      const sketch = section?.querySelector<HTMLElement>(".route-sketch");
      if (!section || !track || !title || !intro || !punch) return;

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
        /* Misma coreografía que en escritorio —el párrafo, el CTA y el boceto se
           retiran, el enunciado se va por arriba y quien crece es sólo el
           remate—, pero movida con variables sobre el titular en vez de con
           tweens sobre sus dos mitades.

           El motivo es que `SectionCurtainStack` trocea este titular con
           SplitText en cuanto cargan las fuentes, y al hacerlo rehace los `span`
           de dentro: `intro` y `punch` se quedan apuntando a nodos que ya no
           están en el documento y la animación no se ve. El `h2` sí sobrevive al
           troceado, así que lo que se anima es él, y las reglas de
           `@media (max-width: 900px)` convierten esas variables en opacidad y
           transform sobre los `span` que haya en ese momento. En escritorio no
           hace falta: allí el troceado llega antes de que se monte la línea de
           tiempo y las referencias siguen siendo buenas.

           Antes esto no se notaba porque el móvil escalaba el titular entero
           —el `h2`, que nunca se reemplaza—, y era justo eso lo que subía el
           enunciado por detrás de la cabecera y desbordaba el remate. */
        timeline
          .to(
            [lead, cta, sketch].filter(Boolean),
            { autoAlpha: 0, yPercent: 10, duration: 0.24, stagger: 0.035 },
            0,
          )
          .to(title, { "--pt-punch-grow": 1, duration: 1 }, 0)
          .to(title, { "--pt-intro-out": 1, duration: 0.28 }, 0.04)
          .to(title, { "--pt-punch-out": 1, duration: 0.2 }, 0.84);
      } else {
        timeline
          .to(
            [lead, cta, sketch].filter(Boolean),
            { autoAlpha: 0, yPercent: 12, duration: 0.25, stagger: 0.04 },
            0,
          )
          .to(intro, { autoAlpha: 0, yPercent: -22, duration: 0.3 }, 0.04)
          .to(
            punch,
            {
              // En reposo el remate cae por debajo del centro de la escena (el
              // enunciado y la banda le empujan hacia abajo). Sube un 41% de su
              // propio alto mientras crece —la proporción se mantiene a
              // cualquier tamaño porque todo el bloque se mide en unidades— para
              // acabar centrado en pantalla cuando se queda solo.
              yPercent: -41,
              scale: PUNCH_ZOOM,
              transformOrigin: "0% 50%",
              duration: 1,
            },
            0,
          )
          .to(punch, { autoAlpha: 0, duration: 0.2 }, 0.84);
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
                  Tu{" "}
                  {/* Sólo en móvil: allí "TU COMPETENCIA" no cabe de una línea y
                      el navegador partía la palabra por la mitad. El salto va en
                      el marcado y se anula con `display: none` en escritorio, que
                      sigue leyendo "TU COMPETENCIA / TAMPOCO.". */}
                  <br className="plain-talk-punch-break" />
                  competencia
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
