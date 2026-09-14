# Propuestas de contenido para satorus.es

> Diagnóstico de la portada actual y tres propuestas completas de texto, sección por sección.
> Fecha: 2026-09-12. Documento hermano: [2026-09-12-acta-decisiones-contenido.md](./2026-09-12-acta-decisiones-contenido.md).

Tres propuestas completas de contenido sobre la estructura que ya está construida. Antes de las propuestas, por qué la web actual no acaba de captar: no es la forma de la página, es que dice seis veces lo mismo y nunca dice qué gana el cliente.

---

## 1. Diagnóstico

**Lo que no cuadra no es el desorden. Es que sólo hay desorden.**

La web tiene una idea buena —el lío cotidiano de una pyme— y la repite en seis secciones seguidas con distintas palabras y ningún avance.

### 01 · Una sola idea, dicha seis veces

«Tu negocio, menos enredado» → «Hablamos claro» → «algo se puede ordenar» → «Resolvemos el atasco» → «El trabajo se ordena» → «Nos cuentas el lío». El lector termina la página sabiendo exactamente lo mismo que sabía en el hero. Sin progresión no hay motivo para llegar al formulario.

### 02 · Todo problema, ningún resultado

La web describe el dolor con mucha precisión y nunca dice qué se lleva el cliente. Una pyme no compra orden: compra horas recuperadas, presupuestos que salen el mismo día y consultas que no se caen. El orden es el medio, y nunca lo compró nadie.

### 03 · Cero pruebas, teniendo dos

Pidoteca y SportApp existen, están hechos y viven en `app/productos/`, fuera de la portada. Son la única prueba real de que sabéis construir. Quien no llega a esa página no ve ni una evidencia.

### 04 · «Pymes» no es nadie

Lo más concreto de toda la web es el taller de bicis de la demo de servicios, y está escondido dentro de un componente (`components/service-showcase.tsx`). Quien mejor convierte nombra el sector: taller, clínica, club, instalador, asesoría. «Pymes» obliga al visitante a traducirse a sí mismo.

### 05 · El CTA pide deberes y no promete nada

«Describe qué haces ahora, dónde pierdes tiempo y qué te gustaría que ocurriera» es una redacción. Y no dice qué pasa después, cuánto tarda, si cuesta ni cuándo respondes. Mucho esfuerzo, recompensa desconocida.

### 06 · Tono defensivo

«No te vendemos tecnología», «Aquí no hay tecnicismos», «no hace falta pedir una arquitectura de agentes». Definirse por lo que no eres suena a inseguridad, y esa última frase nombra el tecnicismo que dice evitar: se lo enseña a quien no lo conocía.

### 07 · El mismo CTA literal, tres veces

«Cuéntanos qué te frena» aparece en el hero, en fricciones y en contacto. Repetir la llamada está bien; repetir las mismas cinco palabras la convierte en decorado.

---

## 2. Lo que está bien y se mantiene en las tres propuestas

- **El lockup cinético de «satorus.es» y toda la artesanía de scroll.** Es la demo de producto: quien vende webs no puede tener una web peor que la que vende. No se toca el mecanismo, sólo el texto que va dentro.
- **La cinta «¿Te suena?» sobre la foto de la mesa.** Es el recurso más humano de la página y el único que interpela directamente.
- **El formato de FAQ y la honestidad de no inventar casos.** Se reescriben las preguntas, no la política.
- **El campo del formulario «¿Qué te está frenando?»** Buena pregunta; cambia sólo el texto de apoyo.
- **Lenguaje llano, móvil primero y accesibilidad.** Es una ventaja real frente a la competencia y ninguna propuesta la toca.

---

## 3. Mapa de secciones

Cada propuesta cubre estas diez secciones, en orden de scroll:

