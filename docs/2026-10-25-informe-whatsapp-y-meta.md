# Informe de situación: Satorus, WhatsApp y asistente de IA

**Fecha:** 25 de octubre de 2026  
**Alcance:** trabajos realizados en esta conversación para la web, el correo, Instagram y la atención por WhatsApp.  
**Objetivo:** que un asistente responda desde el WhatsApp Business **614 43 18 97**, que las respuestas se vean en el Android y que el propietario pueda intervenir desde el móvil.

## Resumen ejecutivo

El número recibe mensajes en WhatsApp Business y la web ya lleva a ese chat. **El asistente todavía no responde por WhatsApp.** Existe un piloto de software probado localmente, pero no hay acceso a la API, credenciales ni webhook publicado. La cuenta personal de Facebook creada para intentar habilitar el acceso fue rechazada por Meta tras la comprobación de identidad, según informó el propietario. No se conoce el motivo exacto del rechazo. El propietario ha indicado que no quiere usar Facebook.

| Componente | Estado a 25/10/2026 | Evidencia o límite |
| --- | --- | --- |
| Año del pie de la web | Hecho | El código calcula `new Date().getFullYear()`; una comprobación anterior de la web mostró `© 2026`. |
| Enlace al WhatsApp de Satorus | Hecho | El número del pie abre `wa.me/34614431897` con un mensaje inicial. |
| Correo `somos@satorus.es` | Hecho | Reenvío configurado en STRATO hacia `juansataz.dev@gmail.com`; el propietario confirmó la llegada de un correo de prueba. |
| Instagram `@satorus.es` | Hecho | Cuenta creada y correo verificado por el propietario; se accedió con ella a Meta Business Suite. |
| WhatsApp Business en Android | Hecho | El propietario trasladó el 614 43 18 97 desde WhatsApp normal y confirmó que aparecía Satorus en la app. |
| Cartera empresarial de Meta | Parcial | Cartera **Satorus**, ID `1081437707986435`, administrada desde Instagram. El número figura vinculado como cuenta de WhatsApp Business App, no como número listo para Cloud API. |
| Bot de WhatsApp | Piloto local | Siete pruebas locales correctas. Sin `.env`, `tenants.json`, token, Phone Number ID real ni despliegue HTTPS. |
| Respuestas automáticas reales | **No activas** | Un mensaje de prueba llegó a WhatsApp Web y quedó sin respuesta automática. |

## Qué se hizo

### Web y acceso al número

- Se eliminó el año escrito a mano del pie. [`components/footer-year.tsx`](../components/footer-year.tsx) calcula el año al cargar la página, cuando vuelve a estar visible y cada minuto; [`components/site-footer.tsx`](../components/site-footer.tsx) lo muestra. Así debe pasar a `© 2027` sin editarlo manualmente. El cambio inicial quedó en el commit `89d4547`.
- El teléfono del pie se convirtió en enlace de WhatsApp. El número y la URL están definidos en [`lib/site.ts`](../lib/site.ts). **El enlace solo abre una conversación; no activa ninguna IA.**

### Correo, Instagram y Meta

- En STRATO se configuró `somos@satorus.es` como dirección con reenvío a `juansataz.dev@gmail.com`. Se envió un correo de prueba y el propietario confirmó su recepción. `info@satorus.es`, que figura en la web, es una dirección distinta.
- Se creó y verificó Instagram `@satorus.es` con `somos@satorus.es` y se usó para entrar en Meta Business Suite.
- Se creó la cartera empresarial **Satorus** (`1081437707986435`) y se vinculó el WhatsApp Business App del **614 43 18 97**. En la revisión anterior, Meta mostraba esa cuenta como aprobada. **Esa vinculación no entrega por sí sola el acceso a Cloud API.**
- Se intentó crear una aplicación para la API desde la cartera. Con el acceso de Instagram, la opción **«Create a new app ID»** estaba desactivada; no se creó aplicación de desarrollador. Al volver a consultar Meta el 25/10, la sesión había caducado y pidió iniciar sesión, por lo que no hay una nueva comprobación del estado de la cartera ese día.
- Se creó una cuenta personal de Facebook para el alta. El perfil se registró con el nombre comercial «Satorus Inteligencia Artifical». Meta solicitó un videoselfie y el propietario indicó después que rechazó la cuenta pese a enviar una foto. **No conocemos el texto exacto de la decisión ni si ofrece revisión.** El perfil empresarial de Instagram no debe confundirse con una cuenta personal de Facebook.

### WhatsApp y prueba real

- El propietario pasó el número del WhatsApp normal a WhatsApp Business en Android. Quería seguir viendo en el móvil lo que contesta el bot y poder responder manualmente.
- Se abrió WhatsApp Web y se recibió un mensaje enviado desde otro número para la prueba del 25/10, aproximadamente a las 10:39. **No apareció respuesta del bot.** Esto demuestra que la recepción de WhatsApp funciona, pero no que la API o la IA estén conectadas.
- Se estudió la modalidad oficial de **coexistencia**: conserva la app WhatsApp Business y permite que las respuestas enviadas por API aparezcan también en ella. Los mensajes escritos manualmente desde la app pueden notificarse al bot mediante `smb_message_echoes` para ceder el control a una persona. La elegibilidad real del número aún no se ha probado en un alta completa.

### Piloto del asistente

El proyecto está en `D:\Proyectos\agente-chat\agente-whatsapp-saas` (separado de esta web). Su [`README.md`](../../agente-chat/agente-whatsapp-saas/README.md) y [`ARQUITECTURA.md`](../../agente-chat/agente-whatsapp-saas/ARQUITECTURA.md) explican el prototipo y la evolución prevista.

