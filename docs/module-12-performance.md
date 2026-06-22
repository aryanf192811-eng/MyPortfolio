# Module 12 — Performance

## Purpose

Understand every performance decision in this codebase: the Vite chunk splitting, the `requestAnimationFrame` pattern, Three.js cleanup, passive event listeners, and the IntersectionObserver pattern.

---

## Why It Exists

A portfolio is a first impression. If it takes 5 seconds to load or stutters on scroll, the engineer looks bad. Performance is a feature, not an afterthought. This codebase makes deliberate choices at every level: build tooling, animation strategy, event handling, and resource cleanup.

---

## Files Involved

| File | Performance Concern |
|---|---|
| [`vite.config.ts`](../vite.config.ts) | Manual chunk splitting |
| [`src/components/HeroCanvas.tsx`](../src/components/HeroCanvas.tsx) | Three.js lifecycle + cleanup |
| [`src/components/CursorEffect.tsx`](../src/components/CursorEffect.tsx) | RAF loop + cleanup |
| [`src/components/Hero.tsx`](../src/components/Hero.tsx) | RAF loop + passive listeners |
| [`src/components/Nav.tsx`](../src/components/Nav.tsx) | Passive scroll listener |
| [`src/index.css`](../src/index.css) | CSS-first theming (no JS in render path) |

---

## Dependency Map

```
Performance Decisions
  ├── Build time
  │     └── vite.config.ts: manualChunks → parallel downloads
  │
  ├── Runtime: Animation
  │     ├── CursorEffect: RAF + direct DOM (no React state for cursor pos)
  │     ├── Hero DeveloperIllustration: RAF + spring physics
  │     └── HeroCanvas: Three.js WebGL render loop
  │
  ├── Runtime: Events
  │     ├── All scroll listeners: { passive: true }
  │     ├── mousemove listeners: { passive: true }
  │     └── All effects return cleanup functions
  │
  └── Runtime: Rendering
        ├── useInView { once: true }: IntersectionObserver disconnects after fire
        ├── CSS custom properties: theme change = one class swap, no JS
        └── InView animations: elements don't animate until visible
```

---

## Runtime Execution Flow

### Vite Code Splitting — Build Time

```typescript
// vite.config.ts
rollupOptions: {
  output: {
    manualChunks: {
      'vendor-react':  ['react', 'react-dom'],      // ~130KB gzipped
      'vendor-motion': ['framer-motion'],            // ~50KB gzipped
      'vendor-three':  ['three'],                   // ~170KB gzipped
    },
  },
},
```

Without manual chunks, Rollup would bundle everything into one large file. With splitting:
- `vendor-react` — cached separately, rarely changes
- `vendor-motion` — cached separately
- `vendor-three` — cached separately  
- `index-[hash].js` — your application code, small, changes frequently

**Browser behavior:** The browser downloads all chunks in parallel (HTTP/2). After the first visit, `vendor-*` chunks are served from cache. Only `index-[hash].js` needs re-downloading when you deploy new code.

### Three.js Cleanup — Runtime

```tsx
// HeroCanvas.tsx
useEffect(() => {
  // ─ SETUP ─
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  el.appendChild(renderer.domElement)   // adds a <canvas> to the DOM

  let raf: number
  const tick = () => {
    raf = requestAnimationFrame(tick)
    // ... physics + render
  }
  tick()

  window.addEventListener('mousemove', onMouse, { passive: true })
  window.addEventListener('resize', onResize)

  // ─ CLEANUP ─ (returned from useEffect)
  return () => {
    cancelAnimationFrame(raf)                     // stop the render loop
    window.removeEventListener('mousemove', onMouse)
    window.removeEventListener('resize', onResize)
    renderer.dispose()                             // frees WebGL context + GPU memory
    if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)  // removes <canvas>
  }
}, [isDark])   // ← re-runs when theme changes (dark/light affects particle colors)
```

**Why `renderer.dispose()` matters:** Each `THREE.WebGLRenderer` creates a WebGL context. Browsers limit WebGL contexts per page (typically 16). Without `dispose()`, switching themes repeatedly would create orphaned contexts until the browser throws "Too many active WebGL contexts."

**Why `[isDark]` dependency?** The particle colors change with theme. The only way to re-initialize Three.js with new colors is to tear down and rebuild. The cleanup function handles teardown; the effect body handles rebuild.

### Event Listener Cleanup — Runtime

Every `useEffect` that attaches a listener returns a cleanup function:

```tsx
// Nav.tsx
useEffect(() => {
  const onScroll = () => { ... }
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)  // ← cleanup
}, [])
```

Without cleanup:
1. Component unmounts (in development, Strict Mode unmounts and remounts components)
2. The old listener remains attached
3. `onScroll` fires and tries to call `setScrolled` on an unmounted component
4. React warns: "Can't perform a React state update on an unmounted component"

In production, the component never unmounts (single-page, no routing), so this is less critical. But it's correct practice.

### `{ passive: true }` — Event Performance

```tsx
window.addEventListener('scroll', onScroll, { passive: true })
window.addEventListener('mousemove', handleMouse, { passive: true })
```

`passive: true` tells the browser the handler won't call `event.preventDefault()`. This allows the browser to process scrolling and mouse movement on a separate compositor thread without waiting for JavaScript. On mobile, this prevents janky scrolling.

**Which events need passive:**
- `scroll` — always use `passive: true` (you almost never need to prevent default scroll)
- `touchstart`, `touchmove` — critical on mobile
- `mousemove`, `wheel` — good practice

### `useInView { once: true }` — IntersectionObserver Cleanup

```tsx
const inView = useInView(ref, { once: true, margin: '-60px' })
```

With `once: true`:
1. Observer fires when element enters viewport
2. Observer automatically **disconnects** — stops watching
3. Memory freed, no more intersection callbacks

