---
name: web-design-guidelines
description: Audita código HTML/CSS/JS frente a más de 100 reglas de accesibilidad WCAG, rendimiento, estructura semántica y mejores prácticas de interacción. Revisión técnica final antes de deploy.
metadata:
  type: skill
  source: Vercel Labs
---

# Web Design Guidelines Skill

## ¿Qué hace?

Actúa como auditor técnico de calidad web. Cuando se activa, revisa el código de un componente o página completa frente a una checklist de más de 100 reglas agrupadas en cuatro dominios:

1. **Accesibilidad** — WCAG 2.1 AA
2. **Rendimiento** — Core Web Vitals y carga optimizada
3. **Estructura semántica** — HTML5 correcto y SEO técnico
4. **Interacción** — Mejores prácticas de UX y comportamiento

## Cuándo se activa (triggers)

- El usuario escribe `/web-design-guidelines` seguido de un componente o ruta de archivo
- Antes de hacer deploy de cualquier página o componente nuevo
- Cuando el usuario pide "revisar la accesibilidad", "auditar el SEO", "verificar el rendimiento"
- Como paso final del flujo de diseño, después de [[frontend-design]] e [[impeccable]]
- Cuando hay dudas sobre si el código cumple estándares técnicos

## Instrucciones de uso

### Modo de invocación

```
/web-design-guidelines [componente o fragmento de código]
/web-design-guidelines [ruta/al/archivo.tsx]
/web-design-guidelines --full-page [descripción de la página]
```

### Proceso de auditoría

1. **Escanear** el código contra los 4 dominios de reglas
2. **Clasificar** los hallazgos por severidad: Crítico / Importante / Sugerencia
3. **Generar** el informe con fixes concretos
4. **Priorizar** los fixes por impacto

### Formato de informe

```markdown
## Web Design Guidelines Audit

### Resumen
- Críticos: X (bloquean accesibilidad o SEO)
- Importantes: X (degradan experiencia o rendimiento)
- Sugerencias: X (mejoras opcionales)
- Score estimado de accesibilidad: X/100

---

### CRÍTICOS

#### [WCAG-001] Imágenes sin alt text
- **Archivo:** components/Hero.tsx, línea 23
- **Problema:** `<img src="/hero.jpg" />` — falta atributo alt
- **Fix:** `<img src="/hero.jpg" alt="[descripción del contenido]" />`
- **Impacto:** Lectores de pantalla no pueden describir la imagen

#### [PERF-001] Fuentes sin preload
- **Problema:** Google Fonts cargadas sin `preload` ni `display=swap`
- **Fix:** `<link rel="preload" href="..." as="font" crossorigin />`
- **Impacto:** FOUT (Flash of Unstyled Text) — CLS aumentado

---

### IMPORTANTES
[mismo formato]

---

### SUGERENCIAS
[mismo formato]
```

---

## Reglas de auditoría por dominio

### Dominio 1 — Accesibilidad WCAG

**Estructura semántica:**
- [ ] Un solo `<h1>` por página
- [ ] Jerarquía de headings sin saltos (h1 → h2 → h3, nunca h1 → h3)
- [ ] `<main>`, `<nav>`, `<header>`, `<footer>` presentes y correctos
- [ ] Listas de navegación en `<nav>` con `<ul>`/`<li>`
- [ ] Formularios con `<label>` asociado a cada `<input>`
- [ ] Botones con texto descriptivo (no solo iconos sin aria-label)
- [ ] Links con texto descriptivo (no "click aquí" ni "leer más" aislados)

**Imágenes y media:**
- [ ] Todas las imágenes informativas tienen `alt` no vacío
- [ ] Imágenes decorativas tienen `alt=""`
- [ ] Videos tienen tracks de subtítulos o transcripción disponible

**Interacción:**
- [ ] Todos los elementos interactivos son alcanzables por teclado
- [ ] Focus visible con contraste mínimo 3:1
- [ ] No se usa `outline: none` sin reemplazo de focus
- [ ] Targets táctiles ≥ 44×44px
- [ ] No hay trampas de teclado (keyboard traps)

**ARIA:**
- [ ] ARIA solo cuando HTML semántico no es suficiente
- [ ] `aria-label` en iconos interactivos sin texto
- [ ] `role` correcto cuando se desvía del elemento nativo
- [ ] `aria-expanded`, `aria-controls` en acordeones y dropdowns

