# Satorus Home Dinámica Implementation Plan

**Goal:** Modernizar la portada de Satorus y convertirla en un “taller en movimiento” donde el desorden cotidiano se transforma en un recorrido claro, manteniendo la identidad actual y preparando la cabecera para un vídeo que producirá otro agente.

**Architecture:** La página recuperará un flujo vertical normal y concentrará el movimiento en una secuencia hero, una transformación central ligada al scroll y demostraciones interactivas de servicios. `motion/react` controlará entradas y estados locales; GSAP + ScrollTrigger quedará reservado a la historia central vinculada al scroll. El vídeo hero se integrará detrás de una bandera desactivada y usará la imagen actual como póster hasta que el agente de vídeo entregue los archivos definitivos.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS global, `motion/react`, GSAP, `@gsap/react`, `next/image`.

## Perfil de verificación

- Nivel: standard
- Motivo: rediseño visual completo de la home, cambios responsive, animaciones, vídeo y estados interactivos; no afecta autenticación, pagos, base de datos ni API.
- Comandos: `npm run lint`, `npm run build`; comprobación manual/E2E de `/` a 1440×900, 1024×768, 390×844 y 360×800; comprobación con `prefers-reduced-motion: reduce`.
- Evidencias esperadas: compilación y lint verdes; capturas desktop y móvil; vídeo ausente sin 404 ni espacio vacío; teclado funcional; ausencia de overflow horizontal; animaciones fluidas y contenido visible sin JavaScript.

## Incidencias de verificación

<!-- Se rellena durante la ejecución solo para fallos major/critical. -->

### Ronda 1 — 2026-09-11

- Capa: navegador / SSR-accesibilidad.
- Síntoma: la respuesta SSR de `/` marcaba «Productos» con `aria-current="location"` y `data-active="true"`.
- Impacto: major; la navegación activa no era discreta ni semánticamente correcta, pues al inicio de `/` aparecía activa una ruta no seleccionada.
- Evidencia anterior: para el enlace `/productos`, `sectionId` y `activeSection` eran ambos `null`, por lo que `sectionId === activeSection` devolvía `true` durante el SSR inicial.
- Causa: el cálculo de activo trataba el valor `null` de un enlace sin ancla como si fuese el estado inicial de una sección.
- Corrección: los enlaces con ancla se comparan exclusivamente con `activeSection`; los enlaces sin ancla se comparan con `pathname`.
- Evidencia verde: `npm run lint` PASS; `npm run build` PASS; SSR local en `http://localhost:3100/` devuelve `<a data-active="false" href="/productos">Productos</a>` y en `/productos` devuelve `<a aria-current="location" data-active="true" href="/productos">Productos</a>`; la comprobación de navegador obtuvo los mismos atributos para los dos enlaces de navegación.
- Estado: resuelta y verificada localmente.

---

## Prompt maestro para el agente ejecutor

Actúa como frontend engineer senior y director de motion digital. Implementa íntegramente este plan dentro del repositorio de Satorus. No te limites a proponer cambios: modifica el código, verifica el resultado en navegador y deja la home terminada, salvo por el archivo de vídeo final descrito en “Contrato del vídeo hero”.

Antes de editar:

1. Lee completos `PRODUCT.md`, `DESIGN.md` y `.impeccable/surfaces/app-page-tsx.md`.
2. Inspecciona `app/page.tsx`, `app/globals.css` y todos los componentes citados en este documento.
3. Conserva el contenido verdadero, los formularios y la voz de marca. No inventes clientes, métricas, testimonios ni resultados.
4. Usa la estética existente: papel frío, mesa azul, grafito, naranja, lima, fotografía cenital, etiquetas y cable como ruta.
5. No conviertas la web en una plantilla SaaS, un mosaico de tarjetas, una interfaz futurista, glassmorphism ni una colección de efectos sin relación.
6. No añadas dependencias: el proyecto ya dispone de Motion y GSAP.
7. Usa `motion/react` para estados, entradas y microinteracciones. Usa GSAP únicamente para la historia central gobernada por scroll.
8. Respeta `prefers-reduced-motion`, teclado, foco visible, semántica y lectores de pantalla.
9. No hagas commits salvo petición explícita del usuario.