Without `once: true`, the observer continues watching as the user scrolls, calling setState every time the element enters/leaves. This is fine for lazy-loading but wasteful for entrance animations that only play once.

### CSS-First Theming — Zero JS in Render Path

Theme switching:
```tsx
// ThemeContext.tsx — one DOM operation, no component re-renders
document.documentElement.classList.toggle('light', theme === 'light')
document.documentElement.classList.toggle('dark',  theme === 'dark')
```

The browser's CSS engine handles the rest:
```css
:root { --bg: #0a0a0a; }      /* dark = default */
html.light { --bg: #f7f7f7; } /* light override */
```

Every component that uses `var(--bg)` automatically updates when the class changes. No React state propagation, no component re-renders — just one class toggle.

The components that **do** re-render on theme change:
- `Nav.tsx` — `isDark` from `useTheme()` controls Sun/Moon icon
- `Hero.tsx` → `DeveloperIllustration` — `isDark` controls SVG colors
- `HeroCanvas.tsx` — `isDark` in dependency array triggers Three.js re-init
- `CursorEffect.tsx` — `isDark` in dependency array re-registers cursor listeners (minor)

---

## Deep Code Walkthrough

### The `willChange` CSS Property

```tsx
// CursorEffect.tsx
<div
  ref={ringRef}
  style={{
    willChange: 'transform',  // ← performance hint
  }}
/>
```

`will-change: transform` tells the browser to promote this element to its own GPU layer **before** it animates. Without it, the browser creates the layer on the first animation frame (causing a brief jank). With it, the layer is ready immediately.

Cost: GPU memory (roughly the element's pixel dimensions × 4 bytes). For a 36×36 cursor ring, this is trivial. For large elements, overusing `will-change` causes more GPU pressure than it saves.

### Direct DOM Manipulation vs. React State

Performance hierarchy for animations:

| Method | Cost | Use When |
|---|---|---|
| Direct `element.style.transform` | Free (GPU composited) | Cursor position, scale |
| CSS `transition`/`animation` | Free (GPU composited) | Hover states, simple transitions |
| React `setState` → CSS property | Virtual DOM diff + paint | When React needs to know the value |
| React `setState` → SVG re-render | Diff + SVG repaint | Head rotation, pupil tracking |

The cursor ring uses direct DOM (best), while the SVG avatar uses setState (necessary because SVG is in React's control).

### HeroCanvas Performance Profile

**What happens at 60fps for 55 particles:**
- 55 position updates
- 55 velocity updates (including mouse repulsion check)
- 1485 pairwise distance comparisons
- New `Float32Array` created for line positions every frame
- One `THREE.BufferAttribute` update
- One WebGL render call

**What could be faster:**
- Reuse the `Float32Array` buffer instead of creating a new one each frame
- Spatial partitioning (grid/quadtree) for line detection instead of O(N²)
- Web Workers for physics calculations (off main thread)

At N=55, none of these optimizations are needed. The current implementation is appropriately simple.

---

## Senior Engineer Perspective

**The chunk splitting is well-designed.** `three` is the largest dependency (~170KB gzipped). Splitting it to its own chunk means it loads in parallel with React. After the first visit, it's cached. New application deployments don't invalidate the Three.js cache.

**The RAF pattern in CursorEffect is correct for production.** A React-state-based cursor (calling `setPosition` on every `mousemove`) would cause 60fps re-renders of the component tree. The direct DOM approach has zero React overhead.

**Missing optimization: image lazy loading.** There are no images in this portfolio (SVG visuals are inline). But if images were added, they should use `loading="lazy"` to defer loading until near-viewport.

**Missing optimization: font display swap.** Google Fonts are loaded with `display=swap` is implicitly included in the Google Fonts URL. This means text renders immediately in a fallback font and swaps to the web font when loaded, preventing invisible text during font load (FOIT).

---

## Common Bugs (Performance-Related)

| Bug | Performance Cause | Fix |
|---|---|---|
| "Too many WebGL contexts" error | `renderer.dispose()` not called on cleanup | Ensure cleanup in HeroCanvas useEffect |
| Memory leak on theme toggle | Old event listeners not removed | Verify `return () => ...` in all useEffects |
| Jank on scroll | Scroll listener not passive | Add `{ passive: true }` |
| Cursor ring jumps on first move | `ringRef.current` null | Only write to ref after mount (useEffect) |
| Visible stagger in skill cards | Network throttling + large bundle | Bundle is the fix — chunks help |

---

## Hands-On Exercises

1. **Measure bundle size:** Run `npm run build`. Open `dist/assets/` and list the files. Which is largest? What's the total gzipped size? (Use `stat` or check file sizes.)
2. **Disable chunk splitting:** In `vite.config.ts`, remove the `manualChunks` config. Rebuild. Compare file sizes. What does the network waterfall look like now?
3. **Profile the cursor:** Open DevTools → Performance. Click Record. Move your mouse rapidly for 3 seconds. Stop recording. Look at the Main thread. Are there any long tasks? What does the CPU time breakdown show?
4. **Test cleanup:** In `HeroCanvas.tsx`, temporarily comment out `renderer.dispose()`. Open DevTools → Memory → Take heap snapshot. Switch theme 5 times. Take another snapshot. Do you see WebGL context memory growing?

---

## Knowledge Prerequisites

| Concept | Why You Need It |
|---|---|
| HTTP/2 multiplexing | Why code splitting helps load times |
| Browser GPU compositing | Why `transform` animations are cheap |
| `requestAnimationFrame` cancellation | How to stop animation loops |
| WebGL context limits | Why `renderer.dispose()` matters |
| `IntersectionObserver` | How `useInView` works under the hood |
| `will-change` CSS property | GPU layer promotion |
