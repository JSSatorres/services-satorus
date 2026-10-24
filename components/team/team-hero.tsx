"use client";

import Image from "next/image";
import { ArrowDown, RotateCcw } from "lucide-react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { relayOrder, teamById, type MemberId } from "@/lib/team";
import { scrollToProfiles } from "./scroll-to-profiles";
import { useMediaQuery } from "./use-media-query";
import styles from "./team.module.css";

/** Posición de reposo de cada polaroid, en fracciones del escenario. */
const placements: Record<MemberId, { left: number; top: number; rotate: number }> = {
  juan: { left: 0.19, top: 0.4, rotate: -7 },
  damian: { left: 0.5, top: 0.64, rotate: 4 },
  tony: { left: 0.82, top: 0.36, rotate: -3 },
};

type Offsets = Record<MemberId, { x: MotionValue<number>; y: MotionValue<number> }>;

type TeamHeroProps = {
  onOpen: (id: MemberId) => void;
};

export function TeamHero({ onOpen }: TeamHeroProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canDrag = useMediaQuery("(min-width: 761px) and (pointer: fine)");
  const [front, setFront] = useState<MemberId | null>(null);
  const [moved, setMoved] = useState(false);

  const stageW = useMotionValue(0);
  const stageH = useMotionValue(0);
  /** Pinza de cada polaroid en reposo, en píxeles del escenario. */
  const restPins = useMotionValue<Record<MemberId, { x: number; y: number }> | null>(null);
  const offsets: Offsets = {
    tony: { x: useMotionValue(0), y: useMotionValue(0) },
    damian: { x: useMotionValue(0), y: useMotionValue(0) },
    juan: { x: useMotionValue(0), y: useMotionValue(0) },
  };

  // El hilo pasa por la pinza de cada polaroid y sigue a la tarjeta cuando se
  // arrastra: se recalcula con los mismos valores que mueven las tarjetas.
  const thread = useTransform(() => {
    const w = stageW.get();
    const h = stageH.get();
    const rest = restPins.get();
    if (!w || !rest) return "";

    const pins = relayOrder.map((id) => ({
      x: rest[id].x + offsets[id].x.get(),
      y: rest[id].y + offsets[id].y.get(),
    }));
    const points = [{ x: -40, y: pins[0].y - h * 0.08 }, ...pins, { x: w + 40, y: pins[2].y - h * 0.1 }];

    return points.reduce((path, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      const previous = points[index - 1];
      const sag = 18 + Math.hypot(point.x - previous.x, point.y - previous.y) * 0.14;
      return `${path} Q ${(previous.x + point.x) / 2} ${(previous.y + point.y) / 2 + sag} ${point.x} ${point.y}`;
    }, "");
  });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // `offsetLeft`/`offsetTop` ignoran los transforms: dan la posición de
    // reposo aunque la tarjeta esté arrastrada o entrando.
    const measure = () => {
      stageW.set(stage.clientWidth);
      stageH.set(stage.clientHeight);
      const cards = stage.querySelectorAll<HTMLElement>("[data-hero-card]");
      const pins = {} as Record<MemberId, { x: number; y: number }>;
      cards.forEach((card) => {
        pins[card.dataset.heroCard as MemberId] = {
          x: card.offsetLeft + card.offsetWidth / 2,
          y: card.offsetTop + 4,
        };
      });
      restPins.set(pins);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [stageW, stageH, restPins]);

  function tidyUp() {
    relayOrder.forEach((id) => {
      animate(offsets[id].x, 0, { type: "spring", stiffness: 210, damping: 22 });
      animate(offsets[id].y, 0, { type: "spring", stiffness: 210, damping: 22 });
    });
    setMoved(false);
  }

  function goToProfiles() {
    scrollToProfiles();
  }

  return (
    <section className={styles.hero} aria-labelledby="team-title">
      <div className={styles.heroCopy}>
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          El equipo de Satorus
        </motion.p>
        <h1 id="team-title" data-reveal="lines">
          Dos ingenieros de software.<br /> <span>Un empresario.</span>
        </h1>
        <motion.p
          className={styles.heroLead}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          Detrás de cada web, herramienta o automatización hay dos ingenieros que diseñan la
          arquitectura, el código y la inteligencia artificial, y un empresario con más de veinte años
          dirigiendo pymes que se asegura de que todo tenga sentido para tu negocio.
        </motion.p>
        <motion.div
          className={styles.heroActions}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <button type="button" className={styles.primaryAction} onClick={goToProfiles}>
            Conócenos <ArrowDown aria-hidden="true" size={19} />
          </button>
        </motion.div>
      </div>

      <div className={styles.heroStage} ref={stageRef}>
        <svg className={styles.thread} aria-hidden="true">
          <motion.path
            d={thread}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, delay: 1.1, ease: [0.65, 0, 0.35, 1] }}
          />
        </svg>

        {relayOrder.map((id, index) => {
          const member = teamById[id];
          const place = placements[id];

          return (
            <HeroCard
              key={id}
              id={id}
              index={index}
              name={member.shortName}
              origin={member.origin}
              photo={member.photo}
              accent={member.accent}
              place={place}
              x={offsets[id].x}
              y={offsets[id].y}
              isFront={front === id}
              canDrag={canDrag}
              stageRef={stageRef}
              onGrab={() => {
                setFront(id);
                setMoved(true);
              }}
              onOpen={() => onOpen(id)}
            />
          );
        })}

        <motion.button
          type="button"
          className={styles.tidyButton}
          onClick={tidyUp}
          initial={false}
          animate={{ opacity: moved ? 1 : 0, y: moved ? 0 : 10, pointerEvents: moved ? "auto" : "none" }}
          tabIndex={moved ? 0 : -1}
        >
          <RotateCcw aria-hidden="true" size={15} /> Recolocar
        </motion.button>
      </div>
    </section>
  );
}

