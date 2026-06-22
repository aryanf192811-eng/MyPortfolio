# Study Roadmap

> A structured learning path to understand the `aryan-portfolio` codebase at both implementation and architecture levels. Assumes HTML, CSS, and basic JavaScript knowledge. Does NOT assume React, TypeScript, or modern tooling knowledge.

---

## Your Starting Point

You know:
- HTML (`<div>`, `<section>`, `<a href>`, `<form>`)
- CSS (selectors, `display: flex`, `color`, `margin`)
- Basic JavaScript (variables, functions, `if/else`, `document.getElementById`)

You don't know:
- React (components, JSX, hooks)
- TypeScript (type annotations, interfaces)
- Module bundlers (Vite, Webpack)
- Modern JavaScript APIs (`requestAnimationFrame`, `IntersectionObserver`, `navigator.clipboard`)
- Animation libraries (Framer Motion)
- 3D rendering (Three.js)

---

## Phase 1 — JavaScript Foundations (before React)

Before touching any React code, fill these gaps. These concepts appear throughout the codebase.

### 1.1 — Modern JavaScript (ES2015+)

**Study:**
- Arrow functions: `() => {}`
- Destructuring: `const { isDark, toggle } = useTheme()`
- Spread operator: `...items`
- Template literals: `` `rotate(${headState.rot}, 180, 126)` ``
- Optional chaining: `err?.text`
- Nullish coalescing: `TECH_COLORS[name] ?? '#666666'`
- `async/await` and Promises

**Where they appear in this codebase:**
- Optional chaining: `Contact.tsx:79` (`err?.text || err?.message`)
- Template literals: `Hero.tsx:117` (SVG transform string)
- Destructuring: `ThemeContext.tsx:17` (`const { isDark } = useTheme()`)

### 1.2 — Browser APIs

**Study:**
- `requestAnimationFrame(callback)` — frame-by-frame animation
- `window.addEventListener('scroll', handler, { passive: true })`
- `localStorage.getItem/setItem`
- `document.querySelector('#id')`
- `navigator.clipboard.writeText(text)`
- `new Date().getHours()`
- `FormData`

**Where they appear:**
- `CursorEffect.tsx:29` — `requestAnimationFrame(tick)`
- `Nav.tsx:28` — `window.addEventListener('scroll', ...)`
- `ThemeContext.tsx:25` — `localStorage.getItem('portfolio-theme')`
- `CommandPalette.tsx:22` — `document.querySelector('#about')?.scrollIntoView(...)`

### 1.3 — Linear Interpolation (Math)

This is used in the cursor and head tracking animations. Very simple math:

```javascript
function lerp(current, target, factor) {
  return current + (target - current) * factor
}
// lerp(0, 100, 0.1) = 10
// lerp(10, 100, 0.1) = 19
// lerp(19, 100, 0.1) = 27.1
// ... approaches 100 but never exactly reaches it
```

**Where it appears:** `CursorEffect.tsx:26` (`a + (b - a) * t`)

---

## Phase 2 — React Fundamentals

### 2.1 — What React Is

React is a library for building UIs from components. A component is a function that returns JSX (HTML-like syntax in JavaScript):

```jsx
function MyComponent() {
  return <div>Hello World</div>
}
```

**First file to read:** `src/components/Footer.tsx` — the simplest component in the project (46 lines, no hooks, just JSX).

### 2.2 — JSX

JSX compiles to JavaScript function calls. These are equivalent:
```jsx
<h1 style={{ color: 'red' }}>Hello</h1>
React.createElement('h1', { style: { color: 'red' } }, 'Hello')
```

Differences from HTML:
- `class` → `className`
- `style` takes an object, not a string: `style={{ color: 'red' }}` not `style="color: red"`
- All tags must be self-closed or have a closing tag

**First file to read after Footer:** `src/components/ScrollToTop.tsx` — 43 lines, one `useState`, one `useEffect`.

### 2.3 — `useState`

State is data that can change and triggers a re-render:

```jsx
const [count, setCount] = useState(0)  // [currentValue, setterFunction]
```

When you call `setCount(1)`, React re-renders the component with `count = 1`.

**Where to see it:** `Contact.tsx:48` — `const [status, setStatus] = useState('idle')`

### 2.4 — `useEffect`

Runs code after the component renders (or after certain values change):

```jsx
useEffect(() => {
  // runs after render
  window.addEventListener('scroll', handler)
  
  return () => {
    // cleanup: runs before next effect OR when component unmounts
    window.removeEventListener('scroll', handler)
  }
}, [])  // [] = only runs once, on mount
```

**Where to see it:** `Nav.tsx:22-30` — scroll listener.

### 2.5 — `useRef`

A container that holds a value WITHOUT causing re-renders:

```jsx
const countRef = useRef(0)     // { current: 0 }
countRef.current = 1           // no re-render
console.log(countRef.current)  // 1
```

Also used to get a reference to a DOM element:

```jsx
const divRef = useRef(null)
<div ref={divRef}>...</div>
// divRef.current is now the actual DOM <div> element
```

