import { Resend } from "resend";
import { jsonResponse, readJsonRequest } from "@/lib/api-request";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  message?: unknown;
  consent?: unknown;
  website?: unknown;
};

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanLine(value: unknown, maxLength: number) {
  return clean(value, maxLength).replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
}

export async function POST(request: Request) {
  const parsed = await readJsonRequest<ContactPayload>(request);
  if (!parsed.ok) return parsed.response;
  const payload = parsed.value;

  const name = cleanLine(payload.name, 80);
  const company = cleanLine(payload.company, 120);
  const email = cleanLine(payload.email, 160).toLowerCase();
  const message = clean(payload.message, 2000);
  const website = clean(payload.website, 200);
  const consent = payload.consent === true;

  // Los bots suelen completar este campo oculto. Respondemos sin enviar nada.
  if (website) {
    return jsonResponse({ message: "Mensaje enviado." });
  }

  if (name.length < 2) {
    return jsonResponse(
      { message: "Escribe un nombre de al menos dos caracteres." },
      400,
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse(
      { message: "Escribe un correo válido para que podamos responderte." },
      400,
    );
  }

  if (message.length < 20) {
    return jsonResponse(
      { message: "Cuéntanos un poco más: el mensaje debe tener al menos 20 caracteres." },
      400,
    );
  }

  if (!consent) {
    return jsonResponse(
      { message: "Necesitamos que aceptes la política de privacidad para responderte." },
      400,
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL ?? "hola@satorus.es";

  if (!apiKey || !from) {
    return jsonResponse(
      {
        message:
          "El formulario aún no está conectado. Escríbenos directamente a hola@satorus.es.",
      },
      503,
    );
  }

  const resend = new Resend(apiKey);
  const subjectCompany = company ? ` — ${company}` : "";
  const text = [
    `Nombre: ${name}`,
    `Empresa: ${company || "No indicada"}`,
    `Correo: ${email}`,
    "",
    "Mensaje:",
    message,
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Nueva consulta desde satorus.es${subjectCompany}`,
      text,
    });

    if (!error) {
      return jsonResponse({
        message: "Mensaje enviado. Te responderemos lo antes posible.",
      });
    }

    console.error("No se ha podido enviar el formulario de contacto", error.name);
  } catch (error) {
    console.error(
      "No se ha podido conectar con el servicio de correo",
      error instanceof Error ? error.name : "UnknownError",
    );
  }

  return jsonResponse(
    {
      message:
        "El mensaje no ha salido. Escríbenos directamente a hola@satorus.es.",
    },
    502,
  );
}
