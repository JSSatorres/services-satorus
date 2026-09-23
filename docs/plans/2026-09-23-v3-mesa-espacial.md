# v3 — El home como mesa espacial

**Goal:** Que el home se recorra como una mesa de trabajo vista desde una cámara: cada
sección es una estación sobre una mesa azul, unidas por el cable naranja, y moverse de una
a otra es un vuelo (la cámara se levanta, se inclina, se desplaza y se posa). Sensación de
espacio sin 3D real: capas planas con `perspective`, `rotateX/Y` y `translateZ`.

**Rama:** `feature/v3-web-interactiva` (sale de `development`, idéntica a `main`).

## Arquitectura

| Pieza | Archivo |
| --- | --- |
| Controlador de cámara, entradas (rueda, táctil, teclado, enlaces) y estaciones | `components/spatial/spatial-home.tsx` |
| Geometría de la mesa (posición de estaciones, trazado del cable) | `components/spatial/table-layout.ts` |
| Objetos de la mesa (cable, fotos, etiquetas) | `components/spatial/table-decor.tsx` |
| Minimapa y anterior/siguiente | `components/spatial/spatial-compass.tsx` |
| Estación "Cómo trabajamos" (el cable se tira solo al llegar) | `components/spatial/spatial-process.tsx` |
| Estación "Tu competencia tampoco" (el remate cae como un sello) | `components/spatial/spatial-plain-talk.tsx` |
| Aterrizaje de las páginas interiores tras el picado | `components/spatial/spatial-landing.tsx` |
| Puente con el header (`navigateSpatial`, estación activa) | `lib/spatial-nav.ts` |
| Contenido compartido del home | `lib/home-content.ts` |
| Estilos | `app/spatial.css` |

- **Modo mesa vs. documento plano.** El servidor renderiza el documento vertical. El
  script `beforeInteractive` de `layout.tsx` pone `html[data-spatial="on"]` (y
  `data-spatial-intro` si no hay hash) antes de pintar cuando hay movimiento permitido;
  `app/spatial.css` convierte entonces el documento en mesa. Con
  `prefers-reduced-motion` o sin JS se queda como documento plano con todo el contenido.
- **Estaciones.** Una pantalla cada una, en una rejilla en serpiente (`STATION_SPOTS`). Si
  el contenido no cabe, la estación tiene scroll propio; la rueda o el gesto sólo lanzan el
  vuelo cuando la estación ya está en el borde **al empezar** el gesto.
- **Vuelo.** GSAP: el mundo se traslada y la cámara hace `scale` + `rotationX/Y/Z` hacia
  arriba y de vuelta a la identidad. La alfombrilla de corte sólo se desplaza el resto de
  una baldosa (`syncMat`).
- **Enlaces.** Un listener en captura atiende `#id`, `/#id` y `/` (vuelo) y los enlaces
  internos (picado de cámara + `router.push`). El header comprueba `defaultPrevented`.
- **Llegadas.** Primera visita: la cámara baja desde la vista de la mesa entera. Vuelta
  desde otra página o entrada con hash: la cámara se echa hacia atrás desde cerca. El botón
  "atrás" devuelve a la estación de la que se salió; el logo lleva al inicio.

## Verificación hecha

- `npx tsc --noEmit`, `npm run lint` y `npm run build` sin errores.
- En navegador a 1440×900, 1158×1222 y 390×844: intro, vuelo entre estaciones, las siete
  estaciones en reposo, scroll interno + vuelo en el borde, picado a `/productos` y vuelta
  al home, y modo plano con movimiento reducido.

## Pendiente

- Probar en dispositivos táctiles reales (iOS Safari y Android Chrome): gestos, barra de
  direcciones y rendimiento del vuelo.
- Componentes del home anterior que ya no usa la portada (`SectionCurtainStack`,
  `ProcessRoute`, `PlainTalk`, `InteractiveFrictions`…): decidir si se borran.
- `DESIGN.md` todavía describe la portada anterior.
