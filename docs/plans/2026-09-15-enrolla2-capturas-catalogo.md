# Capturas de Enrolla2 en el catálogo Implementation Plan

**Goal:** Sustituir las fotografías aisladas del caso Enrolla2 de `/productos` por las cuatro capturas aportadas y conservar una composición clara en escritorio y móvil.

**Architecture:** Las capturas se alojan como activos estáticos del proyecto y el catálogo declara cuál es la principal, qué vistas de apoyo se muestran y cómo debe encajarse la captura vertical. `ProjectShowcase` sigue usando su mismo relevo y, en móvil, distribuye tres detalles sin dejar un hueco visual al final.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, Next Image.

## Perfil de verificación

- Nivel: standard
- Motivo: cambia una escena pública responsive y el encuadre de recursos con proporciones distintas.
- Comandos: `npm run lint`, `npx tsc --noEmit`, `npm run build`, inspección de `/productos` a 1440 px y 390 px.
- Evidencias esperadas: Enrolla2 usa exclusivamente las cuatro capturas recibidas; no hay fotos antiguas en esa ficha; la captura de opiniones móvil se ve entera y no hay recorte ni desbordamiento horizontal.

## Incidencias de verificación

<!-- Se rellena durante la ejecución solo para fallos major/critical. -->

---

### Task 1: Incorporar las capturas de Enrolla2

**Files:**
- Create: `public/projects/enrolla2/productos-carta.png`
- Create: `public/projects/enrolla2/galeria-rolls.png`
- Create: `public/projects/enrolla2/opiniones-mobile.png`
- Create: `public/projects/enrolla2/opiniones-desktop.png`
- Modify: `lib/project-catalog.ts`

**Step 1:** Copiar los cuatro recursos entregados a los activos públicos con nombres semánticos.

**Step 2:** Declarar la galería como captura principal y las vistas de carta y opiniones como los tres detalles del caso. Marcar la vista vertical como `portrait` para que se muestre completa.

**Step 3:** Comprobar que cada `alt` describe la captura y no presenta la fotografía como una vista separada del sitio.

### Task 2: Ajustar la cuadrícula de detalles móvil

**Files:**
- Modify: `components/project-showcase.tsx`
- Modify: `components/project-showcase.module.css`

**Step 1:** Añadir al grupo de detalles un atributo con su cantidad, sin cambiar el contrato del catálogo.

**Step 2:** Para tres detalles en móvil, hacer que el último ocupe la fila completa y conserve proporción 16:9 o 4:3 según el recurso. No alterar los grupos de uno o dos detalles.

**Step 3:** Revisar que la vista vertical aplica `object-fit: contain` y que la versión de escritorio conserva su composición de tres columnas.

### Task 3: Verificar la composición

**Files:** No production files salvo correcciones necesarias.

**Step 1:** Ejecutar `npm run lint`, `npx tsc --noEmit`, `npm run build` y `git diff --check`.

**Step 2:** Inspeccionar `/productos` en escritorio y móvil: la escena principal, los tres detalles, el relevo entre Enrolla2 y el caso anterior, y la ausencia de desplazamiento horizontal.

### Task 4 (final): Actualizar documentación

**Files:**
- Modify: `DESIGN.md`
- Modify: `.impeccable/surfaces/app-productos-page-tsx.md`
- Modify: `docs/plans/2026-09-15-enrolla2-capturas-catalogo.md`

**Steps:** Registrar que Enrolla2 usa capturas de su propia experiencia y que la composición móvil puede cerrar un grupo de tres detalles con una fila completa. Anotar los resultados de verificación en este plan.

**Resultado:** Se incorporaron las cuatro capturas aportadas y el catálogo dejó de referenciar `hero-desktop.png`, `carta-desktop.png` y `obrador-poster.jpg` para el caso Enrolla2. `npm run lint`, `npx tsc --noEmit`, `git diff --check` y `npm run build` pasan. La revisión en navegador a 1440 × 900 y 390 × 844 confirma la escena agrupada, el encuadre completo de la reseña vertical y ausencia de desplazamiento horizontal (ancho de documento 375 px dentro de viewport de 390 px).
