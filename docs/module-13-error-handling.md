# Module 13 — Error Handling

## Purpose

Understand every error handling pattern in this codebase — what errors are caught, what errors are silently swallowed, what errors are logged, and what errors have no handling.

---

## Why It Exists

Error handling reveals the reliability philosophy of a codebase. This portfolio handles errors where it must (email sending), silently swallows errors where crashing would be catastrophic (localStorage), and ignores errors where they're impossible (static data rendering).

---

## Files Involved

| File | Error Handling |
|---|---|
| [`ThemeContext.tsx`](../src/context/ThemeContext.tsx) | Silent `try/catch` for localStorage failures |
| [`Contact.tsx`](../src/components/Contact.tsx) | Full error handling for EmailJS + user feedback |
| [`HeroCanvas.tsx`](../src/components/HeroCanvas.tsx) | Null guard (`if (!el) return`) |
| [`CursorEffect.tsx`](../src/components/CursorEffect.tsx) | Null guard (`if (!visible) return null`) |
| All components | TypeScript non-null assertions (`!`) |

---

## Dependency Map

```
Error Types
  ├── localStorage failures (ThemeContext)
  │     → Silently caught, fallback to time-based theme
  │
  ├── EmailJS send failures (Contact)
  │     → Caught, setStatus('error'), user sees error message
  │     → Auto-resets after 5 seconds
  │
  ├── Null refs (all components with useRef)
  │     → Guarded with early returns
  │
  └── Missing optional data
        → Optional chaining (?.), nullish coalescing (??)
```

---

## Runtime Execution Flow

### localStorage Error Handling

```tsx
// ThemeContext.tsx — 3 separate try/catch blocks

// 1. Reading at initialization
const [theme, setTheme] = useState<Theme>(() => {
  try {
    const isManual = localStorage.getItem(MANUAL_KEY) === 'true'
    const saved    = localStorage.getItem(THEME_KEY) as Theme | null
    if (isManual && (saved === 'light' || saved === 'dark')) return saved
  } catch {}  // ← empty catch — silently falls through
  return getTimeBasedTheme()  // safe default
})

// 2. Writing on theme change
useEffect(() => {
  const root = document.documentElement
  root.classList.toggle('light', theme === 'light')
  root.classList.toggle('dark',  theme === 'dark')
  try { localStorage.setItem(THEME_KEY, theme) } catch {}  // ← write failure is fine

}, [theme])

// 3. Reading in auto-sync
const sync = () => {
  try {
    if (localStorage.getItem(MANUAL_KEY) === 'true') return
  } catch {}  // ← if we can't read, just sync anyway
  setTheme(getTimeBasedTheme())
}
```

**Why silent catches?** `localStorage` can throw in:
- Private browsing mode (Safari restricts storage)
- Storage quota exceeded
- Browser security policies

If it throws during initialization, the fallback `getTimeBasedTheme()` still provides a reasonable default. If it throws on write, the theme still works — it just won't persist across sessions. Showing an error to the user for a failed localStorage write would be terrible UX for something this minor.

### EmailJS Error Handling

```tsx
// Contact.tsx — full error surface
try {
  await Promise.all([
    emailjs.send(EMAILJS.SERVICE_ID, EMAILJS.TEMPLATE_ID, params),
    emailjs.send(EMAILJS.SERVICE_ID, EMAILJS.NOTIFY_TEMPLATE_ID, params),
  ])
  setStatus('success')
  setErrorMessage('')
  formRef.current.reset()
  setTimeout(() => setStatus('idle'), 5000)
} catch (err: any) {
  console.error('[EmailJS]', err)              // ← logs to console for debugging
  setStatus('error')
  setErrorMessage(err?.text || err?.message || 'Unknown error occurred')
  setTimeout(() => {
    setStatus('idle')
    setErrorMessage('')
  }, 5000)
}
```

**Error source extraction:**
```typescript
err?.text || err?.message || 'Unknown error occurred'
```

- `err?.text` — EmailJS SDK error format: `{ status: 400, text: 'Service ID not found' }`
- `err?.message` — Standard JavaScript `Error` format: `{ message: 'Network request failed' }`
- `'Unknown error occurred'` — Last resort fallback

**`console.error('[EmailJS]', err)`** — Logs the full error object to the browser console for debugging. The `[EmailJS]` prefix helps filter when reading console output.

### Null Guard Patterns

**Hard null guard (prevent rendering):**
```tsx
// CursorEffect.tsx
if (!visible) return null  // don't render until cursor has moved
```

**Soft null guard (early return):**
```tsx
// HeroCanvas.tsx
const el = mountRef.current
if (!el) return  // useEffect can fire with null ref in edge cases
```

**Optional chaining in event handlers:**
```tsx
// Hero.tsx
if (!svgRef.current) return  // SVG may not exist during cleanup
```

**Optional chaining for CommandPalette actions:**
```tsx
action: () => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
```
The `?.` means: if `querySelector` returns `null` (element not found), don't call `scrollIntoView`. No error thrown, just silently does nothing.

### TypeScript Non-Null Assertions

```tsx
// main.tsx
createRoot(document.getElementById('root')!).render(...)
```

The `!` asserts "I know this is not null." This is a TypeScript-only assertion — no runtime check. If `#root` doesn't exist, this throws `TypeError: Cannot read properties of null`.

