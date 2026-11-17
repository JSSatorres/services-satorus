/**
 * Portada: el mismo momento de un negocio en dos móviles a la vez. A la
 * izquierda, sin Satorus: todo se acumula sin contestar. A la derecha, con
 * Satorus: el asistente contesta, manda el presupuesto y avisa del pedido.
 *
 * Cuatro escenas (WhatsApp, correo, presupuestos y pedidos) de un obrador de
 * ejemplo. Nombres, importes y mensajes son inventados y la portada lo dice.
 * `at` es el momento, en milisegundos desde que empieza la escena, en el que
 * aparece cada cosa.
 */

/** Cuánto se estira el guion: los `at` de abajo se multiplican por esto. */
const PACE = 1.6

export const SCENE_MS = Math.round(11000 * PACE)

/* ---------------------------------------------------------- Sin Satorus */

export type ChatListMessage = { at: number; from: string; text: string }
export type InboxMail = { at: number; from: string; subject: string; preview: string }
export type Banner = { at: number; app: string; title: string; text: string; tone?: "alert" }
export type CallLog = { at: number; who: string; kind: "missed" | "voicemail"; detail: string }

export type BadScreen =
  | { app: "chats"; base: ChatListMessage[]; items: ChatListMessage[] }
  | { app: "inbox"; base: InboxMail[]; unreadBefore: number; items: InboxMail[] }
  | { app: "notes"; title: string; todo: { text: string; since: string }[]; items: Banner[] }
  | { app: "calls"; items: (CallLog | (Banner & { kind: "banner" }))[] }

/* ---------------------------------------------------------- Con Satorus */

export type ChatTurn =
  | { at: number; kind: "client" | "bot"; text: string }
  | { at: number; kind: "typing" }
  | { at: number; kind: "card"; title: string; lines: string[]; action: string }
  | { at: number; kind: "status"; text: string }

export type MailStep =
  | { at: number; kind: "in"; from: string; subject: string; text: string }
  | { at: number; kind: "drafting" }
  | { at: number; kind: "out"; text: string; attachment?: string }
  | { at: number; kind: "status"; text: string }

export type QuoteStep =
  | { at: number; kind: "field"; label: string; value: string }
  | { at: number; kind: "total"; value: string }
  | { at: number; kind: "status"; text: string }

export type FeedNote = { at: number; app: string; color: string; title: string; text: string }

export type GoodScreen =
  | { app: "chat"; contact: string; items: ChatTurn[] }
  | { app: "mail"; items: MailStep[] }
  | { app: "quote"; client: string; items: QuoteStep[] }
  | { app: "feed"; items: FeedNote[] }

export type Scene = {
  id: string
  /** Pestaña del selector. */
  tab: string
  bad: BadScreen
  good: GoodScreen
  /** Resumen bajo cada móvil al acabar la escena. */
  badResult: string
  goodResult: string
}

export const BUSINESS = "Obrador Lola"

