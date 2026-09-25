# La pieza que faltaba Implementation Plan

**Goal:** Sustituir el vuelo entre estaciones por una home que demuestra cómo una solución a medida desbloquea una consulta de negocio.

**Architecture:** Home editorial renderizada en servidor con una única maqueta animada en cliente. GSAP controla una secuencia breve y repetible dentro de la maqueta; nunca intercepta rueda, tacto ni navegación. Se reutilizan el catálogo real, el formulario y las páginas de proyecto.

**Tech Stack:** Next.js 16, React 19, CSS Modules, GSAP + useGSAP, lucide-react.

## Perfil de verificación

- Nivel: standard
- Motivo: rediseño de la home, navegación compartida y retirada del modo espacial activo; sin cambios de API ni persistencia.
- Comandos: `npm run lint`, `npx tsc --noEmit`, `npm run build`; comprobación en navegador con `agent-browser`.
- Evidencias esperadas: escritorio y móvil sin desbordamiento; secuencia completa y repetible; anclas, menú, proyectos, validación de formulario y movimiento reducido operativos; contenido útil sin JavaScript.

## Incidencias de verificación

---

## Dirección visual

- Concepto: una consulta se detiene, una pieza a medida encaja, se abre y revela la herramienta que permite continuar.
- Paleta existente: papel #f2f1ea, grafito #171b18, azul #2948c7, naranja #e56748, lima #dfe97a.
- Tipografía: Bricolage Grotesque para titulares y rótulos; Atkinson Hyperlegible Next para lectura y controles.
- Composición: titular grande a la izquierda, maqueta de sobremesa azul a la derecha; soluciones en filas, proyectos con capturas reales, proceso numerado y contacto.
- Firma: módulo naranja plegable sobre un recorrido interrumpido. Cámara fija. Una sola secuencia automática de menos de cinco segundos, repetible por botón.
- Restricciones: no métricas ni testimonios inventados, no envíos reales de prueba, no nuevos paquetes, no publicación. El ejemplo de la maqueta está etiquetado como ilustrativo.

### Task 1: Home y maqueta

- Crear `components/missing-piece/missing-piece-home.tsx`, `missing-piece-scene.tsx` y `missing-piece.module.css`.
- Sustituir `SpatialHome` en `app/page.tsx`.
- Estado HTML inicial completo: solución y explicación accesibles sin JS. Con movimiento reducido, no animar ni ocultar información.
- Secuencia GSAP limitada al componente, con cleanup y repetición. No bucles, pin, scroll-jacking ni cámara.
- Catálogo: enlazar proyectos reales usando `lib/project-catalog.ts`; mantener distinción producto/cliente.

### Task 2: Navegación nativa

- Simplificar `components/site-header.tsx`: anclas nativas, menú accesible, Escape y retorno de foco.
- Retirar activación espacial y aterrizaje de `app/layout.tsx`.
- Desactivar Lenis en `/` mediante `components/smooth-scroll.tsx`, conservándolo en páginas internas.
- Comprobar entrada directa por hash, enlaces desde proyectos y navegación atrás.

### Task 3: Verificación

- Ejecutar análisis estático y build.
- Usar navegador para comprobar 1440, 768, 390 y 320 px; maqueta, anclas, menú, FAQ, enlaces y formulario sin enviar correo.
- Comprobar movimiento reducido y sin JavaScript. Registrar capturas locales y resultados.

### Task 4 (final): Actualizar documentación

- Actualizar `DESIGN.md` con dirección activa, comportamiento de movimiento y pruebas realizadas.
- Marcar resultado y limitaciones en este plan.

## Resultado de implementación

- Implementado en un worktree separado, rama `codex/pieza-que-faltaba`, para preservar los cambios concurrentes de la variante cuaderno en la carpeta original.
- `npm run lint`: correcto. `npm run build`: 18 páginas generadas; TypeScript correcto.
- Primer intento de build: Turbopack rechazó el enlace de `node_modules` entre unidades. Resuelto copiando las dependencias al worktree; ninguna dependencia ni configuración del proyecto cambia.
- Navegador: secuencia `pending → connected → complete` y repetición correctas; home sin atributos `data-spatial` ni `data-lenis`; sin errores de navegador ni desbordamiento a 1440, 768, 390 y 320 px.
- Menú móvil, Escape/retorno de foco, enlace a contacto y validación nativa de campos requeridos correctos.
- Movimiento reducido: sin timeline, resultado visible. Sin JavaScript: titular, solución final y desplegables disponibles.
- Capturas locales guardadas en la carpeta de visualizaciones de esta tarea.
- La vista previa no configura credenciales de correo; las pruebas de envío se interceptan localmente, sin enviar mensajes reales.
- Comprobación final sobre build de producción: navegación a GoblinTrader y regreso con scroll nativo; formulario con respuesta HTTP interceptada localmente y payload correcto; cero errores JavaScript. El cambio de preferencia de movimiento durante la sesión también revierte la animación al estado completo.
