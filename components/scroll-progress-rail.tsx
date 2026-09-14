"use client";

import { useEffect, useRef } from "react";

/**
 * Raíl de progreso propio, como el de lenis.dev: una pista fina pegada al borde
 * derecho cuyo pulgar mide la porción visible del documento y se arrastra.
 * No sustituye a la barra del sistema —se deja intacta— sino que la acompaña.
 */
export function ScrollProgressRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    const thumb = thumbRef.current;
    if (!rail || !thumb) return;

    let frame = 0;
    let lastThumbHeight = -1;

    const render = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        rail.dataset.idle = "true";
        return;
      }

      delete rail.dataset.idle;
      const railHeight = rail.clientHeight;
      const ratio = window.innerHeight / doc.scrollHeight;
      const thumbHeight = Math.max(36, Math.round(railHeight * ratio));
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));

      // `height` obliga a recalcular layout, pero sólo cambia cuando cambia el
      // tamaño del documento o del viewport: nunca al hacer scroll. Escribirla
      // sólo cuando cambia de verdad deja el scroll moviendo únicamente el
      // `transform`, que sí es compositable. (Un `scaleY` sería aún más barato,
      // pero deformaría el `border-radius` del pulgar.)
      if (thumbHeight !== lastThumbHeight) {
        lastThumbHeight = thumbHeight;
        thumb.style.height = `${thumbHeight}px`;
      }

      thumb.style.transform = `translate3d(0, ${(railHeight - thumbHeight) * progress}px, 0)`;
      rail.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={railRef}
      className="scroll-rail"
      role="progressbar"
      aria-label="Progreso de lectura"
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div ref={thumbRef} className="scroll-rail-thumb" />
    </div>
  );
}
