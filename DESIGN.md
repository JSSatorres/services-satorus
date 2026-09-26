---
name: Satorus
description: Un negocio arquitectónico en 3D se abre en capas; la cámara explica cómo una web, una aplicación y sus conexiones dan orden al trabajo.
colors:
  tool-blue: "#2948c7"
  tool-blue-dark: "#0e2bd2"
  action-orange: "#e56748"
  action-orange-dark: "#bd4932"
  label-lime: "#dfe97a"
  bench-graphite: "#171b18"
  graphite-soft: "#2d322e"
  cool-paper: "#f2f1ea"
  paper-muted: "#d9ddd3"
  line: "rgba(16, 20, 17, 0.24)"
typography:
  display:
    fontFamily: '"Bricolage Grotesque Variable", "Arial Narrow", sans-serif'
    fontSize: "clamp(4.8rem, 7.8vw, 8.5rem)"
    lineHeight: 0.82
    letterSpacing: "-0.04em"
    fontVariation: '"wdth" 64, "wght" 800'
  headline:
    fontFamily: '"Bricolage Grotesque Variable", "Arial Narrow", sans-serif'
    letterSpacing: "-0.04em"
    fontVariation: '"wdth" 78, "wght" 790'
  title:
    fontFamily: '"Bricolage Grotesque Variable", "Arial Narrow", sans-serif'
    fontSize: "clamp(2.15rem, 3.1vw, 3.6rem)"
    lineHeight: 0.96
    letterSpacing: "-0.035em"
    fontVariation: '"wdth" 83, "wght" 720'
  body:
    fontFamily: '"Atkinson Hyperlegible Next Variable", Arial, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: '"Atkinson Hyperlegible Next Variable", Arial, sans-serif'
    fontSize: "0.85rem"
    fontWeight: 760
    lineHeight: 1
rounded:
  control: "7px"
  round: "50%"
  pill: "999px"
spacing:
  page: "clamp(1.25rem, 4vw, 4.5rem)"
  section: "clamp(5rem, 9vw, 9rem)"
components:
  button-header:
    backgroundColor: "{colors.label-lime}"
    textColor: "{colors.bench-graphite}"
    rounded: "{rounded.control}"
    padding: "0.65rem 1.1rem"
    height: "44px"
  button-header-hover:
    backgroundColor: "{colors.action-orange}"
    textColor: "{colors.bench-graphite}"
  button-hero:
    backgroundColor: "{colors.action-orange}"
    textColor: "white"
    rounded: "12px 34px 34px 12px"
    padding: "1rem 1.35rem 1rem 1.65rem"
    height: "68px"
  button-hero-hover:
    backgroundColor: "{colors.action-orange-dark}"
    textColor: "white"
  button-form:
    backgroundColor: "{colors.action-orange}"
    textColor: "white"
    rounded: "{rounded.control}"
    padding: "0.9rem 1.1rem 0.9rem 1.25rem"
    height: "60px"
  button-form-hover:
    backgroundColor: "{colors.tool-blue}"
    textColor: "white"
  field-line:
    backgroundColor: "transparent"
    textColor: "{colors.bench-graphite}"
    rounded: "0"
    padding: "0.75rem 0.15rem"
  field-message:
    backgroundColor: "transparent"
    textColor: "{colors.bench-graphite}"
    rounded: "0"
    padding: "0.9rem"
    height: "150px"
---

# Design System: Satorus

## Dirección activa · El negocio en despiece · 25 de septiembre de 2026

Una única arquitectura 3D representa el negocio. La cámara se aproxima al edificio, separa cubierta y paredes para entenderlo, se enfrenta a la fachada, gira al interior y descubre las conexiones bajo el suelo. Al terminar, el conjunto vuelve a ensamblarse.

### Dirección visual
- Carbón vegetal `#202522`, luz ambiental `#4d554c`, papel `#f2f1ea`, latón `#d4ba8e`, roble y piedra con textura fotográfica. Vidrio y aluminio con reflejos físicos.
- Bricolage Grotesque en peso 520 y anchura 90 para titulares; Atkinson para lectura y pequeños rótulos. Tratamiento sobrio, sin personajes, colores de juguete ni tarjetas inclinadas.
- Firma: despiece arquitectónico de un mismo edificio, con geometría a escala de metros. El movimiento explica cada parte del servicio.
- Texto HTML a la izquierda y arquitectura a la derecha. En móvil la arquitectura ocupa la parte superior; los documentos conservan scroll interno.

