import type { ReactNode } from "react";

/**
 * Etiqueta con roll de texto, como los botones de lenis.dev: el texto visible
 * sube y sale por el borde superior mientras una copia idéntica entra desde
 * abajo. La copia es `aria-hidden` para que el lector de pantalla lea una vez.
 */
export function RollLabel({ children }: { children: ReactNode }) {
  return (
    <span className="roll-label">
      <span className="roll-label-track">
        <span className="roll-label-face">{children}</span>
        <span className="roll-label-face" aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  );
}
