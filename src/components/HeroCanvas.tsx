import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

// Hero-section-only particle network — slightly dimmed, mouse/touch-reactive
const N = 55
const MAX_LINK = 130
const REPEL_R = 90
const REPEL_F = 0.5

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isDark } = useTheme()

  useEffect(() => {
    const el = mountRef.current
    const canvas = canvasRef.current
    if (!el || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = el.clientWidth || window.innerWidth
    let H = el.clientHeight || window.innerHeight
    const dpr = Math.min(window.devicePixelRatio, 2)

    const setSize = (w: number, h: number) => {
      W = w; H = h
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    setSize(W, H)

    // Positions/velocities stored with origin at top-left (canvas space),
    // matching the previous centered-origin physics via an offset at draw time.
    const pos: { x: number; y: number }[] = []
    const vel: { x: number; y: number }[] = []
    for (let i = 0; i < N; i++) {
      pos.push({ x: (Math.random() - 0.5) * W, y: (Math.random() - 0.5) * H })
      vel.push({ x: (Math.random() - 0.5) * 0.35, y: (Math.random() - 0.5) * 0.35 })
    }

    const dotColor = isDark ? 'rgba(84, 84, 84,' : 'rgba(144, 144, 144,'
    const dotOpacity = isDark ? 0.62 : 0.42
    const dotSize = isDark ? 2.5 : 2.2
    const lineColor = isDark ? 'rgba(46, 46, 46,' : 'rgba(187, 187, 187,'
    const lineOpacity = isDark ? 0.28 : 0.2

    let mx = 0, my = 0
    const updatePointer = (clientX: number, clientY: number) => {
      const r = el.getBoundingClientRect()
      mx = clientX - r.left - W / 2
      my = clientY - r.top - H / 2
    }
    const onMouse = (e: MouseEvent) => updatePointer(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) updatePointer(t.clientX, t.clientY)
    }
    window.addEventListener('mousemove', onMouse, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('touchstart', onTouch, { passive: true })

    let raf: number
    const tick = () => {
      raf = requestAnimationFrame(tick)

      for (let i = 0; i < N; i++) {
        const p = pos[i], v = vel[i]
        const dx = p.x - mx, dy = p.y - my
        const d = Math.sqrt(dx * dx + dy * dy) || 1
        if (d < REPEL_R) { const f = ((REPEL_R - d) / REPEL_R) * REPEL_F; v.x += (dx / d) * f; v.y += (dy / d) * f }
        v.x *= 0.97; v.y *= 0.97
        p.x += v.x; p.y += v.y
        if (p.x < -W / 2) { p.x = -W / 2; v.x *= -1 }
        if (p.x > W / 2)  { p.x = W / 2;  v.x *= -1 }
        if (p.y < -H / 2) { p.y = -H / 2; v.y *= -1 }
        if (p.y > H / 2)  { p.y = H / 2;  v.y *= -1 }
      }

      ctx.clearRect(0, 0, W, H)
      ctx.save()
      ctx.translate(W / 2, H / 2)

      ctx.strokeStyle = `${lineColor}${lineOpacity})`
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y
          if (Math.sqrt(dx * dx + dy * dy) < MAX_LINK) {
            ctx.moveTo(pos[i].x, pos[i].y)
            ctx.lineTo(pos[j].x, pos[j].y)
          }
        }
      }
      ctx.stroke()

      ctx.fillStyle = `${dotColor}${dotOpacity})`
      for (let i = 0; i < N; i++) {
        ctx.beginPath()
        ctx.arc(pos[i].x, pos[i].y, dotSize, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }
    tick()

    const onResize = () => setSize(el.clientWidth, el.clientHeight)
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('resize', onResize)
    }
  }, [isDark])

  return (
    <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}