### Comportamiento y arquitectura
- Three.js se importa bajo demanda; geometría y texturas locales. Mapas fotográficos CC0 de Poly Haven: `oak_veneer_01` y `concrete_wall_001`, créditos en `public/materials/architecture/CREDITS.txt`.
- Ocho capítulos: negocio, método, web, gestión, automatización, proyectos, dudas y contacto. Enlaces nativos y scroll estable; la cámara hace la transición entre destinos.
- Render bajo demanda, DPR limitado, sombras, iluminación ambiental de estudio y materiales físicos. Movimiento reducido presenta cada encuadre sin viajar entre ellos. Pérdida de WebGL conserva la navegación y el contenido HTML.
- Los paneles interactivos permanecen inmóviles: trasladarlos durante el foco puede producir saltos del documento en Chromium.
- Proyectos reales: GoblinTrader, Enrolla2 y Pidoteca. Formulario existente con borrador persistente al cambiar capítulo. Sin inventar métricas ni testimonios.
- Archivos activos: `components/business-world/*`, `app/page.tsx`, `lib/journey-progress.ts`. Las versiones anteriores permanecen sin montar como referencia.
- Las páginas interiores mantienen su diseño. Analytics se monta exclusivamente cuando existe el entorno de Vercel.

### Refinamiento del modelado
Sillas con respaldo curvo, apoyabrazos y ruedas dobles; vegetación de hojas curvas y ramas; sofá con cojines y costuras; herrajes y juntas de carpintería; cubierta de junta alzada, lucernario con marco y luminarias suspendidas. Parquet de longitudes alternadas mediante instancias para no multiplicar llamadas de dibujo.

La piedra del basamento mantiene grano fino y el hormigón de pared utiliza su propio material. El vidrio tiene menor rugosidad y espesor. Se añade oclusión ambiental con exclusión del vidrio y render final con antialiasing; el render sigue siendo bajo demanda y su resolución está limitada por dispositivo.
### Verificación
Build, lint y tres pruebas de cálculo de capítulo. Comprobaciones en navegador: escritorio, móvil, ocho capítulos, preguntas, persistencia del formulario, envío simulado, navegación a proyecto y regreso. Prueba de regresión en `tests/journey-browser-check.cjs`.

## Referencia histórica de las versiones anteriores

Las especificaciones siguientes describen el taller editorial, las cortinas y la mesa espacial anteriores. La dirección activa y el comportamiento de movimiento vigentes son los indicados arriba.

## Overview

**Creative North Star: "El taller en movimiento"**

Satorus es una mesa editorial en funcionamiento: papel frío, fotografía cenital y campos de cobalto sostienen el trabajo cotidiano, mientras una ruta naranja cruza el enredo y conduce hacia una salida clara. La escena se siente táctil y próxima —cable, etiquetas, recortes, notas y objetos de negocio—, con energía de taller y lectura de publicación, nunca de panel de software.

La composición es asimétrica, de alto contraste y deliberadamente amplia. Una escena o una frase domina cada tramo; los servicios se leen como un libro mayor, el proceso como una ruta y el formulario como una hoja física sobre el banco. La lima señala y enfoca, el naranja mueve y activa, y la pareja Bricolage Grotesque + Atkinson Hyperlegible Next separa la voz expresiva de la explicación cotidiana.

**Key Characteristics:**

- Ruta naranja continua como hilo narrativo y señal de acción.
- Fotografía táctil protagonista, con recortes diagonales, etiquetas y trazos manuales.
- Campos grandes de papel frío, cobalto, naranja, lima y grafito en alto contraste.
- Titulares variables muy comprimidos junto a cuerpo abierto y legible.
- Secciones editoriales, listas y recorridos en lugar de mosaicos de tarjetas.

## Colors

La paleta alterna campos saturados con papel frío y grafito; cada color tiene una función narrativa visible y no actúa como decoración dispersa.

