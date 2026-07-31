"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { GripVertical, RotateCcw } from "lucide-react";

export function MobileFlowReveal() {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [limit, setLimit] = useState(220);
  const [complete, setComplete] = useState(false);
  const reduceMotion = useReducedMotion();
  const reveal = useTransform(
    x,
    [0, Math.max(limit, 1)],
    ["inset(0 82% 0 0 round 20px)", "inset(0 0% 0 0 round 20px)"],
  );
  const cableScale = useTransform(x, [0, Math.max(limit, 1)], [0.16, 1]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => setLimit(Math.max(120, track.clientWidth - 62));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  function settle(target: number, nextComplete: boolean) {
    setComplete(nextComplete);
    if (reduceMotion) {
      x.set(target);
      return;
    }
    animate(x, target, { type: "spring", stiffness: 420, damping: 36 });
  }

  function finish() {
    settle(limit, true);
  }

  function reset() {
    settle(0, false);
  }

  return (
    <section className="mobile-flow-reveal" aria-labelledby="mobile-flow-title">
      <div className="mobile-flow-heading">
        <h2 id="mobile-flow-title">Desliza el cable. Ordena el día.</h2>
        <p>
          En móvil no queremos que mires una animación: queremos que notes el cambio con
          el dedo.
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
        <span className="mobile-flow-label mobile-flow-label-before">Antes</span>
        <span className="mobile-flow-label mobile-flow-label-after">Claro</span>

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
              if (info.offset.x > limit * 0.48 || info.velocity.x > 420) finish();
              else reset();
            }}
            onClick={() => (complete ? reset() : finish())}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "End") {
                event.preventDefault();
                finish();
              }
              if (event.key === "ArrowLeft" || event.key === "Home") {
                event.preventDefault();
                reset();
              }
            }}
            role="slider"
            aria-label="Comparar el antes y el después"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={complete ? 100 : 18}
            aria-valuetext={complete ? "Recorrido ordenado" : "Recorrido enredado"}
          >
            <GripVertical aria-hidden="true" size={22} />
          </motion.button>
        </div>

        <figcaption>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={complete ? "done" : "drag"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {complete ? "Así se siente un proceso claro." : "Arrastra hacia la derecha."}
            </motion.span>
          </AnimatePresence>
          {complete && (
            <button type="button" onClick={reset}>
              <RotateCcw aria-hidden="true" size={16} />
              Comparar otra vez
            </button>
          )}
        </figcaption>
      </figure>
    </section>
  );
}