| # | Sección | Archivo |
|---|---------|---------|
| 01 | Cabecera y nav | `components/site-header.tsx` |
| 02 | Hero | `components/hero.tsx` · `components/hero-kinetic-lockup.tsx` |
| 03 | Frase que crece | `components/plain-talk.tsx` |
| 04 | Fricciones · ¿Te suena? | `components/interactive-frictions.tsx` |
| 05 | Servicios | `app/page.tsx` · `components/service-showcase.tsx` |
| 06 | Recorrido en scroll | `components/desktop-scroll-story.tsx` · `components/mobile-flow-reveal.tsx` |
| 07 | Cómo trabajamos | `app/page.tsx` (steps) · `components/process-route.tsx` |
| 08 | Prueba | sección nueva en `app/page.tsx` |
| 09 | Preguntas | `app/page.tsx` (faqs) |
| 10 | Contacto | `app/page.tsx` · `components/contact-form.tsx` |

### Texto actual, para referencia

| # | Ahora |
|---|-------|
| 01 | Qué hacemos · Productos · Cómo trabajamos · Para quién · Contacto — botón «Hablemos» |
| 02 | «Tu negocio, menos enredado.» + «Creamos webs, herramientas y automatizaciones para pymes.» — botón «Cuéntanos qué te frena» |
| 03 | «Hablamos claro. Te entiendes tú.» |
| 04 | «Si tu día depende de acordarte de todo, algo se puede ordenar.» |
| 05 | «No te vendemos tecnología. Resolvemos el atasco.» |
| 06 | «La consulta entra» → «El trabajo se ordena» → «Tu equipo sigue» |
| 07 | «Nos cuentas el lío. Dibujamos la salida.» |
| 08 | No existe. Pidoteca y SportApp viven sólo en `/productos`. |
| 09 | «Las dudas que suelen aparecer antes de hablar.» |
| 10 | «Cuéntanos qué te frena. Aunque todavía no sepas cómo se llama.» |

---

## Propuesta A · Las horas que recuperas

**Tesis:** deja de vender orden. Vende las horas que vuelven y los presupuestos que salen.

| | |
|---|---|
| **Le habla a** | Quien ya sabe que tiene un problema y está comparando a quién se lo encarga. Nivel 3-4 de consciencia. |
| **Gana** | Credibilidad inmediata y conversaciones con presupuesto sobre la mesa. Es la que mejor filtra. |
| **Cuesta** | Te obliga a poner números y plazos por escrito y a sostenerlos. Y es la más imitable: cualquiera puede escribir esto. |

### 01 · Cabecera y nav

> Qué resolvemos · Cómo lo hacemos · Productos · Precios y plazos

Botón de cabecera: «Ver si encaja». Añadir «Precios y plazos» al nav es la señal más fuerte de esta propuesta: dice que hay números dentro antes de que nadie pregunte.

### 02 · Hero

> **Menos horas en el lío.**
> **Más en el negocio.**

Subtítulo, dos líneas: «Webs, herramientas y automatizaciones para pymes. / Tú pones el problema; nosotros la parte técnica y el plazo.»

CTA: **Ver si encaja · 20 min**

Microcopy bajo el botón: «Llamada corta, sin compromiso. Sales con un plan escrito aunque no trabajemos juntos.»

### 03 · Frase que crece

> **Aquí se mide**
> **en horas.**

«Antes de proponer nada le ponemos número a lo que ya te pasa: cuántas veces se copia el mismo dato, cuánto tarda en salir un presupuesto, cuántas consultas se quedan sin contestar. Ese número es el que tiene que bajar.»

### 04 · Fricciones

> **Cada una de estas cuesta horas. Las contamos antes de tocar nada.**

- **Un presupuesto enterrado en WhatsApp** — lo que se pierde no es el mensaje, es el pedido.
- **El mismo pedido escrito tres veces** — tres sitios donde equivocarse y ninguno que manda.
- **La web recibe visitas y ni una llamada** — tráfico que no pregunta es tráfico que no existe.
- **Cuando alguien falta, el trabajo se para a preguntar** — el conocimiento está en una cabeza, no en un sitio.

CTA: **Pon número al tuyo →**

