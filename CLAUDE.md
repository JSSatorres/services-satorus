# Satorus — Guía de proyecto para Claude

## Stack

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: CSS global puro (sin Tailwind utilities en componentes, solo `@tailwind base/components/utilities` como reset)
- **Fuentes**: `Instrument Serif` (serif / italic display), `Inter` (sans body), `JetBrains Mono` (mono)
- **Variables CSS**: `--font-serif`, `--font-sans`, `--font-mono`

## Estructura de componentes

```
app/
  layout.tsx          — fuentes + metadata
  globals.css         — todo el sistema de diseño (tokens, utilidades, componentes CSS)
  page.tsx            — orquesta todos los bloques

components/
  Ambient.tsx         — canvas dots, glows, cursor glow (client)
  Hero.tsx            — Nav + Hero + AgentTerminal animado (client)
  Problem.tsx         — Stats (contadores) + Marquee + Problem cards (client)
  Services.tsx        — 3 service cards
  AaaSShowcase.tsx    — constelación de agentes SVG animada
  Methodology.tsx     — Capas (5 layers) + Proceso (4 pasos)
  Contact.tsx         — ContactSection + Footer
```

## Sistema de diseño (tokens CSS)

```css
--bg:        #050505   /* fondo base */
--surface:   #0E0E0E   /* cards */
--line:      rgba(255,255,255,.07)
--line-2:    rgba(255,255,255,.12)
--ink:       #F4F2EE   /* texto principal */
--ink-2:     #C9C6BE   /* texto secundario */
--ink-3:     #8C8A82   /* texto dim */

--orange:    #FF5A1F   /* acento primario */
--orange-2:  #FF8A4A
--amber:     #F0A030
--yellow:    #E8C547
--mint:      #6FDFA0
--lime:      #B4E04C

--radius:    18px
--radius-lg: 28px
--serif:     var(--font-serif), "Instrument Serif", serif
--sans:      var(--font-sans), "Inter", system-ui, sans-serif
--mono:      var(--font-mono), "JetBrains Mono", monospace
--ease:      cubic-bezier(.2,.7,.2,1)
--ease-out:  cubic-bezier(.16,1,.3,1)
```

## Convenciones de clases CSS

- Clases BEM propias en `globals.css`: `.nav__inner`, `.hero__title`, `.scard`, `.pcard`, `.layer`, etc.
- Clases de utilidad inline: `.mono`, `.small`, `.dim`, `.serif`
- Variantes de color via `data-accent="orange|amber|mint|lime"` en tarjetas
- Animaciones de entrada: `.reveal-line > span` (rise), `.aline.on` (fade-up), `[data-reveal].is-visible`
- Scroll reveal: `IntersectionObserver` en cliente añade `.is-visible` a `.pcard`, `.layer`, `.proceso__rail`

## Tipografía

- **Headings** (`section-title`, `hero__title`, `capas__title`): `var(--serif)` italic, `font-weight: 400`
- **Body**: `var(--sans)`, `16px`, `line-height: 1.55`
- **Monospace** (labels, chips, métricas): `var(--mono)` + clase `.mono`
- **Eyebrows**: `.eyebrow` — mono uppercase, color `--orange`, con punto animado `.eyebrow__dot`

## Secciones y anchors

| Sección      | ID           |
|-------------|--------------|
| Hero        | `#top`       |
| Problema    | `#problema`  |
| Servicios   | `#servicios` |
| AaaS        | `#aaas`      |
| Arquitectura| `#capas`     |
| Proceso     | `#proceso`   |
| Contacto    | `#contacto`  |

## Paleta de acento por sección

- Hero / Servicios card 1: `--orange`
- Servicios card 2 / Layer L4: `--amber`
- AaaS / Layer L2: `--mint`
- Servicios card 3 (featured) / Layer L1: `--lime`
- Layer L3: `--yellow`

## Patrones de animación

- **Canvas dots**: 60 partículas flotantes en `Ambient.tsx`, `rgba(255,240,220)`
- **Cursor glow**: `div.cursor-glow` seguido con lerp 0.12 vía `pointermove`
- **Hero terminal**: script de 8 líneas que se reproduce en bucle con delays variables, reinicia a los 3s
- **Hero parallax**: `hero__right` + callouts se mueven suavemente con el puntero
- **Marquee**: `scrollx` 36s, tipografía serif italic, separadores naranja
- **Wire animation**: SVG `stroke-dashoffset` en `.aaas__hub`
- **Layer pulse**: barra blanca vertical que baja por cada `.layer` escalonada

## Lo que NO hacer

- No usar Tailwind utility classes en los componentes — todo va en `globals.css`
- No usar `font-weight: 700` en headings serif — el peso es `400` (la cursiva ya da jerarquía)
- No añadir sombras de color que no sean las ya definidas (orange/lime glows)
- No cambiar la paleta base: fondo near-black `#050505`, no grises azulados
- No importar `Link` de Next.js para anchors internos — usar `<a href="#section">`