### Tesis de movimiento

- **Momento protagonista:** el hero muestra el taller de Satorus pasando del enredo al orden mediante el vídeo cenital.
- **Continuidad:** el cable naranja reaparece entre secciones como un único recorrido, sin convertirse en una superposición permanente sobre toda la página.
- **Interacción:** problemas y servicios responden al cursor, foco, toque y teclado mostrando una consecuencia visual concreta.
- **Transformación:** la historia “La consulta entra → El trabajo se ordena → Tu equipo sigue” es la única secuencia larga ligada al scroll.
- **Feedback:** navegación, FAQ, CTA y formulario responden rápido y con carácter físico.

No apliques un `fade-up` genérico a cada sección. Toda animación debe explicar entrada, conexión, transformación o respuesta.

## Contrato del vídeo hero

### Estado y propiedad

- Estado actual: **PENDIENTE DE PRODUCCIÓN**.
- El vídeo lo está creando **otro agente**.
- Este trabajo **no debe generar, editar, sustituir ni simular el vídeo final**.
- Debe dejar completamente montada la integración para activarla sin rehacer el componente.

### Archivos que entregará el otro agente

- `public/videos/satorus-hero-loop.webm`
- `public/videos/satorus-hero-loop.mp4`
- Póster/fallback existente: `public/images/hero-workbench.png`

No crees archivos de vídeo vacíos y no hagas peticiones de red a rutas inexistentes mientras la integración esté desactivada.

### Activación

- Añade `NEXT_PUBLIC_HERO_VIDEO_READY=false` a `.env.example`.
- Lee la bandera en el componente: solo renderiza `<video>` cuando su valor sea exactamente `"true"`.
- Con la bandera ausente o en `false`, renderiza únicamente `hero-workbench.png` mediante `next/image`.
- Cuando el vídeo llegue, la única operación necesaria deberá ser copiar ambos archivos a `public/videos/` y establecer `NEXT_PUBLIC_HERO_VIDEO_READY=true`.

### Comportamiento del vídeo

- `<video autoPlay muted loop playsInline preload="metadata">`.
- `<source>` WebM primero y MP4 después.
- Utiliza `poster="/images/hero-workbench.png"`.
- El vídeo es decorativo: `aria-hidden="true"`; el mensaje y el CTA siguen siendo HTML.
- Con `prefers-reduced-motion: reduce`, muestra el póster y no reproduzcas el vídeo.
- Pausa el vídeo cuando salga del viewport o la pestaña quede oculta; reanúdalo únicamente cuando sea visible y el usuario no haya pedido movimiento reducido.
- Mantén `object-fit: cover` y un `object-position` responsive que preserve la mano, el cable y la zona útil de la composición.
- No añadas controles, sonido, texto grabado ni degradados oscuros indiscriminados.

## Animaciones actuales que deben eliminarse o sustituirse

1. Elimina `SectionCurtainStack` de `app/page.tsx`. Recupera el flujo vertical normal de la página.
2. Si `components/section-curtain-stack.tsx` queda sin consumidores, elimínalo.
3. Elimina de `app/globals.css` todas las reglas `.section-curtain-*`, `.curtain-motion-enabled` y variables usadas exclusivamente por las cortinas.
4. Elimina del hero la animación de `clipPath` de `.hero-photo`: el vídeo/póster debe aparecer estable.
5. Elimina `hero-route` y su `motion.path`. El cable ya estará dentro del vídeo y duplicarlo produciría ruido visual.
6. Sustituye las entradas actuales del hero por una única secuencia breve: titular, descripción y CTA, con duración total máxima de 700 ms. Nada debe quedar invisible si falla JavaScript.
7. Elimina el salto de layout de `.service-row:hover` que modifica `padding-inline`. Sustitúyelo por color, recorte, desplazamiento interno con `transform` y cambio del panel visual.
8. Reescribe la animación actual de `DesktopScrollStory`; no mantengas simultáneamente el wipe antiguo y la nueva secuencia de tres actos.
9. Conserva `MobileFlowReveal` solo si se adapta a la nueva historia y sigue siendo comprensible por toque, botón y teclado. Evita duplicar en móvil una segunda experiencia larga de scroll.
10. Conserva las animaciones funcionales del menú, FAQ y formulario, refinándolas según este plan.

