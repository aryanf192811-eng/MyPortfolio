import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Server, Layers, Database, FileCode, Terminal, Radio, Triangle, Cpu } from 'lucide-react'
import { getTechColor } from '../lib/techColors'
import { TechIcon } from './TechIcon'

// Most distinctive/impressive skills only — the rest live in the full breakdown below
const CORE_SKILLS = [
  { name: 'Node.js',    Icon: Server,    color: '#68a063' },
  { name: 'TypeScript', Icon: FileCode,  color: '#3178c6' },
  { name: 'React 19',   Icon: Layers,    color: '#61dafb' },
  { name: 'PostgreSQL', Icon: Database,  color: '#336791' },
  { name: 'Python',     Icon: Terminal,  color: '#3776ab' },
  { name: 'Socket.IO',  Icon: Radio,     color: '#4a4a4a' },
  { name: 'Prisma',     Icon: Triangle,  color: '#2d3748' },
  { name: 'C++',        Icon: Cpu,       color: '#00599c' },
]

// Full categorized stack from README
const STACK_GROUPS = [
  {
    label: 'Backend',
    tags: ['Node.js', 'Express', 'FastAPI', 'Pydantic', 'JWT', 'REST APIs', 'Socket.IO', 'Prisma'],
  },
  {
    label: 'Database',
    tags: ['PostgreSQL', 'SQLite', 'Supabase', 'SQLAlchemy', 'Raw SQL'],
  },
  {
    label: 'Frontend',
    tags: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS 4', 'Framer Motion', 'Zustand', 'TanStack Query', 'Zod', 'KaTeX'],
  },
  {
    label: 'Languages',
    tags: ['JavaScript', 'TypeScript', 'Python', 'C', 'C++', 'SQL'],
  },
  {
    label: 'Infrastructure',
    tags: ['Git', 'GitHub Actions', 'Vercel', 'Firebase', 'uvicorn', 'AWS'],
  },
  {
    label: 'AI & Real-Time',
    tags: ['Gemini AI', 'Grok AI', 'Machine Learning', 'TensorFlow.js', 'OSRM', 'Twilio'],
  },
]

// Recruiter-facing stats — aggregated across the project set, not any single project
const STATS = [
  { value: '8', label: 'Shipped Projects' },
  { value: '245+', label: 'API Endpoints' },
  { value: '77+', label: 'DB Tables' },
  { value: '3', label: 'Hackathon Finals' },
]

const containerV = { hidden: {}, visible: { transition: { staggerChildren: 0.055 } } }
const cardV = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.38 } } }

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="skills" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section-wrap" ref={ref}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '2.5rem' }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-faint)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.55rem' }}>
            what I build with
          </p>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text)' }}>
            My{' '}<span style={{ WebkitTextStroke: '2px var(--text)', color: 'transparent' }}>Skills</span>
          </h2>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="stats-grid"
          style={{ marginBottom: '3rem' }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: '1.5rem 1.25rem',
                background: 'var(--surface)',
                borderRight: i < STATS.length - 1 ? '1px solid var(--border)' : 'none',
                textAlign: 'center',
              }}
            >
              <p style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)', lineHeight: 1 }}>
                {s.value}
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Core skill cards */}
        <motion.div
          className="skills-core-grid"
          variants={containerV}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{ marginBottom: '3rem' }}
        >
          {CORE_SKILLS.map(({ name, Icon, color }) => (
            <motion.div
              key={name}
              className="skill-card"
              variants={cardV}
              style={{ borderTop: `2.5px solid ${color}55`, background: `linear-gradient(180deg, ${color}0a, transparent 60%)` }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderTopColor = color
                el.style.boxShadow = `0 10px 28px ${color}30`
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderTopColor = `${color}55`
                el.style.boxShadow = ''
              }}
            >
              <Icon size={28} className="skill-icon" style={{ color }} />
              <span className="skill-name">{name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Full stack breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.5 }}
          style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '14px', overflow: 'hidden', marginBottom: '2rem' }}
        >
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Full Tech Breakdown
            </p>
          </div>
          {STACK_GROUPS.map((group, gi) => (
            <div
              key={group.label}
              className="skill-group-row"
              style={{
                padding: '0.875rem 1.5rem',
                borderBottom: gi < STACK_GROUPS.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem 1rem',
                alignItems: 'flex-start',
              }}
            >
              <span style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', paddingTop: '3px', minWidth: '110px' }}>
                {group.label}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {group.tags.map(t => {
                  const c = getTechColor(t)
                  return (
                    <span
                      key={t}
                      className="tech-tag"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', borderColor: `${c}28`, color: `${c}cc` }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = `${c}88`
                        el.style.color = c
                        el.style.background = `${c}10`
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.borderColor = `${c}28`
                        el.style.color = `${c}cc`
                        el.style.background = ''
                      }}
                    >
                      <TechIcon name={t} />
                      {t}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Education card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55, duration: 0.5 }}
          style={{
            marginTop: '2rem',
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRadius: '14px',
            padding: '1.5rem 2rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.66rem', color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Education
            </p>
            <p style={{ fontFamily: 'Sora, sans-serif', fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>
              B.Tech Computer Science
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Parul University, Gujarat
            </p>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            {[['Batch', '2025 – 2029'], ['CGPA', '7.80']].map(([k, v]) => (
              <div key={k}>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{k}</p>
                <p style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>{v}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
