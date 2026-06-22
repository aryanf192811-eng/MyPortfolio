# Module 01 — Project Mental Model

## Purpose

Build a complete mental picture of what this project is, what it does, who it's for, and how its pieces fit together before reading a single line of code.

---

## Why It Exists

Aryan is a B.Tech CS student and backend engineer. This portfolio is his professional face on the internet — a document that says "hire me" in the form of interactive code. It replaces a static PDF résumé with something that *demonstrates* engineering taste directly.

The project needed to:
1. Show personality (interactive SVG avatar, typewriter greetings on a laptop screen)
2. Show technical depth (Three.js canvas, proper EmailJS integration, command palette)
3. Work without a backend (static site — deployed directly from `/dist`)
4. Load fast enough that a recruiter doesn't leave

---

## Files Involved

| File | Role |
|---|---|
| [`index.html`](../index.html) | Shell HTML — mounts the React app, loads Google Fonts |
| [`src/main.tsx`](../src/main.tsx) | JavaScript entry point — creates the React root |
| [`src/App.tsx`](../src/App.tsx) | Root component — assembles all sections |
| [`src/index.css`](../src/index.css) | Design system — tokens, resets, layout classes |
| [`src/context/ThemeContext.tsx`](../src/context/ThemeContext.tsx) | Global theme state |
| [`src/components/`](../src/components/) | All 14 UI components |
| [`src/lib/`](../src/lib/) | Utilities: email config + tech color mapping |
| [`vite.config.ts`](../vite.config.ts) | Build configuration |
| [`package.json`](../package.json) | Dependencies and scripts |

---

## Dependency Map

```
External World
  ├── Google Fonts (Sora, Space Grotesk, Inter, JetBrains Mono) — loaded in index.html
  ├── EmailJS API — called from Contact.tsx on form submit
  └── GitHub/LinkedIn/Email — external links, no API calls

Node Modules
  ├── react@19 + react-dom@19 — UI framework
  ├── framer-motion@12 — animation engine
  ├── three@0.175 — 3D rendering for hero particle canvas
  ├── react-type-animation@3 — typewriter text in Hero
  ├── lucide-react — icon library
  └── @emailjs/browser@4 — client-side email delivery

Dev Tooling
  ├── vite@6 — dev server + bundler
  ├── typescript@5.8 — type checker
  └── @tailwindcss/vite@4 — Tailwind CSS plugin
```

---

## Runtime Execution Flow

When a visitor opens the site:

```
1. Browser loads index.html
   └── Parses <head>: loads Google Fonts (async, non-blocking)
   └── Encounters <script type="module" src="/src/main.tsx">
       └── Vite serves main.tsx (in dev) or bundled JS (in prod)

2. main.tsx executes
   └── createRoot(document.getElementById('root'))
   └── Renders <App /> inside <StrictMode>

3. App.tsx renders
   └── ThemeProvider — reads localStorage, applies theme class to <html>
   └── DynamicTitle — attaches blur/focus window listeners for tab title
   └── CursorEffect — starts RAF loop for custom cursor ring
   └── CommandPalette — registers Ctrl+K keyboard listener
   └── Nav — attaches scroll listener for progress bar + background blur
   └── Hero — starts Three.js particle animation + SVG avatar tracking
   └── Skills — waits for IntersectionObserver to trigger animations
   └── Experience — waits for IntersectionObserver
   └── Projects — waits for IntersectionObserver
   └── Contact — initializes EmailJS SDK, waits for IntersectionObserver
   └── Footer — static render
   └── ScrollToTop — attaches scroll listener for show/hide
```

**Total JS work on initial render:**
- 1 RAF loop started (CursorEffect)
- 1 Three.js WebGL context created (HeroCanvas)
- 5 `scroll` event listeners registered
- 4 IntersectionObserver instances created
- 1 `keydown` listener (CommandPalette)
- 1 `mousemove` listener (DeveloperIllustration in Hero)
- Theme class applied to `document.documentElement`

---

## Data Flow

```
Static Data (hardcoded in component files)
  ├── PROJECTS array → Projects.tsx → ProjectCard → ProjectVisual
  ├── COMMANDS array → CommandPalette.tsx → filtered list
  ├── CORE_SKILLS + STACK_GROUPS → Skills.tsx → cards + tags
  ├── PRINCIPLES → Experience.tsx → PrinciplesPanel
  └── GREETINGS → Hero.tsx → DeveloperIllustration typewriter

User Interaction → State Change → Re-render
  ├── Mouse move → targetHead.current / targetPupil.current → requestAnimationFrame → setHeadState/setPupil → SVG re-render
  ├── Theme toggle → toggle() → setTheme() → useEffect → class on <html> → CSS cascade
  ├── Scroll → onScroll() → setScrolled/setProgress → Nav re-render
  └── Form submit → handleSubmit() → emailjs.send() → setStatus() → button label changes

External API Call
  └── emailjs.send() called twice in parallel (auto-reply + notification)
      └── Success: formRef.current.reset(), setStatus('success')
      └── Error: setStatus('error'), setErrorMessage(err.text)
```