---

### Task 1: Recuperar el flujo vertical y preparar el sistema de movimiento

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Delete if unused: `components/section-curtain-stack.tsx`
- Modify: `components/motion-provider.tsx`

**Step 1:** Documenta mediante búsqueda todas las referencias a `SectionCurtainStack` y confirma que solo afecta a la home.

**Step 2:** Retira el wrapper de cortinas y renderiza las secciones en flujo normal sin cambiar su orden semántico.

**Step 3:** Elimina CSS huérfano de cortinas, fondos de descanso, máscaras y espacios verticales artificiales.

**Step 4:** Mantén en `MotionProvider` una aceleración común sobria. Las transiciones rutinarias deben durar 150–300 ms y las entradas autorales un máximo aproximado de 700 ms.

**Step 5:** Ejecuta `npm run lint` · Resultado esperado: PASS.

**Criterios de aceptación:** no existen huecos enormes entre secciones, el scroll nativo es predecible, los enlaces con ancla aterrizan correctamente y no quedan imports o estilos de cortina sin uso.

### Task 2: Montar el hero preparado para el vídeo pendiente

**Files:**
- Create: `components/hero-media.tsx`
- Modify: `components/hero.tsx`
- Modify: `app/globals.css`
- Modify: `.env.example`
- Create: `public/videos/README.md`

**Step 1:** Implementa `HeroMedia` con la bandera y todos los fallbacks definidos en el contrato del vídeo.

**Step 2:** Verifica primero el estado pendiente: bandera falsa, solo póster visible, cero solicitudes a `.webm` o `.mp4`.

**Step 3:** Sustituye `hero-photo` por `HeroMedia`; elimina el SVG animado del cable y la revelación `clipPath`.

**Step 4:** Mantén el titular “Tu negocio, menos enredado.”, su explicación y “Cuéntanos qué te frena”. Haz que entren como una única composición editorial, no como tres efectos independientes.

**Step 5:** Añade al README de `public/videos/` el nombre exacto de los archivos, formatos, bandera de activación y responsabilidad del otro agente.

**Step 6:** Ejecuta `npm run lint` · Resultado esperado: PASS.

**Criterios de aceptación:** el hero funciona y conserva la composición con el vídeo ausente; activarlo no requiere tocar JSX; no hay reproducción con movimiento reducido; el texto mantiene contraste en desktop y móvil.

### Task 3: Animar “Hablamos claro” como puente narrativo

**Files:**
- Create: `components/route-sketch.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Step 1:** Convierte el SVG actual en un componente cliente acotado a su sección.

**Step 2:** Dibuja la ruta una sola vez al entrar en viewport. La etiqueta “Lo que te frena” aparece primero y “Un recorrido claro” queda colocada cuando la línea llega al final.

**Step 3:** En movimiento reducido muestra el estado final sin transición.

**Step 4:** Comprueba que las etiquetas parecen papel físico y que la curva no tapa el texto.

**Criterios de aceptación:** la animación comunica de problema a recorrido, se reproduce una vez, no bloquea el scroll y mantiene contenido visible sin JavaScript.

### Task 4: Convertir los problemas cotidianos en una escena reactiva

**Files:**
- Create: `components/interactive-frictions.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Step 1:** Extrae la lista `frictions` al componente sin cambiar sus textos.

