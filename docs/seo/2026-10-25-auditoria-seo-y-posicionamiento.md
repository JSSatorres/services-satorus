# Auditoría SEO y estrategia de posicionamiento — satorus.es

**Fecha:** 25 de octubre de 2026
**Alcance:** auditoría técnica, on-page y de contenido de https://www.satorus.es, análisis de la competencia en Granada, Armilla y España, y propuesta de palabras clave y posicionamiento.
**Objetivo:** captar pymes de **Granada y Armilla** como prioridad y, en segundo plano, de **toda España**.
**Skills usadas:** `seo-audit`, `seo`, `schema`, `site-architecture`, `programmatic-seo`, `ai-seo` (catálogo `ai-dev-config`).

> **Qué no se ha podido medir.** No hay acceso a herramientas de pago (Ahrefs, Semrush). Por eso no hay volúmenes de búsqueda exactos. La demanda se ha estimado con el autocompletado de Google España y con las páginas que hoy posicionan. La dificultad es una valoración cualitativa, no un dato de herramienta.

## 0. Datos reales de Google Search Console (añadido el 25/10/2026)

La propiedad de dominio `sc-domain:satorus.es` ya estaba verificada (registro TXT en el DNS de IONOS). Solo hay datos desde el **28/09/2026**.

| Métrica | Valor |
|---|---|
| Clics totales | **1** |
| Impresiones | **40** |
| CTR medio | 2,5 % |
| Posición media | 36,7 |
| Páginas indexadas | **5** |
| Páginas no indexadas | 2 (redirecciones; es normal) |
| Sitemap | **Nunca se había enviado.** Se envió el 25/10/2026: estado correcto, 10 URLs descubiertas |

**Consultas:**

| Consulta | Impresiones | Posición |
|---|---|---|
| satorus | 14 | **7,9** |
| torus | 13 | 91,6 |
| orbitus | 1 | 39 |
| tus5estrellas | 1 | 70 |

Ni siquiera la búsqueda de la marca sale en primera posición. No hay ninguna consulta de servicio («software a medida», «diseño web»…).

**Páginas con impresiones:**

| Página | Impresiones | Posición |
|---|---|---|
| `www.satorus.es/` | 34 | 40,6 |
| `chat.satorus.es/` | 5 | 5,2 |
| `chat.satorus.es/admin` | 4 | 10,3 |
| `/aviso-legal` | 3 | 21,3 |
| `/politica-de-privacidad` | 2 | 8,5 |

**Hallazgos nuevos:**

1. 🔴 **`chat.satorus.es/admin` (panel de administración) y `chat.satorus.es` están indexados en Google.** Es un problema de seguridad y un desperdicio de autoridad. Arreglo: `noindex` (meta robots o cabecera `X-Robots-Tag`) en toda la app del chat, `Disallow: /admin` en su robots.txt y solicitud de retirada temporal en Search Console → *Retirada de URLs*.
2. 🔴 **Las páginas de proyecto y producto no estaban en el índice.** Sin sitemap, y huérfanas, Google no las había descubierto. Con el sitemap ya enviado deberían empezar a indexarse en días o semanas. Se pueden acelerar con *Inspección de URLs → Solicitar indexación*.
3. Core Web Vitals: «Sin datos» (no hay tráfico suficiente para datos de campo). Por ahora la referencia es Lighthouse (§2.2).

**Google Business Profile:** creado el 25/10/2026 como negocio de área de servicio.
- Nombre: «Satorus»
- Categoría principal: «Empresa de software»; secundaria: «Diseñador de sitios web»
- Zonas: Armilla y Granada
- Teléfono 614 43 18 97 y web https://www.satorus.es/
- Descripción de 657 caracteres
- **Pendiente:** verificación (necesita la dirección postal completa en Armilla), logotipo, fotos de trabajo y horario. **No es visible públicamente hasta verificarlo.**

---

## 1. Resumen ejecutivo

**Estado general: la base técnica es buena, pero la web no compite por ninguna búsqueda.** Está bien construida: HTML renderizado en servidor, canonicals correctos, robots y sitemap, accesibilidad 100 y SEO de Lighthouse 92. Pero Google no tiene ningún motivo para enseñarla cuando alguien busca «software a medida Granada» o «diseño web Granada». Las causas son tres:

