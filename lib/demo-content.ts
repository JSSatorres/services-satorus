/**
 * Demo del asistente en la portada.
 *
 * Son conversaciones de ejemplo con respuestas escritas a mano: no se llama a
 * ningún modelo ni se envía nada. Los negocios, precios y horarios son
 * inventados y la demo lo dice («Ejemplo»).
 */

export type DemoBusinessId = "bar" | "peluqueria" | "tienda" | "clinica"

export type DemoQuestion = {
  /** Lo que escribe el cliente. */
  ask: string
  /** Lo que contesta el asistente. */
  reply: string
  /** Qué ha consultado o hecho el asistente en el negocio para contestar. */
  did: string
}

export type DemoBusiness = {
  id: DemoBusinessId
  /** Rótulo del selector. */
  label: string
  /** Nombre del negocio de ejemplo, en la cabecera del chat. */
  name: string
  questions: DemoQuestion[]
}

export const demoBusinesses: DemoBusiness[] = [
  {
    id: "bar",
    label: "Bar o restaurante",
    name: "Bar La Plaza",
    questions: [
      {
        ask: "¿Tenéis mesa para 4 esta noche?",
        reply: "¡Hola! Sí, nos queda una mesa para 4 a las 21:00 y otra a las 22:15. ¿Cuál te reservo?",
        did: "Ha mirado las reservas de hoy",
      },
      {
        ask: "¿Hacéis menú del día?",
        reply:
          "Sí, de lunes a viernes por 13,50 €: primero, segundo, postre y bebida. Hoy hay salmorejo y carrillada. ¿Te guardo mesa?",
        did: "Ha leído la carta de hoy",
      },
      {
        ask: "¿Tenéis opciones sin gluten?",
        reply:
          "Sí. Hay 9 platos sin gluten marcados en la carta y los rebozados se preparan aparte. Si quieres, te la envío por aquí.",
        did: "Ha consultado la ficha de alérgenos",
      },
    ],
  },
  {
    id: "peluqueria",
    label: "Peluquería",
    name: "Peluquería Nuria",
    questions: [
      {
        ask: "¿Cuánto cuesta un tinte?",
        reply:
          "El tinte completo son 38 € y con corte, 52 €. Tengo hueco el jueves a las 17:30 o el viernes a las 10:00. ¿Te apunto?",
        did: "Ha mirado la tarifa y la agenda",
      },
      {
        ask: "¿Tenéis hueco el sábado?",
        reply: "El sábado queda libre a las 9:30 y a las 12:00. ¿Qué te vas a hacer? Así reservo el tiempo justo.",
        did: "Ha mirado la agenda del sábado",
      },
      {
        ask: "Necesito cambiar mi cita",
        reply:
          "Claro. Tienes cita el miércoles a las 18:00. Puedo pasarla al jueves a las 18:30 o al viernes a las 16:00. ¿Cuál te viene mejor?",
        did: "Ha encontrado tu cita y los huecos libres",
      },
    ],
  },
  {
    id: "tienda",
    label: "Tienda",
    name: "Deportes Sierra",
    questions: [
      {
        ask: "¿Tenéis las zapatillas en la talla 42?",
        reply: "Sí, quedan 2 pares de la 42 en azul y 1 en negro. ¿Te aparto unas hasta mañana?",
        did: "Ha consultado el stock",
      },
      {
        ask: "¿Dónde está mi pedido?",
        reply: "Tu pedido nº 1482 salió ayer y llega mañana antes de las 14:00. Te mando el enlace de seguimiento.",
        did: "Ha buscado tu pedido",
      },
      {
        ask: "¿Puedo devolver un regalo?",
        reply:
          "Sí, tienes 30 días con el tique regalo. Puedes cambiarlo en la tienda o te enviamos una etiqueta para devolverlo gratis.",
        did: "Ha leído las condiciones de devolución",
      },
    ],
  },
  {
    id: "clinica",
    label: "Clínica",
    name: "Clínica Dental Vega",
    questions: [
      {
        ask: "Quiero pedir cita para una limpieza",
        reply:
          "Perfecto. Tengo hueco el martes a las 10:30 o el jueves a las 17:00. La limpieza dura unos 40 minutos. ¿Cuál prefieres?",
        did: "Ha mirado la agenda",
      },
      {
        ask: "¿Trabajáis con mi seguro?",
        reply:
          "Trabajamos con las principales aseguradoras dentales. Dime cuál es la tuya y te confirmo qué te cubre antes de la cita.",
        did: "Ha consultado los seguros aceptados",
      },
      {
        ask: "Me duele una muela, ¿podéis verme hoy?",
        reply:
          "Siento que estés así. Hoy queda un hueco de urgencias a las 13:15. Te lo reservo y aviso a la doctora. ¿Me dices tu nombre?",
        did: "Ha reservado un hueco de urgencias y ha avisado al equipo",
      },
    ],
  },
]