type HeroCardProps = {
  id: MemberId;
  index: number;
  name: string;
  origin: string;
  photo: string;
  accent: string;
  place: { left: number; top: number; rotate: number };
  x: MotionValue<number>;
  y: MotionValue<number>;
  isFront: boolean;
  canDrag: boolean;
  stageRef: React.RefObject<HTMLDivElement | null>;
  onGrab: () => void;
  onOpen: () => void;
};

function HeroCard({
  id,
  index,
  name,
  origin,
  photo,
  accent,
  place,
  x,
  y,
  isFront,
  canDrag,
  stageRef,
  onGrab,
  onOpen,
}: HeroCardProps) {
  const dragged = useRef(false);

  return (
    <motion.button
      type="button"
      data-hero-card={id}
      data-accent={accent}
      className={styles.heroCard}
      aria-label={`Ver el perfil de ${name}`}
      style={{
        left: `${place.left * 100}%`,
        top: `${place.top * 100}%`,
        x,
        y,
        rotate: place.rotate,
        zIndex: isFront ? 5 : 2 + index,
      }}
      drag={canDrag}
      dragConstraints={stageRef}
      dragElastic={0.18}
      dragTransition={{ power: 0.25, timeConstant: 220 }}
      whileHover={{ scale: 1.04, rotate: place.rotate * 0.4 }}
      whileDrag={{ scale: 1.08, rotate: 0, cursor: "grabbing" }}
      onPointerDown={onGrab}
      onDragStart={() => {
        dragged.current = true;
      }}
      onDragEnd={() => {
        window.setTimeout(() => {
          dragged.current = false;
        }, 0);
      }}
      onClick={() => {
        if (dragged.current) return;
        onOpen();
      }}
    >
      <motion.span
        className={styles.heroCardInner}
        initial={{ opacity: 0, y: -160, rotate: place.rotate * -3 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.25 + index * 0.18 }}
      >
        <span className={styles.clip} aria-hidden="true" />
        <span className={styles.duo}>
          <Image src={photo} alt="" fill sizes="(max-width: 760px) 40vw, 15vw" priority draggable={false} />
        </span>
        <span className={styles.heroCardCaption}>
          <strong>{name}</strong>
          <span>{origin}</span>
        </span>
      </motion.span>
    </motion.button>
  );
}
