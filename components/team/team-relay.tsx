"use client";

import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { getLenis } from "@/lib/lenis";
import { relayOrder, scenarios, teamById, type Scenario } from "@/lib/team";
import styles from "./team.module.css";

const ease = [0.16, 1, 0.3, 1] as const;
/** Lo que tarda el testigo en pasar de una persona a la siguiente. */
const HANDOFF = 0.55;
/**
 * Por debajo de este ancho la pizarra no cabe al lado de la lista: se
 * despliega bajo el problema elegido, como un acordeón. Debe coincidir con la
 * media query de `.board` / `.inlineBoard` en `team.module.css`.
 */
const COMPACT_QUERY = "(max-width: 1100px)";

export function TeamRelay() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const inlineRefs = useRef<Record<string, HTMLDivElement | null>>({});

  function select(id: string) {
    if (id === scenarioId) return;

    // En el acordeón, el problema pulsado sube hasta arriba para que su
    // respuesta se vea entera. Si la pizarra abierta está por encima, se
    // cierra a la vez y el botón acaba esa altura más arriba: se descuenta.
    if (window.matchMedia(COMPACT_QUERY).matches) {
      const button = buttonRefs.current[id];
      const openBoard = inlineRefs.current[scenarioId];
      const opensBelow =
        scenarios.findIndex((item) => item.id === scenarioId) <
        scenarios.findIndex((item) => item.id === id);

      if (button) {
        const header = document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0;
        const shift = opensBelow && openBoard ? openBoard.offsetHeight : 0;
        const top = button.getBoundingClientRect().top + window.scrollY - shift - header - 12;
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(top);
        else window.scrollTo({ top, behavior: "smooth" });
      }
    }

    setScenarioId(id);
  }

  return (
    <section className={styles.relay} aria-labelledby="relay-title">
      <div className={styles.relayIntro}>
        <p className={styles.eyebrow}>Ponnos a prueba</p>
        <h2 id="relay-title" data-reveal="lines">
          Elige un problema. <span>Mira cómo nos lo pasamos.</span>
        </h2>
        <p className={styles.relayLead}>
          Ningún problema de una empresa es solo técnico. Por eso cada caso pasa por las tres manos:
          la arquitectura que lo resuelve, la interfaz que lo hace fácil y el criterio de quien ha
          dirigido empresas como la tuya.
        </p>

        <div className={styles.problemList} role="radiogroup" aria-label="Problemas habituales">
          {scenarios.map((item) => {
            const active = item.id === scenario.id;
            return (
              <Fragment key={item.id}>
                <button
                  ref={(node) => {
                    buttonRefs.current[item.id] = node;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={styles.problem}
                  data-active={active}
                  onClick={() => select(item.id)}
                >
                  {active && (
                    <motion.span
                      layoutId="relay-problem-fill"
                      className={styles.problemFill}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className={styles.problemText}>{item.problem}</span>
                  <ChevronDown className={styles.problemChevron} aria-hidden="true" size={20} />
                </button>

                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      key="inline-board"
                      ref={(node) => {
                        inlineRefs.current[item.id] = node;
                      }}
                      className={styles.inlineBoard}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease }}
                    >
                      <RelayBoard scenario={item} inline />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Fragment>
            );
          })}
        </div>
      </div>

      <div className={styles.board} aria-live="polite">
        <AnimatePresence mode="wait">
          <RelayBoard key={scenario.id} scenario={scenario} />
        </AnimatePresence>
      </div>
    </section>
  );
}

type RelayBoardProps = {
  scenario: Scenario;
  /** Desplegada bajo su problema: sin repetir el enunciado ni inclinar la hoja. */
  inline?: boolean;
};

function RelayBoard({ scenario, inline = false }: RelayBoardProps) {
  const stationsRef = useRef<HTMLDivElement>(null);

  // El raíl va del centro del primer avatar al del último. Cuando el texto de
  // una estación es más alto que su avatar (móvil), esos centros ya no están
  // a media altura de avatar de los bordes: se miden. `offsetTop` ignora el
  // escalado con el que entran los avatares.
  useEffect(() => {
    const stations = stationsRef.current;
    if (!stations) return;

    const measure = () => {
      const avatars = stations.querySelectorAll<HTMLElement>("[data-station-avatar]");
      const first = avatars[0];
      const last = avatars[avatars.length - 1];
      if (!first || !last) return;
      stations.style.setProperty("--rail-top", `${first.offsetTop + first.offsetHeight / 2}px`);
      stations.style.setProperty(
        "--rail-bottom",
        `${stations.offsetHeight - last.offsetTop - last.offsetHeight / 2}px`,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stations);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      className={styles.boardSheet}
      initial={inline ? { opacity: 0, y: 12 } : { opacity: 0, y: 30, rotate: 1.4 }}
      animate={inline ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, rotate: -0.6 }}
      exit={{ opacity: 0, y: -24, rotate: -2, transition: { duration: 0.25 } }}
      transition={{ duration: 0.55, ease }}
    >
      {!inline && (
        <>
          <p className={styles.boardLabel}>El problema</p>
          <p className={styles.boardProblem}>«{scenario.problem}»</p>
        </>
      )}

      <div className={styles.stations} ref={stationsRef}>
        <span className={styles.stationRail} aria-hidden="true">
          <motion.span
            className={styles.stationRailFill}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: HANDOFF * 2, delay: 0.35, ease: "linear" }}
          />
          <motion.span
            className={styles.baton}
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: HANDOFF * 2, delay: 0.35, ease: "linear" }}
          />
        </span>

        <ol>
          {relayOrder.map((id, index) => {
            const member = teamById[id];
            const delay = 0.3 + index * HANDOFF;
            return (
              <li key={id} className={styles.station}>
                <motion.span
                  className={styles.stationAvatar}
                  data-station-avatar
                  data-accent={member.accent}
                  initial={{ scale: 0.4, opacity: 0.2 }}
                  animate={{ scale: [0.4, 1.18, 1], opacity: 1 }}
                  transition={{ duration: 0.5, delay, ease }}
                >
                  <Image src={member.photo} alt="" fill sizes="64px" />
                </motion.span>
                <motion.div
                  className={styles.stationCopy}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, delay: delay + 0.08, ease }}
                >
                  <p className={styles.stationWho}>
                    <strong>{member.shortName}</strong> · {member.role}
                  </p>
                  <p>{scenario.steps[id]}</p>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>

      <motion.p
        className={styles.boardResult}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.3 + HANDOFF * 3 }}
      >
        <Check aria-hidden="true" size={18} /> Una sola conversación contigo. Tres especialistas trabajando.
      </motion.p>
    </motion.div>
  );
}
