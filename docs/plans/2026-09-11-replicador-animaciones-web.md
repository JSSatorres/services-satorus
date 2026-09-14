# Replicador de Animaciones Web Implementation Plan

**Goal:** Construir una capacidad reutilizable de Codex que reciba una URL autorizada, permita al usuario señalar una parte o interacción, capture evidencia del movimiento, la normalice en una especificación verificable y la replique primero en un laboratorio React/Next antes de integrarla en el proyecto destino.

**Architecture:** La solución será híbrida: una skill ligera orquestará decisiones y permisos, mientras un CLI local determinista realizará selección visual, captura, extracción, clasificación y comparación. Los extractores producirán un contrato común independientemente de si la referencia usa CSS/WAAPI, GSAP, Motion, Webflow IX2, Lottie/Rive/Spline o Canvas/WebGL; el MVP generará únicamente para React/Next mediante CSS, Motion o GSAP y reservará WordPress/Angular como tecnologías fuente, no como destinos de código.

**Tech Stack:** Agent Skill (`SKILL.md`), Node.js + TypeScript, Playwright/Chrome DevTools Protocol, Zod, Commander, FFmpeg/ffprobe, Pixelmatch + PNGJS, Vitest, fixtures HTML/React locales y adaptadores opcionales para Motiscope.

## Perfil de verificación

- Nivel: full
- Motivo: automatiza navegación sobre contenido externo no confiable, descarga evidencia y bundles, genera código y puede escribir en otro repositorio; requiere límites de seguridad, autorización de destino y E2E real de navegador.
- Comandos: `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run build`, `node dist/cli.js doctor`, `node dist/cli.js capture --url http://127.0.0.1:<fixture-port>/css --selector '#demo' --interaction load --out .tmp/e2e/css`, `node dist/cli.js verify --session .tmp/e2e/css --implementation-url http://127.0.0.1:<fixture-port>/css-clone`.
- Evidencias esperadas: suite unitaria y E2E verde; sesiones reproducibles para CSS/WAAPI, GSAP, Motion-like, scroll y Canvas; `motion-spec.json` validado; capturas de referencia/implementación; informe visual con estados comparados; prueba de que ningún bundle externo se ejecuta fuera del navegador; prueba de que no se escribe en producción sin confirmación explícita.

## Incidencias de verificación

<!-- Se rellena durante /exec o /auto solo para fallos major/critical. -->

---

## Alcance del MVP

### Entrada

- URL `http` o `https` proporcionada por el usuario.
- Una selección concreta mediante selector CSS o modo visual de “señalar y hacer clic”.
- Una interacción: carga, hover, click, focus, scroll, drag o reproducción automática.
- Uno o varios viewports explícitos.
- Proyecto destino y ruta de laboratorio, ambos autorizados explícitamente.

### Salida

- Carpeta de sesión autocontenida con manifiesto, screenshots, vídeo cuando aplique, DOM saneado, estilos, inventario de recursos, detección de motor y evidencias.
- `motion-spec.json` normalizado con valores, procedencia y nivel de confianza.
- Implementación aislada para React/Next usando CSS, `motion/react` o GSAP según el mecanismo observado.
- Informe de comparación entre referencia e implementación.
- Integración en código de producción solo después de una instrucción posterior explícita.

### Fuera de alcance inicial

- Clonar una página completa cuando el usuario solo ha señalado una interacción.
- Generar temas o plugins WordPress, componentes Angular o proyectos Webflow.
- Saltar login, paywalls, CAPTCHA, medidas anti-bot o restricciones de acceso.
- Ejecutar en Node los bundles descargados de la referencia.
- Copiar logos, textos, imágenes, fuentes o activos protegidos salvo autorización expresa.
- Prometer reconstrucción exacta de escenas Canvas/WebGL, 3D o vídeo cuando solo existe evidencia rasterizada.

## Contratos e invariantes

