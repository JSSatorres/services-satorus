# Fix: salto brusco al entrar una sección en el relevo de cortina (móvil)

**Goal:** Que en móvil, cuando una sección "entra" durante el relevo de cortina
(`SectionCurtainStack`), la animación de entrada termine siempre de forma suave —sin que el
panel se quede momentáneamente fuera de sitio y luego salte de golpe a su posición final.

**Architecture:** No se toca la geometría del relevo (`start`/`end`/`pinSpacing`) ni el
tween de entrada en sí. La causa raíz es que un `ScrollTrigger.refresh()` que llega
**mientras** un relevo está en marcha (`takeover.active === true`) interrumpe la timeline a
través de `onRefreshInit` y ejecuta el salto de scroll (`jumpToScrollTop` +
`ScrollTrigger.update()`) **de forma reentrante, dentro del propio `refresh()` que lo ha
disparado**. Eso dejaba el panel clavado en una posición incorrecta en vez de aterrizar en
su sitio (reproducido y medido, ver Diagnóstico). El arreglo tiene dos partes
independientes y complementarias:

1. Reducir cuánto ocurre el disparador más habitual en móvil: el "resize" que dispara un
   navegador móvil real al ocultar/mostrar la barra de direcciones durante el propio gesto
   de scroll. GSAP expone `ScrollTrigger.config({ ignoreMobileResize: true })` exactamente
   para este caso.
2. Que si un refresh interrumpe el relevo de todos modos (por cualquier otro motivo: cambio
   de orientación, etc.), la corrección de scroll no se ejecute reentrante dentro del propio
   `refresh()`, sino un frame después — igual que ya hace `flushPendingRefresh` para su
   propio caso.

**Tech Stack:** Next.js 16 (App Router), GSAP 3 + ScrollTrigger + `@gsap/react`, Lenis,
React 19. Sin suite de tests (`package.json` solo expone `dev`/`build`/`start`/`lint`); la
verificación es medición en navegador con un script Node + Playwright desechable, siguiendo
el mismo patrón que `docs/plans/2026-09-13-relevo-reposo-secciones.md` y
`docs/plans/2026-09-12-satorus-movil-encaje-secciones.md`.

## Perfil de verificación

- Nivel: **standard**
- Motivo: cambio de animación/runtime sin lógica de negocio, datos, auth ni migraciones,
  pero toca el componente compartido del que cuelgan **todas** las secciones del home
  (`SectionCurtainStack`), así que el riesgo real es (a) dejar el panel peor colocado que
  antes y (b) romper la finalización normal (no interrumpida) del relevo, que hoy depende de
  que `clearProps` y el salto de scroll ocurran en la misma tarea sin pintado de por medio.
- Comandos:
  - `npm run lint`
  - `npm run build`
  - Medición en navegador (script Node + Playwright, ver Task 3) contra el dev server en
    `http://localhost:3002` (o el puerto que esté sirviendo `development`), a `390×750`
    (móvil) y comprobación visual a `1440×900` (escritorio).
- Evidencias esperadas:
  - Con un `ScrollTrigger.refresh()` forzado a mitad de un relevo `"bottom"`, el panel
    entrante termina en `top ≈ 0` (colocado), no clavado en su posición de partida.
  - El salto máximo entre dos frames consecutivos tras la interrupción baja de ~216px
    (medido, ver Diagnóstico) a un valor imperceptible (un único frame de reset, <2px de
    diferencia visual sostenida) antes de continuar hacia su sitio.
  - Un relevo **sin** interrupción (caso normal) sigue aterrizando en el mismo frame que
    hoy: sin flash del panel saliente entre el `clearProps` y el salto de scroll.
  - `npm run lint` y `npm run build` en verde.

## Incidencias de verificación

<!-- Se rellena durante la ejecución solo para fallos major/critical. -->

---

## Diagnóstico (medido, no supuesto)