La cinta sobre la foto se mantiene tal cual: «¿Te suena?»

### 05 · Servicios

> **Tres formas de que el mes te cueste menos.**

«Elegimos la más barata que resuelva el problema. Si basta una regla sencilla, usamos una regla sencilla; la IA entra sólo cuando gana algo.»

- **Una web que trae consultas** — Dice en cinco segundos qué haces, para quién y qué hacer ahora. Rápida en móvil y medida: sabrás cuántas consultas trae cada mes.
- **Una herramienta donde el dato se escribe una vez** — Presupuestos, pedidos, partes o clientes en un sitio hecho a tu forma de trabajar. Entra una vez y no se vuelve a copiar.
- **El trabajo repetido, hecho de noche** — Avisos, respuestas, documentos y seguimientos que se preparan solos. Tú los apruebas; no los escribes.

### 06 · Recorrido en scroll

> **Entra una vez → Avanza sin recordatorios → Se cierra y queda medido**

- **Entra una vez** — La consulta llega por donde llegue —WhatsApp, web, teléfono— y queda registrada sin que nadie la copie.
- **Avanza sin recordatorios** — Cada paso sabe quién lo tiene y cuándo vence. Nadie pregunta por dónde iba.
- **Se cierra y queda medido** — A fin de mes ves cuántas entraron, cuántas se cerraron y en qué punto se atascan.

### 07 · Cómo trabajamos

> **Plazo, precio y alcance por escrito antes de empezar.**

«Cuatro pasos. En el segundo ya sabes lo que cuesta.»

1. **Llamada de 20 minutos** — Nos cuentas el día. Salimos con el atasco identificado y una idea del tamaño.
2. **Propuesta con número** — Qué se hace, qué queda fuera, cuánto cuesta y para cuándo. En una página.
3. **Primera entrega en 2-3 semanas** — Empezamos por la parte que más tiempo libera, y la usas antes de que esté todo.
4. **Se queda funcionando** — Te lo dejamos documentado y en tu mano. Seguimos si quieres, no porque dependas.

> Los plazos van de ejemplo: ponlos como los puedas cumplir.

### 08 · Prueba `[sección nueva]`

> **Lo que hemos construido.**

- **Pidoteca** — gestión de turnos, en uso. Se puede abrir.
- **SportApp** — el entrenador apunta en el campo; el club lo ve al instante. En acceso anticipado.

Nota al pie: «No ponemos testimonios que no tenemos. Estos dos son nuestros, están hechos y los puedes abrir.»

### 09 · Preguntas

> **Lo que se pregunta antes de pedir presupuesto.**

- **¿Cuánto cuesta?** — Los proyectos suelen ir de X a Y. Después de la llamada tienes el número exacto por escrito, y no cambia salvo que cambies tú el alcance.
- **No sé si necesito web, programa o IA** — No hace falta decidirlo antes de hablar. Empezamos por el problema y elegimos la solución más sencilla que lo resuelva.
- **¿Tengo que cambiar mis herramientas?** — No. Primero miramos lo que ya tienes; muchas veces el cambio grande es conectarlo mejor o quitar pasos repetidos.
- **Ya tengo web, ¿sirve de algo?** — A veces la web está bien y lo que falta es el paso siguiente. Te lo decimos aunque signifique no vendértela.
- **¿Puedo empezar por poco?** — Sí. La propuesta se organiza por fases y empieza por el atasco que más tiempo consume.

### 10 · Contacto

> **20 minutos y sales con un plan.**

«Cuéntanos en dos frases qué se te atasca. Te respondemos en un día laborable con si encaja, cómo lo abordaríamos y una horquilla de precio.»

Texto de apoyo del campo: «Dos frases bastan. Por ejemplo: los pedidos entran por WhatsApp y los copiamos a mano al Excel.»

---

## Propuesta B · Un martes cualquiera

**Tesis:** un solo protagonista, un solo día, con hora. El lío deja de ser un concepto y se convierte en el martes de alguien.

