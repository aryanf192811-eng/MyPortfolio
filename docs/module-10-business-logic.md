# Module 10 — Business Logic

## Purpose

Understand the non-trivial logic that makes this portfolio interactive: the time-aware theme system, the command palette with fuzzy search, the custom cursor physics, the SVG avatar mouse tracking, and the Three.js particle system.

---

## Why It Exists

"Business logic" in a portfolio means all the custom behaviors that differentiate it from a static HTML page. These are the features that required actual engineering decisions: algorithms, event handling, physics simulations, state machines.

---

## Files Involved

| File | Business Logic |
|---|---|
| [`ThemeContext.tsx`](../src/context/ThemeContext.tsx) | Time-based auto-theme + manual override system |
| [`CommandPalette.tsx`](../src/components/CommandPalette.tsx) | Keyboard-driven palette + fuzzy search algorithm |
| [`CursorEffect.tsx`](../src/components/CursorEffect.tsx) | Cursor ring with lerp-smoothed follow + scale on hover |
| [`Hero.tsx`](../src/components/Hero.tsx) | SVG avatar head rotation + pupil tracking (RAF physics) |
| [`NavLogo.tsx`](../src/components/NavLogo.tsx) | Mini avatar blinking + pupil tracking |
| [`HeroCanvas.tsx`](../src/components/HeroCanvas.tsx) | Three.js particle network with mouse repulsion |

---

## Deep Code Walkthrough

### 1. Time-Aware Auto-Theme

```tsx
// ThemeContext.tsx
function getTimeBasedTheme(): Theme {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 18 ? 'light' : 'dark'
}
```

**What it does:** Returns `'light'` between 6am–6pm local time, `'dark'` otherwise.

**The auto-sync system:**
```tsx
useEffect(() => {
  const sync = () => {
    try {
      if (localStorage.getItem(MANUAL_KEY) === 'true') return  // user override wins
    } catch {}
    setTheme(getTimeBasedTheme())
  }

  // Align first tick to top of next minute for precision
  const now = new Date()
  const msToNextMin = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
  const timeout = setTimeout(() => {
    sync()
    const interval = setInterval(sync, 60_000)  // check every minute thereafter
    return () => clearInterval(interval)
  }, msToNextMin)

  return () => clearTimeout(timeout)
}, [])
```

**Why align to the minute boundary?** If the interval started immediately, it would check at irregular times. By waiting until the top of the next minute, then starting a 60-second interval, the theme can switch precisely at 6:00:00 AM or 6:00:00 PM.

**The 3-tier persistence hierarchy:**
1. User has manually toggled (`MANUAL_KEY === 'true'`) → use saved `THEME_KEY`
2. No manual preference → use `getTimeBasedTheme()` right now
3. `localStorage` throws → fall through to `getTimeBasedTheme()`

### 2. Command Palette Fuzzy Search

```tsx
// CommandPalette.tsx
function fuzzy(query: string, target: string): boolean {
  if (!query) return true        // empty query = match all
  const q = query.toLowerCase()
  const t = target.toLowerCase()
  if (t.includes(q)) return true // substring match (faster path)
  
  // Sequential character match
  let qi = 0  // query index
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++
  }
  return qi === q.length  // all query chars found in order
}
```

**Two matching strategies:**
1. **Substring:** `fuzzy('proj', 'Projects')` → `'projects'.includes('proj')` → `true`
2. **Sequential:** `fuzzy('pjs', 'Projects')` → p...j...s all appear in order → `true`

**Where keywords expand matching:**
```tsx
const filtered = COMMANDS.filter(c =>
  fuzzy(query, c.label + ' ' + (c.description ?? '') + ' ' + (c.keywords ?? ''))
)
// Command keywords example:
{ id: 'nav-projects', keywords: 'bcart examforge traveloop erp' }
// So searching "bcart" finds the Projects section even though label is "Projects"
```

**The `fired` state for visual feedback:**
```tsx
const run = useCallback((cmd: Command) => {
  setFired(cmd.id)        // visually highlights the item being executed
  setTimeout(() => {
    cmd.action()           // execute the command (e.g., scroll to section)
    close()                // close the palette
  }, 180)                  // 180ms delay for the visual flash
}, [close])
```

The 180ms delay gives the "fired" background color time to appear before the palette closes and the scroll happens. Without this, the flash would be invisible.

### 3. Custom Cursor Physics

```tsx
// CursorEffect.tsx
let tx = 0, ty = 0   // target position (set instantly on mousemove)
let rx = 0, ry = 0   // ring position (lerp-smoothed, lags behind target)

const tick = () => {
  raf = requestAnimationFrame(tick)
  // Linear interpolation: move 10% of remaining distance each frame
  rx = lerp(rx, tx, 0.1)  // at 60fps: rx approaches tx but never catches instantly
  ry = lerp(ry, ty, 0.1)
  if (ringRef.current) {
    ringRef.current.style.transform = `translate(${rx - 18}px, ${ry - 18}px) scale(${ringScale.current})`
  }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
```

