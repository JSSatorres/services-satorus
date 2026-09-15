# Productos editorial y relevo visual Implementation Plan

**Goal:** Aplicar a `/productos` la dirección editorial de la referencia, enriquecer las capturas en escritorio y conservar el scroll actual en móvil.

**Architecture:** La página servidor presenta una portada y un cierre nuevos usando capturas reales. `ProjectShowcase` mantiene su timeline, su sticky CSS y el relevo por máscara; cada capa visual incorpora dos pruebas secundarias que se relevan junto a la principal en escritorio. En móvil la capa sticky permanece con una sola captura y una prueba contextual se intercala en el texto del caso.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, Next Image, GSAP ScrollTrigger existente.

## Perfil de verificación

- Nivel: standard
- Motivo: afecta composición pública, lectura móvil y sincronía de imágenes durante el scroll.
- Comandos: `npm run lint`, `npm run build`, inspección en navegador a 1440 px y 390 px, comprobación de movimiento reducido.
- Evidencias esperadas: portada y cierre en la dirección de la referencia; cinco casos con reto, mejora y motivo; hasta dos detalles reales por caso en escritorio (SportApp solo dispone de una segunda vista distinta); una sola captura sticky en móvil y detalle en el relato; máscara y color sin cambio de proyecto a destiempo.

## Incidencias de verificación

<!-- Solo fallos major/critical durante la verificación. -->

---

### Task 1: Registrar las pruebas reales de cada caso

**Files:** Modify `lib/project-catalog.ts`.

**Steps:** Añadir un reto breve y fuentes/alt de hasta dos capturas secundarias existentes por caso. Evitar duplicar las únicas dos vistas distintas de SportApp, métricas y atribuciones antes/después no documentadas.

### Task 2: Portada y cierre editoriales

**Files:** Modify `app/productos/page.tsx`, `app/productos/catalogo.module.css`.

**Steps:** Llevar el titular y el collage de capturas al primer viewport, con blanco, azul papel, acento naranja y CTA visible. Sustituir el espacio final separado por un cierre que sintetice el método y conduzca a contacto. Mantener enlaces reales.

### Task 3: Escaparate enriquecido sin sustituir la animación

**Files:** Modify `components/project-showcase.tsx`, `components/project-showcase.module.css`.

**Steps:** Mostrar reto/mejora/motivo en la columna móvil. En escritorio agrupar principal y dos detalles dentro del mismo `frameClip` para que el barrido existente cambie el conjunto completo. En móvil conservar proporción 16/9 y sticky bajo cabecera; mostrar una captura de detalle en el texto, fuera del sticky. Con movimiento reducido, intercalar los casos sin capas apiladas.

### Task 4: Verificación de pantalla y comportamiento

**Files:** No production files salvo correcciones.

**Steps:** Ejecutar lint/build; comprobar cuatro estados del scroll, escritorio y móvil, enlaces, contención de capturas, desbordamientos y movimiento reducido. Corregir en una pasada y reconfirmar.

**Resultado:** `npm run lint`, `npx tsc --noEmit`, `npm run build` y `git diff --check` pasan. En el navegador local se comprobaron portada, introducción, Pidoteca, Lector Bilingüe, Enrolla2 y cierre a 1440 × 900 y 390 × 844; el móvil no desborda horizontalmente y no hay imágenes rotas. El código de movimiento reducido sigue evitando `data-motion` y mantiene el marcado intercalado; no se pudo emular visualmente esa preferencia en el navegador integrado.

### Task 5 (final): Actualizar documentación

**Files:** Modify `.impeccable/surfaces/app-productos-page-tsx.md`, `DESIGN.md`, este plan.

**Steps:** Registrar la nueva composición, el patrón de pruebas agrupadas y la adaptación móvil. Cerrar el plan con resultados comprobados.

**Resultado:** `DESIGN.md` y el brief de `/productos` registran el papel claro, el azul cielo, el relevo de imágenes agrupadas y el detalle contextual móvil. No se añadieron métricas ni vistas duplicadas.