1. **No dice dónde estáis.** «Granada» y «Armilla» no aparecen en ninguna página indexable. El aviso legal pone «Domicilio: España».
2. **No tiene páginas de servicio.** Todo vive en la portada. No hay una URL para «diseño web», otra para «software a medida» y otra para «automatización con IA», así que no hay nada que posicionar para cada búsqueda.
3. **No tiene autoridad ni presencia local.** No se encontró perfil de Google Business y la búsqueda de la marca «satorus.es» no devuelve la web. No hay datos estructurados ni reseñas, y apenas hay enlaces externos.

**Las 5 prioridades:**

| # | Qué | Por qué |
|---|-----|---------|
| 1 | Crear perfil de **Google Business** (Granada/Armilla) y conseguir las primeras reseñas reales | Es lo que más pesa en las búsquedas «… en Granada»: el mapa sale encima de los resultados orgánicos |
| 2 | Crear **3 páginas de servicio locales**: software a medida, diseño web, IA/automatización | Sin una URL por servicio no se puede posicionar |
| 3 | Añadir **Granada/Armilla** a title, H1, textos y datos estructurados (`ProfessionalService`, `FAQPage`) | Hoy la web no transmite ninguna señal local |
| 4 | **Enlazar los casos de estudio**: 4 de 7 páginas de proyecto son huérfanas | Contenido bueno que Google apenas descubre |
| 5 | **Aligerar el vídeo del hero en móvil** (4,3 MB, LCP 4,2 s) | Core Web Vitals en rojo en móvil |

**Dónde posicionarse (en una frase):** *el equipo de ingenieros de Granada que convierte el problema de una pyme en una web, un software o una automatización con IA hechos a medida, con trato directo y sin plantillas.* No conviene competir por precio ni empezar por «diseño web Granada», que está saturado. Hay que entrar por **software a medida** e **IA/automatización en Granada**, donde la competencia que posiciona **ni siquiera es de Granada**.

---

## 2. Auditoría técnica

Evidencias obtenidas el 25/10/2026 con curl, el navegador renderizado y Lighthouse 12 (móvil simulado).

### 2.1 Rastreo e indexación

| Problema | Impacto | Evidencia | Arreglo | Prioridad |
|---|---|---|---|---|
| **4 páginas huérfanas**: `/proyectos/angel-mendoza`, `/proyectos/enrolla2`, `/productos/pidoteca` y `/productos/sportapp` no reciben ningún enlace interno | Alto | Ni la portada ni `/productos` las enlazan. Las tarjetas apuntan a `enrolla2.com`, `angelmendoza.es` y `pidoteca.com`. Solo se descubren por el sitemap | Enlazar cada tarjeta a la página interna del caso y dejar el enlace externo dentro del caso | **Alta** |
| `/equipo` está en `noindex` y fuera del sitemap | Medio-alto | `app/equipo/page.tsx:18` y `app/sitemap.ts` | Completar los datos reales de Tony e indexarla. Es la página con más señales de experiencia y confianza (E-E-A-T): personas reales, LinkedIn y «Granada» | Alta |
| Redirección `satorus.es → www` **temporal (307)** | Medio | `curl` devuelve 307 | En Vercel → Domains, marcar el apex como redirección **permanente (308)** | Alta (5 min) |
| El sitemap no tiene `lastmod` | Bajo | `app/sitemap.ts` | Añadir `lastModified` por ruta | Baja |
| Marca no encontrada en el buscador | Alto (diagnóstico) | La búsqueda de «satorus.es» no devuelve la web | Verificar el dominio en **Google Search Console** y **Bing Webmaster Tools**, enviar el sitemap y revisar la cobertura | **Alta** |
| robots.txt | OK | Permite todo menos `/api/` y declara el sitemap | — | — |
| Canonicals | OK | Cada página tiene un canonical propio y correcto | — | — |
| 404 real | OK | `/no-existe` devuelve 404 con `noindex` | — | — |
| HTTP → HTTPS | OK | 308 a https | — | — |

### 2.2 Velocidad y Core Web Vitals (móvil, Lighthouse)

**Rendimiento 78 · Accesibilidad 100 · Buenas prácticas 100 · SEO 92**

| Métrica | Valor | Objetivo |
|---|---|---|
| LCP | **4,2 s** ❌ | < 2,5 s |
| TBT | 280 ms ⚠️ | < 200 ms |
| CLS | 0,001 ✅ | < 0,1 |
| FCP | 1,8 s ⚠️ | < 1,8 s |
| Peso total | **5,2 MB** ❌ | < 1,5 MB |

