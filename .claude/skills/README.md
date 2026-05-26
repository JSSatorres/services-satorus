# Skills instaladas — services-satorus

## Tabla resumen

| Skill | Qué hace | Cuándo se activa | Archivo |
|-------|----------|------------------|---------|
| **frontend-design** | Obliga a definir Design Brief (propósito, tono, mood) antes de codificar. Elimina AI slop. | Al crear/rediseñar páginas o componentes visuales. Cuando el usuario pide "no parezca IA" | [SKILL.md](./frontend-design/SKILL.md) |
| **impeccable** | Suite de 20+ comandos de refinamiento iterativo: `/quiet`, `/bolder`, `/delight`, `/critique` | Cuando el usuario usa un comando `/` de refinamiento, o pide "mejora el diseño", "quita ruido visual" | [SKILL.md](./impeccable/SKILL.md) |
| **uiux-pro-max** | BD de inteligencia de diseño: 161 reglas por industria, paletas curadas, 13 text stacks | Al definir industria/tipo de producto, pedir sistema de diseño, elegir tipografía o paleta | [SKILL.md](./uiux-pro-max/SKILL.md) |
| **web-design-guidelines** | Audita código frente a 100+ reglas: WCAG, rendimiento, semántica HTML5, UX de interacción | Con `/web-design-guidelines`, antes de deploy, cuando se pide auditoría de accesibilidad/SEO | [SKILL.md](./web-design-guidelines/SKILL.md) |
| **skill-creator** | Crea skills personalizadas mediante entrevista guiada. Genera SKILL.md + casos de prueba | Cuando el usuario quiere crear una skill propia, codificar tokens de marca, sistematizar un flujo | [SKILL.md](./skill-creator/SKILL.md) |

---

## Flujo de trabajo recomendado

```
1. frontend-design    → Design Brief (ANTES de codificar)
        ↓
2. uiux-pro-max       → Sistema de diseño por industria (tokens, tipografía, paleta)
        ↓
3. [Codificación]     → Implementar con el sistema definido
        ↓
4. impeccable         → Refinamiento iterativo (/quiet, /bolder, /delight, /critique)
        ↓
5. web-design-guidelines → Auditoría técnica final (WCAG, perf, semántica)
        ↓
6. skill-creator      → (Opcional) Codificar el sistema resultante como skill propia
```

---

## Stack de diseño web disponible

Herramientas externas mencionadas en el inventario que complementan las skills:

| Herramienta | URL | Para qué |
|-------------|-----|----------|
| **21st.dev** | 21st.dev | Componentes avanzados: botones con luz, efectos de partículas, héroes 3D |
| **Shadcn UI** | ui.shadcn.com | Componentes React/Next.js accesibles y personalizables |
| **Google Fonts** | fonts.google.com | Tipografía — explorar por sensación, no por defecto |
| **Higgsfield** | higgsfield.ai | Animar imágenes, videos de fondo lupeables |
| **Kling 3.0** | klingai.com | Generación y animación de video IA |
| **Stitch (Google)** | stitch.withgoogle.com | Mockups y archivos `.design.md` para Claude |
| **Excalidraw** | excalidraw.com | Diagramas de arquitectura importables en Claude |
| **Mobbin** | mobbin.com | Referencia de diseños reales de apps |

---

## Dependencias que requieren instalación manual

| Skill | Dependencia | Comando | Para qué |
|-------|-------------|---------|----------|
| impeccable | Playwright | `npm install -D playwright && npx playwright install chromium` | Comandos `/critique` con captura visual |
| web-design-guidelines | Playwright (opcional) | mismo que arriba | Auditoría visual en múltiples viewports |

---

## Skills propuestas pero NO instaladas (requieren visto bueno)

| Skill | Por qué está pendiente | Acción requerida |
|-------|----------------------|-----------------|
| **Site Teardown** | Requiere Playwright CLI + es experimental | Confirmar instalación |
| **Web GPU Skill** | Solo útil para shaders/3D avanzado | Confirmar si se necesita |

---

## Plantilla de diseño web

La plantilla maestra está en: [prompts/web-design.md](../prompts/web-design.md)

Para usarla: copia el contenido completo de ese archivo al inicio de una nueva conversación y rellena los campos entre `[ ]`.
