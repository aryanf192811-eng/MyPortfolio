# Senior Engineer Notes

> Architectural review of the `aryan-portfolio` codebase. Every decision, its rationale, its tradeoffs, and what I would change or keep if this were a production system.

---

## Decision 01 — No Router (Scroll-Based SPA)

**What was chosen:** Anchor-based navigation (`href="#section-id"`) with `scroll-behavior: smooth`. No React Router, no TanStack Router.

**Why it was chosen:**
- A portfolio is a single document. Five sections don't warrant a routing system.
- The content is linear — visitors are expected to scroll, not jump to specific pages.
- Eliminates 50KB+ of routing library from the bundle.
- Removes complexity: no route guards, no loader functions, no redirects, no 404 handling.

**Benefits:**
- Instant navigation (CSS scroll, no JavaScript route transition)
- Hash URLs work for sharing: `portfolio.com/#projects` scrolls on load
- Zero setup — it's just HTML anchor mechanics

**Drawbacks:**
- No programmatic route guards (can't hide sections from unauthorized users)
- History navigation is limited — back/forward works via hash changes only
- SEO is limited to a single URL (all content at `/`)

**Alternatives:**
- React Router v6 with `createBrowserRouter` — necessary if the portfolio had distinct pages (blog posts, project case studies)
- Next.js with file-based routing — necessary for SSR/SSG to index content pages in search engines

**Scaling implications:**
If this portfolio grows into a blog with many posts, routing becomes necessary. At that point, Next.js with the App Router would be the natural evolution — posts become dynamic routes, the portfolio page becomes `app/page.tsx`.

**Verdict:** ✅ Correct decision for this project's scale and use case.

---

## Decision 02 — CSS Custom Properties as Design Tokens

**What was chosen:** A single `index.css` file with CSS custom properties under `:root` (dark) and `html.light` (light override). All components use `var(--bg)`, `var(--text)`, etc.

**Why it was chosen:**
- Zero JavaScript in the theme-switching render path — one class swap cascades everywhere
- Design tokens live in one place; inconsistency is structurally impossible
- Tailwind-compatible (Tailwind v4 uses CSS custom properties internally)
- Inspectable in DevTools — any engineer can see the current token values

**Benefits:**
- Theme switching is instantaneous (CSS cascade, not React re-renders)
- Adding a new color theme requires only a new `html.my-theme { ... }` block
- All interactivity (hover, focus, animation) works against the same token set

**Drawbacks:**
- No compile-time validation that a token exists — a typo in `var(--typo)` fails silently at runtime
- No TypeScript type safety for token names (contrast: Stitches.js, vanilla-extract)
- Mixing inline styles and CSS classes makes it harder to find all uses of a token

**Alternative: Tailwind CSS only**
This project already imports Tailwind v4 but uses it minimally (the `@import "tailwindcss"` brings in utilities but they're rarely used — most styling is inline or in bespoke CSS classes). Pure Tailwind would make theming harder (dark mode with `dark:` prefix on every element vs. one CSS class).

**Alternative: CSS-in-JS (styled-components, Stitches)**
Provides type safety for tokens and co-location of styles with components. Cost: runtime style injection, bundle size, SSR complexity.

**Verdict:** ✅ CSS custom properties are the right choice for this scale. At a multi-team design system level, a typed token system (style-dictionary, vanilla-extract) would be worth the complexity.

---

## Decision 03 — `requestAnimationFrame` for Animation Loops

**What was chosen:** Three separate RAF loops running concurrently:
1. `CursorEffect.tsx` — cursor ring position (lerp smoothing)
2. `Hero.tsx > DeveloperIllustration` — head rotation + pupil tracking (spring physics)
3. `HeroCanvas.tsx` — Three.js particle simulation

**Why it was chosen:**
- React state updates at 60fps would cause excessive reconciliation
- Direct DOM manipulation (`element.style.transform`) bypasses the virtual DOM entirely
- RAF is the browser's preferred animation API — automatically pauses when tab is backgrounded
- Spring physics (lerp) creates natural-feeling movement without a physics library

**Benefits:**
- True 60fps animations without React overhead
- Tab backgrounding automatically pauses loops (browser optimization)
- Clean separation: Three.js manages its canvas, React manages its DOM

**Drawbacks:**
- Three concurrent RAF loops increase CPU usage on low-powered devices
- Memory leak risk if cleanup functions are not implemented correctly
- Complexity: mixing RAF + React state (head rotation uses both) is easy to get wrong

**Tradeoff analysis: Head rotation hybrid**
The head rotation uses refs for physics (no re-renders at 60fps) but then calls `setState` once per frame with the final value. This is a performance compromise: ideally, you'd update the SVG attributes directly (no React), but the SVG is in React's control (JSX), so you need React state to update it.

**Alternative: Framer Motion's `useSpring` / `useMotionValue`**
Framer Motion exposes reactive values that update without re-renders. The cursor could use `useMotionValue` + `useSpring` instead of manual RAF:
```tsx
const x = useMotionValue(0)
const springX = useSpring(x, { stiffness: 100, damping: 20 })
// on mousemove: x.set(e.clientX)
```
This would eliminate the manual RAF loop. The tradeoff: adds Framer Motion API surface area and may be less performant than direct DOM writes.

**Verdict:** ✅ Manual RAF is correct for cursor effects. For head rotation, Framer Motion's motion values would be cleaner but less educational.

---

## Decision 04 — Static Data in TypeScript Files

**What was chosen:** All content (projects, skills, experience, commands) is hardcoded in TypeScript constant arrays within component files or adjacent to them.

**Why it was chosen:**
- No CMS infrastructure to maintain
- Type-checked content (TypeScript validates the `Project` interface)
- Git history tracks content changes
- Instant data access — no network requests, no loading states
- Updating content = editing a file + pushing to git

**Benefits:**
- Zero runtime cost for data access
- TypeScript prevents malformed content at compile time
- Content changes are auditable in git
- No CMS account, no monthly fees, no API keys for content

**Drawbacks:**
- Aryan must know how to use git to update his portfolio
- No content preview without running the dev server
- Content and code are coupled — a non-engineer can't update content
- No versioned content history separate from code history

**Alternative: Headless CMS (Contentful, Sanity, Prismic)**
Pros: non-engineers can update content, content preview, structured content types, media management.
Cons: monthly cost ($20-200/month), API keys to manage, additional complexity, potential downtime.

**Alternative: MDX files**
Content as Markdown+JSX files in the repo. Still requires git but separates content from component code. Good for blog posts; overkill for a few static arrays.

**Verdict:** ✅ Static TypeScript is correct for a personal portfolio. Would change to Sanity or similar if a non-technical person needed to manage content.

---

## Decision 05 — Vite Manual Chunk Splitting

**What was chosen:** Three vendor chunks (react, framer-motion, three.js) manually defined in `vite.config.ts`.

**Why it was chosen:**
- Three.js alone is ~350KB gzipped — separating it allows it to be cached independently
- React is a stable dependency — caching separately means only app code invalidates on deploys
- Without splitting, one large bundle loads sequentially; with splitting, chunks load in parallel

**Benefits:**
- Vendor caches survive application code updates
- Parallel download of multiple smaller files (HTTP/2)
- Clear separation between "stable dependencies" and "application code"

**Drawbacks:**
- Explicit configuration — must be updated when new large dependencies are added
- Too many chunks can increase HTTP connection overhead (though HTTP/2 mitigates this)

**The `chunkSizeWarningLimit: 800` setting:**
Without this, Vite would warn that Three.js (~350KB) exceeds its 500KB warning threshold. The warning is accurate but expected — raising the limit suppresses a known-good situation.

**Alternative: Let Vite auto-split**
Vite's default Rollup chunking creates chunks based on dynamic imports. Without manual configuration, vendor code may be split less optimally. Manual configuration gives explicit control over cache strategy.

**Verdict:** ✅ Correct. Manual chunking for a known-large dependency (Three.js) is justified.

---

## Decision 06 — EmailJS for Contact Form

**What was chosen:** `@emailjs/browser` — a client-side email delivery library. No backend server.

**Why it was chosen:**
- Static site — no server infrastructure available
- EmailJS allows sending emails from client-side JavaScript
- Free tier (200 emails/month) is sufficient for a portfolio
- Setup takes minutes vs. hours for a custom backend

**Benefits:**
- Zero server maintenance
- No API keys stored server-side (only public key in client)
- Supports multiple templates (auto-reply + notification in parallel)
- Simple `Promise`-based API

**Drawbacks:**
- 200 emails/month limit on free tier
- Public key + service/template IDs visible in client bundle (minor risk)
- No server-side validation — bad actors can bypass `required` fields
- EmailJS downtime = contact form broken

**Security analysis:**
- EmailJS public key: safe to expose (designed for client-side use)
- Service/template IDs: visible but cannot be used to steal emails or access the account
- Actual risk: spam via scripted submissions. Mitigation: EmailJS rate limiting + domain restrictions in dashboard.

**Alternative: Serverless function (Netlify Functions, Vercel Edge Functions)**
A serverless function receives the POST, validates server-side, sends email via Nodemailer or Postmark. Benefits: complete server-side control, rate limiting, no client-visible keys. Cost: more code, slightly more complex deployment.

**Alternative: Formspree, Formbucket**
Similar to EmailJS — form-as-a-service. Trade EmailJS for another service's constraints.

**Verdict:** ✅ Correct for a portfolio. Would use a serverless function + Postmark for a business contact form.

---

## Decision 07 — Framer Motion for Scroll-Triggered Animations

**What was chosen:** `framer-motion` with `useInView` hook for all scroll-triggered entrance animations. Each section component attaches a `useRef` to its wrapper, checks `inView`, and conditionally sets `animate` props.

**Pattern used:**
```tsx
const ref = useRef<HTMLDivElement>(null)
const inView = useInView(ref, { once: true, margin: '-60px' })
<motion.div animate={inView ? { opacity: 1, y: 0 } : {}} initial={{ opacity: 0, y: 16 }}>
```

**Why it was chosen:**
- `useInView` + Framer Motion is simpler than vanilla `IntersectionObserver` + manual class toggling
- `AnimatePresence` for exit animations (CommandPalette, mobile menu) is elegant
- Consistent API for all animation types (entrance, hover, press, layout)

**Benefits:**
- Declarative — animations are described, not imperative code
- `AnimatePresence` handles mount/unmount animation automatically
- `once: true` disconnects the observer after first trigger (performance)
- `variants` + `staggerChildren` for cascading animations

**Drawbacks:**
- ~50KB gzipped — significant for "just animations"
- Overkill if only simple CSS transitions are needed
- `AnimatePresence` requires care (wrapping, key management)

**What could be CSS instead:**
- Skill card hover effects (`transform: translateY(-4px)`, `box-shadow`) — already in CSS
- Nav background transition — already CSS (`transition: background 0.3s`)
- Scroll progress bar width transition — `transition: width 0.08s` in CSS

**What legitimately needs Framer Motion:**
- Exit animations (mobile menu, command palette, success feedback)
- Scroll-triggered entrance with precise margin control
- Stagger children cascade
- `AnimatePresence` unmount animations

**Verdict:** ✅ Justified. The exit animation capability alone justifies `framer-motion`. Pure CSS can't animate elements being removed from the DOM.

---

## Decision 08 — Inline Styles Over CSS Classes

**What was chosen:** A hybrid — layout-level classes in `index.css`, component-specific decoration inline. There is no CSS Modules, no Tailwind on individual components.

**The actual pattern:**
```tsx
// Inline (component-specific)
<h2 style={{ 
  fontFamily: 'Sora, sans-serif', 
  fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
  fontWeight: 700 
}}>

// Class (layout, shared)
<div className="hero-grid">
<div className="section-wrap">
<div className="skill-card">
```

**Why it was chosen:**
- Co-location: styles are visible in the JSX, no mental file-hopping to CSS
- Responsive CSS classes need media queries — easier to define once in CSS
- Hover effects that need both class and JS (onMouseEnter) use inline

**Benefits:**
- No class name collisions (inline styles are scoped to the element)
- Immediate readability — no hunting for a CSS class definition
- Dynamic values (based on props or state) are easy inline

**Drawbacks:**
- No media queries in inline styles — necessitates the CSS/inline split
- Performance: inline styles create a new object every render (minor for 1 object)
- Inconsistency: reader must look in two places for complete styling
- No theming — inline styles can't use `var(--*)` consistently (they can, but it's verbose)

**The inconsistency problem in detail:**
Some components use inline styles for theming (`color: 'var(--text)'`), while the design system expects CSS tokens to be accessed through class-based styling. This is architecturally acceptable but not pure.

**Alternative: CSS Modules**
Each component gets a `.module.css` file. Local class names, no collisions, CSS stays in CSS files. Would require significant refactoring.

**Alternative: Tailwind CSS on everything**
Already in the project but barely used. Committing to Tailwind would mean converting all inline styles to utility classes. Downside: JSX becomes cluttered; upside: design system enforced by class names.

**Verdict:** ⚠️ Acceptable for a personal project. For a team project, I'd mandate CSS Modules or a committed Tailwind strategy. The current hybrid works but has inconsistency that slows down future developers.

---

## Scaling Implications Summary

| If this portfolio grew into... | What would need to change |
|---|---|
| A blog | Add routing (Next.js App Router), MDX for posts |
| A team project | CSS Modules or Tailwind, shared component library, Storybook |
| CMS-managed content | Sanity or Contentful, build-time data fetching |
| 50+ projects | Virtual list, server-side search, database |
| Authentication (admin panel) | Supabase Auth, protected routes, session management |
| Internationalization | i18n library (react-intl), translation files |
| A/B testing | Feature flags, experiment tracking |
| Analytics | GA4 or Plausible integration in `main.tsx` |

---

## What I Would Keep

1. **CSS custom properties for theming** — perfect at this scale
2. **Time-aware auto-theme** — unique and thoughtful feature
3. **Command palette** — shows engineering sophistication to the target audience
4. **Manual Vite chunk splitting** — correct and well-configured
5. **`Promise.all` for parallel email sends** — textbook correct usage
6. **`{ once: true }` on all IntersectionObservers** — proper cleanup
7. **`{ passive: true }` on all scroll/mouse listeners** — correct performance practice
8. **Static data in TypeScript** — right tool for this scale

## What I Would Change

1. **Add an Error Boundary** in `App.tsx` — prevents blank page on catastrophic render errors
2. **Add FOUC prevention** — inline `<script>` in `<head>` to apply theme class before paint
3. **Extract shared types** to `src/types/index.ts` — `Project`, `Command`, `Theme` interfaces
4. **Add a `reset-to-automatic` theme option** — remove `MANUAL_KEY` from localStorage
5. **Add `.catch()` to clipboard operations** — silent failure is poor UX
6. **Wrap Three.js instantiation in try/catch** — graceful degradation on no-WebGL devices
7. **Add a GitHub Actions CI workflow** — catch build/TypeScript errors before deploy
8. **Convert `err: any` to `err: unknown`** — proper TypeScript error handling
