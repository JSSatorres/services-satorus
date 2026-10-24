# Pendiente: datos legales del titular

**Estado:** pendiente, a la espera del alta como autónomo.
**Anotado:** 24 de octubre de 2026.

## Qué falta

La web ya muestra el correo (info@satorus.es) y el teléfono (614 43 18 97).
Faltan estos datos, que la ley exige mostrar:

| Dato | Qué poner | Valor actual en la web |
| --- | --- | --- |
| Nombre del titular | Nombre y apellidos del autónomo | «Satorus (Software a Medida)» |
| NIF | El NIF del autónomo (es el DNI con su letra) | No aparece |
| Domicilio | Dirección completa: calle, número, código postal, municipio y provincia | «España» |

Si en el futuro se crea una sociedad (S.L.), habría que poner además la razón
social, el CIF y los datos de inscripción en el Registro Mercantil.

## Por qué es obligatorio

- **LSSI (Ley 34/2002), art. 10:** el aviso legal debe identificar al titular
  de la web con su nombre, domicilio, NIF y datos de contacto. Si estos datos
  faltan, la ley lo considera infracción grave.
- **RGPD, art. 13.1.a:** la política de privacidad debe decir quién es el
  responsable del tratamiento y cómo contactar con él.

## Dónde hay que cambiarlo

1. [app/aviso-legal/page.tsx](../../app/aviso-legal/page.tsx), sección
   «1. Titular del sitio web»:
   - Cambiar «Denominación» por el nombre y apellidos.
   - Añadir una línea `<li><strong>NIF:</strong> …</li>`.
   - Sustituir «Domicilio: España» por la dirección completa.
2. [app/politica-de-privacidad/page.tsx](../../app/politica-de-privacidad/page.tsx),
   sección «1. Responsable del tratamiento»:
   - Cambiar «Responsable» por el nombre y apellidos (se puede mantener
     «Satorus» como nombre comercial: «Nombre Apellidos (Satorus)»).
   - Añadir el NIF y el domicilio.
3. Actualizar la fecha de «Última actualización» en las dos páginas.
4. Cuando todo esté hecho, borrar este archivo.
