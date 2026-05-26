# Impeccable — Referencia completa de comandos

## Comandos de tono visual

### `/quiet`
Reduce la carga visual al mínimo funcional.
- Elimina sombras decorativas redundantes
- Reduce la paleta a 2-3 colores máximo
- Aumenta espaciado entre elementos
- Simplifica bordes y separadores
- **Anti-pattern objetivo:** "Christmas tree UI" (demasiados efectos visuales)

### `/bolder`
Amplifica el impacto visual con decisiones más atrevidas.
- Aumenta tamaño tipográfico de headings (+20-40%)
- Sube el contraste de colores principales
- Elimina elementos de apoyo que diluyen el mensaje principal
- Introduce un punto focal dominante claro
- **Anti-pattern objetivo:** Diseño tímido sin jerarquía clara

### `/editorial`
Aplica principios de diseño editorial (revista, libro de arte).
- Introduce asimetría calculada en el layout
- Aplica escala tipográfica dramática
- Usa blancos generosos como elemento de diseño
- Alinea a una retícula de columnas explícita
- **Anti-pattern objetivo:** Layout de webapp genérico sin carácter

### `/delight`
Añade capas de placer sin afectar la funcionalidad.
- Micro-interacciones en hover/focus (150-300ms, ease-out)
- Transiciones de estado suaves
- Feedback visual para acciones del usuario
- Detalles tipográficos (ligaduras, kerning)
- Cursores personalizados donde tenga sentido
- **Anti-pattern objetivo:** UI funcional pero sin personalidad

### `/modern`
Actualiza al vocabulario visual de 2024-2025.
- Tipografía variable o con carácter
- Layouts que rompen el grid de forma controlada
- Uso de glassmorphism solo donde aporte profundidad real
- Gradientes de malla (mesh gradients) en lugar de lineales simples
- **Anti-pattern objetivo:** Diseño con estética de 2018

### `/classic`
Aplica principios de diseño atemporal.
- Tipografía serif para headings con autoridad
- Grid de columnas clásico (12 o 16 col)
- Paleta limitada con alta saturación reducida
- Sin efectos de "tendencia" — solo principios probados
- **Anti-pattern objetivo:** Diseño que envejecerá mal

---

## Comandos de estructura

### `/optimize`
Mejora la arquitectura visual del componente.
- Elimina elementos sin función clara (decoración sin propósito)
- Reorganiza la jerarquía de información (más importante = más prominente)
- Consolida repeticiones en patrones consistentes
- **Entregable:** Lista de eliminaciones + código optimizado

### `/consistent`
Audita y unifica los tokens de diseño.
- Identifica valores de espaciado irregulares
- Unifica tamaños de fuente a una escala typográfica (ej: 12/14/16/20/24/32/48)
- Consolida colores a variables/tokens
- Verifica que border-radius sea consistente en todo el componente
- **Entregable:** Token audit + código con variables CSS/Tailwind

### `/dense`
Aumenta la densidad de información manteniendo legibilidad.
- Reduce padding interno de componentes
- Usa tablas o listas en lugar de tarjetas donde el espacio sea limitado
- Aumenta el line-height mínimo aceptable (1.4 para body)
- **Caso de uso:** Dashboards, tablas, paneles de datos

### `/spacious`
Aumenta respiración visual.
- Mínimo padding de sección: 80px vertical en desktop
- Aumenta margin-bottom entre elementos de texto (1em → 1.5em)
- Introduce separadores con espacio en lugar de líneas
- **Caso de uso:** Landing pages, portfolios, páginas de marketing

---

## Comandos de revisión técnica

### `/critique`
Auditoría completa con múltiples frameworks.

**Frameworks aplicados:**
1. Heurísticas de Nielsen (10 principios de usabilidad)
2. Principios Gestalt (proximidad, similitud, cierre, continuidad)
3. WCAG 2.1 AA básico
4. Principios de Gestalt tipográfico
5. Análisis de flujo visual (Z-pattern / F-pattern)

**Requiere Playwright para:**
- Captura de pantalla en múltiples viewports
- Verificación de contraste en pantalla real
- Detección de layout shifts

### `/accessible`
Revisión centrada en WCAG 2.1 AA.
- Ratio de contraste mínimo: 4.5:1 texto normal, 3:1 texto grande
- Tamaño mínimo de targets táctiles: 44x44px
- Focus visible en todos los elementos interactivos
- Estructura heading correcta (h1 → h2 → h3)
- Alt text en imágenes
- ARIA labels en iconos sin texto

### `/responsive`
Revisión mobile-first.
- Breakpoints a revisar: 375px, 768px, 1280px, 1920px
- Verifica que el tipo no baje de 16px en mobile
- Comprueba que los targets táctiles sean adecuados
- Identifica elementos que necesitan reordenamiento en mobile
- Verifica que las imágenes tengan aspect-ratio definido

---

## Comandos de tema

### `/dark`
Conversión a dark mode.
- Background base: #0A0A0A o #111111 (no negro puro)
- Texto primario: #F5F5F5 (no blanco puro)
- Superficie de cards: +10-15% de luminosidad sobre el background
- Colores de acento: verificar contraste aumentado
- Eliminar sombras externas (no funcionan en dark) → usar bordes sutiles

### `/light`
Conversión/optimización de light mode.
- Background base: #FFFFFF o #FAFAFA
- Profundidad mediante sombras muy sutiles (0 1px 3px rgba(0,0,0,0.08))
- Evitar grises planos → usar grises con ligero matiz del color de marca
- Verificar que los colores de acento mantengan contraste sobre blanco

---

## Comandos de reducción

### `/minimal`
Lleva al mínimo absoluto funcional.
**Proceso:**
1. Listar todos los elementos del componente
2. Para cada uno preguntar: "¿La UI funciona sin esto?"
3. Si la respuesta es sí → eliminar
4. Repetir hasta que eliminar cualquier elemento rompa la funcionalidad

### `/remove-slop`
Elimina específicamente patrones de "AI slop".
**Checklist activo:**
- [ ] Eliminar gradiente purple-to-pink (#7C3AED → #EC4899)
- [ ] Reemplazar fuente Inter/Arial por par tipográfico con carácter
- [ ] Eliminar tarjetas con sombra suave en fondo blanco como patrón dominante
- [ ] Eliminar iconos de emoji como decoración principal
- [ ] Eliminar sección "Features" de 3 columnas sin jerarquía visual
- [ ] Eliminar CTAs genéricos ("Get Started", "Learn More" sin contexto)
