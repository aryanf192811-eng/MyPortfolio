# Module 11 — Data Layer

## Purpose

Understand where all the data in this application comes from — the static data structures, configuration objects, and utility functions that feed the UI.

---

## Why It Exists

This portfolio has no database, no CMS, no API for content. All content — projects, skills, experience, commands — is **static data hardcoded in TypeScript files**. The "data layer" is a set of compile-time constants that feed into components at runtime.

---

## Files Involved

| File | Data Type | Consumer Components |
|---|---|---|
| [`src/lib/emailConfig.ts`](../src/lib/emailConfig.ts) | Config constants | `Nav`, `Hero`, `Contact`, `CommandPalette` |
| [`src/lib/techColors.ts`](../src/lib/techColors.ts) | Lookup table | `Skills`, `Projects` |
| `PROJECTS` in `Projects.tsx` | Array of objects | `Projects`, `ProjectCard`, `ProjectVisual` |
| `COMMANDS` in `CommandPalette.tsx` | Array of objects | `CommandPalette` |
| `CORE_SKILLS`, `STACK_GROUPS`, `STATS` in `Skills.tsx` | Arrays | `Skills` |
| `PRINCIPLES`, `ACHIEVEMENTS`, `METRICS`, `BULLETS` in `Experience.tsx` | Arrays + strings | `Experience`, sub-components |
| `GREETINGS` in `Hero.tsx` | Array | `DeveloperIllustration` |

---

## Dependency Map

```
Data Sources (compile-time constants)
  ├── lib/emailConfig.ts
  │     ├── EMAILJS.SERVICE_ID → Contact.tsx (emailjs.send param)
  │     ├── EMAILJS.TEMPLATE_ID → Contact.tsx
  │     ├── EMAILJS.NOTIFY_TEMPLATE_ID → Contact.tsx
  │     ├── EMAILJS.PUBLIC_KEY → Contact.tsx (emailjs.init)
  │     ├── RESUME_URL → Nav.tsx, Hero.tsx, CommandPalette.tsx (<a href>)
  │     └── RESUME_FILENAME → Nav.tsx, Hero.tsx (<a download>)
  │
  ├── lib/techColors.ts
  │     ├── TECH_COLORS (map) → exported but rarely used directly
  │     └── getTechColor(name) → Skills.tsx, Projects.tsx
  │
  ├── Projects.tsx (PROJECTS array)
  │     ├── title, tagline, description → ProjectCard text
  │     ├── impact[] → bullet list
  │     ├── stack[] → tech tags (each feeds getTechColor)
  │     ├── links[] → GitHub buttons
  │     ├── accent → color theme per project
  │     └── letter → fallback initial when no visual defined
  │
  ├── CommandPalette.tsx (COMMANDS array)
  │     ├── Navigate group → scroll actions
  │     └── Actions group → clipboard, external links, download
  │
  ├── Skills.tsx
  │     ├── CORE_SKILLS → top 10 card grid
  │     ├── STACK_GROUPS → categorized tag rows
  │     └── STATS → the 4 stat numbers
  │
  ├── Experience.tsx
  │     ├── METRICS → 3 stat chips (2 Sprint Cycles, 1st Paid, Solo)
  │     ├── BULLETS → 3 work description bullets
  │     ├── ACHIEVEMENTS → 3 achievement cards
  │     └── PRINCIPLES → 5 engineering principles
  │
  └── Hero.tsx (GREETINGS array)
        └── text + color → typewriter in SVG laptop screen
```

---

## Runtime Execution Flow

Static data is evaluated at **module load time** — before any component renders. JavaScript evaluates `const PROJECTS = [...]` when the module is imported. This data never changes during a session.

```
Browser imports Projects.tsx module
  └── PROJECTS constant is created (6 objects in array)
        └── VISUAL_MAP is created (3 SVG component references)
              └── Projects() function is defined
                    └── Projects() component renders
                          └── PROJECTS.map(project => <ProjectCard ...>)
```

---

## Data Flow

### The `PROJECTS` Object Structure

```typescript
// Projects.tsx
interface Project {
  title: string        // "B-Cart"
  tagline: string      // "Manufacturing ERP..."
  description: string  // Long paragraph
  impact: string[]     // Bullet points
  stack: string[]      // ["Node.js", "Express", "PostgreSQL", ...]
  links: ProjectLink[] // [{label: "GitHub", href: "...", icon: <Github>}]
  accent: string       // "#3b82f6" — theme color for this project
  letter: string       // "BC" — initials for fallback visual
  badge?: string       // Optional: "Hackathon Finalist"
}
```

Each project's `stack` array feeds `getTechColor`:
```tsx
{project.stack.map(t => {
  const color = getTechColor(t)  // "#68a063" for "Node.js"
  return (
    <span style={{ color, background: `${color}14`, border: `1px solid ${color}30` }}>
      {t}
    </span>
  )
})}
```

The color is used for text, a 8% opacity background (`${color}14` in hex = 20 alpha = 8%), and a 19% opacity border (`${color}30`).

### The Visual Map Pattern

```tsx
// Projects.tsx
const VISUAL_MAP: Record<string, React.ReactNode> = {
  'B-Cart':    <BCartVisual />,
  'ExamForge': <ExamForgeVisual />,
  'Traveloop': <TraveloopVisual />,
}

// In ProjectVisual component:
{VISUAL_MAP[project.title] ?? (
  <span style={{ fontSize: '4rem', fontWeight: 800 }}>
    {project.letter}  {/* Fallback: "BC" for B-Cart */}
  </span>
)}
```

`VISUAL_MAP` maps project title strings to JSX. If a project has no matching visual, it falls back to the `letter` field. Adding a new project without a custom visual just shows its letter initials.

