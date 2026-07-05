import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, Hash, Github, Mail, Linkedin, Download, X } from 'lucide-react'
import { RESUME_URL } from '../lib/emailConfig'

interface Command {
  id: string
  label: string
  description?: string
  group: string
  icon: React.ReactNode
  action: () => void
  keywords?: string
}

const COMMANDS: Command[] = [
  // Navigation
  {
    id: 'nav-about',    group: 'Navigate', label: 'About',
    description: 'Who I am and what I build',
    icon: <Hash size={14} />,
    action: () => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }),
    keywords: 'home hero intro',
  },
  {
    id: 'nav-skills',   group: 'Navigate', label: 'Skills',
    description: 'Tech stack and tools',
    icon: <Hash size={14} />,
    action: () => document.querySelector('#skills')?.scrollIntoView({ behavior: 'smooth' }),
    keywords: 'tech stack node postgres react python',
  },
  {
    id: 'nav-exp',      group: 'Navigate', label: 'Experience',
    description: 'Work history and engineering principles',
    icon: <Hash size={14} />,
    action: () => document.querySelector('#experience')?.scrollIntoView({ behavior: 'smooth' }),
    keywords: 'work freelance soundrich principles',
  },
  {
    id: 'nav-projects', group: 'Navigate', label: 'Projects',
    description: 'B-Cart, ExamForge, Traveloop',
    icon: <Hash size={14} />,
    action: () => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }),
    keywords: 'bcart examforge traveloop erp',
  },
  {
    id: 'nav-contact',  group: 'Navigate', label: 'Contact',
    description: 'Get in touch',
    icon: <Hash size={14} />,
    action: () => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }),
    keywords: 'hire email message',
  },
  // Actions
  {
    id: 'act-email', group: 'Actions', label: 'Copy email address',
    description: 'aryanf192811@gmail.com',
    icon: <Mail size={14} />,
    action: () => navigator.clipboard.writeText('aryanf192811@gmail.com'),
    keywords: 'copy mail gmail',
  },
  {
    id: 'act-github', group: 'Actions', label: 'Open GitHub',
    description: 'github.com/aryanf192811-eng',
    icon: <Github size={14} />,
    action: () => window.open('https://github.com/aryanf192811-eng', '_blank'),
    keywords: 'code repo source',
  },
  {
    id: 'act-linkedin', group: 'Actions', label: 'Open LinkedIn',
    description: 'linkedin.com/in/ganpati-kumar',
    icon: <Linkedin size={14} />,
    action: () => window.open('https://www.linkedin.com/in/ganpati-kumar-sde/', '_blank'),
    keywords: 'connect profile network',
  },
  {
    id: 'act-cv', group: 'Actions', label: 'Download CV',
    description: 'Open resume in new tab',
    icon: <Download size={14} />,
    action: () => window.open(RESUME_URL, '_blank'),
    keywords: 'resume pdf download hire',
  },
]

function fuzzy(query: string, target: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  const t = target.toLowerCase()
  if (t.includes(q)) return true
  let qi = 0
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++
  }
  return qi === q.length
}

