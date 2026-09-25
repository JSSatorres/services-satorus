"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  MessageSquare,
  RotateCcw,
} from "lucide-react";
import styles from "./missing-piece.module.css";

gsap.registerPlugin(useGSAP);

/** The HTML is complete; the animation is an optional, scoped enhancement. */
export function MissingPieceScene() {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const scene = root.current;
        if (!scene) return;
        const select = gsap.utils.selector(scene);
        const sequence = gsap.timeline({ paused: true });
        timeline.current = sequence;
        scene.dataset.animated = "true";
        sequence
          .set(scene, { attr: { "data-phase": "pending" } })
          .set(select("[data-piece]"), {
            xPercent: 28,
            yPercent: -63,
            rotation: -12,
            scale: 0.82,
          })
          .set(select("[data-door-left], [data-door-right]"), { rotationY: 0 })
          .set(
            select(
              "[data-result], [data-tool-content], [data-caption='complete']",
            ),
            { opacity: 0 },
          )
          .set(select("[data-caption='pending'], [data-gap-label]"), {
            opacity: 1,
          })
          .set(select("[data-token]"), { opacity: 1, x: 130, y: 188 })
          .to(
            select("[data-token]"),
            { y: 350, duration: 0.45, ease: "power2.inOut" },
            0.15,
          )
          .to(select("[data-token]"), {
            x: 235,
            duration: 0.3,
            ease: "power2.out",
          })
          .to(select("[data-gap-label]"), { opacity: 0, duration: 0.2 }, 1.05)
          .to(
            select("[data-piece]"),
            {
              xPercent: 0,
              yPercent: 0,
              rotation: 0,
              scale: 1,
              duration: 0.9,
              ease: "power3.inOut",
            },
            1.1,
          )
          .set(scene, { attr: { "data-phase": "connected" } }, 2)
          .to(
            select("[data-door-left]"),
            { rotationY: -115, duration: 0.75, ease: "power2.inOut" },
            2.05,
          )
          .to(
            select("[data-door-right]"),
            { rotationY: 115, duration: 0.75, ease: "power2.inOut" },
            2.1,
          )
          .to(
            select("[data-tool-content]"),
            { opacity: 1, duration: 0.35 },
            2.35,
          )
          .to(
            select("[data-token]"),
            { x: 520, duration: 0.55, ease: "power1.inOut" },
            2.65,
          )
          .to(
            select("[data-token]"),
            { y: 524, duration: 0.4, ease: "power2.in" },
            3.2,
          )
          .fromTo(
            select("[data-result]"),
            { y: 16, rotation: 5 },
            {
              y: 0,
              rotation: -4,
              opacity: 1,
              duration: 0.5,
              ease: "back.out(1.3)",
            },
            3.5,
          )
          .to(
            select("[data-caption='pending']"),
            { opacity: 0, duration: 0.2 },
            3.6,
          )
          .to(
            select("[data-caption='complete']"),
            { opacity: 1, duration: 0.25 },
            3.8,
          )
          .set(scene, { attr: { "data-phase": "complete" } });
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) return;
            sequence.play(0);
            observer.disconnect();
          },
          { threshold: 0.45 },
        );
        sequence.progress(0);
        observer.observe(scene);
        return () => {
          observer.disconnect();
          timeline.current = null;
          delete scene.dataset.animated;
          delete scene.dataset.phase;
        };
      });
      return () => media.revert();
    },
    { scope: root },
  );
  function replay() {
    timeline.current?.restart();
  }
  return (
    <figure
      className={styles.example}
      ref={root}
      aria-labelledby="example-caption"
    >
      <div className={styles.bench} aria-hidden="true">
        <div className={styles.benchLabel}>
          <span className={styles.indicator} /> UNA CONSULTA. UN CAMINO CLARO.
        </div>
        <span className={`${styles.screw} ${styles.screwLeft}`} />
        <span className={`${styles.screw} ${styles.screwRight}`} />
        <div className={styles.ruler} />
        <svg className={styles.circuit} viewBox="0 0 640 640" fill="none">
          <path
            d="M130 176V318Q130 350 162 350H260 M416 350H488Q520 350 520 382V528"
            stroke="#152c85"
            strokeWidth="20"
          />
          <path
            d="M130 172V314Q130 346 162 346H260 M416 346H488Q520 346 520 378V524"
            stroke="#e56748"
            strokeWidth="12"
          />
          <path
            d="M252 346H425"
            stroke="#e56748"
            strokeWidth="12"
            strokeDasharray="3 10"
            opacity="0.5"
          />
          <circle
            data-token=""
            r="7"
            fill="#dfe97a"
            cx="0"
            cy="0"
            opacity="0"
          />
        </svg>
        <div className={styles.incoming}>
          <div className={styles.noteTop}>
            <MessageSquare size={15} />
            <span>Nueva consulta</span>
            <span>09:41</span>
          </div>
          <p>
            Hola, ¿podéis darme
            <br />
            un presupuesto?
          </p>
          <span className={styles.noteFoot}>
            Un cliente que quiere avanzar <ArrowDown size={12} />
          </span>
        </div>
        <div className={styles.socket}>
          <span data-gap-label="">
            Aquí falta
            <br />
            una pieza.
          </span>
        </div>
        <div className={styles.piece} data-piece="">
          <div className={styles.toolContent} data-tool-content="">
            <div className={styles.toolTop}>
              <span>CONSULTAS</span>
              <span className={styles.toolDot} />
            </div>
            <strong>Todo a mano.</strong>
            <div className={styles.toolRow}>
              <Check size={13} />
              <span>Consulta registrada</span>
            </div>
            <div className={styles.toolRow}>
              <Check size={13} />
              <span>Responsable asignado</span>
            </div>
            <div className={styles.toolAction}>
              Preparar presupuesto <ArrowUpRight size={15} />
            </div>
          </div>
          <div
            className={`${styles.door} ${styles.doorLeft}`}
            data-door-left=""
          >
            <span>
              Hecho
              <br />
              para ti.
            </span>
            <span className={styles.doorMark}>satorus.</span>
          </div>
          <div
            className={`${styles.door} ${styles.doorRight}`}
            data-door-right=""
          >
            <span className={styles.joinMark}>↗</span>
            <span className={styles.doorCode}>A MEDIDA</span>
          </div>
        </div>
        <div className={styles.result} data-result="">
          <span className={styles.resultCheck}>
            <Check size={20} strokeWidth={3} />
          </span>
          <div>
            <small>SIGUIENTE PASO</small>
            <strong>Revisar y enviar.</strong>
            <p>La decisión sigue siendo tuya.</p>
          </div>
        </div>
        <div className={styles.benchCaption}>
          <span data-caption="pending">
            Una oportunidad no debería quedarse a medias.
          </span>
          <span data-caption="complete">
            La pieza encaja. El trabajo continúa.
          </span>
        </div>
      </div>
      <figcaption className={styles.exampleCaption} id="example-caption">
        <p>
          Ejemplo ilustrativo: de una consulta pendiente a un presupuesto listo
          para revisar.
        </p>
        <button type="button" className={styles.replay} onClick={replay}>
          <RotateCcw size={14} aria-hidden="true" /> Repetir ejemplo
        </button>
      </figcaption>
    </figure>
  );
}