| Problema | Evidencia | Arreglo |
|---|---|---|
| **El LCP es el vídeo del hero**: `satorus-hero-loop.mp4` pesa **4.350 KB** (84 % del peso de la página) | Lighthouse: elemento LCP = `<video … src="/videos/satorus-hero-loop.mp4">` | En móvil, mostrar solo el poster (o un vídeo ≤ 600 KB a 720p, sin audio y bien comprimido). Cargar el vídeo después de que se pinte el poster, con `preload="none"` y `<link rel="preload">` del poster |
| Logo del chat de 179 KB servido desde `chat.satorus.es` | Lighthouse: payload | Usar un PNG/WebP de 64–128 px |
| 3 familias de fuentes variables (Caveat 73 KB) | Lighthouse | Cargar Caveat solo donde se use, o hacer un subset |
| Recursos que bloquean el renderizado (~580 ms) | Lighthouse | Revisar el CSS global (`book.css`, `home-sections.css`) y partirlo por ruta |
| Un script sin caché larga (`/…/script.js`, de Vercel Analytics) | Lighthouse | No es crítico, viene de Vercel |

### 2.3 Seguridad y otros

- HTTPS, CSP básica, `X-Frame-Options` y `nosniff`: correcto.
- **Div oculto con notas internas de diseño** (`data-direction-contract`, en `app/layout.tsx`) servido en todas las páginas. No penaliza, pero son notas internas publicadas. Conviene quitarlo.
- Un enlace sin `href` dentro del widget de chat (`<a class="booking-result" hidden>`). Es menor.

---

## 3. Auditoría on-page

### 3.1 Titles, descriptions y H1 actuales

| Página | Title (caracteres) | Description | H1 | Problema |
|---|---|---|---|---|
| `/` | «Satorus \| Webs, herramientas e IA para pymes» (44) | 154 ✅ | «Satorus.es. Tu negocio puede llegar más lejos.» | **Sin ubicación ni palabra clave.** Nadie busca «herramientas», y el H1 es un eslogan |
| `/productos` | «Proyectos: apps y webs \| Satorus» (32) | 81 ⚠️ corta | OK | La URL dice *productos* y el title dice *proyectos*. Es confuso |
| `/productos/pidoteca` | 50 | 109 ⚠️ | OK | Huérfana. No ataca «software para restaurantes» ni «carta digital QR» |
| `/productos/sportapp` | 43 | 99 ⚠️ | OK | Huérfana. No ataca «app gestión club deportivo», que sí aparece en el autocompletado |
| `/proyectos/goblintrader` | 59 ✅ | 166 ✅ | OK | Es el mejor caso para **Verifactu**, pero el title no lo menciona |
| `/proyectos/angel-mendoza` | 48 | 116 ⚠️ | OK | Huérfana |
| `/proyectos/enrolla2` | 42 | 99 ⚠️ | OK | Huérfana |
| `/lector-bilingue` | 39 | 106 | OK | Producto aparte, sin relación con el negocio principal (está bien como prueba de capacidad) |
| `/equipo` | «Equipo \| Satorus» (16) | 193 ⚠️ larga | OK | `noindex` |

### 3.2 Contenido de la portada

- ~880 palabras visibles, con una estructura H2 clara. **El problema está en el tema, no en la cantidad**: los H2 son frases de marca («Lo que hacemos, dicho claro.», «La siguiente historia es la tuya.») y no dicen *qué* ni *dónde*.
- H2 «Gira el móvil para leer el cuaderno»: un aviso de interfaz marcado como encabezado. Debería ser un `<p>`.
- **La FAQ existe** (7 preguntas en `lib/home-content.ts`), pero no tiene schema `FAQPage`. Además, la respuesta a «¿Cuánto cuesta?» no da cifras. Varios competidores publican precios orientativos (OGVisivo, ForgeNEX, Nazarcode), y un rango del tipo «webs desde X €, software desde Y €» capta búsquedas de precio y filtra contactos.

### 3.3 Datos estructurados

**No hay ningún JSON-LD.** Comprobado en el DOM renderizado: `script[type="application/ld+json"]` = 0. **Todos** los competidores que posicionan en Granada tienen `LocalBusiness`/`ProfessionalService`, y la mayoría también `FAQPage`, `Service` y `BreadcrumbList`.

Qué añadir (skill `schema`):

