"use client";

import { ArrowRight, LoaderCircle, Mail } from "lucide-react";
import { FormEvent, useRef, useState } from "react";

type FormStatus =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function ContactForm() {
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          company: formData.get("company"),
          email: formData.get("email"),
          message: formData.get("message"),
          consent: formData.get("consent") === "on",
          website: formData.get("website"),
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(
          result.message ?? "No hemos podido enviar el mensaje. Prueba por correo.",
        );
      }

      form.reset();
      setStatus({
        kind: "success",
        message: result.message ?? "Mensaje enviado. Te responderemos lo antes posible.",
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "No hemos podido enviar el mensaje. Prueba por correo.",
      });
    } finally {
      submittingRef.current = false;
    }
  }

  const sending = status.kind === "sending";

  return (
    <form className="contact-form" onSubmit={handleSubmit} aria-busy={sending}>
      <div className="form-pair">
        <label>
          <span>Tu nombre</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={80}
            required
          />
        </label>
        <label>
          <span>Tu empresa <small>(opcional)</small></span>
          <input
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={120}
          />
        </label>
      </div>

      <label>
        <span>Tu correo</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          required
        />
      </label>

      <label>
        <span>¿Qué te está frenando?</span>
        <textarea
          name="message"
          rows={5}
          minLength={20}
          maxLength={2000}
          placeholder="Por ejemplo: los pedidos llegan por WhatsApp y luego los copiamos a mano…"
          required
        />
      </label>

      <label className="honeypot" aria-hidden="true">
        <span>Tu web</span>
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="consent-field">
        <input name="consent" type="checkbox" required />
        <span>
          He leído la <a href="/politica-de-privacidad">política de privacidad</a>{" "}
          y acepto que Satorus use estos datos para responderme.
        </span>
      </label>

      <button className="form-submit" type="submit" disabled={sending}>
        {sending ? (
          <>
            Enviando…
            <LoaderCircle className="spin" aria-hidden="true" size={22} />
          </>
        ) : (
          <>
            Enviar mi mensaje
            <ArrowRight aria-hidden="true" size={23} />
          </>
        )}
      </button>

      <div
        className="form-status"
        aria-live="polite"
        role={status.kind === "error" ? "alert" : "status"}
        data-kind={status.kind}
      >
        {status.kind === "success" && status.message}
        {status.kind === "error" && (
          <>
            {status.message}{" "}
            <a href="mailto:hola@satorus.es">
              <Mail aria-hidden="true" size={16} />
              Escribir a hola@satorus.es
            </a>
          </>
        )}
      </div>
    </form>
  );
}
