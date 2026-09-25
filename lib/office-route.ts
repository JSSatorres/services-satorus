export const officeDestinations = [
  {
    id: "como-trabajamos",
    label: "Cómo trabajamos",
    place: "El primer encuentro",
    short: "Entender",
  },
  {
    id: "diagnostico",
    label: "Soluciones",
    place: "Dar forma a la solución",
    short: "Resolver",
  },
  {
    id: "proyectos",
    label: "Proyectos",
    place: "Del plan al trabajo real",
    short: "Construir",
  },
  {
    id: "contacto",
    label: "Hablemos",
    place: "Tu siguiente paso",
    short: "Empezar",
  },
] as const;
export type OfficePhase =
  "organizing" | "office" | "departing" | "interior" | "entering" | "reading";
export function destinationFromHash(hash: string) {
  const id = hash.replace(/^#/, "");
  const aliases: Record<string, number> = {
    "hablamos-claro": 2,
    "tu-app": 1,
    "que-hacemos": 2,
    "pasos-3-y-4": 0,
    "tu-siguiente-paso": 3,
    herramientas: 1,
    automatizacion: 1,
    preguntas: 3,
  };
  return aliases[id] ?? officeDestinations.findIndex((item) => item.id === id);
}
export function nextDestination(current: number, direction: 1 | -1) {
  return Math.min(
    officeDestinations.length - 1,
    Math.max(-1, current + direction),
  );
}
export function shouldLeavePanel(
  top: number,
  viewport: number,
  height: number,
  direction: 1 | -1,
) {
  return direction > 0 ? top + viewport >= height - 2 : top <= 2;
}
