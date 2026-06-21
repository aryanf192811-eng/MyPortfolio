# Portfolio Build Prompt — Aryan (Backend Systems Engineer)

> Paste this entire document as your first message in a new Claude conversation (Claude Code or claude.ai with Artifacts). It contains the persona, design direction, full verified content, and technical constraints needed to build the site in one pass.

---

## 1. Your Role

Act as a senior frontend designer at a studio that builds portfolios for engineers, paired with the eye of a technical recruiter who screens 50 candidates a week. Your job is not to make something pretty — it's to make a hiring manager believe, within 8 seconds of landing on the page, that this person designs systems for a living. Every visual choice should be justifiable by the content, not decorative.

This is **not** a generic "student portfolio" template job. The person is a first-year B.Tech CS student positioning specifically as a **backend / database / workflow-systems engineer** — not a generalist, not a frontend dev who also knows backend. The design has to carry that positioning even before the copy is read.

---

## 2. Design Direction (follow this, do not default to a generic template)

**Concept:** *Drafting-table / schema-first.* The page itself should feel like it was constructed the way this person builds software — entities and relationships defined before anything else exists. The signature visual element is an **animated ER-diagram-style hero**: 2–4 entity boxes connected by relationship lines that draw themselves in on load (SVG path animation), echoing the Mermaid architecture diagrams already used in his GitHub README. This is the one bold moment — everything else stays disciplined and quiet around it.

**Explicitly avoid:** illustration-style hero art, blend-mode custom cursors, rounded "friendly" SaaS-landing-page aesthetics, the warm-cream-and-terracotta look, near-black-with-one-neon-accent look, and numbered-marker decoration that doesn't correspond to a real sequence. These read as templated.