| | |
|---|---|
| **Le habla a** | Cualquier nivel, incluido quien todavía no sabe que esto se puede arreglar. Es la más ancha. |
| **Gana** | Es la única irrepetible: nadie puede copiarte un martes. Y es la que mejor aprovecha el scroll que ya tienes construido. |
| **Cuesta** | Exige concreción real —horas, sectores, escenas— y disciplina para no volver a la abstracción en la segunda frase. |

### 01 · Cabecera y nav

> El martes · Lo que hacemos · Productos · Cómo empezamos

Botón de cabecera: «Hablemos de tu martes». El nav deja de ser genérico y adelanta la idea de la página desde el primer clic.

### 02 · Hero

> **Un martes puede ir de otra forma.**

Subtítulo, dos líneas: «Webs, herramientas y automatizaciones para pymes. / Empezamos por tu martes, no por la tecnología.»

CTA: **Cuéntanos tu martes**

Microcopy bajo el botón: «Media hora, sin preparar nada. Lo que hiciste ayer ya es el material.»

### 03 · Frase que crece

> **Son las 8:40.**
> **Ya vas tarde.**

«Diecisiete mensajes sin leer, dos presupuestos por hacer y un cliente que llamó ayer y nadie apuntó. Todavía no has empezado el trabajo por el que te pagan.»

### 04 · Fricciones

> **El martes de un taller, una clínica y un club. Reconocerás el tuyo.**

Las cuatro tarjetas llevan hora. La hora es lo que las vuelve reales.

- **9:15** — el presupuesto de ayer sigue en un audio de WhatsApp.
- **11:40** — escribes el mismo pedido en el albarán, en el Excel y en el grupo.
- **16:00** — cuarenta visitas en la web y ninguna llamada.
- **Y el jueves** — falta Ana y nadie sabe por dónde iba lo suyo.

CTA: **¿Y el tuyo? →**

La cinta sobre la foto pasa a: «¿Te suena el martes?»

### 05 · Servicios

> **Tres cosas que cambian el martes.**

«No elegimos la más moderna. Elegimos la que te quita el martes de encima.»

- **La web que contesta por ti a las 23:00** — Quien te busca de noche entiende qué haces, para quién y cómo pedir cita. Por la mañana tienes la consulta, no la duda.
- **El sitio donde vive tu trabajo** — Presupuestos, partes, pedidos y clientes en una herramienta que se parece a tu forma de trabajar, no al revés.
- **Lo que se hace solo mientras cierras** — El aviso, el recordatorio, el documento, el seguimiento. Preparado cuando llegas, no pendiente cuando te vas.

### 06 · Recorrido en scroll

> **8:40 entra · 12:10 avanza · 18:30 cierra**

Aquí la propuesta rinde mejor: el mismo martes hora a hora es exactamente lo que el scroll ya sabe contar.

- **8:40 — Entra** — La consulta llega por donde ella quiera. Aterriza en un sitio y ya no hay que volver a moverla.
- **12:10 — Avanza** — Quien la coge ve lo que hay que saber. El siguiente paso ya está escrito.
- **18:30 — Cierra** — Se queda hecha y contada. Mañana no aparece otra vez como si fuera nueva.

### 07 · Cómo trabajamos

> **Empezamos escuchando un martes entero.**

1. **Nos cuentas el martes** — Media hora, sin preparar nada. Lo que hiciste ayer ya es el material.
2. **Te lo dibujamos** — Ves tu propio día en un esquema: qué entra, dónde se para, qué sobra. Sin siglas.
3. **Quitamos primero la hora más cara** — La parte que más te roba, funcionando pronto. El resto después, por fases.
4. **El martes se queda tranquilo** — Tú sigues llevando el negocio. Lo técnico deja de pedirte atención.

### 08 · Prueba `[sección nueva]`

> **Dos martes que ya cambiamos.**