**Where to see it:** `CursorEffect.tsx:5-6` — `ringRef`, `dotRef` for direct DOM manipulation.

---

## Phase 3 — Read the Codebase in This Order

### Week 1 — Simple to Medium Components

**Day 1:** [`src/components/Footer.tsx`](../src/components/Footer.tsx)
- Goal: Understand JSX, mapped arrays, conditional rendering
- Look for: `{ ... }` expressions in JSX, `.map()` returning JSX

**Day 2:** [`src/components/ScrollToTop.tsx`](../src/components/ScrollToTop.tsx)
- Goal: Understand `useState`, `useEffect`, event listeners
- Look for: `setVisible`, `window.addEventListener`

**Day 3:** [`src/context/ThemeContext.tsx`](../src/context/ThemeContext.tsx)
- Goal: Understand React Context, `useState` with initializer function
- Look for: `createContext`, `useContext`, `localStorage`
- External study: [React Context documentation](https://react.dev/learn/passing-data-deeply-with-context)

**Day 4:** [`src/components/Nav.tsx`](../src/components/Nav.tsx)
- Goal: Understand scroll listener, conditional styles, AnimatePresence
- Look for: `setScrolled(window.scrollY > 30)`, `isDark ? ... : ...`

**Day 5:** [`src/components/Skills.tsx`](../src/components/Skills.tsx)
- Goal: Understand `useInView`, Framer Motion, variants/stagger
- Look for: `useInView(ref, { once: true })`, `staggerChildren: 0.055`

### Week 2 — Complex Components

**Day 1:** [`src/components/Contact.tsx`](../src/components/Contact.tsx)
- Goal: Understand async form handling, Promise.all, error handling
- Look for: `handleSubmit`, `setStatus`, `await Promise.all`
- Read first: [Module 07](./module-07-data-fetching.md) and [Module 09](./module-09-forms-and-validation.md)

**Day 2:** [`src/components/CommandPalette.tsx`](../src/components/CommandPalette.tsx)
- Goal: Understand keyboard handling, fuzzy search, `useCallback`
- Look for: `fuzzy()` function, `onKeyDown`, `useCallback`
- Read first: [Module 10](./module-10-business-logic.md)

**Day 3:** [`src/components/Experience.tsx`](../src/components/Experience.tsx)
- Goal: Understand compound components, `AnimatePresence mode="wait"`
- Look for: `PrinciplesPanel`, `setActive`, `AnimatePresence`

**Day 4:** [`src/components/Projects.tsx`](../src/components/Projects.tsx) + [`ProjectVisuals.tsx`](../src/components/ProjectVisuals.tsx)
- Goal: Understand 3D CSS transforms, animated SVG
- Look for: `perspective(900px) rotateX()`, `motion.line`, `strokeDashoffset`

**Day 5:** [`src/components/Hero.tsx`](../src/components/Hero.tsx)
- Goal: Understand RAF physics, SVG transforms, react-type-animation
- Look for: `requestAnimationFrame`, `targetHead.current`, `setHeadState`
- This is the most complex component — re-read it multiple times

### Week 3 — Infrastructure and Advanced

**Day 1:** [`src/components/CursorEffect.tsx`](../src/components/CursorEffect.tsx)
- Goal: Understand direct DOM manipulation + RAF (no React state for position)
- Look for: `let tx = 0, ty = 0` (not useState), `ringRef.current.style.transform`

**Day 2:** [`src/components/HeroCanvas.tsx`](../src/components/HeroCanvas.tsx)
- Goal: Understand Three.js lifecycle, WebGL setup, particle physics
- External study: [Three.js fundamentals](https://threejs.org/manual/#en/fundamentals)
- Look for: `WebGLRenderer`, `BufferGeometry`, `cancelAnimationFrame`, `renderer.dispose()`

**Day 3:** [`src/main.tsx`](../src/main.tsx) + [`src/App.tsx`](../src/App.tsx) + [`vite.config.ts`](../vite.config.ts)
- Goal: Understand bootstrap sequence, chunk splitting
- Read: [Module 02](./module-02-entrypoint-and-bootstrap.md) and [Module 14](./module-14-configuration.md)

**Day 4:** [`src/index.css`](../src/index.css)
- Goal: Understand CSS custom properties as a design system
- Look for: `:root`, `html.light`, `var(--bg)`, responsive grid breakpoints
- Read: [Module 05](./module-05-component-system.md)

**Day 5:** [`runtime-traces.md`](./runtime-traces.md) — read all 17 traces

---

## Phase 4 — Hands-On Exercises

After reading, these exercises verify understanding. Do them in order.

### Exercise 1 — Change the Theme Trigger Time
**File:** `src/context/ThemeContext.tsx`
**Task:** Change the theme to dark between 20:00–07:59, light between 08:00–19:59.
**Solution location:** `getTimeBasedTheme()` function, change `hour >= 6 && hour < 18`.

### Exercise 2 — Add a New Tech Color
**File:** `src/lib/techColors.ts`
**Task:** Add `'Bun'` with color `'#fbf0df'`. Add `'Bun'` to the Infrastructure group in `Skills.tsx`. Verify the correct color appears.

### Exercise 3 — Add a New Command to the Palette
**File:** `src/components/CommandPalette.tsx`
**Task:** Add a command that opens `https://github.com/aryanf192811-eng` in a new tab. Group: `'Actions'`. Test with `Ctrl+K` → type "github" → Enter.

### Exercise 4 — Add a New Project
**File:** `src/components/Projects.tsx`
**Task:** Add a 4th project (a fictional one) to `PROJECTS`. Include at least 3 stack technologies. See it render automatically with letter initials.

### Exercise 5 — Fix the FOUC (Flash of Unstyled Content)
**File:** `index.html` + `src/context/ThemeContext.tsx`
**Task:** Add a blocking inline `<script>` in `<head>` that reads `localStorage.getItem('portfolio-theme')` and applies the class to `<html>` before the page renders. This prevents the white flash on dark theme reload.

### Exercise 6 — Add an Error Boundary
**File:** New `src/components/ErrorBoundary.tsx`
**Task:** Create a class-based Error Boundary component. Wrap `<App />` with it in `main.tsx`. Temporarily throw an error in `Skills.tsx`. Verify the boundary catches it.

### Exercise 7 — Extract the PROJECTS Data
**Task:** Move the `PROJECTS` array from `Projects.tsx` to a new file `src/data/projects.ts`. Export it and import it in `Projects.tsx`. The UI should be unchanged.

### Exercise 8 — Add a New Section
**Task:** Create a `Testimonials.tsx` section component with a simple list of 2 fictional testimonials. Add it to `App.tsx` between Projects and Contact. Add a nav link and command palette entry.

### Exercise 9 — Understand the Build
**Task:** Run `npm run build`. Examine `dist/assets/`. What's the largest file? What's the total size? Now add `console.log('app version:', '1.0')` to `App.tsx` and rebuild. Which file changed hash? Why?

### Exercise 10 — Performance Profiling
**Task:** Open DevTools → Performance → Record for 5 seconds (move mouse around, scroll). Stop recording. Identify:
1. How many RAF frames are running per second?
2. Which component causes the most "Paint" work?
3. Is there any Long Task (>50ms) on the main thread?

---

## Concepts to Study Externally

These concepts appear in the codebase and benefit from external study:

| Concept | Good Resource | Appears In |
|---|---|---|
| React `useEffect` cleanup | react.dev/learn | All components with event listeners |
| React Context API | react.dev/learn | `ThemeContext.tsx` |
| Framer Motion basics | framer.com/docs/animation | Every section component |
| `requestAnimationFrame` | MDN Web Docs | `CursorEffect.tsx`, `Hero.tsx` |
| SVG transforms | MDN: SVG transform attribute | `Hero.tsx` DeveloperIllustration |
| Three.js WebGL basics | threejs.org/manual | `HeroCanvas.tsx` |
| CSS `IntersectionObserver` | MDN Web Docs | What `useInView` uses internally |
| TypeScript interfaces | typescriptlang.org/docs | `Projects.tsx` Project interface |
| `Promise.all` | MDN Web Docs | `Contact.tsx` |
| CSS `grid` layout | MDN Web Docs | `index.css` layout grids |
| CSS `clamp()` | MDN Web Docs | `Hero.tsx` font sizes |
| Linear interpolation | Wikipedia / 3Blue1Brown | `CursorEffect.tsx` |

---

## After Completing the Roadmap

By the end, you should be able to:

1. **Explain to someone else:** How the theme switches between dark and light mode and how it persists preferences.
2. **Modify confidently:** Add a new project, update skills, change color themes without breaking anything.
3. **Debug:** Given a bug report ("contact form shows success but email never arrives"), trace the exact code path to identify the root cause.
4. **Extend:** Add a new feature (testimonials, blog, case study) following the existing patterns.
5. **Evaluate:** Understand *why* specific decisions were made (RAF over React state, CSS tokens over JS theming, no router) and articulate the tradeoffs.

---

## Quick Reference: Where to Find Things

| "Where is..." | File | Line |
|---|---|---|
| The theme toggle logic | `ThemeContext.tsx` | `toggle()` function ~L63 |
| The contact form handler | `Contact.tsx` | `handleSubmit()` ~L51 |
| The fuzzy search algorithm | `CommandPalette.tsx` | `fuzzy()` function ~L84 |
| The cursor lerp | `CursorEffect.tsx` | `tick()` ~L28 |
| The head rotation physics | `Hero.tsx` | `tick()` in DeveloperIllustration ~L66 |
| Three.js particle physics | `HeroCanvas.tsx` | `tick()` ~L68 |
| The design token values | `index.css` | `:root` block ~L4 |
| All EmailJS config | `emailConfig.ts` | entire file |
| All tech colors | `techColors.ts` | `TECH_COLORS` constant |
| Project data | `Projects.tsx` | `PROJECTS` constant ~L26 |
| Command palette commands | `CommandPalette.tsx` | `COMMANDS` constant ~L16 |
| Engineering principles | `Experience.tsx` | `PRINCIPLES` constant ~L39 |
