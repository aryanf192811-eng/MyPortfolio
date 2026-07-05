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
import CommandPalette from './components/CommandPalette'

function DynamicTitle() {
  useEffect(() => {
    const original = 'Ganpati Kumar — Backend Engineer'
    document.title = original
    const onBlur  = () => { document.title = '👋 Come back — Ganpati misses you!' }
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

export default function App() {
  return (
    <ThemeProvider>
      <DynamicTitle />
      <CursorEffect />
      <CommandPalette />
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
