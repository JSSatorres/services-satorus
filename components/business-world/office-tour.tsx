"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Mail,
  MoveUpRight,
} from "lucide-react";
import {
  officeDestinations,
  destinationFromHash,
  type OfficePhase,
} from "@/lib/office-route";
import type { createOfficeScene } from "./office-scene";
import {
  ProcessScreen,
  SolutionsScreen,
  ProjectsScreen,
  ContactLetter,
} from "./office-sections";
import { useOfficeInput } from "./use-office-input";
import styles from "./office-tour.module.css";

type Scene = ReturnType<typeof createOfficeScene>;
export function OfficeTour() {
  const root = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const markers = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const scene = useRef<Scene | null>(null);
  const statusRef = useRef("loading");
  const state = useRef<{ index: number; phase: OfficePhase; arrived: number }>({
    index: -1,
    phase: "office",
    arrived: 0,
  });
  const sequence = useRef(0);
  const pending = useRef<number | null>(null);
  const anchor = useRef("");
  const [status, setStatus] = useState("loading");
  const [index, setIndex] = useState(-1);
  const [phase, setPhase] = useState<OfficePhase>("office");

  const navigate = useCallback((destination: number) => {
    const target = Math.max(-1, Math.min(3, destination));
    if (statusRef.current === "loading") {
      pending.current = target;
      return;
    }
    const token = ++sequence.current;
    state.current.index = target;
    setIndex(target);
    const changePhase = (next: OfficePhase) => {
      if (sequence.current !== token) return;
      state.current.phase = next;
      setPhase(next);
    };
    const complete = () => {
      if (sequence.current !== token) return;
      changePhase(target < 0 ? "office" : "reading");
      state.current.arrived = performance.now();
      const hash = target < 0 ? "#inicio" : `#${officeDestinations[target].id}`;
      window.history.replaceState(
        window.history.state,
        "",
        anchor.current || hash,
      );
      requestAnimationFrame(() => {
        if (sequence.current !== token) return;
        const panel = panels.current[target];
        if (
          anchor.current === "#preguntas" ||
          anchor.current === "#hablamos-claro"
        ) {
          const section = panel?.querySelector<HTMLElement>(anchor.current);
          if (section && panel)
            panel.scrollTop +=
              section.getBoundingClientRect().top -
              panel.getBoundingClientRect().top -
              28;
        }
        anchor.current = "";
        (target >= 0 ? panel : root.current)?.focus({ preventScroll: true });
      });
    };
    if (scene.current && statusRef.current === "ready")
      scene.current.visit(target, { phase: changePhase, complete });
    else complete();
  }, []);
  useOfficeInput(root, panels, state, navigate);

  useEffect(() => {
    const transitions = sequence;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let cancelled = false;
    const fallback = () => {
      if (cancelled) return;
      statusRef.current = "fallback";
      setStatus("fallback");
      navigate(state.current.index);
    };
    import("./office-scene")
      .then(({ createOfficeScene }) => {
        if (cancelled || !host.current) return;
        try {
          scene.current = createOfficeScene(
            host.current,
            markers.current as HTMLButtonElement[],
            navigate,
            fallback,
          );
          statusRef.current = "ready";
          setStatus("ready");
        } catch {
          statusRef.current = "fallback";
          setStatus("fallback");
        }
        const destination =
          pending.current ?? destinationFromHash(window.location.hash);
        anchor.current = destination >= 0 ? window.location.hash : "";
        if (destination >= 0) navigate(destination);
      })
      .catch(fallback);
    const hashChange = () => {
      const destination = destinationFromHash(window.location.hash);
      if (
        anchor.current === window.location.hash &&
        state.current.index === destination
      )
        return;
      anchor.current = window.location.hash;
      navigate(destination);
    };
    const linkClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element | null)?.closest("a[href]");
      const href = link?.getAttribute("href") ?? "";
      if (!href.startsWith("#") && !href.startsWith("/#")) return;
      const hash = href.slice(href.indexOf("#"));
      const target = destinationFromHash(hash);
      if (target < 0 && hash !== "#inicio") return;
      event.preventDefault();
      window.history.pushState(window.history.state, "", hash);
      anchor.current = hash;
      navigate(target);
    };
    window.addEventListener("hashchange", hashChange);
    window.addEventListener("popstate", hashChange);
    document.addEventListener("click", linkClick, true);
    return () => {
      cancelled = true;
      transitions.current++;
      scene.current?.dispose();
      scene.current = null;
      document.body.style.overflow = previous;
      window.removeEventListener("hashchange", hashChange);
      window.removeEventListener("popstate", hashChange);
      document.removeEventListener("click", linkClick, true);
    };
  }, [navigate]);

  const reading = phase === "reading";
  const flying = phase !== "office" && !reading;
  return (
    <div
      ref={root}
      className={styles.tour}
      data-office-tour=""
      data-phase={phase}
      data-destination={index}
      data-render-state={status}
      tabIndex={-1}
      aria-label="Recorrido por la oficina Satorus"
    >
      <h1 className="sr-only">
        Satorus. Webs, herramientas e inteligencia artificial para tu negocio.
      </h1>
      <div className={styles.scene} ref={host} />
      <div className={styles.markers} hidden={reading || flying}>
        {officeDestinations.map((destination, i) => (
          <button
            key={destination.id}
            ref={(element) => {
              markers.current[i] = element;
            }}
            className={styles.marker}
            onClick={() => navigate(i)}
            aria-label={`Entrar en ${destination.label}`}
          >
            <span>{destination.label}</span>
            {i === 3 ? <Mail size={17} /> : <Maximize2 size={15} />}
          </button>
        ))}
      </div>
      {phase === "office" && (
        <>
          <div className={styles.officeLabel}>
            <span>ESTUDIO SATORUS</span>
            <span>UN LUGAR PARA DAR FORMA A TU NEGOCIO.</span>
          </div>
          <button
            className={styles.start}
            onClick={() => navigate(0)}
            disabled={status === "loading"}
          >
            {status === "loading"
              ? "Preparando el estudio…"
              : "Desliza para entrar"}
            <ArrowDown size={17} aria-hidden="true" />
          </button>
          {status === "fallback" && (
            <p className={styles.fallback}>
              Entra en cada sección desde el recorrido inferior.
            </p>
          )}
        </>
      )}
      {flying && (
        <div className={styles.flightCaption} role="status">
          <span>
            {phase === "departing"
              ? "VOLVEMOS AL ESTUDIO"
              : phase === "interior"
                ? "CADA PASO TIENE SU LUGAR"
                : index === 3
                  ? "UNA CARTA PARA TU PRÓXIMO PROYECTO"
                  : "ENTRAMOS EN LA PANTALLA"}
          </span>
          <strong>
            {index >= 0
              ? officeDestinations[index].place
              : "La oficina, por dentro."}
          </strong>
        </div>
      )}
      <div
        className={styles.screenFrame}
        data-letter={index === 3}
        hidden={!reading}
      >
        <div className={styles.screenBar}>
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={16} aria-hidden="true" />
            Volver a la oficina
          </button>
          <span>
            {index === 3
              ? "UNA CARTA A SATORUS"
              : `PANTALLA ${index + 1} / ${officeDestinations[Math.max(0, index)].label.toUpperCase()}`}
          </span>
          <span className={styles.readHint}>
            Desliza para leer <ArrowDown size={12} />
          </span>
        </div>
        {[
          <ProcessScreen key="process" />,
          <SolutionsScreen key="solutions" />,
          <ProjectsScreen key="projects" />,
          <ContactLetter key="contact" />,
        ].map((content, i) => (
          <div
            key={officeDestinations[i].id}
            ref={(element) => {
              panels.current[i] = element;
            }}
            className={styles.panel}
            data-office-panel={i}
            id={i === 1 ? "soluciones" : officeDestinations[i].id}
            hidden={!reading || index !== i}
            role="region"
            aria-label={officeDestinations[i].label}
            tabIndex={-1}
          >
            <div className={styles.panelContent}>
              {content}
              <div className={styles.sectionEnd}>
                <p>
                  {i === 0
                    ? "Ya sabes cómo trabajamos. Veamos qué podemos resolver."
                    : i === 1
                      ? "De una necesidad concreta a algo que ya puedes ver."
                      : i === 2
                        ? "La siguiente historia puede ser la de tu negocio."
                        : "Cada proyecto empieza con una conversación."}
                </p>
                <button onClick={() => navigate(i < 3 ? i + 1 : -1)}>
                  {i < 3
                    ? `Continuar hacia ${officeDestinations[i + 1].label.toLowerCase()}`
                    : "Volver a la oficina"}
                  <MoveUpRight size={20} aria-hidden="true" />
                </button>
                <small>
                  {i < 3
                    ? "O sigue deslizando para salir de esta pantalla."
                    : "Tu mensaje se conserva si vuelves al estudio."}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
      <nav className={styles.route} aria-label="Recorrido de la oficina">
        <button
          onClick={() => navigate(-1)}
          aria-label="Ver la oficina"
          aria-current={index === -1 ? "step" : undefined}
        >
          <span>◎</span>
          <b>Oficina</b>
        </button>
        {officeDestinations.map((destination, i) => (
          <button
            key={destination.id}
            onClick={() => navigate(i)}
            aria-current={index === i ? "step" : undefined}
          >
            <span>0{i + 1}</span>
            <b>{destination.label}</b>
          </button>
        ))}
        <button
          className={styles.previous}
          onClick={() => navigate(Math.max(-1, index - 1))}
          aria-label="Sección anterior"
          disabled={index < 0}
        >
          <ArrowLeft size={18} />
        </button>
        <button
          className={styles.next}
          onClick={() => navigate(index < 3 ? index + 1 : -1)}
          aria-label={index < 3 ? "Siguiente sección" : "Volver a la oficina"}
        >
          <ArrowRight size={19} />
        </button>
      </nav>
      <noscript>
        <style>{`.${styles.tour}{height:auto;overflow:visible;padding-top:74px}.${styles.scene},.${styles.markers},.${styles.start},.${styles.route},.${styles.screenBar}{display:none!important}.${styles.screenFrame},.${styles.panel}{display:block!important;position:static;height:auto;overflow:visible}.${styles.sectionEnd}{display:none}`}</style>
      </noscript>
    </div>
  );
}
