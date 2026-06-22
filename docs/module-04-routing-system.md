# Module 04 — Routing System

## Purpose

Understand how navigation works in a portfolio with no router library — why `#hash` anchors replace URL routes, and how the CommandPalette provides keyboard-first navigation.

---

## Why It Exists

Traditional web applications use URL routing: `/about`, `/projects`, `/contact`. This portfolio uses **scroll-based section navigation** instead. There is no `react-router-dom`, no `TanStack Router`, no dynamic URL segments — just a single HTML document where sections are identified by `id` attributes.

This is a deliberate architectural choice, not an oversight.

---

## Files Involved

| File | Navigation Role |
|---|---|
| [`src/App.tsx`](../src/App.tsx) | Defines section ordering in `<main>` |
| [`src/components/Nav.tsx`](../src/components/Nav.tsx) | Navigation links + scroll progress bar |
| [`src/components/NavLogo.tsx`](../src/components/NavLogo.tsx) | Logo links to `#about` |
| [`src/components/CommandPalette.tsx`](../src/components/CommandPalette.tsx) | Keyboard navigation via `scrollIntoView` |
| [`src/components/ScrollToTop.tsx`](../src/components/ScrollToTop.tsx) | Floating ↑ button |
| [`src/index.css`](../src/index.css) | `scroll-behavior: smooth` on `html` |

---

## Dependency Map

```
Nav.tsx
  └── NAV_LINKS array (defined at top of file)
        └── href="#about" | "#skills" | "#experience" | "#projects" | "#contact"
              └── Anchor tag → browser scrolls to <section id="[name]">

CommandPalette.tsx
  └── COMMANDS array
        └── Navigate group: action() → document.querySelector('#[id]').scrollIntoView()
              └── Same sections, different mechanism (JS smooth scroll)

ScrollToTop.tsx
  └── onClick → window.scrollTo({ top: 0, behavior: 'smooth' })

App.tsx
  └── <main>
        <Hero id="about" />         ← target for "#about"
        <Skills id="skills" />      ← target for "#skills"
        <Experience id="experience" />
        <Projects id="projects" />
        <Contact id="contact" />
  </main>
```

---

## Runtime Execution Flow

### Case 1: User clicks a Nav link

```
User clicks "Projects" link in Nav
  └── <a href="#projects"> triggers browser default behavior
        └── Browser scrolls to first element with id="projects"
              └── CSS `html { scroll-behavior: smooth }` makes it animated
                    └── URL changes to "http://localhost:5173/#projects"
                          └── No React re-render (URL change is browser-native)
                                └── Nav scroll listener fires → updates progress bar
```

### Case 2: User opens CommandPalette and navigates

```
User presses Ctrl+K
  └── CommandPalette.tsx useEffect keydown handler fires
        └── setOpen(true)
              └── AnimatePresence renders the palette overlay
                    └── setTimeout 60ms → inputRef.current.focus()

User types "proj"
  └── onChange → setQuery('proj')
        └── filtered = COMMANDS.filter(c => fuzzy('proj', c.label + ...))
              └── "Projects" item matches → setActive(0)

User presses Enter
  └── onKeyDown → run(filtered[0])
        └── setFired('nav-projects')
              └── setTimeout 180ms (for visual "fired" flash)
                    └── cmd.action() executes:
                          document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
                    └── close() → setOpen(false), setQuery(''), setActive(0)
```

### Case 3: User scrolls past 500px

```
window scroll event fires
  └── Nav.tsx onScroll handler:
        setScrolled(window.scrollY > 30)        // triggers nav background blur
        const max = document.documentElement.scrollHeight - window.innerHeight
        setProgress((window.scrollY / max) * 100)  // progress bar width
  └── ScrollToTop.tsx onScroll handler:
        setVisible(window.scrollY > 500)        // floating button appears
```

---

## Data Flow

```
Static state (never changes):
  NAV_LINKS (array in Nav.tsx) → anchor hrefs
  COMMANDS Navigate group (array in CommandPalette.tsx) → action functions

Dynamic state (changes during session):
  scrollY → setScrolled → Nav background + border color
  scrollY → setProgress → Nav progress bar width
  scrollY → setVisible → ScrollToTop button visibility
  open (bool) → AnimatePresence → palette shown/hidden
  query (string) → filtered (computed) → results list
  active (number) → active result highlight
```

---

## Deep Code Walkthrough

### The Navigation Data Structure

```tsx
// src/components/Nav.tsx
const NAV_LINKS = [
  { label: 'About',      href: '#about' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Contact',    href: '#contact' },
]
```

This is a plain JavaScript array at module scope. No dynamic generation, no API calls. If you add a new section, you add it here and in `App.tsx`.

### The Scroll Progress Bar

```tsx
// Nav.tsx — progress bar width calculated from scroll position
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

// Rendered as a position:absolute div at the bottom of the nav
<div style={{
  position: 'absolute', bottom: 0, left: 0,
  height: '2px', background: 'var(--text)',
  width: `${progress}%`,            // ← the progress percentage
  opacity: 0.55,
  transition: 'width 0.08s linear', // smooth but fast
}} />
```

