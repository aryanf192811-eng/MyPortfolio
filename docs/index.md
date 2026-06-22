# Aryan Portfolio — Documentation Index

> **Reverse-Engineering Course** · Generated from actual source code · v1.0

This is a complete learning system for understanding the `aryan-portfolio` codebase — a modern, animated, single-page portfolio application built with React 19, Vite, TypeScript, Framer Motion, and Three.js.

---

## Project Overview

**What it is:** A personal portfolio SPA (Single-Page Application) for Aryan, a Backend Systems Engineer.

**What makes it interesting architecturally:**
- Custom cursor system using `requestAnimationFrame` lerp loops
- Interactive SVG avatar with real-time mouse tracking
- Three.js particle network rendered on an HTML Canvas inside the Hero
- Time-aware theme system (light during day, dark at night) with manual override
- Keyboard-driven Command Palette with fuzzy search
- Dual-channel EmailJS contact form (auto-reply + owner notification)
- Zero routing library — single scroll-based page with section IDs
- CSS-only responsive design using CSS custom properties as design tokens
- Manual chunking in Vite config for optimal code splitting

**Tech Stack:**
| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5.8 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 (via plugin) + Vanilla CSS |
| Animation | Framer Motion 12 |
| 3D / Canvas | Three.js 0.175 |
| Type Animations | react-type-animation |
| Icons | lucide-react |
| Email | @emailjs/browser |

---

## Architecture Summary

```
Browser
  └── index.html                    ← Single HTML shell
        └── src/main.tsx            ← React root mount
              └── App.tsx           ← Root component + ThemeProvider
                    ├── ThemeContext.tsx   ← Global theme state
                    ├── CursorEffect      ← Custom cursor overlay
                    ├── CommandPalette    ← Ctrl+K palette
                    ├── Nav               ← Fixed navigation + scroll progress
                    ├── Hero              ← Three.js canvas + SVG avatar
                    ├── Skills            ← Animated skill grid
                    ├── Experience        ← Timeline + principles selector
                    ├── Projects          ← Tilt cards + SVG visuals
                    ├── Contact           ← EmailJS form
                    ├── Footer            ← Minimal footer
                    └── ScrollToTop       ← Floating scroll button
```

**Key Architectural Patterns:**
1. **Flat component tree** — no nested routes, one page, scroll navigation
2. **CSS custom properties** as the design token layer (theming without JavaScript)
3. **`requestAnimationFrame` loops** for all cursor/pupil animations (no CSS transitions for performance-critical paths)
4. **Inline style + class hybrid** — layout classes in CSS, component-specific styles inline
5. **Static data co-located** — `PROJECTS`, `COMMANDS`, `GREETINGS` etc. live inside the file that uses them
6. **`useInView` for scroll-triggered animations** — elements only animate once when they enter viewport

---

## Learning Path

Study in this order. Each module builds on the previous.

| # | Module | Concept | Priority |
|---|---|---|---|
| 01 | [Project Mental Model](./module-01-project-mental-model.md) | What the app is and how it fits together | **Start here** |
| 02 | [Entrypoint & Bootstrap](./module-02-entrypoint-and-bootstrap.md) | How the app starts up | High |
| 03 | [Folder Architecture](./module-03-folder-architecture.md) | Where everything lives | High |
| 04 | [Routing System](./module-04-routing-system.md) | How navigation works (no router!) | Medium |
| 05 | [Component System](./module-05-component-system.md) | Component patterns and design choices | High |
| 06 | [State Management](./module-06-state-management.md) | How state flows through the app | High |
| 07 | [Data Fetching](./module-07-data-fetching.md) | EmailJS API integration | Medium |
| 08 | [Authentication](./module-08-authentication.md) | No auth — why and what that means | Low |
| 09 | [Forms & Validation](./module-09-forms-and-validation.md) | Contact form mechanics | Medium |
| 10 | [Business Logic](./module-10-business-logic.md) | Theme system, command palette, animations | High |
| 11 | [Data Layer](./module-11-data-layer.md) | Static data, config files, utilities | Medium |
| 12 | [Performance](./module-12-performance.md) | Code splitting, RAF loops, Three.js cleanup | High |
| 13 | [Error Handling](./module-13-error-handling.md) | EmailJS errors, try/catch patterns | Medium |
| 14 | [Configuration](./module-14-configuration.md) | Vite, TypeScript, environment | Medium |
| 15 | [Deployment](./module-15-deployment.md) | Build pipeline and deployment targets | Medium |

---

## Module Dependencies

```
module-02 (Entrypoint)
  └── module-03 (Folder Architecture)
        ├── module-05 (Component System)
        │     ├── module-06 (State Management)   ← ThemeContext
        │     ├── module-10 (Business Logic)     ← CursorEffect, CommandPalette
        │     ├── module-07 (Data Fetching)      ← Contact + EmailJS
        │     └── module-09 (Forms)              ← Contact form
        ├── module-04 (Routing)                  ← Hash-based scroll nav
        ├── module-11 (Data Layer)               ← emailConfig, techColors
        └── module-12 (Performance)              ← Vite chunks, RAF cleanup
```

---

## Additional Reference Documents

| Document | Contents |
|---|---|
| [runtime-traces.md](./runtime-traces.md) | 15+ execution traces through real code paths |
| [dependency-graphs.md](./dependency-graphs.md) | Mermaid diagrams: component, data, feature, API, state |
| [senior-engineer-notes.md](./senior-engineer-notes.md) | Architectural decisions — benefits, drawbacks, alternatives |
| [study-roadmap.md](./study-roadmap.md) | Step-by-step learning guide for beginners |

---

## Recommended Study Order

**If you're new to React:** Start with modules 01 → 03 → 05 → 06 → read the [study-roadmap.md](./study-roadmap.md)

**If you know React basics:** Start with 02 → 10 → 12 → runtime-traces → senior-engineer-notes

**If you're a senior engineer:** Jump straight to [senior-engineer-notes.md](./senior-engineer-notes.md) and [dependency-graphs.md](./dependency-graphs.md)

---

*All documentation derived from actual source code. Every reference is a real file, real function, or real component.*
