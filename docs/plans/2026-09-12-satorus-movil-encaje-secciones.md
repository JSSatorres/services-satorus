# Encaje de secciones en móvil (una sección = una pantalla)

**Goal:** Que en móvil cada sección del home quepa exactamente en una altura de
pantalla, de forma que el relevo de cortina (`SectionCurtainStack`) revele siempre una
sección completa y legible, sin tocar el comportamiento en escritorio.

**Architecture:** No se reescribe ningún componente ni animación. Se introduce en
`app/globals.css`, dentro de `@media (max-width: 900px)`, un **contrato de encaje**:
unos tokens que definen el presupuesto de una pantalla (`--m-stage`, `--m-stage-top`,
`--m-stage-bottom`) y una escala de tipografía que depende **también de la altura**
(`min(rem, vw, svh)`), más una caja compartida `min-height: var(--m-stage)` +
`grid-template-rows: auto minmax(0, 1fr)` para las seis secciones que hoy desbordan.
Además se cierra el hueco 621–900px, donde el recorrido horizontal del proceso
(`.process-track { height: 300svh }`) sigue activo aunque la web ya se comporta como
móvil (`.desktop-scroll-story` está oculto desde 900px).

**Tech Stack:** Next.js 16 (App Router), CSS puro con custom properties (Tailwind v4
solo como capa base), GSAP ScrollTrigger + `@gsap/react`, Lenis.

## Perfil de verificación

- Nivel: **standard**
- Motivo: cambio puramente visual y responsive, sin lógica de negocio ni datos, pero
  afecta a todas las secciones del home y convive con pins de ScrollTrigger, que son
  sensibles a las alturas. El riesgo real es (a) romper escritorio y (b) que el texto
  se recorte en pantallas cortas.
- Comandos:
  - `npm run lint`
  - `npm run build`
  - Medición en navegador a `360×844`, `390×844`, `430×844`, `640×844`, `768×844`,
    `375×667` (pantalla corta) y regresión a `1440×900`.
- Evidencias esperadas:
  - Toda sección del home con `alturaSección <= innerHeight` en cada ancho móvil.
  - `scrollHeight` del documento reducido de forma coherente (menos huecos muertos).
  - Ninguna sección con contenido recortado (`scrollHeight > clientHeight` en la caja
    de contenido).
  - Capturas a 390×844 de las seis secciones tocadas.
  - A 1440×900 las alturas de sección **idénticas** a las de antes del cambio.

## Incidencias de verificación

**1. Selector agrupado partido (major, corregida).** Al quitar `.contact-copy h2` del
bloque de 620px se cortó la cola de una lista agrupada
(`.plain-talk-copy h2, .friction-copy h2, …, .contact-copy h2`) y quedó una coma
colgando que se comió la regla siguiente: las seis cabeceras heredaron
`max-width: 7ch` y un titular de 4,4rem. Se detectó midiendo (titulares de 379px
donde se esperaban 95px) y se reparó restaurando `.plain-talk-copy h2` como regla
propia.

**2. La trampa de `ch` (major, corregida).** El primer intento topaba los titulares en
`max-width: 14ch`. `ch` escala con la fuente, así que al reducir el titular la caja se
estrechaba y salían **más** líneas, no menos (12 líneas en `.services-heading h2`). Los
titulares de móvil pasaron a `max-width: none`.

**3. `rows={5}` manda sobre `min-height` (major, corregida).** El `textarea` de contacto
no se encogía con `min-height` porque `rows={5}` le da altura **intrínseca** (~120px).
Era el único motivo por el que la sección de contacto no entraba. Se le dio `height`
explícito en móvil, manteniendo `resize: vertical`.

