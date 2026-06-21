import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const GROUPS = [
  {
    label: 'Backend Engineering',
    color: '#4F83FF',
    items: ['Node.js', 'Express', 'FastAPI', 'Pydantic', 'JWT', 'REST APIs'],
  },
  {
    label: 'Database Systems',
    color: '#336791',
    items: ['PostgreSQL', 'SQLite', 'Supabase', 'SQLAlchemy', 'Raw SQL'],
  },
  {
    label: 'Frontend Systems',
    color: '#61DAFB',
    items: ['React 19', 'TypeScript', 'Vite 8', 'Tailwind CSS 4', 'Framer Motion', 'Zustand', 'KaTeX'],
  },
  {
    label: 'Languages',
    color: '#F59E0B',
    items: ['JavaScript', 'TypeScript', 'Python', 'C', 'C++', 'SQL'],
  },
  {
    label: 'Infrastructure',
    color: '#68A063',
    items: ['Git', 'GitHub Actions', 'Vercel', 'Firebase', 'uvicorn'],
  },
]

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '0.72rem',
        fontWeight: 500,
        color: '#F59E0B',
        background: 'rgba(79,131,255,0.07)',
        border: '1px solid rgba(79,131,255,0.2)',
        borderRadius: '3px',
        padding: '4px 10px',
        letterSpacing: '0.04em',
        transition: 'border-color 0.15s, box-shadow 0.15s, color 0.15s',
        cursor: 'default',
        display: 'inline-block',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = color
        el.style.boxShadow = `0 0 10px ${color}33`
        el.style.color = color
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'rgba(79,131,255,0.2)'
        el.style.boxShadow = 'none'
        el.style.color = '#F59E0B'
      }}
    >
      {label}
    </span>
  )
}

export default function TechStack() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="stack" style={{ padding: '6rem 1.5rem', maxWidth: '72rem', margin: '0 auto', borderTop: '1px solid #1A2744' }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#F59E0B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          -- tech_stack
        </p>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, color: '#E2EAFD', letterSpacing: '-0.025em', marginBottom: '3rem' }}>
          Tools & Technologies
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {GROUPS.map((group, gi) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: gi * 0.08, duration: 0.4 }}
              className="stack-row"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '4px' }}>
                <div style={{ width: '3px', height: '14px', background: group.color, borderRadius: '2px', flexShrink: 0 }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#6B84AA' }}>
                  {group.label}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {group.items.map(item => <Tag key={item} label={item} color={group.color} />)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Currently deepening callout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{
            marginTop: '3rem',
            padding: '1.25rem 1.5rem',
            background: '#0E1628',
            border: '1px solid #1A2744',
            borderLeft: '3px solid #4F83FF',
            borderRadius: '0 4px 4px 0',
          }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#F59E0B', marginBottom: '0.5rem', letterSpacing: '0.07em' }}>
            // currently_deepening
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#6B84AA', lineHeight: 1.6 }}>
            Java · Spring Boot · PostgreSQL · System Design · GATE CSE 2028
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
