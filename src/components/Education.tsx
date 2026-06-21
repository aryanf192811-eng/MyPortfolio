import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function Education() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section style={{ padding: '0 1.5rem 6rem', maxWidth: '72rem', margin: '0 auto' }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45 }}
      >
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#F59E0B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          -- education
        </p>
        <div style={{ border: '1px solid #1A2744', borderLeft: '3px solid #F59E0B', borderRadius: '0 6px 6px 0', overflow: 'hidden', background: '#0E1628' }}>
          <div style={{
            background: '#0A1020', padding: '1rem 1.5rem', borderBottom: '1px solid #1A2744',
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem',
          }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#E2EAFD' }}>
              B.Tech Computer Science
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#F59E0B', letterSpacing: '0.04em' }}>
              2025–2029
            </span>
          </div>
          <div className="edu-2col" style={{ background: '#0E1628' }}>
            <div style={{ padding: '1rem 1.5rem', borderRight: '1px solid #1A2744' }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#F59E0B', marginBottom: '0.35rem', letterSpacing: '0.06em' }}>institution</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#8BA5CC' }}>Parul University, Gujarat</p>
            </div>
            <div style={{ padding: '1rem 1.5rem' }}>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#F59E0B', marginBottom: '0.35rem', letterSpacing: '0.06em' }}>CGPA</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#8BA5CC' }}>7.85</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
