import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'

const ACCENT = '#e11d48'

const BADGES = [
  { label: '4 Portals', color: '#3b82f6' },
  { label: '145 API Endpoints', color: '#f97316' },
  { label: '33 DB Tables', color: '#f97316' },
  { label: 'SIH 2026 · Student Innovation', color: '#8b5cf6' },
  { label: 'Offline SOS · 2G Capable', color: ACCENT },
  { label: 'Hash-Chained Digital ID', color: '#0ea5e9' },
]

const PILLARS = [
  {
    icon: '🧭',
    title: 'AI Travel Assistant',
    desc: 'Plans, costs, and safety-scores a real Northeast India itinerary from a deterministic scorer — Gemini only narrates numbers that already exist, never invents them.',
  },
  {
    icon: '🏨',
    title: 'Verified Local Tourism',
    desc: '35 government-verified hotels, homestays, guides, and artisan cooperatives across all 8 Northeast states, surfaced directly inside the trip being planned.',
  },
  {
    icon: '🚨',
    title: 'Offline-Resilient Safety',
    desc: 'SOS over raw SMS with zero data connection, a Dead Man’s Switch that fires for you if you go silent, and a unified rescuer network with real road routing.',
  },
  {
    icon: '🤖',
    title: 'A Real Trained Model',
    desc: 'A from-scratch logistic regression — no scikit-learn, no TensorFlow — 75.6% test accuracy, printed loss curve, per-prediction explainability.',
  },
]

const SCREENSHOTS = [
  { src: '/aaraksha/tourist-dashboard.png', alt: 'Aaraksha Tourist PWA dashboard — Discover Northeast India', label: 'Tourist PWA' },
  { src: '/aaraksha/govt-live-map.png', alt: 'Aaraksha Government Command Center live tourist map', label: 'Govt Live Ops Map' },
  { src: '/aaraksha/govt-risk-overview.png', alt: 'Aaraksha Risk Overview with trained Predictive Risk Model', label: 'Predictive Risk Overview' },
  { src: '/aaraksha/guardian-portal.png', alt: 'Aaraksha Guardian Portal live SOS tracking, no login required', label: 'Guardian Portal' },
  { src: '/aaraksha/rescuer-active-job.png', alt: 'Aaraksha Rescuer App live road-routed navigation to an SOS', label: 'Rescuer App' },
  { src: '/aaraksha/govt-local-operators.png', alt: 'Aaraksha verified Local Tourism Providers roster', label: 'Local Tourism Providers' },
]

export default function AarakshaFlagship() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative',
        background: 'var(--surface)',
        border: `1.5px solid ${ACCENT}33`,
        borderRadius: '24px',
        padding: 'clamp(1.5rem, 4vw, 3rem)',
        marginBottom: '4rem',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '-120px', right: '-120px',
        width: '360px', height: '360px', borderRadius: '50%',
        background: `radial-gradient(circle, ${ACCENT}14 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', fontWeight: 700,
          color: ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase',
          background: `${ACCENT}14`, border: `1px solid ${ACCENT}38`, borderRadius: '50px',
          padding: '4px 12px',
        }}>
          ★ Flagship Project
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: 'var(--text-faint)' }}>
          Smart India Hackathon 2026
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.9rem, 4.5vw, 2.9rem)',
        fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: '0.5rem',
        position: 'relative', zIndex: 1,
      }}>
        🛡️ Aaraksha
      </h3>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontStyle: 'italic',
        color: ACCENT, marginBottom: '1.25rem', position: 'relative', zIndex: 1,
      }}>
        Smart Tourism, Safe Journey — An AI-Native Travel Planning, Verified Local Tourism
        Discovery, and Offline-Resilient Safety Platform for Northeast Indian Terrain
      </p>

      {/* Pitch */}
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: 'var(--text-muted)',
        lineHeight: 1.75, marginBottom: '1.5rem', maxWidth: '820px', position: 'relative', zIndex: 1,
      }}>
        Northeast India pulls tourists into terrain most tourism and safety apps were never built
        for — 3000m mountain passes, zero-connectivity valleys, a local tourism economy with almost
        no digital presence a traveller can trust. Aaraksha connects three layers most apps treat as
        separate: an AI travel assistant that plans a real itinerary, a government-verified directory
        of real local hotels, homestays, and guides surfaced inside that same trip, and a safety layer
        built on the opposite assumption most apps make — that the moment someone needs help is
        exactly the moment their phone stops being reliable.
      </p>

      {/* Badge strip */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
        {BADGES.map(b => (
          <span key={b.label} style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', fontWeight: 600,
            color: b.color, background: `${b.color}14`, border: `1px solid ${b.color}38`,
            borderRadius: '50px', padding: '5px 12px', whiteSpace: 'nowrap',
          }}>
            {b.label}
          </span>
        ))}
      </div>

      {/* Screenshot gallery */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem', marginBottom: '2rem', position: 'relative', zIndex: 1,
      }}>
        {SCREENSHOTS.map(s => (
          <div key={s.src} style={{
            borderRadius: '12px', overflow: 'hidden', border: '1.5px solid var(--border)',
            background: 'var(--surface-2)',
          }}>
            <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: 'var(--surface-2)' }}>
              <img
                src={s.src}
                alt={s.alt}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
              />
            </div>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: 'var(--text-faint)',
              padding: '0.5rem 0.75rem', margin: 0,
            }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Four pillars */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem', marginBottom: '2rem', position: 'relative', zIndex: 1,
      }}>
        {PILLARS.map(p => (
          <div key={p.title} style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: '14px', padding: '1.1rem 1.25rem',
          }}>
            <span style={{ fontSize: '1.3rem', display: 'block', marginBottom: '0.5rem' }}>{p.icon}</span>
            <p style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>
              {p.title}
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {p.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Tech stack */}
      <p style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: 'var(--text-faint)',
        marginBottom: '1.5rem', lineHeight: 1.8, position: 'relative', zIndex: 1,
      }}>
        Node.js · Express · PostgreSQL (raw SQL, zero ORM) · Socket.IO · React 19 · TypeScript ·
        Vite · Zustand · TanStack Query · Dexie.js · react-leaflet · MapLibre GL JS · OSRM ·
        TensorFlow.js · Twilio · Google Gemini
      </p>

      {/* Links */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
        <a
          href="https://github.com/aryanf192811-eng/Aaraksha"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            fontFamily: 'Sora, sans-serif', fontSize: '0.85rem', fontWeight: 700,
            color: '#fff', background: ACCENT, borderRadius: '50px',
            padding: '9px 20px', textDecoration: 'none', border: `1.5px solid ${ACCENT}`,
            transition: 'transform 0.18s, box-shadow 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 28px ${ACCENT}44` }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          <Github size={16} /> View Repository <ExternalLink size={13} style={{ opacity: 0.8 }} />
        </a>
      </div>
    </motion.div>
  )
}
