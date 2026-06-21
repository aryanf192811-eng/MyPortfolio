import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Database, GitBranch, Server, Layers, Shield } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────
const METRICS = [
  { value: '2', label: 'Sprint Cycles' },
  { value: '1st', label: 'Paid Engagement' },
  { value: 'Solo', label: 'Client Management' },
]

const BULLETS = [
  'Audited existing clinic website — identified UX gaps and SEO improvement opportunities',
  'Designed and built a redesigned inquiry and appointment-booking prototype from scratch',
  'Managed complete client communication and delivery pipeline independently',
]

const ACHIEVEMENTS = [
  { emoji: '🥇', label: 'Hackathon Finalist', detail: 'Odoo × Parul University 2026' },
  { emoji: '💼', label: 'Paid Freelance', detail: 'SoundRich Hearing (Semester 2)' },
  { emoji: '📜', label: 'Certifications', detail: 'HTML · CSS · JS · System Design' },
]

const PRINCIPLES = [
  {
    num: '01', Icon: Database, area: 'a',
    title: 'Schema-First Development',
    desc: 'Database and relationships designed before any API or UI work begins. Schema is the contract.',
    accent: '#3b82f6',
  },
  {
    num: '02', Icon: GitBranch, area: 'b',
    title: 'Workflow-Driven Design',
    desc: 'Business processes modelled as explicit, auditable state machines — nothing implicit.',
    accent: '#22c55e',
  },
  {
    num: '03', Icon: Server, area: 'c',
    title: 'DB as Source of Truth',
    desc: 'Business logic anchored in the data layer, not scattered across application code.',
    accent: '#a855f7',
  },
  {
    num: '04', Icon: Layers, area: 'd',
    title: 'Explicit State Transitions',
    desc: 'No implicit state changes — every transition is intentional and leaves a record. State is never guessed; it is asserted, stored, and queryable.',
    accent: '#f59e0b',
  },
  {
    num: '05', Icon: Shield, area: 'e',
    title: 'Auditability Over Convenience',
    desc: 'Complete audit trails preferred; every change leaves a permanent, queryable record.',
    accent: '#ef4444',
  },
]

