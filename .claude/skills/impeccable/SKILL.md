---
name: impeccable
description: Suite de más de 20 comandos especializados para pulir UI de forma iterativa. Usa heurísticas de diseño para refinar, simplificar, potenciar o criticar componentes existentes.
metadata:
  type: skill
  source: Impeccable marketplace
---

# Impeccable Skill

## ¿Qué hace?

Proporciona un conjunto de comandos de refinamiento iterativo para UI. Cada comando actúa como un modo de pensamiento especializado que aplica heurísticas específicas al componente o página en revisión.

No genera desde cero — refina lo que ya existe con criterio de diseñador senior.

## Cuándo se activa (triggers)

- El usuario usa cualquiera de los comandos listados (ej: `/optimize`, `/quiet`)
- El usuario dice "refina esto", "mejora el diseño", "está demasiado recargado"
- El usuario pide "quitar ruido visual", "hacerlo más impactante", "revisar la UI"
- En la fase de polish después de un diseño inicial

## Comandos disponibles

Ver referencia completa en [commands-reference.md](./commands-reference.md).

### Comandos principales

| Comando | Acción |
|---------|--------|
| `/optimize` | Optimiza rendimiento visual: elimina elementos redundantes, mejora jerarquía |
| `/quiet` | Reduce ruido visual: menos colores, menos sombras, más espacio en blanco |
| `/bolder` | Aumenta impacto visual: tipografía más grande, contraste más fuerte |
| `/delight` | Añade micro-interacciones y detalles que generan placer de uso |
| `/critique` | Auditoría completa con heurísticas de Nielsen + principios Gestalt |
| `/accessible` | Revisión WCAG: contraste, tamaños mínimos, estructura semántica |
| `/responsive` | Adapta el diseño para mobile-first con breakpoints justificados |
| `/consistent` | Unifica tokens visuales (espaciado, colores, tipografía) en todo el componente |
| `/editorial` | Aplica principios de diseño editorial: ritmo tipográfico, columnas, márgenes |
| `/minimal` | Lleva el diseño al mínimo funcional: elimina todo lo no esencial |
| `/dense` | Aumenta densidad de información manteniendo legibilidad |
| `/spacious` | Aumenta respiración visual con espaciado generoso |
| `/modern` | Actualiza patrones visuales a tendencias actuales (2024-2025) |
| `/classic` | Aplica principios atemporales: tipografía clásica, grid basado en columnas |
| `/dark` | Convierte a dark mode con contraste apropiado |
| `/light` | Convierte a light mode con profundidad mediante sombras sutiles |

## Instrucciones de uso

### Modo de operación

Cuando se activa un comando:

1. **Analizar** el componente actual contra las heurísticas del comando
2. **Listar** los problemas encontrados (máximo 5, priorizados por impacto)
3. **Aplicar** los cambios con justificación breve por cada uno
4. **Mostrar** diff de cambios o código completo actualizado

### Formato de respuesta para `/critique`

```markdown
## Critique Report

### Problemas críticos (bloquean la UX)
1. [Problema] — [Heurística violada] — [Fix propuesto]

### Problemas moderados (degradan la experiencia)
1. [Problema] — [Heurística violada] — [Fix propuesto]

### Oportunidades de mejora
1. [Oportunidad] — [Principio de diseño] — [Implementación sugerida]

### Score estimado
- Usabilidad: X/10
- Consistencia visual: X/10
- Accesibilidad: X/10
```

## Ejemplo de uso

```
Usuario: /quiet [pega componente Hero]

Claude (con esta skill): Aplicando /quiet al componente Hero...

Problemas de ruido detectados:
1. Gradiente de fondo con 3 colores — simplificando a color sólido + opacidad
2. 4 pesos de fuente distintos — reduciendo a 2 (regular + bold)
3. Sombra en tarjeta + borde + fondo coloreado (triple énfasis) — eliminando sombra

[código actualizado]
```

## Dependencias

- **Playwright** (npm): requerido para el comando `/critique` con captura visual
  ```bash
  npm install -D playwright
  npx playwright install chromium
  ```
- Sin Playwright, todos los comandos funcionan en modo análisis-de-código

## Combinaciones recomendadas

- Usar [[frontend-design]] primero para definir el sistema visual
- Usar `/critique` para auditar, luego `/quiet` o `/bolder` para iterar
- Combinar con [[web-design-guidelines]] para validación técnica final
