"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* ── Config ──
   SCROLL_LENGTH: cuántas alturas de pantalla dura el pin.
   0.8 = sale rápido, sin atascos. Sube a 1.5 si añades vídeo real.
*/
const SCROLL_LENGTH = 0.8
const VIDEO_SRC = "/scroll/satorus.mp4"

export function ScrollVideo() {
  const sectionRef  = useRef<HTMLElement>(null)
  const stickyRef   = useRef<HTMLDivElement>(null)
  const videoRef    = useRef<HTMLVideoElement>(null)
  const overlayRef  = useRef<HTMLDivElement>(null)
  const bg1Ref      = useRef<HTMLDivElement>(null)
  const bg2Ref      = useRef<HTMLDivElement>(null)
  const eyebrowRef  = useRef<HTMLDivElement>(null)
  const headRef     = useRef<HTMLHeadingElement>(null)
  const subRef      = useRef<HTMLParagraphElement>(null)
  const word1Ref    = useRef<HTMLSpanElement>(null)
  const word2Ref    = useRef<HTMLSpanElement>(null)
  const orb1Ref     = useRef<HTMLDivElement>(null)
  const orb2Ref     = useRef<HTMLDivElement>(null)
  const gridRef     = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const scrub   = reduced ? false : 0.6
    const vp      = window.innerHeight
    const end     = () => `+=${vp * SCROLL_LENGTH}`

    /* ── 1. Pin ── */
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end,
      pin: stickyRef.current,
      pinSpacing: true,
      scrub,
    })

    /* ── 2. Background orbs — se mueven y escalan con el scroll ── */
    gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top top", end, scrub },
    })
      .fromTo(orb1Ref.current,
        { scale: 0.7, x: "-10%", opacity: 0.6 },
        { scale: 1.4, x:  "8%",  opacity: 1,   ease: "none" }, 0)
      .fromTo(orb2Ref.current,
        { scale: 0.8, x:  "10%", opacity: 0.5 },
        { scale: 1.5, x: "-8%",  opacity: 0.9, ease: "none" }, 0)

    /* ── 3. Grid — fade in + parallax suave ── */
    gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top top", end, scrub },
    })
      .fromTo(gridRef.current,
        { opacity: 0, y: 20 },
        { opacity: 0.5, y: -20, ease: "none" }, 0)

    /* ── 4. Texto — entrada escalonada y salida limpia ── */
    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top top", end, scrub },
    })

    // Eyebrow entra a 0%
    tl.fromTo(eyebrowRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1,  y: 0,  duration: 0.12, ease: "none" }, 0)

    // "Del" + "caos" entran escalonados
    tl.fromTo(headRef.current,
      { opacity: 0, y: 28, scale: 0.97 },
      { opacity: 1,  y: 0, scale: 1, duration: 0.18, ease: "none" }, 0.05)

    // "caos" pulsa de color durante el scroll
    tl.fromTo(word1Ref.current,
      { color: "#ff6a35", textShadow: "0 0 0px #ff6a35" },
      { color: "#ff9b6b", textShadow: "0 0 40px rgba(255,106,53,0.7)", duration: 0.2, ease: "none", yoyo: true, repeat: 1 }, 0.1)

    // "sistema" entra con delay y brilla
    tl.fromTo(word2Ref.current,
      { color: "#c8ff3d", textShadow: "0 0 0px #c8ff3d" },
      { color: "#d4ff50", textShadow: "0 0 50px rgba(200,255,61,0.8)", duration: 0.2, ease: "none" }, 0.3)

    // Subtítulo
    tl.fromTo(subRef.current,
      { opacity: 0, y: 18 },
      { opacity: 1,  y: 0, duration: 0.14, ease: "none" }, 0.15)

    // Todo sale — último 20% del scroll
    tl.to(overlayRef.current,
      { opacity: 0, y: -24, scale: 0.97, duration: 0.2, ease: "none" }, 0.8)

    /* ── 5. Vídeo scrubbing (cuando exista el mp4) ── */
    const video = videoRef.current
    if (video) {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end,
        scrub: 1,
        onUpdate: (self) => {
          if (video.duration) video.currentTime = video.duration * self.progress
        },
      })
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="vision"
      style={{ position: "relative", background: "var(--bg)" }}
    >
      <div
        ref={stickyRef}
        style={{
          height: "100vh",
          width: "100%",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* ── Vídeo real (oculto hasta que exista el mp4) ── */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="none"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            opacity: 0,          // se muestra cuando el mp4 cargue
            transition: "opacity .5s",
          }}
          onLoadedMetadata={(e) => {
            (e.currentTarget as HTMLVideoElement).style.opacity = "1"
          }}
        />

        {/* ── Orb lime ── */}
        <div ref={orb1Ref} aria-hidden style={{
          position: "absolute",
          width: "55vw", height: "55vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,255,61,0.18) 0%, transparent 70%)",
          top: "10%", left: "-5%",
          pointerEvents: "none",
          willChange: "transform",
          filter: "blur(2px)",
        }} />

        {/* ── Orb coral ── */}
        <div ref={orb2Ref} aria-hidden style={{
          position: "absolute",
          width: "50vw", height: "50vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,106,53,0.15) 0%, transparent 70%)",
          bottom: "5%", right: "-5%",
          pointerEvents: "none",
          willChange: "transform",
          filter: "blur(2px)",
        }} />

        {/* ── Dot grid ── */}
        <div ref={gridRef} aria-hidden style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 20%, transparent 80%)",
          opacity: 0,
          willChange: "transform, opacity",
        }} />

        {/* ── Vignette edge ── */}
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 110% 110% at 50% 50%, transparent 35%, rgba(8,8,9,0.75) 100%)",
          pointerEvents: "none",
        }} />
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(8,8,9,0.55) 0%, transparent 18%, transparent 72%, rgba(8,8,9,0.85) 100%)",
          pointerEvents: "none",
        }} />

        {/* ── Texto ── */}
        <div
          ref={overlayRef}
          style={{
            position: "relative", zIndex: 2,
            textAlign: "center",
            padding: "0 var(--pad)",
            maxWidth: 960,
            willChange: "transform, opacity",
          }}
        >
          <div
            ref={eyebrowRef}
            className="eyebrow"
            style={{ justifyContent: "center", marginBottom: 28, opacity: 0 }}
          >
            <span className="dot" /> La visión Satorus
          </div>

          <h2
            ref={headRef}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(52px, 8vw, 108px)",
              lineHeight: 1.0,
              letterSpacing: "-0.035em",
              margin: 0,
              opacity: 0,
              willChange: "transform, opacity",
            }}
          >
            Del{" "}
            <em ref={word1Ref} style={{ fontStyle: "italic", color: "var(--accent-warm)" }}>
              caos
            </em>
            <br />
            al{" "}
            <em ref={word2Ref} style={{ fontStyle: "italic", color: "var(--accent)" }}>
              sistema
            </em>
          </h2>

          <p
            ref={subRef}
            style={{
              marginTop: 28,
              color: "var(--text-mid)",
              fontSize: "clamp(15px, 1.3vw, 18px)",
              lineHeight: 1.6,
              maxWidth: 520,
              marginInline: "auto",
              opacity: 0,
              willChange: "transform, opacity",
            }}
          >
            Cada proceso que automatizamos es una pieza menos del desorden.
          </p>
        </div>

        {/* ── Scroll indicator ── */}
        <div aria-hidden style={{
          position: "absolute", bottom: 32, left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          display: "flex", alignItems: "center", gap: 10,
          fontFamily: "var(--font-mono)",
          fontSize: 10, letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--text-faint)",
        }}>
          <span className="sv-scroll-dot" /> Desplázate
        </div>
      </div>

      <style>{`
        .sv-scroll-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent);
          animation: pulse-dot 2.4s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
