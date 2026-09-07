import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink, Github, X } from 'lucide-react'
import { getTechColor } from '../lib/techColors'
import {
  BCartVisual, ExamForgeVisual, TraveloopVisual, LatentVisual,
  NeetNotesVisual, SoundrichVisual, HRMSVisual, GateTrackVisual,
  FullStackVisual, CPPVisual, LEVOVisual, RecallVisual,
  CodeVerterVisual, PeoplePay360Visual,
} from './ProjectVisuals'
import AarakshaFlagship from './AarakshaFlagship'

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
    title: 'Latent',
    tagline: 'The Next-Generation Campus Social Network',
    description:
      'A high-performance, full-stack digital environment designed exclusively for university students. It bridges the gap between academics, social interaction, and campus utility by providing a unified platform.',
    impact: [
      'Global UI state handled via Zustand; asynchronous server state managed by React Query',
      'Strictly partitioned, loosely-coupled client-server architecture using Node.js and Express',
      'Stateless JWT-based auth, bcrypt hashing, and robust connection pooling with PostgreSQL',
      'Engineered with a stunning glassmorphic aesthetic (Lumina Theme) using Tailwind and Framer Motion',
    ],
    stack: ['React 19', 'Node.js', 'Express', 'PostgreSQL', 'Zustand', 'React Query', 'Tailwind CSS', 'Framer Motion'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aryanf192811-eng/latent', icon: <Github size={14} /> },
      { label: 'Demo', href: 'https://drive.google.com/file/d/1ch8jEU1LbNl-YH6gKiY0ZaU6G7j_l7yL/view?usp=sharing', icon: <ExternalLink size={14} /> },
    ],
    accent: '#8b5cf6',
    letter: 'LA',
  },
  {
    title: 'LEVO',
    tagline: 'Smart Transport Operations Platform — Production-Grade Fleet & Logistics',
    description:
      'Production-grade fleet, driver, and logistics operations management built for scale. A 9-rule atomic dispatch engine prevents race conditions at trip creation, AI-powered Grok weather risk assessment monitors every active trip hourly, and auto-maintenance events fire atomically on trip completion.',
    impact: [
      '40+ REST endpoints across 9 Express routers — Prisma ORM with 11 PostgreSQL models & 6 enums',
      'Atomic prisma.$transaction enforces 9 strict business rules — zero race-condition dispatches',
      'RBAC across 4 roles (Fleet Manager, Dispatcher, Safety Officer, Financial Analyst) on every route',
      'Grok xAI + OpenWeather integration — node-cron hourly reassessment of live active trips',
    ],
    stack: ['Node.js', 'Express', 'TypeScript', 'Prisma', 'PostgreSQL', 'React 18', 'Zustand', 'TanStack Query', 'Tailwind CSS', 'Recharts', 'node-cron', 'PDFKit'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aryanf192811-eng/LEVO', icon: <Github size={14} /> },
    ],
    accent: '#f97316',
    letter: 'LV',
  },
  {
    title: 'PeoplePay360',
    tagline: 'Odoo Hackathon 2026 Finalist — Explainable HR & Payroll Engine',
    description:
      'HR & Payroll platform built for Odoo Hackathon 2026 — advanced from 20,000+ registrations to the onsite finale at Odoo India HQ, ranking Top 50 of 857 finalist teams. The Employee record is the hub everything hangs off: period-scoped contracts never edited in place, a two-step Payrun wizard, and a live dashboard aggregating real attendance, leave, and payslip data.',
    impact: [
      'Raw PERN stack (Postgres + Express + React + Node), zero ORM — a Postgres exclusion constraint guarantees no two overlapping active contracts per employee, not app-level hope',
      'Payslip Diff ("why did my salary change?") and a What-If Simulator that dry-runs the real payroll engine and unconditionally rolls back',
      'Statistical Attendance/Leave Insights using a real population mean + stddev, not a hardcoded threshold, plus a full Audit Timeline over every contract/payrun change',
      'Read-only Gemini-backed AI assistant scoped strictly to the same aggregate JSON the dashboard already shows — never a black box making decisions',
    ],
    stack: ['Node.js', 'Express', 'PostgreSQL', 'React 18', 'TanStack Query', 'Zustand', 'JWT', 'Gemini AI'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aryanf192811-eng/pay360', icon: <Github size={14} /> },
    ],
    accent: '#714b67',
    letter: 'P3',
    badge: 'Hackathon Finalist',
  },
  {
    title: 'CodeVerter',
    tagline: 'Local-First AI Code Converter — 26 Languages, Zero Cloud',
    description:
      'Converts code between 26 programming languages using a 100% locally-running LLM (Ollama) — no cloud API, no API keys, no telemetry. Started as an AWS Lambda function with a hardcoded API key committed to source; rebuilt from the ground up so nothing leaves the machine by default.',
    impact: [
      'Self-contained C++17 HTTP server (cpp-httplib) vendoring its only two dependencies as single headers — no package manager, no OpenSSL required',
      'Token-by-token streaming output over SSE, plus a second local LLM call rating time/space complexity with severity-colored Big-O badges',
      '"Run & Compare" actually executes both the source and converted code locally and diffs the real output — real evidence of correctness, not just plausible-looking code',
      'Optional, off-by-default Groq cloud fallback triggers only if Ollama is unreachable, with a visible banner whenever a conversion leaves the machine',
    ],
    stack: ['C++', 'Ollama', 'React', 'TypeScript', 'Vite', 'CMake'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aryanf192811-eng/codeverter', icon: <Github size={14} /> },
    ],
    accent: '#14b8a6',
    letter: 'CV',
  },
]

