# Reposo entre secciones en el relevo de cortina

**Goal:** Que cada sección del home, una vez ha terminado de entrar, se quede completa y
estática en pantalla durante un tramo real de scroll antes de que la siguiente empiece a
asomar.

**Architecture:** No se toca la geometría (paneles de una pantalla, `pinSpacing: false`,
rangos de los `ScrollTrigger`). Se reparte de otra forma el recorrido del relevo dentro de
`createRelayTimeline` (`components/section-curtain-stack.tsx`): la parte **visible** de la
entrada (desplazamiento, escala, atenuado del saliente, aparición del titular) se comprime
en la primera fracción del recorrido —`ENTRANCE_TRAVEL`— y el resto del recorrido queda
como **reposo**, con el panel ya colocado y nada en movimiento. El tween lineal que cancela
el ascenso por scroll sigue ocupando el 100% del recorrido, que es lo que mantiene el panel
clavado arriba durante el reposo. La dirección `"bottom"`, que hoy no tiene ningún tween y
por eso aterriza justo en el último píxel del recorrido, pasa a animarse con la misma
estructura para que también tenga reposo.

**Tech Stack:** Next.js 16 (App Router), GSAP 3 + ScrollTrigger + `@gsap/react`, Lenis,
React 19. Sin suite de tests: la verificación es estática (lint/build) + medición en
navegador.

## Perfil de verificación

- Nivel: **standard**
- Motivo: cambio puramente visual y de animación, sin lógica de negocio, datos, auth ni
  migraciones. Pero toca el componente del que cuelgan **todas** las secciones del home y
  convive con un pin anidado (`desktop-scroll-story`), así que el riesgo real es (a) que un
  panel se salga por el borde superior durante el relevo y (b) romper escritorio.
- Comandos:
  - `npm run lint`
  - `npm run build`
  - Medición en navegador sobre `http://localhost:3001` a `390×844` y `1440×900`.
- Evidencias esperadas:
  - En cada relevo existe un tramo de scroll **no vacío** en el que el panel entrante está
    en `tx = 0`, `scale = 1` y cubre el 100% del viewport, y el siguiente relevo aún no ha
    empezado (`--curtain-dim` del siguiente saliente todavía a 0).
  - Durante todo el relevo, el `top` del panel entrante nunca es `< 0` (no se va por
    arriba).
  - Capturas a 390×844 en el punto de reposo de al menos dos relevos.
  - A 1440×900, alturas de sección y `scrollHeight` del documento **idénticos** a los de
    antes del cambio (el cambio no toca layout).

## Incidencias de verificación

<!-- Se rellena durante la ejecución solo para fallos major/critical. -->

---

## Diagnóstico (medido, no supuesto)

Medido con el dev server en `http://localhost:3001`, viewport `390×844`, carga limpia (sin
redimensionar después de cargar: `visiblePanels` se calcula una sola vez en `useGSAP`).

Paneles visibles en móvil, en orden, con su `top` de documento:

| # | panel | top | alto |
|---|---|---|---|
| 0 | `.hero` | 0 | 844 |
| 1 | `.plain-talk` | 844 | 1519 |
| 2 | `.services-section` | 2363 | 844 |
| 3 | `.mobile-flow-reveal` | 3207 | 844 |
| 4 | `.projects-section` | 4051 | 844 |
| 5 | `.process-section` | 4895 | 844 |
| 6 | `.faq-section` | 5739 | 844 |
| 7 | `.contact-section` | 6583 | 844 |

`.desktop-scroll-story` queda fuera (su sección es `display: none` a ≤900px, así que su
panel mide 0 y el filtro de `visiblePanels` lo descarta). Correcto.

**Barrido del relevo `services → mobile-flow`** (`start: "top bottom"` = y 2363,
`end: "top top"` = y 3207, recorrido 844 = exactamente un viewport):

| progreso | y | `tx` entrante | cobertura | `--curtain-dim` saliente |
|---|---|---|---|---|
| 0.0 | 2363 | −374 | **4%** | 0.0001 |
| 0.2 | 2532 | −192 | 51% | 0.058 |
| 0.4 | 2701 | −81 | 79% | 0.116 |
| 0.6 | 2869 | −24 | 94% | 0.173 |
| 0.8 | 3038 | −3 | 99% | 0.231 |
| 0.9 | 3123 | 0 | 100% | 0.26 |
| 1.0 | 3207 | 0 | 100% | — |