---

## Deep Code Walkthrough

### The Page is One Scrollable Document

There is **no router**. The URL never changes. All "navigation" is CSS scroll-snap / smooth scrolling to section IDs:

```tsx
// src/components/Nav.tsx — links are plain anchor tags
const NAV_LINKS = [
  { label: 'About',    href: '#about' },     // scrolls to <section id="about">
  { label: 'Skills',   href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact' },
]
```

```tsx
// CommandPalette.tsx — same pattern for keyboard navigation
action: () => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
```

This is intentional — a portfolio has no need for routes.

### The Theme System is CSS-First

The theme doesn't inject style tags or swap stylesheets. It changes **one class on `<html>`**:

```tsx
// ThemeContext.tsx
root.classList.toggle('light', theme === 'light')
root.classList.toggle('dark',  theme === 'dark')
```

The CSS responds via:

```css
/* index.css */
:root { --bg: #0a0a0a; --text: #ffffff; } /* dark = default */
html.light { --bg: #f7f7f7; --text: #0a0a0a; }
```

Every component uses `var(--bg)`, `var(--text)` etc. The entire site repaints when the class changes. This is the most performant possible theming strategy — zero JavaScript in the render path.

### Performance-Critical Animations Use `useRef` + `requestAnimationFrame`

The cursor ring and SVG avatar **do not use React state** for every frame update. They use refs:

```tsx
// CursorEffect.tsx
let tx = 0, ty = 0      // target position (set on mousemove)
let rx = 0, ry = 0      // current ring position (interpolated each frame)

const tick = () => {
  raf = requestAnimationFrame(tick)
  rx = lerp(rx, tx, 0.1)  // exponential smoothing
  ry = lerp(ry, ty, 0.1)
  ringRef.current.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`
}
```

Setting `.style.transform` directly on the DOM element bypasses React's reconciler entirely. This is why the cursor feels smooth — no re-renders, no virtual DOM diffing, direct DOM mutation at 60fps.

---

## Senior Engineer Perspective

**Why a SPA instead of SSR (Next.js)?**  
This is a static marketing site. There's no dynamic data, no user sessions, no SEO-critical server-rendered content (the "content" is the engineer's story, not searchable articles). Vite's SPA + `vite preview` or Netlify static deployment is simpler, faster to build, and requires zero server infrastructure. Correct choice.

**Why inline styles instead of Tailwind classes?**  
The codebase uses a hybrid: layout-level classes from CSS (`hero-grid`, `section-wrap`, `skill-card`) and component-specific styles inline. This is pragmatic — layout variants that need responsive breakpoints go in CSS; one-off decorative styles go inline where they're co-located with the JSX they style. The downside is inconsistency (a reader has to look in two places). The upside is that layout breakpoints are centrally managed in one file.

**Why Framer Motion instead of CSS animations?**  
CSS animations can't easily orchestrate **sequential** entrance animations with delays that depend on scroll position. `useInView` + Framer Motion's `animate` prop gives scroll-triggered, one-shot entrance animations with minimal code. The tradeoff is bundle size (~100KB gzipped for Framer Motion), which is why it gets its own Vite chunk.

---

## Common Bugs

| Symptom | Likely Cause | File to Inspect |
|---|---|---|
| Custom cursor not visible | `cursor: none` on `html` but CursorEffect not mounted | `src/index.css` line 49, `App.tsx` |
| Theme flashes to wrong mode on load | `localStorage` read fails (private browsing) | `ThemeContext.tsx` `getTimeBasedTheme()` |
| Particle canvas is wrong color after theme switch | Three.js re-init doesn't fire | `HeroCanvas.tsx` — `isDark` in dependency array |
| Contact form sends but shows error | EmailJS service/template ID mismatch | `src/lib/emailConfig.ts` |
| Avatar pupils don't track | `svgRef.current` is null — component unmounted | `Hero.tsx` DeveloperIllustration |

---

## Hands-On Exercises

1. **Mental map exercise:** Without looking at the code, draw the component tree from memory after reading this module. Check against `App.tsx`.
2. **Theme override test:** Open DevTools → Application → LocalStorage. Delete `portfolio-theme-manual` and `portfolio-theme`. Reload. What theme do you get at your current time of day? Why?
3. **Navigation trace:** Click "Projects" in the nav. Open DevTools → Performance → Record. What JavaScript executes? Why is there no route change?

---

## Knowledge Prerequisites

| Concept | Why You Need It |
|---|---|
| HTML anchor tags (`<a href="#id">`) | Foundation of the navigation system |
| CSS custom properties (`var(--name)`) | Foundation of the theme system |
| `requestAnimationFrame` | Used in CursorEffect, HeroCanvas, DeveloperIllustration |
| React `useEffect` and `useRef` | Used in every component for DOM manipulation and event listeners |
| JavaScript closures | RAF loops capture variables from their outer scope |
