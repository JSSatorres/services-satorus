"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { relayOrder, scenarios, teamById } from "@/lib/team";
import styles from "./team.module.css";

const ease = [0.16, 1, 0.3, 1] as const;
/** Lo que tarda el testigo en pasar de una persona a la siguiente. */
const HANDOFF = 0.55;

export function TeamRelay() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];

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
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={active}
                className={styles.problem}
                data-active={active}
                onClick={() => setScenarioId(item.id)}
              >
                {active && (
                  <motion.span
                    layoutId="relay-problem-fill"
                    className={styles.problemFill}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className={styles.problemText}>{item.problem}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.board} aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.id}
            className={styles.boardSheet}
            initial={{ opacity: 0, y: 30, rotate: 1.4 }}
            animate={{ opacity: 1, y: 0, rotate: -0.6 }}
            exit={{ opacity: 0, y: -24, rotate: -2, transition: { duration: 0.25 } }}
            transition={{ duration: 0.55, ease }}
          >
            <p className={styles.boardLabel}>El problema</p>
            <p className={styles.boardProblem}>«{scenario.problem}»</p>

            <div className={styles.stations}>
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
        </AnimatePresence>
      </div>
    </section>
  );
}
