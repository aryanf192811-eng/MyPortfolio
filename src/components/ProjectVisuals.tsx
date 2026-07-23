import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── B-Cart: ERP Schema Flow ──────────────────────────────────────────────
export function BCartVisual() {
  const [hovered, setHovered] = useState(false)
  const accent = '#3b82f6'

  const tables = [
    { id: 'SO',  x: 30,  y: 28,  w: 88, label: 'sales_orders',    cols: ['id','status','total'], color: '#3b82f6' },
    { id: 'INV', x: 160, y: 28,  w: 88, label: 'inventory',        cols: ['item_id','qty','loc'], color: '#8b5cf6' },
    { id: 'MO',  x: 30,  y: 150, w: 88, label: 'mfg_orders',       cols: ['id','so_id','state'],  color: '#22c55e' },
    { id: 'WO',  x: 160, y: 150, w: 88, label: 'work_orders',      cols: ['id','mo_id','worker'], color: '#f59e0b' },
    { id: 'SL',  x: 95,  y: 272, w: 88, label: 'stock_ledger',     cols: ['id','item','delta'],   color: '#ef4444' },
  ]

  const links = [
    { x1: 118, y1: 50,  x2: 160, y2: 50  },
    { x1: 74,  y1: 80,  x2: 74,  y2: 150 },
    { x1: 118, y1: 172, x2: 160, y2: 172 },
    { x1: 74,  y1: 202, x2: 139, y2: 272 },
    { x1: 204, y1: 202, x2: 183, y2: 272 },
  ]

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 278 360" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        {/* Background grid */}
        <defs>
          <pattern id="bcgrid" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M22 0H0V22" fill="none" stroke={`${accent}12`} strokeWidth="0.5" />
          </pattern>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill={`${accent}88`} />
          </marker>
        </defs>
        <rect width="278" height="360" fill="url(#bcgrid)" />

        {/* Relationship lines */}
        {links.map((l, i) => (
          <motion.line
            key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={`${accent}55`} strokeWidth="1.5" strokeDasharray="4 3"
            markerEnd="url(#arrow)"
            animate={hovered ? { strokeOpacity: [0.35, 1, 0.35], strokeDashoffset: [0, -14] } : { strokeOpacity: 0.35 }}
            transition={{ duration: 1.4, repeat: hovered ? Infinity : 0, delay: i * 0.15 }}
          />
        ))}

        {/* Floating packet dots on hover */}
        {hovered && links.map((l, i) => (
          <motion.circle
            key={`dot${i}`}
            r="3" fill={accent} opacity="0.8"
            animate={{ x: [l.x1, l.x2], y: [l.y1, l.y2], opacity: [0, 1, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.22, ease: 'easeInOut' }}
          />
        ))}

        {/* Tables */}
        {tables.map(t => (
          <motion.g key={t.id}
            animate={hovered ? { filter: [`drop-shadow(0 0 0px ${t.color}00)`, `drop-shadow(0 0 8px ${t.color}66)`, `drop-shadow(0 0 0px ${t.color}00)`] } : {}}
            transition={{ duration: 1.8, repeat: Infinity, delay: Math.random() * 0.5 }}
          >
            {/* Table header */}
            <rect x={t.x} y={t.y} width={t.w} height="20" rx="3" fill={`${t.color}22`} stroke={`${t.color}55`} strokeWidth="1" />
            <text x={t.x + 6} y={t.y + 13} fontFamily="monospace" fontSize="6.5" fill={t.color} opacity="0.9">{t.label}</text>
            {/* Table body */}
            <rect x={t.x} y={t.y + 20} width={t.w} height={t.cols.length * 16} rx="0" fill="var(--surface)" stroke={`${t.color}33`} strokeWidth="1" />
            <rect x={t.x} y={t.y + 20 + t.cols.length * 16 - 1} width={t.w} height="1" rx="0" fill="none" stroke={`${t.color}33`} />
            {t.cols.map((col, ci) => (
              <g key={col}>
                <line x1={t.x} y1={t.y + 20 + ci * 16} x2={t.x + t.w} y2={t.y + 20 + ci * 16} stroke={`${t.color}18`} strokeWidth="0.5" />
                <text x={t.x + 6} y={t.y + 30 + ci * 16} fontFamily="monospace" fontSize="5.8" fill="var(--text)" opacity="0.55">{col}</text>
              </g>
            ))}
          </motion.g>
        ))}

        {/* Hover label */}
        <AnimatePresence>
          {hovered && (
            <motion.text
              x="139" y="348" textAnchor="middle"
              fontFamily="monospace" fontSize="7" fill={accent} opacity="0.7"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }}
            >
              22-table PostgreSQL schema
            </motion.text>
          )}
        </AnimatePresence>
      </svg>
    </div>
  )
}

