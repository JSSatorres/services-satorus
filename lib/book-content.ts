/**
 * Contenido del home como libro.
 *
 * Cada doble página es una historia con la misma regla: a la izquierda, cómo
 * llega (a mano, con tachones y papeles sueltos); a la derecha, cómo queda
 * pasado a limpio. Pasar la hoja es el acto de ordenar.
 */

/** Evento con el `id` de la historia abierta (o `null` en la portada). */
export const BOOK_SPREAD_EVENT = "satorus:book-spread"

export type Spread = {
  /** Ancla para enlaces (`#id`). */
  id: string
  /** Rótulo corto para la pestaña del canto y el contador. */
  tab: string
}

export const spreads: Spread[] = [
  { id: "tu-mesa", tab: "El lío" },
  { id: "tu-app", tab: "Tu app" },
  { id: "como-trabajamos", tab: "Pasos 1 y 2" },
  { id: "pasos-3-y-4", tab: "Pasos 3 y 4" },
  { id: "que-hacemos", tab: "Qué hacemos" },
  { id: "tu-siguiente-paso", tab: "Súbete" },
]

/** Doble página 1: chats sin contestar en el móvil. */
export const unansweredChats = [
  { name: "Marta R.", text: "¿Sigue disponible?", when: "hace 3 días", unread: 2 },
  { name: "Luis G.", text: "Hola??", when: "ayer", unread: 4 },
  { name: "Pedido 14", text: "¿Me confirmas la hora?", when: "hace 2 días", unread: 1 },
  { name: "+34 6•• ••• 812", text: "Buenas, ¿qué precio tiene…", when: "hace 5 días", unread: 1 },
  { name: "Carmen", text: "Vale, lo miro en otro sitio", when: "hace 1 semana", unread: 1 },
]

/** Pieza de la aplicación que resuelve cada problema. */
export type AppModule = "whatsapp" | "agenda" | "budgets" | "calls" | "till" | "clients"

/**
 * Doble página 2, izquierda: la lista de problemas que hacemos con el
 * cliente. Cada uno acaba apuntando a la pieza de la app que lo resuelve.
 */
export const problemList: { problem: string; fix: string; module: AppModule }[] = [
  { problem: "12 mensajes sin contestar", fix: "Asistente de WhatsApp", module: "whatsapp" },
  { problem: "2 citas a la misma hora", fix: "Agenda online", module: "agenda" },
  { problem: "3 presupuestos sin enviar", fix: "Presupuestos", module: "budgets" },
  { problem: "5 llamadas perdidas", fix: "Aviso de llamadas", module: "calls" },
  { problem: "tickets de caja… ¿dónde?", fix: "Caja", module: "till" },
  { problem: "1 cliente que se fue", fix: "Seguimiento de clientes", module: "clients" },
]

/**
 * «Cómo trabajamos», una página por paso: qué pasa en ese paso, contado sin
 * tecnicismos, y qué te llevas al acabarlo. Va en el orden de `processSteps`.
 */
export const processDetails = [
  {
    text: "Una charla sin tecnicismos. Nos cuentas cómo trabajas, qué te quita tiempo y qué te gustaría conseguir. Miramos también lo que ya usas —WhatsApp, Excel, tu web— para aprovecharlo.",
    takeaway: "Tu lista de problemas por escrito y por dónde empezaríamos.",
  },
  {
    text: "Te proponemos una solución concreta: qué vamos a hacer, cuánto cuesta y cuándo estará. Sin letra pequeña: sabes lo que incluye antes de decidir.",
    takeaway: "Una propuesta cerrada con alcance, inversión y plazo.",
  },
  {
    text: "Lo construimos por partes y te lo enseñamos pronto. Lo pruebas con tus casos de verdad y lo ajustamos hasta que encaje con cómo trabajáis.",
    takeaway: "Una versión de prueba que tu equipo usa antes del día de arranque.",
  },
  {
    text: "La dejamos funcionando, enseñamos a tu equipo a usarla y acordamos el soporte y el mantenimiento. Si algo falla o quieres crecer, seguimos al otro lado.",
    takeaway: "Tu herramienta en marcha, tu equipo formado y el soporte acordado.",
  },
]
