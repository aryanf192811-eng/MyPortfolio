import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function CursorEffect() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef  = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { isDark } = useTheme()

  // Cursor ring size state (grows on interactive elements)
  const ringScale = useRef(1)

  useEffect(() => {
    let tx = 0, ty = 0
    let rx = 0, ry = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      if (!visible) setVisible(true)
      tx = e.clientX; ty = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${tx - 4}px, ${ty - 4}px)`
      }
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      raf = requestAnimationFrame(tick)
      rx = lerp(rx, tx, 0.1)
      ry = lerp(ry, ty, 0.1)
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${rx - 18}px, ${ry - 18}px) scale(${ringScale.current})`
      }
    }
    tick()

    const grow = () => { ringScale.current = 1.65 }
    const shrink = () => { ringScale.current = 1 }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseenter', shrink)

    const links = document.querySelectorAll('a, button, [role="button"]')
    links.forEach(el => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseenter', shrink)
      links.forEach(el => {
        el.removeEventListener('mouseenter', grow)
        el.removeEventListener('mouseleave', shrink)
      })
    }
  }, [isDark])

  if (!visible) return null

  // Theme-aware cursor colors — no mix-blend-mode so visible in both modes
  const ringColor = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.32)'
  const dotColor  = isDark ? 'rgba(255,255,255,0.8)'  : 'rgba(0,0,0,0.65)'

  return (
    <>
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '36px', height: '36px', borderRadius: '50%',
          border: `1.5px solid ${ringColor}`,
          pointerEvents: 'none', zIndex: 99999,
          willChange: 'transform',
          transition: 'transform 0.08s ease, border-color 0.2s',
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '8px', height: '8px', borderRadius: '50%',
          background: dotColor,
          pointerEvents: 'none', zIndex: 99999,
          willChange: 'transform',
        }}
      />
    </>
  )
}