// ─── ExamForge: Dual-DB Sync Visualization ────────────────────────────────
export function ExamForgeVisual() {
  const [hovered, setHovered] = useState(false)
  const [tick, setTick] = useState(0)
  const accent = '#22c55e'

  useEffect(() => {
    if (!hovered) return
    const t = setInterval(() => setTick(n => n + 1), 600)
    return () => clearInterval(t)
  }, [hovered])

  const DOTS = 5

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 278 360" style={{ width: '100%', height: '100%' }}>
        <defs>
          <pattern id="efgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke={`${accent}10`} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="278" height="360" fill="url(#efgrid)" />

        {/* LEFT: SQLite — offline / local */}
        <motion.g animate={hovered ? { opacity: [0.8, 1, 0.8] } : {}} transition={{ duration: 2, repeat: Infinity }}>
          {/* DB cylinder */}
          <ellipse cx="70" cy="108" rx="42" ry="12" fill={`${accent}18`} stroke={`${accent}55`} strokeWidth="1.5" />
          <rect x="28" y="108" width="84" height="55" fill={`${accent}08`} stroke={`${accent}44`} strokeWidth="1.5" />
          <ellipse cx="70" cy="163" rx="42" ry="12" fill={`${accent}18`} stroke={`${accent}55`} strokeWidth="1.5" />
          {/* Stripes */}
          {[0, 1, 2].map(i => (
            <line key={i} x1="28" y1={122 + i * 14} x2="112" y2={122 + i * 14} stroke={`${accent}20`} strokeWidth="1" />
          ))}
          <text x="70" y="140" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={accent} opacity="0.9">SQLite</text>
          <text x="70" y="152" textAnchor="middle" fontFamily="monospace" fontSize="6" fill={accent} opacity="0.6">local · offline</text>
          {/* Icon */}
          <rect x="52" y="60" width="36" height="28" rx="5" fill={`${accent}15`} stroke={`${accent}44`} strokeWidth="1.3" />
          <text x="70" y="79" textAnchor="middle" fontSize="13" fill={accent}>💾</text>
          <text x="70" y="57" textAnchor="middle" fontFamily="monospace" fontSize="6" fill={accent} opacity="0.6">OFFLINE</text>
        </motion.g>

        {/* RIGHT: Supabase — cloud / real-time */}
        <motion.g animate={hovered ? { opacity: [0.8, 1, 0.8] } : {}} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}>
          <ellipse cx="208" cy="108" rx="42" ry="12" fill="#3ecf8e22" stroke="#3ecf8e55" strokeWidth="1.5" />
          <rect x="166" y="108" width="84" height="55" fill="#3ecf8e08" stroke="#3ecf8e44" strokeWidth="1.5" />
          <ellipse cx="208" cy="163" rx="42" ry="12" fill="#3ecf8e22" stroke="#3ecf8e55" strokeWidth="1.5" />
          {[0, 1, 2].map(i => (
            <line key={i} x1="166" y1={122 + i * 14} x2="250" y2={122 + i * 14} stroke="#3ecf8e20" strokeWidth="1" />
          ))}
          <text x="208" y="140" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#3ecf8e" opacity="0.9">Supabase</text>
          <text x="208" y="152" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#3ecf8e" opacity="0.6">cloud · real-time</text>
          <rect x="190" y="60" width="36" height="28" rx="5" fill="#3ecf8e15" stroke="#3ecf8e44" strokeWidth="1.3" />
          <text x="208" y="79" textAnchor="middle" fontSize="13" fill="#3ecf8e">☁️</text>
          <text x="208" y="57" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#3ecf8e" opacity="0.6">REALTIME</text>
        </motion.g>

        {/* CENTER: Sync arrows */}
        {/* Right arrow: SQLite → Supabase */}
        <path d="M112 130 Q139 120 166 130" fill="none" stroke={`${accent}55`} strokeWidth="1.5" strokeDasharray="4 3"
          markerEnd="url(#arrowG)" />
        {/* Left arrow: Supabase → SQLite */}
        <path d="M166 148 Q139 158 112 148" fill="none" stroke="#3ecf8e55" strokeWidth="1.5" strokeDasharray="4 3"
          markerEnd="url(#arrowTeal)" />
        <defs>
          <marker id="arrowG" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0 0 L5 2.5 L0 5 Z" fill={`${accent}99`} />
          </marker>
          <marker id="arrowTeal" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0 0 L5 2.5 L0 5 Z" fill="#3ecf8e99" />
          </marker>
        </defs>

        {/* Sync data packets */}
        {hovered && Array.from({ length: DOTS }, (_, i) => {
          const progress = ((tick * 0.22 + i / DOTS) % 1)
          const x = 112 + (166 - 112) * progress
          const baseY = 130, controlY = 120
          const t2 = progress
          const py = (1 - t2) * (1 - t2) * baseY + 2 * (1 - t2) * t2 * controlY + t2 * t2 * baseY
          return <circle key={`r${i}`} cx={x} cy={py} r="3" fill={accent} opacity={0.85} />
        })}
        {hovered && Array.from({ length: DOTS }, (_, i) => {
          const progress = ((tick * 0.18 + i / DOTS + 0.5) % 1)
          const x = 166 - (166 - 112) * progress
          const baseY = 148, controlY = 158
          const t2 = progress
          const py = (1 - t2) * (1 - t2) * baseY + 2 * (1 - t2) * t2 * controlY + t2 * t2 * baseY
          return <circle key={`l${i}`} cx={x} cy={py} r="3" fill="#3ecf8e" opacity={0.85} />
        })}

        {/* FastAPI backend box at bottom */}
        <rect x="89" y="215" width="100" height="52" rx="6" fill={`${accent}0e`} stroke={`${accent}33`} strokeWidth="1.3" />
        <text x="139" y="233" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={accent} opacity="0.8">FastAPI Backend</text>
        <text x="139" y="246" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="var(--text)" opacity="0.4">Pydantic · JWT Auth</text>
        <text x="139" y="258" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="var(--text)" opacity="0.4">GitHub Actions CI/CD</text>

        {/* KaTeX formula */}
        <text x="139" y="310" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={accent} opacity="0.5">∫ KaTeX + TypeScript</text>
        <AnimatePresence>
          {hovered && (
            <motion.text x="139" y="330" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill={accent} opacity="0.7"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }}>
              sub-ms offline · live sync
            </motion.text>
          )}
        </AnimatePresence>
      </svg>
    </div>
  )
}

