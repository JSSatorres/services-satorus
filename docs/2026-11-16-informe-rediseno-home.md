# Informe: rediseño de la home de satorus.es

Fecha: 16 de noviembre de 2026. Repositorio: `D:\Proyectos\satorus` (Next.js, desplegado en Vercel, producción en https://www.satorus.es).

Este informe es para el agente que vaya a planificar o ejecutar el rediseño. Resume qué se ha comprobado en la web publicada, qué hay que cambiar, qué no hay que tocar y qué queda por decidir. No es un plan de implementación: las decisiones abiertas del final son del dueño (Juan) y hay que preguntárselas antes de construir.

## Actualización: qué está ya hecho en local (sin commit ni push)

Decisiones de Juan: titular «Webs, apps e IA para pymes», demo solo con preguntas preparadas, sin precios publicados y cuaderno reducido que se pasa con un toque.

Hecho en el árbol de trabajo, comprobado con `tsc`, ESLint y capturas en 1440×900, 1366×768 y 390×844 contra el servidor de desarrollo. No se ha ejecutado `next build`.

- **Portada nueva** (`components/home/home-hero.tsx`): `<h1>` visible, botón de contacto y demo del asistente. Se quitan el rótulo «satorus.es» y el vídeo de la portada.
- **Demo del asistente** (`components/home/assistant-demo.tsx`, textos en `lib/demo-content.ts`): selector de cuatro negocios, tres preguntas preparadas por negocio, «escribiendo…» y etiqueta «Ejemplo». Sin marco de teléfono en móvil.
- **Cuaderno** (`components/book/book.tsx`): dos dobles páginas (cuatro páginas en móvil). Se abre solo al entrar en pantalla y se pasa con botón, toque, deslizamiento lateral o teclado. Ya no fija ni bloquea el scroll.
- **Secciones normales** (`components/home/home-sections.tsx`, estilos en `app/home-v4.css`): cómo trabajamos, qué hacemos con capturas grandes de proyectos, y siguiente paso con la gráfica «Dos caminos».
- **Medición:** eventos de clic en WhatsApp, teléfono y correo (`components/analytics-events.tsx`), envío del formulario y uso de la demo.
- **Menores:** `/equipo` en el sitemap, dominio de Enrolla2 unificado a `.com`, y la política de privacidad menciona la analítica sin cookies.

Pendiente: testimonios reales, datos legales del titular (a la espera del alta de autónomo, ver `docs/pendientes/datos-legales-titular.md`), dominio propio para SportApp, y revisar el texto e imagen de Open Graph, que siguen con el lema anterior.

Dos correcciones a la primera versión de este informe:

- **Sí había analítica.** `@vercel/analytics` ya estaba en `app/layout.tsx`; no se veía en el HTML porque carga su script aparte. Faltaban los eventos de contacto, ya añadidos. Hay que confirmar en el panel de Vercel que Web Analytics está activado y que el plan admite eventos personalizados.
- **«Tu web» no es un campo real del formulario.** Es una trampa contra bots, oculta. La política de privacidad no tiene que mencionarlo.

## Objetivo del negocio

- **Cliente objetivo:** pymes y autónomos sin conocimientos técnicos (bares, peluquerías, tiendas, clínicas), de Granada y del resto de España. La mayoría entrará desde el móvil.
- **Efecto buscado:** que el visitante piense «qué chulo, ¿qué me pueden hacer a mí?» y a la vez entienda qué hace Satorus. Lenguaje claro y conciso, sin jerga.
- **Criterio para cualquier efecto visual:** tiene que explicar algo del servicio. Un efecto que solo adorna, o que retrasa llegar al contacto, sobra.

## Estado actual, comprobado en producción

Comprobado el 16 de noviembre con peticiones HTTP y un Chromium headless a 1440×900 y 390×844.

- **El cuaderno ocupa unos dos tercios de la home** (`components/book/book.tsx`). En escritorio la página mide 9.376 px y el cuaderno avanza 6 dobles páginas con el scroll.
- **En móvil el cuaderno retiene el scroll.** La página se queda fija en `scrollY = 844` y cada gesto pasa una de 12 páginas. Hicieron falta unos 14 gestos para llegar a preguntas y contacto.
- **En móvil la barra de páginas tapa el aviso** «Desliza para abrirlo».
- **Portada:** lo más grande es el rótulo «satorus.es». El titular visible es «Tu negocio puede llegar más lejos». El `<h1>` real está oculto (1×1 px) y tiene otro texto. El párrafo va sobre un vídeo, con poco contraste.
- **Peso:** unos 6,4 MB en escritorio, de los que 4,3 MB son `/videos/satorus-hero-loop.mp4`. En móvil, unos 2 MB.
- **No hay analítica** de ningún tipo en el HTML publicado.
- **No hay testimonios, reseñas ni cifras de resultados.** La única reseña es la ficticia del cuaderno.
- **Ya existe un chat con IA:** `components/company-chat.tsx`, servido desde `chat.satorus.es`, detrás del botón flotante «¿Hablamos?». La política de privacidad dice que usa un modelo Ollama en servidor propio y que no guarda historial.
- **SEO técnico correcto:** título, descripción, canonical, redirecciones a `www`, Open Graph, JSON-LD de `ProfessionalService` y `FAQPage`, cabeceras de seguridad, 404 real.

No se ha comprobado: posiciones en Google, Core Web Vitals con datos reales, ni el envío del formulario y del chat.

Sin confirmar: en capturas tomadas 1,2 s después de hacer scroll se ven elementos del cuaderno torcidos y semitransparentes. Puede ser la animación a medio camino. Hay que mirarlo en un móvil real antes de tratarlo como fallo.

## Qué no hay que cambiar

- **Los textos del cuaderno.** «Así está tu mesa hoy… ¿Te suena?», «Tu lista de problemas» y «Lo que nos piden» son lo que mejor funciona: el cliente se reconoce.
- **La identidad visual:** libreta, pósits, letra manuscrita y la paleta actual. Diferencia a Satorus y no intimida a una pyme. No sustituirla por una estética de «empresa de IA».
- **El proceso en 4 pasos, las preguntas frecuentes y el gráfico «Dos caminos».**
- **El formulario de contacto, el WhatsApp, el teléfono y el correo.** El formulario se queda aunque se añada un chat.
- **Todo el SEO técnico** listado arriba. Cualquier cambio debe conservar título, descripción, canonical, JSON-LD y el sitemap.
- **El rendimiento en móvil.** La portada móvil se aligeró hace poco (commit `9954cd2`); no se puede empeorar.

## Qué hay que mejorar, por prioridad

### 1. Quitar el bloqueo de scroll y acortar el cuaderno

El cuaderno se queda con tres momentos: «Así está tu mesa hoy», «Tu lista de problemas» y «Tu lista, convertida en una app». Se lee con scroll normal, también en móvil. El proceso, los servicios y los proyectos salen del cuaderno y pasan a secciones normales.

### 2. Rehacer el texto de la portada

- El titular visible es el `<h1>` y dice qué hace Satorus y para quién, por ejemplo «Webs, apps y asistentes de IA para pymes de Granada».
- Se quita el rótulo «satorus.es».
- Titular y botón de contacto visibles en la primera pantalla sin esperar a ninguna animación.
- Texto legible: sin párrafo largo sobre vídeo.

### 3. Instalar analítica sin cookies

Sin medición no se puede saber si el rediseño mejora algo. Tiene que ser compatible con la política de privacidad actual, que declara que no hay analítica ni rastreo; si se instala, hay que actualizar ese texto.

### 4. Demo del asistente con selector de negocio

Es la mejor idea de la propuesta y lo que más se acerca al efecto buscado. Un móvil con una conversación de WhatsApp y un selector (bar, peluquería, tienda, clínica); el visitante pulsa una pregunta preparada y ve la respuesta.

Condiciones:

- **Las preguntas preparadas tienen respuestas escritas de antemano**, no generadas en el momento. Así la respuesta es instantánea, siempre correcta y no cuesta nada.
- **El texto libre es opcional y de segunda fase.** Un modelo abierto al público puede contestar mal, tardar o recibir abusos, y eso se ve en la portada. Si se hace, necesita límite de peticiones, límite de longitud y un aviso de que es una demostración.
- Si se envía texto del visitante a un modelo, hay que actualizar la política de privacidad.

### 5. Proyectos en una sección propia

Capturas grandes o vídeos cortos de Pidoteca, Enrolla2, Ángel Mendoza y GoblinTrader dentro de un móvil o un portátil, con un resultado concreto de cada uno.

Condiciones:

- **Sin galería horizontal enganchada al scroll vertical.** Eso es otra forma de retener el scroll y contradice la regla principal. Si hay carrusel, se desliza con el dedo hacia los lados.
- Vídeos silenciados, cortos, con imagen de póster y carga diferida.

### 6. Pruebas de confianza

Dos o tres testimonios reales de clientes y, si existen, reseñas de Google. La propuesta de rediseño no lo menciona y es una de las mayores carencias.

### 7. Portada animada «el caos se ordena solo»

Buena idea y reutiliza los dibujos del cuaderno, pero va después de lo anterior porque es lo más caro de hacer bien.

Condiciones:

- Dura como mucho una pantalla y avanza con el scroll sin fijar la página.
- El titular y el botón no dependen de la animación.
- En móvil, versión simplificada. Con `prefers-reduced-motion`, se muestra el estado final.

### 8. Arreglos pequeños

- Completar el aviso legal: nombre o razón social, NIF y dirección (confirmar con el gestor).
- Añadir `/equipo` al sitemap.
- Texto alternativo en las fotos de Damián y Tony en `/equipo`.
- Enrolla2 aparece como `.es` en un pie de foto y enlaza a `.com`.
- SportApp enlaza a un dominio `vercel.app`.
- La política de privacidad no menciona el campo «Tu web» del formulario.
- El logo del chat pesa 179 KB.
- Que los botones flotantes no tapen contenido en móvil.

## Qué se descarta de la propuesta

- **Comparador de antes y después con barra.** Cuenta lo mismo que la portada animada. Se hace una de las dos cosas, no las dos.
- **Titular que se escribe solo.** Retrasa la lectura de la frase más importante y empeora la métrica de carga.
- **Botones que siguen al cursor.** No existe en móvil y es un recurso de plantilla.
- **Números que cuentan hacia arriba.** No hay cifras reales que contar.
- **Sustituir el formulario por un chat.** Un cliente no técnico confía en un formulario y en WhatsApp. El chat puede sumarse, no reemplazar.
- **Calculadora de ahorro, por ahora.** «Te ahorras 22 horas al mes» es una cifra inventada si no hay una fórmula defendible detrás. Solo se hace si la fórmula se muestra y se puede justificar ante un cliente.

Se mantiene de la propuesta: las flechas y subrayados manuscritos que se dibujan al aparecer, en pocas dosis.

## Reglas para todo el trabajo

- Como mucho tres momentos llamativos en la home: portada, demo y proyectos. El resto, tranquilo y legible.
- Ninguna sección retiene ni redirige el scroll.
- Cada efecto tiene versión simplificada en móvil y respeta `prefers-reduced-motion`.
- La portada móvil no pesa más que ahora (unos 2 MB) y la de escritorio debe bajar de los 6,4 MB actuales.
- Textos en lenguaje de cliente, tuteando, sin jerga.

## Decisiones abiertas para Juan

1. ¿El cuaderno se queda en tres dobles páginas, o en una sola sección de antes y después como proponía el primer informe externo?
2. ¿La demo admite texto libre contra el modelo real, o solo preguntas preparadas?
3. ¿Hay testimonios y cifras reales de clientes que se puedan publicar?
4. ¿Se publica alguna orientación de precio («desde X €»)?
5. ¿Qué titular quiere para la portada?