- **Pidoteca** — los turnos de un local, fuera del grupo de WhatsApp.
- **SportApp** — «Sesión cancelada por lluvia.» El entrenador lo apunta en el campo; en la oficina ya está, sin llamar a nadie.

Nota al pie: «Son nuestros y están hechos. Cuando tengamos casos de clientes los contaremos con su nombre y su número; inventarlos, no.»

### 09 · Preguntas

> **Lo que se pregunta todo el mundo en la primera llamada.**

- **Me da apuro contarlo, lo tengo todo desordenado** — Es justo el punto de partida. Nadie nos ha contado nunca un martes limpio.
- **No sé si necesito una web, un programa o IA** — No hace falta decidirlo. Tú cuentas el día y nosotros proponemos lo más sencillo que lo arregle.
- **Ya tengo herramientas, ¿hay que tirarlas?** — Casi nunca. Lo habitual es conectar mejor lo que ya usas y quitar los pasos que se repiten.
- **¿Cuánto cuesta y cuánto tarda?** — Depende del martes. Después de verlo tienes por escrito qué se hace, qué queda fuera, cuánto y para cuándo.
- **¿Puedo empezar por una parte pequeña?** — Sí, y suele ser lo mejor: empezamos por la hora del día que más te cuesta.

### 10 · Contacto

> **Cuéntanos un martes.**
> **Con eso empezamos.**

«Lo que hiciste ayer y lo que se te torció. No hace falta que sepas cómo se llama ni qué habría que hacer. Contestamos en un día laborable.»

Texto de apoyo del campo: «Por ejemplo: el martes se me fue en llamar a proveedores y apuntar lo mismo dos veces.»

---

## Propuesta C · La oferta

**Tesis:** deja de ser una agencia genérica. Tres paquetes con nombre, precio y fecha, y un diagnóstico gratis como puerta de entrada.

| | |
|---|---|
| **Le habla a** | Quien quiere comprar ya y necesita saber si puede pagarlo antes de escribirte. Nivel 4. |
| **Gana** | La que más contactos trae y mejores: llega gente que ya sabe el rango. Y te separa de cualquier agencia que contesta «depende». |
| **Cuesta** | Te obliga a fijar precios públicos y a cumplir plazos de paquete. Y estrecha: el proyecto raro se irá a otro sitio. |

### 01 · Cabecera y nav

> Paquetes · Diagnóstico gratis · Productos · Preguntas

Botón de cabecera: «Diagnóstico gratis». Toda la propuesta cuelga de esa palabra y aparece ya en el nav.

### 02 · Hero

> **Dinos qué se te atasca.**
> **Te decimos qué cuesta arreglarlo.**

Subtítulo: «Webs, herramientas y automatizaciones para pymes, con precio y plazo desde el primer día.»

CTA: **Pedir diagnóstico gratis**

Microcopy bajo el botón: «45 minutos. Sales con un documento de una página: qué te está costando, qué haríamos y cuánto. Es tuyo aunque no sigas.»

### 03 · Frase que crece

> **Precio y plazo.**
> **Antes de empezar.**

«Nada de "depende". Después del diagnóstico tienes una página con el alcance cerrado, la fecha y el importe. Si no encaja, lo dices y no pasa nada.»

### 04 · Fricciones

> **Si te pasa alguna de estas, hay un paquete para ella.**

Cada tarjeta apunta a un paquete. Aquí la estructura ya es información: el visitante se autodiagnostica y aterriza en el precio.

- **Tengo web y no entra nada** → Web que pide cita
- **Apunto lo mismo en tres sitios** → Un solo sitio donde apuntar
- **Se me va el día en avisar, recordar y enviar** → Se hace solo
- **No sé ni por dónde empezar** → Diagnóstico gratis

### 05 · Servicios → Paquetes

> **Tres paquetes con nombre, precio y fecha.**

«Alcance cerrado. Si tu caso no cabe en ninguno te lo decimos y lo hacemos a medida.»