// ─── Traveloop: Animated Travel Route Map ────────────────────────────────
export function TraveloopVisual() {
  const [hovered, setHovered] = useState(false)
  const [pathLen, setPathLen] = useState(0)
  const pathRef = useRef<SVGPathElement>(null)
  const accent = '#f59e0b'

  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength())
  }, [])

  const cities = [
    { x: 58,  y: 90,  name: 'Delhi NCR', emoji: '🏙️', ex: 58,  ey: 75,  tx: 42,  ty: 104, anchor: 'end'   },
    { x: 170, y: 130, name: 'Jaipur',    emoji: '🏯',  ex: 170, ey: 115, tx: 186, ty: 138, anchor: 'start' },
    { x: 220, y: 230, name: 'Mumbai',    emoji: '🌊',  ex: 220, ey: 215, tx: 238, ty: 238, anchor: 'start' },
    { x: 80,  y: 270, name: 'Goa',       emoji: '🌴',  ex: 80,  ey: 255, tx: 62,  ty: 278, anchor: 'end'   },
  ] as const

  const routePath = `M 58 90 C 100 80, 140 100, 170 130 C 195 150, 220 190, 220 230 C 215 250, 150 265, 80 270`

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 278 360" style={{ width: '100%', height: '100%' }}>
        <defs>
          <pattern id="tlgrid" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M22 0H0V22" fill="none" stroke={`${accent}10`} strokeWidth="0.5" />
          </pattern>
          <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.25" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="278" height="360" fill="url(#tlgrid)" />

        {/* India-ish outline (abstract) */}
        <path d="M40 40 Q139 30 238 60 Q250 100 240 180 Q230 260 160 310 Q120 330 80 310 Q40 280 35 220 Q30 140 40 40 Z"
          fill={`${accent}06`} stroke={`${accent}18`} strokeWidth="1" />

        {/* Route path — draws on hover */}
        <path
          ref={pathRef}
          d={routePath}
          fill="none"
          stroke={`${accent}33`}
          strokeWidth="2"
          strokeDasharray="6 4"
        />
        <motion.path
          d={routePath}
          fill="none"
          stroke={accent}
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={
            pathLen > 0
              ? { strokeDasharray: pathLen, strokeDashoffset: hovered ? 0 : pathLen }
              : {}
          }
          initial={{ strokeDashoffset: pathLen }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />

        {/* City markers */}
        {cities.map((c, i) => (
          <motion.g key={c.name}
            animate={hovered ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
            style={{ transformOrigin: `${c.x}px ${c.y}px` }}
          >
            <circle cx={c.x} cy={c.y} r="18" fill="url(#cityGlow)" />
            <circle cx={c.x} cy={c.y} r="7" fill={`${accent}20`} stroke={accent} strokeWidth="1.5" />
            <circle cx={c.x} cy={c.y} r="3" fill={accent} />
            {/* Emoji above dot */}
            <text x={c.ex} y={c.ey} textAnchor="middle" fontSize="11">{c.emoji}</text>
            {/* City name — always visible, positioned away from dot */}
            <text
              x={c.tx}
              y={c.ty}
              textAnchor={c.anchor}
              fontFamily="monospace"
              fontSize="8"
              fill={accent}
              fillOpacity="0.9"
            >
              {c.name}
            </text>
          </motion.g>
        ))}

        {/* AI Gemini spark badge */}
        <motion.g
          animate={hovered ? { rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '195px 75px' }}
        >
          <rect x="168" y="58" width="56" height="34" rx="8" fill={`${accent}15`} stroke={`${accent}44`} strokeWidth="1.3" />
          <text x="196" y="72" textAnchor="middle" fontSize="10">✨</text>
          <text x="196" y="84" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill={accent} opacity="0.9">Gemini AI</text>
        </motion.g>

        {/* Stats */}
        <rect x="30" y="298" width="218" height="42" rx="6" fill={`${accent}0a`} stroke={`${accent}25`} strokeWidth="1" />
        <text x="139" y="315" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill={accent} opacity="0.8">30+ endpoints · 9 route modules</text>
        <text x="139" y="328" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="var(--text)" opacity="0.4">PDFKit streaming · offline fallback</text>
        <text x="139" y="336" textAnchor="middle" fontFamily="monospace" fontSize="6" fill={accent} opacity="0.6">🥇 Hackathon Finalist 2026</text>
      </svg>
    </div>
  )
}

// ─── NEET Notes: PWA Offline Chemistry Notes ─────────────────────────────
export function NeetNotesVisual() {
  const [hovered, setHovered] = useState(false)
  const accent = '#a78bfa'

  const chapters = [
    { label: 'Atomic Structure',  icon: '⚛', y: 80  },
    { label: 'Chemical Bonding',  icon: '🔗', y: 122 },
    { label: 'Thermodynamics',    icon: '🌡', y: 164 },
    { label: 'Electrochemistry',  icon: '⚡', y: 206 },
    { label: 'Organic Chemistry', icon: '🧪', y: 248 },
  ]
  const completions = [68, 82, 54, 71, 90]

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 278 360" style={{ width: '100%', height: '100%' }}>
        <defs>
          <pattern id="nnGrid" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M18 0H0V18" fill="none" stroke={`${accent}10`} strokeWidth="0.5" />
          </pattern>
          <radialGradient id="nnGlow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.12" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="278" height="360" fill="url(#nnGrid)" />
        <rect width="278" height="360" fill="url(#nnGlow)" />

        {/* PWA badge */}
        <rect x="84" y="18" width="110" height="26" rx="13" fill={`${accent}20`} stroke={`${accent}55`} strokeWidth="1.2" />
        <text x="139" y="35" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={accent} opacity="0.9">📱 PWA · Offline First</text>

        {/* Chapter rows with animated progress */}
        {chapters.map((ch, i) => (
          <motion.g key={ch.label}
            animate={hovered ? { x: [0, 3, 0] } : { x: 0 }}
            transition={{ duration: 0.9, delay: i * 0.1, repeat: hovered ? Infinity : 0, repeatDelay: 0.5 }}
          >
            <rect x="30" y={ch.y} width="218" height="28" rx="6"
              fill={`${accent}0d`} stroke={`${accent}28`} strokeWidth="1" />
            <text x="50" y={ch.y + 17} fontFamily="monospace" fontSize="10">{ch.icon}</text>
            <text x="68" y={ch.y + 17} fontFamily="monospace" fontSize="7.5" fill="var(--text)" opacity="0.6">{ch.label}</text>
            <rect x="184" y={ch.y + 9} width="48" height="7" rx="3.5" fill={`${accent}18`} />
            <motion.rect x="184" y={ch.y + 9} height="7" rx="3.5" fill={accent} opacity="0.75"
              animate={{ width: hovered ? (completions[i] / 100) * 48 : 4 }}
              transition={{ duration: 0.7, delay: i * 0.12 }} />
          </motion.g>
        ))}

        {/* Footer info */}
        <rect x="30" y="293" width="218" height="40" rx="6" fill={`${accent}0a`} stroke={`${accent}22`} strokeWidth="1" />
        <text x="139" y="309" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={accent} opacity="0.8">NEET Physical Chemistry</text>
        <text x="139" y="322" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="var(--text)" opacity="0.4">Class 11 &amp; 12 · service-worker cache</text>
        <text x="139" y="334" textAnchor="middle" fontFamily="monospace" fontSize="6" fill={accent} opacity="0.5">manifest.json · HTML · CSS · JS</text>
      </svg>
    </div>
  )
}