interface MiniProject {
  title: string
  tagline: string
  description: string
  stack: string[]
  links: { label: string; href: string }[]
  accent: string
  visual: React.ReactNode
}

const MINI_PROJECTS: MiniProject[] = [
  {
    title: 'Traveloop',
    tagline: 'Trip Lifecycle Management · Odoo × Parul Hackathon 2026 Finalist',
    description:
      'Full-stack trip planning system connecting the entire lifecycle: itinerary, budget tracking, AI packing lists, and PDF invoice generation. 11-table PostgreSQL schema with 25 seeded cities. Built as a hackathon finalist in 36 hours.',
    stack: ['React 19', 'Node.js', 'Express', 'PostgreSQL', 'Gemini AI', 'PDFKit'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aryanf192811-eng/Pizza-Traveloop' },
    ],
    accent: '#f59e0b',
    visual: <TraveloopVisual />,
  },
  {
    title: 'Recall',
    tagline: 'Civic Journalism Platform · Permanent Public Incident Archive',
    description:
      'A cinematic interactive journalism platform combining the permanence of a legal archive with documentary storytelling. Features a D3.js causality force graph mapping every incident to its causes and consequences, scrollytelling editions, verified contributor tiers, and annotated legal documents — built for lawyers, journalists, and citizens.',
    stack: ['React 18', 'TypeScript', 'D3.js', 'Tailwind CSS', 'Vite', 'PostgreSQL', 'Prisma', 'Sanity.io'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aryanf192811-eng/Recall' },
    ],
    accent: '#dc2626',
    visual: <RecallVisual />,
  },
  {
    title: 'NEET Notes',
    tagline: 'Offline-first PWA · Physical Chemistry Notes',
    description:
      'A Progressive Web App that bundles curated Physical Chemistry notes for NEET (Class 11 & 12) with offline access via service worker. Installable on mobile with a full manifest, zero backend.',
    stack: ['HTML', 'CSS', 'JavaScript', 'PWA', 'Service Worker'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aryanf192811-eng/neet-notes' },
      { label: 'Live', href: 'https://neet-notes-vert.vercel.app/' }
    ],
    accent: '#a78bfa',
    visual: <NeetNotesVisual />,
  },
  {
    title: 'Soundrich Hearing',
    tagline: 'Client Demo · Premium Hearing Clinic Frontend',
    description:
      'High-fidelity frontend demo built for Soundrich Hearing — a real hearing care clinic. Features liquid morphism UI, skeleton loaders, animated soundwave visualizer, clinic location cards, and a WhatsApp booking CTA.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aryanf192811-eng/soundrichhearingdemo' },
      { label: 'Live', href: 'https://soundrichhearingdemo.vercel.app/' }
    ],
    accent: '#06b6d4',
    visual: <SoundrichVisual />,
  },
  {
    title: 'HRMS',
    tagline: 'HR Management System · Figma-to-Code',
    description:
      'A pixel-perfect, fully functional HR Management System UI translated directly from a professional Figma design. Tracks employees, departments, and attendance with animated stat cards and bar charts.',
    stack: ['TypeScript', 'Vite', 'Tailwind CSS'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aryanf192811-eng/HRMS' },
      { label: 'Live', href: 'https://hrms69.vercel.app/dashboard' }
    ],
    accent: '#f472b6',
    visual: <HRMSVisual />,
  },
  {
    title: 'GateTrack',
    tagline: 'GATE CSE 2028 · Study Progress Tracker PWA',
    description:
      'A cross-device study tracker built for GATE CSE 2028 preparation. Real-time sync across devices via Supabase, offline-capable PWA, MathJax-rendered formulas, and per-subject progress bars.',
    stack: ['Python', 'JavaScript', 'Supabase', 'MathJax', 'PWA'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aryanf192811-eng/gatetrack' },
      { label: 'Live', href: 'https://gatetrack-529tmpovh-aryans-projects-540bef68.vercel.app/' }
    ],
    accent: '#34d399',
    visual: <GateTrackVisual />,
  },
  {
    title: 'Full-Stack Hub',
    tagline: 'Glassmorphic Curriculum & Notes Platform',
    description:
      'A personal, premium study system documenting full-stack engineering across 6 phases. Features a unified glassmorphic design system, persistent dark mode, bookmarking, and custom dev-tooling to build 45+ standalone notes.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aryanf192811-eng/full-stack' },
      { label: 'Live', href: 'https://full-stack-five-jade.vercel.app/' }
    ],
    accent: '#ef4444',
    visual: <FullStackVisual />,
  },
  {
    title: 'C++ Mastery',
    tagline: 'Theory, DSA & Logic Building Vault',
    description:
      'A comprehensive repository covering C++ fundamentals to advanced Data Structures and Algorithms. Focuses on logic building, memory management, OOPs, and LeetCode problem-solving approaches.',
    stack: ['C++'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aryanf192811-eng/CPP' },
      { label: 'Live', href: 'https://cpp-tau.vercel.app/' }
    ],
    accent: '#00599C',
    visual: <CPPVisual />,
  },
  {
    title: 'B-Cart',
    tagline: 'Manufacturing ERP · Order-to-Stock Workflow Engine',
    description:
      'ERP-style workflow system tracking the complete order lifecycle — Sales Order through Inventory Reservation, Manufacturing Order, Work Orders, into an immutable Stock Ledger. Schema-first with a 22-table relational model across 8 business domains and Moving Average Costing.',
    stack: ['Node.js', 'Express', 'PostgreSQL', 'React 19', 'JWT', 'RBAC'],
    links: [
      { label: 'GitHub', href: 'https://github.com/aryanf192811-eng/B-cart' },
    ],
    accent: '#3b82f6',
    visual: <BCartVisual />,
  },
  {
    title: 'ExamForge',
    tagline: 'GATE Preparation Platform · Hybrid Database Architecture',
    description:
      'Monorepo GATE prep platform solving a dual access-pattern problem: read-heavy offline question access (SQLite) and write-heavy real-time cross-device sync (Supabase). KaTeX renders engineering formulas; FastAPI backend with strict Pydantic validation.',
    stack: ['FastAPI', 'Pydantic', 'SQLite', 'Supabase', 'React 19', 'KaTeX'],
    links: [
      { label: 'Frontend', href: 'https://github.com/aryanf192811-eng/examforgee' },
      { label: 'Backend', href: 'https://github.com/aryanf192811-eng/examforge-backend' },
    ],
    accent: '#22c55e',
    visual: <ExamForgeVisual />,
  },
]