- **Layout**: `ProfessionalService` (o `LocalBusiness`) con `name`, `url`, `logo`, `telephone`, `email`, `areaServed` (Granada, Armilla, España), `address` (con el domicilio real cuando esté dado de alta) y `sameAs` (LinkedIn, Google Business, GitHub). Más `WebSite`.
- **Portada**: `FAQPage` con las 7 preguntas.
- **Páginas de servicio**: `Service` + `BreadcrumbList` + `FAQPage` propia.
- **Casos**: `CreativeWork`/`Article` + `BreadcrumbList`.
- **Equipo**: `Person` para cada miembro, con `worksFor` y `sameAs` a LinkedIn.

### 3.4 Imágenes

Todas tienen `alt` y los textos son descriptivos ✅. Se sirven en AVIF/WebP vía `next/image` ✅. Lighthouse estima solo ~126 KB de ahorro.

---

## 4. Contenido, confianza y presencia local

| Señal | Estado | Acción |
|---|---|---|
| Ubicación (Granada/Armilla) | ❌ ausente en páginas indexables | Ponerla en title, H1/subtítulo, footer, schema y páginas de servicio |
| Datos legales del titular (nombre, NIF, domicilio) | ❌ pendiente (ver `docs/pendientes/datos-legales-titular.md`) | Además de ser obligatorio por la LSSI, es una señal de confianza para Google y para el cliente |
| Google Business Profile | ❌ no encontrado | Crearlo como **negocio de área de servicio**: se puede ocultar la dirección si no recibís clientes en un local. Categoría principal «Diseñador de sitios web» o «Desarrollador de software», con área Granada y su área metropolitana |
| Reseñas | ❌ ninguna | Pedirlas a clientes **reales** (Enrolla2, Ángel Mendoza, GoblinTrader) con el enlace de reseña, de forma neutral y sin incentivos |
| Página de equipo | ⚠️ existe pero `noindex` | Indexarla |
| Testimonios y cifras | ❌ no hay (decisión correcta: no inventar) | Pedir una frase y permiso a cada cliente real |
| Blog o guías | ❌ no hay | Ver el plan de contenidos (§7) |
| Enlaces externos (autoridad) | ❌ prácticamente ninguno | Ver §8 |

---

## 5. Competencia

### 5.1 Quién posiciona y qué hace

**Cluster A — «diseño web Granada»: saturado.**

