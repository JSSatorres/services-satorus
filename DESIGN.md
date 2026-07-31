---
name: Satorus
description: Una ruta naranja atraviesa una mesa editorial azul y convierte el enredo cotidiano de una pyme en un recorrido claro.
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