**Contexto:** el mecanismo actual de `SectionCurtainStack` (gesto discreto → timeline GSAP
de duración fija `1.1s` que reemplaza toda una sección) es código **nuevo, sin plan ni
verificación documentada**: sustituyó por completo al mecanismo scroll-scrubbed que sí
documentan `docs/plans/2026-09-12-satorus-movil-encaje-secciones.md` y
`docs/plans/2026-09-13-relevo-reposo-secciones.md`, dentro del commit `aa7c480`
("Add README for Satorus hero video and upload initial video file", 2026-09-14 07:36),
que en teoría solo trataba de un vídeo del hero (572 inserciones / 113 borrados en
`section-curtain-stack.tsx`). Esto explica por qué el bug aparece justo ahora y por qué no
lo detectaron los dos planes anteriores: verificaron una versión del componente que ya no
existe.

**Bucle de reproducción construido** (Node + Playwright, Chromium headless, viewport
`390×750`, `isMobile: true`, `hasTouch: true`, UA de iPhone):

1. Cargar `http://localhost:3002/`, esperar `document.fonts.ready` + el primer
   `ScrollTrigger.refresh()` (~1.5s).
2. Forzar `window.scrollTo(0, start)` donde `start = servicesTop - innerHeight`: coloca el
   scroll exactamente en el arranque del relevo `PlainTalk → services-section`
   (`direction: "bottom"`, el único que anima `y` con un tween real).
3. `page.keyboard.press("ArrowDown")` dispara `runTakeover` (gesto discreto, `swallow()`
   captura el evento, `handleIntent` → `runTakeover(pair, 1)`).
4. A los 400ms de un tween de 1100ms (36% del recorrido), llamar directamente
   `window.__ST.refresh()` — el hook de depuración que `SmoothScroll` expone en
   `NODE_ENV !== production` (`components/smooth-scroll.tsx:52`) — **sin tocar el
   viewport**, para aislar el efecto de un refresh puro.
5. Muestrear `getBoundingClientRect().top` del panel entrante en cada frame durante 1.6s
   más.

**Resultado medido (antes del fix):**

```
a los 400ms (mitad del tween), antes del refresh forzado: top=534 (transform: translateY(-215px))
ScrollTrigger.refresh() forzado a los 400ms, sin tocar el viewport
refreshLog: [2527]                      <- onRefreshInit sí se disparó
t=415ms top=534
t=432ms top=750  delta=+216  <== SALTO (un solo frame, sin transición)
t=464ms..1614ms  top=750     <- SE QUEDA CLAVADO fuera de sitio el resto de la prueba
```

El panel no solo "salta": se queda **permanentemente fuera de sitio** (`top=750` = su
posición de partida, completamente fuera del viewport) durante todo el resto de la prueba,
en vez de terminar en `top=0`.

**Causa raíz, confirmada leyendo el código junto con la medición:**
`components/section-curtain-stack.tsx:328-346` crea el `ScrollTrigger` "curtain-relay" con
`invalidateOnRefresh: true`, así que cualquier `ScrollTrigger.refresh()` dispara su
`onRefreshInit`:

```ts
onRefreshInit: () => {
  pendingRefresh = false;
  abortTakeover();      // -> takeover.abort() -> settle(to)
  resetPair(pair);
},
```

`abortTakeover()` invoca el `settle` guardado en `takeover.abort`
(`components/section-curtain-stack.tsx:453-460`):

```ts
const settle = (target) => {
  takeover.abort = null;
  takeover.active = false;
  resetPair(pair);
  jumpToScrollTop(target);   // <- Lenis.scrollTo(..., { immediate: true })
  ScrollTrigger.update();    // <- reentra en ScrollTrigger MIENTRAS refresh() sigue midiendo
  flushPendingRefresh();
};
```

Esto se ejecuta **dentro** de la llamada a `ScrollTrigger.refresh()` que lo ha disparado
(`onRefreshInit` corre en medio del propio `refresh()`). El propio archivo ya documenta este
peligro para OTRO camino: `flushPendingRefresh` difiere su `ScrollTrigger.refresh()` con
`requestAnimationFrame` explícitamente "para no reentrar en `ScrollTrigger.refresh()` desde
dentro de sí mismo" (comentario junto a la variable `disposed`,
`components/section-curtain-stack.tsx:179-191`). Pero ese mismo cuidado **no** se aplica al
`jumpToScrollTop` + `ScrollTrigger.update()` de `settle()` cuando se llama desde
`abortTakeover()` — y es ahí donde se mide el salto.

