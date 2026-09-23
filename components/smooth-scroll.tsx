"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/lenis";

/**
 * Scroll suavizado al estilo lenis.dev.
 *
 * Se eligió Lenis y no ScrollSmoother de GSAP porque ScrollSmoother traslada
 * `#smooth-content` con un transform, y eso convierte en bloque contenedor a
 * todo lo fijo de dentro: el vídeo del hero y los pins del curtain dejarían de
 * anclarse al viewport. Lenis interpola el scroll nativo sin transformar el
 * documento, así que `position: fixed`, `sticky` y los pins siguen intactos.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    // En móvil, ocultar/mostrar la barra de direcciones del navegador dispara
    // un `resize` en `window`, y ScrollTrigger llama a `refresh()` por
    // defecto ante ese evento: eso puede interrumpir un relevo de
    // `SectionCurtainStack` en marcha a mitad de gesto.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const lenis = new Lenis({
      // Curva de amortiguación: rápida al soltar y con una cola larga, que es
      // lo que da la sensación de peso de la referencia.
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      // El táctil es nativo. Pasaba por Lenis para que `SectionCurtainStack`
      // pudiera recortar el destino de la inercia; el home ya no usa ese relevo
      // y en móvil nada es tan fluido como el scroll del propio navegador.
      syncTouch: false,
      touchMultiplier: 1,
      wheelMultiplier: 1,
    });

    setLenis(lenis);

    // ScrollTrigger necesita enterarse en el mismo frame, o los pins se retrasan
    // respecto al contenido suavizado.
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Los anclas del header y el enlace de salto siguen funcionando.
    document.documentElement.dataset.lenis = "on";

    // Sonda de depuración: permite inspeccionar los rangos de los triggers
    // desde el navegador sin instrumentar cada componente.
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;
      (window as unknown as Record<string, unknown>).__lenis = lenis;
      // Con `gsap` a mano se puede frenar la línea de tiempo global
      // (`__gsap.globalTimeline.timeScale(0.1)`) y mirar un relevo fotograma a
      // fotograma sin tocar el componente.
      (window as unknown as Record<string, unknown>).__gsap = gsap;
    }

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.off("scroll", onScroll);
      setLenis(null);
      lenis.destroy();
      delete document.documentElement.dataset.lenis;
    };
  }, []);

  return null;
}
