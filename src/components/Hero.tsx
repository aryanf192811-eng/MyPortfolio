import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { Github, Mail, Linkedin, Download } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { RESUME_URL } from '../lib/emailConfig'
import HeroCanvas from './HeroCanvas'

// ─── Greeting messages for laptop screen ─────────────────────────────
const GREETINGS = [
  { text: 'Hello, World!', color: '#86efac' },
  { text: "const me = 'Engineer'", color: '#93c5fd' },
  { text: 'git push origin main', color: '#fde68a' },
  { text: 'SELECT * FROM dreams', color: '#f9a8d4' },
  { text: 'npm run build: OK ✓', color: '#86efac' },
  { text: 'status: 200 → shipped', color: '#c4b5fd' },
]

// ─── Interactive Developer Illustration ──────────────────────────────
function DeveloperIllustration() {
  const { isDark } = useTheme()
  const svgRef = useRef<SVGSVGElement>(null)

  // Head movement – rot = left/right turn, ty = nod up/down
  const targetHead = useRef({ rot: 0, ty: 0 })
  const currentHead = useRef({ rot: 0, ty: 0 })
  const [headState, setHeadState] = useState({ rot: 0, ty: 0 })

  // Pupil tracking
  const targetPupil = useRef({ x: 0, y: 0 })
  const currentPupil = useRef({ x: 0, y: 0 })
  const [pupil, setPupil] = useState({ x: 0, y: 0 })

  // Greeting typewriter
  const [greetIdx, setGreetIdx] = useState(0)
  const [chars, setChars] = useState(0)
  const [deleting, setDeleting] = useState(false)

  const rafRef = useRef<number | undefined>(undefined)

  // Mouse → head rotation + pupil tracking
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      // Normalised viewport position: -1 to +1
      const normX = (e.clientX / window.innerWidth - 0.5) * 2
      const normY = (e.clientY / window.innerHeight - 0.5) * 2

      // Head turns on neck: chin pivot ±14° left/right, nod ±6px up/down
      targetHead.current.rot = normX * 14
      targetHead.current.ty  = normY * 6

      // Pupils: track within SVG coordinate space
      if (!svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      const svgX = ((e.clientX - rect.left) / rect.width) * 360
      const svgY = ((e.clientY - rect.top)  / rect.height) * 420
      // Left eye center: (167, 80)
      const dx = svgX - 167
      const dy = svgY - 80
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const MAX = 2.6
      const scale = Math.min(MAX, dist) / dist
      targetPupil.current = { x: dx * scale, y: dy * scale }
    }

    const tick = () => {
      const S = 0.08
      currentHead.current.rot  += (targetHead.current.rot  - currentHead.current.rot)  * S
      currentHead.current.ty   += (targetHead.current.ty   - currentHead.current.ty)   * S
      currentPupil.current.x   += (targetPupil.current.x   - currentPupil.current.x)   * S
      currentPupil.current.y   += (targetPupil.current.y   - currentPupil.current.y)   * S

      const r = (v: number) => Math.round(v * 100) / 100
      setHeadState({ rot: r(currentHead.current.rot), ty: r(currentHead.current.ty) })
      setPupil({ x: r(currentPupil.current.x), y: r(currentPupil.current.y) })
      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMouse, { passive: true })
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', handleMouse)
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Greeting typewriter loop
  useEffect(() => {
    const current = GREETINGS[greetIdx]
    let t: ReturnType<typeof setTimeout>
    if (!deleting) {
      if (chars < current.text.length) {
        t = setTimeout(() => setChars(c => c + 1), 55)
      } else {
        t = setTimeout(() => setDeleting(true), 1800)
      }
    } else {
      if (chars > 0) {
        t = setTimeout(() => setChars(c => c - 1), 28)
      } else {
        setDeleting(false)
        setGreetIdx(i => (i + 1) % GREETINGS.length)
      }
    }
    return () => clearTimeout(t)
  }, [chars, deleting, greetIdx])

  const stroke       = 'var(--text)'
  const dimBg        = isDark ? '#141414' : '#e8e8e8'
  const screenBg     = isDark ? '#101010' : '#f8f8f8'
  const bodyFill     = isDark ? '#0e0e0e' : '#eeeeee'
  const glowOp       = isDark ? '0.055' : '0.035'
  const greetText    = GREETINGS[greetIdx].text.slice(0, chars)
  const greetColor   = GREETINGS[greetIdx].color

  // Head pivot: chin bottom of head circle (180, 126) — so head rotates naturally on neck
  const headRotate = `rotate(${headState.rot}, 180, 126)`

  // Left pupil base: (168, 80), Right: (194, 80)
  const LP = { x: 168 + pupil.x, y: 80 + pupil.y }
  const RP = { x: 194 + pupil.x, y: 80 + pupil.y }

  return (
    <motion.svg
      ref={svgRef}
      viewBox="0 0 360 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: '440px', display: 'block' }}
      aria-label="Interactive developer illustration"
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Decorative rings */}
      <circle cx="180" cy="210" r="175" stroke={stroke} strokeWidth="0.4" strokeOpacity={glowOp} />
      <circle cx="180" cy="210" r="148" stroke={stroke} strokeWidth="0.4" strokeOpacity={Number(glowOp) * 0.65} />

      {/* ─ STATIC NECK — drawn first (behind head), tall enough to bridge any nod gap ─ */}
      <rect x="172" y="114" width="16" height="36" rx="4" stroke={stroke} strokeWidth="2" fill="var(--bg)" />

      {/* ─ HEAD: outer group nods (translate), inner group turns on chin pivot ─ */}
      <g transform={`translate(0, ${headState.ty})`}>
        <g transform={headRotate}>
          {/* Head circle — fill=var(--bg) hides neck top behind it */}
          <circle cx="180" cy="84" r="42" stroke={stroke} strokeWidth="2.5" fill="var(--bg)" />
          {/* Hair */}
          <path d="M140 74 Q140 44 180 42 Q220 44 220 74"
            stroke={stroke} strokeWidth="2.5" strokeLinecap="round" fill={dimBg} />

          {/* Eyebrows */}
          <path d="M161 67 Q168 63 175 67" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M185 67 Q192 63 199 67" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          {/* Eye whites */}
          <ellipse cx="167" cy="80" rx="5.5" ry="6" fill={isDark ? '#ffffff' : '#0a0a0a'} />
          <ellipse cx="193" cy="80" rx="5.5" ry="6" fill={isDark ? '#ffffff' : '#0a0a0a'} />
          {/* Pupils — tracking cursor */}
          <ellipse cx={LP.x} cy={LP.y} rx="2.8" ry="3.2" fill={dimBg} />
          <ellipse cx={RP.x} cy={RP.y} rx="2.8" ry="3.2" fill={dimBg} />
          {/* Eye shine */}
          <circle cx={LP.x + 1.2} cy={LP.y - 1.2} r="1" fill={isDark ? '#ffffff' : '#0a0a0a'} fillOpacity="0.55" />
          <circle cx={RP.x + 1.2} cy={RP.y - 1.2} r="1" fill={isDark ? '#ffffff' : '#0a0a0a'} fillOpacity="0.55" />
          {/* Smile */}
          <path d="M168 99 Q180 110 192 99" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
          {/* Cheek blush */}
          <ellipse cx="154" cy="94" rx="7" ry="4" fill={stroke} fillOpacity="0.055" />
          <ellipse cx="206" cy="94" rx="7" ry="4" fill={stroke} fillOpacity="0.055" />
        </g>
      </g>

      {/* ─ STATIC BODY GROUP ─ */}
      {/* Torso */}
      <path
        d="M132 148 L152 148 L160 228 L200 228 L208 148 L228 148
           Q244 148 246 162 L250 230 Q250 242 238 242 L122 242
           Q110 242 110 230 L114 162 Q116 148 132 148 Z"
        stroke={stroke} strokeWidth="2.5" strokeLinejoin="round"
      />
      {/* V-neck detail */}
      <path d="M172 148 L180 166 L188 148" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />

      {/* Left arm */}
      <path d="M115 177 Q90 202 78 240" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      {/* Right arm */}
      <path d="M245 177 Q270 202 282 240" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />

      {/* ─ LAPTOP ─ */}
      {/* Screen */}
      <path d="M74 240 L80 164 L280 164 L286 240"
        stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" fill={screenBg} />
      {/* Screen inner bezel */}
      <rect x="92" y="174" width="176" height="63" rx="3"
        fill={isDark ? '#0c0c0c' : '#ececec'} stroke={stroke} strokeWidth="0.5" strokeOpacity="0.2" />

      {/* Greeting text — typewriter */}
      <text x="102" y="195" fontFamily="monospace" fontSize="6.2" fill={greetColor} fillOpacity="0.92">
        {greetText}
      </text>
      {/* Blinking cursor */}
      <rect x={102 + greetText.length * 3.72} y="186" width="2" height="9" rx="1" fill={greetColor} fillOpacity="0.8">
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
      </rect>
      {/* Static code context lines above */}
      <rect x="102" y="180" width="38" height="2" rx="1" fill={stroke} fillOpacity="0.12" />
      {/* Lines below */}
      <rect x="102" y="202" width="55" height="2" rx="1" fill={stroke} fillOpacity="0.1" />
      <rect x="102" y="208" width="40" height="2" rx="1" fill={stroke} fillOpacity="0.1" />
      <rect x="102" y="214" width="65" height="2" rx="1" fill={stroke} fillOpacity="0.08" />
      <rect x="102" y="220" width="30" height="2" rx="1" fill={stroke} fillOpacity="0.1" />
      <rect x="102" y="226" width="18" height="2" rx="1" fill={stroke} fillOpacity="0.12" />

      {/* Base / keyboard */}
      <rect x="66" y="239" width="228" height="28" rx="5"
        stroke={stroke} strokeWidth="2.5" fill={bodyFill} />
      {/* Key rows */}
      <rect x="78" y="245" width="100" height="3" rx="1" stroke={stroke} strokeWidth="0.5" strokeOpacity="0.28" fill="none" />
      <rect x="78" y="252" width="90" height="3"  rx="1" stroke={stroke} strokeWidth="0.5" strokeOpacity="0.28" fill="none" />
      {/* Touchpad */}
      <rect x="150" y="257" width="58" height="6" rx="2" stroke={stroke} strokeWidth="0.6" strokeOpacity="0.22" fill="none" />

      {/* ─ Cross-legged legs ─ */}
      <path d="M122 242 Q106 270 103 298 Q122 314 154 308" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M238 242 Q254 270 257 298 Q238 314 206 308" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      {/* Feet */}
      <path d="M154 308 Q168 318 180 314 Q192 318 206 308" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M163 314 Q180 324 197 314" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.45" />

      {/* ─ Floating decoration ─ */}
      <rect x="28" y="120" width="9"  height="9" rx="2" stroke={stroke} strokeOpacity="0.14" strokeWidth="1.5" />
      <rect x="323" y="148" width="7" height="7" rx="2" stroke={stroke} strokeOpacity="0.12" strokeWidth="1.5" />
      <circle cx="38"  cy="286" r="4.5" stroke={stroke} strokeOpacity="0.11" strokeWidth="1.5" />
      <circle cx="322" cy="272" r="3.5" stroke={stroke} strokeOpacity="0.09" strokeWidth="1.5" />
      <text x="14"  y="206" fill={stroke} fillOpacity="0.08" fontSize="11" fontFamily="monospace">&lt;/&gt;</text>
      <text x="326" y="228" fill={stroke} fillOpacity="0.08" fontSize="11" fontFamily="monospace">{'{}'}</text>
    </motion.svg>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section id="about" style={{ borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
      <HeroCanvas />
      <div className="hero-grid" style={{ position: 'relative', zIndex: 1 }}>
        {/* ── Left: text ── */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Status badge */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem',
              letterSpacing: '0.08em', color: 'var(--text-faint)',
              border: '1px solid var(--border-2)', borderRadius: '50px',
              padding: '5px 14px', marginBottom: '1.5rem',
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
            Open to opportunities
          </motion.span>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
              fontWeight: 800, lineHeight: 1.08,
              letterSpacing: '-0.04em', marginBottom: '0.5rem',
              color: 'var(--text)',
            }}
          >
            Hello, I&apos;m{' '}
            <span style={{ WebkitTextStroke: '2px var(--text)', color: 'transparent' }}>
              Aryan
            </span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(1.15rem, 2.8vw, 1.75rem)',
              fontWeight: 600, color: 'var(--text-muted)',
              marginBottom: '1.2rem', minHeight: '2.4em', lineHeight: 1.3,
            }}
          >
            <TypeAnimation
              sequence={[
                'Backend Engineer.',    2000,
                'Systems Builder.',     2000,
                'API Architect.',       2000,
                'Database Designer.',   2000,
              ]}
              speed={55} deletionSpeed={72} repeat={Infinity} cursor
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.55 }}
            style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.975rem',
              color: 'var(--text-muted)', lineHeight: 1.75,
              maxWidth: '430px', marginBottom: '2rem',
            }}
          >
            B.Tech CS student at Parul University. I build backend systems where
            schemas, state machines, and audit trails are first-class citizens.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46, duration: 0.55 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center', marginBottom: '1.75rem' }}
          >
            <a
              href="#projects"
              style={{
                fontFamily: 'Sora, sans-serif', fontSize: '0.875rem', fontWeight: 600,
                color: 'var(--bg)', background: 'var(--text)', textDecoration: 'none',
                padding: '12px 28px', borderRadius: '50px',
                transition: 'opacity 0.18s, transform 0.18s', display: 'inline-flex', alignItems: 'center',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = '0.85'; el.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = '1'; el.style.transform = 'translateY(0)' }}
            >
              View My Work
            </a>

            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'Sora, sans-serif', fontSize: '0.875rem', fontWeight: 600,
                color: 'var(--text)', background: 'transparent',
                border: '1.5px solid var(--border-2)', textDecoration: 'none',
                padding: '11px 22px', borderRadius: '50px',
                transition: 'all 0.18s', display: 'inline-flex', alignItems: 'center', gap: '7px',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = 'var(--text)'; el.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = 'var(--border-2)'; el.style.transform = 'translateY(0)' }}
            >
              <Download size={14} /> Download CV
            </a>
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            style={{ display: 'flex', gap: '0.65rem' }}
          >
            {[
              { href: 'https://github.com/aryanf192811-eng', icon: <Github size={17} />, label: 'GitHub' },
              { href: 'mailto:aryanf192811@gmail.com', icon: <Mail size={17} />, label: 'Email' },
              { href: 'https://www.linkedin.com/in/ganpati-kumar-686a88358/', icon: <Linkedin size={17} />, label: 'LinkedIn' },
            ].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '42px', height: '42px', borderRadius: '50%',
                  border: '1.5px solid var(--border-2)', color: 'var(--text-muted)',
                  textDecoration: 'none', transition: 'all 0.18s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'var(--text)'; el.style.color = 'var(--text)'; el.style.background = 'var(--surface-2)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'var(--border-2)'; el.style.color = 'var(--text-muted)'; el.style.background = 'transparent'
                }}
              >
                {icon}
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right: illustration ── */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <DeveloperIllustration />
        </motion.div>
      </div>
    </section>
  )
}