El chat web que ya usa Satorus sigue siendo un canal aparte; no está conectado al WhatsApp de la empresa.

- El piloto recibe webhooks de la API oficial, verifica su firma, identifica la empresa por `phone_number_id`, aísla su conocimiento y guarda mensajes en una bandeja local.
- Las respuestas automáticas están **apagadas por defecto**. Para una prueba se limitan a remitentes autorizados, esperan 15 segundos y pueden pausarse cuando una persona responde desde la app. El comportamiento de `smb_message_echoes` está probado con datos simulados, **no contra el número real**.
- El 25/10 se ejecutaron las **7 pruebas con resultado correcto**. En el primer intento, una prueba falló por un permiso `EPERM` al renombrar archivos en el directorio temporal aislado de Windows; al ejecutar la misma suite con un temporal escribible dentro de `satorus`, pasaron las 7. Son pruebas locales con API y eventos simulados, no una prueba extremo a extremo con Meta.
- No existen `D:\Proyectos\agente-chat\agente-whatsapp-saas\.env` ni `tenants.json` reales. No se han guardado claves ni tokens en el repositorio. El servicio no está desplegado ni puede contestar al 614 43 18 97 en su estado actual.

## Obstáculos reales

1. **Acceso de administrador para la API.** Los procesos de alta consultados de [360dialog](https://docs.360dialog.com/docs/hub/embedded-signup) y [Twilio](https://www.twilio.com/docs/whatsapp/self-sign-up) usan Facebook Login para autorizar una cartera de Meta. Es una identidad administrativa; no obliga a publicar una página de Facebook. En esta instalación, entrar solo con Instagram permitió administrar la cartera, pero no crear la aplicación de la API.
2. **Cuenta personal rechazada.** Meta rechazó la cuenta creada con el nombre de la empresa, según comunicó el propietario. No podemos atribuir el rechazo a una causa concreta sin ver el aviso. [Facebook pide usar el nombre habitual de la persona en un perfil personal](https://www.facebook.com/help/511512475671884). No se ha creado otra cuenta para eludir esa decisión.
3. **Antigüedad del WhatsApp Business App.** La [guía de coexistencia de 360dialog](https://docs.360dialog.com/docs/hub/embedded-signup/coexistence-onboarding) exige al menos **7 días de uso activo**. La migración se hizo el 24/10; el 31/10 sería la primera fecha posible por ese criterio, **sin garantía de aprobación**. Otros proveedores pueden fijar requisitos distintos.
4. **Falta la conexión técnica.** Aún no hay aplicación Meta, acceso de Cloud API, `phone_number_id` real, token, suscripción de webhooks, endpoint HTTPS publicado, ni prueba de que `smb_message_echoes` llegue desde el número real.
5. **Preferencia del propietario.** Ha indicado expresamente que no quiere Facebook. Con los procesos oficiales examinados, no se ha encontrado una alta de **su propio bot** a la API de ese número que use únicamente WhatsApp Business o Instagram.

## Opciones a partir de aquí

| Opción | Qué consigue | Condición o coste |
| --- | --- | --- |
| API oficial con coexistencia | Reutilizar el piloto, conservar el número y la app, ver las respuestas en el móvil | Resolver el acceso administrativo de Meta y superar la elegibilidad de coexistencia. [360dialog publica un plan desde **49 €/mes por número**](https://docs.360dialog.com/docs/get-started/pricing), más cargos de mensajes, IA y alojamiento. **No se ha contratado nada.** |
| IA integrada de WhatsApp Business | Posibles respuestas automáticas desde la propia app, sin conectar este código | [Meta la ofrece solo a cuentas elegibles y con disponibilidad variable](https://about.fb.com/news/2026/06/meta-business-agent/). Falta comprobar si aparece **«Tu IA empresarial»** en las Herramientas del Android. No reutiliza `agente-chat`. |
| Respuestas básicas de WhatsApp Business | Saludo, ausencia y respuestas rápidas mientras se decide | Se configuran en el Android; no son una IA conversacional. |
| Bot conectado por QR a WhatsApp Web | Podría automatizar sin alta de Cloud API | **No es la API oficial** y puede fallar o comprometer el número; no se ha instalado ni conectado ninguno. [360dialog advierte que la coexistencia oficial no es compatible con APIs no oficiales](https://docs.360dialog.com/docs/resources/phone-numbers/coexistence). |

## Siguiente paso recomendado

Respetando la decisión de no usar Facebook, el paso más corto es comprobar **en el Android** si WhatsApp Business ofrece «Tu IA empresarial» / «Business AI». Si aparece, evaluar sus funciones y costes antes de activarla. Si no aparece, el número seguirá atendiéndose manualmente o con las respuestas básicas de la app.

Si más adelante se decide usar **el bot propio** por la API oficial, primero habrá que contar con un administrador admitido por Meta y confirmar la elegibilidad de coexistencia. Después: alta explícita como «Conectar WhatsApp Business App» (sin migrar el número a una modalidad que quite el móvil), obtención de credenciales, despliegue HTTPS, webhooks de mensajes y ecos, prueba con un solo remitente, comprobación de la respuesta en Android e intervención humana, y solo entonces ampliación de las respuestas automáticas.

**Estado final verificado:** el canal de WhatsApp funciona para recibir mensajes; el bot de IA **no está conectado ni responde**. No se han enviado respuestas automáticas a clientes, no se ha contratado proveedor y no se ha cambiado el número a Cloud API.