**Step 2:** Cada elemento debe poder activarse por hover, foco, clic o toque. No diseñes una interacción exclusivamente hover.

**Step 3:** Conecta cada frase a una señal visual sobre `daily-tangle.png`:

- WhatsApp/presupuesto: pulso localizado sobre el móvil.
- Copia duplicada: dos recortes de papel se separan levemente.
- Web sin conversaciones: una etiqueta naranja intenta avanzar y queda detenida.
- Dependencia de memoria: el cable pierde continuidad entre dos puntos.

Estas señales deben construirse con HTML, CSS y SVG; no inventes capturas de clientes ni generes fotografías nuevas.

**Step 4:** Mantén un estado activo por defecto y anuncia la relación con semántica accesible. Los efectos decorativos estarán ocultos para lectores de pantalla.

**Criterios de aceptación:** cada problema produce una respuesta distinta, funciona con teclado y móvil y nunca impide leer la lista completa.

### Task 5: Transformar servicios en un showcase inspirado en Buck

**Files:**
- Create: `components/service-showcase.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Step 1:** Conserva las tres filas editoriales y sus textos; no las conviertas en tarjetas.

**Step 2:** Añade un panel visual común que cambia según el servicio activo:

- Web: una composición de navegador pasa de mensaje confuso a jerarquía clara y CTA visible.
- A medida: notas y campos dispersos se convierten en una herramienta sencilla de pedidos.
- Automatización: una consulta conecta aviso, documento y siguiente paso mediante el cable naranja.

**Step 3:** Construye las demostraciones como motion graphics HTML/CSS/SVG, etiquetadas como “Ejemplo ilustrativo”. No presentes las escenas como proyectos reales.

**Step 4:** Activa filas mediante hover, foco y toque. En móvil coloca el panel inmediatamente debajo de la fila activa.

**Step 5:** Anima solo la transición interna del panel mediante máscara, recorte o transformación; no hagas desaparecer todo el bloque.

**Criterios de aceptación:** cada servicio tiene una demostración reconocible, la selección es accesible, no hay desplazamiento lateral y el cambio de estado dura menos de 500 ms.

### Task 6: Reescribir la historia central en tres actos

**Files:**
- Modify: `components/desktop-scroll-story.tsx`
- Modify: `components/mobile-flow-reveal.tsx`
- Modify: `app/globals.css`

**Step 1:** Mantén una sola sección protagonista y una sola timeline GSAP con ScrollTrigger en desktop.

**Step 2:** Divide la secuencia en tres capítulos claramente delimitados:

1. “La consulta entra”: una nota física se desliza y el móvil recibe un pulso.
2. “El trabajo se ordena”: `clear-flow.png` sustituye progresivamente `daily-tangle.png`; los papeles se alinean y la ruta se dibuja.
3. “Tu equipo sigue”: aparece una etiqueta lima de estado y se activa el CTA final.

**Step 3:** Sincroniza imagen, ruta, texto activo y progreso. Un capítulo no debe empezar antes de que el anterior sea comprensible.

**Step 4:** Reduce el espacio total de scroll si produce tramos sin cambios visibles. Cada tramo del scrub debe tener respuesta inmediata.

**Step 5:** En móvil conserva la comparación táctil existente, pero actualiza copy y estados para que represente los mismos tres actos. No uses pinning largo en móvil.

**Step 6:** Desactiva GSAP y muestra el estado final completo cuando se solicite movimiento reducido.

**Criterios de aceptación:** no hay saltos al entrar/salir del pin, no aparece espacio vacío, la transformación tiene tres momentos legibles y el móvil sigue siendo manipulable por toque y teclado.

### Task 7: Conectar el proceso con una ruta progresiva

**Files:**
- Create: `components/process-route.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Step 1:** Conserva los cuatro pasos y su contenido.

**Step 2:** Anima el cable naranja según el progreso de la sección. Cuando alcanza un paso, activa su pin, título y etiqueta con una respuesta breve.

