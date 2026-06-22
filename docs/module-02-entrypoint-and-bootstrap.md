# Module 02 — Entrypoint & Bootstrap

## Purpose

Understand exactly what happens the moment the browser loads the page — from the first HTML byte to the first rendered pixel.

---

## Why It Exists

Every web application needs a bootstrap sequence: HTML shell → JavaScript entry → React root → component tree → DOM paint. Understanding this sequence tells you where to look when the app fails to start, how long initialization takes, and what the critical path is.

---

## Files Involved

| File | Role in Bootstrap |
|---|---|
| [`index.html`](../index.html) | Browser entry point — the only HTML file |
| [`src/main.tsx`](../src/main.tsx) | JavaScript entry point — creates the React root |
| [`src/App.tsx`](../src/App.tsx) | Root React component — mounts all subsystems |
| [`src/index.css`](../src/index.css) | Imported by main.tsx — applies global styles before first render |

---

## Dependency Map

```
index.html
  ├── <link> Google Fonts (external, async)
  └── <script type="module" src="/src/main.tsx">
        ├── import './index.css'        (processed by Vite/Tailwind)
        ├── import App from './App.tsx'
        └── createRoot().render(<App />)
              └── App.tsx
                    └── [all components imported and rendered]
```

---

## Runtime Execution Flow

### Step 1: Browser parses `index.html`

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Aryan — Backend Systems Engineer</title>
    <meta name="description" content="Backend Systems Engineer specialising in database engineering, workflow automation, and API architecture." />
    <!-- Google Fonts — 4 font families -->
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>  <!-- React mounts here -->
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**What happens at this step:**
- `<div id="root">` is created in the DOM — currently empty
- Google Fonts request is fired (async — doesn't block rendering)
- `type="module"` on the script tag tells the browser this is an ES module — it defers execution until after HTML parsing

### Step 2: Vite serves `main.tsx`

In **development** (`npm run dev`), Vite serves `main.tsx` as a native ES module transformed on the fly. TypeScript JSX is compiled by esbuild.

In **production** (`npm run build`), Vite bundles everything into chunks in `dist/assets/`:
- `vendor-react-[hash].js` — react + react-dom
- `vendor-motion-[hash].js` — framer-motion
- `vendor-three-[hash].js` — three.js
- `index-[hash].js` — application code

```typescript
// src/main.tsx — the entire file
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'      // ← CSS processed and injected into <head>
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**What happens at this step:**
1. `import './index.css'` — Vite processes `index.css` through Tailwind CSS plugin and injects it as a `<style>` tag. CSS custom properties (`--bg`, `--text`, etc.) become available globally.
2. `createRoot(document.getElementById('root')!)` — creates a React concurrent root. The `!` is a TypeScript non-null assertion (the developer trusts the element exists).
3. `.render(<StrictMode><App /></StrictMode>)` — triggers React's reconciliation. App is rendered in Strict Mode, which double-invokes effects in development to catch bugs.

### Step 3: `App.tsx` renders the component tree

```tsx
// src/App.tsx
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
  return null  // renders nothing, just attaches listeners
}

export default function App() {
  return (
    <ThemeProvider>        {/* sets theme class on <html>, exposes useTheme() */}
      <DynamicTitle />     {/* tab title behavior */}
      <CursorEffect />     {/* starts cursor RAF loop */}
      <CommandPalette />   {/* registers Ctrl+K listener */}
      <Nav />              {/* fixed navigation bar */}
      <main>
        <Hero />           {/* Three.js canvas + SVG avatar */}
        <Skills />
        <Experience />
        <Projects />
        <Contact />        {/* initializes EmailJS */}
      </main>
      <Footer />
      <ScrollToTop />      {/* floating ↑ button */}
    </ThemeProvider>
  )
}
```

**Render order matters:** React renders children top-to-bottom. `ThemeProvider` runs first, so every child component can safely call `useTheme()`. The theme class is applied to `<html>` synchronously inside `ThemeProvider`'s `useState` initializer before any paint.

### Step 4: Effects fire after first paint

React's `useEffect` hooks fire **after** the browser has painted the first frame. This means:

| Effect | File | When it fires |
|---|---|---|
| Theme class applied to `<html>` | `ThemeContext.tsx:34` | After first render |
| Cursor RAF loop starts | `CursorEffect.tsx:29` | After first render |
| Three.js WebGL context created | `HeroCanvas.tsx:21` | After first render |
| Nav scroll listener registered | `Nav.tsx:23` | After first render |
| `window.blur/focus` listeners for title | `App.tsx:17` | After first render |
| EmailJS SDK initialized | `Contact.tsx:7` | At module evaluation (top-level!) |

**Important note:** `emailjs.init()` is called at the **module level** in `Contact.tsx`, not inside a useEffect:

```tsx
// Contact.tsx — line 7 — runs when the module is imported
emailjs.init({ publicKey: EMAILJS.PUBLIC_KEY })
```

This means EmailJS is initialized synchronously when the JavaScript bundle loads, before any React rendering.

---

## Data Flow at Bootstrap

```
localStorage
  └── ThemeProvider reads 'portfolio-theme' + 'portfolio-theme-manual'
        └── Determines initial theme (time-based or saved)
              └── Applies class to document.documentElement
                    └── CSS cascade resolves all var(--*) tokens
                          └── First paint uses correct theme colors
