# Reels de Instagram de Satorus Implementation Plan

**Goal:** Producir 4 Reels permanentes (1080×1920, unos 40 s) para el Instagram de Satorus, con su portada, pie de publicación, texto alternativo e instrucciones para el agente que los publique. Las escenas reutilizan y adaptan en vertical las animaciones de la web.

**Architecture:** Carpeta autónoma `media/instagram/publicaciones/`, fuera de la app de Next.js. Cada escena es un HTML sin build que usa el motor común `_compartido/story.js` (línea de tiempo con fotogramas en segundos absolutos, bucle, modo `?grabar=1` con `window.__story.seek(ms)` y zona segura de Reels). `_compartido/grabar.mjs` graba cada escena fotograma a fotograma con Playwright, monta cada reel con ffmpeg (fundidos `xfade` de 0,4 s y pista AAC en silencio) y renderiza las portadas. El motor y el script parten de la implementación de Pidoteca (`D:\Proyectos\pideya\media\instagram\publicaciones\`), con toda la marca cambiada a Satorus.

**Tech Stack:** HTML + CSS + Web Animations API, fuentes locales de `@fontsource-variable` (Bricolage Grotesque, Atkinson Hyperlegible Next, Caveat), Playwright 1.61.1 (devDependency nueva), ffmpeg/ffprobe.

## Perfil de verificación

- Nivel: standard
- Motivo: material público de marca; no toca la web, pero cada texto tiene que cumplir `PRODUCT.md` y cada fotograma la zona segura.
- Comandos: `node media/instagram/publicaciones/_compartido/grabar.mjs --preview <dir>` (capturas al 20/45/70/99 %, comprobación automática de zona segura y avisos de consola), `node media/instagram/publicaciones/_compartido/grabar.mjs`, `ffprobe` de los cuatro `reel.mp4`.
- Evidencias esperadas: hojas de contacto revisadas sin solapes ni cortes; 4 reels H.264 + AAC 1080×1920 de 35 a 50 s; ninguna escena con avisos de consola.

## Inventario de animaciones de la web

| Componente | Qué cuenta | ¿Sirve en vertical? |
|---|---|---|
| `components/hero-kinetic-lockup.tsx` | Letras de `satorus.es` que caen sobre una placa azul, órbita dibujada, registro de imprenta y lema «Tu negocio puede llegar más lejos.» | Sí: apertura del reel 01. |
| `components/interactive-frictions.tsx` | Foto de la mesa enredada, cinta «¿Te suena?» y baraja diagonal de cuatro fricciones. | Sí: la baraja se apila bien en vertical. Reel 01. |
| `components/business-bottleneck.tsx` | «Ahora» (ventanas y notas sueltas) frente a «Con Satorus», «Menos caos. Más avance.» | Parcial: el lado «Con Satorus» es un panel tipo dashboard, que `DESIGN.md` rechaza. Se usa solo la idea y el titular, contado con la regla del libro (notas a mano que se asientan en una hoja limpia). Reel 01. |
| `components/service-showcase.tsx` | Libro mayor de tres servicios y sus demos: web antes/después, notas que se ordenan en una herramienta, consulta que fluye por un cable. | Sí: libro mayor (reel 01), demo web (reel 02) y demo de pedido (reel 03). |
| `components/plain-talk.tsx` + `components/route-sketch.tsx` | Frase que crece y boceto «Esperar → Avanzar». | Sí: el mecanismo de frase que crece y el boceto abren el reel 02. El texto «La IA no va a esperarte…» se descarta: es un argumento de miedo sin pruebas. |
| `components/mobile-flow-reveal.tsx` | Consulta → borrador con IA → tú revisas, con un tirador que descubre la foto ordenada. | Sí, ya es móvil. Reel 03. |
| `components/process-route.tsx` + `lib/home-content.ts` | Cuatro pasos unidos por la ruta naranja, con respuesta corta y foto. | Sí: reel 04. |
| `components/book/book-pages.tsx` + `lib/book-content.ts` | El libro: lista de problemas tachados con su pieza, «Lo que nos piden», pasos con «Te llevas», «Arreglado por Satorus». | Sí: reels 03 y 04. Se descartan la reseña de 2 estrellas (parece una reseña real) y la gráfica «Dos caminos» (promete crecimiento sin datos). |
| `components/project-showcase.tsx` + `lib/project-catalog.ts` | Proyectos reales con capturas: Enrolla2, Ángel Mendoza, Pidoteca, GoblinTrader… | Parcial: solo las capturas móviles de las dos webs (reel 02), presentadas como trabajos de Satorus, sin cifras ni opiniones. |
| `components/pidoteca-journey-scene.tsx` | Recorrido de pedido de Pidoteca. | No: es la historia de otro producto y ya tiene sus propios reels. |
| `components/desktop-scroll-story.tsx`, `section-curtain-stack.tsx`, `scroll-progress-rail.tsx`, `masked-headings.tsx` | Mecánica de scroll y relevo entre secciones. | No: son transiciones de página, no cuentan nada por sí solas. |

## Los 4 reels

Cada escena tiene un solo mensaje. Cierre común de 3,5 s: símbolo y `satorus.`, «Tu negocio puede llegar más lejos.», `satorus.es` y «Enlace en la bio».

| # | Reel | Escenas (s) |
|---|---|---|
| 01 | ¿Qué es Satorus? | Hola, somos Satorus (10) · ¿Te suena? (11) · Menos caos, más avance (11) · Lo que hacemos (11) |
| 02 | Webs que ayudan a vender | Tu web existe (9) · Antes y después (11) · Qué hace una buena web (11) · Webs que hemos hecho (10) |
| 03 | Herramientas a tu medida | Tu lista de problemas (12) · En un solo sitio (10) · Una consulta llega (12) · La IA, donde aporta (10) |
| 04 | Cómo trabajamos | Cuéntalo con tus palabras (11) · Pasos 1 y 2 (12) · Pasos 3 y 4 (12) · La ruta completa (10) |

Orden de publicación: 04, 03, 02, 01 (la cuadrícula muestra primero lo último).

## Restricciones aplicadas

- Nada de cifras de resultado, testimonios ni reseñas. Los números de las escenas («12 mensajes sin contestar») son del ejemplo del libro y van dentro de una escena ilustrativa.
- Las fotos con personas (`process-*.png`) son generadas: llevan la etiqueta «Ilustración». El taller de bicicletas es un ejemplo y se rotula así.
- Sectores, radio, precios y CTA principal no se afirman. El cierre lleva `satorus.es` y «Enlace en la bio», no una oferta.
- Enrolla2 y Ángel Mendoza aparecen porque la web los presenta como trabajos de Satorus; se muestran solo sus capturas, sin opiniones ni resultados. Queda como decisión del propietario confirmar que puede enseñarlos en Instagram.

---

### Task 1: Motor y script compartidos

**Files:** Create `media/instagram/publicaciones/_compartido/{story.js,story.css,portada.css,cierre.html,grabar.mjs,fonts/*,assets/*}`. Modify `package.json` (Playwright como devDependency).

**Steps:** Copiar el motor de Pidoteca y cambiar marca, fuentes locales, logo e iconos. Añadir avisos cuando dos animaciones tocan la misma propiedad de un elemento o pisan un `@keyframes`. Añadir a `--preview` la comprobación automática de zona segura y una hoja de contacto por reel.

### Task 2: Escenas, portadas y cierre

**Files:** Create `NN-tema/escenas/NN-escena/{animacion.html,texto.md}` y `NN-tema/portada.html`.

**Steps:** Maquetar cada escena entre y=250 e y=1660, con el fondo a sangre en capas `.bg-layer`. Revisar las capturas al 20/45/70/99 % y corregir hasta que no haya solapes, cortes ni texto fuera de la zona segura.

### Task 3: Textos de publicación

**Files:** Create `NN-tema/{texto.md,publicacion.json}`, `manifest.json`, `README.md`, `PROMPT-AGENTE.md`.

### Task 4: Grabar y verificar

**Steps:** Grabar escenas, cierre, reels y portadas. Pasar `ffprobe` a los cuatro reels. Revisar la hoja de contacto final: último fotograma de cada escena, portadas, un fotograma en mitad de un fundido y el cierre.

**Resultado:** `--preview` sin avisos en las 16 escenas, el cierre y las 4 portadas. Reels grabados: 01 44,9 s · 02 42,9 s · 03 45,9 s · 04 46,9 s, todos 1080×1920, H.264 yuv420p 30 fps + AAC en silencio. Durante la verificación se corrigió el formato de píxel (las capturas JPEG salían en `yuvj420p` de rango completo; ahora se convierten a `yuv420p` de rango de vídeo).