### Primary

- **Azul Herramienta** (`tool-blue`): cobalto de confianza para escenas ordenadas, planos fotográficos y grandes superficies de transformación; su variante oscura queda reservada a estados de texto o contraste puntual.

### Secondary

- **Naranja Impulso** (`action-orange`): ruta, acción principal, puntos de proceso y el puente donde el problema empieza a ordenarse; la variante oscura expresa el hover de la acción hero.

### Tertiary

- **Etiqueta Lima** (`label-lime`): foco, selección, notas físicas, navegación móvil y resultado positivo dentro de una superficie azul.

### Neutral

- **Grafito de Banco** (`bench-graphite`): texto, trazos, bordes y campos oscuros de máximo contraste.
- **Grafito Suave** (`graphite-soft`): apoyo neutral para texto secundario sin rebajar la legibilidad.
- **Papel Frío** (`cool-paper`): lienzo principal y hoja física; debe leerse mineral, no crema.
- **Papel Apagado** (`paper-muted`): superficie secundaria de documentos y estados discretos.
- **Línea de Lápiz** (`line`): separación tenue en la cabecera y divisores que no compiten con el contenido.

### Named Rules

**The Large Field Rule.** Cada color saturado entra como una superficie con peso compositivo, no como una colección de insignias.

**The One Hot Action Rule.** En una vista, el naranja señala una ruta y una acción dominante; no salpica controles equivalentes.

## Typography

**Display Font:** Bricolage Grotesque Variable (con Arial Narrow y sans-serif como respaldo)

**Body Font:** Atkinson Hyperlegible Next Variable (con Arial y sans-serif como respaldo)

**Character:** Bricolage se estrecha hasta comportarse como un rótulo de taller contemporáneo y permite titulares grandes sin volverse solemne. Atkinson mantiene abiertas las explicaciones, formularios y dudas para lectores no técnicos.

### Hierarchy

- **Display** (variación de peso 800 y anchura 64, escala fluida, interlineado 0.82): promesa principal en dos líneas compactas; en móvil recupera salto natural para no desbordar.
- **Headline** (variación base de peso 790 y anchura 78, espaciado -0.04em): abre escenas y formula resultados; cada sección ajusta tamaño y anchura a su composición.
- **Title** (variación de peso 720 y anchura 83, escala fluida, interlineado 0.96): nombres de servicio y pasos, con ritmo breve y frontal.
- **Body** (peso 400 de base, 1rem, interlineado 1.5): explicación cotidiana; los bloques principales se mantienen normalmente entre 31ch y 48ch.
- **Label** (peso 760, 0.85rem, interlineado 1): tipos de servicio y rotulación física; no introduce una capa editorial separada.

### Named Rules

**The Compression Carries Voice Rule.** La personalidad vive en los ejes de anchura y peso de Bricolage; no se sustituye por una display del sistema ni por una serif ornamental.

**The Plain Reading Rule.** Toda explicación, navegación y entrada de formulario usa Atkinson con tamaño cómodo y contraste directo.

## Layout

El ancho completo se organiza con un margen lateral fluido (`page`) y un ritmo vertical amplio (`section`). En escritorio predominan divisiones editoriales de dos columnas, proporciones desiguales y fotografía a sangre; el hero fija la navegación, comprime el titular en dos líneas, deja la mesa fotográfica como banco diagonal y lleva la ruta naranja hasta una acción física extrema. El comienzo del bloque naranja siguiente permanece visible como cambio de escena.

A 1100px, el proceso pasa de cuatro a dos columnas. A 900px, la navegación se convierte en un panel lima y las tres primeras escenas pasan a funcionar como carteles verticales compactos: el hero mantiene texto, fotografía, ruta y CTA en un mismo plano; el bloque naranja superpone el recorrido al mensaje; y el diagnóstico integra fotografía y contenido mediante un velo de grafito. A 620px, servicios, proceso, formulario y flujos se vuelven una sola columna; los grandes titulares reducen su escala sin perder compresión.

**The Route Before Modules Rule.** Listas, líneas y cambios de campo explican continuidad; la retícula alinea, pero no produce mosaicos de tarjetas equivalentes.

