import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Download } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { OPEN_RESUME_EVENT } from './ResumeViewerModal'
import NavLogo from './NavLogo'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const { isDark, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 51,
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      <nav style={{
        maxWidth: '1200px', margin: '0 auto', padding: '0 2rem',
        height: '72px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'relative',
      }}>
        {/* Logo — interactive mini face */}
        <NavLogo />

        {/* Desktop navigation — hidden on mobile via CSS */}
        <div className="nav-links-desktop">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.18s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-muted)' }}
            >
              {link.label}
            </a>
          ))}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={isDark ? 'Light mode' : 'Dark mode'}
            style={{
              width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
              background: 'var(--surface)', border: '1.5px solid var(--border)',
              color: 'var(--text-muted)', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = 'var(--text)'; el.style.color = 'var(--text)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-muted)'
            }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Hire Me */}
          <a
            href="#contact"
            style={{
              fontFamily: 'Sora, sans-serif', fontSize: '0.8rem', fontWeight: 600,
              color: 'var(--bg)', background: 'var(--text)', textDecoration: 'none',
              padding: '9px 22px', borderRadius: '50px', transition: 'opacity 0.18s, transform 0.18s',
              display: 'inline-flex', alignItems: 'center',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.opacity = '0.85'; el.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.opacity = '1'; el.style.transform = 'translateY(0)'
            }}
          >
            Hire Me
          </a>
        </div>

        {/* Mobile: theme toggle + hamburger — shown only on mobile via CSS */}
        <div className="mobile-controls">
          <button
            onClick={toggle}
            aria-label={isDark ? 'Light mode' : 'Dark mode'}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--surface)', border: '1.5px solid var(--border)',
              color: 'var(--text-muted)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Toggle menu"
            style={{
              background: 'none', border: 'none', color: 'var(--text)',
              cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center',
            }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                background: 'var(--nav-bg)', borderBottom: '1px solid var(--border)',
                backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem',
              }}
            >
              {NAV_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none' }}
                >
                  {link.label}
                </a>
              ))}

              {/* Resume viewer — only in mobile menu */}
              <button
                onClick={() => { closeMenu(); window.dispatchEvent(new Event(OPEN_RESUME_EVENT)) }}
                style={{
                  fontFamily: 'Sora, sans-serif', fontSize: '0.9rem', fontWeight: 600,
                  color: 'var(--text)', background: 'var(--surface)', cursor: 'pointer',
                  border: '1.5px solid var(--border)', borderRadius: '50px',
                  padding: '10px 20px',
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  alignSelf: 'flex-start',
                }}
              >
                <Download size={14} /> View Resume
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Scroll progress bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0,
          height: '2px', background: 'var(--text)',
          width: `${progress}%`, opacity: 0.55,
          transition: 'width 0.08s linear',
          borderRadius: '0 2px 2px 0',
        }} />
      </nav>
    </motion.header>
  )
}