```

If `localStorage` throws (private browsing, storage quota exceeded), the `try/catch` in `ThemeProvider` silently falls back to `getTimeBasedTheme()`.

---

## Deep Code Walkthrough

### `createRoot` vs `ReactDOM.render` (legacy)

```tsx
// Modern React 18+ concurrent root
createRoot(document.getElementById('root')!).render(<App />)

// Old React 17 approach (still works but deprecated)
ReactDOM.render(<App />, document.getElementById('root'))
```

The concurrent root enables React 18+ features: automatic batching, transitions, Suspense. This project uses React 19, so it gets all concurrent features.

### `StrictMode` — Double Renders in Development

`<StrictMode>` causes every component to render **twice** in development. This is deliberate — it catches bugs where components assume they only run once. `useEffect` cleanup functions are also invoked in development.

In production, `StrictMode` has zero overhead — it's stripped by the build.

### The `DynamicTitle` component pattern

`DynamicTitle` renders `null` but still participates in the component lifecycle:

```tsx
function DynamicTitle() {
  useEffect(() => {
    // Attaches listeners and returns a cleanup function
    return () => {
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
    }
  }, [])
  return null
}
```

This is a behavioral component — its job is to manage side effects, not render UI. This is a clean pattern for global behaviors that don't have a visual representation.

---

## Senior Engineer Perspective

**Why not SSR?** There's no server. `index.html` is a static file that Vite's dev server serves locally and Netlify/Vercel serves in production. SSR would require a Node.js runtime and complicate deployment. For a portfolio with no SEO-sensitive dynamic content, client-side rendering is perfectly appropriate.

**Why `type="module"` on the script tag?** Native ES modules defer execution, support top-level await, have strict mode by default, and don't pollute the global scope. Vite requires `type="module"` to enable its module graph and HMR (Hot Module Replacement).

**The `!` non-null assertion:** `document.getElementById('root')!` — the `!` tells TypeScript "I know this won't be null." A safer alternative would be:
```tsx
const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')
createRoot(root).render(...)
```
The current approach is fine for a portfolio but would be inappropriate in a production application with user-facing error handling requirements.

---

## Common Bugs

| Bug | Cause | Fix |
|---|---|---|
| Blank page on load | `#root` div missing from `index.html` | Check `index.html:14` |
| `Cannot find module './App.tsx'` | TypeScript module resolution | Check `tsconfig.app.json` |
| Fonts not loading | CSP header blocking Google Fonts | Add `fonts.googleapis.com` to CSP |
| Theme flash (FOUC) | CSS loads after JS paint | Critical: move initial theme to `<script>` in `<head>` |

**The FOUC (Flash of Unstyled Content) Problem:**  
The current implementation applies the theme class in a React effect, which fires after the first paint. A visitor in a dark room at night might see a brief white flash before the dark theme applies. The fix is a tiny inline script in `<head>` that reads localStorage and applies the class synchronously:
```html
<script>
  const t = localStorage.getItem('portfolio-theme')
  if (t) document.documentElement.classList.add(t)
</script>
```
This is not currently implemented — worth noting as an improvement opportunity.

---

## Hands-On Exercises

1. **Trace the startup:** Open DevTools → Network. Hard refresh. Sort by Time. Can you identify which file loads first? Which is largest?
2. **Remove StrictMode:** In `main.tsx`, remove `<StrictMode>`. Run `npm run dev`. Open DevTools → Console. Any warnings disappear? What does this tell you about the current code?
3. **Break the root:** In `index.html`, rename `id="root"` to `id="app"`. What error do you get? Where? Fix it.
4. **Add a startup log:** In `main.tsx`, add `console.log('React root created at', Date.now())` before `.render()`. Now add another inside `App()`. What order do they fire in?

---

## Knowledge Prerequisites

| Concept | Why You Need It |
|---|---|
| ES modules (`import`/`export`) | The entire app is ES modules |
| The browser DOM (`getElementById`) | How React attaches to the page |
| `useEffect` lifecycle | Effects fire after render — critical for understanding startup order |
| TypeScript non-null assertion (`!`) | Used in `main.tsx` |