`document.documentElement.scrollHeight` — total scrollable height of the page.
`window.innerHeight` — visible viewport height.
`scrollHeight - innerHeight` — maximum scroll distance (when scrollY = this value, you're at the bottom).

### The Fuzzy Search Algorithm

```tsx
// CommandPalette.tsx
function fuzzy(query: string, target: string): boolean {
  if (!query) return true   // empty query matches everything
  const q = query.toLowerCase()
  const t = target.toLowerCase()
  if (t.includes(q)) return true   // exact substring match
  // Sequential character match — every query char must appear in order in target
  let qi = 0
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++
  }
  return qi === q.length
}
```

Example: `fuzzy('pj', 'Projects')` returns `true` because 'p' and 'j' appear in order in 'projects'.

The filter target is the concatenation of `label + description + keywords`:

```tsx
const filtered = COMMANDS.filter(c =>
  fuzzy(query, c.label + ' ' + (c.description ?? '') + ' ' + (c.keywords ?? ''))
)
```

Each command has a `keywords` field for common aliases: `{ keywords: 'bcart examforge traveloop erp' }` so searching "erp" finds the Projects section.

### The `{ passive: true }` Option

```tsx
window.addEventListener('scroll', onScroll, { passive: true })
```

`{ passive: true }` tells the browser "this listener will never call `event.preventDefault()`." The browser can therefore skip asking the listener permission and just scroll immediately. This eliminates jank on iOS Safari in particular. All three scroll listeners in this codebase use `passive: true`.

### Mobile Navigation

On mobile (<768px), the desktop nav links are hidden via CSS and a hamburger button appears:

```css
/* index.css */
.nav-links-desktop { display: flex; gap: 1.75rem; }
@media (max-width: 768px) { .nav-links-desktop { display: none; } }

.mobile-controls { display: none; }
@media (max-width: 768px) { .mobile-controls { display: flex; } }
```

The mobile menu is an `AnimatePresence`-controlled dropdown:

```tsx
// Nav.tsx
<AnimatePresence>
  {menuOpen && (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      {NAV_LINKS.map(link => (
        <a href={link.href} onClick={closeMenu}> {/* closes menu after click */}
          {link.label}
        </a>
      ))}
    </motion.div>
  )}
</AnimatePresence>
```

`closeMenu` is called on click, because after smooth-scrolling to a section, the menu would otherwise stay open.

---

## Senior Engineer Perspective

**Why no React Router?**  
React Router adds ~50KB to the bundle and meaningful complexity (route definitions, nested layouts, loader functions, action functions). For a single-page portfolio with 5 sections, the return is zero. The browser's built-in anchor navigation does the job perfectly.

**The tradeoff: no deep linking.** With hash routing (`#projects`), you can share a link to a specific section (`yoursite.com/#projects`). With this implementation, a direct visit to `yoursite.com/#projects` will scroll there on load — because the browser natively honors hash anchors on page load. So deep linking works, just through the browser, not React.

**The tradeoff: no programmatic route guards.** If a component needed to be hidden from unauthenticated users, a scroll-based approach provides no way to protect it (the HTML is in the DOM regardless). For a portfolio, this is irrelevant.

**CommandPalette as a power user feature.** The command palette is keyboard-first navigation — borrowed from tools like VS Code, Linear, Raycast. It's not necessary for portfolio navigation but signals engineering sophistication to the technical audience the portfolio targets.

---

## Common Bugs

| Bug | Cause | Fix |
|---|---|---|
| Nav link doesn't scroll | Section `id` mismatch | Verify `href="#projects"` matches `<section id="projects">` |
| Smooth scroll doesn't work | Browser doesn't support CSS scroll-behavior | Add `scroll-behavior: smooth` polyfill or use JS |
| Progress bar always 0% | `scrollHeight` returns 0 (tab not focused) | Normal — fires correctly once user scrolls |
| Command palette doesn't open | Another element captured `Ctrl+K` | Check for conflicting global keyboard handlers |
| Mobile menu stays open | `onClick={closeMenu}` missing on a link | Add `onClick={closeMenu}` to all mobile menu links |

---

## Hands-On Exercises

1. **Add a new section:** Add a new "Blog" section placeholder after `Contact`. Add its link to `NAV_LINKS`. Add a corresponding command to `CommandPalette.tsx`. Test that all three navigation methods work (click nav, Ctrl+K, browser back after typing `#blog`).
2. **Understand scroll math:** Paste this in the console: `document.documentElement.scrollHeight - window.innerHeight`. Scroll to the very bottom. Now check `window.scrollY`. What's the relationship?
3. **Test the fuzzy search:** Open the command palette (Ctrl+K). Type `bcrt` (missing the 'a'). Does "Projects" appear? Why or why not? Now type `projct`. What happens?
4. **Inspect mobile nav:** Resize the browser to <768px. Open the hamburger. Click a link. Does the menu close? Trace `onClick={closeMenu}` in the code.

---

## Knowledge Prerequisites

| Concept | Why You Need It |
|---|---|
| HTML anchor links (`href="#id"`) | The core navigation mechanism |
| CSS `scroll-behavior: smooth` | Enables animated scrolling |
| `window.scrollY` | Used by scroll listeners |
| `scrollIntoView({ behavior: 'smooth' })` | Used by CommandPalette |
| `addEventListener` passive option | Performance optimization for scroll listeners |