// ─── Soundrich: Premium Hearing Clinic Frontend ───────────────────────────
export function SoundrichVisual() {
  const [hovered, setHovered] = useState(false)
  const accent = '#06b6d4'

  const bars = [0.45, 0.72, 0.55, 0.88, 0.62, 0.78, 0.50, 0.70, 0.58, 0.82]

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 278 360" style={{ width: '100%', height: '100%' }}>
        <defs>
          <pattern id="srGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke={`${accent}10`} strokeWidth="0.5" />
          </pattern>
          <linearGradient id="srWave" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.8" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <rect width="278" height="360" fill="url(#srGrid)" />

        {/* Brand header */}
        <text x="139" y="38" textAnchor="middle" fontFamily="monospace" fontSize="9.5" fill={accent} opacity="0.9">🎧 Soundrich Hearing</text>
        <text x="139" y="52" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="var(--text)" opacity="0.4">Client Demo · Premium Frontend</text>

        {/* Soundwave visualizer bars */}
        {bars.map((h, i) => {
          const bh = h * 72
          const bx = 24 + i * 23
          return (
            <motion.rect key={i}
              x={bx} y={105 - bh / 2}
              width="15" height={bh} rx="7.5"
              fill="url(#srWave)" stroke={`${accent}44`} strokeWidth="0.5"
              animate={hovered ? { scaleY: [1, 1 + h * 0.45, 1], opacity: [0.55, 1, 0.55] } : { scaleY: 1, opacity: 0.45 }}
              transition={{ duration: 0.65 + i * 0.06, repeat: hovered ? Infinity : 0, delay: i * 0.07 }}
              style={{ transformOrigin: `${bx + 7.5}px 105px` }}
            />
          )
        })}

        {/* Clinic location cards */}
        {[
          { city: 'Mumbai', rating: '4.9★', x: 28  },
          { city: 'Pune',   rating: '4.8★', x: 148 },
        ].map((clinic) => (
          <motion.g key={clinic.city}
            animate={hovered ? { y: [0, -3, 0] } : { y: 0 }}
            transition={{ duration: 1.6, repeat: hovered ? Infinity : 0 }}
          >
            <rect x={clinic.x} y="190" width="102" height="52" rx="8"
              fill={`${accent}12`} stroke={`${accent}44`} strokeWidth="1.2" />
            <text x={clinic.x + 51} y="208" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={accent} opacity="0.9">🏥 {clinic.city}</text>
            <text x={clinic.x + 51} y="221" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="var(--text)" opacity="0.45">Hearing Clinic</text>
            <text x={clinic.x + 51} y="234" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={accent} opacity="0.85">{clinic.rating}</text>
          </motion.g>
        ))}

        {/* WhatsApp CTA */}
        <rect x="60" y="260" width="158" height="26" rx="13" fill="#25d36620" stroke="#25d36655" strokeWidth="1.2" />
        <text x="139" y="277" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill="#25d366" opacity="0.9">💬 WhatsApp · Book Now</text>

        {/* Tech footer */}
        <rect x="28" y="300" width="222" height="38" rx="6" fill={`${accent}08`} stroke={`${accent}20`} strokeWidth="1" />
        <text x="139" y="316" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={accent} opacity="0.8">Liquid Morphism · Skeleton Loaders</text>
        <text x="139" y="329" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="var(--text)" opacity="0.35">HTML · CSS · JS · soundrichearing.com</text>
      </svg>
    </div>
  )
}

// ─── HRMS: HR Management Dashboard ────────────────────────────────────────
export function HRMSVisual() {
  const [hovered, setHovered] = useState(false)
  const accent = '#f472b6'

  const stats = [
    { label: 'Employees', val: '248', icon: '👤' },
    { label: 'On Leave',  val: '12',  icon: '🏖' },
    { label: 'Depts',     val: '8',   icon: '🏢' },
  ]
  const barHeights = [65, 82, 48, 91, 73, 56]
  const months     = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 278 360" style={{ width: '100%', height: '100%' }}>
        <defs>
          <pattern id="hrGrid" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M18 0H0V18" fill="none" stroke={`${accent}10`} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="278" height="360" fill="url(#hrGrid)" />

        {/* Title bar */}
        <rect x="20" y="15" width="238" height="28" rx="6" fill={`${accent}15`} stroke={`${accent}44`} strokeWidth="1" />
        <text x="139" y="33" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill={accent} opacity="0.9">HR Management System</text>

        {/* Stat cards */}
        {stats.map((s, i) => (
          <motion.g key={s.label}
            animate={hovered ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 1.2, delay: i * 0.2, repeat: hovered ? Infinity : 0 }}
            style={{ transformOrigin: `${56 + i * 80}px 78px` }}
          >
            <rect x={16 + i * 80} y="55" width="72" height="56" rx="8"
              fill={`${accent}10`} stroke={`${accent}33`} strokeWidth="1.1" />
            <text x={52 + i * 80} y="76" textAnchor="middle" fontSize="13">{s.icon}</text>
            <text x={52 + i * 80} y="92" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={accent} opacity="0.9">{s.val}</text>
            <text x={52 + i * 80} y="104" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="var(--text)" opacity="0.4">{s.label}</text>
          </motion.g>
        ))}

        {/* Chart label */}
        <text x="20" y="138" fontFamily="monospace" fontSize="7" fill={accent} opacity="0.65">Attendance Trend</text>

        {/* Bar chart */}
        {barHeights.map((h, i) => (
          <g key={i}>
            <rect x={20 + i * 40} y={230 - h} width="26" height={h} rx="4"
              fill={`${accent}14`} stroke={`${accent}28`} strokeWidth="0.8" />
            <motion.rect x={20 + i * 40} width="26" rx="4"
              fill={accent} opacity={0.2}
              animate={{ height: hovered ? h : h * 0.5, y: hovered ? 230 - h : 230 - h * 0.5, opacity: hovered ? 0.6 : 0.2 }}
              transition={{ duration: 0.65, delay: i * 0.08 }} />
            <text x={33 + i * 40} y="244" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="var(--text)" opacity="0.35">{months[i]}</text>
          </g>
        ))}

        {/* Figma credit footer */}
        <rect x="20" y="262" width="238" height="46" rx="6" fill={`${accent}08`} stroke={`${accent}22`} strokeWidth="1" />
        <text x="139" y="279" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={accent} opacity="0.85">🎨 Figma Design → Code</text>
        <text x="139" y="292" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="var(--text)" opacity="0.4">TypeScript · Vite · Tailwind CSS</text>
        <text x="139" y="304" textAnchor="middle" fontFamily="monospace" fontSize="6" fill={accent} opacity="0.5">Deployed · Vercel</text>
      </svg>
    </div>
  )
}