**The Mobile Poster Rule.** Una composición editorial de escritorio no se desmonta en móvil como texto seguido de imagen: se recompone en una sola escena táctil, legible y de altura contenida.

## Elevation & Depth

La interfaz permanece plana por defecto. La profundidad aparece cuando la escena ofrece una causa física: papel girado, cinta pegada, cable sobre la mesa o CTA unido a la ruta. Las sombras observadas son cálidas y estructurales —bajo el CTA hero, las etiquetas y la hoja del formulario—; los campos editoriales, filas de servicio y FAQ se separan con color y líneas, no con elevación genérica. La entrada del hero usa recorte y dibujo de ruta; todos los movimientos respetan `prefers-reduced-motion`.

### Shadow Vocabulary

- **Ruta suspendida** (`drop-shadow(0 8px 12px rgba(45, 15, 8, 0.2))`): separa el cable naranja de la mesa fotográfica.
- **Acción física** (`0 16px 30px rgba(32, 21, 12, 0.26)`): ancla el CTA hero; crece solo durante hover.
- **Etiqueta pegada** (`0 8px 18px rgba(16, 20, 17, 0.18)`): eleva cinta y rotulación de escena.
- **Hoja sobre banco** (`0 24px 48px rgba(0, 0, 0, 0.28)`): reserva la mayor profundidad para el formulario sobre grafito.

### Named Rules

**The Material Makes Depth Rule.** Toda sombra necesita un objeto físico reconocible; una superficie editorial no flota por defecto.

## Motion implementation

**Primera pantalla:** el hero con la foto de la mesa y el rótulo `satorus.es` (`components/hero.tsx`), a pantalla completa. **Al bajar entra el libro, el cuaderno de tu negocio** (`components/book/`, estilos en `app/book.css`, contenido en `lib/book-content.ts`). El libro entra solo, sin texto alrededor: cerrado y centrado sobre la mesa, en perspectiva, con una goma naranja y papeles asomando. Al bajar, primero se desliza cerrado hasta su sitio (la portada pasa a la mitad derecha) y después se abre; la tapa y el bloque de hojas de la izquierda sólo aparecen cuando la portada se ha posado. Acabado realista: tela con grano y luz en las tapas, lomo marcado, grosor de hojas en los cantos, sombra de contacto y bordes finos en vez del contorno grafito de la ilustración. El scroll lo abre y pasa las hojas; el scroll es el del navegador (con Lenis), sin secuestrar la rueda, y también hay botones anterior/siguiente, flechas del teclado y pestañas.

- **Cada doble página es una historia con la misma regla:** a la izquierda cómo llega (papel pautado, letra a mano en Caveat, tachones, pósits); a la derecha cómo queda (tipografía de la marca, en columnas). Las piezas de la derecha se asientan desde el desorden y la izquierda recibe el sello «Arreglado por Satorus».
- **El libro se ordena solo:** cada historia guarda un papel suelto y saca una pestaña de color en el canto. Al final no queda ningún papel y todas las pestañas están en fila.
- **El capítulo 1 ocupa dos dobles páginas.** La primera rompe la regla a propósito: las dos páginas son caos (WhatsApp con chats sin contestar y un contador que no para de subir, llamadas perdidas, un presupuesto en borrador que cruza el lomo, tickets rotos, citas duplicadas, una reseña de 2 estrellas, «¿Te suena?»). La segunda enseña lo que construimos: a la izquierda «Tu lista de problemas» (la que escribimos con el cliente), donde cada problema se tacha y recibe una etiqueta azul con la pieza que lo resuelve; a la derecha una app «hecha por satorus.» cuyos módulos (asistente de WhatsApp con IA, agenda, presupuestos, llamadas, caja, clientes) se montan pieza a pieza. Problema y módulo comparten número.
- **Historias (6 dobles páginas):** 1 El lío · 2 Tu app · 3 y 4 Cómo trabajamos, una página por paso (mapa 1-2-3-4 con el paso actual en azul y los hechos con check, foto, explicación sin tecnicismos y «Te llevas…») · 5 Qué hacemos: lo que nos piden, a mano, y la respuesta en claro (webs, webs personales, aplicaciones y programa de gestión o ERP), cada una con un proyecto real (Enrolla2, Ángel Mendoza, Pidoteca, GoblinTrader) · 6 Tu siguiente paso: «Dos caminos» (gráfica a mano: si sigues igual, tu competencia con IA y la línea naranja de crecer con Satorus, que se dibuja al abrir) y la última página, en papel como las demás, «La IA no va a esperarte. Tu competencia tampoco.», con tecnología e IA, conocimiento y compañía, y el botón naranja que lleva al formulario. Detrás del libro van las preguntas y el contacto.
- **Móvil:** se ve una página cada vez; la cámara lee la izquierda, pasa a la derecha y, al pasar la hoja, vuelve con el papel.
- **Técnica:** todo sale de una sola cifra calculada desde el scroll (`u`), que mueve variables CSS (`--flip`, `--s`, `--st`, `--t`, `--band`). Las hojas son capas con `rotateY` y `backface-visibility`; nada es 3D real.

