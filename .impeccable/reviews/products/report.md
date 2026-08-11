# Dogfood Report: Satorus · Productos

| Field | Value |
|-------|-------|
| **Date** | 11/08/2026 |
| **App URL** | `http://localhost:3100/productos` |
| **Session** | `satorus-products` |
| **Scope** | Nueva página de productos, navegación móvil y lista de espera |

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| **Total** | **0** |

## Checks completed

- Vista completa a 1440 × 1000 y 390 × 844.
- Menú móvil abierto y cerrado; todos los destinos aparecen en el árbol accesible.
- Enlace de Pidoteca contrastado con el dominio del proyecto y respuesta HTTP 200.
- Formulario de SportApp probado con correo ficticio y consentimiento ausente; el endpoint devuelve 400 y la interfaz muestra el mensaje de recuperación.
- Imágenes, encabezados, regiones, labels, checkbox y enlaces presentes en el árbol accesible.
- Sin excepciones JavaScript. El único 400 observado fue el caso de validación provocado intencionadamente.

## Evidence

- `screenshots/desktop-final-full.png`
- `screenshots/mobile-final-full.png`
- `screenshots/mobile-menu-final.png`