const VISUAL_MAP: Record<string, React.ReactNode> = {
  'Latent':       <LatentVisual />,
  'LEVO':         <LEVOVisual />,
  'PeoplePay360': <PeoplePay360Visual />,
  'CodeVerter':   <CodeVerterVisual />,
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

function ProjectLinks({ project }: { project: Project }) {
  return (
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
  )
}

// Compact grid card — click opens the full case-study modal below.
function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: (title: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(project.title)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(project.title) } }}
      style={{
        background: 'var(--surface)',
        border: `1.5px solid ${project.accent}28`,
        borderRadius: '18px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${project.accent}66`
        e.currentTarget.style.boxShadow = `0 16px 40px ${project.accent}1c`
        e.currentTarget.style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = `${project.accent}28`
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <ProjectVisual project={project} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flexGrow: 1 }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', color: project.accent, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.9 }}>
          {`Project 0${index + 1}`}
        </p>
        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text)', margin: 0 }}>
          {project.title}
        </h3>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0, lineHeight: 1.5, flexGrow: 1 }}>
          {project.tagline}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
          {project.stack.slice(0, 4).map(t => {
            const color = getTechColor(t)
            return (
              <span key={t} style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.63rem', fontWeight: 500,
                color, background: `${color}14`, border: `1px solid ${color}30`,
                borderRadius: '5px', padding: '2px 8px', whiteSpace: 'nowrap',
              }}>
                {t}
              </span>
            )
          })}
        </div>
        <span style={{
          fontFamily: 'Sora, sans-serif', fontSize: '0.78rem', fontWeight: 700,
          color: project.accent, marginTop: '0.5rem',
        }}>
          View case study →
        </span>
      </div>
    </motion.div>
  )
}

