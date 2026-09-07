import { useEffect, useState } from 'react'
import { Download, X, ExternalLink } from 'lucide-react'
import { RESUME_URL, RESUME_FILENAME } from '../lib/emailConfig'

// Any component can trigger the resume viewer without prop-drilling through App —
// dispatch this event from a click handler: window.dispatchEvent(new Event(OPEN_RESUME_EVENT))
export const OPEN_RESUME_EVENT = 'open-resume-viewer'

export default function ResumeViewerModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const open = () => setIsOpen(true)
    window.addEventListener(OPEN_RESUME_EVENT, open)
    return () => window.removeEventListener(OPEN_RESUME_EVENT, open)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label="Resume preview"
      onClick={() => setIsOpen(false)}
      style={{
        display: isOpen ? 'flex' : 'none',
        position: 'fixed', inset: 0, zIndex: 400,
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(0.75rem, 3vw, 2.5rem)',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '1.5px solid var(--border-2)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '900px',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>
            Resume — Ganpati Kumar
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a
              href={RESUME_URL}
              download={RESUME_FILENAME}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontFamily: 'Sora, sans-serif', fontSize: '0.78rem', fontWeight: 600,
                color: 'var(--bg)', background: 'var(--text)', textDecoration: 'none',
                borderRadius: '50px', padding: '7px 16px',
              }}
            >
              <Download size={13} /> Download
            </a>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open in new tab"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '50%',
                border: '1.5px solid var(--border-2)', color: 'var(--text-muted)',
              }}
            >
              <ExternalLink size={14} />
            </a>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'var(--surface-2)', border: '1.5px solid var(--border-2)',
                cursor: 'pointer', color: 'var(--text-muted)',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Inline PDF preview — the browser's native viewer confirms the file is valid
            before a visitor commits to downloading it */}
        <div style={{ flex: 1, background: '#525659' }}>
          {isOpen && (
            <iframe
              src={`${RESUME_URL}#view=FitH`}
              title="Ganpati Kumar Resume"
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