Sin `html[data-book="on"]` (sin JS o con `prefers-reduced-motion`) el libro se pinta plano: dobles páginas una tras otra, ya pasadas a limpio.

## Shapes

Los campos y listas son rectos, con bordes de uno o dos píxeles. Los controles funcionales repiten esquinas discretas (`control`), mientras la acción hero adopta una cabeza redondeada y un arranque recto para parecer el extremo del cable. Círculos y cápsulas completas quedan reservados a puntos de recorrido, ruta y marcadores. Fotografías y papeles pueden inclinarse o recortarse en diagonal cuando la materialidad lo justifica.

**The Material Edge Rule.** Papel, cinta, cable y placa determinan la silueta; no se aplica un radio blando universal a todas las superficies.

## Components

### Brand Lockup

- **Symbol:** una “S” continua dibujada como ruta naranja, rematada por un terminal lima con contorno grafito. Debe conservarse plana, sin volumen ni efectos tecnológicos.
- **Wordmark:** `satorus.` en Bricolage Grotesque comprimida y de peso alto. El símbolo y el nombre se alinean horizontalmente con un espacio corto; en favicon se utiliza únicamente el símbolo sobre grafito.

### Buttons

- **Header CTA:** placa lima compacta, borde grafito y altura táctil de 44px; al pasar el puntero cambia a naranja y sube 2px.
- **Hero CTA:** extremo naranja de cable con radio asimétrico, borde grafito, altura mínima de 68px y sombra física; el hover oscurece, sube 3px y gira -0.5 grados.
- **Form Submit:** barra naranja de ancho completo, borde grafito y altura mínima de 60px; el hover cambia a azul y el estado deshabilitado conserva la forma con opacidad reducida.
- **Focus:** el foco global usa un contorno lima de 3px separado 4px; dentro del formulario, campos y áreas de texto usan un contorno azul de 3px separado 3px.

### Chips

- **Service Label:** recorte pequeño, plano y levemente girado; alterna naranja, azul y lima para marcar el tipo sin convertirlo en una tarjeta o filtro.

### Cards / Containers

- **Service Ledger:** filas de altura generosa entre una línea superior fuerte y divisores grafito; en hover, la fila recibe un campo lima y aumenta su sangría. En móvil no hay fondo de hover ni indentación lateral.
- **Contact Sheet:** papel frío sobre campo grafito, girado -0.6 grados en escritorio y recto en móvil; es la única gran superficie de formulario elevada.

### Inputs / Fields

- **Single-line:** fondo transparente, borde inferior grafito de 2px, esquinas rectas y relleno vertical contenido.
- **Message:** área rectangular con borde grafito completo de 2px, altura mínima de 150px y redimensionado vertical.
- **State:** el foco convierte borde y contorno a azul; success y error se anuncian con texto persistente bajo el botón.

### Navigation

- **Desktop:** barra fija de papel frío y línea tenue, wordmark Bricolage a la izquierda, enlaces Atkinson centrados y CTA lima a la derecha. El hover dibuja una línea de izquierda a derecha.
- **Mobile:** a 900px, un control cuadrado de 44px abre un panel lima de viewport completo; los enlaces pasan a Bricolage grande y el CTA final usa naranja.

