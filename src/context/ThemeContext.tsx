import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeCtx {
  theme: Theme
  isDark: boolean
  toggle: () => void
}

const ThemeContext = createContext<ThemeCtx | null>(null)

// Returns 'dark' between 18:00–05:59, 'light' between 06:00–17:59
function getTimeBasedTheme(): Theme {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 18 ? 'light' : 'dark'
}

const MANUAL_KEY  = 'portfolio-theme-manual'   // 'true' when user has toggled
const THEME_KEY   = 'portfolio-theme'           // 'dark' | 'light'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const isManual = localStorage.getItem(MANUAL_KEY) === 'true'
      const saved    = localStorage.getItem(THEME_KEY) as Theme | null
      // If the user manually picked a theme, respect it; otherwise use time
      if (isManual && (saved === 'light' || saved === 'dark')) return saved
    } catch {}
    return getTimeBasedTheme()
  })

  // Apply class + persist whenever theme changes
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('light', theme === 'light')
    root.classList.toggle('dark',  theme === 'dark')
    try { localStorage.setItem(THEME_KEY, theme) } catch {}
  }, [theme])

  // Auto re-sync every minute when user hasn't manually overridden
  useEffect(() => {
    const sync = () => {
      try {
        if (localStorage.getItem(MANUAL_KEY) === 'true') return
      } catch {}
      setTheme(getTimeBasedTheme())
    }

    // Align the first tick to the top of the next minute
    const now        = new Date()
    const msToNextMin = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
    const timeout = setTimeout(() => {
      sync()
      const interval = setInterval(sync, 60_000)
      return () => clearInterval(interval)
    }, msToNextMin)

    return () => clearTimeout(timeout)
  }, [])

  // Manual toggle: overrides auto-rule and marks preference as intentional
  const toggle = () => {
    try { localStorage.setItem(MANUAL_KEY, 'true') } catch {}
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
