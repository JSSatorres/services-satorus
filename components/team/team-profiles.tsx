"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useRef, type KeyboardEvent } from "react";
import { relayOrder, teamById, type MemberId } from "@/lib/team";
import styles from "./team.module.css";

const ease = [0.16, 1, 0.3, 1] as const;

const copyVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.18 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

const charVariants: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.7, ease } },
  exit: { y: "-110%", transition: { duration: 0.25 } },
};

type TeamProfilesProps = {
  selected: MemberId;
  onSelect: (id: MemberId) => void;
};

export function TeamProfiles({ selected, onSelect }: TeamProfilesProps) {
  const tabRefs = useRef<Record<MemberId, HTMLButtonElement | null>>({ tony: null, damian: null, juan: null });
  const member = teamById[selected];
  const position = relayOrder.indexOf(selected);

  function step(delta: number, focus = false) {
    const next = relayOrder[(position + delta + relayOrder.length) % relayOrder.length];
    onSelect(next);
    if (focus) tabRefs.current[next]?.focus();
  }

  function handleTabKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") step(1, true);
    else if (event.key === "ArrowLeft") step(-1, true);
    else return;
    event.preventDefault();
  }

  return (
    <section id="perfiles" className={styles.profiles} aria-labelledby="profiles-title">
      <div className={styles.profilesHead}>
        <p className={styles.eyebrow}>Quiénes somos</p>
        <h2 id="profiles-title" data-reveal="lines">
          Ingeniería y empresa. <span>En la misma mesa.</span>
        </h2>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Miembros del equipo" onKeyDown={handleTabKeys}>
        {relayOrder.map((id) => {
          const person = teamById[id];
          const active = id === selected;
          return (
            <button
              key={id}
              ref={(node) => {
                tabRefs.current[id] = node;
              }}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={active}
              aria-controls="profile-panel"
              tabIndex={active ? 0 : -1}
              className={styles.tab}
              data-active={active}
              onClick={() => onSelect(id)}
            >
              <span className={styles.tabAvatar} data-accent={person.accent}>
                <Image src={person.photo} alt="" fill sizes="48px" />
              </span>
              <span className={styles.tabText}>
                <strong>{person.shortName}</strong>
                <span>{person.role}</span>
              </span>
              {active && <motion.span layoutId="team-tab-marker" className={styles.tabMarker} />}
            </button>
          );
        })}
      </div>

      <div
        id="profile-panel"
        role="tabpanel"
        aria-labelledby={`tab-${selected}`}
        className={styles.panelWrap}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={member.id}
            className={styles.panel}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <motion.span
              className={styles.ghostName}
              aria-hidden="true"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 1.1, ease } }}
              exit={{ opacity: 0, x: -60, transition: { duration: 0.3 } }}
            >
              {member.shortName}
            </motion.span>

            <div className={styles.portraitColumn}>
              <motion.figure
                className={styles.portrait}
                data-accent={member.accent}
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.85, ease } }}
                exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.35, ease: [0.7, 0, 0.84, 0] } }}
              >
                <motion.span
                  className={styles.duo}
                  initial={{ scale: 1.25 }}
                  animate={{ scale: 1, transition: { duration: 1.2, ease } }}
                >
                  <Image src={member.photo} alt={member.photoAlt} fill sizes="(max-width: 900px) 88vw, 40vw" />
                </motion.span>
                <figcaption>Pasa el ratón para verlo a color</figcaption>
              </motion.figure>

              <Stamp text={member.stamp} accent={member.accent} />

              <div className={styles.panelNav}>
                <button type="button" onClick={() => step(-1)} aria-label="Perfil anterior">
                  <ArrowLeft aria-hidden="true" size={20} />
                </button>
                <span>
                  <strong>0{position + 1}</strong> / 0{relayOrder.length}
                </span>
                <button type="button" onClick={() => step(1)} aria-label="Perfil siguiente">
                  <ArrowRight aria-hidden="true" size={20} />
                </button>
              </div>
            </div>

            <motion.div className={styles.profileCopy} variants={copyVariants}>
              <motion.p className={styles.profileMeta} variants={lineVariants}>
                {member.role}
                <span>
                  <MapPin aria-hidden="true" size={15} /> {member.location}
                </span>
              </motion.p>

              <h3 className={styles.profileName} aria-label={member.name}>
                <motion.span aria-hidden="true" variants={{ show: { transition: { staggerChildren: 0.03 } } }}>
                  {member.name.split(" ").map((word, wordIndex) => (
                    <span key={wordIndex} className={styles.word}>
                      {Array.from(word).map((char, charIndex) => (
                        <motion.span key={charIndex} className={styles.char} variants={charVariants}>
                          {char}
                        </motion.span>
                      ))}
                    </span>
                  ))}
                </motion.span>
              </h3>

              <motion.p className={styles.profileStory} variants={lineVariants}>
                {member.story}
              </motion.p>

              <motion.div variants={lineVariants}>
                <h4 className={styles.subhead}>Lo que aporta a tu negocio</h4>
                <ol className={styles.brings}>
                  {member.brings.map((item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.45 + index * 0.08, ease }}
                    >
                      <span>0{index + 1}</span>
                      {item}
                    </motion.li>
                  ))}
                </ol>
              </motion.div>

              <motion.blockquote className={styles.quote} variants={lineVariants}>
                <p>{member.quote}</p>
              </motion.blockquote>

              {member.link && (
                <motion.a
                  className={styles.profileLink}
                  href={member.link.href}
                  target="_blank"
                  rel="noreferrer"
                  variants={lineVariants}
                >
                  {member.link.label} <ArrowUpRight aria-hidden="true" size={17} />
                </motion.a>
              )}
            </motion.div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Stamp({ text, accent }: { text: string; accent: string }) {
  const id = `stamp-${accent}`;
  return (
    <motion.span
      className={styles.stamp}
      data-accent={accent}
      aria-hidden="true"
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 14, delay: 0.55 } }}
      exit={{ scale: 0, transition: { duration: 0.2 } }}
    >
      <svg viewBox="0 0 200 200">
        <defs>
          <path id={id} d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0" />
        </defs>
        <text>
          <textPath href={`#${id}`} textLength="462">
            {text.toUpperCase()}
          </textPath>
        </text>
      </svg>
      <span className={styles.stampCore}>✦</span>
    </motion.span>
  );
}