- **Web que pide cita · desde X € · 3 semanas** — Una página que explica qué haces y termina en una cita o un formulario. Textos incluidos, rápida en móvil, y la puedes editar tú.
- **Un solo sitio donde apuntar · desde X € · 4-6 semanas** — Tu herramienta para presupuestos, pedidos o partes. El dato entra una vez y lo ves desde el móvil.
- **Se hace solo · desde X € · 2 semanas** — Tres tareas repetidas tuyas, automatizadas y funcionando. Elegimos juntos las tres que más tiempo te quitan.

> Los importes van como horquilla de partida y lo dice la propia sección: «son precios de partida; el diagnóstico los cierra». Decidir esas cifras es la única tarea que esta propuesta te deja a ti.

### 06 · Recorrido en scroll

> **Semana 1 lo tienes dibujado · Semana 2 lo tocas · Semana 3 lo usas**

El scroll deja de contar el problema y cuenta la entrega. Quien está a punto de pagar quiere ver esto.

- **Semana 1 — Lo tienes dibujado** — Antes de escribir código ves el recorrido completo en un esquema que entiendes.
- **Semana 2 — Lo tocas** — Una versión real, funcionando con tus datos. Cambias lo que no encaje mientras cambiarlo es barato.
- **Semana 3 — Lo usas** — En marcha, con tu equipo dentro y contigo sabiendo manejarlo.

### 07 · Cómo trabajamos

> **Cómo empezamos.**

1. **Diagnóstico de 45 minutos, gratis** — Nos cuentas qué se atasca. Sin preparar nada y sin compromiso.
2. **Documento de una página, en 48 horas** — Qué te está costando, qué haríamos, qué paquete encaja y cuánto. Tuyo, te quedes o no.
3. **Decides tú: paquete, a medida o nada** — Las tres respuestas están bien. La tercera también.
4. **Fecha de entrega en el contrato** — No una estimación: una fecha.

### 08 · Prueba `[sección nueva]`

> **Software nuestro, en producción.**

- **Pidoteca** — gestión de turnos, en uso hoy.
- **SportApp** — para clubes: el entrenador apunta en el campo y el club lo ve al momento. En acceso anticipado.

Nota al pie: «No tenemos testimonios y no los vamos a inventar. Tenemos dos productos hechos y los puedes abrir.»

### 09 · Preguntas

> **Antes de pedir el diagnóstico.**

- **¿El diagnóstico es gratis de verdad?** — Sí, y el documento es tuyo. Si te lo llevas a otro proveedor, ya habrá servido para algo.
- **¿Cómo dais precio sin conocer mi caso?** — Damos horquilla, no precio final. Los paquetes cubren lo que se repite en la mayoría de pymes; lo que se sale, se presupuesta aparte.
- **¿Y si mi problema no cabe en un paquete?** — Te lo decimos en el diagnóstico y lo hacemos a medida, con el mismo formato: alcance, precio y fecha por escrito.
- **¿Tengo que cambiar mis herramientas?** — No. Primero miramos lo que ya tienes; muchas veces el paquete consiste precisamente en conectarlo.
- **¿Y si a mitad quiero cambiar algo?** — Los cambios pequeños entran. Lo que mueva el alcance se presupuesta antes de tocarlo, nunca después.

### 10 · Contacto

> **Pide el diagnóstico.**

«Dos frases sobre lo que se te atasca. Te escribimos en un día laborable con un hueco para la llamada.»

Texto de apoyo del campo: «Por ejemplo: tengo web y no entra ni una consulta al mes.»

---

## 4. Cómo encontrar las referencias

**Las galerías sirven para el diseño. Para el texto hay que buscar en otro sitio.** Las galerías premian lo visual, y ahí ya ganas. El problema es de contenido, y el contenido bueno casi nunca está en una web premiada: está en la web aburrida de alguien que lleva diez años vendiendo lo mismo.

### Para diseño e interacción

Mira, roba el mecanismo, ignora el texto. Con dos o tres sitios basta; más es procrastinar.

