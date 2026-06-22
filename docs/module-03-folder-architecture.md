# Module 03 — Folder Architecture

## Purpose

Understand why every file lives where it does, what conventions govern the structure, and how to locate any piece of code quickly.

---

## Why It Exists

A codebase's folder structure is its first API — it communicates "what kind of thing this is" before you read a single line. This project uses a deliberate, minimal structure suited to a single-page application with no routing.

---

## Files Involved

```
aryan-portfolio/
├── index.html                    ← Browser entry point
├── package.json                  ← Dependencies + scripts
├── vite.config.ts                ← Build tool configuration
├── tsconfig.json                 ← TypeScript project reference
├── tsconfig.app.json             ← App-specific TS config
├── tsconfig.node.json            ← Node-context TS config (for vite.config.ts)
├── .gitignore
├── CLAUDE.md                     ← AI coding assistant instructions
├── DESIGN_BRIEF.md               ← Original design specification
├── README.md                     ← Project readme
│
├── public/                       ← Static assets served as-is
│   └── aryan_resume.pdf          ← Resume PDF (referenced in emailConfig.ts)
│   └── favicon.png               ← Browser tab icon
│
├── dist/                         ← Build output (not committed)
│   └── [bundled files]
│
└── src/                          ← All application source code
    ├── main.tsx                  ← JavaScript entry point
    ├── App.tsx                   ← Root React component
    ├── index.css                 ← Global CSS (design tokens + layout)
    ├── vite-env.d.ts             ← Vite type declarations
    │
    ├── components/               ← All UI components (14 files)
    │   ├── Nav.tsx               ← Fixed navigation header
    │   ├── NavLogo.tsx           ← Animated face logo in nav
    │   ├── Hero.tsx              ← Landing section (SVG avatar + typewriter)
    │   ├── HeroCanvas.tsx        ← Three.js particle network background
    │   ├── Skills.tsx            ← Tech stack grid + stats
    │   ├── TechIcon.tsx          ← Inline SVG brand icons for tech tags
    │   ├── Experience.tsx        ← Work timeline + principles selector
    │   ├── Projects.tsx          ← Project cards with 3D tilt effect
    │   ├── ProjectVisuals.tsx    ← Animated SVG visuals (BCart, ExamForge, Traveloop)
    │   ├── Contact.tsx           ← Email form + social links
    │   ├── Footer.tsx            ← Page footer
    │   ├── CursorEffect.tsx      ← Custom cursor ring + dot
    │   ├── CommandPalette.tsx    ← Ctrl+K command palette with fuzzy search
    │   └── ScrollToTop.tsx       ← Floating ↑ button
    │
    ├── context/                  ← React contexts
    │   └── ThemeContext.tsx      ← Theme state + useTheme hook
    │
    └── lib/                      ← Utility / config files
        ├── emailConfig.ts        ← EmailJS keys + resume URL/filename
        └── techColors.ts         ← Tech name → hex color mapping
```

---

## Dependency Map

```
src/
  └── main.tsx
        └── App.tsx
              ├── context/ThemeContext.tsx  [provides useTheme()]
              └── components/
                    ├── Nav.tsx
                    │     ├── uses useTheme()
                    │     ├── uses lib/emailConfig.ts  (RESUME_URL, RESUME_FILENAME)
                    │     └── NavLogo.tsx
                    ├── Hero.tsx
                    │     ├── uses useTheme()
                    │     ├── uses lib/emailConfig.ts  (RESUME_URL, RESUME_FILENAME)
                    │     └── HeroCanvas.tsx (uses useTheme())
                    ├── Skills.tsx
                    │     ├── uses lib/techColors.ts  (getTechColor)
                    │     └── TechIcon.tsx
                    ├── Experience.tsx (standalone — no lib deps)
                    ├── Projects.tsx
                    │     ├── uses lib/techColors.ts  (getTechColor)
                    │     └── ProjectVisuals.tsx (BCartVisual, ExamForgeVisual, TraveloopVisual)
                    ├── Contact.tsx
                    │     └── uses lib/emailConfig.ts  (EMAILJS config object)
                    ├── Footer.tsx (standalone)
                    ├── CursorEffect.tsx (uses useTheme())
                    ├── CommandPalette.tsx
                    │     └── uses lib/emailConfig.ts  (RESUME_URL)
                    └── ScrollToTop.tsx (standalone)
```

---

## Runtime Execution Flow

**At import time (module evaluation, before React renders):**
1. `main.tsx` is loaded → imports `index.css` (styles injected), imports `App.tsx`
2. `App.tsx` is loaded → all component imports are resolved
3. `Contact.tsx` module evaluates → `emailjs.init()` runs
4. `ThemeContext.tsx` module evaluates → `ThemeContext` created

**At render time:**
- Components render in tree order (top to bottom in `App.tsx`)
- Each component's `useState` initializers run synchronously
- All `useEffect` hooks queue up, then fire after DOM paint

---

## Data Flow

### The `lib/` folder — shared utilities

**`src/lib/emailConfig.ts`** is the only place where credentials and URLs live:

```typescript
export const EMAILJS = {
  SERVICE_ID:         'service_psr3ozk',
  TEMPLATE_ID:        'template_2ww8rzu',
  NOTIFY_TEMPLATE_ID: 'template_qcz84mn',
  PUBLIC_KEY:         'cR95UBD-JZtUbI8jy',
} as const

export const RESUME_URL      = '/aryan_resume.pdf'
export const RESUME_FILENAME = 'Aryan_Resume.pdf'
```