// ─── Component ────────────────────────────────────────────────────────
export default function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  })

  return (
    <section id="experience" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section-wrap" ref={ref}>

        {/* ── Header ── */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: '2.75rem' }}>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem',
            color: 'var(--text-faint)', letterSpacing: '0.12em',
            textTransform: 'uppercase', marginBottom: '0.55rem',
          }}>
            where I&apos;ve worked
          </p>
          <h2 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text)',
          }}>
            My{' '}
            <span style={{ WebkitTextStroke: '2px var(--text)', color: 'transparent' }}>
              Experience
            </span>
          </h2>
        </motion.div>

        {/* ── Timeline Card — SoundRich ── */}
        <motion.div {...fadeUp(0.12)} style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'stretch' }}>
            {/* Timeline rail */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: '12px', height: '12px', borderRadius: '50%',
                background: 'var(--text)', flexShrink: 0, marginTop: '4px',
              }} />
              <div style={{ width: '1.5px', flex: 1, background: 'var(--border-2)', marginTop: '6px', minHeight: '40px' }} />
            </div>

            {/* Card content */}
            <div style={{
              flex: 1, background: 'var(--surface)',
              border: '1.5px solid var(--border)', borderRadius: '16px', overflow: 'hidden',
            }}>
              {/* Card header */}
              <div style={{
                padding: '1.25rem 1.75rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
                justifyContent: 'space-between', alignItems: 'flex-start',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.3rem' }}>
                    <h3 style={{
                      fontFamily: 'Sora, sans-serif', fontSize: '1.05rem',
                      fontWeight: 700, color: 'var(--text)',
                    }}>
                      Full-Stack Web Consultant
                    </h3>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
                      color: '#22c55e', background: 'rgba(34,197,94,0.1)',
                      border: '1px solid rgba(34,197,94,0.25)', borderRadius: '50px',
                      padding: '2px 9px', whiteSpace: 'nowrap',
                    }}>
                      Freelance
                    </span>
                  </div>
                  <p style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                  }}>
                    SoundRich Hearing Clinic · Delhi NCR
                  </p>
                </div>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem',
                  color: 'var(--text-faint)', whiteSpace: 'nowrap', paddingTop: '3px',
                }}>
                  Mar 2026 – May 2026
                </span>
              </div>

              {/* Metric chips */}
              <div style={{
                padding: '1rem 1.75rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex', flexWrap: 'wrap', gap: '0.65rem',
              }}>
                {METRICS.map(m => (
                  <div key={m.label} style={{
                    background: 'var(--surface-2)', border: '1.5px solid var(--border-2)',
                    borderRadius: '10px', padding: '0.6rem 1.1rem',
                    display: 'flex', flexDirection: 'column', gap: '2px',
                  }}>
                    <span style={{
                      fontFamily: 'Sora, sans-serif', fontSize: '1.1rem',
                      fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)',
                    }}>
                      {m.value}
                    </span>
                    <span style={{
                      fontFamily: 'Inter, sans-serif', fontSize: '0.68rem',
                      color: 'var(--text-faint)', whiteSpace: 'nowrap',
                    }}>
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bullets */}
              <div style={{ padding: '0.5rem 0' }}>
                {BULLETS.map((b, i) => (
                  <div key={i} style={{
                    padding: '0.8rem 1.75rem',
                    display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
                    borderBottom: i < BULLETS.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: 'var(--text-faint)', flexShrink: 0, marginTop: '7px',
                    }} />
                    <p style={{
                      fontFamily: 'Inter, sans-serif', fontSize: '0.875rem',
                      color: 'var(--text-muted)', lineHeight: 1.65,
                    }}>
                      {b}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Achievements ── */}
        <motion.div {...fadeUp(0.25)} style={{ marginBottom: '3.5rem' }}>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem',
            color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            Highlights &amp; Awards
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem' }}>
            {ACHIEVEMENTS.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }}
                style={{
                  background: 'var(--surface)', border: '1.5px solid var(--border)',
                  borderRadius: '12px', padding: '1rem 1.25rem',
                  display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
                  flex: '1 1 220px',
                }}
              >
                <span style={{ fontSize: '1.3rem', flexShrink: 0, lineHeight: 1 }}>{a.emoji}</span>
                <div>
                  <p style={{
                    fontFamily: 'Sora, sans-serif', fontSize: '0.82rem',
                    fontWeight: 600, color: 'var(--text)', marginBottom: '0.2rem',
                  }}>
                    {a.label}
                  </p>
                  <p style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.77rem',
                    color: 'var(--text-muted)', lineHeight: 1.5,
                  }}>
                    {a.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Engineering Principles Bento ── */}
        <motion.div {...fadeUp(0.38)}>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem',
            color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            Engineering Principles
          </p>
          <div className="principles-bento">
            {PRINCIPLES.map((p, i) => {
              const Icon = p.Icon
              return (
                <motion.div
                  key={p.num}
                  initial={{ opacity: 0, y: 18 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.42 + i * 0.08, duration: 0.45 }}
                  style={{
                    gridArea: p.area,
                    background: 'var(--surface)',
                    border: '1.5px solid var(--border)',
                    borderTop: `3px solid ${p.accent}`,
                    borderRadius: '14px', padding: '1.5rem 1.5rem 1.4rem',
                    display: 'flex', flexDirection: 'column', gap: '0.75rem',
                    transition: 'transform 0.22s, box-shadow 0.22s',
                    cursor: 'default',
                  }}
                  whileHover={{ y: -4, boxShadow: `0 12px 32px ${p.accent}1a` }}
                >
                  {/* Top row: number + icon */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem',
                      color: p.accent, letterSpacing: '0.06em', fontWeight: 500,
                    }}>
                      {p.num}
                    </span>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: `${p.accent}14`, border: `1px solid ${p.accent}28`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: p.accent, flexShrink: 0,
                    }}>
                      <Icon size={16} />
                    </div>
                  </div>
                  {/* Title */}
                  <h4 style={{
                    fontFamily: 'Sora, sans-serif', fontSize: '0.92rem',
                    fontWeight: 700, color: 'var(--text)', lineHeight: 1.25,
                    letterSpacing: '-0.01em',
                  }}>
                    {p.title}
                  </h4>
                  {/* Desc */}
                  <p style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.82rem',
                    color: 'var(--text-muted)', lineHeight: 1.65,
                  }}>
                    {p.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
