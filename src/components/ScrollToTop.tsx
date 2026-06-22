import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Back to top (or press 1)"
          style={{
            position: 'fixed', bottom: '1.75rem', right: '1.75rem',
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'var(--text)', color: 'var(--bg)',
            border: 'none', cursor: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9998, boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            fontSize: '1.1rem', fontWeight: 700,
            transition: 'transform 0.18s, opacity 0.18s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1) translateY(-2px)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none' }}
          aria-label="Scroll to top"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  )
}
