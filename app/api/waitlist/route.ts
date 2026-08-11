import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type WaitlistPayload = {
  email?: unknown;
  consent?: unknown;
  website?: unknown;
};

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  let payload: WaitlistPayload;

  try {
    payload = (await request.json()) as WaitlistPayload;
  } catch {
    return NextResponse.json(
      { message: "No hemos podido leer la solicitud. Revisa el correo." },
      { status: 400 },
    );
  }

  const email = clean(payload.email, 160).toLowerCase();
  const website = clean(payload.website, 200);
  const consent = payload.consent === true;

  if (website) {
    return NextResponse.json({ message: "Ya estás en la lista." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { message: "Escribe un correo válido para poder avisarte." },
      { status: 400 },
    );
  }

  if (!consent) {
    return NextResponse.json(
      { message: "Necesitamos que aceptes la política de privacidad para avisarte." },
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
          "La lista aún no está conectada. Escríbenos a hola@satorus.es y te apuntamos.",
      },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: "Nueva solicitud para probar SportApp",
    text: `Nueva solicitud para la lista de espera de SportApp.\n\nCorreo: ${email}`,
  });

  if (error) {
    console.error("No se ha podido enviar la solicitud de SportApp", error.name);
    return NextResponse.json(
      {
        message:
          "No hemos podido apuntarte ahora. Escríbenos a hola@satorus.es y lo hacemos a mano.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    message:
      "Ya estás en la lista. Te avisaremos cuando SportApp esté listo para probar.",
  });
}