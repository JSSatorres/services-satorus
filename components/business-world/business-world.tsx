"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, Maximize2 } from "lucide-react";
import type { createArchitecturalScene } from "./architecture-scene";
import { MonitorSection } from "./monitor-section";
import styles from "./business-world.module.css";
import monitorStyles from "./monitor-section.module.css";

type Scene = ReturnType<typeof createArchitecturalScene>;
type Phase = "closed" | "entering" | "open" | "leaving";
type RenderStatus = "loading" | "ready" | "fallback";

function containDialogFocus(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") return;
  const elements = event.currentTarget.querySelectorAll<HTMLElement>(
    "button:not(:disabled), a[href]",
  );
  const first = elements[0];
  const last = elements[elements.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

export function BusinessWorld({
  chapter,
  replayKey,
  onScreenActive,
}: {
  chapter: number;
  replayKey: number;
  onScreenActive: (active: boolean) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const entry = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const runtime = useRef<Scene | null>(null);
  const latestChapter = useRef(chapter);
  const selectedScreen = useRef(1);
  const phaseRef = useRef<Phase>("closed");
  const statusRef = useRef<RenderStatus>("loading");
  const previousOverflow = useRef<string | null>(null);
  const frame = useRef(0);
  const pendingComplete = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<RenderStatus>("loading");
  const [phase, setPhase] = useState<Phase>("closed");

  function changePhase(next: Phase) {
    phaseRef.current = next;
    setPhase(next);
  }
  function openScreen() {
    if (phaseRef.current !== "closed" || statusRef.current === "loading")
      return;
    changePhase("entering");
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    onScreenActive(true);
    dialog.current?.showModal();
    const complete = () => {
      pendingComplete.current = null;
      changePhase("open");
    };
    pendingComplete.current = complete;
    // Let the full-width scene settle before computing the camera's new framing.
    frame.current = requestAnimationFrame(() => {
      if (runtime.current && statusRef.current === "ready")
        runtime.current.enterScreen(complete, selectedScreen.current);
      else complete();
      selectedScreen.current = 1;
    });
  }
  function closeScreen(contact = false) {
    if (phaseRef.current === "closed" || phaseRef.current === "leaving") return;
    cancelAnimationFrame(frame.current);
    changePhase("leaving");
    const complete = () => {
      pendingComplete.current = null;
      dialog.current?.close();
      if (previousOverflow.current !== null)
        document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
      changePhase("closed");
      onScreenActive(false);
      frame.current = requestAnimationFrame(() => {
        if (contact) window.location.hash = "contacto";
        else entry.current?.focus({ preventScroll: true });
      });
    };
    pendingComplete.current = complete;
    if (runtime.current && statusRef.current === "ready")
      runtime.current.leaveScreen(complete);
    else complete();
  }

  useEffect(() => {
    latestChapter.current = chapter;
    if (phaseRef.current === "closed") runtime.current?.goTo(chapter);
  }, [chapter, replayKey]);

  useEffect(() => {
    let cancelled = false;
    const fallback = () => {
      statusRef.current = "fallback";
      setStatus("fallback");
      pendingComplete.current?.();
    };
    import("./architecture-scene")
      .then(({ createArchitecturalScene }) => {
        if (cancelled || !host.current || !entry.current) return;
        try {
          runtime.current = createArchitecturalScene(
            host.current,
            latestChapter.current,
            fallback,
            entry.current,
            (index) => {
              selectedScreen.current = index;
              entry.current?.click();
            },
          );
          statusRef.current = "ready";
          setStatus("ready");
        } catch {
          fallback();
        }
      })
      .catch(() => {
        if (!cancelled) fallback();
      });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame.current);
      if (previousOverflow.current !== null)
        document.body.style.overflow = previousOverflow.current;
      runtime.current?.dispose();
      runtime.current = null;
    };
  }, []);

  return (
    <div
      className={styles.architecture}
      data-render-state={status}
      data-screen-phase={phase}
    >
      <div ref={host} className={styles.canvasHost} />
      {status !== "ready" && (
        <div className={styles.scenePlaceholder} role="status">
          <span>S / ESTUDIO DIGITAL</span>
          <p>
            {status === "loading"
              ? "Preparando el espacio…"
              : "Tu negocio. Pieza a pieza."}
          </p>
          {status === "fallback" && (
            <small>
              Puedes recorrer las secciones y entrar en la pantalla.
            </small>
          )}
        </div>
      )}
      <button
        ref={entry}
        className={monitorStyles.hotspot}
        hidden={chapter > 3 || phase !== "closed" || status === "loading"}
        onClick={openScreen}
        aria-label="Entrar en la pantalla"
        aria-haspopup="dialog"
      >
        <Maximize2 size={17} aria-hidden="true" />
        <span aria-hidden="true">Entrar en la pantalla</span>
      </button>
      <dialog
        ref={dialog}
        className={monitorStyles.dialog}
        aria-label="Aplicaciones a medida"
        onKeyDown={containDialogFocus}
        data-phase={phase}
        onCancel={(event) => {
          event.preventDefault();
          closeScreen();
        }}
      >
        <div className={monitorStyles.toolbar}>
          <button onClick={() => closeScreen()} disabled={phase === "leaving"}>
            <ArrowLeft size={18} aria-hidden="true" />
            Volver al negocio
          </button>
          <span role="status">
            {phase === "entering"
              ? "ENTRANDO EN EL PUESTO DE TRABAJO"
              : phase === "leaving"
                ? "VOLVIENDO AL NEGOCIO"
                : "ESTÁS DENTRO / TU APLICACIÓN"}
          </span>
        </div>
        {phase === "open" && (
          <div className={monitorStyles.viewport}>
            <MonitorSection onContact={() => closeScreen(true)} />
          </div>
        )}
      </dialog>
      <div className={styles.sceneCaption} aria-hidden="true">
        <span>ESTUDIO SATORUS</span>
        <span>
          {
            [
              "01 — EL CONJUNTO",
              "02 — ENTENDER CADA PIEZA",
              "03 — ABRIRSE AL MUNDO",
              "04 — ORDENAR POR DENTRO",
              "05 — CONECTAR EL TRABAJO",
              "06 — LO QUE CONSTRUIMOS",
              "07 — SIN PUNTOS CIEGOS",
              "08 — TU SIGUIENTE PASO",
            ][chapter]
          }
        </span>
      </div>
    </div>
  );
}
