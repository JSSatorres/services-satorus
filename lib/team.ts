/**
 * Datos de la página /equipo.
 *
 * El perfil de Tony es PROVISIONAL: nombre completo, foto (Unsplash, licencia
 * libre), biografía y frase están inventados para ver la página con su
 * aspecto final. Cuando nos envíe sus datos basta con sustituirlos aquí y
 * cambiar `public/team/tony.webp` (cuadrada, 720×720). Antes de publicar,
 * quitar también el `noindex` de `app/equipo/page.tsx`.
 */

export type MemberId = "juan" | "damian" | "tony";

export type TeamMember = {
  id: MemberId;
  name: string;
  shortName: string;
  role: string;
  location: string;
  photo: string;
  photoAlt: string;
  /** Texto del sello giratorio sobre el retrato. */
  stamp: string;
  /** De dónde viene, en una frase corta para la tarjeta. */
  origin: string;
  story: string;
  brings: string[];
  quote: string;
  link?: { href: string; label: string };
  /** Color del campo que hay detrás del retrato. */
  accent: "blue" | "orange" | "lime";
};

export const team: TeamMember[] = [
  {
    id: "juan",
    name: "Juan Satorres Sánchez",
    shortName: "Juan",
    role: "Ingeniero de software · Arquitectura e IA",
    location: "Granada",
    photo: "/team/juan.webp",
    photoAlt: "Retrato de Juan Satorres, sonriente, con americana azul y camisa blanca",
    stamp: "De la ingeniería mecánica al software · ",
    origin: "Ingeniero mecánico",
    story:
      "Ingeniero mecánico que llevó el rigor de la ingeniería al software. Diseña arquitecturas web completas —de la base de datos a la interfaz—, construye APIs e integraciones entre sistemas y aplica inteligencia artificial a procesos reales de empresa: agentes, automatizaciones y modelos de lenguaje conectados a los datos del negocio.",
    brings: [
      "Arquitectura de software escalable, de la base de datos a la interfaz",
      "Agentes e inteligencia artificial integrados en procesos reales",
      "APIs e integraciones que conectan las herramientas que ya usas",
      "Despliegue, seguridad y mantenimiento de cada sistema en producción",
    ],
    quote: "Un buen sistema se diseña como una máquina: cada pieza con una función y nada que sobre.",
    link: { href: "https://www.linkedin.com/in/juan-s%C3%A1nchez-satorres/", label: "LinkedIn de Juan" },
    accent: "blue",
  },
  {
    id: "damian",
    name: "Damián López",
    shortName: "Damián",
    role: "Ingeniero frontend · Arquitectura de interfaces",
    location: "Ourense",
    photo: "/team/damian.webp",
    photoAlt: "Retrato en blanco y negro de Damián López, con barba y camisa oscura",
    stamp: "Arquitectura frontend e IA generativa · ",
    origin: "Ingeniería informática",
    story:
      "Ingeniero frontend en Kelea y estudiante de Ingeniería Informática. Diseña la arquitectura de aplicaciones en React y TypeScript pensadas para crecer sin romperse, las cubre con tests automatizados antes de que lleguen a producción y trabaja con programación agéntica e IA generativa para acelerar el desarrollo sin perder calidad.",
    brings: [
      "Arquitectura frontend mantenible en React y TypeScript",
      "Tests automatizados que detectan errores antes que tus clientes",
      "Rendimiento y accesibilidad medidos, no supuestos",
      "Desarrollo agéntico con IA generativa aplicado con criterio",
    ],
    quote: "Si no está probado, no está terminado.",
    link: { href: "https://www.linkedin.com/in/damianlopezdev/", label: "LinkedIn de Damián" },
    accent: "orange",
  },
  {
    id: "tony",
    // PROVISIONAL: apellido inventado.
    name: "Tony Morales",
    shortName: "Tony",
    role: "Empresario · Dirección y gestión de pymes",
    location: "Granada",
    photo: "/team/tony.webp",
    photoAlt: "Retrato de Tony, sonriente, con polo azul marino",
    stamp: "Más de 20 años dirigiendo pymes · ",
    origin: "Empresario",
    story:
      "Lleva más de veinte años al frente de pequeñas y medianas empresas: ha fundado negocios, dirigido equipos, cuadrado cuentas en años buenos y malos y acompañado a otras pymes en su crecimiento. En Satorus traduce cada idea técnica a lo que de verdad importa a un empresario: tiempo, margen y tranquilidad.",
    brings: [
      "Visión de negocio para decidir qué digitalizar primero",
      "Procesos y organización interna antes de escribir código",
      "Control de costes y retorno de cada inversión tecnológica",
      "La experiencia de quien ha dirigido una pyme por dentro",
    ],
    quote: "La tecnología que no se nota en la cuenta de resultados es un gasto, no una inversión.",
    accent: "lime",
  },
];

export const teamById = Object.fromEntries(team.map((member) => [member.id, member])) as Record<
  MemberId,
  TeamMember
>;

/** Orden en toda la página: la arquitectura, la interfaz y el negocio. */
export const relayOrder: MemberId[] = ["juan", "damian", "tony"];

export type Scenario = {
  id: string;
  problem: string;
  steps: Record<MemberId, string>;
};

export const scenarios: Scenario[] = [
  {
    id: "presupuestos",
    problem: "Mis presupuestos se pierden entre WhatsApp y el correo",
    steps: {
      juan: "Diseña un sistema que recoge cada solicitud, la registra y lanza el seguimiento automático.",
      damian: "Construye un panel donde ves el estado de cada presupuesto de un vistazo, también desde el móvil.",
      tony: "Define el proceso comercial: plazos de respuesta, seguimiento y cuándo dar un cliente por perdido.",
    },
  },
  {
    id: "datos",
    problem: "Copio los mismos datos en tres programas distintos",
    steps: {
      juan: "Conecta tus herramientas mediante APIs para que cada dato se escriba una sola vez.",
      damian: "Unifica la información en una única interfaz clara y probada para tu equipo.",
      tony: "Calcula las horas que recuperas y decide en qué invertirlas para que se note en el negocio.",
    },
  },
  {
    id: "rentabilidad",
    problem: "No sé qué clientes o servicios me dan dinero",
    steps: {
      juan: "Reúne facturación, costes y horas en una base de datos única y fiable.",
      damian: "Lo convierte en un cuadro de mando que entiendes en diez segundos.",
      tony: "Te ayuda a leer esos números y a decidir qué potenciar y qué dejar de hacer.",
    },
  },
  {
    id: "ia",
    problem: "Quiero usar IA, pero no sé por dónde empezar",
    steps: {
      juan: "Diseña agentes de IA conectados a tus datos que responden, clasifican y redactan por ti.",
      damian: "Los integra en pantallas sencillas, con controles para revisar lo que hace la IA.",
      tony: "Elige los procesos donde la IA ahorra más tiempo y dinero, y mide el resultado.",
    },
  },
  {
    id: "web",
    problem: "Mi web es bonita, pero no me trae clientes",
    steps: {
      juan: "Rehace la arquitectura para que sea rápida, segura y fácil de encontrar en Google.",
      damian: "Optimiza rendimiento y conversión, y lo prueba en móvil antes de publicar.",
      tony: "Afina el mensaje comercial: qué ofreces, a quién y por qué deberían elegirte.",
    },
  },
];
