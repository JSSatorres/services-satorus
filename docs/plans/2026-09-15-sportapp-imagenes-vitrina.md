# Imágenes de SportApp en la vitrina Implementation Plan

**Goal:** Mostrar una escena humana y realista como imagen principal de SportApp y capturas relevantes de la app en los detalles, sin perder el sujeto en los recortes de escritorio y móvil.

**Architecture:** La vitrina ya consume rutas declaradas en `lib/project-catalog.ts`. Se conserva el montaje y se cambian únicamente los recursos de SportApp; un ajuste acotado de `object-position` puede centrar la fotografía en el marco 6:5 de escritorio (zona principal ~1.6:1) y el marco 16:9 de móvil. En móvil el primer detalle aparece en tarjeta 16:9 dentro del texto.

**Tech Stack:** Next.js, React, CSS Modules, imágenes públicas.

## Perfil de verificación

- Nivel: standard
- Motivo: Cambia contenido visual ejecutable y sus recortes responsive, sin lógica crítica.
- Comandos: `npm run lint`; `npm run build`; revisión visual en `http://localhost:3002/productos` en ancho de escritorio y móvil.
- Evidencias esperadas: Persona y dispositivo visibles en ambos marcos; detalle real de SportApp legible y sin huecos; página compilada.

## Incidencias de verificación

<!-- Se rellena solo para fallos major/critical. -->

---

### Task 1: Crear y colocar fotografía

**Files:**
- Create: `public/projects/sportapp/club-manager-relieved.webp`
- Modify: `lib/project-catalog.ts` (ítem `sportapp`)

**Steps:**
1. Generar foto editorial candid con responsable de club satisfecho revisando en tablet la semana de equipos y sesiones, sin interfaces inventadas legibles.
2. Inspeccionar sujetos y composición antes de incorporarla.
3. Copiar al proyecto y apuntar `image`, `imageAlt` en el catálogo.
4. Comprobar el encuadre en marcos principal de escritorio y móvil.

### Task 2: Capturas de detalle

**Files:**
- Create: `public/projects/sportapp/nueva-sesion.png`
- Create: `public/projects/sportapp/documentos.png` si ambas tienen buena lectura en la mitad del detalle.
- Modify: `lib/project-catalog.ts` (detalles de `sportapp`)
- Modify: `components/project-showcase.module.css` solo si el recorte de SportApp requiere foco específico.

**Steps:**
1. Elegir capturas ya creadas en `D:/Proyectos/manage-sport-app/public/landing/`.
2. Copiarlas sin modificar las fuentes y declarar etiquetas y textos alternativos precisos.
3. Verificar que el primer detalle funciona en la tarjeta móvil y los detalles inferiores de escritorio.
4. Ejecutar lint, build y comprobar página responsive.

### Task 3 (final): Actualizar documentación

**Files:**
- Modify: este plan, si las capturas elegidas o la verificación difieren de lo previsto.

**Steps:** registrar la decisión final de recursos y resultados de verificación. No hay seguimiento de tareas ni design-guide en este proyecto que actualizar.

## Resultado

- Principal: `club-manager-relieved.webp`, foto generada en modo integrado de imagegen y optimizada a WebP. El rostro y la tablet permanecen visibles en el marco de escritorio y en 390×844 móvil sin ajustes de CSS.
- Inferiores: `nueva-sesion.png` y `documentos.png`, copiadas de `manage-sport-app/public/landing/` sin alterar los originales. En móvil la primera aparece en la tarjeta de detalle 16:9.
- Verificación: `npm run lint` correcto. `npm run build` compiló inicialmente, pero el sandbox devolvió `spawn EPERM` durante TypeScript; repetido con aprobación fuera del sandbox, terminó correctamente. Revisión visual en el navegador a 1280 px y 390 px correcta.
