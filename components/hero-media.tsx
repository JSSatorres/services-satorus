"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useHydratedReducedMotion } from "@/components/use-hydrated-reduced-motion";

const heroImageAlt =
  "Mesa vista desde arriba con notas, un móvil y un cable naranja enredado.";

export function HeroMedia() {
  const reduceMotion = useHydratedReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canRenderVideo, setCanRenderVideo] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setCanRenderVideo(!reduceMotion);
    });

    return () => cancelAnimationFrame(frame);
  }, [reduceMotion]);

  const shouldRenderVideo = canRenderVideo && !reduceMotion;

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
      {shouldRenderVideo ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/daily-tangle.png"
          src="/videos/satorus-hero-loop.mp4"
          aria-hidden="true"
        />
      ) : (
        <Image
          src="/images/daily-tangle.png"
          alt={heroImageAlt}
          fill
          preload
          sizes="100vw"
        />
      )}
    </div>
  );
}
