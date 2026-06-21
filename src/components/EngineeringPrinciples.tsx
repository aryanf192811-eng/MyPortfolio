import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PRINCIPLES = [
  { name: 'Schema-First Development', description: 'Database and relationships designed before any API or UI work begins' },
  { name: 'Workflow-Driven Design', description: 'Business processes modelled as explicit, auditable state machines' },
  { name: 'Database as Source of Truth', description: 'Business logic anchored in the data layer, not scattered across application code' },
  { name: 'Explicit State Transitions', description: 'No implicit state changes — every transition is intentional and recorded' },
  { name: 'Auditability Over Convenience', description: 'Complete audit trails preferred; every state change leaves a permanent record' },
]

export default function EngineeringPrinciples() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section style={{ padding: '6rem 1.5rem', maxWidth: '72rem', margin: '0 auto' }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#F59E0B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          // engineering_principles
        </p>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, color: '#E2EAFD', letterSpacing: '-0.025em', marginBottom: '2.5rem' }}>
          How I Build
        </h2>

        <div style={{ border: '1px solid #1A2744', borderBottom: 'none', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 0 40px rgba(79,131,255,0.06)' }}>
          {/* Header */}
          <div className="table-row-2col" style={{ background: '#0E1628', borderBottom: '1px solid #1A2744' }}>
            {['principle', 'description'].map((h, i) => (
              <div key={h} style={{ padding: '0.75rem 1.25rem', borderLeft: i > 0 ? '1px solid #1A2744' : 'none' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#F59E0B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {h}
                </span>
              </div>
            ))}
          </div>

          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.name}
              className="table-row-2col"
              style={{
                background: i % 2 === 0 ? '#090E1A' : '#0A1020',
                borderBottom: '1px solid #1A2744',
                transition: 'background 0.15s',
              }}
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.12 + i * 0.07, duration: 0.4 }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#101828')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? '#090E1A' : '#0A1020')}
            >
              <div style={{ padding: '1rem 1.25rem' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.825rem', fontWeight: 500, color: '#4F83FF' }}>
                  {p.name}
                </span>
              </div>
              <div style={{ padding: '1rem 1.25rem', borderLeft: '1px solid #1A2744' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#6B84AA', lineHeight: 1.65 }}>
                  {p.description}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
