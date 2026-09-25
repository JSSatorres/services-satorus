# Recorrido por la oficina Implementation Plan

**Goal:** Convertir la oficina centrada en la navegación principal: scroll hacia tres monitores con las secciones de development y un sobre de contacto.

**Architecture:** Mantener el modelo y sus materiales. Un controlador de cámara recorre objetos físicos y se separa del contenido HTML accesible. El scroll desplaza primero el contenido de la pantalla; solo en sus límites inicia la salida, atraviesa el interior y entra en el siguiente objeto. Las secciones permanecen montadas para conservar formularios y controles.

**Tech Stack:** Next.js, React, Three.js, GSAP existentes; sin dependencias nuevas.

## Perfil de verificación
- Nivel: full
- Motivo: cambia la navegación de la home, cámara, hashes, teclado, touch y formulario.
- Comandos: npm run build; npm run lint; node --experimental-strip-types --test tests/office-route.test.ts; pruebas Playwright contra localhost:3117.
- Evidencias esperadas: modelo centrado, tres pantallas y sobre; rueda recorre contenido antes de volar; cámara sale al interior entre objetos; acceso directo por menú; borrador y envío simulado; móvil, movimiento reducido y fallback.

## Incidencias de verificación

---

### Task 1: Contenido y contrato del recorrido
- Origen: development, commit f58b6fe852887967229f6d9d0ac542fa96ac7a55.
- lib/home-content.ts, business-bottleneck.tsx, service-showcase.tsx y contact-form.tsx no difieren de development. Reutilizar sus textos y recursos, sin resumirlos.
- Pantalla 1 / escritorio izquierdo: Cómo trabajamos, cuatro pasos y sus imágenes.
- Pantalla 2 / recepción: Soluciones, diagnóstico, servicios y mensaje de hablamos claro.
- Pantalla 3 / escritorio derecho: Proyectos, las dos puertas Apps y Webs de development con sus enlaces.
- Sobre / mesa de café: contacto y preguntas frecuentes, todos los textos originales.
- Crear lib/office-route.ts y tests/office-route.test.ts. Verificar aliases, límites y que la lectura interna preceda a la navegación.

### Task 2: Objetos y cámara
- Modificar architecture-model.ts para extraer monitor reutilizable, asignar tres texturas distintas y colocar monitor sobre recepción y sobre físico.
- Crear office-scene.ts reutilizando iluminación/materiales/dispose existentes. API visit, resize, dispose; raycasting y marcadores proyectados para cuatro objetos.
- Secuencia: alejarse de pantalla actual → ver oficina interior → aproximarse al siguiente puesto → encuadrar pantalla → mostrar HTML. El modo reducido omite vuelos.
- Cancelar vuelos anteriores, conservar destino al redimensionar, evitar atravesar escritorio/sillas y restaurar render sin bucles perpetuos.

### Task 3: Contenido y navegación
- Crear office-tour.tsx, office-sections.tsx, office-tour.module.css y use-office-input.ts.
- Sustituir la home anterior en app/page.tsx. Quitar copy lateral de portada; centrar modelo y mantener guía inferior mínima.
- Hashes existentes, navegación directa, vuelta a oficina, botones avanzar/retroceder, rueda y swipe. El scroll interno nunca se pierde por inercia de un vuelo. Escape vuelve a oficina.
- Mantener ContactForm montado y no animar su transformación. Respetar inputs, selección, enlaces y foco.

### Task 4: Verificación y entrega
- Test real rueda por las tres pantallas y sobre; inspección visual de oficina, vuelo y pantallas.
- Teclado, menú móvil, viewport estrecho, reducido, sin WebGL, enlaces/casos e historial.
- Envío de formulario solo interceptado; no enviar correos reales.
- Documentar el recorrido y guardar cambios en codex/negocio-3d-realista, sin modificar development ni el otro worktree.

## Resultado

Implementadas las cuatro ubicaciones y todas las explicaciones previstas de development. La portada anterior deja paso al modelo centrado. El formulario conserva el borrador al salir y entrar.

### Verificación realizada
- Producción: 18 rutas compiladas. Reglas de navegación: 6/6 pruebas unitarias (incluye compatibilidad del recorrido previo).
- Escritorio: rueda para entrar, lectura interna antes de avanzar, tres pantallas y carta, marcadores físicos, pasos interactivos, Escape, enlaces al catálogo y regreso, anchor de FAQ.
- Móvil 390×844: cuatro destinos, menú, movimiento reducido y ausencia de overflow horizontal.
- Las pruebas de formulario interceptan /api/contact; no envían correos reales.
- Evidencia local: tour-office.png, tour-process.png, tour-solutions.png, tour-projects.png, tour-contact.png y capturas tour-mobile-* en la carpeta de visualizaciones de esta tarea.

### Incidencia corregida
El render de oclusión en cada fotograma disparaba el suavizado temporal de GSAP en el navegador de pruebas y alargaba los vuelos. Se usa tiempo real, render directo durante desplazamientos y oclusión detallada al detenerse. Se retiran la fachada y cubierta de la vista una vez abiertas para evitar piezas flotantes al volver a la oficina.

### Cierre de verificación
- journey-browser-check.cjs: rueda, lectura sin salto, tres pantallas, sobre, borrador y envío interceptado: PASS.
- monitor-browser-check.cjs: pasos interactivos, Escape, marcadores, catálogo y atrás, enlace directo a FAQ: PASS.
- Entrada con swipe táctil real y lectura nativa en móvil: PASS.
- Alternativa sin WebGL con acceso directo a proyectos y formulario: PASS.
- Cambio de destino durante vuelo, resize durante vuelo y cambio de preferencia a movimiento reducido: PASS.
- Build y lint final correctos; 6 pruebas unitarias correctas. Evidencia final de modelo centrado y oficina abierta: tour-office-final.png y tour-interior-final.png.
