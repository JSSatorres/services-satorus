"use client";

import { ArrowRight, Check, LoaderCircle, Mail } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import styles from "@/app/productos/productos.module.css";

type FormStatus =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function SportAppWaitlistForm() {
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });
  const submittingRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    submittingRef.current = true;
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus({ kind: "sending" });

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          consent: formData.get("consent") === "on",
          website: formData.get("website"),
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(
          result.message ?? "No hemos podido apuntarte. Prueba por correo.",
        );
      }

      form.reset();
      setStatus({
        kind: "success",
        message:
          result.message ??
          "Ya estás en la lista. Te avisaremos cuando SportApp esté listo para probar.",
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "No hemos podido apuntarte. Prueba por correo.",
      });
    } finally {
      submittingRef.current = false;
    }
  }

  const sending = status.kind === "sending";

  return (
    <form
      className={styles.waitlistForm}
      onSubmit={handleSubmit}
      aria-busy={sending}
    >
      <div className={styles.waitlistInputRow}>
        <label htmlFor="sportapp-waitlist-email">Tu correo</label>
        <div>
          <input
            id="sportapp-waitlist-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            placeholder="tu@club.es"
            required
          />
          <button type="submit" disabled={sending}>
            {sending ? (
              <>
                Apuntando…
                <LoaderCircle className="spin" aria-hidden="true" size={21} />
              </>
            ) : (
              <>
                Quiero probarlo
                <ArrowRight aria-hidden="true" size={22} />
              </>
            )}
          </button>
        </div>
      </div>

      <label className={styles.honeypot} aria-hidden="true">
        <span>Tu web</span>
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <label className={styles.waitlistConsent}>
        <input
          name="consent"
          type="checkbox"
          aria-label="Acepto la política de privacidad y que Satorus use mi correo para avisarme sobre SportApp"
          required
        />
        <span>
          He leído la <a href="/politica-de-privacidad">política de privacidad</a>{" "}
          y acepto que Satorus use mi correo para avisarme sobre SportApp.
        </span>
      </label>

      <div
        className={styles.waitlistStatus}
        aria-live="polite"
        role={status.kind === "error" ? "alert" : "status"}
        data-kind={status.kind}
      >
        {status.kind === "success" && (
          <>
            <Check aria-hidden="true" size={18} />
            {status.message}
          </>
        )}
        {status.kind === "error" && (
          <>
            {status.message}{" "}
            <a href="mailto:hola@satorus.es?subject=Lista%20de%20espera%20SportApp">
              <Mail aria-hidden="true" size={16} />
              Escribir a hola@satorus.es
            </a>
          </>
        )}
      </div>
    </form>
  );
}
