# El negocio en despiece — 3D arquitectónico

Fecha: 2026-09-25

## Objetivo
Reemplazar la ilustración por una escena WebGL realista. La cámara recorre un mismo negocio y su transformación explica webs, aplicaciones y automatización. Materiales sobrios y proporciones arquitectónicas; sin personajes de juguete.

## Arquitectura
Three.js se carga bajo demanda desde un componente cliente. Modelo local procedural con piedra, madera, aluminio y vidrio, iluminación de estudio y sombras. Ocho encuadres vinculados a capítulos HTML accesibles. La cubierta y las paredes se separan; el suelo descubre las conexiones. GSAP interpola cámara y elementos, con render solo durante cambios. Preferencia de movimiento reducido, límite DPR, limpieza GPU, alternativa sin WebGL.

## Tareas
- [x] Construir modelo, materiales e iluminación.
- [x] Integrar cámara y estados por capítulo; ajustar diseño editorial.
- [x] Revisar capturas desktop/móvil y navegación, formulario, historial, movimiento reducido.
- [x] Lint, pruebas y build; documentar y guardar rama.

## Verificación
Perfil standard: build/lint, pruebas de navegación y comprobación real en navegador. No se envían formularios reales.

## Incidencias
El trabajo se mantiene en el worktree aislado para no interferir con la variante de otro agente.

## Resultado de verificación
- Build de producción: 18 rutas generadas; TypeScript correcto.
- ESLint correcto y tres pruebas de cálculo de capítulo correctas.
- Navegador: ocho capítulos en desktop y móvil; sin desbordamiento horizontal; movimiento reducido; preguntas; borrador conservado; envío simulado en ambos tamaños; proyecto Enrolla2 y regreso al capítulo.
- Sin JavaScript: contenido y enlaces alternativos disponibles. Sin WebGL: contenido, navegación y formulario funcionales.
- Texturas de roble y hormigón CC0 alojadas localmente; créditos junto a los mapas.
- Regresión detectada y resuelta: Chromium desplazaba el documento al enfocar controles dentro de un panel sticky con transform animado. Los paneles se mantienen fijos y el movimiento se concentra en la cámara 3D. Prueba reproducible: tests/journey-browser-check.cjs.
- Limitación: el render es en tiempo real y su fluidez depende de la GPU; DPR limitado y render bajo demanda para reducir coste. Los encuadres se adaptan a móvil.
