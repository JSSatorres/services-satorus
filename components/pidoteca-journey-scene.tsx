"use client";

import Image from "next/image";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  Armchair,
  Check,
  ChefHat,
  GlassWater,
  Pause,
  Play,
  QrCode,
  ScanLine,
  Send,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./pidoteca-journey-scene.module.css";

const STEP_DURATION_MS = 2600;
const SCENE_EASE = [0.16, 1, 0.3, 1] as const;

const journeySteps = [
  {
    label: "Se sienta",
    title: "La mesa ya le está esperando",
    detail: "El QR identifica la mesa sin pedirle que descargue ninguna app.",
    icon: Armchair,
  },
  {
    label: "Escanea",
    title: "Un gesto abre la carta",
    detail: "La cámara reconoce el código y lleva al cliente a la carta del restaurante.",
    icon: ScanLine,
  },
  {
    label: "Elige",
    title: "Ve los platos y decide",
    detail: "Fotos, precios y sugerencias aparecen en una experiencia pensada para móvil.",
    icon: UtensilsCrossed,
  },
  {
    label: "Envía",
    title: "El pedido entra en el turno",
    detail: "Sala recibe la mesa y cada elaboración sigue su camino hacia cocina o barra.",
    icon: Send,
  },
] as const;

const qrCells = [
  1, 1, 1, 0, 1, 1, 1, 1,
  1, 0, 1, 0, 1, 0, 0, 1,
  1, 1, 1, 0, 1, 0, 1, 1,
  0, 0, 0, 1, 0, 1, 0, 0,
  1, 1, 0, 0, 1, 1, 1, 0,
  1, 0, 1, 1, 0, 0, 1, 1,
  1, 1, 0, 1, 1, 0, 1, 0,
  1, 0, 1, 0, 1, 1, 1, 1,
];