**La causa raíz, confirmada:** `y = 2363` es a la vez el píxel en el que
`.services-section` termina de colocarse (fin de *su* relevo, `end: "top top"` sobre su
propio panel) y el píxel en el que arranca el relevo de `.mobile-flow-reveal`
(`start: "top bottom"` sobre el panel siguiente, que está justo un viewport más abajo
porque `pinSpacing: false` y cada panel mide una pantalla). **No existe ningún valor de
scroll en el que la cobertura sea 0 y la sección esté sola en pantalla.** Eso es
exactamente lo que se ve en la captura del usuario: la sección de servicios ya colocada y
la siguiente asomando por el lado izquierdo.

El recorrido del relevo mide siempre un viewport y no se puede alargar sin romper el
contrato "una sección = una pantalla" de
`docs/plans/2026-09-12-satorus-movil-encaje-secciones.md`. Por tanto el reposo sale de
**repartir** ese recorrido, no de añadir scroll.

### Hipótesis descartadas

- *"El panel saliente se despinea antes de tiempo."* Falso: la medición lo mantiene en
  `top: 0` hasta el final del relevo.
- *"Alargar el recorrido del relevo dando más scroll a cada panel."* Exige paneles más
  altos o `pinSpacing: true`; rompe el contrato de una pantalla por sección y la regresión
  de escritorio ya verificada. Descartado.
- *"Retrasar la entrada al final del recorrido en vez de comprimirla al principio."*
  Produce exactamente el mismo reposo desplazado un tramo (cada sección descansa igual);
  no compensa el código extra y deja la última sección (`.contact-section`) entrando en el
  último píxel del documento. Descartado a favor de comprimir al principio.

## Contrato (invariantes que el resultado debe cumplir)

1. **Existe reposo.** Para cada par de paneles consecutivos hay un intervalo de scroll de
   longitud `> 0` en el que el panel entrante tiene `translateX = 0`, `scale = 1`, cubre el
   viewport entero, y el relevo siguiente todavía no ha empezado.
2. **Nada se sale por arriba.** Durante todo el relevo,
   `surface.getBoundingClientRect().top >= -1` para el panel entrante. Este es el motivo por
   el que el tween de cancelación `y` debe seguir siendo **lineal y de `duration: 1`**: si
   se comprime, en el tramo de reposo el scroll seguiría subiendo el panel sin nada que lo
   compense.
3. **El recorrido sigue midiendo un viewport.** No se tocan `start`, `end`, `endTrigger`,
   `pin` ni `pinSpacing` de ninguno de los dos `ScrollTrigger.create`.
4. **Escritorio intacto en layout.** El cambio es sólo de reparto temporal dentro de la
   timeline; `scrollHeight` y las alturas de sección a 1440×900 no cambian.
5. **Sin transforms residuales.** `resetRelay` debe seguir limpiando todo lo que se anime,
   incluida la dirección `"bottom"`, que a partir de ahora sí recibe transform.

## Forbidden decisions

- **No** tocar los rangos de los `ScrollTrigger` (`start`/`end`/`endTrigger`/`pin`/
  `pinSpacing`/`anticipatePin`): el recorrido de un viewport es el supuesto del que depende
  el tween de cancelación.
- **No** comprimir ni cambiar la ease del tween `y` de cancelación: lineal y `duration: 1`.
  Violarlo rompe el invariante 2.
- **No** usar `yPercent` para la entrada `"bottom"`: es porcentaje de la **altura del
  elemento**, y hay paneles más altos que el viewport (`.plain-talk` mide 1519 en móvil, y
  en escritorio varias secciones pasan de 2000px). El recorrido del relevo es
  `window.innerHeight` **independientemente** de la altura del panel, así que la entrada
  debe expresarse en píxeles con `y`.
- **No** añadir CSS ni tocar `app/globals.css`: el problema es de reparto temporal.
- **No** tocar `prefers-reduced-motion` (el componente ya sale antes de crear nada).
- **No** dejar `transform` aplicado fuera del relevo: crearía bloque contenedor y rompería
  el pin anidado de `desktop-scroll-story` y el vídeo fijo del hero (ya documentado en el
  propio componente).

---

## Task 1: Reparto del relevo con tramo de reposo

**Files:**
- Modify: `components/section-curtain-stack.tsx` — constantes de cabecera (junto a
  `OUTGOING_DIM`, `DIM_PROPERTY`) y la función `createRelayTimeline`.

**No hay test automatizado:** el proyecto no tiene suite (`package.json` sólo expone `dev`,
`build`, `start`, `lint`). El bucle de realimentación es la medición en navegador de la
Task 2, que ya está construida y ha reproducido el fallo.

**Paso 1 — Constante con nombre.**

