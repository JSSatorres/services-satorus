import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/site";

const MAX_JSON_BYTES = 8_192;

type JsonResult<T> =
  | { ok: true; value: T }
  | { ok: false; response: NextResponse };

export function jsonResponse(
  body: { message: string },
  status = 200,
) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function readJsonRequest<T>(request: Request): Promise<JsonResult<T>> {
  const contentType = request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    return {
      ok: false,
      response: jsonResponse(
        { message: "La solicitud debe enviarse en formato JSON." },
        415,
      ),
    };
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_JSON_BYTES) {
    return {
      ok: false,
      response: jsonResponse({ message: "La solicitud es demasiado grande." }, 413),
    };
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      const requestOrigin = new URL(request.url).origin;
      const submittedOrigin = new URL(origin).origin;
      if (submittedOrigin !== requestOrigin && submittedOrigin !== siteUrl) {
        return {
          ok: false,
          response: jsonResponse(
            { message: "No se permite enviar el formulario desde ese origen." },
            403,
          ),
        };
      }
    } catch {
      return {
        ok: false,
        response: jsonResponse({ message: "El origen de la solicitud no es válido." }, 403),
      };
    }
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > MAX_JSON_BYTES) {
    return {
      ok: false,
      response: jsonResponse({ message: "La solicitud es demasiado grande." }, 413),
    };
  }

  try {
    const value = JSON.parse(rawBody) as T;
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new TypeError("Expected a JSON object");
    }
    return { ok: true, value };
  } catch {
    return {
      ok: false,
      response: jsonResponse(
        { message: "El formulario no se ha podido leer. Revisa los campos." },
        400,
      ),
    };
  }
}