### Dominio 2 — Rendimiento

**Imágenes:**
- [ ] Formato moderno (WebP o AVIF) para imágenes fotográficas
- [ ] `width` y `height` definidos para prevenir CLS
- [ ] `loading="lazy"` en imágenes fuera del fold
- [ ] `loading="eager"` / `fetchpriority="high"` en la imagen LCP
- [ ] Imágenes responsivas con `srcset` y `sizes`

**Fuentes:**
- [ ] `font-display: swap` en todas las fuentes web
- [ ] `<link rel="preconnect">` para Google Fonts
- [ ] `<link rel="preload">` para fuentes críticas
- [ ] Máximo 2-3 familias tipográficas (cada una tiene peso en carga)
- [ ] Subsetting de caracteres cuando sea posible

**JavaScript:**
- [ ] No hay JS bloqueante en `<head>` sin `defer` o `async`
- [ ] Animaciones vía CSS o Web Animations API (no JS en cada frame)
- [ ] Event listeners en delegación cuando corresponde

**CSS:**
- [ ] CSS crítico inlineado o en `<head>`
- [ ] No se importan librerías CSS completas si solo se usan 5% de clases
- [ ] Animaciones respetan `prefers-reduced-motion`

### Dominio 3 — Estructura semántica y SEO

**Meta y título:**
- [ ] `<title>` único y descriptivo (50-60 caracteres)
- [ ] `<meta name="description">` único (150-160 caracteres)
- [ ] `lang` definido en `<html>`
- [ ] `<meta charset="UTF-8">` presente
- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1">`

**Open Graph:**
- [ ] `og:title`, `og:description`, `og:image` presentes
- [ ] `og:image` con dimensiones 1200×630px mínimo
- [ ] `twitter:card` definido

**Contenido:**
- [ ] Texto de botones y CTAs descriptivos y únicos en contexto
- [ ] Datos estructurados (JSON-LD) cuando aplique (productos, artículos, org)
- [ ] URLs semánticas (no `/page?id=123`)
- [ ] Canonical URL definida

### Dominio 4 — Interacción y UX

**Estados de UI:**
- [ ] Todos los botones tienen estados: default, hover, focus, active, disabled
- [ ] Todos los inputs tienen estados: default, focus, error, success, disabled
- [ ] Los estados de carga son visibles y accesibles (no solo spinners sin texto)

**Feedback al usuario:**
- [ ] Confirmación visible tras acciones importantes (submit, delete, save)
- [ ] Mensajes de error descriptivos y cercanos al origen del error
- [ ] Estados vacíos diseñados (empty states) en listas y tablas

**Scroll y navegación:**
- [ ] Skip-to-main-content link para usuarios de teclado
- [ ] Sin scroll hijacking sin justificación y sin opt-out
- [ ] Anchors internos con `scroll-behavior: smooth` y respeto a `prefers-reduced-motion`

**Formularios:**
- [ ] `autocomplete` en campos de nombre, email, teléfono, dirección
- [ ] Validación en tiempo real con feedback claro
- [ ] Submit button no se deshabilita durante validación (solo durante envío)
- [ ] Prevención de doble submit

**Responsividad:**
- [ ] Layout funcional en 320px de ancho mínimo
- [ ] Texto no se corta ni desborda en ningún breakpoint
- [ ] Imágenes con `max-width: 100%` o equivalente
- [ ] No hay scroll horizontal no intencionado

---

## Ejemplo de uso

```
Usuario: /web-design-guidelines [pega el componente ContactForm.tsx]

Claude (con esta skill): Auditando ContactForm.tsx...

## Audit Report — ContactForm.tsx

### Resumen
- Críticos: 2
- Importantes: 3
- Sugerencias: 4
- Score accesibilidad: 62/100

### CRÍTICOS

[WCAG-001] Input email sin label asociado
- Línea 14: <input type="email" placeholder="tu@email.com" />
- Fix: Añadir <label for="email">Email</label> o aria-label

[WCAG-002] Botón de submit sin texto accesible
- Línea 28: <button><ArrowIcon /></button>
- Fix: <button aria-label="Enviar formulario"><ArrowIcon /></button>
...
```

## Dependencias

- Ninguna externa (análisis estático de código)
- Para auditoría visual con captura de pantalla: requiere Playwright
- Se usa idealmente como paso final después de [[frontend-design]], [[uiux-pro-max]] e [[impeccable]]
