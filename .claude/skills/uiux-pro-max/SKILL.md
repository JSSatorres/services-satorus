---
name: uiux-pro-max
description: Base de datos de inteligencia de diseño con 161 reglas por industria, paletas de colores curadas, pares de fuentes validados y guías para 13 text stacks. Genera sistemas de diseño inteligentes antes de escribir código.
metadata:
  type: skill
  source: Marketplace community
---

# UIUX Pro Max Skill

## ¿Qué hace?

Actúa como una base de datos de criterio de diseño. Cuando se activa, Claude consulta internamente las reglas y sistemas de la industria relevante para el proyecto antes de tomar cualquier decisión visual.

Incluye:
- 161 reglas de diseño específicas por industria
- Paletas de colores curadas por sector
- Pares tipográficos validados para cada contexto
- Guías para 13 text stacks (combinaciones tipográficas)
- Checklist de accesibilidad automática

## Cuándo se activa (triggers)

- El usuario define la industria o tipo de producto (SaaS, e-commerce, fintech, salud, etc.)
- El usuario pide un "sistema de diseño" o "design system"
- Antes de elegir paleta de colores o tipografía en cualquier proyecto nuevo
- Cuando el usuario pide coherencia visual en múltiples páginas/componentes

## Instrucciones de uso

### Paso 1 — Identificar industria y contexto

Antes de aplicar reglas, identificar:
- **Industria:** (SaaS / E-commerce / Fintech / Salud / Educación / Agencia creativa / Portfolio / Startup / Corporativo)
- **Público objetivo:** (consumidor B2C / profesional B2B / técnico / creativo)
- **Objetivo principal:** (conversión / retención / información / portfolio / confianza)

### Paso 2 — Aplicar sistema de diseño relevante

Ver [design-intelligence.md](./design-intelligence.md) para el catálogo completo.

### Paso 3 — Generar tokens de diseño

Antes de codificar, generar el sistema de tokens:

```css
/* Generado por UIUX Pro Max para [industria] */
:root {
  /* Tipografía */
  --font-heading: '[Familia serif/display]', serif;
  --font-body: '[Familia sans]', sans-serif;
  --font-mono: '[Familia mono]', monospace;

  /* Escala tipográfica (Major Third — ratio 1.25) */
  --text-xs: 0.64rem;    /* 10.24px */
  --text-sm: 0.8rem;     /* 12.8px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.25rem;    /* 20px */
  --text-xl: 1.563rem;   /* 25px */
  --text-2xl: 1.953rem;  /* 31.25px */
  --text-3xl: 2.441rem;  /* 39px */
  --text-4xl: 3.052rem;  /* 48.8px */

  /* Colores */
  --color-primary: [hex];
  --color-primary-light: [hex];
  --color-primary-dark: [hex];
  --color-secondary: [hex];
  --color-accent: [hex];
  --color-background: [hex];
  --color-surface: [hex];
  --color-text-primary: [hex];
  --color-text-secondary: [hex];
  --color-text-muted: [hex];

  /* Espaciado (base 4px) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-24: 6rem;     /* 96px */

  /* Bordes */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Sombras */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

## Reglas por categoría (resumen)

Ver catálogo completo en [design-intelligence.md](./design-intelligence.md).

### Reglas universales (aplican a todas las industrias)

1. El contraste de texto sobre fondo debe ser mínimo 4.5:1 (WCAG AA)
2. Nunca usar más de 3 familias tipográficas en un mismo proyecto
3. El tamaño mínimo de texto en body es 16px en desktop, 15px en mobile
4. Todo elemento interactivo debe tener estado hover, focus y active definidos
5. El CTA principal debe ser el elemento visualmente más prominente de cada sección
6. Los espacios en blanco son elementos de diseño, no "vacíos"
7. La jerarquía visual debe ser legible en 3 segundos sin leer el texto

### Reglas para SaaS / Tech

- Color primario con connotación de confianza y precisión (azules profundos, verdes oscuros)
- Tipografía: sans-serif de alta legibilidad para body, display/geometric para headings
- Espaciado generoso en hero (padding-top mínimo 120px)
- Dashboard: densidad alta pero con separación clara de secciones
- Precio: tipografía grande, bold, con contraste máximo

### Reglas para E-commerce

- Imágenes de producto: fondo neutro, iluminación consistente
- CTA de compra: color de acento fuerte, siempre visible en mobile
- Tipografía de precio: siempre más grande que el nombre del producto
- Confianza: elementos de social proof cerca del CTA
- Móvil: botón de compra fijo en bottom con safe area respetada

### Reglas para Fintech / Banca

- Paleta: azul marino / verde oscuro / gris frío (proyectan seguridad y precisión)
- Cero decoración superflua: el diseño comunica seriedad
- Tipografía: serif para headlines (autoridad), sans para datos
- Números y datos: siempre en monospace o tabular figures
- Formularios: campos amplios, labels siempre visibles (no placeholder-only)

### Reglas para Agencia Creativa / Portfolio

- Personalidad visual fuerte: puede romper el grid intencionadamente
- Tipografía expresiva: display fonts con carácter editorial
- Animaciones: justificadas, no decorativas; cada una refuerza la narrativa
- Color: puede ser arriesgado pero con coherencia sistémica
- Trabajo propio (galería): protagonista absoluto, la UI en segundo plano

## Pares tipográficos por industria

| Industria | Heading | Body | Carácter |
|-----------|---------|------|----------|
| SaaS Tech | Plus Jakarta Sans | Inter → **prohibido**, usar DM Sans | Moderno, legible |
| Fintech | Playfair Display | Source Sans 3 | Autoridad + legibilidad |
| Salud | Merriweather | Open Sans | Confianza + calidez |
| Agencia creativa | Editorial New / Cormorant | Neue Haas Grotesk → Outfit | Editorial + impacto |
| E-commerce lujo | Cormorant Garamond | Jost | Elegancia + modernidad |
| E-commerce masivo | Nunito / Quicksand | Lato | Accesible + amigable |
| Portfolio dev | JetBrains Mono (headings) | IBM Plex Sans | Técnico + limpio |
| Startup B2B | Syne | Manrope | Disruptivo + profesional |
| Educación | Libre Baskerville | Nunito | Académico + amigable |
| Corporativo | Crimson Pro | Roboto | Clásico + universal |

## Paletas curadas por industria

Ver [design-intelligence.md](./design-intelligence.md) — Sección "Paletas".

## Ejemplo de uso

```
Usuario: Estoy construyendo un SaaS de gestión de proyectos para equipos remotos

Claude (con esta skill): Aplicando UIUX Pro Max para SaaS B2B / gestión de trabajo...

Sistema de diseño generado:
- Tipografía: Plus Jakarta Sans (headings) + DM Sans (body)
- Paleta: #0F172A (base) / #3B82F6 (primario) / #10B981 (éxito/acento)
- Espaciado: grid 8px, secciones 96px vertical
- Tokens CSS: [generados]
```

## Dependencias

- Ninguna externa
- Se potencia combinada con: [[frontend-design]], [[impeccable]], [[web-design-guidelines]]
