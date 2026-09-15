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
      // El táctil también pasa por Lenis, y no es por suavizarlo: durante el
      // arrastre va 1:1 con el dedo (Lenis usa `lerp: 1` mientras hay contacto)
      // y sólo el impulso al soltar lleva inercia. Es que `SectionCurtainStack`
      // necesita poder recortar el DESTINO del scroll para que el documento no
      // se meta en la zona de relevo, y el fling nativo no se puede recortar: se
      // lo lleva el compositor y no pasa por ningún evento que podamos atender.
      // Con `syncTouch: false` el móvil se saltaba entera la frontera dura: la
      // sección siguiente asomaba por el borde durante la inercia y luego daba
      // un tirón al asentarse. Así el dedo recorre el mismo camino que la rueda.
      syncTouch: true,
      // 1:1 con el dedo: el contenido tiene que ir pegado a la yema. El 1.6 de
      // antes era inerte, porque con `syncTouch: false` Lenis ni miraba el táctil.
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
