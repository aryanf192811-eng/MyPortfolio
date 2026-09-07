import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Database, GitBranch, Server, Layers, Shield, Trophy, Code2, BookOpen, Cloud, X } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────
const METRICS = [
  { value: '2',    label: 'Sprint Cycles' },
  { value: '1st',  label: 'Paid Engagement' },
  { value: 'Solo', label: 'Client Pipeline' },
]

const BULLETS = [
  'Audited existing clinic website — identified UX gaps and SEO improvement opportunities',
  'Designed and built a redesigned inquiry and appointment-booking prototype from scratch',
  'Managed complete client communication and delivery pipeline independently',
]

const HONORS = [
  {
    Icon: Trophy, color: '#f59e0b',
    label: 'Odoo Hackathon 2026',
    detail: 'Top 50 Zonal Finalist · 857 teams · built PeoplePay360',
    bg: 'rgba(245,158,11,0.08)',
    certificate: '/certificates/odoo-hackathon-2026.png',
  },
  {
    Icon: Trophy, color: '#3b82f6',
    label: 'Odoo × Parul Hackathon 2026',
    detail: 'Finalist · Top 100 of 1,300 teams',
    bg: 'rgba(59,130,246,0.08)',
    certificate: '/certificates/odoo-parul-hackathon-2026.png',
  },
  {
    Icon: Trophy, color: '#22c55e',
    label: 'Parul Environment Hackathon 2026',
    detail: 'Finalist · Round 3, Top 17 teams',
    bg: 'rgba(34,197,94,0.08)',
    certificate: '/certificates/parul-environment-hackathon-2026.png',
  },
]

const CERTIFICATIONS = [
  {
    Icon: Code2,    color: '#f7df1e',
    label: 'JavaScript Specialist',
    detail: 'Certiport · Pearson VUE — Aug 2026',
    bg: 'rgba(247,223,30,0.08)',
  },
  {
    Icon: Server,   color: '#ee0000',
    label: 'RHCSA',
    detail: 'Red Hat Certified System Administrator — Aug 2026',
    bg: 'rgba(238,0,0,0.08)',
  },
  {
    Icon: Cloud,    color: '#ff9900',
    label: 'AWS Cloud Foundations',
    detail: 'AWS Academy Graduate — Apr 2026',
    bg: 'rgba(255,153,0,0.08)',
  },
  {
    Icon: BookOpen, color: '#a78bfa',
    label: 'HTML & CSS Specialist',
    detail: 'Certiport · Pearson VUE — Mar 2026',
    bg: 'rgba(167,139,250,0.08)',
  },
]

const PRINCIPLES = [
  {
    num: '01', Icon: Database,
    title: 'Schema-First Development',
    desc: 'Database and relationships designed before any API or UI work begins. Schema is the contract — every endpoint, every form is a derivative of the data model.',
    accent: '#3b82f6',
    tag: 'Data-Centric',
  },
  {
    num: '02', Icon: GitBranch,
    title: 'Workflow-Driven Design',
    desc: 'Business processes modelled as explicit, auditable state machines. Nothing is left implicit — every transition has a trigger, a guard, and a resulting state.',
    accent: '#22c55e',
    tag: 'State Machine',
  },
  {
    num: '03', Icon: Server,
    title: 'DB as Source of Truth',
    desc: 'Business logic anchored in the data layer, not scattered across application code. The database enforces invariants that no amount of application-layer validation can match.',
    accent: '#a855f7',
    tag: 'Architecture',
  },
  {
    num: '04', Icon: Layers,
    title: 'Explicit State Transitions',
    desc: 'No implicit state changes — every transition is intentional and leaves a record. State is never guessed; it is asserted, stored, and queryable at any point in time.',
    accent: '#f59e0b',
    tag: 'Auditability',
  },
  {
    num: '05', Icon: Shield,
    title: 'Auditability Over Convenience',
    desc: 'Complete audit trails preferred over shortcuts. Every change leaves a permanent, queryable record. The inconvenience of writing one more row protects you from debugging production forever.',
    accent: '#ef4444',
    tag: 'Observability',
  },
]