### FAQ Disclosure

- **Style:** preguntas entre divisores grafito, con un signo más construido con dos trazos; al abrir, el trazo vertical rota hasta formar un menos. La respuesta mantiene una longitud máxima de 62ch.

### Catálogo de proyectos

- **Portada y cierre editoriales:** `/productos` abre en papel claro (`#fffefa`) con un campo azul cielo (`#dff0fb`), tres capturas reales superpuestas y el naranja reservado para la tesis y la acción. El cierre vuelve al papel, resume cómo trabajamos y lleva a la conversación. Esta variación pertenece solo al catálogo, no sustituye la paleta global.
- **Dos familias, dos atmósferas:** Apps conserva el papel frío y presenta cada producto como una hoja de trabajo; Webs cambia a grafito y usa ventanas de navegador como piezas de exposición.
- **Escalable sin huecos falsos:** los proyectos se renderizan desde `lib/project-catalog.ts`. Añadir un caso amplía su lista sin exigir tarjetas vacías ni una retícula cerrada.
- **La captura es evidencia:** las fichas usan pantallas y fotografías reales de cada proyecto. El texto explica problema, dirección y decisiones sin atribuir métricas o resultados no medidos.
- **Profundidad progresiva:** `/productos` sirve como índice breve. Cada elemento abre una ficha larga; Lector Bilingüe conserva su página propia y Pidoteca, SportApp, Ángel Mendoza y Enrolla2 cuentan ahora con una ruta dedicada.
- **Relato antes del detalle:** cada caso plantea «El reto», «Qué mejoramos» y «Por qué así» en tres pasos breves; son decisiones y objetivos, no resultados medidos ni una sustitución de la ficha larga.
- **Pruebas agrupadas:** en escritorio la captura principal y hasta tres vistas de contexto viven dentro del mismo `frameClip`; la máscara y el color existentes relevan el conjunto entero a la vez. Solo se muestran imágenes reales disponibles; SportApp tiene una segunda vista distinta y no se duplica.
- **Móvil sin sobrecargar el sticky:** la captura principal sigue fija bajo la cabecera en 16/9 y el texto pasa por debajo. Una imagen contextual por caso se intercala en el relato, no en el sticky. Con movimiento reducido, texto e imagen vuelven a intercalarse sin capas apiladas.
- **Enrolla2, evidencia de producto:** el caso muestra capturas de la propia web —galería, carta y opiniones— en vez de fotografías aisladas. Si hay tres detalles, el último completa una fila de ancho total en móvil; las capturas verticales se contienen sin recorte.

### Route & Process Markers

- **Style:** trazos de extremos redondeados, ruta naranja y pines grafito circulares con borde naranja; en móvil, el recorrido conserva los pines aunque desaparezca la línea horizontal.

## Do's and Don'ts

### Do:

- **Do** dejar que una fotografía táctil o un titular domine cada tramo del relato.
- **Do** usar campos completos de color para separar lío, transformación, proceso y contacto.
- **Do** conectar recorrido, estado y acción mediante la ruta naranja y sus marcadores físicos.
- **Do** mantener el cuerpo en Atkinson, con frases cotidianas y líneas de lectura contenidas.
- **Do** ofrecer foco visible de alto contraste y una alternativa estática cuando se reduce el movimiento.

### Don't:

- **Don't** convertir servicios, ventajas, procesos o dudas en una cuadrícula de tarjetas equivalentes.
- **Don't** inventar métricas, logos, testimonios o escenas generadas presentadas como evidencia real.
- **Don't** usar robots, neón, dashboards, fondos de datos ni iconografía futurista genérica de IA.
- **Don't** sustituir la materialidad por sombras de tarjeta, glassmorphism o radios blandos universales.
- **Don't** romper el titular hero en más de dos ideas visuales ni separar el CTA naranja de la ruta que lo justifica.

### Monitor como entrada a aplicaciones — 25/09/2026