**Exponential smoothing (lerp at fixed rate):** At each frame, the ring moves 10% of the distance between itself and the cursor. This creates an elastic, trailing effect. The closer the ring gets, the slower it moves (because 10% of a small distance is very small). It never exactly reaches the target, but gets close enough to be imperceptible.

**Ring scale on interactive elements:**
```tsx
const ringScale = useRef(1)   // normal size
const grow = () => { ringScale.current = 1.65 }   // 65% larger on hover
const shrink = () => { ringScale.current = 1 }

const links = document.querySelectorAll('a, button, [role="button"]')
links.forEach(el => {
  el.addEventListener('mouseenter', grow)
  el.addEventListener('mouseleave', shrink)
})
```

This is registered once in `useEffect` — a snapshot of all interactive elements at mount time. Elements added dynamically after mount would not get the grow/shrink behavior.

### 4. SVG Avatar Head Tracking

```tsx
// Hero.tsx — DeveloperIllustration — the head physics system

// Refs for smooth interpolation (no re-renders from these)
const targetHead  = useRef({ rot: 0, ty: 0 })    // where we want the head to be
const currentHead = useRef({ rot: 0, ty: 0 })    // where the head currently is
// State for the actual SVG update (causes re-render)
const [headState, setHeadState] = useState({ rot: 0, ty: 0 })

const handleMouse = (e: MouseEvent) => {
  // Normalize: 0 = left edge, 1 = right edge, 0.5 = center
  const normX = (e.clientX / window.innerWidth - 0.5) * 2  // -1 to +1
  const normY = (e.clientY / window.innerHeight - 0.5) * 2

  targetHead.current.rot = normX * 14   // max ±14° rotation
  targetHead.current.ty  = normY * 6    // max ±6px nod
}

const tick = () => {
  const S = 0.08  // spring constant (8% per frame)
  currentHead.current.rot += (targetHead.current.rot - currentHead.current.rot) * S
  currentHead.current.ty  += (targetHead.current.ty  - currentHead.current.ty)  * S

  const r = (v: number) => Math.round(v * 100) / 100  // round to 2 decimals
  setHeadState({ rot: r(currentHead.current.rot), ty: r(currentHead.current.ty) })
  rafRef.current = requestAnimationFrame(tick)
}
```

**The SVG transform application:**
```tsx
// The head rotates around the chin (pivot point at bottom of head circle)
const headRotate = `rotate(${headState.rot}, 180, 126)`  // SVG rotate(angle, cx, cy)

<g transform={`translate(0, ${headState.ty})`}>   // nod (vertical)
  <g transform={headRotate}>                       // turn (horizontal)
    <circle cx="180" cy="84" r="42" />             // head
    {/* ... all head features ... */}
  </g>
</g>
```

The neck is a separate, static rectangle — it doesn't rotate. The head overlaps it and uses `fill="var(--bg)"` to visually hide the neck top, creating the illusion of a neck that the head sits on.

### 5. Pupil Tracking

```tsx
// Pupil position calculation
const svgX = ((e.clientX - rect.left) / rect.width) * 360   // cursor in SVG space
const svgY = ((e.clientY - rect.top)  / rect.height) * 420  // (viewBox is 360×420)

// Left eye center is at (167, 80) in SVG coordinates
const dx = svgX - 167
const dy = svgY - 80
const dist = Math.sqrt(dx * dx + dy * dy) || 1

const MAX = 2.6                          // max pupil travel (pixels in SVG space)
const scale = Math.min(MAX, dist) / dist // clamp to MAX
targetPupil.current = { x: dx * scale, y: dy * scale }

// Rendered:
const LP = { x: 168 + pupil.x, y: 80 + pupil.y }   // left pupil position
const RP = { x: 194 + pupil.x, y: 80 + pupil.y }   // right pupil (same offset)
<ellipse cx={LP.x} cy={LP.y} rx="2.8" ry="3.2" />
```

The `scale` calculation ensures pupils never travel more than 2.6 SVG units from center, regardless of how far the cursor is.

### 6. Three.js Particle Network