Añade junto a `OUTGOING_DIM`:

```ts
// Fracción del recorrido del relevo que consume la entrada visible. El resto es
// reposo: la sección ya colocada se queda quieta y sola en pantalla antes de que
// la siguiente empiece a asomar. El recorrido total mide un viewport y no se puede
// alargar sin romper "una sección = una pantalla", así que el reposo se consigue
// repartiéndolo, no añadiendo scroll.
const ENTRANCE_TRAVEL = 0.55;
```

*Justificación del snippet:* el comentario es el único sitio donde queda escrito por qué no
se alarga el recorrido; sin él, el siguiente que lea el archivo lo "arreglará" subiendo la
duración a 1 otra vez.

**Paso 2 — Atenuado del saliente.** El tween de `DIM_PROPERTY` pasa de `duration: 0.9` a
`duration: ENTRANCE_TRAVEL`, para que el saliente termine de oscurecerse justo cuando el
entrante acaba de colocarse y no siga cambiando durante el reposo.

**Paso 3 — Entradas laterales (`"right"` / `"left"`).**

- El tween de cancelación (`y: -window.innerHeight → 0`, `ease: "none"`) se queda
  **exactamente como está**: `duration: 1`. Es lo que mantiene el panel clavado arriba
  durante el reposo (invariante 2).
- El tween de `xPercent` + `scale` pasa de `duration: 1` a `duration: ENTRANCE_TRAVEL`,
  manteniendo `ease: "power2.out"` y la posición `0`.

**Paso 4 — Entrada frontal (`"bottom"`).**

Hoy esta rama no crea ningún tween: el panel sube solo con el scroll y aterriza justo en el
último píxel del recorrido, de ahí que tampoco tenga reposo. Dale la misma estructura, en
píxeles (nunca `yPercent`, ver *Forbidden decisions*), con `const height = window.innerHeight`:

- Tramo de entrada: `y` de `0` a `-height * (1 - ENTRANCE_TRAVEL)`, `duration: ENTRANCE_TRAVEL`,
  `ease: "power2.out"`, posición `0`.
- Tramo de reposo: `y` de `-height * (1 - ENTRANCE_TRAVEL)` a `0`, `duration: 1 - ENTRANCE_TRAVEL`,
  `ease: "none"`, posición `ENTRANCE_TRAVEL`.

**Por qué esos valores, para que no se toquen a ojo.** Durante el relevo el panel sube solo
con el scroll: su posición natural es `height * (1 - p)`. La posición visible es
`natural(p) + y(p)`.

- En `p = 0`: `height + 0 = height` → justo debajo del viewport. Igual que hoy.
- En `p = ENTRANCE_TRAVEL`: `height * (1 - ENTRANCE_TRAVEL) - height * (1 - ENTRANCE_TRAVEL) = 0`
  → colocado.
- Para `p > ENTRANCE_TRAVEL` el segundo tramo es lineal y vale `-height * (1 - p)`, que
  cancela exactamente el ascenso natural → se queda en `0`. Ese es el reposo.

El segundo tramo **tiene que ser lineal**: es una cancelación, no una animación.

Deben ser dos tweens **consecutivos** sobre `y` (el segundo arranca en
`ENTRANCE_TRAVEL`, donde acaba el primero), nunca solapados: dos tweens simultáneos sobre
la misma propiedad pelean.

**Paso 5 — Titular.** Las posiciones y duración del tween del titular están calibradas
sobre un recorrido de 1; reescálalas por `ENTRANCE_TRAVEL` para que la entrada del titular
siga cayendo dentro de la entrada visible y no invada el reposo. Es decir: la posición
(`0.26` en `"bottom"`, `0.34` en lateral) y la `duration: 0.42` se multiplican por
`ENTRANCE_TRAVEL`.

**Paso 6 — `resetRelay`.** Comprueba que sigue limpiando lo que ahora anima la rama
`"bottom"`. Hoy hace `clearProps: "transform,transformOrigin"` sobre `incomingSurface`, que
ya cubre `y`. Si es así, **no cambies nada** y déjalo constatado; no añadas limpieza
redundante.

**Paso 7 — Autocomprobación.**
- Run: `npm run lint` · Expected: sin errores nuevos (hay un aviso preexistente,
  `readHeaderHeight` sin usar).
- Run: `npm run build` · Expected: compila.

## Task 2: Verificación en navegador

**Files:** ninguno (medición).

Con el dev server en `http://localhost:3001`.