**Step 3:** En desktop la ruta puede ser horizontal; en móvil debe convertirse en recorrido vertical sin perder el orden.

**Step 4:** Asegura que todos los pasos son visibles aunque el observador o JavaScript no se ejecute.

**Criterios de aceptación:** la línea explica secuencia, no obliga a esperar, no usa rebote y el orden semántico del `<ol>` permanece intacto.

### Task 8: Refinar navegación, FAQ y formulario

**Files:**
- Modify: `components/site-header.tsx`
- Modify: `components/contact-form.tsx`
- Modify: `app/globals.css`

**Step 1:** Añade al header una indicación discreta de sección activa mediante `IntersectionObserver`, sin convertir la navegación en una barra de progreso dominante.

**Step 2:** Mantén el menú móvil actual y su gestión de foco. Refina la entrada como una placa lima física y conserva `Escape` y el focus trap.

**Step 3:** En FAQ anima la apertura mediante una cuadrícula de filas o una técnica accesible que no dependa de una altura fija. El icono más/menos debe seguir describiendo el estado.

**Step 4:** Haz que la hoja del formulario se asiente suavemente al entrar en viewport. Con movimiento reducido debe aparecer directamente en su posición final.

**Step 5:** Solo tras una respuesta real de éxito, muestra un sello visual “RECIBIDO” dentro de la hoja. No muestres el sello mientras envía ni en error.

**Step 6:** Mantén intactos endpoint, validación, consentimiento, honeypot, mensajes y vínculo de correo alternativo.

**Criterios de aceptación:** navegación por teclado intacta, FAQ utilizable sin animación, sello ligado al éxito real y ningún cambio de contrato en `/api/contact`.

### Task 9: Rendimiento, responsive y accesibilidad

**Files:**
- Modify as needed: componentes y estilos anteriores

**Step 1:** Ejecuta `npm run lint` · Resultado esperado: PASS.

**Step 2:** Ejecuta `npm run build` · Resultado esperado: PASS.

**Step 3:** Comprueba desktop a 1440×900 y 1024×768: jerarquía, pinning, activación de servicios, anclas y formulario.

**Step 4:** Comprueba móvil a 390×844 y 360×800: menú, hero, comparador, servicios por toque, proceso vertical, FAQ y formulario.

**Step 5:** Navega toda la página solo con teclado. Ningún estado importante puede depender exclusivamente del cursor.

**Step 6:** Repite con `prefers-reduced-motion: reduce`: póster estático, estados finales visibles, sin vídeo, pinning ni animación continua.

**Step 7:** Verifica que la pestaña Network no solicita los vídeos con la bandera falsa y que no existen errores de consola.

**Step 8:** Captura evidencia desktop y móvil. Corrige en una sola tanda los problemas observados y realiza una única confirmación final.

**Criterios de aceptación:** lint/build verdes, sin overflow horizontal, contenido entendible sin movimiento, sin errores de consola, sin 404 de vídeo y experiencia fluida en los cuatro viewports.

### Task 10 (final): Actualizar documentación

**Files:**
- Modify: `DESIGN.md`
- Modify: `.impeccable/surfaces/app-page-tsx.md`
- Modify or create: seguimiento de tareas existente en `docs/`; si no existe, añade una sección de estado al final de este plan
- Modify if needed: `public/videos/README.md`

**Step 1:** Documenta la tesis de movimiento, el uso restringido de GSAP y el contrato del vídeo pendiente.

**Step 2:** Registra qué animaciones anteriores se eliminaron y qué componentes nuevos las sustituyen.

**Step 3:** Deja explícito que el vídeo continúa pendiente de otro agente y detalla el procedimiento exacto de activación.

**Step 4:** Registra comandos ejecutados, resultados, capturas y cualquier incidencia relevante.

**Step 5:** Marca la implementación como completa únicamente si todo el código y la verificación están terminados; la producción del vídeo debe permanecer como dependencia externa pendiente.

