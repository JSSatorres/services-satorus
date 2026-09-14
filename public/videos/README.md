# Vídeo hero de Satorus

El estado actual del vídeo es pendiente. Este directorio no contiene sustitutos ni archivos de muestra.

Cuando el agente responsable entregue el recurso final, debe añadir estos dos archivos, en este orden de preferencia:

1. `satorus-hero-loop.webm`
2. `satorus-hero-loop.mp4`

La portada usa solo el póster estático cuando `NEXT_PUBLIC_HERO_VIDEO_READY` está ausente o vale `false`; en ese estado realiza cero solicitudes a `.webm` o `.mp4`. No hace falta cambiar JSX para activarlo.

La activación exacta es copiar ambos archivos a `public/videos/` y establecer exactamente `NEXT_PUBLIC_HERO_VIDEO_READY=true` en el entorno de despliegue. No se deben crear recursos de muestra ni sustitutos mientras el vídeo final siga pendiente.

El agente responsable del vídeo debe entregar las dos codificaciones finales y comprobar que no incluyan sonido, controles ni texto grabado.