```tsx
// Contact.tsx
const formRef = useRef<HTMLFormElement>(null)
if (!formRef.current) return  // ← explicit check, no !
```

`Contact.tsx` correctly guards the ref with an explicit check rather than a non-null assertion. This is safer.

---

## Data Flow — Error States

```
Contact Form Error State:
  error (EmailJS) → catch → setStatus('error') + setErrorMessage
    → UI renders <AlertCircle> + error text
    → setTimeout 5s → setStatus('idle') + setErrorMessage('')
    → UI returns to initial state

Theme Error State (localStorage):
  localStorage.getItem throws → catch (empty) → falls through to getTimeBasedTheme()
  → Theme still set correctly, just not from persisted value
  → User won't notice

Ref Null Guard:
  ref.current is null → early return from handler → nothing happens
  → Next frame: ref.current may be valid → handler works normally
```

---

## Deep Code Walkthrough

### What Errors Are NOT Handled

1. **SVG rendering errors:** If a malformed SVG transform string is generated, the browser silently ignores it. React doesn't throw.

2. **Three.js WebGL errors:** If WebGL isn't supported, `new THREE.WebGLRenderer()` may throw. Currently no try/catch wraps this. On devices without WebGL, the canvas would fail silently (the `mountRef` div would be empty).

3. **Network errors for Google Fonts:** If fonts.googleapis.com is unavailable, the fonts fall back to browser defaults. No error handling needed.

4. **`navigator.clipboard.writeText` rejection:** In `CopyableLink` and `CommandPalette`, clipboard writes are done without `.catch()`:
```tsx
// Contact.tsx — CopyableLink
navigator.clipboard.writeText(label).then(() => {
  setCopied(true)
  // ...
})
// ↑ No .catch() — clipboard failure is silently ignored
```
If clipboard permission is denied (HTTP, non-secure context), the Promise rejects and nothing happens. Adding `.catch()` would allow a fallback UI.

### The Missing Error Boundary

React has a concept called **Error Boundaries** — class components that catch rendering errors and display a fallback UI instead of crashing the whole page. This codebase has none:

```tsx
// NOT present in this codebase (but could be added)
class ErrorBoundary extends React.Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return <h1>Something went wrong.</h1>
    return this.props.children
  }
}
```

If any component throws during render (rare but possible), the entire React tree would unmount, showing a blank page. For a portfolio, this risk is low — all data is static and rendering is deterministic.

---

## Senior Engineer Perspective

**Silent catches are acceptable for non-critical writes.** `localStorage.setItem` failure is not catastrophic. The theme still works without persistence. Crashing or showing an error for this would be terrible UX.

**The EmailJS error handling is good.** It catches all failures, logs for debugging, shows user-visible feedback, and auto-resets. The only missing piece: retry logic. A transient network error would require the user to manually resubmit.

**Missing: Error Boundary.** A top-level `<ErrorBoundary>` in `App.tsx` would catch catastrophic render failures and show a graceful "Something broke — please refresh" message instead of a blank page. Easy to add, worthwhile for any public-facing app.

**`err: any` in catch blocks.** Using `any` for caught errors is a TypeScript anti-pattern — you lose type safety. The `unknown` type is safer:
```typescript
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : 
    (typeof err === 'object' && err !== null && 'text' in err) ? String((err as any).text) : 
    'Unknown error'
  setErrorMessage(message)
}
```
The current `err: any` approach works but is less type-safe.

---

## Common Bugs

| Bug | Error Handling Gap | Fix |
|---|---|---|
| Blank page on some browsers | No Error Boundary | Add `<ErrorBoundary>` in `App.tsx` |
| Clipboard copy silently fails | No `.catch()` on clipboard API | Add `.catch(() => { /* fallback */ })` |
| No WebGL shown on unsupported device | `THREE.WebGLRenderer` not wrapped | `try { renderer = new WebGLRenderer() } catch { /* hide canvas */ }` |
| Email error message is "Unknown error" | `err.text` and `err.message` both undefined | Log the full `err` object and examine its shape |
| Form shows "Failed: undefined" | `err.text` is `undefined` | Already handled by `?? 'Unknown error occurred'` |

---

## Hands-On Exercises

1. **Trigger the error state:** In `Contact.tsx`, temporarily change `EMAILJS.SERVICE_ID` to `'invalid_service'`. Submit the form. Watch the error state appear. What error message shows?
2. **Add Error Boundary:** Create `src/components/ErrorBoundary.tsx` as a class component. Wrap `<App />` with it in `main.tsx`. Throw an error in `Skills.tsx` render function. Does the boundary catch it?
3. **Handle clipboard failure:** In `CopyableLink`, add `.catch(() => console.warn('Clipboard unavailable'))` after `navigator.clipboard.writeText(...)`. Test by accessing the site over HTTP (not HTTPS) where clipboard API is restricted.
4. **Improve error types:** Change `catch (err: any)` in `Contact.tsx` to `catch (err: unknown)`. Fix the TypeScript errors. This teaches proper error type handling.

---

## Knowledge Prerequisites

| Concept | Why You Need It |
|---|---|
| `try`/`catch` | JavaScript error handling |
| JavaScript `Promise` rejection | `Promise.all` rejects if either sends fail |
| TypeScript `unknown` vs `any` | Type-safe error handling |
| React Error Boundaries | Catching render errors |
| Optional chaining (`?.`) | Safe property access |
| Nullish coalescing (`??`) | Fallback values |
