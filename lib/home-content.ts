export type ProcessStep = {
  title: string
  answer: string
  body: string
  image: string
  imageAlt: string
}

export const processSteps: ProcessStep[] = [
  {
    title: "Entendemos tu negocio",
    answer: "Te escuchamos.",
    body: "Nos cuentas cómo trabajas, qué quieres conseguir y dónde encuentras dificultades. Revisamos también las herramientas que ya utilizas.",
    image: "/images/process-discovery.png",
    imageAlt:
      "Reunión de escucha entre el equipo de Satorus y una clienta en torno a una mesa de trabajo",
  },
  {
    title: "Definimos la propuesta",
    answer: "Lo dejamos por escrito.",
    body: "Concretamos la solución, el alcance, la inversión y los plazos. Sabes qué incluye el proyecto antes de empezar.",
    image: "/images/process-proposal.png",
    imageAlt:
      "Consultora entrega una propuesta visual a un cliente en una mesa de trabajo",
  },
  {
    title: "Construimos y probamos contigo",
    answer: "Lo pruebas tú.",
    body: "Revisas la solución con ejemplos de tu día a día. Ajustamos lo necesario para que encaje con el trabajo real.",
    image: "/images/process-cocreate.png",
    imageAlt:
      "Equipo de Satorus y cliente revisan juntos una aplicación en una pantalla",
  },
  {
    title: "La ponemos en marcha",
    answer: "Tú sigues al mando.",
    body: "Te explicamos cómo utilizarla y dejamos acordados el soporte y el mantenimiento que necesite.",
    image: "/images/process-momentum.png",
    imageAlt:
      "Equipo de una pequeña empresa trabaja con agilidad usando su nuevo sistema",
  },
]

export const projectDoors = [
  {
    id: "apps",
    label: "Apps a medida",
    title: "Del móvil al escritorio, una herramienta que encaja contigo.",
    description:
      "Diseñamos aplicaciones para equipos, clientes y gestión: deporte, restauración, lectura y el siguiente reto de tu negocio.",
    href: "/productos#apps",
    linkLabel: "Ver las apps",
    image: "/images/apps-showcase.png",
    imageAlt:
      "Composición ilustrativa de aplicaciones para deporte, restauración y lectura en móvil y escritorio",
  },
  {
    id: "webs",
    label: "Webs con carácter",
    title: "Una web que invita a entrar y hace fácil elegirte.",
    description:
      "De la energía de Enrolla2 a la mirada personal de Ángel Mendoza: diseñamos webs que cuentan bien quién eres y por qué elegirte.",
    href: "/productos#webs",
    linkLabel: "Ver las webs",
    image: "/images/webs-showcase.png",
    imageAlt:
      "Composición ilustrativa de una web para hostelería y una web de portfolio profesional en portátil y móvil",
  },
]

export const faqs = [
  {
    question: "¿Necesito saber de programación o inteligencia artificial?",
    answer:
      "Puedes empezar explicándonos qué haces y qué te gustaría mejorar. Nosotros traducimos esa necesidad en una propuesta que puedas entender y valorar.",
  },
  {
    question: "¿Podemos aprovechar mi web y mis herramientas actuales?",
    answer:
      "Primero revisamos lo que ya tienes. La solución puede consistir en mejorarlo, conectarlo con otras herramientas o desarrollar únicamente la parte que falta.",
  },
  {
    question: "¿La inteligencia artificial tiene sentido para cualquier tarea?",
    answer:
      "Su utilidad depende de la tarea y de la información disponible. Valoramos dónde puede ayudarte y cuándo basta con una automatización sencilla.",
  },
  {
    question: "¿Qué ocurre si la IA se equivoca?",
    answer:
      "Puede cometer errores. Por eso definimos qué información utiliza, cómo probamos sus respuestas y qué pasos necesitan revisión antes de utilizarlas o enviarlas.",
  },
  {
    question: "¿Qué pasa con los datos de mi negocio?",
    answer:
      "Antes de incorporar una herramienta, revisamos qué información necesita y cómo se tratará. Las condiciones de acceso, uso y conservación forman parte de la definición de la solución.",
  },
  {
    question: "¿Cuánto cuesta y cuánto tarda?",
    answer:
      "La inversión y los plazos se concretan después de conocer tu caso. La propuesta detalla el trabajo incluido y los costes de herramientas externas o mantenimiento que correspondan.",
  },
  {
    question: "¿Puedo empezar por una parte pequeña?",
    answer:
      "Sí. Podemos plantear una primera fase centrada en una necesidad concreta y valorar después qué merece la pena ampliar.",
  },
]
