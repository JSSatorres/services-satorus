---
name: frontend-design
description: Obliga a Claude a seguir un proceso de diseño (propósito, tono, mood) antes de programar, eliminando la estética genérica de la IA ("AI slop").
metadata:
  type: skill
  source: Anthropic official
---

# Frontend Design Skill

## ¿Qué hace?

Antes de escribir una sola línea de código, activa una fase de diseño estructurado donde Claude define:
- El propósito y audiencia del componente o página
- El tono visual y emocional
- El mood board de referencia
- Las restricciones estéticas (anti-slop)

Genera interfaces de grado de producción con personalidad visual única, evitando los patrones genéricos de IA.

## Cuándo se activa (triggers)

- El usuario pide crear o rediseñar una página, sección o componente visual
- El usuario menciona "landing page", "hero", "UI", "interfaz", "diseño"
- El usuario pide que el resultado "no parezca IA" o "sea de producción"
- Antes de cualquier tarea de frontend donde no se haya definido el sistema visual

## Instrucciones de uso

### Fase 1 — Design Brief (obligatoria antes de codificar)

Antes de escribir código, responde estas preguntas (o pídelas al usuario si no las ha dado):

1. **Propósito:** ¿Qué debe lograr este componente/página? (conversión, información, confianza)
2. **Audiencia:** ¿Quién lo verá? (edad, profesión, nivel técnico, contexto de uso)
3. **Tono emocional:** ¿Cómo debe sentirse el usuario? (confianza, urgencia, calma, sofisticación)
4. **Referencias visuales:** ¿Hay sitios de referencia? (Stripe, Linear, Vercel, etc.)
5. **Restricciones de marca:** ¿Colores, fuentes o patrones prohibidos?

### Fase 2 — Design Decisions (documentar antes de codificar)

Define y documenta en un bloque `design.md` antes del código:

```markdown
## Design Decisions

### Tipografía
- Heading: [Familia] — Razón: [por qué esta fuente]
- Body: [Familia] — Razón: [por qué esta fuente]
- PROHIBIDO: Inter, Arial, sistema por defecto

### Color
- Primario: [hex] — Rol: [acción principal]
- Secundario: [hex] — Rol: [apoyo, backgrounds]
- Acento: [hex] — Rol: [llamadas a la acción, highlights]
- PROHIBIDO: degradados púrpura genéricos (#7C3AED range sin justificación)

### Espaciado
- Base unit: [4px / 8px]
- Sección padding: [valor]
- Filosofía: [generoso/compacto/editorial]

### Componentes clave
- [Lista de decisiones de componentes con justificación]
```

### Fase 3 — Código

Solo después de tener el Design Brief completo, generar el código siguiendo exactamente las decisiones tomadas.

## Reglas anti-slop (siempre activas)

```
NUNCA usar:
- Fuente Inter como primera opción
- Fuente Arial
- Degradados de #7C3AED a #EC4899 (purple-to-pink)
- Tarjetas con border-radius: 12px + box-shadow suave en fondo blanco como patrón único
- Avatares de placeholder genéricos
- Iconos de stock sin coherencia visual
- Secciones "Features" con 3 columnas iguales sin jerarquía

SIEMPRE:
- Definir un par tipográfico con carácter antes de codificar
- Justificar cada decisión de color con su rol funcional
- Aplicar jerarquía visual real (tamaños, pesos, espaciado)
- Diseñar estados hover/focus/active para elementos interactivos
```

## Ejemplo de uso

```
Usuario: Crea una landing page para mi SaaS de análisis de datos

Claude (con esta skill): Antes de codificar, necesito definir el sistema visual.
¿Cuál es el tono que buscas — más técnico/serio como Linear, 
más cálido/accesible como Notion, o algo diferente?
¿Tienes restricciones de marca (colores, fuentes)?
```

## Dependencias

- Ninguna externa
- Compatible con cualquier stack (Next.js, React, HTML puro, etc.)
- Se potencia combinada con: [[uiux-pro-max]], [[impeccable]], [[web-design-guidelines]]
