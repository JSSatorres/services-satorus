# Entrada narrativa y contenido de development — 26 septiembre 2026

Fuente: origin/development b406de2 (actualizada con git fetch). Integrar la rama manteniendo la portada y navegación 3D.

- Pantalla 1: cuatro pasos y los entregables de processDetails.
- Pantalla 2: seis problemas y su correspondencia con módulos de la aplicación; ejemplos del panel del cuaderno.
- Pantalla 3: cuatro encargos, ofertas y proyectos reales del cuaderno.
- Sobre: acompañamiento, siguiente paso, formulario y FAQ actuales.
- Entrada: mesa 3D con móvil, agenda y documentos dispersos → el visitante activa la organización → las piezas se alinean → aparece el estudio como representación del trabajo conjunto. La oficina se conserva para el recorrido de pantallas. Acceso directo permite saltar la introducción.

Dirección: materiales sobrios existentes; nogal oscuro, papel marfil #efede4, tinta #263b31, arcilla #b97653 y latón #d4ba8e. Bricolage para la narración y Atkinson para lectura. Una única transformación protagonista; nada infantil. Texto legible en HTML y documentos físicos en WebGL. Movimiento reducido muestra el resultado sin vuelo; fallback conserva narración y navegación.

Verificar: compilación/lint, recorrido completo, introducción interrumpible, anclas nuevas de development, móvil, movimiento reducido y fallback WebGL.

Verificación final:
- Compilación Next.js: 18 rutas; lint sin errores.
- Seis pruebas unitarias, incluidas anclas actuales del cuaderno.
- Recorrido completo con rueda: entrada → tres pantallas → sobre; lectura nativa; borrador conservado y envío simulado.
- Escape, marcadores físicos, enlaces de proyectos/historial y FAQ.
- Móvil 390×844: interacción con problemas y módulos, cuatro proyectos, sin desbordamiento horizontal.
- Preferencia de movimiento reducido, introducción interrumpida por un enlace y fallback sin WebGL.
- Ajuste de cámara: el contenedor conserva sus dimensiones al pasar de oficina a pantallas para evitar que ResizeObserver interrumpa el primer vuelo.
- Comprobación táctil real: gesto nativo inicia la narrativa. Las tres etiquetas de la mesa miden al menos 44 px de alto y no se solapan en 390×844.