**Color (4–6 named tokens, derive exact hex from these descriptions, don't reuse defaults verbatim):**
- Base: cool drafting-paper off-white (not the cliché warm cream) — something nearer a pale blueprint-grid white
- Ink: deep navy/graphite for text and line work — the "pencil" color
- Primary accent: a saturated blueprint blue (this is already his brand color in the README — `#1e40af` / `#1e3a5f` family)
- Secondary accent: amber/copper (`#b45309` family — already used in his README for "Automation" and decision callouts) for status markers, active states, hover
- Optional dark mode: invert to a near-black ink background with the same blueprint-blue line work — treat as a toggle, not the default

**Type:**
- Display/headline: a sharp, technical grotesk or a structural serif with engineering gravitas — not a soft rounded sans
- Body: a clean humanist sans, restrained
- Mono (important — use deliberately, not just for code blocks): a real monospace (JetBrains Mono / IBM Plex Mono) for tech-stack tags, stat labels, table counts, schema annotations. This is where the "engineer" personality lives in the typography.

**Structural devices:** Use schema/table motifs intentionally — bordered "table" cards with header rows for project facts, hairline connector lines between related sections, small monospace eyebrows like `// problem`, `-- decision`, `SELECT` only where they encode something real about the content (e.g., a "Technical Decisions" block genuinely reads like a design-doc table, so a table is correct there — don't force the motif where it doesn't fit).

**Motion:** One orchestrated hero sequence (the ER diagram assembling), then restrained scroll-triggered reveals for section entry, subtle hover states on project cards (e.g., a connector line extends on hover). No scattered/ambient effects. Respect `prefers-reduced-motion`.

**Self-critique before you build:** state your token system (colors as hex, type pairing, layout concept as a one-paragraph description + ASCII wireframe) and check it against this brief before writing code. If anything in your plan resembles a generic AI-portfolio default, revise it and say what you changed.

---

## 3. Technical Stack & Structure

Build with: **React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion** (matches the candidate's own tech stack — using anything else undercuts the positioning). Single-page application, component-per-section, fully responsive down to mobile, visible keyboard focus states, semantic HTML, accessible color contrast.

Suggested component structure:
```
src/
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx                 (ER-diagram signature animation)
│   ├── EngineeringPrinciples.tsx
│   ├── TechStack.tsx
│   ├── Projects/
│   │   ├── ProjectCard.tsx      (problem → architecture → facts → decisions → stack → links)
│   │   ├── BCart.tsx
│   │   ├── ExamForge.tsx
│   │   └── Traveloop.tsx
│   ├── Experience.tsx
│   ├── Education.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── App.tsx
```

For each project's architecture diagram, render the data flow as **real SVG/HTML**, not an embedded Mermaid image — the diagrams below give you the exact flow logic to reproduce visually (boxes + arrows), styled in the blueprint aesthetic.

---

## 4. CRITICAL — Content Accuracy Rules

This content was extracted directly from the candidate's own GitHub profile README. Do not alter numbers, invent metrics, add technologies not listed, or generate placeholder achievements/companies/links. Where a field is marked **[PLACEHOLDER — not provided]** below, render an empty/TODO state in the design (e.g., a styled "Add resume PDF" button stub) rather than inventing a URL. If you need filler microcopy (button labels, section transitions), write it in plain, active voice — never invent facts about the person.

---

## 5. Content Block

### Identity
- **Name:** Aryan
- **Positioning line:** Backend Systems Engineer — Database Engineering · Workflow Automation · API Architecture
- **Bio:** Computer Science student focused on backend systems, database engineering, and workflow automation. Designs systems where data models, workflows, and state transitions are first-class citizens.
- **Education:** B.Tech Computer Science, Parul University, Gujarat — 2025–2029 — CGPA 7.85
- **Currently deepening:** Java, Spring Boot, PostgreSQL, System Design, GATE CSE 2028

### Engineering Principles
| Principle | Description |
|---|---|
| Schema-First Development | Database and relationships designed before any API or UI work begins |
| Workflow-Driven Design | Business processes modeled as explicit, auditable state machines |
| Database as Source of Truth | Business logic anchored in the data layer, not scattered across application code |
| Explicit State Transitions | No implicit state changes — every transition is intentional and recorded |
| Auditability Over Convenience | Complete audit trails preferred; every state change leaves a permanent record |

### Tech Stack
- **Backend Engineering:** Node.js, Express, FastAPI, Pydantic, JWT, REST APIs
- **Database Systems:** PostgreSQL, SQLite, Supabase, SQLAlchemy, Raw SQL
- **Frontend Systems:** React 19, TypeScript, Vite 8, Tailwind CSS 4, Framer Motion, Zustand, KaTeX
- **Languages:** JavaScript, TypeScript, Python, C, C++, SQL
- **Infrastructure:** Git, GitHub Actions, Vercel, Firebase, uvicorn

---

### Project 1 — B-Cart: Manufacturing ERP
*ERP-style business workflow architecture · Hackathon build*

**Problem:** No single system tracks the complete order-to-stock workflow — the result is manual handoffs between teams, concurrent overselling, and no audit trail.

**Architecture flow:** Sales Order → Inventory Reservation → Manufacturing Order → Work Order Lifecycle → Stock Ledger Event

**Key facts:**
- 22 PostgreSQL tables · 4 views · Moving Average Costing · normalized across 8 domains
- Inventory Reservation Engine · Manufacturing Order automation · Work Order state machine
- Event-driven stock ledger — every movement immutable, full history reconstructable
- JWT Access + Refresh tokens · RBAC at controller layer · full audit logging

**Technical decisions:**
| Decision | Reasoning |
|---|---|
| PostgreSQL | Relational integrity non-negotiable — FK constraints prevent data corruption at DB level |
| Event-Driven Ledger | Immutable events enable audit trail and historical reconstruction without destructive updates |
| Moving Average Costing | Industry-standard valuation; compatible with real manufacturing accounting workflows |
| Access + Refresh JWT | Short-lived access tokens bound the compromise window without server-side session state |
| RBAC at controller | Frontend authorization is cosmetic; enforced server-side on every request |

**Stack:** React 19, Vite, Node.js, Express, PostgreSQL, JWT
**Repository link:** **[PLACEHOLDER — not yet published]**

---

### Project 2 — ExamForge: Enterprise GATE Preparation Platform
*Monorepo · Separate React frontend + FastAPI backend*

**Problem:** GATE prep needs near-instant question access (read-heavy, offline-capable) and real-time cross-device sync (write-heavy, live) — a single database cannot optimize both simultaneously.

**Architecture flow:** React 19 + TypeScript frontend (Zustand, Framer Motion, KaTeX) → FastAPI + Pydantic backend (Bearer JWT) → splits to: SQLite (`content.db`, read-only) for question content, Supabase (real-time) for user state, Firebase for file storage.

**Key facts:**
- SQLite content: thousands of GATE questions, read-only, sub-millisecond, zero network overhead
- Supabase state: progress, streaks, quiz state synced live across devices via real-time subscriptions
- FastAPI backend: typed + validated API, strict Pydantic schemas, Bearer JWT auth
- CI/CD: GitHub Actions on every push, Vercel zero-config deployment
- KaTeX: LaTeX rendering for GATE-level engineering and maths formulas

**Technical decisions:**
| Decision | Reasoning |
|---|---|
| SQLite for content | Questions never change at runtime; local SQLite eliminates all network round-trips |
| Supabase for user state | Real-time subscriptions give cross-device sync without client-side polling |
| TypeScript strict | Complex quiz state and spaced repetition logic; runtime type errors are silent |
| Hybrid architecture | No single DB optimizes both access patterns; split by workload type |
| Monorepo | Shared types and docs between React frontend and FastAPI backend |

**Stack:** React 19, TypeScript (strict), Vite 8, Tailwind 4, Framer Motion, FastAPI, SQLite, Supabase, Firebase
**Links:** Frontend → `https://github.com/aryanf192811-eng/examforgee` · Backend → `https://github.com/aryanf192811-eng/examforge-backend`

---

### Project 3 — Traveloop: Trip Lifecycle Management System
*Full-stack · AI integration · PDF pipeline*

**Problem:** Trip planning is fragmented — budgets in spreadsheets, itineraries in notes apps, invoices in email. No system connects the full lifecycle of a trip end-to-end with a shared data model.

**Architecture flow:** React 19 + Recharts frontend (JWT) → Express + Node.js backend (9 route modules) → splits to: PostgreSQL (11 tables), Gemini AI (packing lists), PDFKit (invoice stream).

**Key facts:**
- 11-table PostgreSQL model · 25 seeded cities · 57+ activity mappings · raw SQL
- 30+ endpoints · Express mergeParams · consistent `{success, data, meta}` response envelope
- Gemini AI packing lists with offline fallback — app stays functional without an API key
- Server-side invoice generation via PDFKit, streamed as a blob to the client
- JWT + bcrypt auth · Multer photo uploads · role-aware admin analytics panel

**Technical decisions:**
| Decision | Reasoning |
|---|---|
| Raw SQL | Explicit query control; ORM abstractions hide what actually runs against the database |
| Express mergeParams | Nested router pattern keeps route files domain-separated and maintainable |
| Server-side PDF | No client-side library weight; invoices generated fresh on each request |
| Gemini with fallback | AI features degrade gracefully; core trip management works without any API key |
| Express over Fastify | Broader ecosystem for Multer and PDFKit adapter patterns needed here |

**Stack:** React 19, Node.js, Express, PostgreSQL, Gemini AI, PDFKit, Recharts
**Link:** `https://github.com/aryanf192811-eng/Pizza-Traveloop`
**Achievement tie-in:** Built for the Odoo × Parul University Hackathon 2026 — reached the **Final Round**.

---

### Experience
**Full-Stack Web Consultant — SoundRich Hearing** *(2026 · Freelance · Delhi NCR)*
- Audited clinic website — identified UX gaps and SEO improvement opportunities
- Built redesigned inquiry and appointment booking prototype from scratch
- Managed complete client communication and delivery pipeline independently

### Achievements
| | Achievement | When |
|---|---|---|
| 🥇 | Final Round — Odoo × Parul University Hackathon 2026 | Semester 2 |
| 💼 | Paid freelance engagement — SoundRich Hearing | Semester 2 |
| 📜 | Certifications: HTML · CSS · JavaScript · Full-Stack Architecture & System Design | — |

### Contact
- **Email:** `aryanf192811@gmail.com`
- **GitHub:** `https://github.com/aryanf192811-eng`
- **LinkedIn:** **[PLACEHOLDER — not provided, omit or stub]**
- **Resume PDF:** **[PLACEHOLDER — not provided, render a disabled/TODO download state]**

---

## 6. What to Leave Out

- Do **not** embed GitHub-readme-stats / profile-view-counter widgets — those are README decoration, not portfolio-site content; they'll look out of place and slow to load on a live site.
- Do **not** add a Spring Boot, Java, or "currently learning" project case study — these are listed as in-progress skills, not shipped work. Keep them in the stack/badges section only.
- Do **not** invent a tagline, mission statement, or "why I code" narrative beyond the bio given above — write supporting microcopy (nav labels, button text, section transitions) in plain active voice, but don't fabricate biographical claims.

---

## 7. Deliverable

Build the full single-page site as a working React + Vite + Tailwind + Framer Motion project (or as a high-fidelity HTML/Tailwind artifact if a full project scaffold isn't the right format for this surface). State your design token plan first, check it against Section 2 for genericness, then build.