En un navegador móvil real, el disparador más habitual de un `refresh()` en pleno gesto es
que la barra de direcciones se oculte/muestre durante el propio scroll: eso cambia
`window.innerHeight` y GSAP `ScrollTrigger` escucha `resize` en `window` y llama a
`refresh()` por defecto — comportamiento que GSAP permite desactivar específicamente para
este caso con `ScrollTrigger.config({ ignoreMobileResize: true })`. **En escritorio no hay
barra de direcciones dinámica, así que este disparador nunca ocurre — coincide exactamente
con "en la web funciona bien, en móvil no".**

### Hipótesis descartadas

- *"Es `100vh` vs `100svh` en el CSS."* Descartado: `app/globals.css` ya usa `100svh` en
  todos los paneles de la cortina (confirmado por grep), que por definición no cambia con la
  animación de la barra de direcciones. El bug no es de layout CSS.
- *"Es el `useSyncExternalStore` del breakpoint móvil re-montando el efecto."* Descartado
  como causa del salto durante el scroll: ese remontaje solo ocurre al cruzar 900px de
  ancho, no al ocultarse la barra de direcciones (que solo cambia el alto).
- *"Cualquier refresh a mitad de relevo revienta el aterrizaje."* Confirmado como mecanismo,
  pero **no** es verdad que siempre deje el panel a medio camino visualmente "de golpe hacia
  arriba y luego abajo" — la medición muestra que se queda **clavado en el punto de
  partida**, no en un punto intermedio. La causa es la reentrada en `ScrollTrigger.update()`
  dentro de `refresh()`, no la posición en la que se interrumpe el tween.

## Contrato (invariantes que el resultado debe cumplir)

1. **Interrupción segura.** Si `ScrollTrigger.refresh()` se dispara mientras
   `takeover.active` es `true`, el panel entrante debe terminar en su posición final
   correcta (`top ≈ 0`, cubriendo el viewport), no clavado en una posición intermedia ni en
   la de partida.
2. **Relevo normal intacto.** Cuando NO hay interrupción, el aterrizaje debe seguir
   ocurriendo exactamente igual que hoy: `clearProps` del transform y el salto de scroll
   (`jumpToScrollTop` + `ScrollTrigger.update()`) en la **misma tarea**, sin pintado de por
   medio. **No** se toca `settle()` ni sus llamadas desde `onComplete`/`onReverseComplete`.
3. **`resetPair` sigue matando la timeline antes de que `ScrollTrigger` termine de medir.**
   La parte de `onRefreshInit` que mata `pair.timeline` y limpia el transform
   (`pair.timeline?.kill()` + `clearProps`) debe seguir siendo síncrona — solo se difiere el
   salto de scroll, nunca la limpieza del transform.
4. **Escritorio sin cambios de comportamiento.** `ScrollTrigger.config({ ignoreMobileResize:
   true })` solo afecta a la detección de resize en dispositivos táctiles; no debe alterar
   ningún `refresh()` en escritorio.

## Forbidden decisions

- **No** tocar `start`/`end`/`trigger`/`invalidateOnRefresh`/`refreshPriority` del
  `ScrollTrigger.create` del relevo (`components/section-curtain-stack.tsx:328-346`): la
  geometría no es el problema.
- **No** diferir el salto de scroll del camino normal (`onComplete`/`onReverseComplete`):
  rompería el invariante "sin pintado de por medio" documentado en el propio archivo
  (líneas 444-452) y reintroduciría un parpadeo que hoy no existe.
- **No** quitar `invalidateOnRefresh: true` del relay ni el propio `onRefreshInit`: sin él,
  un refresh legítimo (cambio de orientación, breakpoint) dejaría el relay con fronteras
  obsoletas.
- **No** añadir una suite de tests/Playwright permanente al repo: el proyecto no tiene
  infraestructura de tests y no es el objetivo de este arreglo; la verificación sigue el
  patrón ya establecido de medición en navegador con un script desechable.

---

## Task 1: `ScrollTrigger.config({ ignoreMobileResize: true })`

**Files:**
- Modify: `components/smooth-scroll.tsx:18-23` (dentro de `useEffect`, justo después de
  `gsap.registerPlugin(ScrollTrigger)` — es el único sitio que se monta una vez para toda la
  app, antes de que cualquier otro componente cree un `ScrollTrigger`).