```tsx
// HeroCanvas.tsx
const N = 55           // number of particles
const MAX_LINK = 130   // max distance to draw a line between two particles
const REPEL_R = 90     // mouse repulsion radius
const REPEL_F = 0.5    // repulsion force strength

// Each frame:
for (let i = 0; i < N; i++) {
  const p = pos[i], v = vel[i]
  
  // Mouse repulsion
  const dx = p.x - mx, dy = p.y - my
  const d = Math.sqrt(dx * dx + dy * dy) || 1
  if (d < REPEL_R) {
    const f = ((REPEL_R - d) / REPEL_R) * REPEL_F  // force decreases with distance
    v.x += (dx / d) * f
    v.y += (dy / d) * f
  }
  
  v.multiplyScalar(0.97)  // damping: velocity decays 3% per frame
  p.add(v)                // position += velocity
  
  // Bounce off walls
  if (p.x < -W / 2) { p.x = -W / 2; v.x *= -1 }
  // ...
}

// Line drawing: O(N²) — check every pair
const la: number[] = []
for (let i = 0; i < N; i++)
  for (let j = i + 1; j < N; j++)
    if (pos[i].distanceTo(pos[j]) < MAX_LINK)
      la.push(pos[i].x, pos[i].y, 0, pos[j].x, pos[j].y, 0)

lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(la), 3))
```

**The O(N²) line check:** For 55 particles, that's 55×54/2 = 1485 distance checks per frame. At 60fps that's ~89,100 distance calculations per second. This is acceptable for N=55 but would become a performance issue at N=200+.

---

## Runtime Execution Flow Summary

```
CursorEffect.tsx:
  mousemove → (tx, ty) updated → RAF tick: lerp (rx,ry) → DOM write

Hero.tsx DeveloperIllustration:
  mousemove → (targetHead, targetPupil) refs updated → RAF tick: lerp → setHeadState/setPupil → SVG re-render

HeroCanvas.tsx:
  mousemove → (mx, my) closure vars updated → RAF tick: physics + Three.js render

NavLogo.tsx:
  setTimeout loop: setBlink(true) → 130ms → setBlink(false) → reschedule
  mousemove → setPx/setPy → pupil position in SVG

CommandPalette.tsx:
  Ctrl+K → setOpen(true)
  typing → setQuery → filtered (computed) → results list
  Arrow keys → setActive → highlight
  Enter → run → setTimeout → action() → close()
```

---

## Senior Engineer Perspective

**The lerp cursor pattern is industry standard.** Liquid, elastic cursor effects are common in premium web design. The implementation here (refs + RAF + direct DOM) is the correct approach — no React state overhead.

**The head tracking uses a spring simulation.** The 8% per-frame interpolation is a first-order spring (linear interpolation, not true spring physics). A true spring would have overshoot (oscillation) which feels more natural but requires two state variables (position and velocity) and more math. The linear interpolation is a reasonable approximation.

**The Three.js particle count is conservative.** 55 particles is well within budget. The O(N²) line check is the limiting factor — at 55 particles it's fast; at 200+ it would need spatial partitioning (quadtree, grid).

**The typewriter in the SVG is clever.** Instead of an HTML element overlaid on the SVG, the typewriter text is an SVG `<text>` element. The blinking cursor is an SVG `<rect>` with an `<animate>` child. This keeps all the illustration in one SVG DOM subtree.

---

## Common Bugs

| Bug | Root Cause | File |
|---|---|---|
| Cursor ring doesn't grow on links | Links added after mount not registered | `CursorEffect.tsx` — re-run effect when DOM changes |
| Head doesn't move at small cursor positions | Normalization math off | Check `normX = (e.clientX / window.innerWidth - 0.5) * 2` |
| Particles accumulate at walls | Bounce logic wrong | Check `v.x *= -1` when wall is hit |
| Command fires but nothing happens | `action()` throws, caught by RAF | Add try/catch around `cmd.action()` |
| Theme flips at wrong time | `getTimeBasedTheme` uses local time not user timezone | This is actually correct behavior — it uses the visitor's clock |

---

## Hands-On Exercises

1. **Change cursor smoothing:** In `CursorEffect.tsx`, change `lerp(rx, tx, 0.1)` to `0.3`. The cursor becomes snappier. Change to `0.03` — it becomes very sluggish. Observe the difference.
2. **Extend head tilt range:** In `Hero.tsx`, change `targetHead.current.rot = normX * 14` to `normX * 30`. The head tilts more dramatically. Find a comfortable value between 14 and 30.
3. **Add a particle:** In `HeroCanvas.tsx`, change `const N = 55` to `const N = 100`. What happens to performance? Use DevTools Performance tab to measure.
4. **Add a new command to the palette:** Add an entry to `COMMANDS` in `CommandPalette.tsx` that opens `https://aryan.dev` (hypothetical). Test it with keyboard navigation.
5. **Break the fuzzy search:** In the `fuzzy` function, remove the `t.includes(q)` fast path. Does anything change for users? Only performance for very long exact queries. Why?

---

## Knowledge Prerequisites

| Concept | Why You Need It |
|---|---|
| `requestAnimationFrame` | All animation loops use it |
| Linear interpolation (lerp) | Cursor and head smoothing |
| SVG coordinate system | Head rotation, pupil tracking |
| Three.js basics (BufferGeometry, Points, LineSegments) | HeroCanvas |
| The `useRef` pattern for non-reactive values | Ref-based animation state |
