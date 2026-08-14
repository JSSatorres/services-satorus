"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error inesperado en la aplicación", error);
  }, [error]);

  return (
    <main className="legal-page" id="contenido">
      <article className="legal-article">
        <p className="legal-updated">Error inesperado</p>
        <h1>No hemos podido cargar esta página.</h1>
        <p>Puedes intentarlo de nuevo. Si el problema continúa, vuelve al inicio.</p>
        <p>
          <button className="legal-back" type="button" onClick={reset}>
            Intentar de nuevo
          </button>
        </p>
        <p>
          <Link href="/">Volver al inicio</Link>
        </p>
      </article>
    </main>
  );
}