// Full case-study detail — always rendered for every project (SEO: full text stays in the
// prerendered/crawled HTML), visibility toggled via CSS rather than mount/unmount.
function ProjectModal({ project, isOpen, onClose }: { project: Project; isOpen: boolean; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label={`${project.title} case study`}
      onClick={onClose}
      style={{
        display: isOpen ? 'flex' : 'none',
        position: 'fixed', inset: 0, zIndex: 300,
        alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)', border: '1.5px solid var(--border-2)',
          borderRadius: '20px', maxWidth: '760px', width: '100%', maxHeight: '85vh',
          overflowY: 'auto', padding: 'clamp(1.5rem, 4vw, 2.5rem)', position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'var(--surface-2)', border: '1.5px solid var(--border-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)',
          }}
        >
          <X size={16} />
        </button>

        <div style={{ maxWidth: '480px', marginBottom: '1.5rem' }}>
          <ProjectVisual project={project} />
        </div>

        <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.5rem, 4vw, 1.9rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.35rem', color: 'var(--text)' }}>
          {project.title}
        </h3>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: project.accent, fontStyle: 'italic', marginBottom: '1rem', lineHeight: 1.5 }}>
          {project.tagline}
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.72, marginBottom: '1.1rem' }}>
          {project.description}
        </p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.4rem', listStyle: 'none' }}>
          {project.impact.map(d => (
            <li key={d} style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'var(--text-faint)', lineHeight: 1.6 }}>
              <span style={{ color: project.accent, flexShrink: 0, marginTop: '4px', fontSize: '0.65rem' }}>▸</span>
              {d}
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
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
        <ProjectLinks project={project} />
      </div>
    </div>
  )
}