- [Awwwards](https://www.awwwards.com) — un jurado puntúa diseño, usabilidad y creatividad. El mejor sitio para animación y storytelling.
- [Godly](https://godly.website) — curado a mano, dos o tres webs por semana, casi todas merecen estudio.
- [Land-book](https://land-book.com) y [SaaS Landing Page](https://saaslandingpage.com) — landings de producto, útiles cuando te atascas en una sección concreta.
- [Mobbin](https://mobbin.com) y [Refero](https://refero.design) — productos reales en uso: para UX más que para estética.
- [Lapa Ninja](https://www.lapa.ninja) — volumen de landings, bueno para detectar patrones que se repiten.

### Para texto y estructura

Busca a quien le vende a tu mismo comprador, no a quien gana premios.

- **Quien paga anuncios.** Busca en Google «software gestión taller», «programa presupuestos instalador», «app gestión club deportivo». Los primeros resultados pagados llevan años probando titulares con dinero real. Ese texto está optimizado; el de Awwwards no.
- **Estudios de tu tamaño en inglés.** Uno a cinco personas vendiendo a pymes locales. Van un par de años por delante en cómo empaquetan la oferta.
- **Software vertical español** (gestión de talleres, clínicas, asesorías, clubes). Usan el lenguaje literal del sector porque es su canal de venta.
- **Tu propia bandeja de entrada.** La mejor fuente de texto que existe y la tienes gratis: los WhatsApps y correos donde un cliente te explicó su problema con sus palabras. Ahí está el titular. No lo escribas: *cópialo*.

### El método: desmontar una página en 20 minutos

Hazlo con dos referencias y después con la tuya. Es exactamente lo que ha producido el diagnóstico de arriba.

1. Copia todo el texto de la página a un documento, en orden, sin imágenes ni estilos.
2. Al lado de cada sección escribe qué trabajo hace, eligiendo uno solo: *¿quién eres?* · *¿es para mí?* · *¿qué me llevo?* · *¿me lo creo?* · *¿qué hago ahora?* · *¿y si...?*
3. Si dos secciones hacen el mismo trabajo, una se muere. La web actual tiene seis haciendo «¿es para mí?» y ninguna haciendo «¿me lo creo?».
4. Lee el documento en voz alta. Todo lo que no le dirías a un cliente en un bar, fuera.

### Entrevistas a clientes

Cinco preguntas a 5-8 clientes o contactos. Sus palabras literales alimentan los titulares; esto va antes de escribir nada definitivo.

1. ¿Qué estabas intentando mejorar antes de buscar ayuda?
2. ¿Qué te hacía perder más tiempo o clientes?
3. ¿Qué alternativa estabas considerando?
4. ¿Qué te convenció de hablar con alguien?
5. ¿Cómo explicarías el resultado que querías conseguir?

La tercera es la más valiosa: define contra qué compites de verdad.

---

## 5. Marketing y lógica de negocio

Diez ideas, cada una con la decisión concreta que provoca en satorus.es. Si sólo te llevas tres, que sean la 1, la 5 y la 9.

### 01 · Posicionamiento: contra qué compites de verdad

La pregunta no es «qué hago mejor que otra agencia» sino «qué hace hoy el cliente en vez de contratarme». Se define listando la alternativa real, no la competencia teórica. (April Dunford, *Obviously Awesome*.)

> **En tu web:** tu competencia no es otro estudio: es el Excel que ya funciona, el sobrino que hace webs baratas y no hacer nada. Contra esos tres hay que argumentar, y ahora no se menciona a ninguno.

### 02 · Niveles de consciencia del comprador

Cinco estados: no sabe que tiene un problema, lo sabe, sabe que hay soluciones, compara proveedores, te conoce a ti. La portada tiene que atacar uno, no los cinco. (Eugene Schwartz.)

> **En tu web:** toda la portada habla al nivel 2 —«tienes un lío»—, a alguien que ya lo sabe. Quien está en el 3 o el 4 y podría comprar hoy no encuentra nada: ni qué existe, ni qué cuesta, ni por qué tú.

### 03 · Problema, agitación y solución: completo

La estructura clásica tiene tres partes. Casi todas las webs malas se quedan en el problema porque es la parte fácil de escribir.

> **En tu web:** tienes problema y agitación repetidos seis veces, y la solución nunca llega en términos del cliente. La solución no es «resolvemos el atasco»: es «el presupuesto sale el mismo día».

### 04 · Jobs to be done

Nadie compra el producto: contrata el progreso. Quien pide una web no quiere una web, quiere dejar de perseguir clientes o dejar de dar el mismo precio por teléfono ocho veces al día.

> **En tu web:** los tres servicios están nombrados por lo que son («Web», «A medida», «Automatización»). Nómbralos por el trabajo que hacen: las tres propuestas lo aplican.

### 05 · La ecuación de valor de una oferta

El atractivo sube con el resultado prometido y con la probabilidad de conseguirlo, y baja con el tiempo que tarda y el esfuerzo que exige. Cuatro palancas, y la mayoría sólo toca la primera.

> **En tu web:** tu CTA maximiza el esfuerzo (redacta tu problema), esconde el plazo y no da ninguna probabilidad. Arreglarlo cuesta una frase: «20 minutos, sales con un plan escrito, gratis».

### 06 · La especificidad es la prueba

Regla dura: un adjetivo sin número o sin nombre propio es relleno. «Rápida» no dice nada; «abre en menos de un segundo en 4G» sí. «Ordenado» no dice nada; «el dato se escribe una vez» sí.

> **En tu web:** pásale ese filtro a los titulares actuales: caen casi todos. Y sube Pidoteca y SportApp a la portada, porque son nombres propios y los nombres propios son prueba.

### 07 · Elegir a quién le hablas

Segmentar no reduce el mercado: reduce la competencia. Una página para «talleres» gana a una para «pymes» en conversión y en buscadores a la vez, y no te impide coger otros clientes.

> **En tu web:** elige dos o tres sectores donde ya tengas algo que contar —por SportApp, el deporte de base es uno— y hazles una página propia. La portada puede seguir siendo general.

### 08 · El precio es un mensaje, no un secreto

Una horquilla pública no regala margen: filtra. Te ahorra las llamadas de quien nunca iba a comprar y da seguridad a quien sí, que hoy asume que si no lo pones es porque es caro.

> **En tu web:** la FAQ responde «depende del alcance», que es justo lo que espera quien ya sospecha. Aunque sea «desde 2.500 €» o «los proyectos típicos van de X a Y», un número cambia la conversación.

### 09 · Una sola métrica

Sin un número que mirar, rediseñas por gusto, y el gusto cambia cada mes. Es exactamente el bucle en el que estás ahora.

> **En tu web:** define *consultas cualificadas al mes*: formularios y correos que describen un problema real. Apunta el número de partida antes de cambiar el texto, porque sin esa línea base la propuesta que elijas no se podrá juzgar.

### 10 · Escribir como hablas

La prueba definitiva es leerlo en voz alta a alguien que no sea del sector. Si suena a folleto, es folleto. Si te interrumpe para preguntar «¿y eso qué es?», esa frase se cae.

> **En tu web:** esto ya lo haces bien y es tu mayor activo: el tono llano está. El problema no es cómo suena, es que no avanza ni promete. Mantén la voz y cambia el contenido.

---

## 6. Nota de honestidad

Las tres propuestas respetan la restricción de `PRODUCT.md`: ningún testimonio, cifra de cliente ni caso de éxito inventado. Donde aparece un importe o un plazo va marcado como pendiente de decisión. Los textos están listos para pegar en `app/page.tsx` y en los componentes que indica cada sección.

**La decisión final y el motivo de cada descarte están en [2026-09-12-acta-decisiones-contenido.md](./2026-09-12-acta-decisiones-contenido.md).**