const script: Scene[] = [
  {
    id: "whatsapp",
    tab: "WhatsApp",
    bad: {
      app: "chats",
      base: [
        { at: 0, from: "Proveedor Harinas", text: "Te paso la factura de octubre" },
        { at: 0, from: "Carmen", text: "Gracias guapa, estaba buenísima" },
      ],
      items: [
        { at: 900, from: "Marta", text: "Hola! ¿Tenéis tarta de queso para hoy?" },
        { at: 2400, from: "Marta", text: "¿Hola?" },
        { at: 3600, from: "Pedro", text: "Quería encargar 2 docenas de croissants para el sábado" },
        { at: 5000, from: "Marta", text: "¿Me contestas o no? 😕" },
        { at: 6400, from: "Luis", text: "¿Hacéis envíos a Armilla?" },
        { at: 7600, from: "Pedro", text: "¿Me confirmas lo del sábado?" },
        { at: 8800, from: "Marta", text: "Da igual, lo pido en otro sitio." },
      ],
    },
    good: {
      app: "chat",
      contact: "Marta",
      items: [
        { at: 900, kind: "client", text: "Hola! ¿Tenéis tarta de queso para hoy?" },
        { at: 1500, kind: "typing" },
        { at: 2300, kind: "bot", text: "¡Hola, Marta! Sí, nos quedan 3. ¿La quieres entera (22 €) o media (12 €)?" },
        { at: 3700, kind: "client", text: "Entera, porfa. ¿A qué hora paso?" },
        { at: 4300, kind: "typing" },
        { at: 5100, kind: "bot", text: "Te la guardo a tu nombre. Puedes recogerla desde las 17:00. ¿Te mando el enlace para pagarla ya?" },
        { at: 6500, kind: "client", text: "Sí!" },
        { at: 7000, kind: "typing" },
        { at: 7700, kind: "card", title: "Pedido #214", lines: ["Tarta de queso entera", "Recogida hoy desde las 17:00"], action: "Pagar 22,00 €" },
        { at: 9000, kind: "status", text: "Pagado · Marta recibe el recordatorio a las 16:30" },
      ],
    },
    badResult: "3 clientes esperando · 1 se ha ido",
    goodResult: "Contestado al momento · pedido cobrado",
  },
  {
    id: "correo",
    tab: "Correo",
    bad: {
      app: "inbox",
      unreadBefore: 44,
      base: [
        { at: 0, from: "Hotel Alhambra", subject: "Presupuesto desayunos para 40", preview: "Hola, necesitaríamos para el día 12…" },
        { at: 0, from: "Harinas del Sur", subject: "Factura octubre", preview: "Adjuntamos la factura correspondiente…" },
      ],
      items: [
        { at: 1300, from: "Hotel Alhambra", subject: "RE: Presupuesto desayunos (2.º aviso)", preview: "¿Habéis podido mirarlo? Necesitamos…" },
        { at: 3200, from: "Ayto. de Armilla", subject: "Feria de Navidad: ¿participáis?", preview: "Os escribimos para invitaros a…" },
        { at: 5000, from: "Laura Gómez", subject: "Tarta para la comunión de mi hija", preview: "Buenas, quería saber si hacéis…" },
        { at: 6800, from: "Gestoría Ruiz", subject: "Faltan tickets del trimestre", preview: "Para cerrar el IVA nos faltan…" },
        { at: 8600, from: "Hotel Alhambra", subject: "Lo dejamos, gracias", preview: "Al final lo hemos encargado en otro sitio." },
      ],
    },
    good: {
      app: "mail",
      items: [
        { at: 600, kind: "in", from: "Ana · Hotel Alhambra", subject: "Presupuesto desayunos para 40", text: "Hola, necesitaríamos 40 desayunos el día 12 a las 8:30. ¿Nos pasáis precio?" },
        { at: 2000, kind: "drafting" },
        { at: 3600, kind: "out", text: "Hola, Ana. Gracias por escribirnos. Te adjunto el presupuesto: 40 desayunos (café, zumo y bollería) por 260 € + IVA, entregados a las 8:15. ¿Lo confirmamos?", attachment: "Presupuesto-0412.pdf" },
        { at: 5600, kind: "status", text: "Enviado 2 minutos después de recibirlo" },
        { at: 7200, kind: "in", from: "Ana · Hotel Alhambra", subject: "RE: Presupuesto desayunos para 40", text: "Perfecto, lo confirmamos. ¡Gracias por la rapidez!" },
        { at: 8600, kind: "status", text: "Pedido creado en tu programa · entrega el día 12" },
      ],
    },
    badResult: "47 correos sin leer · el hotel se ha ido",
    goodResult: "Presupuesto en 2 minutos · pedido cerrado",
  },
  {
    id: "presupuestos",
    tab: "Presupuestos",
    bad: {
      app: "notes",
      title: "Presupuestos por hacer",
      todo: [
        { text: "Boda Sánchez · tarta de 3 pisos", since: "pidió el lunes" },
        { text: "Catering empresa · 80 personas", since: "pidió hace 6 días" },
        { text: "Comunión Laura · tarta y mesa dulce", since: "pidió ayer" },
      ],
      items: [
        { at: 1400, app: "Recordatorios", title: "Vencido", text: "Enviar presupuesto boda Sánchez", tone: "alert" },
        { at: 3600, app: "WhatsApp", title: "Elena Sánchez", text: "¿Me mandas el presupuesto? Hoy tenemos que decidir." },
        { at: 5800, app: "Recordatorios", title: "Vencido", text: "Llamar al catering de empresa", tone: "alert" },
        { at: 8200, app: "WhatsApp", title: "Elena Sánchez", text: "Ya lo hemos encargado en otra pastelería, gracias." },
      ],
    },
    good: {
      app: "quote",
      client: "Boda Sánchez",
      items: [
        { at: 700, kind: "field", label: "Cliente", value: "Elena Sánchez · boda 14 de junio" },
        { at: 1500, kind: "field", label: "Tarta", value: "3 pisos · 120 raciones · nata y frambuesa" },
        { at: 2300, kind: "field", label: "Extras", value: "Mesa dulce para 120 · montaje incluido" },
        { at: 3100, kind: "field", label: "Entrega", value: "Finca Los Olivos · 14 de junio, 18:00" },
        { at: 3900, kind: "total", value: "540,00 €" },
        { at: 5000, kind: "status", text: "Enviado por WhatsApp y correo" },
        { at: 6600, kind: "status", text: "Elena lo ha abierto" },
        { at: 8200, kind: "status", text: "Aceptado · señal de 100 € pagada" },
      ],
    },
    badResult: "3 sin enviar · la boda se ha ido",
    goodResult: "Hecho y enviado solo · boda reservada",
  },
  {
    id: "pedidos",
    tab: "Pedidos",
    bad: {
      app: "calls",
      items: [
        { at: 800, who: "958 41 •• 12", kind: "missed", detail: "Llamada perdida" },
        { at: 2200, who: "958 41 •• 12", kind: "missed", detail: "Llamada perdida (2)" },
        { at: 3600, who: "Luis", kind: "voicemail", detail: "Buzón de voz · «Llamaba por mi pedido…»" },
        { at: 5000, kind: "banner", app: "WhatsApp", title: "Luis", text: "¿Dónde está mi pedido? Lo pagué el martes." },
        { at: 6400, who: "636 •• •• 90", kind: "missed", detail: "Llamada perdida" },
        { at: 7800, kind: "banner", app: "WhatsApp", title: "Luis", text: "Pues voy a pedir que me devuelvan el dinero." },
        { at: 9000, who: "958 41 •• 12", kind: "missed", detail: "Llamada perdida (3)" },
      ],
    },
    good: {
      app: "feed",
      items: [
        { at: 800, app: "Tu web", color: "#2948c7", title: "Nuevo pedido #1482", text: "Pedro · 2 docenas de croissants · sábado 9:00 · pagado" },
        { at: 2600, app: "Asistente", color: "#1f9d5b", title: "Llamada perdida atendida", text: "Le hemos escrito por WhatsApp: «Te hemos visto llamar, ¿en qué te ayudamos?»" },
        { at: 4600, app: "Pedidos", color: "#e56748", title: "Pedido #1479 ha salido", text: "Luis tiene el enlace de seguimiento · llega hoy antes de las 14:00" },
        { at: 6600, app: "Asistente", color: "#1f9d5b", title: "Luis ha contestado", text: "«¡Perfecto, gracias por avisar!»" },
        { at: 8600, app: "Tu programa", color: "#171b18", title: "Resumen del día", text: "18 pedidos · 412,50 € · todos los clientes avisados" },
      ],
    },
    badResult: "5 llamadas perdidas · un cliente pide su dinero",
    goodResult: "Cada pedido avisado · ninguna llamada sin respuesta",
  },
]

/** Estira un guion: cada `at` se multiplica por `PACE`. */
function stretch<T extends { at: number }>(items: T[]): T[] {
  return items.map((item) => ({ ...item, at: Math.round(item.at * PACE) }))
}

export const scenes: Scene[] = script.map((scene) => ({
  ...scene,
  bad: { ...scene.bad, items: stretch(scene.bad.items as { at: number }[]) } as BadScreen,
  good: { ...scene.good, items: stretch(scene.good.items as { at: number }[]) } as GoodScreen,
}))
