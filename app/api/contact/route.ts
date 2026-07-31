import { NextResponse } from "next/server";
import { Resend } from "resend";

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

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { message: "El formulario no se ha podido leer. Revisa los campos." },
      { status: 400 },
    );
  }

  const name = clean(payload.name, 80);
  const company = clean(payload.company, 120);
  const email = clean(payload.email, 160).toLowerCase();
  const message = clean(payload.message, 2000);
  const website = clean(payload.website, 200);
  const consent = payload.consent === true;

  // Los bots suelen completar este campo oculto. Respondemos sin enviar nada.
  if (website) {
    return NextResponse.json({ message: "Mensaje enviado." });
  }

  if (name.length < 2) {
    return NextResponse.json(
      { message: "Escribe un nombre de al menos dos caracteres." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { message: "Escribe un correo válido para que podamos responderte." },
      { status: 400 },
    );
  }

  if (message.length < 20) {
    return NextResponse.json(
      { message: "Cuéntanos un poco más: el mensaje debe tener al menos 20 caracteres." },
      { status: 400 },
    );
  }

  if (!consent) {
    return NextResponse.json(
      { message: "Necesitamos que aceptes la política de privacidad para responderte." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL ?? "hola@satorus.es";

  if (!apiKey || !from) {
    return NextResponse.json(
      {
        message:
          "El formulario aún no está conectado. Escríbenos directamente a hola@satorus.es.",
      },
      { status: 503 },
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

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `Nueva consulta desde satorus.es${subjectCompany}`,
    text,
  });

  if (error) {
    console.error("No se ha podido enviar el formulario de contacto", error.name);
    return NextResponse.json(
      {
        message:
          "El mensaje no ha salido. Escríbenos directamente a hola@satorus.es.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    message: "Mensaje enviado. Te responderemos lo antes posible.",
  });
}
