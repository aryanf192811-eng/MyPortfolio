# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build to dist/
npm run lint      # ESLint (FlatConfig, ESLint 9+)
npm run preview   # Serve the production build locally
```

No test suite is configured.

## Architecture

React 19 SPA built with Vite. Single-page personal portfolio with four sections rendered in sequence by `App.jsx`: `Hero → Projects → Experience → Footer`.

```
src/
  main.jsx          # React root, mounts <App /> at #root
  App.jsx           # Composes the four section components
  index.css         # All design tokens and global styles
  components/
    Hero.jsx        # Animated architecture diagram (Framer Motion floating nodes)
    Projects.jsx    # Three project showcases (B-Cart, ExamForge, Traveloop)
    Experience.jsx  # Engineering principles, tech stack pills, work history
    Footer.jsx      # Contact and location info
```

## Key Patterns

**Animations** — All motion is done with Framer Motion. Scroll-driven parallax uses `useScroll` + `useTransform`; entrance animations use `motion.div` with `initial`/`animate`/`transition`; the Hero diagram nodes use continuous `animate` with `transition: { repeat: Infinity }` for the floating effect.

**Styling** — CSS variables only (no Tailwind, no CSS-in-JS). Design tokens live in `index.css` under `:root`: color palette (warm ivory `#FDFCF8`, accent blues/purples/greens), three font families (Instrument Serif for display, Inter for body, JetBrains Mono for code), and fluid `clamp()`-based type scale. Glass morphism panels use `.glass-panel`. Desktop layout uses a `.grid-editorial` 12-column grid.

**Icons** — Lucide React (`Database`, `Terminal`, `GitBranch`, etc.). Add new icons from the same package to stay consistent.

**No routing** — Single scrollable page, no React Router.
