# Reels de proyectos de Satorus Implementation Plan

**Goal:** Un Reel vertical (1080×1920, unos 42 s) por cada proyecto de `/productos`: GoblinTrader, Pidoteca, Lector Bilingüe, SportApp, Ángel Mendoza y Enrolla2. Fotos ilustrativas nuevas, más cuidadas, parecidas a las de la web, y capturas reales de cada proyecto.

**Architecture:** Segunda serie dentro de `media/instagram/publicaciones/` (reels 05 a 10) con el mismo motor (`_compartido/story.js`), el mismo cierre y el mismo `grabar.mjs`. Las 24 escenas salen de una plantilla común (`_compartido/proyectos.mjs`) con los textos de `lib/project-catalog.ts`, así que la serie es coherente y se corrige en un solo sitio. Cada `animacion.html` generado sigue siendo autónomo.

**Tech Stack:** Codex CLI (generación de imágenes con la sesión de ChatGPT) para las fotos; `_compartido/componer.mjs` (sharp) para incrustar capturas reales en pantallas verdes con perspectiva; Playwright y ffmpeg para grabar.

## Perfil de verificación

- Nivel: standard
- Comandos: `node media/instagram/publicaciones/_compartido/grabar.mjs --preview <dir> --solo <reel>`, grabación completa, `ffprobe`, `--revision`.
- Evidencias: hojas de contacto sin avisos ni solapes; 6 reels H.264 yuv420p + AAC de 35 a 50 s; portadas con lo importante en el cuadrado central.

## Reglas de honestidad (PRODUCT.md)

- Se llaman «proyectos», no «casos de éxito»: no hay resultados medidos ni testimonios. Los textos son los de la web (reto, qué mejoramos, por qué así), sin cifras nuevas.
- Las fotos generadas son escenas del sector, sin personas reconocibles ni productos de clientes (nada de Ángel Mendoza ni de los rolls de Enrolla2), y llevan la etiqueta «Ilustración».
- Lo que sale en las pantallas son siempre capturas reales del proyecto.
- GoblinTrader, Ángel Mendoza y Enrolla2 son clientes: conviene confirmar su permiso para publicarlos en Instagram.

## Estructura de cada reel

| Escena | Duración | Qué cuenta |
|---|---|---|
| 1 · Gancho | 9 s | Foto de ambiente a sangre, nombre del proyecto, sector y el problema en una frase. |
| 2 · El reto | 10 s | Piezas sueltas que la ruta naranja ordena en un solo recorrido (motivo de `process-route.tsx` y del libro). |
| 3 · Lo que construimos | 11 s | Foto con el dispositivo y la captura real incrustada, la mejora y los módulos. |
| 4 · Por qué así | 10 s | Más capturas reales en marcos de móvil o navegador, el motivo y dónde verlo. |
| Cierre | 3,5 s | El común de la serie 1. |

---

### Task 1: Fotos

`_compartido/assets/generadas/generar.sh` (Codex) → `*-ambiente.png` y `*-dispositivo.png`; `componer.mjs` → `*-compuesta.jpg`. Revisar cada imagen a ojo.

### Task 2: Escenas y portadas

`_compartido/proyectos.mjs` genera `05-…` a `10-…` (escenas, portadas, textos). Revisión con `--preview` hasta «Sin avisos».

### Task 3: Textos y prompt del agente

`texto.md`, `publicacion.json`, `manifest.json` (serie 2) y `PROMPT-AGENTE-PROYECTOS.md`.

### Task 4: Grabar y verificar

**Resultado:** 12 fotos generadas con Codex (6 de ambiente y 6 de dispositivo con pantalla verde) y 6 composiciones con capturas reales. `--preview` sin avisos en las 24 escenas y las 6 portadas. Reels 05 a 10 grabados: 41,9 s cada uno, 1080×1920, H.264 yuv420p 30 fps + AAC en silencio, sin avisos de consola. Hoja final revisada.
