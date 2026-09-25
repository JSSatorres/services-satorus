"use client";

import { useEffect, useRef, useState } from "react";
import type { createArchitecturalScene } from "./architecture-scene";
import styles from "./business-world.module.css";

type Scene = ReturnType<typeof createArchitecturalScene>;

export function BusinessWorld({
  chapter,
  replayKey,
}: {
  chapter: number;
  replayKey: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const runtime = useRef<Scene | null>(null);
  const latestChapter = useRef(chapter);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">(
    "loading",
  );

  useEffect(() => {
    latestChapter.current = chapter;
    runtime.current?.goTo(chapter);
  }, [chapter, replayKey]);

  useEffect(() => {
    let cancelled = false;
    import("./architecture-scene")
      .then(({ createArchitecturalScene }) => {
        if (cancelled || !host.current) return;
        try {
          runtime.current = createArchitecturalScene(
            host.current,
            latestChapter.current,
            () => setStatus("fallback"),
          );
          setStatus("ready");
        } catch {
          setStatus("fallback");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("fallback");
      });
    return () => {
      cancelled = true;
      runtime.current?.dispose();
      runtime.current = null;
    };
  }, []);

  return (
    <div className={styles.architecture} data-render-state={status}>
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
              Puedes recorrer todas las secciones con el menú inferior.
            </small>
          )}
        </div>
      )}
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
