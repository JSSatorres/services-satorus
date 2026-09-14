"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Revelado de titulares con máscara, como el hero de lenis.dev: cada línea vive
 * dentro de una caja con `overflow: hidden` y sube desde debajo de su propio
 * borde, escalonada.
 *
 * Se aplica a cualquier `h1`/`h2` marcado con `data-reveal="lines"`, y también
 * a los que estén dentro de un contenedor marcado con `data-reveal-scope`.
 */
export function MaskedHeadings() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    let context: gsap.Context | null = null;
    let cancelled = false;

    // Dos motivos para esperar a las fuentes: con la tipografía de reserva las
    // líneas se parten donde no toca, y el troceado cambia la altura de cada
    // titular. Si eso pasa después de que los demás ScrollTrigger hayan medido,
    // sus pins quedan desplazados —por eso el refresh del final.
    const revealHeadings = () => {
      if (cancelled) return;

      context = gsap.context(() => {
        const targets = gsap.utils.toArray<HTMLElement>(
          '[data-reveal="lines"], [data-reveal-scope="lines"] :is(h1, h2):not(.sr-only):not([data-reveal="off"])',
        );

        targets.forEach((target) => {
          const split = new SplitText(target, {
            type: "lines",
            mask: "lines",
            linesClass: "reveal-line",
          });

          gsap.from(split.lines, {
            yPercent: 108,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.085,
            scrollTrigger: {
              trigger: target,
              start: "top 88%",
              once: true,
            },
          });
        });
      });

      ScrollTrigger.refresh();
    };

    // En visita en caliente las fuentes ya están: trocear en el acto evita ese
    // `ScrollTrigger.refresh()` disparado un microtask más tarde, que caía en
    // mitad de lo que estuviera animándose.
    if (document.fonts.status === "loaded") {
      revealHeadings();
    } else {
      document.fonts.ready.then(revealHeadings);
    }

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, []);

  return null;
}