// ─── GateTrack: GATE CSE 2028 Study Tracker ──────────────────────────────
export function GateTrackVisual() {
  const [hovered, setHovered] = useState(false)
  const [tick, setTick] = useState(0)
  const accent = '#34d399'

  useEffect(() => {
    if (!hovered) return
    const t = setInterval(() => setTick(n => n + 1), 700)
    return () => clearInterval(t)
  }, [hovered])

  // Suppress unused variable warning from tick while keeping the effect
  void tick

  const subjects = [
    { label: 'Data Structures',   pct: 78, color: '#34d399' },
    { label: 'Algorithms',        pct: 65, color: '#60a5fa' },
    { label: 'OS Concepts',       pct: 52, color: '#f59e0b' },
    { label: 'Computer Networks', pct: 41, color: '#a78bfa' },
    { label: 'DBMS',              pct: 87, color: '#f472b6' },
  ]

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 278 360" style={{ width: '100%', height: '100%' }}>
        <defs>
          <pattern id="gtGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke={`${accent}10`} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="278" height="360" fill="url(#gtGrid)" />

        {/* Header */}
        <text x="139" y="30" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={accent} opacity="0.9">📊 GATE CSE 2028 Tracker</text>

        {/* Subject progress bars */}
        {subjects.map((s, i) => {
          const barW  = 150
          const filled = (s.pct / 100) * barW
          return (
            <g key={s.label}>
              <text x="30" y={60 + i * 40} fontFamily="monospace" fontSize="7" fill="var(--text)" opacity="0.55">{s.label}</text>
              <text x="248" y={60 + i * 40} textAnchor="end" fontFamily="monospace" fontSize="7" fill={s.color} opacity="0.9">{s.pct}%</text>
              <rect x="30" y={65 + i * 40} width={barW} height="9" rx="4.5" fill={`${s.color}18`} />
              <motion.rect x="30" y={65 + i * 40} height="9" rx="4.5" fill={s.color} opacity="0.72"
                animate={{ width: hovered ? filled : filled * 0.5 }}
                transition={{ duration: 0.7, delay: i * 0.1 }} />
            </g>
          )
        })}

        {/* Pulsing sync indicator */}
        <rect x="28" y="252" width="222" height="28" rx="6" fill={`${accent}0d`} stroke={`${accent}22`} strokeWidth="1" />
        <motion.circle cx="48" cy="266" r="5" fill={accent} opacity="0.8"
          animate={hovered ? { r: [5, 7, 5], opacity: [0.8, 0.3, 0.8] } : {}}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
        <text x="63" y="262" fontFamily="monospace" fontSize="7" fill={accent} opacity="0.85">Supabase · Real-time Sync</text>
        <text x="63" y="274" fontFamily="monospace" fontSize="6" fill="var(--text)" opacity="0.4">Cross-device · PWA · Offline</text>

        {/* MathJax formula */}
        <motion.g
          animate={hovered ? { opacity: [0.4, 0.9, 0.4] } : { opacity: 0.4 }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <rect x="28" y="295" width="222" height="24" rx="5" fill={`${accent}0a`} stroke={`${accent}1a`} strokeWidth="1" />
          <text x="139" y="311" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={accent}>T(n) = aT(n/b) + f(n) · MathJax</text>
        </motion.g>

        {/* Footer */}
        <text x="139" y="340" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="var(--text)" opacity="0.35">Python · JS · Supabase · MathJax</text>
      </svg>
    </div>
  )
}

// ─── Full-Stack Learning Hub: Interactive Curriculum ───────────────────────
export function FullStackVisual() {
  const [hovered, setHovered] = useState(false)
  const accent = '#ef4444'

  const phases = [
    { num: 0, label: 'How the Web Works', nodes: 1 },
    { num: 1, label: 'HTML Foundations',  nodes: 1 },
    { num: 2, label: 'CSS & Design',      nodes: 5 },
    { num: 3, label: 'JS Core Deep Dive', nodes: 3 },
    { num: 4, label: 'V8 Engine & GC',    nodes: 5 },
    { num: 5, label: 'Git & Tooling',     nodes: 1 },
    { num: 6, label: 'TypeScript Mastery',nodes: 2 },
  ]

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 278 360" style={{ width: '100%', height: '100%' }}>
        <defs>
          <pattern id="fsGrid" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M22 0H0V22" fill="none" stroke={`${accent}10`} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="278" height="360" fill="url(#fsGrid)" />

        {/* Dashboard Frame */}
        <rect x="20" y="20" width="238" height="260" rx="8" fill={`${accent}08`} stroke={`${accent}33`} strokeWidth="1.2" />
        <rect x="20" y="20" width="238" height="24" fill={`${accent}15`} stroke={`${accent}33`} strokeWidth="1.2" />
        <circle cx="34" cy="32" r="3" fill="#ff5f56" />
        <circle cx="44" cy="32" r="3" fill="#ffbd2e" />
        <circle cx="54" cy="32" r="3" fill="#27c93f" />
        <text x="139" y="35" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={accent} opacity="0.9">fs-dashboard.html</text>

        {/* Curriculum nodes */}
        {phases.map((p, i) => (
          <motion.g key={p.num}
            animate={hovered ? { x: [0, 4, 0] } : {}}
            transition={{ duration: 1.2, delay: i * 0.15, repeat: hovered ? Infinity : 0 }}
          >
            <rect x="35" y={55 + i * 30} width="208" height="22" rx="4" fill={`${accent}0a`} stroke={`${accent}22`} strokeWidth="1" />
            <text x="45" y={69 + i * 30} fontFamily="monospace" fontSize="8" fill={accent}>P{p.num}</text>
            <text x="65" y={69 + i * 30} fontFamily="monospace" fontSize="7" fill="var(--text)" opacity="0.8">{p.label}</text>
            
            {/* Dots representing notes */}
            {Array.from({ length: p.nodes }).map((_, j) => (
              <circle key={j} cx={230 - j * 10} cy={66 + i * 30} r="2.5" fill={accent} opacity="0.6" />
            ))}
          </motion.g>
        ))}

        {/* Anti-theft script active badge */}
        <rect x="45" y="266" width="188" height="26" rx="6" fill="#1f2937" stroke={`${accent}44`} strokeWidth="1" />
        <motion.circle cx="60" cy="279" r="4" fill="#ef4444"
          animate={hovered ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <text x="72" y="282" fontFamily="monospace" fontSize="6.5" fill="#ef4444" opacity="0.9">Anti-Theft Block Active</text>
        <text x="220" y="282" textAnchor="end" fontFamily="monospace" fontSize="6.5" fill="var(--text)" opacity="0.5">wire-hub.js</text>

        {/* Footer info */}
        <text x="139" y="315" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={accent} opacity="0.8">45+ Standalone Glassmorphic Notes</text>
        <text x="139" y="328" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="var(--text)" opacity="0.4">HTML · CSS · JS · Vercel Rewrites</text>
      </svg>
    </div>
  )
}

// ─── C++ Mastery: DSA & Logic Building ────────────────────────────────────
export function CPPVisual() {
  const [hovered, setHovered] = useState(false)
  const accent = '#00599C' // C++ blue

  const nodes = [
    { id: 1, x: 139, y: 70 },
    { id: 2, x: 80,  y: 130 },
    { id: 3, x: 198, y: 130 },
    { id: 4, x: 50,  y: 200 },
    { id: 5, x: 110, y: 200 },
    { id: 6, x: 168, y: 200 },
    { id: 7, x: 228, y: 200 },
  ]
  const edges = [
    [1, 2], [1, 3],
    [2, 4], [2, 5],
    [3, 6], [3, 7]
  ]

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 278 360" style={{ width: '100%', height: '100%' }}>
        <defs>
          <pattern id="cppGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke={`${accent}1a`} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="278" height="360" fill="url(#cppGrid)" />

        <text x="139" y="35" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={accent} opacity="0.9">C++ · Theory + DSA</text>

        {/* Tree Edges */}
        {edges.map(([u, v], i) => {
          const n1 = nodes.find(n => n.id === u)!
          const n2 = nodes.find(n => n.id === v)!
          return (
            <motion.line
              key={i} x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
              stroke={`${accent}44`} strokeWidth="1.5"
              animate={hovered ? { stroke: [ `${accent}44`, `${accent}aa`, `${accent}44` ] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          )
        })}

        {/* Floating packet dots on edges */}
        {hovered && edges.map(([u, v], i) => {
          const n1 = nodes.find(n => n.id === u)!
          const n2 = nodes.find(n => n.id === v)!
          return (
            <motion.circle
              key={`dot${i}`}
              r="2.5" fill="#eab308" opacity="0.9"
              animate={{ x: [n1.x, n2.x], y: [n1.y, n2.y], opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
            />
          )
        })}

        {/* Tree Nodes */}
        {nodes.map(n => (
          <motion.g key={n.id}
            animate={hovered ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, delay: n.id * 0.1 }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          >
            <circle cx={n.x} cy={n.y} r="12" fill="var(--surface)" stroke={accent} strokeWidth="2" />
            <text x={n.x} y={n.y + 3} textAnchor="middle" fontFamily="monospace" fontSize="8" fill="var(--text)">{n.id}</text>
          </motion.g>
        ))}

        {/* Code block */}
        <rect x="28" y="240" width="222" height="45" rx="6" fill={`${accent}0a`} stroke={`${accent}22`} strokeWidth="1" />
        <text x="38" y="255" fontFamily="monospace" fontSize="6.5" fill="#eab308">std::vector&lt;int&gt; nums = {'{1, 2, 3}'};</text>
        <text x="38" y="267" fontFamily="monospace" fontSize="6.5" fill={accent}>std::sort(nums.begin(), nums.end());</text>
        <text x="38" y="279" fontFamily="monospace" fontSize="6.5" fill="var(--text)" opacity="0.6">// O(N log N) logic building</text>

        <text x="139" y="315" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={accent} opacity="0.8">LeetCode Approaches · System Design</text>
        <text x="139" y="328" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="var(--text)" opacity="0.4">Pointers · Memory · OOPs</text>
      </svg>
    </div>
  )
}

// ─── Latent: Campus Social Network ──────────────────────────────────────────
export function LatentVisual() {
  const [hovered, setHovered] = useState(false)
  const accent = '#8b5cf6'

  const nodes = [
    { id: 'center', x: 139, y: 180, r: 24, icon: '🎓', label: 'Student' },
    { id: 'feed',   x: 60,  y: 100, r: 16, icon: '📰', label: 'Feed' },
    { id: 'events', x: 218, y: 100, r: 16, icon: '📅', label: 'Events' },
    { id: 'market', x: 60,  y: 260, r: 16, icon: '🛒', label: 'Market' },
    { id: 'groups', x: 218, y: 260, r: 16, icon: '📚', label: 'Groups' },
  ]

  const links = [
    { x1: 139, y1: 180, x2: 60,  y2: 100 },
    { x1: 139, y1: 180, x2: 218, y2: 100 },
    { x1: 139, y1: 180, x2: 60,  y2: 260 },
    { x1: 139, y1: 180, x2: 218, y2: 260 },
  ]

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 278 360" style={{ width: '100%', height: '100%' }}>
        <defs>
          <pattern id="ltgrid" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M22 0H0V22" fill="none" stroke={`${accent}12`} strokeWidth="0.5" />
          </pattern>
          <radialGradient id="ltGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.25" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="278" height="360" fill="url(#ltgrid)" />
        <circle cx="139" cy="180" r="100" fill="url(#ltGlow)" />

        {/* Connections */}
        {links.map((l, i) => (
          <motion.line
            key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
            stroke={`${accent}44`} strokeWidth="1.5" strokeDasharray="4 4"
            animate={hovered ? { strokeDashoffset: [0, -16] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        {/* Packets */}
        {hovered && links.map((l, i) => (
          <motion.circle
            key={`dot${i}`} r="3" fill={accent}
            animate={{ x: [l.x1, l.x2], y: [l.y1, l.y2], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
        {hovered && links.map((l, i) => (
          <motion.circle
            key={`dot-rev${i}`} r="3" fill="var(--text)" opacity="0.8"
            animate={{ x: [l.x2, l.x1], y: [l.y2, l.y1], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 + 0.75 }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((n, i) => (
          <motion.g key={n.id}
            animate={hovered ? { y: [0, -4, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          >
            <circle cx={n.x} cy={n.y} r={n.r} fill={`${accent}15`} stroke={`${accent}55`} strokeWidth="1.5" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={n.r === 24 ? "18" : "12"}>{n.icon}</text>
            <rect x={n.x - 24} y={n.y + n.r + 6} width="48" height="14" rx="4" fill={`${accent}0a`} stroke={`${accent}22`} strokeWidth="1" />
            <text x={n.x} y={n.y + n.r + 15} textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="var(--text)" opacity="0.8">{n.label}</text>
          </motion.g>
        ))}

        {/* Glassmorphic card overlay */}
        <motion.g
          animate={hovered ? { y: [0, -2, 0] } : {}}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <rect x="28" y="28" width="222" height="42" rx="8" fill={`${accent}15`} stroke={`${accent}44`} strokeWidth="1.2" />
          <text x="139" y="46" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={accent} opacity="0.9">Lumina Campus Theme</text>
          <text x="139" y="59" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="var(--text)" opacity="0.5">Glassmorphism · Tailwind · Framer Motion</text>
        </motion.g>

        {/* Bottom stats */}
        <rect x="30" y="308" width="218" height="24" rx="6" fill={`${accent}0a`} stroke={`${accent}22`} strokeWidth="1" />
        <text x="139" y="324" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill={accent} opacity="0.8">React 19 · Node.js · Postgres · Zustand</text>
      </svg>
    </div>
  )
}

// ─── LEVO: Smart Transport Operations Platform ───────────────────────────────
export function LEVOVisual() {
  const [hovered, setHovered] = useState(false)
  const [tick, setTick] = useState(0)
  const accent = '#f97316'

  useEffect(() => {
    if (!hovered) return
    const t = setInterval(() => setTick(n => n + 1), 700)
    return () => clearInterval(t)
  }, [hovered])

  void tick

  const vehicles = [
    { id: 'Van-01', status: 'ON_TRIP',   color: '#22c55e' },
    { id: 'Van-02', status: 'AVAILABLE', color: '#3b82f6' },
    { id: 'Van-03', status: 'IN_SHOP',   color: '#ef4444' },
    { id: 'Van-04', status: 'AVAILABLE', color: '#3b82f6' },
  ]

  const kpis = [
    { label: 'Fleet', val: '24', icon: '🚛', cx: 55 },
    { label: 'Active', val: '8',  icon: '🟢', cx: 139 },
    { label: 'In Shop', val: '3', icon: '🔧', cx: 223 },
  ]

  const states = ['DRAFT', 'DISPATCHED', 'COMPLETE']

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 278 360" style={{ width: '100%', height: '100%' }}>
        <defs>
          <pattern id="levoGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke={`${accent}10`} strokeWidth="0.5" />
          </pattern>
          <marker id="levoArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0 0 L6 3 L0 6 Z" fill={`${accent}88`} />
          </marker>
        </defs>
        <rect width="278" height="360" fill="url(#levoGrid)" />

        {/* Header bar */}
        <rect x="20" y="14" width="238" height="26" rx="6" fill={`${accent}18`} stroke={`${accent}44`} strokeWidth="1.2" />
        <text x="139" y="31" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill={accent} opacity="0.9">🚛 LEVO · Fleet Operations</text>

        {/* KPI Cards */}
        {kpis.map((k, i) => (
          <motion.g key={k.label}
            animate={hovered ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={{ duration: 1.4, repeat: hovered ? Infinity : 0, delay: i * 0.2 }}
            style={{ transformOrigin: `${k.cx}px 64px` }}
          >
            <rect x={k.cx - 36} y="49" width="72" height="44" rx="7"
              fill={`${accent}0e`} stroke={`${accent}28`} strokeWidth="1.1" />
            <text x={k.cx} y="67" textAnchor="middle" fontSize="12">{k.icon}</text>
            <text x={k.cx} y="79" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={accent} opacity="0.9">{k.val}</text>
            <text x={k.cx} y="88" textAnchor="middle" fontFamily="monospace" fontSize="5.5" fill="var(--text)" opacity="0.4">{k.label}</text>
          </motion.g>
        ))}

        {/* Vehicle status table */}
        <text x="30" y="111" fontFamily="monospace" fontSize="6.5" fill={accent} opacity="0.65">VEHICLE STATUS</text>
        {vehicles.map((v, i) => (
          <motion.g key={v.id}
            animate={hovered ? { x: [0, 3, 0] } : { x: 0 }}
            transition={{ duration: 0.9, delay: i * 0.12, repeat: hovered ? Infinity : 0, repeatDelay: 0.5 }}
          >
            <rect x="30" y={116 + i * 32} width="218" height="24" rx="5"
              fill={`${accent}07`} stroke={`${accent}1a`} strokeWidth="1" />
            <text x="44" y={131 + i * 32} fontFamily="monospace" fontSize="7.5" fill="var(--text)" opacity="0.6">{v.id}</text>
            <motion.circle cx="130" cy={128 + i * 32} r="4.5" fill={v.color} opacity="0.85"
              animate={hovered && v.status === 'ON_TRIP' ? { r: [4.5, 6, 4.5], opacity: [0.85, 0.4, 0.85] } : {}}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
            <text x="140" y={132 + i * 32} fontFamily="monospace" fontSize="6.5" fill={v.color} opacity="0.9">{v.status}</text>
          </motion.g>
        ))}

        {/* Trip state machine */}
        <text x="30" y="250" fontFamily="monospace" fontSize="6.5" fill={accent} opacity="0.65">TRIP LIFECYCLE STATE MACHINE</text>
        {states.map((state, i) => (
          <g key={state}>
            <rect x={28 + i * 80} y="257" width="68" height="20" rx="5"
              fill={i === 1 ? `${accent}22` : `${accent}0a`}
              stroke={i === 1 ? `${accent}55` : `${accent}22`}
              strokeWidth="1" />
            <text x={62 + i * 80} y="270" textAnchor="middle" fontFamily="monospace" fontSize="6"
              fill={i === 1 ? accent : 'var(--text)'} opacity={i === 1 ? 0.9 : 0.45}>
              {state}
            </text>
            {i < 2 && (
              <motion.line
                x1={97 + i * 80} y1={267} x2={108 + i * 80} y2={267}
                stroke={`${accent}66`} strokeWidth="1.5"
                markerEnd="url(#levoArrow)"
                animate={hovered ? { strokeOpacity: [0.35, 1, 0.35] } : { strokeOpacity: 0.35 }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
              />
            )}
          </g>
        ))}

        {/* AI + Weather footer badge */}
        <motion.g
          animate={hovered ? { opacity: [0.65, 1, 0.65] } : { opacity: 0.65 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <rect x="28" y="293" width="222" height="52" rx="6" fill={`${accent}0a`} stroke={`${accent}22`} strokeWidth="1" />
          <text x="139" y="309" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={accent} opacity="0.85">🌦️ Grok AI · Weather Risk Assessment</text>
          <text x="139" y="322" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="var(--text)" opacity="0.4">node-cron · Hourly active-trip reassessment</text>
          <text x="139" y="333" textAnchor="middle" fontFamily="monospace" fontSize="6" fill={accent} opacity="0.6">RBAC · 4 Roles · 40+ REST Endpoints</text>
          <text x="139" y="343" textAnchor="middle" fontFamily="monospace" fontSize="5.8" fill="var(--text)" opacity="0.3">Prisma · Zustand · TanStack Query · PDFKit</text>
        </motion.g>
      </svg>
    </div>
  )
}

// ─── Recall: Civic Journalism & Public Incident Archive ───────────────────────
export function RecallVisual() {
  const [hovered, setHovered] = useState(false)
  const accent = '#dc2626'

  const nodes = [
    { id: 'center', x: 139, y: 148, r: 17, label: '#041', sub: 'Incident', primary: true },
    { id: 'b', x: 78,  y: 95,  r: 10, label: 'Cause A', primary: false },
    { id: 'c', x: 200, y: 95,  r: 10, label: 'Cause B', primary: false },
    { id: 'd', x: 65,  y: 195, r: 10, label: 'Effect A', primary: false },
    { id: 'e', x: 213, y: 195, r: 10, label: 'Effect B', primary: false },
    { id: 'f', x: 139, y: 228, r: 8,  label: 'Legal', primary: false },
  ]

  const edges = [
    { x1: 139, y1: 148, x2: 78,  y2: 95  },
    { x1: 139, y1: 148, x2: 200, y2: 95  },
    { x1: 139, y1: 148, x2: 65,  y2: 195 },
    { x1: 139, y1: 148, x2: 213, y2: 195 },
    { x1: 139, y1: 148, x2: 139, y2: 228 },
  ]

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 278 360" style={{ width: '100%', height: '100%' }}>
        <defs>
          <pattern id="rcGrid" width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M18 0H0V18" fill="none" stroke={`${accent}10`} strokeWidth="0.5" />
          </pattern>
          <radialGradient id="rcGlow" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.13" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="278" height="360" fill="url(#rcGrid)" />
        <rect width="278" height="360" fill="url(#rcGlow)" />

        {/* Newspaper masthead */}
        <rect x="20" y="12" width="238" height="36" rx="0" fill="none" stroke={`${accent}33`} strokeWidth="1" />
        <line x1="20" y1="20" x2="258" y2="20" stroke={`${accent}22`} strokeWidth="0.5" />
        <text x="139" y="16" textAnchor="middle" fontFamily="monospace" fontSize="5.5" fill="var(--text)" opacity="0.3" letterSpacing="0.12em">THE RECORD THAT CANNOT BE ERASED</text>
        <text x="139" y="38" textAnchor="middle" fontFamily="serif" fontSize="18" fill={accent} opacity="0.95" fontWeight="700">RECALL</text>

        {/* Causality graph label */}
        <text x="139" y="68" textAnchor="middle" fontFamily="monospace" fontSize="6" fill={accent} opacity="0.5">D3.js · Causality Force Graph</text>

        {/* Causality edges */}
        {edges.map((e, i) => (
          <motion.line key={i}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke={`${accent}44`} strokeWidth="1.3" strokeDasharray="4 3"
            animate={hovered ? { strokeOpacity: [0.3, 0.9, 0.3], strokeDashoffset: [0, -14] } : { strokeOpacity: 0.3 }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2, ease: 'linear' }}
          />
        ))}

        {/* Animated data packets */}
        {hovered && edges.map((e, i) => (
          <motion.circle key={`p${i}`} r="2.5" fill={accent} opacity="0.9"
            animate={{ x: [e.x1, e.x2], y: [e.y1, e.y2], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
          />
        ))}

        {/* Causality nodes */}
        {nodes.map((n, i) => (
          <motion.g key={n.id}
            animate={hovered ? { y: [0, -4, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          >
            <circle cx={n.x} cy={n.y} r={n.r + 7} fill={`${accent}07`} />
            <circle cx={n.x} cy={n.y} r={n.r}
              fill={n.primary ? `${accent}22` : `${accent}0e`}
              stroke={n.primary ? accent : `${accent}55`}
              strokeWidth={n.primary ? 1.8 : 1.1} />
            {n.primary && (
              <text x={n.x} y={n.y + 1} textAnchor="middle" fontFamily="monospace" fontSize="6" fill={accent} opacity="0.9">{n.sub}</text>
            )}
            <text x={n.x} y={n.primary ? n.y + 12 : n.y + 4} textAnchor="middle" fontFamily="monospace"
              fontSize={n.primary ? '5.5' : '6'}
              fill={n.primary ? accent : 'var(--text)'} opacity={n.primary ? 0.75 : 0.55}>
              {n.label}
            </text>
          </motion.g>
        ))}

        {/* Verified status tags */}
        {[
          { label: '✅ Verified', x: 40,  color: '#22c55e' },
          { label: '📋 Reported', x: 118, color: '#f59e0b' },
          { label: '⚠️ Disputed', x: 198, color: '#ef4444' },
        ].map(tag => (
          <g key={tag.label}>
            <rect x={tag.x - 30} y="252" width="68" height="16" rx="4"
              fill={`${tag.color}12`} stroke={`${tag.color}33`} strokeWidth="0.8" />
            <text x={tag.x + 4} y="263" textAnchor="middle" fontFamily="monospace" fontSize="5.8" fill={tag.color} opacity="0.8">{tag.label}</text>
          </g>
        ))}

        {/* Tech footer */}
        <rect x="28" y="280" width="222" height="62" rx="6" fill={`${accent}08`} stroke={`${accent}1e`} strokeWidth="1" />
        <text x="139" y="296" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={accent} opacity="0.85">📰 Civic Journalism Archive</text>
        <line x1="45" y1="303" x2="233" y2="303" stroke={`${accent}18`} strokeWidth="0.5" />
        <text x="139" y="314" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill="var(--text)" opacity="0.4">React 18 · D3.js · TypeScript · Vite</text>
        <text x="139" y="325" textAnchor="middle" fontFamily="monospace" fontSize="6.5" fill={accent} opacity="0.6">PostgreSQL · Prisma · Sanity.io · Redis</text>
        <text x="139" y="336" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="var(--text)" opacity="0.3">Meilisearch · Cloudinary · AWS S3 · Vercel</text>
      </svg>
    </div>
  )
}