**Paso 1 — Carga limpia a 390×844.** Importante: fijar el viewport **antes** de navegar, o
recargar después de redimensionar. `visiblePanels` se calcula una sola vez dentro de
`useGSAP` y un redimensionado que cruce el breakpoint de 900px no lo recalcula, así que
medir tras redimensionar da paneles fantasma (`.desktop-scroll-story` participando en el
relevo con la sección oculta). Es un artefacto de la medición, **no** un fallo a arreglar en
esta tarea.

**Paso 2 — Barrido del relevo `services → mobile-flow`** (y 2363 → 3207, 21 muestras).
Para cada muestra registrar del panel entrante: `translateX`, `scale`, `top` del
`getBoundingClientRect`, cobertura del viewport, y `--curtain-dim` del saliente.

Expected:
- Existe un tramo final (aprox. `p >= 0.55`, ~380px de scroll) con `tx = 0`, `scale = 1`,
  cobertura 100%.
- En **ninguna** muestra el `top` del entrante es `< -1` (invariante 2).

**Paso 3 — Reposo real, no sólo "colocado".** Comprobar que en ese tramo el relevo
*siguiente* (`mobile-flow → projects`) todavía no ha arrancado: `--curtain-dim` de
`.mobile-flow-reveal` a 0 y el panel de `.projects-section` sin cubrir viewport. Es lo que
distingue "la sección está colocada" de "la sección está sola en pantalla".

**Paso 4 — Repetir en un relevo `"bottom"`** (`plain-talk → services`, y 1519 → 2363) para
confirmar que la rama nueva también descansa y arranca justo debajo del viewport en `p = 0`.

**Paso 5 — Capturas** a 390×844 en el punto de reposo de ambos relevos.

**Paso 6 — Regresión de escritorio a 1440×900:** `scrollHeight` del documento y alturas de
sección idénticas a la tabla de
`docs/plans/2026-09-12-satorus-movil-encaje-secciones.md` (documento 12712, `.hero` 792,
`.plain-talk` 2115, `.services-section` 1356, `.process-section` 3334, `.faq-section` 741,
`.contact-section` 920), y un barrido de un relevo lateral comprobando que también hay
reposo y que nada se sale por arriba.

## Task 3 (final): Actualizar documentación

**Files:**
- Modify: `docs/plans/2026-09-13-relevo-reposo-secciones.md` — rellenar
  `## Resultado de la verificación` con las mediciones reales (tablas antes/después) y, si
  las hubo, `## Incidencias de verificación`.
- Modify (si aplica): `docs/section-gently.motion-spec.json` — si documenta el reparto
  temporal del relevo, añadir `ENTRANCE_TRAVEL` y el tramo de reposo.
- Modify (si aplica): `.impeccable/surfaces/app-page-tsx.md` — si registra el
  comportamiento del relevo.

El proyecto no tiene `AGENTS.md`, `CLAUDE.md`, `docs/design-guides/` ni
`docs/tareas/`; el seguimiento vive en los propios planes de `docs/plans/`. **Cerrar =
dejar el plan con su resultado medido.**

---

## Resultado de la verificación (ejecutada)

### Comandos

- `npm run lint` → **0 errores**, 1 aviso preexistente (`readHeaderHeight` sin usar en
  `section-curtain-stack.tsx`, anterior a este trabajo).
- `npm run build` → **compila** (12,0s de compilación, TypeScript en 3,0s) y genera las 12
  páginas estáticas.

### Reposo por relevo

Medido sobre `http://localhost:3001`, carga limpia en cada viewport (fijar el tamaño
**antes** de navegar), aproximándose a cada relevo con scroll gradual. `settledFrom` es el
progreso del relevo a partir del cual el panel entrante tiene `translateX = 0`, `scale = 1`
y `top = 0`, y se mantiene así hasta el final. `dwell` es el scroll con la sección sola y
quieta en pantalla.

**390×844 (móvil)** — recorrido de cada relevo: 844px.

| entrante | dirección | antes | `settledFrom` | dwell | `minTop` |
|---|---|---|---|---|---|
| `.plain-talk` | right | sin reposo | 0,475 | **443px** | 0 |
| `.services-section` | bottom | sin reposo | 0,550 | **380px** | 0 |
| `.mobile-flow-reveal` | left | sin reposo | 0,475 | **443px** | 0 |
| `.projects-section` | bottom | sin reposo | 0,550 | **380px** | 0 |
| `.process-section` | right | sin reposo | 0,475 | **443px** | 0 |
| `.faq-section` | bottom | sin reposo | 0,550 | **380px** | 0 |
| `.contact-section` | left | sin reposo | 0,475 | **443px** | 0 |

