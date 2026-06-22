import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Github, Linkedin, Send, CheckCircle, AlertCircle, Copy } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { EMAILJS } from '../lib/emailConfig'

emailjs.init({ publicKey: EMAILJS.PUBLIC_KEY })

type Status = 'idle' | 'sending' | 'success' | 'error'

function CopyableLink({ href, icon, label, copyable }: { href: string; icon: React.ReactNode; label: string; copyable: boolean }) {
  const [copied, setCopied] = useState(false)
  const copy = (e: React.MouseEvent) => {
    if (!copyable) return
    e.preventDefault()
    navigator.clipboard.writeText(label).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      onClick={copyable ? copy : undefined}
      title={copyable ? 'Click to copy' : undefined}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontWeight: 500,
        color: copied ? '#22c55e' : 'var(--text-muted)', textDecoration: 'none',
        transition: 'color 0.18s', cursor: copyable ? 'none' : 'none',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = copied ? '#22c55e' : 'var(--text)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = copied ? '#22c55e' : 'var(--text-muted)' }}
    >
      <span style={{ color: copied ? '#22c55e' : 'var(--text-faint)', flexShrink: 0 }}>{icon}</span>
      {copied ? 'Copied!' : label}
      {copyable && <Copy size={11} style={{ opacity: 0.4, marginLeft: '2px' }} />}
    </a>
  )
}

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const formRef    = useRef<HTMLFormElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formRef.current) return
    setStatus('sending')

    try {
      await Promise.all([
        // auto-reply → client
        emailjs.sendForm(EMAILJS.SERVICE_ID, EMAILJS.TEMPLATE_ID, formRef.current),
        // notification → aryan
        emailjs.sendForm(EMAILJS.SERVICE_ID, EMAILJS.NOTIFY_TEMPLATE_ID, formRef.current),
      ])
      setStatus('success')
      setErrorMessage('')
      formRef.current.reset()
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err: any) {
      console.error('[EmailJS]', err)
      setStatus('error')
      setErrorMessage(err?.text || err?.message || 'Unknown error occurred')
      setTimeout(() => {
        setStatus('idle')
        setErrorMessage('')
      }, 5000)
    }
  }

  return (
    <section id="contact" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="section-wrap" ref={sectionRef}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '3rem' }}
        >
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: 'var(--text-faint)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.55rem' }}>
            get in touch
          </p>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text)' }}>
            Contact{' '}<span style={{ WebkitTextStroke: '2px var(--text)', color: 'transparent' }}>Me</span>
          </h2>
        </motion.div>

        <div className="contact-grid">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.55 }}
          >
            <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                className="contact-input"
                type="text"
                name="from_name"
                placeholder="Your name"
                required
                disabled={status === 'sending'}
              />
              <input
                className="contact-input"
                type="email"
                name="from_email"
                placeholder="Email address"
                required
                disabled={status === 'sending'}
              />
              <input
                className="contact-input"
                type="text"
                name="title"
                placeholder="Subject"
                required
                disabled={status === 'sending'}
              />
              <textarea
                className="contact-input"
                name="message"
                placeholder="What are you building? Let's talk."
                required
                rows={5}
                disabled={status === 'sending'}
                style={{ resize: 'none' }}
              />


              {/* Submit */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  disabled={status === 'sending' || status === 'success'}
                  style={{
                    fontFamily: 'Sora, sans-serif', fontSize: '0.875rem', fontWeight: 600,
                    color: 'var(--bg)', background: 'var(--text)',
                    border: 'none', borderRadius: '50px', padding: '12px 28px',
                    cursor: status === 'sending' || status === 'success' ? 'not-allowed' : 'pointer',
                    opacity: status === 'sending' ? 0.65 : 1,
                    transition: 'opacity 0.18s, transform 0.18s',
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                  }}
                  onMouseEnter={e => {
                    if (status === 'idle') {
                      (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'
                        ; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
                    }
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '1'
                      ; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                  }}
                >
                  <Send size={14} />
                  {status === 'sending' ? 'Sending…' : status === 'success' ? 'Sent!' : 'Send Message'}
                </button>

                {/* Status feedback */}
                {status === 'success' && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#22c55e' }}
                  >
                    <CheckCircle size={15} /> Message delivered!
                  </motion.span>
                )}
                {status === 'error' && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#ef4444' }}
                  >
                    <AlertCircle size={15} /> Failed: {errorMessage}
                  </motion.span>
                )}
              </div>


            </form>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.55 }}
          >
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: 'clamp(1.7rem, 3.5vw, 2.3rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-0.035em',
                color: 'var(--text)',
                marginBottom: '1rem',
              }}>
                Let&apos;s{' '}
                <span style={{ WebkitTextStroke: '2px var(--text)', color: 'transparent' }}>build</span>
                <br />
                something real.
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.72 }}>
                Open to internships, backend or full-stack opportunities, and technical
                collaborations. If you&apos;re building something challenging, I&apos;d love to hear about it.
              </p>
            </div>

            {/* Contact links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem' }}>
              {[
                { href: 'mailto:aryanf192811@gmail.com', icon: <Mail size={15} />, label: 'aryanf192811@gmail.com', copyable: true },
                { href: 'https://github.com/aryanf192811-eng', icon: <Github size={15} />, label: 'github.com/aryanf192811-eng', copyable: false },
                { href: 'https://www.linkedin.com/in/ganpati-kumar-686a88358/', icon: <Linkedin size={15} />, label: 'linkedin.com/in/ganpati-kumar', copyable: false },
              ].map(({ href, icon, label, copyable }) => (
                <CopyableLink key={label} href={href} icon={icon} label={label} copyable={copyable} />
              ))}
            </div>

            {/* Social icon buttons */}
            <div style={{ display: 'flex', gap: '0.625rem' }}>
              {[
                { href: 'https://github.com/aryanf192811-eng', icon: <Github size={17} />, label: 'GitHub' },
                { href: 'mailto:aryanf192811@gmail.com', icon: <Mail size={17} />, label: 'Email' },
                { href: 'https://www.linkedin.com/in/ganpati-kumar-686a88358/', icon: <Linkedin size={17} />, label: 'LinkedIn' },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '44px', height: '44px', borderRadius: '50%',
                    border: '1.5px solid var(--border)', color: 'var(--text-muted)',
                    textDecoration: 'none', transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.borderColor = 'var(--text)'
                    el.style.color = 'var(--text)'
                    el.style.background = 'var(--surface-2)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.borderColor = 'var(--border)'
                    el.style.color = 'var(--text-muted)'
                    el.style.background = 'transparent'
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
