import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Decision { decision: string; reasoning: string }
interface ArchNode  { label: string }

export interface ProjectData {
  index: string
  title: string
  subtitle: string
  problem: string
  archNodes: ArchNode[]
  facts: string[]
  decisions: Decision[]
  stack: string[]
  links: { label: string; href: string; disabled?: boolean }[]
  achievement?: string
  accentColor?: string
}

function ArchFlow({ nodes, accent }: { nodes: ArchNode[]; accent: string }) {
  const boxW = 120, boxH = 38, gap = 36
  const svgW = nodes.length * boxW + (nodes.length - 1) * gap
  const uid = nodes[0]?.label ?? 'default'

  return (
    <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
      <svg
        viewBox={`0 0 ${svgW} 58`}
        style={{ width: '100%', minWidth: `${svgW}px`, height: '58px', display: 'block' }}
        aria-label="Architecture flow diagram"
      >
        <defs>
          <marker id={`arr-${uid}`} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill={accent} />
          </marker>
        </defs>
        {nodes.map((node, i) => {
          const x = i * (boxW + gap)
          return (
            <g key={node.label}>
              <rect x={x} y={10} width={boxW} height={boxH} fill="#0E1628" stroke={accent} strokeWidth="1" rx="2" />
              <text
                x={x + boxW / 2} y={10 + boxH / 2 + 4}
                textAnchor="middle"
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9.5px', fill: '#E2EAFD' }}
              >
                {node.label}
              </text>
              {i < nodes.length - 1 && (
                <line
                  x1={x + boxW} y1={29}
                  x2={x + boxW + gap - 2} y2={29}
                  stroke={accent} strokeWidth="1.5"
                  markerEnd={`url(#arr-${uid})`}
                />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function Tag({ label }: { label: string }) {
  return (
    <span style={{
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.69rem',
      fontWeight: 500,
      color: '#F59E0B',
      background: 'rgba(79,131,255,0.07)',
      border: '1px solid rgba(79,131,255,0.18)',
      borderRadius: '3px',
      padding: '3px 8px',
      letterSpacing: '0.04em',
    }}>
      {label}
    </span>
  )
}

export default function ProjectCard({ project }: { project: ProjectData }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const accent = project.accentColor ?? '#4F83FF'

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        marginBottom: '5rem',
        background: '#0E1628',
        border: '1px solid #1A2744',
        borderLeft: `3px solid ${accent}`,
        borderRadius: '0 6px 6px 0',
        overflow: 'hidden',
        boxShadow: `0 4px 40px rgba(0,0,0,0.35), 0 0 0 0 ${accent}33`,
        transition: 'box-shadow 0.25s',
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = `0 8px 60px rgba(0,0,0,0.5), 0 0 30px ${accent}18`)}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = `0 4px 40px rgba(0,0,0,0.35), 0 0 0 0 ${accent}33`)}
    >
      {/* Card header */}
      <div style={{ padding: '1.75rem 2rem 1.25rem', borderBottom: '1px solid #1A2744' }}>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem', opacity: 0.75 }}>
          // project_{project.index}
        </p>
        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 700, color: '#E2EAFD', letterSpacing: '-0.02em', marginBottom: '0.3rem' }}>
          {project.title}
        </h3>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#6B84AA', fontStyle: 'italic' }}>
          {project.subtitle}
        </p>
      </div>

      <div style={{ padding: '1.75rem 2rem' }}>
        {/* Problem */}
        <div style={{ padding: '1rem 1.25rem', borderLeft: `3px solid ${accent}55`, background: '#0A1020', borderRadius: '0 4px 4px 0', marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: accent, marginBottom: '0.375rem', letterSpacing: '0.07em' }}>
            // problem
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', color: '#8BA5CC', lineHeight: 1.7 }}>
            {project.problem}
          </p>
        </div>

        {/* Arch flow */}
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: '#6B84AA', letterSpacing: '0.07em', marginBottom: '0.875rem' }}>
          -- architecture_flow
        </p>
        <ArchFlow nodes={project.archNodes} accent={accent} />

        {/* Facts */}
        <div style={{ border: '1px solid #1A2744', borderRadius: '4px', marginBottom: '2rem', overflow: 'hidden' }}>
          <div style={{ background: '#0A1020', padding: '0.6rem 1rem', borderBottom: '1px solid #1A2744' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              key facts
            </span>
          </div>
          {project.facts.map((f, i) => (
            <div key={i} style={{
              padding: '0.75rem 1rem',
              borderBottom: i < project.facts.length - 1 ? '1px solid #1A2744' : 'none',
              background: i % 2 === 0 ? '#0E1628' : '#0A1020',
              fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#6B84AA', lineHeight: 1.55,
            }}>
              {f}
            </div>
          ))}
        </div>

        {/* Decisions */}
        <div style={{ border: '1px solid #1A2744', borderRadius: '4px', marginBottom: '2rem', overflow: 'hidden' }}>
          <div className="decisions-row" style={{ background: '#0A1020', borderBottom: '1px solid #1A2744' }}>
            {['-- decision', 'reasoning'].map((h, i) => (
              <div key={h} style={{ padding: '0.6rem 1rem', borderLeft: i > 0 ? '1px solid #1A2744' : 'none' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', color: accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</span>
              </div>
            ))}
          </div>
          {project.decisions.map((d, i) => (
            <div key={d.decision} className="decisions-row" style={{
              background: i % 2 === 0 ? '#0E1628' : '#0A1020',
              borderBottom: i < project.decisions.length - 1 ? '1px solid #1A2744' : 'none',
            }}>
              <div style={{ padding: '0.875rem 1rem' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', fontWeight: 500, color: accent }}>
                  {d.decision}
                </span>
              </div>
              <div style={{ padding: '0.875rem 1rem', borderLeft: '1px solid #1A2744' }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#6B84AA', lineHeight: 1.6 }}>
                  {d.reasoning}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stack + links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {project.stack.map(s => <Tag key={s} label={s} />)}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {project.links.map(link =>
            link.disabled ? (
              <span key={link.label} style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem',
                color: '#6B84AA', border: '1px solid #1A2744', borderRadius: '3px',
                padding: '7px 14px', opacity: 0.55, cursor: 'not-allowed',
              }}>
                {link.label}
              </span>
            ) : (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', fontWeight: 500,
                  color: accent, border: `1px solid ${accent}55`, borderRadius: '3px',
                  padding: '7px 14px', textDecoration: 'none',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = accent
                  e.currentTarget.style.boxShadow = `0 0 14px ${accent}33`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${accent}55`
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {link.label} ↗
              </a>
            )
          )}
          {project.achievement && (
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#F59E0B' }}>
              🥇 {project.achievement}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}