**1440×900 (escritorio)** — recorrido de cada relevo: 900px.

| entrante | dirección | `settledFrom` | dwell | `minTop` |
|---|---|---|---|---|
| `.plain-talk` | right | 0,533 | **420px** | 0 |
| `.services-section` | bottom | 0,567 | **390px** | 0 |
| `.desktop-scroll-story` | left | 0,533 | **420px** | 0 |
| `.projects-section` | bottom | 0,567 | **390px** | 0 |
| `.process-section` | right | 0,533 | **420px** | 0 |
| `.faq-section` | bottom | 0,567 | **390px** | 0 |
| `.contact-section` | left | 0,533 | **420px** | 0 |

`.desktop-scroll-story`, que es el único panel con un pin anidado dentro, entra y descansa
igual que los demás.

### Comparación antes/después del relevo `services → mobile-flow` (390×844)

Cobertura del viewport por el panel entrante, a lo largo del recorrido:

| progreso | antes | después |
|---|---|---|
| 0,00 | **4%** | 4% |
| 0,20 | 51% | 75% |
| 0,40 | 79% | 98% |
| 0,50 | 88% | **100% (colocado)** |
| 0,60 | 94% | 100% |
| 0,80 | 99% | 100% |
| 0,90 | **100%** | 100% |
| 1,00 | 100% | 100% |

Antes, la cobertura llegaba al 100% en el progreso 0,90 y el relevo siguiente arrancaba en
1,00: quedaban 84px de scroll de margen, y en el instante exacto en que la sección
terminaba de colocarse la siguiente ya asomaba un 4%. Después hay **443px** de scroll con
la sección colocada y sola.

### Invariantes

1. **Existe reposo** en los 14 relevos medidos (7 en móvil + 7 en escritorio). ✅
2. **Nada se sale por arriba:** `minTop = 0` en todos; ni una sola muestra con
   `top < -1` recorriendo cada relevo en 30–40 pasos. ✅
   (Saltar de golpe al píxel exacto de inicio de un relevo sí devuelve una lectura
   transitoria de `top = -844`: es el estado de pin sin asentar tras un salto de 2000px,
   no ocurre con scroll gradual —comprobado muestreando de 5 en 5px en el borde— y no se
   da al hacer scroll de verdad.)
3. **Recorrido intacto:** no se tocó ningún `start`/`end`/`endTrigger`/`pin`/`pinSpacing`. ✅
4. **Layout intacto:** tras recorrer el documento entero de ida y vuelta a 1440×900,
   `scrollHeight` sigue en 13359 y las alturas de sección no cambian
   (`.hero` 900, `.plain-talk` 2115, `.services-section` 1306, `.desktop-scroll-story` 2565,
   `.process-section` 3334, `.faq-section` 910, `.contact-section` 948). ✅
   *Nota:* estos números no coinciden con la tabla de
   `2026-09-12-satorus-movil-encaje-secciones.md` porque el árbol de trabajo ha cambiado
   desde entonces (aparece `.projects-section`, desaparece `.friction-section`); son el
   nuevo punto de partida, no una regresión — el cambio de esta tarea es sólo de reparto
   temporal dentro de la timeline y no toca CSS, DOM ni clases.
5. **Sin transforms residuales:** cero superficies con `transform` aplicado tras el
   recorrido completo. ✅

### Capturas

- `.playwright-mcp/reposo-services-390x844.png` — `y = 2200`, punto de reposo de
  `.services-section`: sección completa, sin nada asomando por el lado. Es exactamente el
  estado que no existía antes.
- `.playwright-mcp/reposo-mobileflow-390x844.png` — `y = 3050`, punto de reposo de
  `.mobile-flow-reveal`.

### Hallazgos fuera de alcance (no corregidos)

1. **Redimensionar cruzando el breakpoint de 900px no recalcula `visiblePanels`.** Se
   calcula una sola vez dentro de `useGSAP`, así que al pasar de escritorio a móvil sin
   recargar, `.desktop-scroll-story` sigue participando en el relevo con su sección ya en
   `display: none`: un panel vacío de una pantalla entera. Afecta a quien redimensione la
   ventana, no a un visitante real, y arreglarlo pide un `matchMedia` que reinicialice el
   stack. Queda anotado, no tocado.
2. **`transform-origin` residual en un titular** (`La IA abre nuevas posibilidades`) tras el
   recorrido: `resetRelay` limpia `transform,opacity,visibility` pero no `transform-origin`.
   Es anterior a este cambio y no tiene efecto: sin `transform`, `transform-origin` no crea
   bloque contenedor ni altera el layout.
