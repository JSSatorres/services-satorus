---
name: skill-creator
description: Permite crear skills personalizadas mediante una entrevista estructurada. Claude define el SKILL.md, genera pruebas y valida los resultados. Ideal para codificar tokens de diseño y guías de marca propias.
metadata:
  type: skill
  source: Anthropic official
---

# Skill Creator

## ¿Qué hace?

Guía al usuario a través de un proceso de entrevista para crear una nueva skill personalizada. Al final del proceso genera:
- El archivo `SKILL.md` completo y funcional
- Una carpeta de recursos de apoyo si son necesarios
- Un conjunto de casos de prueba para validar la skill

Especialmente útil para codificar sistemas de diseño propios, guías de marca, o flujos de trabajo recurrentes que no están cubiertos por las skills existentes.

## Cuándo se activa (triggers)

- El usuario dice "quiero crear una skill", "necesito una skill personalizada"
- El usuario quiere codificar los tokens de su marca o sistema de diseño
- El usuario tiene un flujo de trabajo repetitivo que quiere sistematizar
- El usuario dice "guárdame esto como skill" o "conviértelo en un comando"
- Después de definir un sistema de diseño exitoso que vale la pena reusar

## Instrucciones de uso

### Proceso de entrevista (4 fases)

#### Fase 1 — Definición del problema

Preguntar al usuario:
1. ¿Qué problema concreto resuelve esta skill?
2. ¿Qué haría Claude sin esta skill que es incorrecto o genérico?
3. ¿Hay un nombre claro y descriptivo para esta skill?

#### Fase 2 — Contexto y conocimiento

Preguntar al usuario:
1. ¿Qué información específica debe tener Claude para ejecutar esta skill?
   (tokens de color, fuentes, componentes, reglas de negocio, etc.)
2. ¿Hay ejemplos concretos de input/output ideal?
3. ¿Qué debe estar explícitamente prohibido?

#### Fase 3 — Estructura de activación

Preguntar al usuario:
1. ¿Cuándo debe activarse? (triggers: palabras clave, comandos, contextos)
2. ¿Cuándo NO debe activarse?
3. ¿Qué formato debe tener la respuesta?

#### Fase 4 — Generación y validación

1. Generar el `SKILL.md` completo
2. Presentarlo al usuario para revisión
3. Sugerir 3 casos de prueba para validar que funciona correctamente
4. Ajustar según feedback

### Estructura del SKILL.md generado

```markdown
---
name: [nombre-kebab-case]
description: [una línea que describe qué hace y cuándo se usa — para el índice]
metadata:
  type: skill
  source: [proyecto / empresa / custom]
---

# [Nombre legible]

## ¿Qué hace?
[Descripción de 2-3 párrafos]

## Cuándo se activa (triggers)
- [trigger 1]
- [trigger 2]
- [trigger 3]

## Instrucciones de uso
[Proceso paso a paso]

## Reglas
[Lo que Claude DEBE hacer]
[Lo que Claude NUNCA debe hacer]

## Ejemplos
[Input → Output concretos]

## Recursos de referencia
[Links a archivos de apoyo si los hay]

## Dependencias
[Herramientas, servicios o skills relacionadas]
```

## Caso de uso principal: Skill de marca propia

El uso más valioso en diseño web es crear una skill que codifique el sistema de diseño de un proyecto específico:

```
Usuario: Quiero crear una skill con el design system de mi startup "Satorus"

Claude (con esta skill): Perfecto, vamos a crear la skill "satorus-design-system".
Necesito hacerte algunas preguntas...

[Entrevista guiada]

Resultado: .claude/skills/satorus-design-system/SKILL.md
Con: colores de marca, tipografías elegidas, tokens CSS,
reglas de componentes, anti-patterns específicos del proyecto
```

## Checklist de calidad para skills generadas

Antes de guardar una skill, verificar:
- [ ] El nombre es kebab-case y descriptivo
- [ ] La descripción de una línea explica cuándo usarla (no solo qué hace)
- [ ] Los triggers son específicos (no "cuando el usuario pide diseño")
- [ ] Las instrucciones son ejecutables paso a paso
- [ ] Hay al menos 1 ejemplo de input/output
- [ ] Las reglas prohibitivas son concretas (no "no hacer cosas malas")
- [ ] Las dependencias externas están documentadas

## Estructura de carpeta recomendada para skills custom

```
.claude/skills/[nombre-skill]/
├── SKILL.md              (cerebro — siempre requerido)
├── tokens.css            (tokens de diseño — si aplica)
├── components.md         (referencia de componentes — si aplica)
├── examples/             (ejemplos de input/output)
│   ├── example-1.md
│   └── example-2.md
└── references/           (recursos de inspiración o documentación)
    └── brand-guide.md
```

## Dependencias

- Nativa de Claude Code — no requiere instalaciones externas
- Skills relacionadas que se pueden crear con este flujo: [[frontend-design]], [[uiux-pro-max]]
