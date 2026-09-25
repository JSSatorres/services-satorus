"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Mail,
  MoveUpRight,
  Plus,
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
  const introMarkers = useRef<(HTMLButtonElement | null)[]>([]);
  const [problem, setProblem] = useState<number | null>(null);
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
  const intro = useRef("chaos");
  const [introStage, setIntroStage] = useState("chaos");
  const [status, setStatus] = useState("loading");
  const [index, setIndex] = useState(-1);
  const [phase, setPhase] = useState<OfficePhase>("office");

  const navigate = useCallback((destination: number) => {
    const target = Math.max(-1, Math.min(3, destination));
    if (statusRef.current === "loading") {
      pending.current = target;
      return;
    }
    intro.current = "office";
    setIntroStage("office");
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
          anchor.current === "#hablamos-claro" ||
          anchor.current === "#pasos-3-y-4"
        ) {
          const section = panel?.querySelector<HTMLElement>(
            anchor.current === "#pasos-3-y-4" ? "#paso-3" : anchor.current,
          );
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
  const organize = useCallback(() => {
    if (intro.current !== "chaos" || statusRef.current === "loading") return;
    intro.current = "sorting";
    setIntroStage("sorting");
    state.current.phase = "organizing";
    setPhase("organizing");
    const token = ++sequence.current;
    const complete = () => {
      if (sequence.current !== token) return;
      intro.current = "office";
      setIntroStage("office");
      state.current.phase = "office";
      setPhase("office");
      state.current.arrived = performance.now();
    };
    if (scene.current && statusRef.current === "ready")
      scene.current.organize({
        ordered: () => {
          if (sequence.current === token) setIntroStage("ordered");
        },
        complete,
      });
    else complete();
  }, []);
  const gestureNavigate = useCallback(
    (target: number) => {
      if (intro.current === "chaos" && target >= 0) organize();
      else navigate(target);
    },
    [organize, navigate],
  );
  useOfficeInput(root, panels, state, gestureNavigate);

  useEffect(() => {
    const transitions = sequence;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let cancelled = false;
    const fallback = () => {
      if (cancelled) return;
      statusRef.current = "fallback";
      setStatus("fallback");
      if (intro.current !== "chaos") navigate(state.current.index);
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
            introMarkers.current as HTMLButtonElement[],
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
  const flying = phase !== "office" && phase !== "organizing" && !reading;
  return (
    <div
      ref={root}
      className={styles.tour}
      data-office-tour=""
      data-phase={phase}
      data-intro={introStage}
      data-destination={index}
      data-render-state={status}
      tabIndex={-1}
      aria-label="Recorrido por la oficina Satorus"
    >
      <h1 className="sr-only">
        Satorus. Webs, herramientas e inteligencia artificial para tu negocio.
      </h1>
      <div className={styles.scene} ref={host} />
      <div
        className={styles.markers}
        hidden={reading || flying || introStage !== "office"}
      >
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
      <div
        className={styles.introMarkers}
        hidden={introStage !== "chaos" || status !== "ready"}
      >
        {[
          "12 mensajes pendientes",
          "2 citas a la misma hora",
          "3 presupuestos sin enviar",
        ].map((label, i) => (
          <button
            key={label}
            ref={(element) => {
              introMarkers.current[i] = element;
            }}
            onClick={() => setProblem(i)}
            aria-pressed={problem === i}
            aria-controls="intro-problem"
          >
            {label}
            <Plus size={11} aria-hidden="true" />
          </button>
        ))}
      </div>
      {introStage !== "office" && (
        <>
          <header className={styles.introCopy} aria-live="polite">
            <p>ANTES DE HABLAR DE TECNOLOGÍA, HABLEMOS DE TU DÍA A DÍA.</p>
            <h2>
              {introStage === "chaos" ? (
                <>
                  Tu negocio.
                  <br />
                  <em>En demasiados sitios.</em>
                </>
              ) : (
                <>
                  Tú llevas el negocio.
                  <br />
                  <em>Nosotros ponemos orden.</em>
                </>
              )}
            </h2>
            <div id="intro-problem">
              {introStage === "chaos"
                ? problem === null
                  ? "Mensajes sin responder. Citas cruzadas. Presupuestos que se quedan para mañana."
                  : [
                      "Marta preguntó hace tres días. Luis sigue esperando. El trabajo llega por WhatsApp y se queda ahí.",
                      "Dos personas reservadas a las 10:00. Una agenda que no te avisa de que algo se ha cruzado.",
                      "El presupuesto está empezado. Falta enviarlo. Y entre llamadas y pedidos vuelve a quedarse para mañana.",
                    ][problem]
                : introStage === "sorting"
                  ? "Reunimos lo que hoy está disperso. Decidimos contigo qué resolver primero."
                  : "Una herramienta para cada necesidad. Un equipo que te acompaña."}
            </div>
          </header>
          <div className={styles.introActions}>
            <button
              onClick={organize}
              disabled={status === "loading" || introStage !== "chaos"}
            >
              {status === "loading"
                ? "Preparando tu mesa…"
                : introStage === "chaos"
                  ? "Vamos a poner orden"
                  : introStage === "sorting"
                    ? "Cada cosa encuentra su lugar…"
                    : "Así empieza nuestro trabajo"}
              <ArrowDown size={17} aria-hidden="true" />
            </button>
            <small>
              {introStage === "chaos"
                ? "O desliza para empezar"
                : "De tu día a día a una forma más clara de trabajar"}
            </small>
          </div>
          <div className={styles.introRail}>
            <span data-active={introStage === "chaos"}>Tu día a día</span>
            <span aria-hidden="true">→</span>
            <span data-active={introStage !== "chaos"}>Ponemos orden</span>
            <span aria-hidden="true">→</span>
            <span>Lo hacemos contigo</span>
            <button onClick={() => navigate(0)}>
              Ir al recorrido <ArrowRight size={14} />
            </button>
          </div>
        </>
      )}
      {phase === "office" && introStage === "office" && (
        <>
          <div className={styles.officeLabel}>
            <span>DE TU MESA A NUESTRO ESTUDIO</span>
            <span>ENTENDER · RESOLVER · CONSTRUIR</span>
          </div>
          <div className={styles.officeMeaning}>
            <h2>
              Aquí le damos forma.
              <br />
              <em>Contigo.</em>
            </h2>
            <p>
              Cada mesa, un paso: entendemos tu negocio, construimos la solución
              y te enseñamos lo que ya hemos hecho.
            </p>
          </div>
          <button
            className={styles.start}
            onClick={() => navigate(0)}
            disabled={status === "loading"}
          >
            {status === "loading"
              ? "Preparando el estudio…"
              : "Entra y descubre cómo"}
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
      <nav
        className={styles.route}
        aria-label="Recorrido de la oficina"
        hidden={introStage !== "office"}
      >
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
