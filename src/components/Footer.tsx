import { Github, Mail, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div className="footer-inner" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.1rem 2rem' }}>
        {/* Logo */}
        <span style={{ fontFamily: 'Sora, sans-serif', fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text)' }}>
          Ganpati
        </span>

        {/* Center */}
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'var(--text-faint)', textAlign: 'center' }}>
          Designed &amp; built by Ganpati · {new Date().getFullYear()}
        </p>

        {/* Socials */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          {[
            { href: 'https://github.com/aryanf192811-eng', icon: <Github size={16} />, label: 'GitHub' },
            { href: 'mailto:aryanf192811@gmail.com', icon: <Mail size={16} />, label: 'Email' },
            { href: 'https://www.linkedin.com/in/ganpati-kumar-sde/', icon: <Linkedin size={16} />, label: 'LinkedIn' },
          ].map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                color: 'var(--text-faint)', textDecoration: 'none',
                transition: 'color 0.18s',
                display: 'inline-flex',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-faint)' }}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