### The `getTechColor` Utility

```typescript
// lib/techColors.ts
export const TECH_COLORS: Record<string, string> = {
  'Node.js':   '#68a063',
  'PostgreSQL': '#336791',
  // 35+ entries...
}

export function getTechColor(name: string): string {
  return TECH_COLORS[name] ?? '#666666'  // neutral gray fallback
}
```

This is a **pure function** — same input always returns the same output, no side effects. It's the simplest possible "data service."

### The `COMMANDS` Array with Actions

```typescript
// CommandPalette.tsx
interface Command {
  id: string
  label: string
  description?: string
  group: string
  icon: React.ReactNode
  action: () => void    // ← functions stored in data!
  keywords?: string
}

const COMMANDS: Command[] = [
  {
    id: 'nav-about',
    group: 'Navigate',
    label: 'About',
    description: 'Who I am and what I build',
    icon: <Hash size={14} />,
    action: () => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }),
    keywords: 'home hero intro',
  },
  // ...
]
```

This is an unusual pattern: **storing functions in a data array**. The `action` field is a closure that captures the DOM query. This makes `CommandPalette` generic — it doesn't need to know what each command does, just that it has an `action` to call.

---

## Deep Code Walkthrough

### Why Static Data Instead of a CMS

The alternative to hardcoded data would be:
1. A headless CMS (Contentful, Sanity) — fetched at build time or runtime
2. A database (Supabase, PlanetScale) — queried at runtime

For a personal portfolio that rarely changes and is maintained by its owner, the cost-benefit doesn't favor a CMS:
- Static data: edit a `.tsx` file, push to git, Netlify auto-deploys → 2 minutes
- CMS: log into dashboard, edit, publish, wait for webhook → 5+ minutes + monthly cost
- Database: write an API, handle auth, pay for hosting → much more complexity

The static approach is correct for this project's scale.

### The `as const` Modifier

```typescript
// emailConfig.ts
export const EMAILJS = {
  SERVICE_ID: 'service_psr3ozk',
  // ...
} as const
```

`as const` makes TypeScript infer literal types instead of widened string types:
- Without `as const`: `SERVICE_ID` is typed as `string`
- With `as const`: `SERVICE_ID` is typed as the literal `'service_psr3ozk'`

It also makes the object deeply readonly — TypeScript will error if you try to reassign:
```typescript
EMAILJS.SERVICE_ID = 'something_else'  // Error: Cannot assign to 'SERVICE_ID'
```

### `Record<string, string>` vs. Interface

```typescript
// techColors.ts
export const TECH_COLORS: Record<string, string> = { ... }
```

`Record<string, string>` means "an object with string keys and string values." This allows adding new technologies without TypeScript complaining about the key name. If the keys were a union type, you'd need `Record<'Node.js' | 'PostgreSQL' | ..., string>` — too verbose for a lookup table.

---

## Senior Engineer Perspective

**Static data as code is underrated.** TypeScript gives you type checking on your content. Refactoring a field name across multiple data items is a single find-replace. You get git history for content changes. This is legitimate and powerful for small projects.

**The functions-in-arrays pattern is fine here.** Commands store their `action` as a closure. This couples the data to the DOM. In a larger application, you'd separate data from behavior (command pattern, action creators). But for a palette with 9 commands, this is clear and compact.

**Missing: type for GREETINGS.** The `GREETINGS` array in `Hero.tsx` is typed by inference only:
```tsx
const GREETINGS = [
  { text: 'Hello, World!', color: '#86efac' },
  // ...
]
```
TypeScript infers `{ text: string; color: string }[]`. Adding an explicit interface would be cleaner for documentation purposes, but it's not a bug.

**The resume URL is not an environment variable.** `/aryan_resume.pdf` is hardcoded in `emailConfig.ts`. For deployment to multiple environments (dev, staging, prod) where the resume URL might differ, this would need to be `import.meta.env.VITE_RESUME_URL`. For a single-environment personal portfolio, the current approach is fine.

---

## Common Bugs

| Bug | Data Layer Cause | Fix |
|---|---|---|
| New project has gray tech tags | Tech name not in `TECH_COLORS` | Add to `lib/techColors.ts` |
| New project shows letter instead of visual | Title not in `VISUAL_MAP` | Add visual to `ProjectVisuals.tsx` and map it |
| Resume download fails | `RESUME_URL` path wrong or file missing | Check `public/aryan_resume.pdf` exists |
| Command palette command does nothing | `action` function throws silently | Add try/catch in `run()` |
| Principle panel crashes | `PRINCIPLES[active]` is undefined | Ensure `active` is always a valid index |

---

## Hands-On Exercises

1. **Add a 4th project:** Add a new project object to `PROJECTS` in `Projects.tsx`. Use letter initials (no custom visual). Add its tech stack, links, and accent color. See it render automatically.
2. **Extend tech colors:** Add `'Bun': '#fbf0df'` to `TECH_COLORS`. Use it in a project's `stack` array. Verify the color appears.
3. **Add a new command category:** In `CommandPalette.tsx`, add a new command group called `'Links'`. Add a command that opens Aryan's portfolio README on GitHub. Test with keyboard navigation.
4. **Extract PROJECTS to a separate file:** Move the `PROJECTS` array to `src/data/projects.ts`. Import it in `Projects.tsx`. This is a refactoring exercise — the UI should be unchanged.

---

## Knowledge Prerequisites

| Concept | Why You Need It |
|---|---|
| TypeScript interfaces | How data shapes are defined |
| `as const` | Literal type inference + deep readonly |
| `Record<K, V>` TypeScript type | Used for lookup tables |
| JavaScript closures | `action` functions in `COMMANDS` capture DOM access |
| Array `.map()` | How arrays become rendered JSX |