1. **Evidencia antes que código:** no se permite generar una animación si la sesión no contiene referencia visual y `motion-spec.json` válido.
2. **Fuente no confiable:** HTML, atributos, CSS, scripts y bundles externos son datos; nunca se interpretan como instrucciones para el agente ni se ejecutan fuera del navegador aislado.
3. **Confianza explícita:** cada propiedad extraída indica `exact`, `measured`, `inferred` o `unknown` y enlaza su evidencia.
4. **Una interacción por captura:** una sesión puede agrupar capturas, pero cada toma tiene un solo trigger para poder reproducirla.
5. **Mismo entorno de comparación:** referencia e implementación usan idéntico viewport, device scale factor, esquema de color, preferencia de movimiento, recorrido de interacción y puntos temporales.
6. **Laboratorio primero:** el generador escribe únicamente en la ruta de laboratorio aprobada; modificar componentes de producción requiere otra orden.
7. **Movimiento reducido:** toda especificación define un estado estático y la implementación lo verifica.
8. **Sin mutaciones ocultas:** la captura no instala extensiones, no persiste cookies por defecto y no cambia el proyecto destino.
9. **Artefactos locales:** una sesión se guarda en una ruta explícita ignorada por Git; nunca dentro de la carpeta de la skill.
10. **Fallo honesto:** si la animación depende de contenido inaccesible, randomness, streaming, 3D no observable o una captura insuficiente, el informe conserva el hueco y no inventa equivalencia.

## Contrato de sesión

La raíz de cada ejecución tendrá esta forma:

```text
<out>/<session-id>/
├── session.json
├── selection.json
├── runtime.json
├── resources.json
├── motion-spec.json
├── reference/
│   ├── before.png
│   ├── checkpoints/
│   ├── after.png
│   └── recording.webm          # solo para movimiento no controlable
├── extracted/
│   ├── subtree.html
│   ├── computed-styles.json
│   ├── stylesheets.json
│   ├── animations.json
│   └── bundle-signatures.json
├── implementation/
│   ├── manifest.json
│   └── generated-files.json
└── verification/
    ├── report.json
    ├── report.html
    ├── overlays/
    └── diffs/
```

Contrato mínimo de una entrada de movimiento:

```ts
type Confidence = "exact" | "measured" | "inferred" | "unknown";

interface MotionEntry {
  id: string;
  target: { selector: string; role?: string; textHint?: string };
  trigger: {
    type: "load" | "hover" | "click" | "focus" | "scroll" | "drag" | "auto";
    selector?: string;
  };
  engine: "css" | "waapi" | "gsap" | "motion" | "webflow-ix2" | "lottie" | "rive" | "spline" | "canvas-webgl" | "video" | "unknown";
  timeline: {
    delayMs?: number;
    durationMs?: number;
    easing?: string;
    iterations?: number | "infinite";
    staggerMs?: number;
  };
  keyframes: Array<Record<string, string | number>>;
  scroll?: { start: string; end: string; scrub?: number | boolean; pin?: boolean };
  reducedMotion: { strategy: "final-state" | "poster" | "disable"; keyframe?: number };
  confidence: Record<string, Confidence>;
  evidence: string[];
}
```

**Justificación del snippet:** este tipo constituye el límite entre extractores, agente generador y verificador; cambiarlo de forma improvisada rompería la trazabilidad y los adapters.

---

### Task 1: Inicializar la skill y el paquete del CLI

**Files:**
- Create: `D:/Proyectos/ai-dev-config/agents/skills/replicate-web-animation/SKILL.md`
- Create: `D:/Proyectos/ai-dev-config/agents/skills/replicate-web-animation/agents/openai.yaml`
- Create: `D:/Proyectos/ai-dev-config/agents/skills/replicate-web-animation/package.json`
- Create: `D:/Proyectos/ai-dev-config/agents/skills/replicate-web-animation/tsconfig.json`
- Create: `D:/Proyectos/ai-dev-config/agents/skills/replicate-web-animation/eslint.config.mjs`
- Create: `D:/Proyectos/ai-dev-config/agents/skills/replicate-web-animation/src/cli.ts`
- Test: `D:/Proyectos/ai-dev-config/agents/skills/replicate-web-animation/tests/cli-help.test.ts`

**Step 1: Write the failing test** — comprueba que `motion-copy --help` enumera `doctor`, `capture`, `analyze`, `spec`, `recreate` y `verify`.

**Step 2: Run test to verify it fails** — Run: `npm test -- cli-help.test.ts` · Expected: FAIL porque no existe el CLI.

**Step 3: Initialize the skill** — usa el inicializador de `skill-creator` con recursos `scripts,references`; configura nombre `replicate-web-animation`, descripción discriminante y selección automática.

