# Catálogo de proyectos y casos Implementation Plan

**Goal:** Convertir `/productos` en un catálogo escalable dividido en Apps y Webs, con resúmenes enlazados a páginas de detalle para Pidoteca, Lector Bilingüe, SportApp, Ángel Mendoza y Enrolla2.

**Architecture:** El catálogo mantiene los datos de las fichas en un módulo tipado y usa dos composiciones editoriales diferenciadas por familia. Pidoteca y SportApp reciben páginas propias bajo `/productos`; las webs viven bajo `/proyectos`; Lector Bilingüe conserva su ruta actual. Los casos comparten patrones estructurales y CTA, pero cada uno utiliza contenido, color y material real de su proyecto.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, `next/image`, Lucide.

## Perfil de verificación

- Nivel: standard
- Motivo: cambia navegación pública, añade cuatro rutas, reutiliza formularios y afecta responsive/SEO.
- Comandos: `npm run lint`, `npm run build`, revisión con navegador a 1440×960 y 390×844.
- Evidencias esperadas: cinco fichas visibles bajo su familia, enlaces correctos, cuatro rutas nuevas prerenderizadas, sin errores de consola ni desbordamiento horizontal.

## Incidencias de verificación

<!-- Se rellena solo si aparece un fallo major/critical. -->

---

### Task 1: Reunir contenido y capturas reales

**Files:**
- Create: `public/projects/pidoteca/*`
- Create: `public/projects/angel-mendoza/*`
- Create: `public/projects/enrolla2/*`

**Steps:**

1. Copiar desde `D:/Proyectos/pideya/public/images/landing/` las vistas de portada, operación, mapa y analítica de Pidoteca.
2. Copiar desde `D:/Proyectos/landind de angel/` capturas verificadas de escritorio/móvil y fotografía de contexto.
3. Ejecutar Enrolla2 localmente y capturar portada, carta y móvil mediante navegador.
4. Inspeccionar todas las imágenes y descartar las que presenten datos sensibles o estados de desarrollo irrelevantes.

### Task 2: Modelar el catálogo escalable

**Files:**
- Create: `lib/projects.ts`

**Steps:**

1. Definir tipos `ProjectFamily` y `ProjectSummary` con `slug`, `name`, `label`, `description`, `status`, `href`, `image` e `imageAlt`.
2. Exportar arrays `appProjects` y `webProjects` en el orden aprobado.
3. Mantener textos concretos y verificables, sin métricas ni resultados inventados.

### Task 3: Rediseñar `/productos` como escaparate Apps/Webs

**Files:**
- Modify: `app/productos/page.tsx`
- Create: `app/productos/catalogo.module.css`

**Steps:**

1. Sustituir el dossier largo por un hero que explica las dos familias.
2. Construir una franja Apps con tres fichas y una franja Webs con dos casos grandes.
3. Añadir CTA final hacia `/#contacto` y enlaces accesibles a cada detalle.
4. Verificar que añadir un objeto al array crea una ficha sin cambiar el layout.

### Task 4: Crear el caso completo de Pidoteca

**Files:**
- Create: `app/productos/pidoteca/page.tsx`
- Create: `app/productos/pidoteca/pidoteca.module.css`
- Reuse: `components/pidoteca-journey-scene.tsx`

**Steps:**

1. Explicar problema, recorrido QR→pedido→equipo y módulos de gestión con copy derivada de `FUNCIONALIDADES.txt`.
2. Usar capturas reales de la landing y operación de Pidoteca.
3. Mantener enlace externo a `https://pidoteca.com` y CTA de contacto con Satorus.

### Task 5: Crear el caso completo de SportApp

**Files:**
- Create: `app/productos/sportapp/page.tsx`
- Create: `app/productos/sportapp/sportapp.module.css`
- Reuse: `components/sportapp-waitlist-form.tsx`

**Steps:**

1. Trasladar el contenido actual de SportApp a una página propia.
2. Conservar sedes, equipos, sesiones, notas y documentos como recorrido del producto.
3. Mantener el formulario de acceso anticipado y las imágenes actuales.

### Task 6: Crear casos completos de Ángel Mendoza y Enrolla2

**Files:**
- Create: `components/website-case-study.tsx`
- Create: `components/website-case-study.module.css`
- Create: `app/proyectos/angel-mendoza/page.tsx`
- Create: `app/proyectos/enrolla2/page.tsx`

**Steps:**

1. Crear un componente editorial compartido que admita paleta, reto, decisiones, capturas y CTA.
2. Para Ángel Mendoza, explicar especialización en salud, autoridad personal, claridad de proceso y captación mediante consultoría.
3. Para Enrolla2, explicar apetito visual, carta, prueba del obrador y prioridad móvil.
4. Incluir enlaces externos solo para dominios públicos verificados.

### Task 7: Actualizar navegación y SEO

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/sitemap.ts`
- Modify: `components/site-header.tsx` si el estado activo requiere reconocer rutas hijas.

**Steps:**

1. Hacer que la puerta de proyectos de la home apunte al nuevo catálogo.
2. Añadir las cuatro rutas nuevas al sitemap.
3. Incluir metadata canónica, Open Graph y Twitter en cada página.

### Task 8: Verificar compilación y experiencia

**Files:**
- No production files unless verification finds a defect.

**Steps:**

1. Ejecutar `npm run lint`; esperado: PASS.
2. Ejecutar `npm run build`; esperado: PASS y rutas estáticas listadas.
3. Recorrer catálogo y cuatro casos en escritorio/móvil con navegador.
4. Comprobar enlaces, consola, accesibilidad básica y `scrollWidth === clientWidth`.

### Task 9 (final): Actualizar documentación

**Files:**
- Modify: `DESIGN.md`
- Modify: `docs/plans/2026-09-14-catalogo-proyectos-y-casos.md`

**Pasos:** documentar el patrón Apps/Webs, la regla de evidencia real y el comportamiento responsive; registrar únicamente incidencias relevantes de verificación y dejar el plan alineado con el resultado final.