---

## Definición final de terminado

La tarea está terminada cuando:

- La home tiene flujo vertical normal y no usa cortinas apiladas.
- El hero está preparado para el vídeo pero funciona hoy con el póster existente.
- El vídeo no se ha generado ni falsificado dentro de esta tarea.
- Problemas y servicios tienen respuestas visuales significativas.
- La transformación central cuenta tres actos en desktop y funciona táctilmente en móvil.
- El proceso, navegación, FAQ y formulario tienen microinteracciones coherentes.
- Todo respeta movimiento reducido, teclado y responsive.
- `npm run lint` y `npm run build` pasan.
- La documentación refleja tanto lo implementado como la dependencia pendiente del otro agente.

## Decisiones prohibidas

- No esperar a que llegue el vídeo para implementar el resto.
- No activar la bandera del vídeo ni crear archivos multimedia falsos.
- No usar vídeos remotos, YouTube, Vimeo o stock como sustitución temporal.
- No añadir nuevas dependencias de animación.
- No añadir animaciones de entrada repetidas a cada párrafo o sección.
- No usar scroll hijacking, cursor personalizado, sonido automático ni controles ocultos.
- No eliminar contenido, validación o accesibilidad para conseguir un efecto visual.
- No copiar literalmente Buck, HERO, Studio Freight o COLLINS; sirven como referencias de ritmo y jerarquía, no como plantilla.

---

## Estado final de implementación — 2026-09-11

- Implementación de código/home: **COMPLETA**. Reverificación standard: **PASA**.
- Tesis de movimiento verificada: el hero representa el taller en movimiento; el cable naranja da continuidad entre secciones; problemas y servicios responden a cursor, foco, toque y teclado; «La consulta entra → El trabajo se ordena → Tu equipo sigue» es la única historia central de scroll en tres actos; navegación, FAQ, CTA y formulario dan feedback breve.
- Tecnología de movimiento: `motion/react` para entradas, estados y microinteracciones. GSAP + ScrollTrigger queda restringido exclusivamente a la historia central de escritorio ligada al scroll.
- Animaciones retiradas: cortinas de home, `clipPath` del hero, `hero-route`, wipe anterior de la historia y hover de servicios que modificaba `padding-inline`. Sustitutos: `HeroMedia`, `RouteSketch`, `InteractiveFrictions`, `ServiceShowcase`, historia de tres actos, `ProcessRoute` y refinamientos de header, FAQ y formulario.
- Vídeo hero: **PENDIENTE DE DEPENDENCIA EXTERNA**. Otro agente debe entregar `public/videos/satorus-hero-loop.webm` y `public/videos/satorus-hero-loop.mp4`; no se generaron ni simularon. Con `NEXT_PUBLIC_HERO_VIDEO_READY=false` o ausente, se muestra solo el póster y se verificaron cero solicitudes de vídeo. Para activarlo, copiar ambos archivos y establecer exactamente `NEXT_PUBLIC_HERO_VIDEO_READY=true`.
- Verificación ejecutada: `npm run lint` PASS; `npm run build` PASS. Revisión manual a 1440×900, 1024×768, 390×844 y 360×800; teclado, movimiento reducido, ausencia de overflow horizontal y cero solicitudes/404 de vídeo con la bandera desactivada.
- Evidencias: `docs/evidence/home-dinamica/desktop-1440x900.png`, `docs/evidence/home-dinamica/mobile-390x844.png` y `docs/evidence/home-dinamica/desktop-1024x768-story.png`.
- Incidencias: R1 permanece registrada arriba como major resuelta y verificada; no se duplica. Observación menor no bloqueante de la reverificación: aviso de `next/image` sobre `position` del padre de `clear-flow` fuera del breakpoint; no es major ni critical y no impide el resultado PASA.
- Tests automatizados: no existe suite automatizada; no se inventan resultados.