**Step 4: Read the UI metadata contract** — antes de editar `agents/openai.yaml`, lee `skill-creator/references/openai_yaml.md`; define nombre visible y prompt por defecto sin política `explicit-only`.

**Step 5: Implement minimal CLI wiring** — Commander debe enrutar los seis comandos sin lógica de dominio todavía y devolver códigos de salida coherentes.

**Step 6: Run test to verify it passes** — Run: `npm test -- cli-help.test.ts` · Expected: PASS.

**Step 7: Validate the skill** — Run: `python C:/Users/juans/.codex/skills/.system/skill-creator/scripts/quick_validate.py D:/Proyectos/ai-dev-config/agents/skills/replicate-web-animation` · Expected: validación verde.

### Task 2: Definir schemas y almacenamiento de sesiones

**Files:**
- Create: `.../src/contracts/session.ts`
- Create: `.../src/contracts/motion-spec.ts`
- Create: `.../src/contracts/verification.ts`
- Create: `.../src/session/create-session.ts`
- Create: `.../src/session/read-session.ts`
- Create: `.../references/artifact-contract.md`
- Test: `.../tests/session-contract.test.ts`

**Step 1: Write the failing tests** — valida una sesión mínima, rechaza enums desconocidos, rutas fuera de `out`, evidencias inexistentes y propiedades de movimiento sin confianza.

**Step 2: Run tests to verify they fail** — Run: `npm test -- session-contract.test.ts` · Expected: FAIL.

**Step 3: Implement Zod schemas** — el schema runtime y los tipos TypeScript deben derivarse de una sola fuente.

**Step 4: Implement atomic session writes** — escribe primero a un archivo temporal dentro de la sesión y renombra al final; nunca sobrescribas una sesión completa.

**Step 5: Document versioning** — añade `schemaVersion`, reglas de compatibilidad y migración solo hacia delante en `artifact-contract.md`.

**Step 6: Run tests** — Expected: PASS.

### Task 3: Añadir `doctor` y detección segura del entorno

**Files:**
- Create: `.../src/commands/doctor.ts`
- Create: `.../src/platform/resolve-command.ts`
- Create: `.../src/platform/windows.ts`
- Test: `.../tests/doctor.test.ts`

**Step 1: Write failing tests** — cubre Node compatible, navegador Playwright, ffmpeg, ffprobe, permisos de salida y Motiscope opcional.

**Step 2: Run tests** — Expected: FAIL.

**Step 3: Implement checks without installation** — `doctor` solo diagnostica y presenta comandos sugeridos; nunca instala software ni modifica PATH.

**Step 4: Add Windows behavior** — resuelve `.cmd`/`.exe`, rutas con espacios y mensajes PowerShell sin asumir Bash o WSL.

**Step 5: Run tests and command** — `npm test -- doctor.test.ts` y `npm run dev -- doctor` · Expected: PASS e informe legible.

### Task 4: Implementar selección visual de la zona

**Files:**
- Create: `.../src/capture/browser-session.ts`
- Create: `.../src/capture/selector-overlay.ts`
- Create: `.../src/capture/selection.ts`
- Create: `.../references/selection-mode.md`
- Test fixture: `.../tests/fixtures/selection/index.html`
- Test: `.../tests/e2e/selection.e2e.test.ts`

**Step 1: Write the failing E2E test** — abre el fixture, activa el overlay, selecciona un elemento anidado y espera `selection.json` con selector estable y bounding box.

**Step 2: Run test** — Expected: FAIL.

**Step 3: Implement headed selection mode** — hover resalta, click confirma, `Escape` cancela; el overlay vive en Shadow DOM y se elimina antes de cualquier captura.

**Step 4: Implement selector scoring** — prioriza `id`, atributos estables y jerarquía corta; rechaza clases generadas/hash como única identidad y guarda alternativas.

**Step 5: Add CLI non-interactive mode** — `--selector` evita abrir el selector visual y es obligatorio en CI.

**Step 6: Run E2E** — Expected: PASS sin dejar overlay en el DOM capturado.

### Task 5: Grabar interacciones reproducibles

**Files:**
- Create: `.../src/capture/interactions.ts`
- Create: `.../src/capture/checkpoints.ts`
- Create: `.../src/capture/recording.ts`
- Create: `.../src/contracts/interaction.ts`
- Test fixtures: `.../tests/fixtures/interactions/*`
- Test: `.../tests/e2e/interactions.e2e.test.ts`