**4. Maqueta de la demo colapsada (major, corregida).** `min-height: 0` + `height: 100%`
sobre `.demo-browser` la dejaba en los 36px de su barra, recortando el contenido: el
panel tenía `max-height` pero no altura **definida**, así que el `100%` no tenía contra
qué resolverse, y `place-items: center` tampoco estiraba al hijo. Se resolvió haciendo
que el panel absorba el espacio sobrante (`flex: 1 1 auto`) y estirando el hijo.

**5. Fuga de `--section-pad` a /productos (major, corregida).** Bajar `--section-pad` a
`1.5rem` en el bloque de móvil afectaba también a
`app/productos/productos.module.css`, que usa el mismo token. Se retiró el override: el
home ya no lo necesita porque las secciones encajadas llevan su propio padding con los
tokens de escena. Verificado: en /productos el token vuelve a resolver
`clamp(5rem, 9vw, 9rem)`.

---

## Estado actual (medido, no supuesto)

Medido con el servidor de desarrollo en `http://localhost:3001`, viewport de alto 844 y
`prefers-reduced-motion: reduce` (para que la cortina no pinte y el documento quede
plano). `vh = 844`.

| Sección | 360 | 390 | 430 | 640 | 768 | Veredicto |
|---|---|---|---|---|---|---|
| `.hero` | 844 | 844 | 844 | 844 | 844 | ✅ encaja |
| `.plain-talk` | 1688 | 1688 | 1688 | 1688 | 1688 | ✅ es pista de 200svh con escena `sticky` de 100svh |
| `.friction-section` | 942 | 971 | 924 | 906 | 906 | ❌ desborda ~60–130 |
| `.services-section` | 1794 | 1789 | 1791 | 1661 | 1652 | ❌ desborda ~2,1× |
| `.mobile-flow-reveal` | 984 | 971 | 1043 | 1176 | 1208 | ❌ desborda, y empeora al crecer el ancho |
| `.process-section` | 1749 | 1576 | 1517 | 3024 | 3034 | ❌ desborda; **a ≥621px sigue en modo horizontal (300svh)** |
| `.faq-section` | 1106 | 1120 | 1092 | 988 | 989 | ❌ desborda ~150–280 |
| `.contact-section` | 1443 | 1420 | 1451 | 1244 | 1233 | ❌ desborda ~390–600 |

Desglose de lo que ocupa el espacio a 390×844 (área útil real ≈ `844 - 64` de cabecera
≈ **780**):

- `.services-section` 1789 = titular 367 + `.service-showcase` 1198 + padding 160.
- `.process-section` 1576 = titular 285 + `.process-route` 1067 (4 pasos × ~250) + 160.
- `.contact-section` 1420 = copia 477 + formulario 735 + gap 48 + 160.
- `.faq-section` 1120 = titular 370 + lista 542 + gap 48 + 160.
- `.mobile-flow-reveal` 971 = titular 241 + marco 554 (`min-height: 520px`) + 144.
- `.friction-section` 971 = `.friction-copy` con `padding: 12rem … 4rem` (256) + h2 de
  6 líneas + 4 tarjetas.

**Causa raíz compartida:** los titulares de display son enormes en móvil
(`clamp(3.15rem … 5.9rem)`, 5–6 líneas, 240–450px cada uno antes de cualquier
contenido), el `--section-pad` sigue siendo el de escritorio (`clamp(5rem, 9vw, 9rem)`
→ 80px arriba y abajo) y ninguna escala depende de la **altura** de la pantalla, solo
del ancho.

## Contrato de encaje (invariantes que el resultado debe cumplir)

1. **Una sección = una pantalla.** Para cada sección del home en `≤900px`:
   `section.offsetHeight <= window.innerHeight`.
2. **Por qué importa exactamente eso:** `components/section-curtain-stack.tsx:36`
   (`getPanelPinStart`) devuelve `"top top"` solo si
   `panel.offsetHeight <= window.innerHeight`; si no, ancla a `"bottom bottom"`. Y
   `getRelayEnd()` asume que el recorrido del relevo mide **una** altura de viewport
   (ver el comentario de `createRelayTimeline` sobre la cancelación del ascenso en
   entradas laterales). Con paneles más altos que la pantalla, ese supuesto se rompe y
   es la razón por la que "no se ve la sección entera".
