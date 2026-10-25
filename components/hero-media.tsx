"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useHydratedReducedMotion } from "@/components/use-hydrated-reduced-motion";

const heroImageAlt =
  "Mesa vista desde arriba con notas, un móvil y un cable naranja enredado.";

/* En móvil el vídeo 1080p (4,3 MB) era el LCP: allí se sirve una versión 720p de ~0,5 MB. */
const mobileQuery = "(max-width: 767px)";
const heroVideoSrc = {
  desktop: "/videos/satorus-hero-loop.mp4",
  mobile: "/videos/satorus-hero-loop-mobile.mp4",
};

export function HeroMedia() {
  const reduceMotion = useHydratedReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canRenderVideo, setCanRenderVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMobile(window.matchMedia(mobileQuery).matches);
      setCanRenderVideo(!reduceMotion);
    });

    return () => cancelAnimationFrame(frame);
  }, [reduceMotion]);

  const shouldRenderVideo = canRenderVideo && !reduceMotion;
  const videoSrc = isMobile ? heroVideoSrc.mobile : heroVideoSrc.desktop;

  useEffect(() => {
    if (!shouldRenderVideo || !videoRef.current) {
      return;
    }

    const video = videoRef.current;
    let isInViewport = false;

    const syncPlayback = () => {
      if (isInViewport && document.visibilityState === "visible") {
        void video.play().catch(() => undefined);
        return;
      }

      video.pause();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.15 },
    );

    const handleVisibilityChange = () => {
      syncPlayback();
    };

    observer.observe(video);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      video.pause();
    };
  }, [shouldRenderVideo]);

  return (
    <div className="hero-media">
      {/* La imagen se queda siempre debajo: pinta primero (LCP) y hace de póster
          hasta que el vídeo, encima y sin póster propio, muestra su primer fotograma. */}
      <Image
        src="/images/daily-tangle.png"
        alt={heroImageAlt}
        fill
        preload
        fetchPriority="high"
        sizes="100vw"
      />
      {shouldRenderVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          src={videoSrc}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
