import ProjectCard, { type ProjectData } from './ProjectCard'

const data: ProjectData = {
  index: '01',
  title: 'B-Cart: Manufacturing ERP',
  subtitle: 'ERP-style business workflow architecture · Hackathon build',
  accentColor: '#4F83FF',
  problem:
    'No single system tracks the complete order-to-stock workflow — the result is manual handoffs between teams, concurrent overselling, and no audit trail.',
  archNodes: [
    { label: 'Sales Order' },
    { label: 'Inventory Reserve' },
    { label: 'Mfg Order' },
    { label: 'Work Order' },
    { label: 'Stock Ledger' },
  ],
  facts: [
    '22 PostgreSQL tables · 4 views · Moving Average Costing · normalised across 8 domains',
    'Inventory Reservation Engine · Manufacturing Order automation · Work Order state machine',
    'Event-driven stock ledger — every movement immutable, full history reconstructable',
    'JWT Access + Refresh tokens · RBAC at controller layer · full audit logging',
  ],
  decisions: [
    { decision: 'PostgreSQL', reasoning: 'Relational integrity non-negotiable — FK constraints prevent data corruption at DB level' },
    { decision: 'Event-Driven Ledger', reasoning: 'Immutable events enable audit trail and historical reconstruction without destructive updates' },
    { decision: 'Moving Average Costing', reasoning: 'Industry-standard valuation; compatible with real manufacturing accounting workflows' },
    { decision: 'Access + Refresh JWT', reasoning: 'Short-lived access tokens bound the compromise window without server-side session state' },
    { decision: 'RBAC at controller', reasoning: 'Frontend authorisation is cosmetic; enforced server-side on every request' },
  ],
  stack: ['React 19', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'JWT'],
  links: [{ label: 'Repository not yet published', href: '#', disabled: true }],
}

export default function BCart() {
  return <ProjectCard project={data} />
}
