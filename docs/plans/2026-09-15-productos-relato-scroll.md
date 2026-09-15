# Relato del escaparate de proyectos Implementation Plan

**Goal:** Convertir `/productos` en un recorrido que explique la mejora y el motivo de cada proyecto, conservando el relevo visual al hacer scroll.

**Architecture:** La portada presenta la tesis y conduce al escaparate existente. Cada caso obtiene dos campos editoriales breves en `lib/project-catalog.ts` y el componente del recorrido los muestra junto a su captura real, enlazando con la ficha extensa. No se modifica la mecánica de GSAP ni se añaden casos ficticios.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, GSAP ScrollTrigger existente.

## Perfil de verificación

- Nivel: standard
- Motivo: afecta copy, estructura pública, responsive y composición dentro del scroll animado.
- Comandos: `npm run lint`, `npm run build`, navegador en escritorio y móvil.
- Evidencias esperadas: cinco casos con mejora y motivo visibles; enlaces a detalle; tres capturas del resultado; scroll y alternativa de movimiento reducido utilizables.

## Incidencias de verificación

<!-- Solo fallos major/critical durante la verificación. -->

---

### Task 1: Especificar el hilo de los casos

**Files:** Modify `lib/project-catalog.ts`.

**Steps:** Añadir mejora y motivo verificados para los cinco casos; evitar cifras, comparaciones antes/después y resultados no medidos.

### Task 2: Dar contexto al recorrido

**Files:** Modify `app/productos/page.tsx`, `app/productos/catalogo.module.css`, `components/project-showcase.tsx`, `components/project-showcase.module.css`.

**Steps:** Introducir una promesa clara en el primer viewport, mostrar la pareja mejora/motivo junto a cada imagen real, conservar el relevo por máscara y el acceso al caso completo; revisar móvil y movimiento reducido.

### Task 3: Verificar y capturar

**Files:** No production files salvo corrección de defectos.

**Steps:** Ejecutar lint/build, recorrer cinco proyectos y comprobar enlaces, cortes de texto y desbordamiento; guardar tres capturas de la nueva página.

### Task 4 (final): Actualizar documentación

**Files:** Modify `DESIGN.md`, `docs/plans/2026-09-15-productos-relato-scroll.md`.

**Steps:** Registrar el patrón de relato breve y evidencia real; dejar el plan alineado con la entrega.
