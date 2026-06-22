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