3. **Nada recortado.** Preferir `min-height` a `height` y escalas
   `min(rem, vw, svh)`: en una pantalla muy corta la sección crece antes que cortar
   texto. Degradar, no amputar.
4. **Escritorio intacto.** Todo cambio vive dentro de `@media (max-width: 900px)` o
   `@media (max-width: 620px)`. Cero cambios en reglas base o `≥901px`.
5. **Accesibilidad.** No bajar el cuerpo de texto de `0.85rem` efectivos ni los
   objetivos táctiles de `44px`.

## Forbidden decisions

- **No** usar `transform: scale()` sobre secciones para "hacerlas caber": rompe los
  pins de ScrollTrigger (crea bloque contenedor) — es el mismo motivo que ya documenta
  `section-curtain-stack.tsx` al limpiar `transform` tras el relevo.
- **No** poner `overflow: auto`/scroll interno en las secciones: un scroll dentro de un
  panel pineado pelea con Lenis y con el relevo.
- **No** tocar `.plain-talk` / `.plain-talk-track` (200svh): es una pista con escena
  `sticky` de 100svh; su altura es distancia de scroll, no contenido, y ya cumple el
  contrato visual.
- **No** cambiar `height` por `min-height` en `.hero` ni tocar el vídeo fijo del hero.
- **No** editar `components/*.tsx` salvo que el encaje lo exija de verdad; este trabajo
  es de CSS.
- **No** borrar contenido (preguntas del FAQ, pasos del proceso, campos del
  formulario) para que quepa.

---

## Task 1: Tokens de encaje móvil

**Archivo:** `app/globals.css`, dentro de `@media (max-width: 900px)`, en el bloque
`:root` que ya existe (hoy solo fija `--header-height: 64px`).

Añadir:

- `--m-stage: 100svh` — presupuesto de una pantalla.
- `--m-stage-top: calc(var(--header-height) + 0.9rem)` — la cabecera es fija y tapa la
  parte de arriba; el contenido empieza por debajo.
- `--m-stage-bottom: 1.5rem`.
- `--section-pad: 1.5rem` — deja de usarse el `clamp(5rem, 9vw, 9rem)` de escritorio.
- Escala de titular y cuerpo dependientes **también de la altura**:
  - `--m-h2: min(2.6rem, 9vw, 5.6svh)`
  - `--m-h2-lh: 0.9`
  - `--m-lead: min(1.02rem, 4vw, 2.15svh)`
  - `--m-body: min(0.95rem, 3.8vw, 2svh)`

**Por qué `svh` y no `vh`:** en móvil `vh` incluye la barra de direcciones y provoca el
salto clásico al hacer scroll; `svh` es la altura pequeña estable, que es la misma
unidad que ya usan `.plain-talk-track` y el resto del archivo.

**Verificación:** `getComputedStyle(document.documentElement).getPropertyValue('--m-stage')`
resuelve a un valor en px ≈ `innerHeight` a 390×844.

## Task 2: Caja compartida de una pantalla

**Archivo:** `app/globals.css`, `@media (max-width: 900px)`.

Regla nueva para las seis secciones que desbordan (`.friction-section`,
`.mobile-flow-reveal`, `.services-section`, `.process-section`, `.faq-section`,
`.contact-section`):

- `min-height: var(--m-stage)` (no `height`: ver invariante 3).
- `display: grid` + `grid-template-rows: auto minmax(0, 1fr)` + `align-content: start`:
  el titular ocupa lo que necesita y el contenido se come el resto sin desbordar
  (`minmax(0, 1fr)` es lo que permite encogerse dentro de un grid).
