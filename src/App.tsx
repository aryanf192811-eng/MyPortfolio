import { useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CursorEffect from './components/CursorEffect'
import ScrollToTop from './components/ScrollToTop'

function DynamicTitle() {
  useEffect(() => {
    const original = 'Aryan — Backend Engineer'
    document.title = original
    const onBlur  = () => { document.title = '👋 Come back — Aryan misses you!' }
    const onFocus = () => { document.title = original }
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
    }
  }, [])
  return null
}

// Press 1-5 to jump to sections
function KeyboardNav() {
  useEffect(() => {
    const SECTIONS = ['#about', '#skills', '#experience', '#projects', '#contact']
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const idx = parseInt(e.key, 10) - 1
      if (idx >= 0 && idx < SECTIONS.length) {
        document.querySelector(SECTIONS[idx])?.scrollIntoView({ behavior: 'smooth' })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <DynamicTitle />
      <KeyboardNav />
      <CursorEffect />
      <Nav />
      <main>
        <Hero />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </ThemeProvider>
  )
}