function MiniProjectCard({ project, index }: { project: MiniProject; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2
    setTilt({ x: ny * -6, y: nx * 6 })
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'var(--surface)',
        border: `1.5px solid ${project.accent}28`,
        borderRadius: '18px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${project.accent}66`
        e.currentTarget.style.boxShadow = `0 12px 40px ${project.accent}18`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = `${project.accent}28`
        e.currentTarget.style.boxShadow = 'none'
        setTilt({ x: 0, y: 0 })
      }}
    >
      {/* SVG visual panel — interactive on hover, with tilt */}
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{
          background: 'var(--surface)',
          borderBottom: `1px solid ${project.accent}20`,
          aspectRatio: '16/9',
          position: 'relative',
          overflow: 'hidden',
          transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.12s ease',
        }}
      >
        {project.visual}
      </div>

      {/* Text body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1 }}>
        {/* Title + tagline */}
        <div>
          <h3 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 0.2rem' }}>
            {project.title}
          </h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.76rem', color: project.accent, fontStyle: 'italic', margin: 0, opacity: 0.85 }}>
            {project.tagline}
          </p>
        </div>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0, flexGrow: 1 }}>
          {project.description}
        </p>

        {/* Tech stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {project.stack.map(t => {
            const color = getTechColor(t)
            return (
              <span key={t} style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', fontWeight: 500,
                color, background: `${color}14`, border: `1px solid ${color}30`,
                borderRadius: '5px', padding: '2px 8px', whiteSpace: 'nowrap',
              }}>
                {t}
              </span>
            )
          })}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.25rem' }}>
          {project.links.map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                fontFamily: 'Sora, sans-serif', fontSize: '0.78rem', fontWeight: 600,
                color: 'var(--text)', background: 'var(--surface)',
                border: `1.5px solid ${project.accent}44`, borderRadius: '50px',
                padding: '5px 14px', textDecoration: 'none',
                transition: 'border-color 0.18s, background 0.18s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = project.accent
                e.currentTarget.style.background = `${project.accent}12`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = `${project.accent}44`
                e.currentTarget.style.background = 'var(--surface)'
              }}
            >
              {link.label === 'GitHub' ? <Github size={13} /> : <ExternalLink size={13} />} {link.label} {link.label === 'GitHub' && <ExternalLink size={10} style={{ opacity: 0.6 }} />}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activeTab, setActiveTab] = useState<'major' | 'mini'>('major')
  const [openProject, setOpenProject] = useState<string | null>(null)

  useEffect(() => {
    if (!openProject) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenProject(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openProject])

  return (
    <section id="projects" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section-wrap">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}
        >
          <div>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-faint)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.55rem' }}>
              what I&apos;ve shipped
            </p>
            <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text)' }}>
              My{' '}<span style={{ WebkitTextStroke: '2px var(--text)', color: 'transparent' }}>Projects</span>
            </h2>
          </div>

          {/* Toggle */}
          <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border-2)', borderRadius: '50px', padding: '0.3rem' }}>
            <button
              onClick={() => setActiveTab('major')}
              style={{
                background: activeTab === 'major' ? 'var(--text)' : 'transparent',
                color: activeTab === 'major' ? 'var(--bg)' : 'var(--text-muted)',
                border: 'none', borderRadius: '50px', padding: '0.4rem 1.2rem',
                fontFamily: 'Sora, sans-serif', fontSize: '0.85rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              Major
            </button>
            <button
              onClick={() => setActiveTab('mini')}
              style={{
                background: activeTab === 'mini' ? 'var(--text)' : 'transparent',
                color: activeTab === 'mini' ? 'var(--bg)' : 'var(--text-muted)',
                border: 'none', borderRadius: '50px', padding: '0.4rem 1.2rem',
                fontFamily: 'Sora, sans-serif', fontSize: '0.85rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              Mini
            </button>
          </div>
        </motion.div>

        {/* Both tabs stay mounted (not a mount/unmount ternary) so the mini-projects'
            content is present in the prerendered/crawled HTML, not just after a client click. */}
        <div style={{ display: activeTab === 'major' ? 'block' : 'none' }}>
          <AarakshaFlagship />
          <div className="major-grid">
            {PROJECTS.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} onOpen={setOpenProject} />
            ))}
          </div>
        </div>
        <div
          style={{
            display: activeTab === 'mini' ? 'grid' : 'none',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '2rem',
          }}
        >
          {MINI_PROJECTS.map((project, i) => (
            <MiniProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        {/* Case-study modals — one per project, always mounted, visibility-toggled */}
        {PROJECTS.map(project => (
          <ProjectModal
            key={project.title}
            project={project}
            isOpen={openProject === project.title}
            onClose={() => setOpenProject(null)}
          />
        ))}
      </div>
    </section>
  )
}