- `padding: var(--m-stage-top) var(--page-pad) var(--m-stage-bottom)`.
- `gap` reducido a `min(1.5rem, 2.4svh)`.

Y una regla para los titulares de sección en móvil que unifique la escala:

```
.services-heading h2, .process-heading h2, .faq-heading h2,
.contact-copy h2, .mobile-flow-heading h2, .friction-copy h2 {
  font-size: var(--m-h2);
  line-height: var(--m-h2-lh);
  max-width: 14ch;   /* hoy 11ch → menos líneas con el mismo ancho */
}
```

**Ojo:** `.friction-section` y `.mobile-flow-reveal` tienen hoy `display: block` y
paddings propios más adelante en el mismo bloque; el orden en la cascada importa, así
que esta regla compartida debe ir **antes** de los ajustes por sección de la Task 3
para que estos puedan afinar sin pelearse.

**Verificación:** las seis secciones pasan de `>844` a `<=844` a 390×844 (aunque aún
con texto apretado; las Tasks 3–8 lo afinan).

## Task 3: `.friction-section` (desborda ~130)

- `min-height: var(--m-stage)` (quitar `clamp(760px, 100svh, 860px)`: el suelo de 760px
  es lo que la hace desbordar en pantallas cortas).
- `.friction-copy`: `padding: 12rem … 4rem` → `padding: var(--m-stage-top) var(--page-pad) var(--m-stage-bottom)`
  y `min-height: var(--m-stage)` (mismo motivo), manteniendo
  `justify-content: flex-end` (la copia sigue anclada abajo sobre la foto).
- `h2`: escala compartida, `margin-bottom: min(1.25rem, 2svh)`.
- `.friction-card`: `padding: 0.65rem 0.8rem`, `font-size: var(--m-body)`,
  `line-height: 1.28`, y `gap` de la pila a `min(0.5rem, 0.9svh)`.

**Presupuesto a 390×844:** titular 4 líneas ≈ 150 + 4 tarjetas ≈ 4×58 = 232 + enlace 40
+ paddings 96 ≈ **518**. Holgado.

## Task 4: `.mobile-flow-reveal` (desborda ~130 a 390, ~360 a 768)

- El `h2` es hoy `clamp(3.6rem, 15vw, 5.9rem)`: a 768px se va a 5.9rem y es lo que
  explica que **empeore al crecer el ancho**. Pasa a la escala compartida.
- `padding: clamp(4.5rem, 15vw, 7rem)` → tokens de escena.
- `.mobile-flow-heading`: `margin-bottom: min(1.25rem, 2svh)`.
- `.mobile-flow-frame`: `min-height: 520px` → `min-height: 0` + `height: 100%`
  (la fila `minmax(0, 1fr)` de la Task 2 ya le da el alto disponible) y
  `aspect-ratio` solo como tope: `max-height: 62svh`.

**Riesgo:** dentro del marco hay 9 hijos en `position: absolute` colocados en `%`, así
que se reescalan solos con el marco. Hay que comprobar en captura que las etiquetas
(`.mobile-flow-label`, `.mobile-flow-note`, `.mobile-flow-status`) no se solapan al
reducir el alto.

## Task 5: `.services-section` (desborda 2,1× — la más gorda)

Presupuesto a 390×844: útil ≈ 756. Hoy: 367 + 1198 + 160.

- Titular: escala compartida (367 → ~150 con el `p` a `var(--m-lead)` y 2 líneas).
- `.service-showcase`: `row-gap: 0`, y las filas pasan a un alto de contenido real:
  - `.service-row`: `padding: min(0.9rem, 1.5svh) 0`, `gap: 0.5rem`.
  - `.service-row-title`: `font-size: min(1.45rem, 5.4vw, 3svh)`.
  - `.service-row-description`: **solo visible en la fila activa**
    (`.service-row[data-active="false"] .service-row-description { display: none }`).
    El componente ya expone `data-active` (`components/service-showcase.tsx:152`) y ya
    mueve el panel de demo a la fila activa con `--active-panel-row`, así que esto es
    coherente con la interacción que ya existe, no una invención.
  - `.service-demo-panel`: `min-height: clamp(23rem, 68vw, 31rem)` → `min-height: 0`,
    `max-height: 34svh`, `margin: 0.5rem 0 0.9rem`.