export default function CommandPalette() {
  const [open, setOpen]       = useState(false)
  const [query, setQuery]     = useState('')
  const [active, setActive]   = useState(0)
  const [fired, setFired]     = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef  = useRef<HTMLDivElement>(null)

  const filtered = COMMANDS.filter(c =>
    fuzzy(query, c.label + ' ' + (c.description ?? '') + ' ' + (c.keywords ?? ''))
  )

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActive(0)
    setFired(null)
  }, [])

  const run = useCallback((cmd: Command) => {
    setFired(cmd.id)
    setTimeout(() => {
      cmd.action()
      close()
    }, 180)
  }, [close])

  // Open on Cmd+K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(p => !p)
      }
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60)
  }, [open])

  // Reset active index when results change
  useEffect(() => { setActive(0) }, [query])

  // Keyboard navigation inside palette
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && filtered[active]) run(filtered[active])
  }

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`) as HTMLElement | null
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const groups = [...new Set(filtered.map(c => c.group))]

  return (
    <>
      {/* Keyboard hint — bottom-left, visible on load then fades out after 3 s */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3, duration: 0.6 }}
        style={{
          position: 'fixed', bottom: '1.75rem', left: '1.75rem', zIndex: 9990,
          fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem',
          color: 'var(--text-faint)', letterSpacing: '0.05em',
          display: 'flex', alignItems: 'center', gap: '6px',
          pointerEvents: 'none', userSelect: 'none',
        }}
      >
        <kbd style={{
          background: 'var(--surface)', border: '1px solid var(--border-2)',
          borderRadius: '5px', padding: '2px 6px', fontSize: '0.6rem',
          color: 'var(--text-faint)', fontFamily: 'JetBrains Mono, monospace',
        }}>
          Ctrl+K
        </kbd>
        <span>command palette</span>
      </motion.div>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={close}
              style={{
                position: 'fixed', inset: 0, zIndex: 99990,
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            />

            {/* Palette */}
            <motion.div
              key="palette"
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'fixed',
                top: '18vh', left: '50%',
                transform: 'translateX(-50%)',
                width: '100%', maxWidth: '560px',
                background: 'var(--surface)',
                border: '1.5px solid var(--border)',
                borderRadius: '16px',
                boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
                zIndex: 99991,
                overflow: 'hidden',
              }}
              onKeyDown={onKeyDown}
            >
              {/* Search row */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.9rem 1.1rem',
                borderBottom: '1px solid var(--border)',
              }}>
                <Search size={16} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Type a command or search…"
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
                    color: 'var(--text)', caretColor: 'var(--text)',
                  }}
                />
                {query && (
                  <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'none', color: 'var(--text-faint)', display: 'flex', padding: 0 }}>
                    <X size={14} />
                  </button>
                )}
                <kbd style={{
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: '5px', padding: '2px 7px', fontSize: '0.62rem',
                  fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-faint)',
                  flexShrink: 0,
                }}>
                  esc
                </kbd>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                style={{ maxHeight: '360px', overflowY: 'auto', padding: '0.5rem' }}
              >
                {filtered.length === 0 ? (
                  <p style={{
                    fontFamily: 'Inter, sans-serif', fontSize: '0.85rem',
                    color: 'var(--text-faint)', textAlign: 'center', padding: '1.5rem',
                  }}>
                    No results for &ldquo;{query}&rdquo;
                  </p>
                ) : (
                  groups.map(group => (
                    <div key={group}>
                      <p style={{
                        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem',
                        color: 'var(--text-faint)', letterSpacing: '0.1em',
                        textTransform: 'uppercase', padding: '0.5rem 0.6rem 0.3rem',
                      }}>
                        {group}
                      </p>
                      {filtered
                        .filter(c => c.group === group)
                        .map(cmd => {
                          const idx = filtered.indexOf(cmd)
                          const isActive = idx === active
                          const isFired  = fired === cmd.id
                          return (
                            <div
                              key={cmd.id}
                              data-idx={idx}
                              onClick={() => run(cmd)}
                              onMouseEnter={() => setActive(idx)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.65rem 0.75rem', borderRadius: '10px',
                                background: isFired
                                  ? 'var(--border-2)'
                                  : isActive ? 'var(--surface-2)' : 'transparent',
                                cursor: 'none', transition: 'background 0.1s',
                              }}
                            >
                              <span style={{
                                width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
                                background: isActive ? 'var(--border)' : 'var(--surface-2)',
                                border: '1px solid var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: isActive ? 'var(--text)' : 'var(--text-faint)',
                                transition: 'all 0.1s',
                              }}>
                                {cmd.icon}
                              </span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                  fontFamily: 'Sora, sans-serif', fontSize: '0.82rem',
                                  fontWeight: 600, color: 'var(--text)',
                                  marginBottom: cmd.description ? '1px' : 0,
                                }}>
                                  {cmd.label}
                                </p>
                                {cmd.description && (
                                  <p style={{
                                    fontFamily: 'Inter, sans-serif', fontSize: '0.72rem',
                                    color: 'var(--text-faint)',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                  }}>
                                    {cmd.description}
                                  </p>
                                )}
                              </div>
                              {isActive && (
                                <ArrowRight size={13} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
                              )}
                            </div>
                          )
                        })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer hint */}
              <div style={{
                borderTop: '1px solid var(--border)',
                padding: '0.5rem 1rem',
                display: 'flex', gap: '1.25rem', alignItems: 'center',
              }}>
                {[['↑↓', 'navigate'], ['↵', 'select'], ['esc', 'close']].map(([key, label]) => (
                  <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <kbd style={{
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      borderRadius: '4px', padding: '1px 5px',
                      fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem',
                      color: 'var(--text-faint)',
                    }}>
                      {key}
                    </kbd>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', color: 'var(--text-faint)' }}>
                      {label}
                    </span>
                  </span>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
