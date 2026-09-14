/**
 * Interruptor compartido del relevo de secciones.
 *
 * El stack de cortinas se apropia del gesto de scroll en las fronteras entre
 * secciones. Cuando otra pieza mueve el scroll por su cuenta —la navegación del
 * header, que salta a una sección y reproduce su propia cobertura— ese gesto no
 * debe dispararse: el salto cruzaría varias fronteras de golpe y encadenaría
 * relevos encima de la animación del header.
 */
let suspended = false;

/** Desactiva el relevo por gesto mientras otra pieza controla el scroll. */
export function suspendCurtainTakeover() {
  suspended = true;
}

/** Devuelve el control del gesto al stack de cortinas. */
export function resumeCurtainTakeover() {
  suspended = false;
}

export function isCurtainTakeoverSuspended() {
  return suspended;
}