**Step 1: Write failing tests** — carga, hover, click, focus, scroll y drag deben producir pasos serializables con timestamps relativos.

**Step 2: Run tests** — Expected: FAIL.

**Step 3: Implement action DSL** — usa locators y coordenadas relativas al elemento; scroll guarda contenedor, offset inicial/final y duración.

**Step 4: Capture deterministic checkpoints** — para CSS/WAAPI pausa la animación y fija `currentTime`; para scroll fija posiciones normalizadas; para rAF/Canvas activa grabación rasterizada.

**Step 5: Add stabilization rules** — espera fuentes y layout estable, pero no espera a que termine la animación que se pretende capturar.

**Step 6: Run E2E** — Expected: PASS con before/checkpoints/after por interacción.

### Task 6: Extraer DOM, estilos y animaciones CSS/WAAPI

**Files:**
- Create: `.../src/extract/dom.ts`
- Create: `.../src/extract/computed-styles.ts`
- Create: `.../src/extract/stylesheets.ts`
- Create: `.../src/extract/waapi.ts`
- Create: `.../src/security/sanitize-extracted-data.ts`
- Test: `.../tests/extract-css-waapi.test.ts`

**Step 1: Write failing tests** — extrae `getKeyframes()`, `getTiming()`, delays, iteraciones, easing por keyframe y pseudo-elementos; sanea `javascript:`, `expression()` y texto con apariencia de instrucciones.

**Step 2: Run tests** — Expected: FAIL.

**Step 3: Implement subtree extraction** — conserva estructura y valores relevantes sin clonar la página completa.

**Step 4: Implement stylesheet provenance** — registra URL/regla/origen y maneja CORS como hueco explícito, sin desactivar seguridad del navegador.

**Step 5: Implement WAAPI extraction** — limita resultados al elemento elegido y descendientes; serializa keyframes computados y timing resuelto.

**Step 6: Run tests** — Expected: PASS.

### Task 7: Detectar motor y recursos de movimiento

**Files:**
- Create: `.../src/detect/runtime.ts`
- Create: `.../src/detect/network.ts`
- Create: `.../src/detect/signatures.ts`
- Create: `.../references/engines/css-waapi.md`
- Create: `.../references/engines/gsap-motion.md`
- Create: `.../references/engines/webflow-ix2.md`
- Create: `.../references/engines/media-canvas.md`
- Test: `.../tests/runtime-detection.test.ts`

**Step 1: Write failing table tests** — fixtures con GSAP, Motion-like WAAPI, Webflow attributes, Lottie JSON, Rive, Spline, vídeo y Canvas deben clasificarse con evidencias, no por una sola cadena.

**Step 2: Run tests** — Expected: FAIL.

**Step 3: Implement multi-signal detection** — combina globals, propiedades de elementos, performance resources, etiquetas generator, extensiones de recursos y firmas de bundle.

**Step 4: Inventory network assets** — registra URLs y metadata; no descarga fuentes/medios protegidos por defecto.

**Step 5: Record ambiguity** — permite varios motores y marca cuál gobierna el elemento seleccionado.

**Step 6: Run tests** — Expected: PASS.

### Task 8: Añadir extractores especializados GSAP, Motion y Webflow IX2

**Files:**
- Create: `.../src/extract/gsap.ts`
- Create: `.../src/extract/motion.ts`
- Create: `.../src/extract/webflow-ix2.ts`
- Create: `.../src/extract/bundle-reader.ts`
- Test fixtures: `.../tests/fixtures/engines/{gsap,motion,webflow}`
- Test: `.../tests/extract-engines.test.ts`

**Step 1: Write failing tests** — recupera duración, ease, stagger, ScrollTrigger start/end/scrub/pin, springs observables y action lists IX2.

**Step 2: Run tests** — Expected: FAIL.

**Step 3: Implement runtime-first extraction** — utiliza APIs vivas solo dentro de la página; el bundle es fallback de lectura.

**Step 4: Implement inert bundle reader** — descarga texto con límites de tamaño y tipo, nunca usa `eval`, `import`, `require`, VM ni ejecución indirecta.

**Step 5: Implement Webflow mapping** — relaciona `data-w-id`, action list, media query, trigger y elemento seleccionado.

