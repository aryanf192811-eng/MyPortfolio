import ProjectCard, { type ProjectData } from './ProjectCard'

const data: ProjectData = {
  index: '02',
  title: 'ExamForge: Enterprise GATE Preparation Platform',
  subtitle: 'Monorepo · Separate React frontend + FastAPI backend',
  accentColor: '#009688',
  problem:
    'GATE prep needs near-instant question access (read-heavy, offline-capable) and real-time cross-device sync (write-heavy, live) — a single database cannot optimise both simultaneously.',
  archNodes: [
    { label: 'React 19 + TS' },
    { label: 'FastAPI + Pydantic' },
    { label: 'SQLite (content)' },
    { label: 'Supabase (state)' },
    { label: 'Firebase (files)' },
  ],
  facts: [
    'SQLite content: thousands of GATE questions, read-only, sub-millisecond, zero network overhead',
    'Supabase state: progress, streaks, quiz state synced live across devices via real-time subscriptions',
    'FastAPI backend: typed + validated API, strict Pydantic schemas, Bearer JWT auth',
    'CI/CD: GitHub Actions on every push, Vercel zero-config deployment',
    'KaTeX: LaTeX rendering for GATE-level engineering and maths formulas',
  ],
  decisions: [
    { decision: 'SQLite for content', reasoning: 'Questions never change at runtime; local SQLite eliminates all network round-trips' },
    { decision: 'Supabase for user state', reasoning: 'Real-time subscriptions give cross-device sync without client-side polling' },
    { decision: 'TypeScript strict', reasoning: 'Complex quiz state and spaced repetition logic; runtime type errors are silent' },
    { decision: 'Hybrid architecture', reasoning: 'No single DB optimises both access patterns; split by workload type' },
    { decision: 'Monorepo', reasoning: 'Shared types and docs between React frontend and FastAPI backend' },
  ],
  stack: ['React 19', 'TypeScript', 'Vite 8', 'Tailwind 4', 'Framer Motion', 'FastAPI', 'SQLite', 'Supabase', 'Firebase'],
  links: [
    { label: 'Frontend', href: 'https://github.com/aryanf192811-eng/examforgee' },
    { label: 'Backend',  href: 'https://github.com/aryanf192811-eng/examforge-backend' },
  ],
}

export default function ExamForge() {
  return <ProjectCard project={data} />
}