**Presupuesto resultante:** titular 150 + fila activa (título 52 + descripción 54 +
demo 285) + 2 filas colapsadas ≈ 2×66 = 132 + paddings 96 ≈ **769**. Al filo: hay que
medir y, si no entra, bajar `max-height` del panel de demo a `30svh`.

**Nota de diseño:** esto además arregla un problema real de la versión actual — las tres
descripciones a la vez en móvil hacen que la fila activa y su demo queden fuera de
pantalla, que es justo lo que el usuario describe.

## Task 6: `.process-section` (desborda; y roto entre 621–900px)

**Primero, el hueco 621–900px.** Las reglas que devuelven el proceso a una columna
vertical (`.process-track { height: auto }`, `.process-stage { position: static }`,
`.process-steps` en grid) viven hoy en `@media (max-width: 620px)`
(`app/globals.css:3395` y siguientes). Pero `.desktop-scroll-story` se oculta ya en
900px y `SectionCurtainStack` considera móvil `(max-width: 900px)`. Resultado: entre 621
y 900px la pista sigue midiendo `300svh` → 3034px de sección.

**Acción:** mover ese grupo de reglas de `≤620px` a `≤900px` (el bloque de 620px se
queda solo con los afinados de tamaño: `.step-pin`, `.process-steps h3`, etc.).

Luego el encaje de los 4 pasos en una pantalla (útil ≈ 756, titular ~130 → 626 para 4
pasos = ~156 cada uno):

- `.process-steps`: `gap: 3.5rem` → `gap: min(1.5rem, 2.6svh)`.
- `.process-steps li`: `grid-template-columns: 2.5rem 1fr`, `gap: 0.75rem`.
- `.step-pin`: `3.25rem` → `2.5rem`, `border-width: 4px`, `font-size: 1rem`.
- `.process-steps h3`: `2.25rem` → `min(1.3rem, 5vw, 2.8svh)`, `max-width: 22ch`.
- `.process-steps p`: `font-size: var(--m-body)`, `line-height: 1.3`.
- `.process-step-answer`: `font-size: min(0.78rem, 3vw, 1.6svh)`.
- `.process-route-line-mobile`: ajustar `top`/`left` al nuevo pin de `2.5rem`
  (`calc(1.25rem - 7px)`), si no el cable queda descolocado.

**Cuidado con la animación:** `ProcessRoute` calcula `overflow()` con
`rail.scrollWidth - stage.clientWidth` y solo aplica el desplazamiento en X si
`(min-width: 901px)` (`components/process-route.tsx:52`). Al mover las reglas a 900px,
el límite CSS y el límite JS coinciden por fin en 900/901 — eso **arregla** una
incoherencia existente, no la introduce. El `onUpdate` que pinta el cable sigue
funcionando igual en vertical.

## Task 7: `.faq-section` (desborda ~280)

Útil ≈ 756. Hoy 370 + 542 + 48 + 160.

- Titular: escala compartida (370 → ~170 con el `p` a `var(--m-lead)`).
- `.faq-list details summary`: `padding` vertical a `min(0.8rem, 1.4svh)`,
  `font-size: var(--m-body)`.
- El contenido abierto de un `details` se sale del presupuesto por definición: con 5
  preguntas cerradas caben; al abrir una, la sección debe poder crecer. Por eso
  `min-height` y no `height` (invariante 3). Comprobar que al abrir la más larga el
  relevo sigue teniendo sentido (ScrollTrigger necesita un `refresh`; ver Task 9).