- El puesto de trabajo contiene la entrada a la sección existente «Una herramienta a tu manera». Se puede pulsar el monitor 3D o su marcador accesible.
- La cámara abre el edificio, se acerca por encima del escritorio y encuadra la pantalla. El contenido HTML toma el relevo con el mismo papel cálido y verde de la pantalla física.
- Pedidos, equipo y reservas muestran ejemplos ilustrativos seleccionables. GoblinTrader aporta evidencia real mediante su captura y enlace al caso.
- El diálogo permite volver, usar Escape, conservar el capítulo y contactar. El foco queda dentro y regresa al punto de entrada. Con movimiento reducido o sin WebGL se accede al mismo contenido.
- Madera satinada con contraste y rugosidad acotados; relieve más fino, tela menos contrastada, juntas de piedra discretas, oclusión de menor alcance y antialias reforzado. Los mapas CC0 mantienen sus créditos originales.

### Oficina como navegación principal — 25/09/2026

La portada se concentra en el modelo, centrado y sin copy lateral. El recorrido parte del primer encuentro, plantea las soluciones, enseña proyectos y termina en una carta. Cada lugar tiene una función: monitor izquierdo para cómo trabajamos, monitor nuevo de recepción para soluciones, monitor derecho para proyectos y sobre sobre la mesa de café para contacto y dudas.

El contenido procede de development (f58b6fe): se conservan los cuatro pasos y sus fotografías, el diagnóstico, los servicios, el mensaje de hablamos claro, las dos puertas de proyectos, el contacto y las siete preguntas. La estructura 3D agrupa las secciones, sin sustituir sus explicaciones.

Un gesto abre el estudio y acerca la cámara al objeto. Dentro se lee con scroll nativo. Solo al terminar el contenido, otro gesto inicia el vuelo de salida; la cámara vuelve al interior antes de dirigirse al siguiente puesto. Los marcadores y el índice permiten elegir una sección, y Escape vuelve a la oficina. Las secciones permanecen montadas para conservar formularios y controles.

Los vuelos usan el render directo y las vistas quietas recuperan la oclusión de contacto. Las sombras del mobiliario se reutilizan mientras solo cambia la cámara. La inercia residual no inicia otra navegación; teclado, swipe, movimiento reducido y alternativa sin WebGL comparten el contenido.

## Actualización narrativa — 26 septiembre 2026

Development integrado: `b406de2`. Las pantallas usan ahora los problemas, módulos, entregables y cuatro ofertas del cuaderno actual. `lib/book-content.ts` se comparte directamente; los ejemplos y ofertas de `components/book/book-pages.tsx` se adaptan en `lib/office-content.ts`. Se conserva el recorrido de tres monitores y sobre.

La portada empieza en el día a día del visitante: una mesa física con WhatsApp pendiente, citas cruzadas, presupuestos, llamadas, tickets y seguimiento. Tres etiquetas permiten explorar los casos. El scroll o «Vamos a poner orden» alinea los objetos, cambia sus documentos al estado organizado y revela el estudio. El estudio se explica como el lugar donde entendemos, resolvemos y construimos contigo. Un segundo gesto entra en la primera pantalla. Los enlaces de navegación pueden saltar o interrumpir esta introducción; no hay espera obligatoria.

Paleta, materiales y tipografías continúan la oficina realista. La mesa, el teléfono y los documentos son geometría 3D, con sombras, texturas y movimiento de cámara. La narración y etiquetas permanecen en HTML accesible. La preferencia de movimiento reducido salta al resultado; sin WebGL todo el contenido sigue disponible.

### Libros y recipientes — 26 septiembre 2026

Los libros de las estanterías tienen dos tapas, un bloque de papel con cantos texturados, lomo curvo rotulado, cabezadas y algunos marcapáginas. Se alternan grosores y alturas, con volúmenes apilados y sujetalibros. Los cuadernos de escritorio tienen tapas, hojas, goma y cinta.

Los recipientes de estantería y escritorio utilizan perfiles de revolución cerrados por la base y abiertos por la boca: grosor de pared, labio redondeado e interior real. Las tazas incorporan asa, café y menisco; se alternan con un jarrón de cerámica esmaltada y un vaso de vidrio de base gruesa. Geometrías, materiales y texturas comparten el ciclo de liberación del modelo. Verificación visual durante el vuelo de entrada a proyectos; compilación y lint correctos.