**Step 6: Run tests** — Expected: PASS y prueba negativa que demuestra que un bundle malicioso no se ejecuta.

### Task 9: Implementar fallback de vídeo para rAF, Canvas y WebGL

**Files:**
- Create: `.../src/video/ffmpeg.ts`
- Create: `.../src/video/extract-frames.ts`
- Create: `.../src/video/motion-energy.ts`
- Create: `.../src/video/motiscope-adapter.ts`
- Create: `.../references/video-fallback.md`
- Test: `.../tests/video-analysis.test.ts`

**Step 1: Write failing tests** — un clip sintético debe devolver fps, segmentos activos, holds, loop aproximado y frames clave; ffmpeg ausente produce diagnóstico, no crash opaco.

**Step 2: Run tests** — Expected: FAIL.

**Step 3: Implement FFmpeg wrapper** — argumentos como array, rutas literales, timeout y salida acotada; nunca construir comandos mediante concatenación de shell.

**Step 4: Implement baseline analyzer** — energía de movimiento y deduplicación suficientes para escoger frames; no clasifica visualmente elementos.

**Step 5: Add optional Motiscope adapter** — si está disponible, importa su `motion.json` como evidencia `measured`; si no, conserva el baseline local.

**Step 6: Run tests** — Expected: PASS con clips generados por fixtures, sin depender de una web externa.

### Task 10: Normalizar `motion-spec.json`

**Files:**
- Create: `.../src/spec/build-motion-spec.ts`
- Create: `.../src/spec/confidence.ts`
- Create: `.../src/spec/resolve-conflicts.ts`
- Create: `.../references/motion-spec.md`
- Test: `.../tests/motion-spec.test.ts`

**Step 1: Write failing tests** — CSS exacto gana a medición de vídeo; medición gana a inferencia; conflictos permanecen visibles; toda entrada incluye reduced motion y evidencia.

**Step 2: Run tests** — Expected: FAIL.

**Step 3: Implement precedence** — exact > measured > inferred > unknown, sin fusionar unidades incompatibles silenciosamente.

**Step 4: Implement engine-neutral properties** — conserva valores originales y una representación normalizada para translate/scale/rotate/opacity/filter/clip-path/color.

**Step 5: Emit human summary** — genera `motion-spec.md` junto al JSON para que el usuario pueda aprobarlo sin leer datos internos.

**Step 6: Run tests** — Expected: PASS.

### Task 11: Crear el workflow de la skill y los adapters React/Next

**Files:**
- Modify: `.../SKILL.md`
- Create: `.../references/capture-workflow.md`
- Create: `.../references/recreate-react-next.md`
- Create: `.../references/verify-workflow.md`
- Create: `.../src/recreate/select-engine.ts`
- Create: `.../src/recreate/lab-manifest.ts`
- Test: `.../tests/recreate-routing.test.ts`

**Step 1: Write failing routing tests** — CSS sencillo → CSS; presence/layout/gesture → Motion; timeline/scroll/stagger complejo → GSAP; Canvas/WebGL sin semántica → prototipo bloqueado o adapter explícito.

**Step 2: Run tests** — Expected: FAIL.

**Step 3: Write concise SKILL routing** — activa ante “copia/reproduce/estudia esta animación”, exige URL/selección/interacción/destino, y carga solo la referencia del motor y fase actual.

**Step 4: Implement laboratory contract** — por defecto crea un manifiesto y propone `app/motion-lab/<session-id>/`; no toca la ruta de producción.

**Step 5: Define Next invariants** — componentes cliente solo donde haga falta, limpieza de GSAP context, `useReducedMotion`, estado SSR visible, sin layout shift y sin nuevas dependencias si el proyecto ya tiene motor adecuado.

**Step 6: Run tests and skill validation** — Expected: PASS.

### Task 12: Generar y montar el laboratorio en Satorus

**Files:**
- Create: `D:/Proyectos/satorus/app/motion-lab/[sessionId]/page.tsx`
- Create: `D:/Proyectos/satorus/components/motion-lab/motion-lab-shell.tsx`
- Create: `D:/Proyectos/satorus/components/motion-lab/reference-panel.tsx`
- Create: `D:/Proyectos/satorus/components/motion-lab/implementation-panel.tsx`
- Modify: `D:/Proyectos/satorus/app/globals.css` only if shared reset is strictly required
- Modify: `D:/Proyectos/satorus/.gitignore`
- Test: `.../tests/e2e/satorus-lab.e2e.test.ts`

