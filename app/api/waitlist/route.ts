import { Resend } from "resend";
import { jsonResponse, readJsonRequest } from "@/lib/api-request";

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
  const parsed = await readJsonRequest<WaitlistPayload>(request);
  if (!parsed.ok) return parsed.response;
  const payload = parsed.value;

  const email = clean(payload.email, 160).toLowerCase();
  const website = clean(payload.website, 200);
  const consent = payload.consent === true;

  if (website) {
    return jsonResponse({ message: "Ya estás en la lista." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse(
      { message: "Escribe un correo válido para poder avisarte." },
      400,
    );
  }

  if (!consent) {
    return jsonResponse(
      { message: "Necesitamos que aceptes la política de privacidad para avisarte." },
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
          "La lista aún no está conectada. Escríbenos a hola@satorus.es y te apuntamos.",
      },
      503,
    );
  }

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: "Nueva solicitud para probar SportApp",
      text: `Nueva solicitud para la lista de espera de SportApp.\n\nCorreo: ${email}`,
    });

    if (!error) {
      return jsonResponse({
        message:
          "Ya estás en la lista. Te avisaremos cuando SportApp esté listo para probar.",
      });
    }

    console.error("No se ha podido enviar la solicitud de SportApp", error.name);
  } catch (error) {
    console.error(
      "No se ha podido conectar con el servicio de correo",
      error instanceof Error ? error.name : "UnknownError",
    );
  }

  return jsonResponse(
    {
      message:
        "No hemos podido apuntarte ahora. Escríbenos a hola@satorus.es y lo hacemos a mano.",
    },
    502,
  );
}
