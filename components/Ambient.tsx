"use client"

import { useEffect } from "react"

export function Ambient() {
  useEffect(() => {
    const c = document.getElementById("dots-canvas") as HTMLCanvasElement | null
    if (!c) return
    const ctx = c.getContext("2d")
    if (!ctx) return
    let w = 0, h = 0
    const N = 60
    type Dot = { x: number; y: number; vx: number; vy: number; r: number; a: number }
    let dots: Dot[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = c.width  = window.innerWidth  * dpr
      h = c.height = window.innerHeight * dpr
      c.style.width  = window.innerWidth  + "px"
      c.style.height = window.innerHeight + "px"
      ctx.scale(dpr, dpr)
    }
    const init = () => {
      dots = []
      for (let i = 0; i < N; i++) {
        dots.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          r:  Math.random() * 1.3 + 0.4,
          a:  Math.random() * 0.4 + 0.15,
        })
      }
    }
    let raf: number
    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy
        if (d.x < 0 || d.x > window.innerWidth)  d.vx *= -1
        if (d.y < 0 || d.y > window.innerHeight) d.vy *= -1
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 240, 220, ${d.a})`
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    resize(); init(); tick()
    window.addEventListener("resize", () => { resize(); init() })
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const cursor = document.querySelector<HTMLElement>(".cursor-glow")
    if (!cursor) return
    let tx = 0, ty = 0, cx = 0, cy = 0
    window.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY })
    let raf: number
    const loop = () => {
      cx += (tx - cx) * 0.12
      cy += (ty - cy) * 0.12
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-grid"></div>
      <div className="ambient-glow ambient-glow--tl"></div>
      <div className="ambient-glow ambient-glow--br"></div>
      <div className="ambient-noise"></div>
      <canvas id="dots-canvas"></canvas>
    </div>
  )
}