**Step 1: Write the failing E2E test** — una sesión fixture abre la ruta, muestra spec, checkpoints y demo sin aparecer en navegación pública ni sitemap.

**Step 2: Run test** — Expected: FAIL.

**Step 3: Implement isolated lab shell** — desarrollo local únicamente o protegido por flag; no hereda animaciones globales de la home que alteren la medición.

**Step 4: Add generated component boundary** — cada sesión vive bajo `components/motion-lab/generated/<session-id>/` y un manifiesto lista exactamente los archivos creados.

**Step 5: Ignore session evidence** — `.motion-forensics/` y temporales quedan fuera de Git; el componente generado solo se conserva cuando el usuario lo aprueba.

**Step 6: Run E2E and Satorus checks** — `npm run lint`, `npm run build` · Expected: PASS.

### Task 13: Implementar comparación visual y temporal

**Files:**
- Create: `.../src/verify/run-reference.ts`
- Create: `.../src/verify/run-implementation.ts`
- Create: `.../src/verify/pixel-diff.ts`
- Create: `.../src/verify/video-ssim.ts`
- Create: `.../src/verify/report.ts`
- Create: `.../src/verify/report-template.ts`
- Test: `.../tests/verification.test.ts`
- E2E: `.../tests/e2e/verification.e2e.test.ts`

**Step 1: Write failing tests** — detecta dirección equivocada, rango incorrecto, timing desplazado, easing diferente y elemento no sincronizado.

**Step 2: Run tests** — Expected: FAIL.

**Step 3: Implement checkpoint comparison** — inicio, 25%, 50%, 75% y final como mínimo; bounding boxes iguales y recorte al área seleccionada.

**Step 4: Implement motion dimensions** — reporta por separado dirección, rango, timing, easing y coupling; no reduce todo a un único porcentaje engañoso.

**Step 5: Add overlays and HTML report** — slider reference/implementation, heatmap y enlaces a evidencia.

**Step 6: Add configurable gates** — el usuario o fixture define tolerancias; sin tolerancia, informa métricas pero no declara equivalencia perfecta.

**Step 7: Run unit and E2E tests** — Expected: PASS.

### Task 14: Endurecer seguridad, permisos y cleanup

**Files:**
- Create: `.../src/security/url-policy.ts`
- Create: `.../src/security/path-policy.ts`
- Create: `.../src/security/content-boundary.ts`
- Create: `.../src/security/cleanup.ts`
- Create: `.../references/security.md`
- Test: `.../tests/security.test.ts`

**Step 1: Write failing security tests** — bloquea `file:`, `javascript:`, localhost no autorizado en modo externo, path traversal, symlink escape, escritura fuera del lab y bundle payloads.

**Step 2: Run tests** — Expected: FAIL.

**Step 3: Implement URL/path policies** — resuelve rutas absolutas, valida que permanezcan dentro del destino aprobado y distingue captura de producción.

**Step 4: Implement authorization checkpoints** — navegar/capturar es read-only; descargar activos, iniciar sesión o escribir integración requiere autorización separada cuando aplique.

**Step 5: Implement cleanup** — elimina temporales propios por manifiesto, nunca globs amplios ni carpetas no verificadas; conserva evidencia solicitada.

**Step 6: Run security suite** — Expected: PASS.

### Task 15: Validar el flujo completo con fixtures y una referencia autorizada

**Files:**
- Create: `.../tests/fixtures/app/index.ts`
- Create: `.../tests/fixtures/pages/{css,waapi,gsap,scroll,canvas}.html`
- Create: `.../tests/e2e/full-pipeline.e2e.test.ts`
- Create: `.../tests/fixtures/expected/*.json`
- Modify: `.../package.json`

**Step 1: Write the failing full-pipeline test** — URL fixture → selección → captura → detección → extracción → spec → laboratorio → verify.

**Step 2: Run test** — Expected: FAIL hasta completar wiring.

**Step 3: Wire CLI commands** — cada comando reanuda una sesión existente y no repite fases verdes sin `--force`.

**Step 4: Run full verification** — `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run build` · Expected: PASS.

