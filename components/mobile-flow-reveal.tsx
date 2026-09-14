"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { GripVertical, RotateCcw } from "lucide-react";
import { useHydratedReducedMotion } from "@/components/use-hydrated-reduced-motion";

const chapters = [
  {
    title: "La solicitud queda registrada",
    body: "Un cliente escribe desde tu web. Arrastra para seguir su consulta.",
  },
  {
    title: "La IA prepara un borrador",
    body: "Con la información de tus servicios redacta una respuesta inicial.",
  },
  {
    title: "Tú revisas y continúas",
    body: "Compruebas la propuesta, ajustas y decides qué enviar.",
  },
];

export function MobileFlowReveal() {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [limit, setLimit] = useState(220);
  const [chapter, setChapter] = useState(1);
  const reduceMotion = useHydratedReducedMotion();
  const reveal = useTransform(
    x,
    [0, Math.max(limit, 1)],
    ["inset(0 82% 0 0 round 20px)", "inset(0 0% 0 0 round 20px)"],
  );
  const cableScale = useTransform(x, [0, Math.max(limit, 1)], [0.16, 1]);

  useMotionValueEvent(x, "change", (value) => {
    const progress = value / Math.max(limit, 1);
    const nextChapter = progress >= 0.84 ? 3 : progress >= 0.32 ? 2 : 1;
    setChapter((current) => (current === nextChapter ? current : nextChapter));
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => setLimit(Math.max(120, track.clientWidth - 62));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!reduceMotion) return;
    x.set(limit);
  }, [limit, reduceMotion, x]);

  function moveToChapter(nextChapter: number) {
    const target = nextChapter === 1 ? 0 : nextChapter === 2 ? limit * 0.56 : limit;
    if (reduceMotion) {
      x.set(target);
      return;
    }
    animate(x, target, { type: "spring", stiffness: 420, damping: 36 });
  }

  function reset() {
    moveToChapter(1);
  }

  // Keep the server and the first client render identical. When reduced motion
  // is enabled, the effect above moves the motion value to the final chapter
  // immediately after hydration.
  const activeChapterNumber = chapter;
  const activeChapter = chapters[activeChapterNumber - 1];

  return (
    <section
      className="mobile-flow-reveal"
      id="ia-aplicada-movil"
      aria-labelledby="mobile-flow-title"
      data-chapter={activeChapterNumber}
    >
      <div className="mobile-flow-heading">
        <p className="mobile-flow-kicker">Automatización con IA</p>
        <h2 id="mobile-flow-title">
          Una consulta llega. El siguiente paso queda preparado.
        </h2>
        <p>
          Arrastra para recorrer los tres pasos. La tecnología prepara el
          trabajo; tú mantienes la decisión.
        </p>
      </div>

      <figure className="mobile-flow-frame">
        <Image
          src="/images/daily-tangle.png"
          alt="Mesa con tareas y notas desordenadas."
          fill
          sizes="(max-width: 900px) calc(100vw - 2.5rem), 1px"
        />
        <motion.div className="mobile-flow-after" style={{ clipPath: reveal }}>
          <Image
            src="/images/clear-flow.png"
            alt="La misma idea de trabajo convertida en un recorrido ordenado."
            fill
            sizes="(max-width: 900px) calc(100vw - 2.5rem), 1px"
          />
        </motion.div>
        <span className="mobile-flow-label mobile-flow-label-before">Consulta</span>
        <span className="mobile-flow-label mobile-flow-label-after">Borrador</span>
        <span className="mobile-flow-note" aria-hidden="true">Nueva consulta</span>
        <span className="mobile-flow-phone-pulse" aria-hidden="true" />
        <span className="mobile-flow-status" aria-hidden="true">BORRADOR · LISTO</span>

        <div className="mobile-flow-track" ref={trackRef}>
          <motion.span
            className="mobile-flow-cable"
            style={{ scaleX: cableScale, originX: 0 }}
            aria-hidden="true"
          />
          <motion.button
            className="mobile-flow-handle"
            type="button"
            drag="x"
            dragConstraints={{ left: 0, right: limit }}
            dragElastic={0.04}
            dragMomentum={false}
            style={{ x }}
            whileTap={reduceMotion ? undefined : { scale: 0.94 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > limit * 0.84 || info.velocity.x > 420) moveToChapter(3);
              else if (info.offset.x > limit * 0.32) moveToChapter(2);
              else moveToChapter(1);
            }}
            onClick={() =>
              moveToChapter(activeChapterNumber === 3 ? 1 : activeChapterNumber + 1)
            }
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                moveToChapter(Math.min(3, activeChapterNumber + 1));
              }
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                moveToChapter(Math.max(1, activeChapterNumber - 1));
              }
              if (event.key === "End") {
                event.preventDefault();
                moveToChapter(3);
              }
              if (event.key === "Home") {
                event.preventDefault();
                moveToChapter(1);
              }
            }}
            role="slider"
            aria-label="Avanzar por el ejemplo de los tres pasos"
            aria-valuemin={1}
            aria-valuemax={3}
            aria-valuenow={activeChapterNumber}
            aria-valuetext={`Paso ${activeChapterNumber}: ${activeChapter.title}`}
          >
            <GripVertical aria-hidden="true" size={22} />
          </motion.button>
        </div>

        <figcaption aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={activeChapter.title}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
            >
              <strong>{activeChapter.title}.</strong> {activeChapter.body}
            </motion.span>
          </AnimatePresence>
          {activeChapterNumber === 3 && !reduceMotion && (
            <button type="button" onClick={reset}>
              <RotateCcw aria-hidden="true" size={16} />
              Ver otra vez
            </button>
          )}
        </figcaption>
      </figure>
    </section>
  );
}
