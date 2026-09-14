"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
        // En movil la referencia no se puede copiar tal cual, y copiarla salia
        // caro: con el origen a media altura el titular crecia hacia arriba y
        // la cabecera fija se comia la primera linea, y con una escala de 2.4
        // la tercera se salia por la derecha antes de poder leerla.
        //
        // Tres cambios, todos por el mismo motivo —que la frase se lea entera—:
        //
        // 1. El origen es la esquina superior izquierda: el titular queda
        //    clavado justo debajo de la cabecera y crece hacia abajo. En una
        //    columna de 390px el techo real antes de cortar la ultima linea
        //    esta en torno a 1.16, que es justo la escala que se usa: crece,
        //    pero la frase nunca se sale.
        // 2. El boceto NO se retira. Es lo que ilustra la frase y lo que ocupa
        //    la mitad inferior; sin el, al irse el parrafo quedaba el titular
        //    solo arriba y dos tercios de naranja vacio. Se queda y sube al
        //    hueco que deja el parrafo.
        // 3. Titular y boceto salen juntos al final, no por separado.
        timeline
          .to([lead].filter(Boolean), { autoAlpha: 0, yPercent: 10, duration: 0.26 }, 0)
          .to(title, { scale: 1.16, transformOrigin: "0% 0%", duration: 1 }, 0)
          .to(
            [sketch].filter(Boolean),
            // Solo sube: escalarlo empujaba la etiqueta de la derecha, que ya
            // vive pegada al borde, fuera de la pantalla.
            { yPercent: -20, rotation: -1.5, duration: 0.85 },
            0.05,
          )
          .to([title, sketch].filter(Boolean), { autoAlpha: 0, duration: 0.3 }, 0.6);
      } else {
        // Lo que acompaña se retira pronto para dejar la frase sola.
        timeline
          .to(
            [lead, sketch].filter(Boolean),
            { autoAlpha: 0, yPercent: 14, duration: 0.28, stagger: 0.06 },
            0,
          )
          // Crece desde su borde izquierdo, a media altura: barre la pantalla de
          // izquierda a derecha en vez de salirse por arriba.
          .to(title, { scale: 3.4, transformOrigin: "0% 50%", duration: 1 }, 0)
          .to(title, { autoAlpha: 0, duration: 0.2 }, 0.8);
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
                La IA abre
                <br />
                nuevas posibilidades.
              </h2>
              <p>
                Preparar una respuesta, reunir información o avanzar un
                presupuesto son tareas en las que la tecnología puede ayudarte.
                Identificamos dónde aportaría una mejora concreta a tu negocio y
                puedes empezar por ahí y ampliar cuando tenga sentido.
              </p>
            </div>

            <RouteSketch />
          </div>
        </div>
      </div>
    </section>
  );
}