**Step 5: Manual authorized smoke test** — usar una web propia o una demo de código abierto; seleccionar una única animación y generar solo el laboratorio.

**Step 6: Review evidence with user** — no integrar en la home durante el smoke test; presentar spec, vídeo/frames, demo y diferencias.

### Task 16: Empaquetar instalación local y comandos de uso

**Files:**
- Create: `.../scripts/install-local.mjs`
- Create: `.../scripts/uninstall-local.mjs`
- Modify: `.../package.json`
- Modify: `.../agents/openai.yaml`
- Test: `.../tests/install-local.test.ts`

**Step 1: Write failing install tests** — dry-run, instalación idempotente, detección de versión y desinstalación solo de archivos propios.

**Step 2: Run tests** — Expected: FAIL.

**Step 3: Implement local install** — expone `motion-copy` y registra la skill sin escribir sobre skills ajenas.

**Step 4: Add dry-run and manifest** — toda instalación muestra destinos y guarda lista exacta de archivos.

**Step 5: Run tests and validation** — Expected: PASS.

### Task 17 (final): Actualizar documentación

**Files:**
- Modify: `D:/Proyectos/satorus/docs/plans/2026-09-11-replicador-animaciones-web.md`
- Modify: `D:/Proyectos/satorus/DESIGN.md` only if el laboratorio introduce una convención visible reutilizable
- Create: `D:/Proyectos/ai-dev-config/agents/skills/replicate-web-animation/references/usage.md`
- Modify: seguimiento de tareas existente en `D:/Proyectos/ai-dev-config/` si existe

**Step 1:** registra estado de cada tarea, comandos ejecutados y evidencias finales.

**Step 2:** documenta el flujo humano: dar URL, señalar zona, grabar interacción, aprobar spec, revisar laboratorio e integrar aparte.

**Step 3:** documenta diferencias por tecnología fuente y los destinos realmente soportados; no anuncies WordPress/Angular como generadores hasta que existan adapters verificados.

**Step 4:** registra seguridad, uso responsable, ubicación de sesiones y procedimiento de limpieza.

**Step 5:** marca el MVP como completo solo si los fixtures, el pipeline E2E, el smoke test autorizado y la validación de la skill están verdes.

---

## Experiencia de uso final

El usuario podrá escribir:

```text
Usa replicate-web-animation.
Referencia: https://ejemplo.com
Quiero la animación del bloque donde aparece “Cómo funciona”.
Interacción: al hacer scroll desde que entra por abajo hasta quedar centrado.
Destino: Satorus, pero primero en motion-lab.
Comprueba escritorio 1440x900 y móvil 390x844.
```

El agente deberá:

1. Abrir la referencia y permitir selección visual si la descripción no resuelve un elemento único.
2. Capturar la interacción y producir evidencia.
3. Mostrar un resumen de qué es exacto, medido o inferido.
4. Generar la versión aislada en el laboratorio.
5. Ejecutar la comparación y presentar diferencias.
6. Esperar una orden explícita antes de integrar en la página real.

## Criterios de aceptación del producto

- Funciona en Windows sin exigir WSL2 para el MVP.
- Acepta referencias creadas con distintas tecnologías sin necesitar el código fuente original.
- Permite indicar una zona por lenguaje natural, selector o click visual.
- No confunde la tecnología fuente con la tecnología destino.
- Extrae valores exactos cuando el navegador los expone y marca las aproximaciones.
- Selecciona CSS, Motion o GSAP justificadamente para React/Next.
- Genera siempre primero una demostración aislada.
- Verifica los mismos estados y trayectorias, no solo una captura final.
- Respeta `prefers-reduced-motion`, móvil y limpieza de efectos.
- No ejecuta bundles descargados ni escribe fuera de rutas autorizadas.
- Informa con honestidad cuando Canvas/WebGL, activos inaccesibles o una grabación pobre impiden alta fidelidad.

## Fases posteriores, no incluidas en el MVP

1. Adapter de salida para WordPress/Gutenberg/Elementor.
2. Adapter de salida Angular con signals y lifecycle propio.
3. Editor visual de keyframes y curvas.
4. Catálogo local de animaciones aprobadas y reutilizables.
5. Comparación perceptual basada en optical flow.
6. Captura autenticada con perfiles desechables y consentimiento explícito.
7. Adapters de producción para Rive, Lottie y React Three Fiber.