**Presupuesto:** 170 + 5×70 = 350 + gap 24 + paddings 96 ≈ **640**. Entra.

## Task 8: `.contact-section` (desborda ~575)

Útil ≈ 756. Hoy copia 477 + formulario 735 + gap 48 + 160.

- `.contact-copy h2`: escala compartida (hay un override propio en el bloque de 620px,
  `app/globals.css:3312`, que también hay que bajar).
- `.contact-copy p`: `var(--m-lead)`, `max-width: 34ch`.
- `.contact-form`: `padding` a `min(1.1rem, 2svh) 1.1rem`, y campos:
  - etiquetas a `min(0.9rem, 3.5vw, 1.9svh)`
  - `input` altura a `min(2.75rem, 5.4svh)` pero **nunca por debajo de 44px** de
    objetivo táctil (invariante 5) → `min-height: 44px` explícito.
  - `textarea`: `rows` efectivos a `min(5.5rem, 11svh)`.
  - checkbox + botón: `gap` a `min(0.75rem, 1.4svh)`.

**Presupuesto:** copia 180 + formulario (4 campos × 74 = 296 + textarea 92 + checkbox 52
+ botón 52 + paddings 36 = 528) + gap 24 + paddings 96 ≈ **828**. **No entra a 844.**

**Decisión:** el formulario de contacto es el único bloque donde "una pantalla" pelea
con la usabilidad real (5 campos + consentimiento + botón). Dos opciones, por orden de
preferencia:

- **(a)** Agrupar nombre y empresa en `.form-pair` a dos columnas también en móvil
  (hoy el bloque de 620px lo pasa a una sola columna,
  `app/globals.css:3445`): ahorra ~74px y baja a ~754. Entra, y es el cambio más
  pequeño.
- **(b)** Si (a) aprieta demasiado a 360px, dejar que `.contact-section` sea la única
  sección con `min-height: var(--m-stage)` pero altura real algo mayor, y documentarlo:
  es la última sección antes del footer, así que su relevo no tapa información de otra.

Elegir (a) y medir; caer a (b) solo con la medición delante.

## Task 9: Coherencia con el relevo de cortina

No hay que reescribir `SectionCurtainStack`, pero sí comprobar dos cosas:

1. Que con las secciones ya encajadas, **todos** los paneles anclan en `"top top"`
   (invariante 2). Comprobable en el navegador:
   `[...document.querySelectorAll('.section-curtain-panel')].map(p => p.offsetHeight <= innerHeight)`
   → todo `true`.
2. Que un `details` del FAQ al abrirse dispara `ScrollTrigger.refresh()`. Hoy nada lo
   hace. Si la medición muestra que el pin se descoloca al abrir una pregunta, añadir
   en `app/page.tsx` (o en un componente cliente pequeño) un `onToggle` que llame a
   `ScrollTrigger.refresh()`. **Solo si la medición lo justifica** — no añadir JS
   especulativo.

## Task 10: Verificación

1. `npm run lint`
2. `npm run build`
3. Medición en navegador, con `prefers-reduced-motion: reduce` para aplanar el
   documento, a `360×844`, `390×844`, `430×844`, `640×844`, `768×844` y `375×667`:
   - toda sección `<= innerHeight`
   - ninguna caja de contenido con `scrollHeight > clientHeight + 2`
4. Medición **con** animación (sin reduced-motion) a 390×844: todos los paneles
   anclan en `"top top"`.
5. Capturas a 390×844 de las seis secciones.
6. **Regresión de escritorio** a 1440×900: alturas de sección idénticas a las medidas
   antes de empezar (tabla de "Estado actual" ampliada con la columna 1440).


---

## Resultado de la verificación (ejecutada)

### Comandos

- `npm run lint` → **0 errores**, 1 aviso preexistente (`readHeaderHeight` sin usar en
  `section-curtain-stack.tsx`, anterior a este trabajo).
- `npm run build` → **compila** (10,7s) y genera las 12 páginas estáticas.