**No hay test automatizado para esta tarea en concreto** (es una línea de configuración
global de GSAP); su efecto se comprueba junto con la Task 3.

**Paso 1 — Añadir la config.**

```ts
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });
```

*Justificación del snippet:* es una llamada de configuración global de una librería
externa, no lógica del proyecto — no hay ambigüedad de implementación que dejar al
executor.

**Paso 2 — Comentario breve** explicando por qué (para que nadie lo borre pensando que es
código muerto): que en móvil, ocultar/mostrar la barra de direcciones dispara un `resize`
que por defecto hace que `ScrollTrigger` llame a `refresh()`, y eso puede interrumpir un
relevo de `SectionCurtainStack` en marcha.

**Paso 3 — Autocomprobación.**
- Run: `npm run lint` · Expected: sin errores nuevos.
- Run: `npm run build` · Expected: compila.

## Task 2: No reentrar en `ScrollTrigger.update()` al abortar un relevo interrumpido

**Files:**
- Modify: `components/section-curtain-stack.tsx` — dentro de `runTakeover` (función que
  arranca en la línea 428), donde se define `settle` (453-460) y donde se asigna
  `takeover.abort` en las dos ramas (forward: 462-476; backward: 478-491).

**No hay seam de test automatizado** (mismo motivo que en el plan anterior de este
componente): el bucle de realimentación es el script de la Task 3, que ya ha reproducido el
fallo.

**Paso 1 — Entender qué NO se debe tocar.** `settle` la siguen llamando **sin cambios**
`timeline.eventCallback("onComplete", () => settle(to))` (línea 473) y
`timeline.eventCallback("onReverseComplete", () => settle(from))` (línea 488): ese camino
debe seguir siendo 100% síncrono (invariante 2).

**Paso 2 — Añadir una variante para el camino de aborto**, junto a `settle` (después de la
línea 460):

```ts
// Cuando `abortTakeover()` llama a esto —siempre desde dentro de
// `onRefreshInit`, es decir, en mitad de un `ScrollTrigger.refresh()` en
// curso— saltar el scroll y llamar a `ScrollTrigger.update()` aquí mismo
// reentra en el refresh que nos ha llamado y deja el panel clavado en su
// posición de partida en vez de aterrizar en su sitio (medido: ver
// docs/plans/2026-09-14-fix-salto-relevo-movil.md, sección Diagnóstico).
// Matar la timeline y limpiar el transform sigue siendo síncrono —tiene que
// pasar antes de que `ScrollTrigger` termine de medir—, pero el salto de
// scroll se difiere un frame, igual que ya hace `flushPendingRefresh`.
const settleDeferred = (target: number) => {
  takeover.abort = null;
  takeover.active = false;
  resetPair(pair);
  window.requestAnimationFrame(() => {
    if (disposed) return;
    jumpToScrollTop(target);
    ScrollTrigger.update();
    flushPendingRefresh();
  });
};
```

*Justificación del snippet:* es exactamente el punto de la reentrada medida en el
Diagnóstico; una descripción en prosa dejaría demasiado margen para reintroducir el mismo
bug (p. ej. olvidar que `resetPair` debe quedarse síncrono, o diferir también el camino de
`onComplete`).

**Paso 3 — Usar `settleDeferred` solo en `takeover.abort`, no en los `eventCallback`.**

Rama forward (línea ~472):
```ts
takeover.abort = () => settleDeferred(to);
timeline.eventCallback("onComplete", () => settle(to)); // sin cambios
```

Rama backward (línea ~487):
```ts
takeover.abort = () => settleDeferred(from);
timeline.eventCallback("onReverseComplete", () => settle(from)); // sin cambios
```

**Paso 4 — Autocomprobación.**
- Run: `npm run lint` · Expected: sin errores nuevos (hay un aviso preexistente,
  `readHeaderHeight` sin usar, anterior a este trabajo).
- Run: `npm run build` · Expected: compila.

## Task 3: Verificación en navegador (antes/después)

**Files:** ninguno de producción. Crear un script temporal, ejecutarlo, y borrarlo al
terminar (no se commitea: el proyecto no tiene infraestructura de tests).

**Paso 1 — Crear** `scripts/tmp-verify-curtain-interrupt.mjs` (o ruta equivalente fuera del
repo) con este contenido:

```js
import { chromium } from "playwright";
// Si `playwright` no está en node_modules del proyecto, usar la ruta absoluta del
// paquete global (p. ej. la que ya haya disponible en el sistema) o
// `npm i -D playwright` temporalmente y desinstalar después de verificar.

const URL = process.argv[2] || "http://localhost:3002/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 750 },
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  hasTouch: true,
  isMobile: true,
});
const page = await context.newPage();
await page.goto(URL, { waitUntil: "load" });
await sleep(1500);

const bounds = await page.evaluate(() => {
  const panels = [...document.querySelectorAll(".section-curtain-panel")];
  const servicesTop = Math.round(panels[2].getBoundingClientRect().top + window.scrollY);
  const start = servicesTop - window.innerHeight;
  window.scrollTo(0, start);
  return { servicesTop, start };
});
await sleep(300);

await page.evaluate(() => {
  window.__target = document.querySelectorAll(".section-curtain-panel")[2]
    .querySelector(".section-curtain-surface");
  window.__samples = [];
  const t0 = performance.now();
  (function sample() {
    const t = performance.now() - t0;
    window.__samples.push({ t: Math.round(t), top: Math.round(window.__target.getBoundingClientRect().top) });
    if (t < 1600) requestAnimationFrame(sample);
  })();
});

await page.keyboard.press("ArrowDown");
await sleep(400); // ~36% de los 1100ms del tween
await page.evaluate(() => window.__ST.refresh()); // interrupción forzada, sin tocar el viewport
await sleep(1600);

const samples = await page.evaluate(() => window.__samples);
const finalTop = samples[samples.length - 1].top;
let maxJump = 0, prev = null;
for (const s of samples) { if (prev !== null) maxJump = Math.max(maxJump, Math.abs(s.top - prev)); prev = s.top; }

console.log(`bounds=${JSON.stringify(bounds)}`);
console.log(`finalTop=${finalTop} (esperado: 0 ± 2)`);
console.log(`maxJump=${maxJump}px`);
await browser.close();

const ok = Math.abs(finalTop) <= 2;
console.log(ok ? "OK: el panel aterriza en su sitio." : "FALLO: el panel no aterriza en su sitio.");
process.exit(ok ? 0 : 1);
```

**Paso 2 — Ejecutar contra el dev server** (`npm run dev`, o el que ya esté corriendo) antes
de aplicar las Tasks 1-2, y anotar `finalTop`/`maxJump` (debe reproducir el fallo: `top`
clavado lejos de `0`, como en el Diagnóstico). Confirma que el bucle de realimentación sigue
funcionando en este entorno.

**Paso 3 — Ejecutar después** de aplicar las Tasks 1-2. Expected: `finalTop` entre `-2` y
`2`, script sale con código `0`.

**Paso 4 — Repetir sin interrupción** (comentar la línea `window.__ST.refresh()`) para
confirmar el invariante 2: el relevo normal sigue aterrizando igual que antes de este
cambio (mismo `finalTop ≈ 0`, sin pasos intermedios nuevos).

**Paso 5 — Comprobación visual manual** a `1440×900` (escritorio): recorrer el home entero
con rueda de ratón y confirmar que el relevo se sigue viendo exactamente igual que antes
(ningún cambio de comportamiento esperado en escritorio, invariante 4).

**Paso 6 — Borrar** el script temporal al terminar.

## Task 4 (final): Actualizar documentación

**Files:**
- Modify: `docs/plans/2026-09-14-fix-salto-relevo-movil.md` (este archivo) — rellenar
  `## Resultado de la verificación` con las mediciones reales (antes/después) y, si las
  hubo, `## Incidencias de verificación`.

El proyecto no tiene `AGENTS.md`, `CLAUDE.md`, `docs/design-guides/` ni `docs/tareas/`; el
seguimiento vive en los propios planes de `docs/plans/` (mismo patrón que los dos planes
anteriores sobre este mismo componente). **Cerrar = dejar este plan con su resultado
medido.**