function PhoneScreen({ activeStep }: { activeStep: number }) {
  return (
    <div className={styles.phoneScreen}>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={activeStep}
          className={styles.phoneStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: SCENE_EASE }}
        >
          {activeStep === 0 ? (
            <div className={styles.phoneWelcome}>
              <span>Pidoteca</span>
              <strong>Tu mesa está lista</strong>
              <div><QrCode aria-hidden="true" size={45} /></div>
              <small>Enfoca el código de la mesa con la cámara.</small>
            </div>
          ) : null}

          {activeStep === 1 ? (
            <div className={styles.phoneScanner}>
              <div className={styles.qrGrid}>
                {qrCells.map((cell, index) => (
                  <span key={index} data-filled={Boolean(cell)} />
                ))}
                <motion.i
                  aria-hidden="true"
                  animate={{ y: [0, 84, 0] }}
                  transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <small>QR detectado</small>
            </div>
          ) : null}

          {activeStep === 2 ? (
            <div className={styles.phoneMenu}>
              <span>LA CASA DE LA PLAZA</span>
              <header><strong>Para compartir</strong><small>2 en pedido</small></header>
              <div className={styles.dishes}>
                {[
                  ["Croquetas de jamón", "8,50 €", "croquette"],
                  ["Ensaladilla de la casa", "7,00 €", "salad"],
                ].map(([name, price, tone], index) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.24, delay: index * 0.07 }}
                  >
                    <i data-tone={tone} />
                    <b>{name}<small>{price}</small></b>
                    <em>+</em>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : null}

          {activeStep === 3 ? (
            <div className={styles.phoneSent}>
              <motion.span
                initial={{ scale: 0.72 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.36, bounce: 0.25 }}
              >
                <Check aria-hidden="true" size={28} strokeWidth={3} />
              </motion.span>
              <strong>¡Marchando!</strong>
              <p>Tu pedido ya está con el equipo.</p>
              <div><small>Pedido #38</small><b>Enviado</b></div>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function JourneyScene({ className = "" }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (reduceMotion || isPaused) return;
    const timer = window.setInterval(() => {
      setActiveStep((step) => (step + 1) % journeySteps.length);
    }, STEP_DURATION_MS);
    return () => window.clearInterval(timer);
  }, [isPaused, reduceMotion]);

  const step = journeySteps[activeStep];
  const StepIcon = step.icon;

  const selectStep = (index: number) => {
    setActiveStep(index);
    setIsPaused(true);
  };

  return (
    <figure
      className={`${styles.journey} ${className}`.trim()}
      aria-labelledby="pidoteca-journey-caption"
    >
      <div className={styles.frame}>
        <div className={styles.frameHeader}>
          <span>Así vive el pedido tu cliente</span>
          <button
            type="button"
            onClick={() => setIsPaused((paused) => !paused)}
            aria-label={isPaused ? "Reproducir animación" : "Pausar animación"}
          >
            {isPaused ? <Play aria-hidden="true" size={14} /> : <Pause aria-hidden="true" size={14} />}
            {isPaused ? "Reproducir" : "Pausar"}
          </button>
        </div>

        <div className={styles.stage}>
          <motion.div
            className={styles.stageImage}
            animate={{ scale: activeStep === 0 ? 1.035 : 1 }}
            transition={{ duration: 0.38, ease: SCENE_EASE }}
          >
            <Image
              src="/products/pidoteca-customer-journey.webp"
              alt="Cliente en una mesa de restaurante consultando Pidoteca desde el móvil"
              fill
              loading="eager"
              sizes="(max-width: 900px) 100vw, 72vw"
            />
          </motion.div>
          <div className={styles.stageShade} aria-hidden="true" />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeStep}
              className={styles.stepCopy}
              initial={{ opacity: 0, clipPath: "inset(0 0 22% 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.38, ease: SCENE_EASE }}
            >
              <span><StepIcon aria-hidden="true" size={16} />Paso {activeStep + 1} de 4</span>
              <strong>{step.title}</strong>
              <p>{step.detail}</p>
            </motion.div>
          </AnimatePresence>

          <span className={styles.tableLabel}>Mesa 12</span>

          <motion.div
            className={styles.phone}
            animate={{
              x: activeStep === 0 ? 38 : activeStep === 1 ? 8 : -10,
              y: activeStep === 0 ? 54 : activeStep === 1 ? 22 : 4,
              rotate: activeStep === 0 ? 10 : activeStep === 1 ? 4 : 0,
              scale: activeStep < 2 ? 0.82 : 1,
            }}
            transition={{ duration: 0.38, ease: SCENE_EASE }}
          >
            <span aria-hidden="true" />
            <PhoneScreen activeStep={activeStep} />
          </motion.div>

          <motion.svg
            className={styles.receivedRoute}
            viewBox="0 0 640 510"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d="M 475 180 C 530 130, 570 130, 600 92"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="5 7"
              initial={false}
              animate={{ pathLength: activeStep === 3 ? 1 : 0, opacity: activeStep === 3 ? 0.9 : 0 }}
              transition={{ duration: 0.38, ease: SCENE_EASE }}
            />
          </motion.svg>

          <motion.div
            className={styles.received}
            initial={false}
            animate={{ opacity: activeStep === 3 ? 1 : 0, scale: activeStep === 3 ? 1 : 0.94 }}
            transition={{ duration: 0.28, ease: SCENE_EASE }}
          >
            <span><Check aria-hidden="true" size={14} />Pedido recibido</span>
            <div><b><ChefHat aria-hidden="true" size={14} />Cocina</b><b><GlassWater aria-hidden="true" size={14} />Barra</b></div>
          </motion.div>
        </div>

        <div className={styles.stepNav} aria-label="Pasos del pedido">
          {journeySteps.map(({ label, icon: Icon }, index) => (
            <button
              key={label}
              type="button"
              onClick={() => selectStep(index)}
              aria-pressed={activeStep === index}
            >
              <Icon aria-hidden="true" size={18} />
              <span>{label}</span>
              {activeStep === index && !isPaused ? (
                <motion.i
                  aria-hidden="true"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: STEP_DURATION_MS / 1000, ease: "linear" }}
                />
              ) : null}
            </button>
          ))}
        </div>
      </div>
      <figcaption id="pidoteca-journey-caption">
        Recorrido real del producto: de la mesa al equipo, sin cambiar de herramienta.
      </figcaption>
    </figure>
  );
}

export function PidotecaJourneyScene({ className }: { className?: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <JourneyScene className={className} />
    </MotionConfig>
  );
}
