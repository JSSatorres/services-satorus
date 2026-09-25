> Referencia histórica: sustituida por `2026-09-25-negocio-en-despiece-3d.md`.

# El negocio por dentro Implementation Plan

**Goal:** Convertir la home en una experiencia ilustrada por capítulos donde un negocio en perspectiva se transforma, conservando cada mejora.

**Architecture:** Una escena SVG isométrica persistente ocupa el escenario sticky; el scroll nativo y los enlaces de capítulo determinan la sección activa. Las piezas cambian de estado mediante transiciones locales y un recorrido GSAP acotado. Proyectos, preguntas y contacto aparecen como documentos del mismo taller, con contenido real y accesible.

**Tech Stack:** Next.js, React, SVG, CSS Modules, GSAP/useGSAP existentes; ninguna dependencia nueva.

## Perfil de verificación

- Nivel: standard
- Motivo: navegación, escena principal y presentación de todas las secciones; sin cambios en APIs.
- Comandos: tests de cálculo de capítulos con Node, lint, TypeScript y build.
- Evidencias esperadas: capítulos reversibles, enlaces directos y atrás, navegación táctil y teclado, contenido sin desbordamiento en móvil, movimiento reducido, formulario con envío interceptado.

## Incidencias de verificación

---

## Dirección visual

El negocio es una maqueta arquitectónica de papel y madera: dos paredes, mesa de trabajo, estantería, personas, vegetación y escaparate. Fondo azul de taller #233cb0; papel #f2f1ea, madera #ddbd93, naranja #e56748, lima #dfe97a y grafito #171b18. Bricolage da voz a los capítulos; Atkinson a la información. La escena domina el viewport; no es una tarjeta dentro de un hero convencional.

## Secuencia

1. Inicio: negocio en funcionamiento, consultas y papeles dispersos.
2. Cómo trabajamos: el negocio se vuelve plano para comprenderlo; cuatro pasos del método.
3. Web: un escaparate se despliega para que el cliente entienda y contacte.
4. Aplicación: información y pedidos se agrupan; aparece una herramienta compartida.
5. Automatización: se conectan los pasos; una consulta recorre el sistema y termina en revisión humana.
6. Proyectos: carpeta de trabajos con capturas y enlaces reales; la maqueta continúa detrás.
7. Preguntas: documento consultable, sin esconder la navegación.
8. Contacto: hoja de trabajo con el formulario existente.

## Tareas

1. Crear el cálculo de capítulo y probar fronteras, clamping y entrada directa.
2. Crear `BusinessWorld`: geometría isométrica, objetos y personas ilustrados, construcción acumulativa y plano del método.
3. Crear `BusinessJourney`: escenario persistente, scroll nativo, índice y enlaces, paneles de proyectos/preguntas/contacto, respuesta móvil y fallback sin JS.
4. Integrar en `app/page.tsx`; mantener páginas interiores y APIs; retirar del montaje la maqueta pequeña anterior.
5. Verificar build, navegador, anclas, proceso reversible, móvil, movimiento reducido y formulario simulado.
6. Actualizar `DESIGN.md` y este registro con el resultado.

## Restricciones

- Sin vuelos de cámara entre lugares, sin capturar rueda/touch y sin bucles automáticos continuos.
- El contenido y los controles deben poder leerse en reposo; los documentos largos tienen scroll normal.
- Las imágenes reales de proyectos conservan su atribución y estado. La maqueta es ilustrativa.
- Mantener la rama aislada `codex/pieza-que-faltaba`; no publicar ni enviar correos reales.