### Encaje por viewport (sección más alta que la pantalla)

Medido con el documento plano (`prefers-reduced-motion: reduce`) y confirmado con la
animación activa.

| Viewport | Antes | Después |
|---|---|---|
| 360×844 | 6 secciones desbordadas | **OK** |
| 390×844 | 6 secciones desbordadas | **OK** |
| 430×844 | 6 secciones desbordadas | **OK** |
| 414×896 | desbordadas | **OK** |
| 412×915 | desbordadas | **OK** |
| 640×844 | desbordadas (proceso +2180) | **OK** |
| 768×844 | desbordadas (proceso +2190) | **OK** |
| 900×844 | desbordadas | **OK** |
| 390×780 | desbordadas | **OK** |
| 375×667 (iPhone SE) | servicios +734, contacto +269, proceso +352 | **OK** |
| 360×640 | desbordadas | servicios **+8**, proceso **+2** |

`.plain-talk` sigue midiendo 200svh a propósito: es una pista de scroll con escena
`sticky` de 100svh, así que lo que se ve es una pantalla. `.hero` encaja en todos los
tamaños.

Altura total del documento a 390×844: **10.774px → 7.991px** (−26%), sin quitar ninguna
sección.

### Relevo de cortina

Con la animación activa a 390×844, todos los paneles cumplen
`panel.offsetHeight <= window.innerHeight` y por tanto anclan en `"top top"`
(invariante 2). El único que no es `plain-talk`, por diseño.

### Recortes de contenido

Ningún elemento con `overflow: hidden/clip` recorta su contenido en 375×667 ni en
390×844. Los que aparecen en la auditoría son intencionados: `.reveal-line-mask` (cada
máscara sujeta una línea que entra deslizándose), `.sr-only`, `.honeypot` y
`.roll-label`.

FAQ: con una pregunta abierta la sección **sigue midiendo una pantalla exacta** (844 /
667) — el aire que se le devolvió al área de toque la absorbe. Abrir varias la hace
crecer, y para eso se añadió el `refresh` de la Task 9.

### Áreas de toque

| Elemento | Antes | Después |
|---|---|---|
| `.faq-list summary` | ~54px | **72px** (390×844) / 61px (375×667) |
| `.friction-copy > a` | 22px | **44px** |
| `input`, `textarea` | — | `min-height: 44px` explícito |
| `.form-submit` | 60px | 52px (48px en móvil corto) |

### Regresión de escritorio

Idéntica al punto de partida, hasta el píxel:

| | 1440×900 antes | 1440×900 después |
|---|---|---|
| documento | 12712 | **12712** |
| `.hero` | 792 | **792** |
| `.plain-talk` | 2115 | **2115** |
| `.friction-section` | 2340 | **2340** |
| `.services-section` | 1356 | **1356** |
| `.desktop-scroll-story` | 900 | **900** |
| `.process-section` | 3334 | **3334** |
| `.faq-section` | 741 | **741** |
| `.contact-section` | 920 | **920** |

Comprobado también a 1280×800 y 1024×768 (sin cambios), y que /productos,
/aviso-legal y /politica-de-privacidad no se ven afectadas.

### Lo que queda fuera

- **360×640**: servicios se pasa 8px y proceso 2px. Por debajo de cualquier teléfono en
  circulación (el más pequeño en uso es 375×667, que encaja). Se prefirió dejar que la
  sección crezca esos píxeles antes que recortar texto o quitar contenido
  (invariante 3).
- **Dentro de la maqueta ilustrativa** de servicios se retira en móvil la línea de
  apoyo (`.demo-browser-after p`) y, en móvil corto, la última línea del estado
  "antes". Vive dentro de un `role="img"` con `aria-label` propio, así que no se
  exponía a lectores de pantalla: su función es decorativa. Es el único contenido que
  desaparece, y solo dentro de la ilustración.
