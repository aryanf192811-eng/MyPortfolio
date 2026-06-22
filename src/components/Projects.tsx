import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { getTechColor } from '../lib/techColors'
import { BCartVisual, ExamForgeVisual, TraveloopVisual } from './ProjectVisuals'

interface ProjectLink {
  label: string
  href: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface Project {
  title: string
  tagline: string
  description: string
  impact: string[]
  stack: string[]
  links: ProjectLink[]
  accent: string
  letter: string
  badge?: string
}

const PROJECTS: Project[] = [
  {
    title: 'B-Cart',
    tagline: 'Manufacturing ERP — Order-to-Stock Workflow Engine',
    description:
      'ERP-style business workflow system that tracks the complete order lifecycle from Sales Order through Inventory Reservation, Manufacturing Order, Work Orders, and into an immutable Stock Ledger. Built schema-first with a 22-table relational model.',
    impact: [
      '22-table PostgreSQL schema across 8 domains — 4 database views, normalized relational model',
      'Event-driven stock ledger: every movement is immutable and the full history is reconstructable',
      'JWT Access + Refresh token pair + RBAC enforced at the controller layer on every request',
      '30+ REST endpoints — Moving Average Costing aligned with real manufacturing accounting',
    ],
    stack: ['Node.js', 'Express', 'PostgreSQL', 'React 19', 'Vite', 'JWT', 'RBAC', 'Raw SQL'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aryanf192811-eng/B-cart', icon: <Github size={14} /> },
    ],
    accent: '#3b82f6',
    letter: 'BC',
  },
  {
    title: 'ExamForge',
    tagline: 'Enterprise GATE Preparation Platform — Hybrid Database Architecture',
    description:
      'Monorepo GATE prep platform solving a dual access-pattern problem: read-heavy offline question access (SQLite) and write-heavy real-time cross-device sync (Supabase). KaTeX renders engineering formulas; strict TypeScript prevents silent runtime errors in complex quiz state.',
    impact: [
      'Hybrid SQLite + Supabase architecture — each DB optimised for its specific workload',
      'SQLite bundles thousands of GATE questions read-only; sub-millisecond, zero network overhead',
      'Supabase real-time subscriptions sync quiz progress and streaks across all devices live',
      'FastAPI backend with Pydantic schemas, Bearer JWT auth, and GitHub Actions CI/CD pipeline',
    ],
    stack: ['FastAPI', 'Pydantic', 'SQLite', 'Supabase', 'React 19', 'TypeScript', 'KaTeX', 'Firebase', 'Vite'],
    links: [
      { label: 'Frontend', href: 'https://github.com/aryanf192811-eng/examforgee', icon: <Github size={14} /> },
      { label: 'Backend', href: 'https://github.com/aryanf192811-eng/examforge-backend', icon: <Github size={14} /> },
    ],
    accent: '#22c55e',
    letter: 'EF',
  },
  {
    title: 'Traveloop',
    tagline: 'Trip Lifecycle Management — AI + PDF Pipeline',
    description:
      'Full-stack trip planning system connecting the entire lifecycle: itinerary, budget tracking, AI packing lists, and PDF invoice generation. 11-table PostgreSQL schema with 25 seeded cities and 57+ activity mappings. Built as a hackathon finalist in 36 hours.',
    impact: [
      '30+ endpoints across 9 Express route modules — consistent {success, data, meta} API envelope',
      'Gemini AI packing lists with offline fallback — core trip management works without any API key',
      'Server-side PDF invoice streaming via PDFKit; no client-side library weight',
      '🥇 Final Round — Odoo × Parul University Hackathon 2026',
    ],
    stack: ['React 19', 'Node.js', 'Express', 'PostgreSQL', 'Gemini AI', 'PDFKit', 'Recharts', 'JWT', 'Multer'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aryanf192811-eng/Pizza-Traveloop', icon: <Github size={14} /> },
    ],
    accent: '#f59e0b',
    letter: 'TL',
    badge: 'Hackathon Finalist',
  },
]

const VISUAL_MAP: Record<string, React.ReactNode> = {
  'B-Cart':    <BCartVisual />,
  'ExamForge': <ExamForgeVisual />,
  'Traveloop': <TraveloopVisual />,
}

function ProjectVisual({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2
    setTilt({ x: ny * -10, y: nx * 10 })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        background: 'var(--surface)',
        border: `1.5px solid ${project.accent}30`,
        borderRadius: '18px',
        aspectRatio: '4/3',
        position: 'relative',
        overflow: 'hidden',
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.12s ease, box-shadow 0.2s',
        boxShadow: tilt.x !== 0 ? `0 20px 50px ${project.accent}22` : 'none',
        cursor: 'default',
      }}
    >
      {VISUAL_MAP[project.title] ?? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <span style={{ fontFamily: 'Sora, sans-serif', fontSize: '4rem', fontWeight: 800, color: 'transparent', WebkitTextStroke: `2px ${project.accent}`, opacity: 0.6 }}>
            {project.letter}
          </span>
        </div>
      )}
      {/* Badge overlay */}
      {project.badge && (
        <div style={{
          position: 'absolute', top: '0.85rem', right: '0.85rem',
          fontFamily: 'Sora, sans-serif', fontSize: '0.58rem', fontWeight: 700,
          color: project.accent, background: `${project.accent}18`,
          border: `1px solid ${project.accent}30`, borderRadius: '50px', padding: '3px 9px',
          zIndex: 10,
        }}>
          {project.badge}
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="project-row"
    >
      {/* Text */}
      <div style={{ order: isEven ? 0 : 1 }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.66rem', color: project.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.6rem', opacity: 0.9 }}>
          {`Project 0${index + 1}`}
        </p>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.4rem, 2.8vw, 1.85rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.35rem', color: 'var(--text)' }}>
          {project.title}
        </h3>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '0.85rem', lineHeight: 1.5 }}>
          {project.tagline}
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.72, marginBottom: '1.1rem' }}>
          {project.description}
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.4rem', listStyle: 'none' }}>
          {project.impact.map(d => (
            <li key={d} style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start', fontFamily: 'Inter, sans-serif', fontSize: '0.845rem', color: 'var(--text-faint)', lineHeight: 1.6 }}>
              <span style={{ color: project.accent, flexShrink: 0, marginTop: '4px', fontSize: '0.65rem' }}>▸</span>
              {d}
            </li>
          ))}
        </ul>
        {/* Colored tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
          {project.stack.map(t => {
            const color = getTechColor(t)
            return (
              <span key={t} style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.67rem', fontWeight: 500,
                color, background: `${color}14`, border: `1px solid ${color}30`,
                borderRadius: '5px', padding: '3px 9px', whiteSpace: 'nowrap',
              }}>
                {t}
              </span>
            )
          })}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
          {project.links.map(link =>
            link.disabled ? (
              <span key={link.label} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontFamily: 'Sora, sans-serif', fontSize: '0.78rem', fontWeight: 500,
                color: 'var(--text-faint)', border: '1.5px solid var(--border)', borderRadius: '50px',
                padding: '6px 16px', cursor: 'not-allowed', opacity: 0.55,
              }}>
                {link.icon}{link.label}
              </span>
            ) : (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  fontFamily: 'Sora, sans-serif', fontSize: '0.78rem', fontWeight: 600,
                  color: 'var(--text)', background: 'var(--surface)',
                  border: '1.5px solid var(--border-2)', borderRadius: '50px',
                  padding: '6px 16px', textDecoration: 'none',
                  transition: 'border-color 0.18s, background 0.18s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = project.accent
                  el.style.background = `${project.accent}12`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'var(--border-2)'
                  el.style.background = 'var(--surface)'
                }}
              >
                {link.icon} {link.label} <ExternalLink size={11} style={{ opacity: 0.6 }} />
              </a>
            )
          )}
        </div>
      </div>

      {/* Visual */}
      <div
        className={!isEven ? 'project-visual-reversed' : ''}
        style={{ order: isEven ? 1 : 0 }}
      >
        <ProjectVisual project={project} />
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="projects" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section-wrap">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '4rem' }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-faint)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.55rem' }}>
            what I&apos;ve shipped
          </p>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text)' }}>
            My{' '}<span style={{ WebkitTextStroke: '2px var(--text)', color: 'transparent' }}>Projects</span>
          </h2>
        </motion.div>

        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}