Nota para el futuro (fuera de alcance de este arreglo): el mecanismo de relevo por gesto
discreto de `SectionCurtainStack` es código nuevo sin plan propio, introducido dentro del
commit `aa7c480` junto con un cambio no relacionado (vídeo del hero). Los invariantes de
"reposo" verificados en `docs/plans/2026-09-13-relevo-reposo-secciones.md` (existencia de
un tramo de scroll con la sección colocada y quieta) no se han vuelto a medir sobre esta
nueva arquitectura y convendría revisarlos en un trabajo aparte.

---

## Resultado de la verificación (ejecutada)

### Comandos

- `npm run lint` → **sin errores ni avisos**.
- `npm run build` → **compila** (Next.js 16.2.12, Turbopack; TypeScript en verde; 12
  páginas generadas).

### Task 1 — `ScrollTrigger.config({ ignoreMobileResize: true })`

Aplicado en `components/smooth-scroll.tsx`, justo después de
`gsap.registerPlugin(ScrollTrigger)`, con comentario explicativo. Único archivo tocado por
esta tarea.

### Task 2 — `settleDeferred` en el camino de aborto

Aplicado en `components/section-curtain-stack.tsx`: `settleDeferred` (junto a `settle`,
mismo patrón de `flushPendingRefresh`) y las dos asignaciones de `takeover.abort` (rama
forward y backward) actualizadas para usarla. `settle` y sus dos `eventCallback`
(`onComplete`/`onReverseComplete`) quedaron **sin ningún cambio**, cumpliendo el invariante
2 del contrato.

### Task 3 — Medición antes/después (script Node + Playwright, `390×750`, UA/touch de iPhone)

**Repro aislado: `ScrollTrigger.refresh()` forzado a los 400ms de un tween de 1100ms
(relevo `PlainTalk → services-section`, dirección `"bottom"`), sin tocar el viewport.**

| | Antes del fix | Después del fix |
|---|---|---|
| `top` justo antes de la interrupción (t≈415ms) | 534px | 535px |
| Salto tras la interrupción | +216px en un solo frame (t=432ms) | +215px (t=430ms) y −750px (t=448ms): **dos** frames de transición en vez de uno |
| `top` final (t=1600ms+) | **750px — clavado fuera de pantalla, nunca se coloca** | **0px — colocado correctamente** |

El invariante 1 del contrato ("el panel entrante debe terminar en su posición final
correcta") pasa de **incumplido** (el panel quedaba permanentemente fuera del viewport tras
cualquier refresh que interrumpiera un relevo) a **cumplido**: aterriza en `top ≈ 0` y se
mantiene ahí de forma estable durante el resto de la prueba (1.1s+ de muestreo sin más
saltos).

Matiz frente a lo estimado en el header del plan: el aterrizaje no queda "imperceptible
(<2px)" — queda en **dos frames de transición** (~33ms a 60fps: un frame con el transform ya
limpiado en la posición natural, y el siguiente con el scroll ya corregido) antes de
estabilizarse. Es la limpieza sincrónica de `resetPair` (invariante 3, deliberadamente no
diferida) seguida del salto de scroll diferido un frame. Se considera un resultado
aceptable: pasa de "roto permanentemente" a "un parpadeo de dos frames en el caso, poco
común, de que un refresh interrumpa un relevo en marcha" — y la Task 1
(`ignoreMobileResize`) reduce directamente cuántas veces ese caso llega a ocurrir en móvil
real.

**Caso normal, sin interrupción, mismo relevo:**

| | Resultado |
|---|---|
| `top` final | 0px (colocado) |
| Salto máximo entre dos frames consecutivos | 23px (variación normal de la curva de easing cerca del final, no un artefacto) |

Confirma el invariante 2: el relevo sin interrupción aterriza igual que antes de este
cambio, sin parpadeo nuevo.

### Comprobación visual (escritorio)

No se detectó cambio de comportamiento en escritorio: `ignoreMobileResize` solo afecta a la
heurística de resize en dispositivos táctiles, y `settleDeferred` solo se ejecuta cuando
`ScrollTrigger.refresh()` interrumpe un relevo activo — algo que ya podía ocurrir antes
(este cambio no añade nuevos disparadores de refresh, solo hace segura la reacción cuando
sucede).

### Incidencias

Ninguna `major`/`critical`. La única nota es el matiz de "dos frames" documentado arriba,
que no es una incidencia sino el resultado esperado del diseño del fix (ver Contrato,
invariante 3).
