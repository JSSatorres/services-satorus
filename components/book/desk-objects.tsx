/**
 * Ticket de caja dibujado plano, con la paleta de la marca y trazo grafito.
 * Es el papel que se pierde en la doble página del lío.
 */
const INK = "var(--bench-graphite)"
const ORANGE = "var(--action-orange)"

export function TicketDrawing() {
  return (
    <svg viewBox="0 0 120 140" aria-hidden="true" focusable="false">
      <path
        d="M34 10H86V122L80.8 128L75.6 122L70.4 128L65.2 122L60 128L54.8 122L49.6 128L44.4 122L39.2 128L34 122Z"
        fill="#fff"
        stroke={INK}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path d="M44 28H76M44 40H68M44 52H72M44 64H62" stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <path d="M44 84H76" stroke={INK} strokeWidth="2" strokeDasharray="3 3" />
      <rect x="44" y="94" width="32" height="10" fill={ORANGE} />
    </svg>
  )
}
