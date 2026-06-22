import { useState, useEffect, useRef } from 'react'

export default function NavLogo() {
  const [blink, setBlink] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [px, setPx] = useState(0)
  const [py, setPy] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)

  // Blink scheduler
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const schedule = () => {
      t = setTimeout(() => {
        setBlink(true)
        setTimeout(() => { setBlink(false); schedule() }, 130)
      }, 2200 + Math.random() * 2800)
    }
    schedule()
    return () => clearTimeout(t)
  }, [])

  // Pupil follows cursor (small range — it's tiny)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!svgRef.current) return
      const r = svgRef.current.getBoundingClientRect()
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2
      const dx = e.clientX - cx, dy = e.clientY - cy
      const d = Math.sqrt(dx * dx + dy * dy) || 1
      const cap = 1.8
      const s = Math.min(cap, d) / d
      setPx((dx * s / r.width) * 14)
      setPy((dy * s / r.height) * 14)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const eyeRy = blink ? 0.35 : 3.2

  return (
    <a
      href="#about"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', textDecoration: 'none', color: 'var(--text)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 36 36"
        width="34"
        height="34"
        fill="none"
        style={{
          flexShrink: 0,
          transition: 'transform 0.25s',
          transform: hovered ? 'rotate(-8deg) scale(1.08)' : 'none',
        }}
      >
        {/* Head */}
        <circle cx="18" cy="20" r="14" stroke="currentColor" strokeWidth="1.6" fill="var(--surface)" />
        {/* Hair */}
        <path d="M5 16 Q5 6 18 6 Q31 6 31 16"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="var(--surface-2)" />
        {/* Ears */}
        <path d="M4 17 Q2 20 4 22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M32 17 Q34 20 32 22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        {/* Eye whites */}
        <ellipse cx="12.5" cy="20" rx="3" ry={eyeRy} fill="var(--text)" fillOpacity="0.08" stroke="currentColor" strokeWidth="1" />
        <ellipse cx="23.5" cy="20" rx="3" ry={eyeRy} fill="var(--text)" fillOpacity="0.08" stroke="currentColor" strokeWidth="1" />
        {/* Pupils */}
        {!blink && (
          <>
            <circle cx={12.5 + px * 0.3} cy={20 + py * 0.3} r="1.5" fill="currentColor" />
            <circle cx={23.5 + px * 0.3} cy={20 + py * 0.3} r="1.5" fill="currentColor" />
          </>
        )}
        {/* Eye shine */}
        {!blink && (
          <>
            <circle cx={13.2 + px * 0.3} cy={19 + py * 0.3} r="0.55" fill="currentColor" fillOpacity="0.45" />
            <circle cx={24.2 + px * 0.3} cy={19 + py * 0.3} r="0.55" fill="currentColor" fillOpacity="0.45" />
          </>
        )}
        {/* Smile — wider on hover */}
        <path
          d={hovered ? 'M11 27 Q18 32 25 27' : 'M12 27 Q18 30 24 27'}
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          style={{ transition: 'd 0.25s' }}
        />
        {/* Blush — shows on hover */}
        {hovered && (
          <>
            <ellipse cx="9" cy="24" rx="3" ry="1.8" fill="currentColor" fillOpacity="0.07" />
            <ellipse cx="27" cy="24" rx="3" ry="1.8" fill="currentColor" fillOpacity="0.07" />
          </>
        )}
      </svg>
      <span style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
        Aryan
      </span>
    </a>
  )
}
