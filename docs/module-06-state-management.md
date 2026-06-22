# Module 06 — State Management

## Purpose

Understand exactly what state exists in this application, where it lives, how it changes, and why there is no global state library.

---

## Why It Exists

State is any data that can change over time and affects what the UI renders. Every interactive element needs state. This portfolio manages state through three mechanisms: React Context (one piece of global state), local component `useState` (most interactive elements), and mutable `useRef` values (animation loop variables that don't need re-renders).

---

## Files Involved

| File | State Type | State Variables |
|---|---|---|
| [`ThemeContext.tsx`](../src/context/ThemeContext.tsx) | Global (Context) | `theme: 'dark' \| 'light'` |
| [`Nav.tsx`](../src/components/Nav.tsx) | Local | `scrolled`, `menuOpen`, `progress` |
| [`Hero.tsx`](../src/components/Hero.tsx) | Local + Ref | `headState`, `pupil`, `greetIdx`, `chars`, `deleting` |
| [`HeroCanvas.tsx`](../src/components/HeroCanvas.tsx) | Ref only | particle positions + velocities (not state) |
| [`Skills.tsx`](../src/components/Skills.tsx) | Local (InView only) | `inView` (from useInView hook) |
| [`Experience.tsx`](../src/components/Experience.tsx) | Local | `active` (selected principle), `hovered` (in AchievementCard) |
| [`Projects.tsx`](../src/components/Projects.tsx) | Local | `tilt` (per card), `inView` |
| [`ProjectVisuals.tsx`](../src/components/ProjectVisuals.tsx) | Local | `hovered`, `tick` (ExamForge), `pathLen` (Traveloop) |
| [`Contact.tsx`](../src/components/Contact.tsx) | Local | `status`, `errorMessage` |
| [`CommandPalette.tsx`](../src/components/CommandPalette.tsx) | Local | `open`, `query`, `active`, `fired` |
| [`NavLogo.tsx`](../src/components/NavLogo.tsx) | Local | `blink`, `hovered`, `px`, `py` |
| [`CursorEffect.tsx`](../src/components/CursorEffect.tsx) | Local + Ref | `visible` (state), positions (refs) |
| [`ScrollToTop.tsx`](../src/components/ScrollToTop.tsx) | Local | `visible` |

---

## Dependency Map

```
Global State (ThemeContext)
  └── theme: 'dark' | 'light'
        ├── Read by: Nav, Hero, HeroCanvas, CursorEffect
        └── Written by: toggle() called from Nav (2 buttons)

Local State Islands (isolated per component)
  ├── Nav: scrolled, menuOpen, progress
  ├── CommandPalette: open, query, active, fired
  ├── Experience > PrinciplesPanel: active (selected principle index)
  ├── Experience > AchievementCard: hovered (per card)
  ├── Projects > ProjectVisual: tilt {x, y} (per card)
  ├── ProjectVisuals > ExamForgeVisual: hovered, tick
  ├── ProjectVisuals > TraveloopVisual: hovered, pathLen
  ├── ProjectVisuals > BCartVisual: hovered
  ├── Contact: status ('idle'|'sending'|'success'|'error'), errorMessage
  ├── Hero > DeveloperIllustration: headState, pupil, greetIdx, chars, deleting
  ├── NavLogo: blink, hovered, px, py
  ├── CursorEffect: visible
  └── ScrollToTop: visible

Ref-based (animation loops, no re-renders)
  ├── CursorEffect: tx, ty, rx, ry, ringScale, raf
  ├── Hero: targetHead, currentHead, targetPupil, currentPupil, rafRef
  └── HeroCanvas: pos[], vel[], mx, my, raf (all in closure, not even useRef)
```

---

## Runtime Execution Flow

### Theme State Lifecycle

```
1. App mounts → ThemeProvider renders
2. useState(() => { ... }) initializer runs synchronously:
   ├── Read localStorage('portfolio-theme-manual')
   ├── If manual=true: use localStorage('portfolio-theme')
   └── Else: return getTimeBasedTheme()  (dark if hour < 6 or >= 18)

3. useEffect runs after first paint:
   ├── document.documentElement.classList.toggle('light', theme === 'light')
   ├── document.documentElement.classList.toggle('dark', theme === 'dark')
   └── localStorage.setItem('portfolio-theme', theme)

4. Second useEffect sets up auto-sync timer:
   ├── Calculates msToNextMin (aligns to top of next minute)
   ├── setTimeout → fires at next minute → setTheme(getTimeBasedTheme())
   └── setInterval → fires every 60s thereafter
   (only matters if theme hasn't been manually toggled)

5. User clicks theme button → toggle() runs:
   ├── localStorage.setItem('portfolio-theme-manual', 'true')
   └── setTheme(t => t === 'dark' ? 'light' : 'dark')
   (marks preference as manual, disables auto-sync)
```

### Contact Form State Lifecycle

```tsx
// Contact.tsx — the full state machine
type Status = 'idle' | 'sending' | 'success' | 'error'

const [status, setStatus] = useState<Status>('idle')
const [errorMessage, setErrorMessage] = useState<string>('')
```

```
idle
  └── user submits form → setStatus('sending')

sending
  ├── emailjs.send() resolves → setStatus('success'), form.reset()
  │     └── setTimeout 5000ms → setStatus('idle')
  └── emailjs.send() rejects → setStatus('error'), setErrorMessage(err.text)
        └── setTimeout 5000ms → setStatus('idle'), setErrorMessage('')
```

The `status` state drives three UI behaviors:
1. Button text: `'Sending…'` | `'Sent!'` | `'Send Message'`
2. Button `disabled`: true when `'sending'` or `'success'`
3. Feedback message: `<CheckCircle>` on `'success'`, `<AlertCircle>` on `'error'`

### CommandPalette State Lifecycle

```tsx
const [open, setOpen]   = useState(false)
const [query, setQuery] = useState('')
const [active, setActive] = useState(0)      // index of highlighted command
const [fired, setFired] = useState<string | null>(null)  // id of executing command
```

```
Initial: open=false, query='', active=0, fired=null

Ctrl+K pressed:
  → setOpen(p => !p)  // toggle
  → if opening: setTimeout → inputRef.focus()

User types:
  → setQuery(e.target.value)
  → useEffect: setActive(0)  // reset highlight on query change

ArrowDown pressed:
  → setActive(i => Math.min(i + 1, filtered.length - 1))

ArrowUp pressed:
  → setActive(i => Math.max(i - 1, 0))

Enter pressed (or click):
  → run(filtered[active])
        → setFired(cmd.id)   // visual flash
        → setTimeout 180ms:
              cmd.action()   // execute the command
              close()
                → setOpen(false), setQuery(''), setActive(0), setFired(null)

Escape pressed:
  → close() directly
```

---

## Data Flow

### Why No Global State Library (Redux, Zustand, Jotai)?

This portfolio has **exactly one** piece of globally shared state: the theme. A full state library for one variable would be overkill. React Context is the correct tool for one-to-many state sharing with infrequent updates.

The principle: **use the simplest mechanism that works.**

| State Type | Mechanism | Why |
|---|---|---|
| Theme (global) | React Context | Multiple components read it; needs to persist to localStorage |
| Form status | Local `useState` | Only `Contact.tsx` cares about it |
| Nav scroll | Local `useState` | Only `Nav.tsx` cares about it |
| Cursor position | `useRef` | Needs no re-renders (direct DOM manipulation) |
| Three.js particles | Closure variables | Three.js manages its own render loop |

### State That Bypasses React

Some "state" intentionally bypasses React's state system:

**Cursor position** in `CursorEffect.tsx`:
```tsx
let tx = 0, ty = 0    // mutable variables in useEffect closure
let rx = 0, ry = 0    // NOT useState — no re-renders!
const tick = () => {
  rx = lerp(rx, tx, 0.1)
  ry = lerp(ry, ty, 0.1)
  ringRef.current.style.transform = `translate(...)`  // direct DOM write
}
```

**Head rotation target** in `Hero.tsx`:
```tsx
const targetHead = useRef({ rot: 0, ty: 0 })    // target (set on mousemove)
const currentHead = useRef({ rot: 0, ty: 0 })   // current (interpolated in RAF)
const [headState, setHeadState] = useState({ rot: 0, ty: 0 })  // ← ONLY this triggers re-renders

const tick = () => {
  // Refs are updated at 60fps
  currentHead.current.rot += (targetHead.current.rot - currentHead.current.rot) * 0.08
  // Every frame, setState is called to actually update the SVG
  setHeadState({ rot: r(currentHead.current.rot), ty: r(currentHead.current.ty) })
}
```

The head tracking uses a hybrid: refs for smooth interpolation (updated at 60fps without re-renders), then `setState` to commit the final value to React. The `r()` function rounds to 2 decimal places, limiting re-render triggers to when the value meaningfully changes.

---

## Deep Code Walkthrough

### The `getTimeBasedTheme` Function

```tsx
// ThemeContext.tsx
function getTimeBasedTheme(): Theme {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 18 ? 'light' : 'dark'
}
```

Returns `'light'` between 6am and 6pm, `'dark'` outside those hours. This is called:
1. In the `useState` initializer (if no manual preference saved)
2. In the auto-sync interval (every minute, if no manual preference)

### The Manual Override System

Two localStorage keys coordinate the manual override:

```typescript
const MANUAL_KEY = 'portfolio-theme-manual'   // 'true' = user has manually chosen
const THEME_KEY  = 'portfolio-theme'           // 'dark' | 'light'
```

```tsx
// Reading (in useState initializer)
const isManual = localStorage.getItem(MANUAL_KEY) === 'true'
const saved    = localStorage.getItem(THEME_KEY) as Theme | null
if (isManual && (saved === 'light' || saved === 'dark')) return saved
// else: fall through to getTimeBasedTheme()

// Writing (in toggle)
localStorage.setItem(MANUAL_KEY, 'true')   // marks as manual
setTheme(t => t === 'dark' ? 'light' : 'dark')

// Auto-sync checks for manual override
const sync = () => {
  if (localStorage.getItem(MANUAL_KEY) === 'true') return  // bail if manual
  setTheme(getTimeBasedTheme())
}
```

Note: there's no way for the user to "reset" to automatic mode — once `MANUAL_KEY` is set, it stays. This is a minor UX limitation.

### The `useInView` State Pattern

```tsx
const ref = useRef<HTMLDivElement>(null)
const inView = useInView(ref, { once: true, margin: '-60px' })
```

`useInView` from Framer Motion returns a boolean. Internally it:
1. Creates an `IntersectionObserver` on the `ref` element
2. Calls `setState(true)` when the element intersects (with the margin applied)
3. With `once: true`, disconnects the observer after the first intersection

The state `inView` only transitions from `false` to `true`, never back. This guarantees animations only play once, regardless of scrolling behavior.

---

## Senior Engineer Perspective

**Co-located state is correct here.** The alternative — lifting all state up to a global store — would add indirection without benefit. `Nav.tsx`'s `scrolled` state affects only the nav bar. It doesn't belong in a global store.

**The ref/state hybrid in Hero is a legitimate pattern.** Animation values updated at 60fps should not go through React state — the reconciler overhead would cause dropped frames. The pattern used (refs for interpolation, state for final committed values) is the canonical solution.

**The form status as a finite state machine is excellent.** `'idle' | 'sending' | 'success' | 'error'` is a proper FSM. The UI behavior at each state is clearly defined. This is better than using multiple boolean flags (`isLoading`, `isSuccess`, `hasError`) which can enter impossible states.

**Missing: reset to automatic theme.** A minor gap — the user can't go back to the automatic time-based theme once they've manually set it (without clearing localStorage). Adding a "Reset to automatic" button would complete the feature.

---

## Common Bugs

| Bug | State Cause | Fix |
|---|---|---|
| Email form never leaves "sending" state | Promise never resolves/rejects | Check network tab — is the EmailJS request even firing? |
| Theme toggle has no effect | `useTheme()` called outside `ThemeProvider` | Ensure component is inside `<ThemeProvider>` in `App.tsx` |
| Command palette navigation skips items | `setActive` called before `filtered` updates | This can't happen — `setActive(0)` fires when `query` changes (via its own effect) |
| Nav background stays transparent after scroll | `setScrolled` not firing | Passive listener may not be registering — check DevTools |
| SVG avatar head not moving | `targetHead.current` not being set | Verify `window.mousemove` listener is attached |

---

## Hands-On Exercises

1. **Trace the theme toggle:** Add `console.log('Theme is now:', theme)` in `ThemeContext.tsx` inside the `useEffect`. Click the theme button. What gets logged? When?
2. **Inspect the contact form FSM:** Submit the form with the network disconnected (DevTools → Network → Offline). Watch `status` transition. Does it go `idle → sending → error`? Does it reset after 5s?
3. **Find all state that causes re-renders:** Open React DevTools. Enable "Highlight updates". Scroll the page. Which components flash (re-render) on scroll? Are they the ones you expect?
4. **Understand the ref/state split:** In `Hero.tsx > DeveloperIllustration`, change `setHeadState` to `setHeadState` with no rounding: `setHeadState({ rot: currentHead.current.rot, ty: currentHead.current.ty })`. Move your mouse fast. Does anything change visually? What about performance?

---

## Knowledge Prerequisites

| Concept | Why You Need It |
|---|---|
| `useState` and re-renders | Core of local state |
| `useRef` — mutable container | For animation values that don't need re-renders |
| React Context API | How `ThemeContext` shares state |
| `localStorage` API | Theme persistence mechanism |
| Finite state machines | The `Status` type in `Contact.tsx` |