// ─── Achievement Card ─────────────────────────────────────────────────
type Achievement = Omit<typeof HONORS[0], 'certificate'> & { certificate?: string }
function AchievementCard({ a, delay, inView, onOpenCertificate }: { a: Achievement; delay: number; inView: boolean; onOpenCertificate?: (src: string) => void }) {
  const [hovered, setHovered] = useState(false)
  const Icon = a.Icon
  const hasCert = !!a.certificate
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => hasCert && onOpenCertificate?.(a.certificate!)}
      role={hasCert ? 'button' : undefined}
      tabIndex={hasCert ? 0 : undefined}
      onKeyDown={e => { if (hasCert && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onOpenCertificate?.(a.certificate!) } }}
      style={{
        background: hovered ? a.bg : 'var(--surface)',
        borderLeft: `1.5px solid ${hovered ? a.color + '55' : 'var(--border)'}`,
        borderRight: `1.5px solid ${hovered ? a.color + '55' : 'var(--border)'}`,
        borderBottom: `1.5px solid ${hovered ? a.color + '55' : 'var(--border)'}`,
        borderTop: `3px solid ${a.color}`,
        borderRadius: '16px',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: hovered ? `0 24px 48px ${a.color}22` : '0 0 0 transparent',
        transition: 'all 0.28s cubic-bezier(0.22,1,0.36,1)',
        cursor: hasCert ? 'pointer' : 'default',
        flex: '1 1 0',
      }}
    >
      {/* Icon ring */}
      <div style={{
        width: '64px', height: '64px', borderRadius: '50%',
        background: `${a.color}14`,
        border: `2px solid ${hovered ? a.color + '66' : a.color + '28'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 1.25rem',
        boxShadow: hovered ? `0 0 24px ${a.color}44` : 'none',
        transition: 'all 0.28s',
      }}>
        <Icon size={26} style={{ color: a.color }} />
      </div>
      <p style={{
        fontFamily: 'Sora, sans-serif', fontSize: '0.88rem',
        fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem',
        letterSpacing: '-0.01em',
      }}>
        {a.label}
      </p>
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '0.75rem',
        color: 'var(--text-muted)', lineHeight: 1.55,
      }}>
        {a.detail}
      </p>
      {hasCert && (
        <p style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem',
          color: a.color, marginTop: '0.75rem', opacity: hovered ? 1 : 0.75,
          letterSpacing: '0.04em',
        }}>
          🔍 View Certificate
        </p>
      )}
    </motion.div>
  )
}

// ─── Principles Selector ──────────────────────────────────────────────
function PrinciplesPanel({ inView }: { inView: boolean }) {
  const [active, setActive] = useState(0)
  const p = PRINCIPLES[active]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.42, duration: 0.5 }}
      className="principles-selector"
    >
      {/* Left: selector list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {PRINCIPLES.map((pr, i) => {
          const isActive = i === active
          const PrIcon = pr.Icon
          return (
            <button
              key={pr.num}
              onClick={() => setActive(i)}
              style={{
                background: isActive ? `${pr.accent}12` : 'transparent',
                border: `1.5px solid ${isActive ? pr.accent + '55' : 'var(--border)'}`,
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                textAlign: 'left', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.65rem',
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = `${pr.accent}40`
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
              }}
            >
              <div style={{
                width: '28px', height: '28px', borderRadius: '7px', flexShrink: 0,
                background: `${pr.accent}14`,
                border: `1px solid ${pr.accent}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <PrIcon size={13} style={{ color: pr.accent }} />
              </div>
              <div>
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem',
                  color: pr.accent, display: 'block', marginBottom: '1px',
                }}>
                  {pr.num}
                </span>
                <span style={{
                  fontFamily: 'Sora, sans-serif', fontSize: '0.75rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--text)' : 'var(--text-muted)',
                  lineHeight: 1.2, display: 'block',
                }}>
                  {pr.title}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Right: active principle panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'var(--surface)',
            border: `1.5px solid ${p.accent}40`,
            borderLeft: `3px solid ${p.accent}`,
            borderRadius: '16px',
            padding: '1.75rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', top: '-30px', right: '-30px',
            width: '160px', height: '160px', borderRadius: '50%',
            background: `radial-gradient(circle, ${p.accent}18 0%, transparent 65%)`,
            pointerEvents: 'none',
          }} />

          {/* Tag */}
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
            color: p.accent, background: `${p.accent}14`,
            border: `1px solid ${p.accent}28`, borderRadius: '50px',
            padding: '2px 9px', display: 'inline-block', marginBottom: '1.25rem',
            letterSpacing: '0.06em',
          }}>
            {p.tag}
          </span>

          {/* Icon */}
          <div style={{
            width: '52px', height: '52px', borderRadius: '12px',
            background: `${p.accent}14`, border: `1.5px solid ${p.accent}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1rem', boxShadow: `0 0 20px ${p.accent}22`,
          }}>
            <p.Icon size={24} style={{ color: p.accent }} />
          </div>

          <h4 style={{
            fontFamily: 'Sora, sans-serif', fontSize: '1rem',
            fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em',
            marginBottom: '0.75rem', lineHeight: 1.2,
          }}>
            {p.title}
          </h4>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.83rem',
            color: 'var(--text-muted)', lineHeight: 1.72,
          }}>
            {p.desc}
          </p>

          {/* Principle number watermark */}
          <span style={{
            position: 'absolute', bottom: '1rem', right: '1.25rem',
            fontFamily: 'Sora, sans-serif', fontSize: '3.5rem',
            fontWeight: 800, letterSpacing: '-0.06em',
            color: `${p.accent}0e`, pointerEvents: 'none', userSelect: 'none',
            lineHeight: 1,
          }}>
            {p.num}
          </span>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────
export default function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [openCert, setOpenCert] = useState<string | null>(null)

  useEffect(() => {
    if (!openCert) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenCert(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openCert])

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  })

  return (
    <section id="experience" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section-wrap" ref={ref}>

        {/* Header */}
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
        <motion.div {...fadeUp(0.1)} style={{ marginBottom: '3.25rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'stretch' }}>
            {/* Timeline rail */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <motion.div
                animate={inView ? { scale: [0, 1.3, 1], opacity: [0, 1, 1] } : {}}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#22c55e', flexShrink: 0, marginTop: '4px', boxShadow: '0 0 10px #22c55e55' }}
              />
              <motion.div
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
                style={{ width: '1.5px', flex: 1, background: 'linear-gradient(to bottom, #22c55e66, var(--border-2))', marginTop: '6px', minHeight: '40px', transformOrigin: 'top' }}
              />
            </div>

            {/* Card */}
            <div style={{
              flex: 1,
              background: 'var(--surface)',
              border: '1.5px solid var(--border)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}>
              {/* Card header */}
              <div style={{
                padding: '1.25rem 1.75rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
                justifyContent: 'space-between', alignItems: 'flex-start',
                background: 'rgba(34,197,94,0.03)',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.3rem' }}>
                    <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)' }}>
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
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    SoundRich Hearing Clinic · Delhi NCR
                  </p>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-faint)', whiteSpace: 'nowrap', paddingTop: '3px' }}>
                  Mar 2026 – May 2026
                </span>
              </div>

              {/* Metric chips */}
              <div style={{ padding: '1rem 1.75rem', borderBottom: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                {METRICS.map(m => (
                  <div key={m.label} style={{
                    background: 'var(--surface-2)', border: '1.5px solid var(--border-2)',
                    borderRadius: '10px', padding: '0.6rem 1.1rem',
                    display: 'flex', flexDirection: 'column', gap: '2px',
                  }}>
                    <span style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text)' }}>
                      {m.value}
                    </span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.67rem', color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bullets */}
              <div style={{ padding: '0.5rem 0' }}>
                {BULLETS.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.35 + i * 0.1, duration: 0.4 }}
                    style={{
                      padding: '0.8rem 1.75rem',
                      display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
                      borderBottom: i < BULLETS.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <span style={{ color: '#22c55e', flexShrink: 0, marginTop: '5px', fontSize: '0.6rem' }}>▸</span>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                      {b}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Honors & Awards — 3 hackathon-finalist certificates ── */}
        <motion.div {...fadeUp(0.22)} style={{ marginBottom: '2.25rem' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.1rem' }}>
            Honors &amp; Awards
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {HONORS.map((a, i) => (
              <AchievementCard key={a.label} a={a} delay={0.3 + i * 0.08} inView={inView} onOpenCertificate={setOpenCert} />
            ))}
          </div>
        </motion.div>

        {/* ── Certifications — 4 verified credentials ── */}
        <motion.div {...fadeUp(0.28)} style={{ marginBottom: '3.25rem' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.1rem' }}>
            Certifications
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {CERTIFICATIONS.map((a, i) => (
              <AchievementCard key={a.label} a={a} delay={0.34 + i * 0.06} inView={inView} />
            ))}
          </div>
        </motion.div>

        {/* ── Engineering Principles — interactive selector ── */}
        <div>
          <motion.p
            {...fadeUp(0.38)}
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: 'var(--text-faint)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.1rem' }}
          >
            Engineering Principles
          </motion.p>
          <PrinciplesPanel inView={inView} />
        </div>

        {/* Certificate lightbox — always mounted, one per honor, visibility toggled */}
        {HONORS.map(h => (
          <div
            key={h.certificate}
            role="dialog"
            aria-modal="true"
            aria-hidden={openCert !== h.certificate}
            aria-label={`${h.label} certificate`}
            onClick={() => setOpenCert(null)}
            style={{
              display: openCert === h.certificate ? 'flex' : 'none',
              position: 'fixed', inset: 0, zIndex: 300,
              alignItems: 'center', justifyContent: 'center',
              padding: '2rem',
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                position: 'relative', maxWidth: '900px', maxHeight: '88vh',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              }}
            >
              <img
                src={h.certificate}
                alt={`${h.label} certificate of participation`}
                style={{
                  maxWidth: '100%', maxHeight: '88vh', width: 'auto', height: 'auto',
                  borderRadius: '10px', boxShadow: '0 24px 64px rgba(0,0,0,0.5)', display: 'block',
                  objectFit: 'contain',
                }}
              />
              <button
                onClick={() => setOpenCert(null)}
                aria-label="Close"
                style={{
                  position: 'absolute', top: '12px', right: '12px',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(20,20,20,0.75)', border: '1.5px solid rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', backdropFilter: 'blur(4px)',
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}

      </div>
    </section>
  )
}