Three components import from here: `Nav.tsx`, `Hero.tsx`, `CommandPalette.tsx` (all need the resume URL), and `Contact.tsx` (needs EMAILJS config). If you ever need to change the resume path, change it in one place.

**`src/lib/techColors.ts`** is a lookup table:

```typescript
export const TECH_COLORS: Record<string, string> = {
  'Node.js': '#68a063',
  'PostgreSQL': '#336791',
  // ... 35+ entries
}

export function getTechColor(name: string): string {
  return TECH_COLORS[name] ?? '#666666'  // fallback gray
}
```

Used by `Skills.tsx` (tag colors) and `Projects.tsx` (stack badge colors). Centralized so adding a new technology means one line here, not hunting through components.

### The `context/` folder — shared state

Only one context: `ThemeContext`. It's in its own folder because React contexts are not components — they're state infrastructure. Putting them in `components/` would be conceptually wrong.

### The `public/` folder — static assets

Files in `public/` are served exactly as-is, with no processing:
- `favicon.png` → served at `/favicon.png`
- `aryan_resume.pdf` → served at `/aryan_resume.pdf`

The resume is referenced as `href="/aryan_resume.pdf"` (absolute path from root). This works in both dev and prod because Vite passes `public/` through unchanged.

---

## Deep Code Walkthrough

### TypeScript Configuration

```json
// tsconfig.json — project reference file
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Split config because the app code (JSX, browser APIs) and the Vite config file (Node.js APIs, no JSX) need different TypeScript settings:

- `tsconfig.app.json` — targets ESNext, includes `src/`, allows JSX
- `tsconfig.node.json` — targets Node.js, includes `vite.config.ts` only

```json
// tsconfig.app.json (key settings)
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",  // Vite's resolver
    "jsx": "react-jsx",            // automatic JSX transform (no React import needed)
    "strict": true,                 // all strict checks enabled
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

`"moduleResolution": "bundler"` is a TypeScript 5.0+ mode that matches how Vite resolves modules (allows `.tsx` extensions in imports, etc.).

### What Files Are NOT in `src/`

- No `utils/` folder — utilities that touch only one domain (emailConfig, techColors) live in `lib/`
- No `hooks/` folder — all custom hooks are defined inline in the files that use them
- No `types/` folder — TypeScript interfaces are co-located with the components that use them
- No `constants/` folder — static data (PROJECTS, COMMANDS, GREETINGS) lives in the component file
- No `services/` folder — the only "service" is EmailJS, called directly in `Contact.tsx`
- No `pages/` folder — there's only one page

This is by design. **Co-location** is the organizing principle: data lives next to the code that uses it. This makes it easy to understand what a component does by reading one file.

---

## Senior Engineer Perspective

**Flat components folder:** All 14 components live in one flat directory. This works at 14 files. At 40+ files it would become unwieldy and you'd want feature folders (`nav/`, `hero/`, `contact/`). The flat structure is appropriate for this project's scale.

**No barrel files (`index.ts`):** There are no `components/index.ts` re-exports. Imports use direct paths: `import Nav from './components/Nav'`. Barrel files make refactoring harder and can cause circular dependency issues. Omitting them is the correct choice here.

**No `.env` file:** The EmailJS public key is hardcoded in `lib/emailConfig.ts`. This is fine — the EmailJS public key is meant to be public (it's called "public key"). It's safe in the source code. If this were a secret (database password, private API key), it would need to be in a `.env` file and excluded from the repository. The distinction matters.

**`CLAUDE.md` file:** A meta-file instructing an AI coding assistant how to work on this project. This is a modern pattern — pre-populating AI context with project conventions.

---

## Common Bugs

| Issue | Cause | Location |
|---|---|---|
| Import error: `Cannot find module '../lib/emailConfig'` | Wrong relative path | Check the importing file's location relative to `src/lib/` |
| Resume download doesn't work | PDF not in `public/` folder | Check `public/aryan_resume.pdf` exists |
| Tech tag shows gray color | Name not in `TECH_COLORS` | Add to `src/lib/techColors.ts` |
| Component changes not reflecting | HMR missed the file | Manually refresh dev server |

---

## Hands-On Exercises

1. **Add a technology:** Add `'Docker': '#2496ed'` to `src/lib/techColors.ts`. Then add `'Docker'` to the `Infrastructure` group in `Skills.tsx`. Verify the color appears correctly.
2. **Find all resume references:** Search for `RESUME_URL` across the codebase. How many files reference it? Is there any file that hardcodes the path without using the constant?
3. **Understand the public folder:** Add a test file to `public/test.txt`. Visit `http://localhost:5173/test.txt` in dev. Does it work? Now build the project and check `dist/test.txt`. What happened?
4. **Trace a lib file:** Open `src/lib/techColors.ts`. Use your editor's "Find References" feature. Which components call `getTechColor`? What happens if you pass a name that isn't in the map?

---

## Knowledge Prerequisites

| Concept | Why You Need It |
|---|---|
| ES module imports (relative paths) | How files reference each other |
| TypeScript `as const` | Makes objects deeply readonly — used in `emailConfig.ts` |
| The `public/` folder convention | Static assets served without processing |
| React Context API | `ThemeContext` lives in `context/` |
