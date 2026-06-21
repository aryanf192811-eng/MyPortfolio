import ProjectCard, { type ProjectData } from './ProjectCard'

const data: ProjectData = {
  index: '03',
  title: 'Traveloop: Trip Lifecycle Management System',
  subtitle: 'Full-stack · AI integration · PDF pipeline',
  accentColor: '#F59E0B',
  problem:
    'Trip planning is fragmented — budgets in spreadsheets, itineraries in notes apps, invoices in email. No system connects the full lifecycle of a trip end-to-end with a shared data model.',
  archNodes: [
    { label: 'React 19 + Recharts' },
    { label: 'Express + Node.js' },
    { label: 'PostgreSQL' },
    { label: 'Gemini AI' },
    { label: 'PDFKit' },
  ],
  facts: [
    '11-table PostgreSQL model · 25 seeded cities · 57+ activity mappings · raw SQL',
    '30+ endpoints · Express mergeParams · consistent {success, data, meta} response envelope',
    'Gemini AI packing lists with offline fallback — app stays functional without an API key',
    'Server-side invoice generation via PDFKit, streamed as a blob to the client',
    'JWT + bcrypt auth · Multer photo uploads · role-aware admin analytics panel',
  ],
  decisions: [
    { decision: 'Raw SQL', reasoning: 'Explicit query control; ORM abstractions hide what actually runs against the database' },
    { decision: 'Express mergeParams', reasoning: 'Nested router pattern keeps route files domain-separated and maintainable' },
    { decision: 'Server-side PDF', reasoning: 'No client-side library weight; invoices generated fresh on each request' },
    { decision: 'Gemini with fallback', reasoning: 'AI features degrade gracefully; core trip management works without any API key' },
    { decision: 'Express over Fastify', reasoning: 'Broader ecosystem for Multer and PDFKit adapter patterns needed here' },
  ],
  stack: ['React 19', 'Node.js', 'Express', 'PostgreSQL', 'Gemini AI', 'PDFKit', 'Recharts'],
  links: [{ label: 'GitHub', href: 'https://github.com/aryanf192811-eng/Pizza-Traveloop' }],
  achievement: 'Final Round — Odoo × Parul University Hackathon 2026',
}

export default function Traveloop() {
  return <ProjectCard project={data} />
}
