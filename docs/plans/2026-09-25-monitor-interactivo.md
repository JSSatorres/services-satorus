# Monitor interactivo y materiales — 25/09/2026

Goal: suavizar materiales arquitectónicos y entrar desde un monitor a la sección de aplicaciones existente.
Architecture: geometría con pantallas identificables; cámara con modo de visita; diálogo accesible de contenido separado del motor 3D.
Tech stack: Next.js, React, Three.js y GSAP existentes.
Perfil de verificación: standard, con comprobación visual y E2E de navegación, foco, salida y movimiento reducido.

1. Capturar estado inicial y comprobar ausencia de entrada al monitor (confirmado: 0 botones).
2. Reducir relieve, contraste de trama y oclusión; mejorar filtrado y antialias.
3. Añadir selección del monitor, acercamiento y regreso; cancelar transiciones y liberar recursos.
4. Recuperar texto de aplicaciones, añadir ejemplos interactivos y enlace al caso real GoblinTrader.
5. Verificar escritorio, móvil, Escape, interrupción, contacto, fallback, build y lint.

Incidencias: ninguna al iniciar. El repositorio original pertenece a otro trabajo; todos los cambios se realizan en este worktree.

Resultado y verificación:
- Implementados materiales suavizados, selección por raycasting/marcador, cámara de entrada/salida y sección de aplicaciones con ejemplos y proyecto real.
- Build de producción: 18 rutas. Lint sin incidencias. Navegación unitaria: 3/3.
- E2E: entrar, cambiar ejemplos, Escape, cancelar a mitad del zoom, foco y contacto; ocho capítulos, FAQ, borrador de formulario, envío interceptado, navegación a proyectos y atrás.
- Escritorio 1440×900, móvil 390×844, movimiento reducido, cambio de tamaño con pantalla abierta y alternativa sin WebGL comprobados. Sin desbordamiento horizontal.
- Evidencia visual local: materials-final.png, monitor-zoom-final.png, monitor-desktop-final.png y monitor-mobile-final.png, en la carpeta de visualizaciones de esta tarea.
- Incidencia resuelta: ResizeObserver podía cancelar el callback de regreso si se salía durante la expansión del escenario. El redimensionado conserva ahora las transiciones activas del monitor.
- Los ejemplos son ilustrativos; no añaden métricas de clientes ni envían información externa.
