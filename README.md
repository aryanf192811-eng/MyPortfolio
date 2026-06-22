# Aryan — Backend Engineer Portfolio

A personal portfolio built to reflect how I actually think about software: schema-first, state-machine-driven, and fully auditable. Every design decision here is justified by the content, not decoration.

**Live →** [aryan.dev](https://aryan.dev) *(deploy in progress)*

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Animation | Framer Motion 12 |
| 3D / Canvas | Three.js |
| Styling | CSS custom properties (no Tailwind in component code) |
| Email | EmailJS |
| Icons | Lucide React + inline brand SVGs |

---

## Features

- **Interactive hero illustration** — SVG developer character with head rotation and eye tracking driven by cursor position (chin-pivot, no detachment)
- **Three.js particle network** — mouse-reactive node graph rendered on WebGL canvas, hero-section-only
- **Interactive NavLogo** — mini SVG face in the navbar: blinks autonomously, pupils follow cursor
- **Project banners** — per-project interactive SVG scenes (B-Cart schema flow, ExamForge dual-DB sync, Traveloop animated route map) with 3D card tilt on hover
- **Experience section** — animated timeline card, glowing achievement cards, click-to-switch engineering principles panel with crossfade
- **Custom cursor** — dual ring+dot, theme-aware (no `mix-blend-mode` hacks)
- **Full keyboard navigation** — press `1`–`5` to jump between sections
- **Scroll-to-top** — appears after 500 px, smooth scroll back
- **Dynamic tab title** — changes on window blur
- **Click-to-copy email** — one-click copy in Contact section
- **Dark / light mode** — system-preference aware, toggle in nav
- **Scroll progress bar** — thin indicator at bottom of navbar
- **Fully responsive** — breakpoints at 960 / 860 / 640 / 480 / 400 px

---

## Project Structure

```
src/
├── components/
│   ├── Nav.tsx              # Fixed nav with scroll progress + mobile menu
│   ├── NavLogo.tsx          # Interactive SVG face logo
│   ├── Hero.tsx             # Hero section + developer illustration
│   ├── HeroCanvas.tsx       # Three.js particle network (hero only)
│   ├── Skills.tsx           # Core skills grid + full tech breakdown
│   ├── TechIcon.tsx         # Colored brand SVG icons
│   ├── Experience.tsx       # Timeline, achievements, principles selector
│   ├── Projects.tsx         # Project cards with 3D tilt
│   ├── ProjectVisuals.tsx   # Interactive SVG banners per project
│   ├── Contact.tsx          # EmailJS contact form
│   ├── CursorEffect.tsx     # Custom ring + dot cursor
│   ├── ScrollToTop.tsx      # Floating back-to-top button
│   └── Footer.tsx
├── context/
│   └── ThemeContext.tsx      # Dark/light mode provider
├── lib/
│   ├── emailConfig.ts        # EmailJS service/template IDs
│   └── techColors.ts         # Brand color map for tech tags
└── index.css                 # Design tokens + responsive grid system
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Development server (localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## EmailJS Setup

The contact form uses [EmailJS](https://www.emailjs.com) (free tier — 200 emails/month).

1. Create a service and template at emailjs.com
2. Set **To Email** → `{{to_email}}` and **Reply To** → `{{reply_to}}` in your template
3. Fill in your IDs in `src/lib/emailConfig.ts`:

```ts
export const EMAILJS = {
  SERVICE_ID:  'your_service_id',
  TEMPLATE_ID: 'your_template_id',
  PUBLIC_KEY:  'your_public_key',
}
```

---

## Design Principles

The visual language mirrors the engineering principles described in the Experience section:

- **Schema-first** — design tokens defined once in `index.css`, consumed everywhere
- **No implicit state** — theme, scroll, cursor, and section visibility are all explicit React state
- **Auditability** — every interactive element has a clear, traceable event chain

---

## License

MIT — free to use as reference or inspiration. If you build something with it, a mention is appreciated but not required.