| Competidor | Lo que destaca | Schema | Palabras |
|---|---|---|---|
| [Idento](https://www.idento.es/agencia-diseno-web-granada/) | 16 años, casos, FAQ, valoraciones | LocalBusiness + AggregateRating | ~4.300 |
| [Citysem](https://citysem.es/diseno-web/) | Páginas por municipio (también [Armilla](https://citysem.es/diseno-web-en-armilla/)) | LocalBusiness, Service, FAQPage | ~3.700 |
| [Acuabit](https://acuabit.es/diseno-web-granada/) | WordPress, desde 2010 | Breadcrumb | ~2.900 |
| [Close Marketing](https://close.marketing/diseno-web/) | **Oficina en Armilla**, «diseño web potenciado con IA», testimonios | Service, FAQPage | ~2.000 |
| [Limón](https://limonpublicidad.com/marketing-digital/diseno-web/), [Escándalo Digital](https://www.escandalodigital.com/index.php/agencia-marketing-online/diseno-paginas-web/diseno-web-granada.html), [Squembri](https://www.squembri.com/servicios/diseno-web-en-granada-que-convierte-visitas-en-clientes), [Mixent](https://mixent.es/diseno-web-granada/), [webgranada.es](https://webgranada.es/) | Agencias veteranas (12–18 años), casi todas WordPress | — | — |
| [OGVisivo](https://ogvisivo.com/) | **Granada y Armilla, desde 99 €**, «somos dos y damos la cara» | ProfessionalService, Offer, FAQPage | ~1.200 |

*Conclusión:* son agencias con 10–18 años de antigüedad, reseñas y páginas de 3.000–4.500 palabras. OGVisivo ya ocupa el ángulo «dúo cercano y barato en Granada y Armilla». **No es la puerta de entrada**: hay que tener una página para este término, pero no esperar resultados rápidos con él.

**Cluster B — «software a medida Granada»: oportunidad clara.**

| Competidor | Observación |
|---|---|
| [ForgeNEX](https://www.forgenex.com/soluciones/desarrollo-software-en-granada) | **Es de Sevilla** («Desde Sevilla, para Granada»). Páginas por ciudad y sector |
| [Grupo Unifema](https://grupounifema.com/servicios/desarrollo-software-a-medida-granada) | Página de ciudad generada, de toda España (~970 palabras) |
| [Coco Solution](https://cocosolution.com/desarrollo/software/granada/) | **Sede en Las Palmas** |
| [Nazarcode](https://nazarcode.com/software-empresarial-medida) | Local (desde 2020), ~1.000 palabras, H1 mal formado |
| [PYV Systems](https://pyv.systems/desarrollo-software-granada/), [Noática](https://noatica.com/empresa-de-programacion-informatica-en-granada/) | Páginas antiguas |
| [Sortlist](https://www.sortlist.es/s/software-development/granada-es) | Directorio, y se puede aparecer en él |

*Conclusión:* buena parte de lo que posiciona son **páginas de ciudad de empresas que no están en Granada**, con contenido corto. Un equipo **realmente local**, con perfil de Google Business, casos reales (GoblinTrader con Verifactu, Pidoteca, SportApp) e ingenieros con nombre y apellidos, **puede ganar aquí**.

**Cluster C — «IA / automatización Granada»: emergente.**

| Competidor | Observación |
|---|---|
| [ForgeNEX](https://www.forgenex.com/soluciones/automatizacion-ia-en-granada) | Sevilla otra vez |
| [Vectoryal](https://vectoryal.com/agencia-ia-granada) | **De Castilla y León** (lo dice en su propio H2) |
| [Sancantia](https://www.sancantia.com/consultoria-ia-granada) | Página bien trabajada: fundadora con nombre, sectores, schema completo |
| [asesor-ia.io](https://asesor-ia.io/), [Ettamimi](https://ettamimi.com/automatizacion-ia-granada-1), [agenciaia.ai](https://agenciaia.ai/granada/), [agencia-ia.digital](https://www.agencia-ia.digital/granada/granada) | Mezcla de locales y páginas genéricas por ciudad |

*Conclusión:* es un mercado nuevo con muchos jugadores de fuera. La ventaja de Satorus es que **hace el software, no solo conecta herramientas** (n8n/Zapier), y que puede enseñar lo que ha construido de verdad.

**Cluster D — nacional (toda España).** Para «software a medida para pymes» posicionan software houses veteranas (Verial, Softcode) y directorios (Sortlist). Para «cuánto cuesta una página web» posicionan blogs de hosting y builders, en su mayoría latinoamericanos. Ahí entran **guías útiles con precios reales en euros para España**.

### 5.2 Demanda observada (autocompletado de Google España)

- **Local:** «agencia diseño web granada», «diseño web wordpress granada», «crear pagina web granada», «empresas desarrollo web granada», «desarrollo de aplicaciones web granada», «programador web granada», «agencia inteligencia artificial granada», «empresas automatizacion granada». Para «software a medida granada» y «diseño web armilla» no sale autocompletado, señal de **volumen bajo pero intención muy alta**.
- **Nacional:** «software a medida para empresas», «software a medida para pymes», «software a medida precio», «software empresarial a medida», «quiero crear una app para mi negocio», «cuánto cuesta crear una app para mi negocio», «cuánto cuesta una página web en España», «cuánto cuesta una página web básica/profesional», «automatizar procesos administrativos con IA», «chatbot WhatsApp pequeñas empresas», «chatbot WhatsApp España», «verifactu software / programas / cómo funciona», «app gestión club deportivo / club fútbol».
- **Ruido a evitar:** «desarrollo de aplicaciones granada» y «programador granada» se llenan de FP y ofertas de empleo. «pagina web granada» trae ayuntamiento, Alhambra y universidad.

---

## 6. Dónde posicionarse y cómo

### 6.1 Posicionamiento

**Promesa:** *«Ingenieros de software en Granada que entienden tu negocio: webs, software a medida y automatizaciones con IA para pymes, explicado sin tecnicismos.»*

Diferenciales frente a lo visto:

1. **Local de verdad** frente a páginas de ciudad hechas desde Sevilla, Castilla y León o Las Palmas. Hay que demostrarlo: perfil de Google Business, Granada y Armilla en la web, personas con cara y nombre.
2. **Ingeniería y no plantilla**: casi todas las agencias de diseño web son WordPress, y Satorus hace web, software e IA con código propio. Eso permite entrar en proyectos que una agencia de WordPress no puede hacer (TPV con Verifactu, apps de gestión).
3. **Casos reales y concretos**: GoblinTrader (caja, Verifactu, stock, fichaje), Pidoteca (restauración), SportApp (clubes), Enrolla2 y Ángel Mendoza (webs).
4. **Lenguaje de negocio**, que ya es la seña de la marca y encaja con lo que buscan las pymes.

**Qué no hacer:** competir por precio con OGVisivo (99 €), empezar la estrategia por «diseño web Granada», ni crear 50 páginas de municipio cambiando solo el nombre (Google lo trata como contenido escalado de poco valor; ver la skill `programmatic-seo`).

### 6.2 Mapa de palabras clave → páginas

Dificultad cualitativa: 🟢 asumible · 🟡 media · 🔴 alta. La prioridad combina la intención de compra con la dificultad.

| Página (URL propuesta) | Palabra principal | Secundarias | Intención | Dif. | Prioridad |
|---|---|---|---|---|---|
| `/` | software a medida y webs para pymes en Granada | Satorus, desarrollo web Granada, empresa de software Granada | Marca + comercial | 🟡 | P1 |
| `/software-a-medida-granada` | **software a medida Granada** | desarrollo de software Granada, software empresarial a medida, programa de gestión a medida, aplicaciones a medida para empresas, desarrollo de aplicaciones web Granada | Compra | 🟢 | **P1** |
| `/automatizacion-ia-granada` | **agencia de inteligencia artificial Granada** | automatización de procesos Granada, chatbot WhatsApp para empresas, IA para pymes Granada, empresas automatización Granada | Compra | 🟢-🟡 | **P1** |
| `/diseno-web-granada` | diseño web Granada | agencia diseño web Granada, crear página web Granada, páginas web para empresas Granada, empresas desarrollo web Granada | Compra | 🔴 | P2 |
| `/diseno-web-armilla` *(solo si la base o el área de trabajo real es Armilla)* | diseño web Armilla | página web Armilla, software a medida Armilla, informático Armilla | Compra | 🟢 | P2 |
| `/software-verifactu-a-medida` (o guía + caso) | **software Verifactu a medida** | TPV Verifactu a medida, adaptar mi programa a Verifactu, Verifactu cómo funciona | Compra + informativa | 🟡 | **P1 (urgente)** |
| `/software-para-restaurantes` (Pidoteca) | software de gestión para restaurantes | carta digital QR, pedidos desde la mesa, TPV restaurante | Compra | 🔴 nacional | P3 |
| `/app-gestion-club-deportivo` (SportApp) | app gestión club deportivo | app gestión club de fútbol, software para clubes deportivos | Compra | 🟡 | P3 |
| `/proyectos` (renombrar `/productos`) | proyectos de desarrollo web y software | casos de éxito, portfolio | Confianza | — | P2 |
| Blog: «Cuánto cuesta una página web en España (2026)» | cuánto cuesta una página web en España | precio página web profesional/básica | Informativa → comercial | 🟡 | P2 |
| Blog: «Cuánto cuesta un software a medida» | software a medida precio | cuánto cuesta un programa a medida | Informativa → comercial | 🟢 | P2 |
| Blog: «Cuánto cuesta crear una app para mi negocio» | cuánto cuesta crear una app para mi negocio | quiero crear una app para mi negocio | Informativa → comercial | 🟡 | P2 |
| Blog: «Software a medida o estándar: cuándo compensa» | software a medida o estándar | software a medida vs software estándar | Informativa | 🟢 | P3 |
| Blog: «Qué procesos de una pyme automatizar con IA» | automatizar procesos administrativos con IA | procesos que se pueden automatizar con IA | Informativa | 🟡 | P3 |
| Blog: «Chatbot de WhatsApp para pequeñas empresas» | chatbot WhatsApp pequeñas empresas | chatbot WhatsApp España | Informativa → comercial | 🟡 | P3 |

**Por qué Verifactu es urgente:** el sistema será obligatorio el **1 de enero de 2027** para sociedades y el **1 de julio de 2027** para autónomos (aplazamiento por el RD-ley 15/2025). La demanda va a subir en los próximos meses, y ya tenéis un caso real (GoblinTrader) con caja y tickets Verifactu. Es la palabra con más oportunidad temporal de toda la lista.

### 6.3 Arquitectura propuesta (skill `site-architecture`)

```
/                                   → portada (marca + Granada + 3 servicios)
├── /software-a-medida-granada      → servicio (P1)
├── /automatizacion-ia-granada      → servicio (P1)
├── /diseno-web-granada             → servicio (P2)
├── /diseno-web-armilla             → local (P2, solo con presencia real)
├── /software-verifactu-a-medida    → servicio nacional (P1)
├── /proyectos                      → hub de casos (hoy /productos, redirección 301)
│   ├── /proyectos/goblintrader
│   ├── /proyectos/pidoteca         (hoy /productos/pidoteca, 301)
│   ├── /proyectos/sportapp         (hoy /productos/sportapp, 301)
│   ├── /proyectos/enrolla2
│   └── /proyectos/angel-mendoza
├── /blog                           → guías (precios, Verifactu, IA)
├── /equipo                         → indexable
└── /lector-bilingue
```

Reglas de enlazado interno:

- Cada página de servicio enlaza a 2–3 casos relevantes:
  - software → GoblinTrader, Pidoteca, SportApp
  - web → Enrolla2, Ángel Mendoza
  - IA → el chat de la propia web y los casos de automatización que haya
- Cada caso enlaza de vuelta a su servicio.
- El menú principal pasa a «Servicios» (con submenú de los 3 servicios), «Proyectos», «Equipo» y «Contacto».
- El footer muestra «Satorus · Granada», el teléfono, el correo y los enlaces a los servicios.

### 6.4 Cómo debe ser cada página de servicio

Basado en lo que hacen bien Sancantia, Citysem y ForgeNEX, y evitando sus fallos:

- **Title** de ~55–60 caracteres: «Software a medida en Granada para pymes | Satorus».
- **H1** con la palabra clave y la ciudad. El estilo de marca puede ir en el subtítulo.
- **900–1.500 palabras útiles**, no relleno:
  - qué problemas resuelve, con ejemplos de pymes
  - qué entregáis
  - proceso, plazos y **rangos de precio orientativos**
  - casos reales enlazados
  - por qué un equipo local (reuniones en persona en Granada y Armilla)
  - FAQ específica de 5–7 preguntas
- Schema `Service` + `FAQPage` + `BreadcrumbList`.
- Llamada a la acción clara (WhatsApp, formulario o teléfono) arriba y abajo.
- Nada de texto copiado entre páginas.

---

## 7. Plan de contenidos (primeros 3 meses)

| Mes | Contenido | Palabra objetivo |
|---|---|---|
| 1 | Guía «Verifactu para comercios y pymes: qué cambia y cómo adaptar tu programa» + página de servicio Verifactu | verifactu cómo funciona / software verifactu a medida |
| 1 | «Cuánto cuesta un software a medida en España (precios reales 2026)» | software a medida precio |
| 2 | «Cuánto cuesta una página web en España en 2026» | cuánto cuesta una página web en España |
| 2 | Caso GoblinTrader ampliado: «Cómo digitalizamos una tienda: caja, stock y Verifactu» | caso + verifactu |
| 3 | «Qué tareas de una pyme se pueden automatizar con IA (y cuáles no)» | automatizar procesos administrativos con IA |
| 3 | «Chatbot de WhatsApp para pequeñas empresas: cuándo merece la pena» | chatbot WhatsApp pequeñas empresas |

Cada artículo enlaza a su página de servicio y lo firma una persona del equipo (autor con nombre y enlace a `/equipo`), lo que suma señales de experiencia y confianza.

---

## 8. Autoridad y enlaces (sin trucos)

1. **Créditos en las webs de clientes**: «Web desarrollada por Satorus» en el footer de enrolla2.com, angelmendoza.es y goblintrader.es, con su permiso. Son enlaces reales y del sector.
2. **Perfiles y directorios relevantes**: Google Business Profile, Bing Places, Apple Business Connect, Sortlist, Clutch, Cámara de Comercio de Granada, LinkedIn de empresa y GitHub de organización. Siempre con el mismo nombre, teléfono, web y área (NAP coherente).
3. **Ecosistema local**: asociaciones de empresarios de Granada y Armilla, eventos de emprendimiento, colaboraciones con la Universidad de Granada y prensa local (por ejemplo, un artículo sobre Verifactu para el comercio granadino).
4. **Productos propios como imán de enlaces**: el Lector Bilingüe (APK gratuita) puede tener una ficha en directorios de apps y en foros de aprendizaje de inglés.

---

## 9. Visibilidad en buscadores con IA (skill `ai-seo`)

- `robots.txt` ya permite todos los bots, incluidos los de búsqueda con IA (OAI-SearchBot, PerplexityBot, Claude-SearchBot) ✅.
- Añadir `/llms.txt` con qué es Satorus, sus servicios, el área (Granada, Armilla, España) y los enlaces a los servicios y casos. Ahora mismo devuelve 404.
- Una entidad coherente: el mismo nombre, descripción y `sameAs` en el schema, Google Business, LinkedIn y los directorios.
- Respuestas autocontenidas en las FAQ y en las páginas de servicio, con frases que un modelo pueda citar tal cual («Satorus es un equipo de ingenieros de software en Granada que…»).

---

## 10. Plan de acción priorizado

### Semana 1 — arreglos rápidos (código + configuración)

- [ ] Vercel: redirección del apex a **permanente (308)**.
- [x] Search Console verificado y sitemap enviado (25/10). Pendiente: Bing Webmaster Tools.
- [x] **Crear Google Business Profile** como negocio de área de servicio en Granada y área metropolitana (Armilla incluida). Creado el 25/10; falta verificarlo.
- [x] `app/layout.tsx`: nuevo title y description con Granada. Propuesta:
  - title: «Software a medida, webs e IA para pymes en Granada | Satorus»
  - description: «Equipo de ingenieros en Granada: creamos webs, software a medida y automatizaciones con IA para pymes. Te lo explicamos sin tecnicismos. Primera consulta sin compromiso.»
- [x] Portada: H1 o subtítulo con la palabra clave y la ciudad. El H2 «Gira el móvil…» pasa a `<p>`.
- [x] JSON-LD `ProfessionalService` + `WebSite` en el layout y `FAQPage` en la portada.
- [x] ~~Enlazar las 4 páginas huérfanas~~ → **Decisión (25/10): se retiran por ahora** las páginas de Pidoteca, SportApp, Ángel Mendoza y Enrolla2 (redirección temporal a `/productos`; sus tarjetas enlazan a la web de cada proyecto). Solo queda la página interna de GoblinTrader.
- [x] Hero en móvil: vídeo 720p de 514 KB (antes 4,3 MB) y la imagen siempre debajo como LCP. Peso de la portada en móvil: 5,2 MB → 1,1 MB. El LCP simulado sigue en ~4,4 s por render delay (CSS global de 155 KB que bloquea el render + JS de animaciones): siguiente paso, partir el CSS por ruta.
- [x] Quitar el div oculto `data-direction-contract`.
- [x] Sitemap con `lastModified`.

### Semanas 2–4 — base local y páginas de servicio

- [ ] Datos legales del titular (NIF y domicilio) tras el alta de autónomo.
- [ ] `/equipo` indexable, con los datos reales de Tony y schema `Person`.
- [ ] Páginas `/software-a-medida-granada` y `/automatizacion-ia-granada`.
- [ ] Página `/software-verifactu-a-medida` + guía de Verifactu.
- [ ] Pedir reseñas en Google Business a los clientes reales.
- [ ] Créditos con enlace en las webs de clientes.
- [ ] FAQ «¿Cuánto cuesta?» con rangos orientativos.

### Meses 2–3 — crecimiento

- [ ] `/diseno-web-granada` (y `/diseno-web-armilla` si hay presencia real).
- [ ] Renombrar `/productos` a `/proyectos`, mover Pidoteca y SportApp con 301 y actualizar el sitemap.
- [ ] Blog con los 6 artículos del §7.
- [ ] Directorios (Sortlist, Clutch, Cámara de Comercio) y `llms.txt`.
- [ ] Páginas sectoriales de Pidoteca (restauración) y SportApp (clubes).

### Cómo medirlo

- **Search Console**: impresiones y clics por consulta y página. Revisar cada mes las consultas en posiciones 8–20, que son las más fáciles de subir (ver `seo-audit/references/rankings-push.md`).
- **Google Business**: llamadas, solicitudes de ruta y clics a la web.
- **Vercel Analytics** (ya instalado): definir como conversión los clics en WhatsApp, teléfono y formulario.
- **Repetir Lighthouse móvil** después de cambiar el hero. Objetivo: LCP < 2,5 s y rendimiento ≥ 90.
