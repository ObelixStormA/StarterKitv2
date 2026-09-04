import { Icons } from '@/components/common'
import type { NavGroup } from './types'

/**
 * Navigation menu configuration
 * Mirrors the full Pro sidebar. Items not implemented in the free app
 * are marked `isPro` and link out to the Pro demo instead.
 */
export const navGroups: NavGroup[] = [
  {
    title: 'Dashboards',
    items: [
      { path: '/dashboard', label: 'Overview', icon: Icons.dashboard },
      { path: '/dashboard/analytics', label: 'Analytics', icon: Icons.chartLine, isPro: true },
      { path: '/dashboard/ecommerce', label: 'eCommerce', icon: Icons.shopping, isPro: true },
      { path: '/dashboard/crm', label: 'CRM', icon: Icons.briefcase, isPro: true },
    ],
  },
  {
    title: 'Apps',
    items: [
      { path: '/app/calendar', label: 'Calendar', icon: Icons.calendar },
      { path: '/app/contacts', label: 'Contacts', icon: Icons.contacts },
      { path: '/app/email', label: 'Email', icon: Icons.mail, isPro: true },
      { path: '/app/chat', label: 'Chat', icon: Icons.message, isPro: true },
      { path: '/app/blog', label: 'Blog', icon: Icons.article, isPro: true },
      { path: '/app/ecommerce/products', label: 'E-commerce', icon: Icons.shopping, isPro: true },
      { path: '/app/notes', label: 'Notes', icon: Icons.note, isPro: true },
      { path: '/app/kanban', label: 'Kanban Board', icon: Icons.kanban, isPro: true },
      { path: '/features/rule-engine', label: 'Rule Engine', icon: Icons.ruleEngine, isPro: true },
      { path: '/features/query-builder', label: 'Query Builder', icon: Icons.queryBuilder, isPro: true },
      { path: '/features/simulation', label: 'Real-Time Simulation', icon: Icons.simulation, isPro: true },
      { path: '/features/insights', label: 'Smart Insights', icon: Icons.insights, isPro: true },
      { path: '/features/workflow-builder', label: 'Workflow Builder', icon: Icons.workflowBuilder, isPro: true },
      { path: '/features/task-scheduler', label: 'Task Scheduler', icon: Icons.taskScheduler, isPro: true },
    ],
  },
  {
    title: 'Authentication',
    items: [
      { path: '/auth/login', label: 'Login', icon: Icons.lock },
      { path: '/auth/register', label: 'Register', icon: Icons.userPlus },
      { path: '/auth/forgot-password', label: 'Forgot Password', icon: Icons.key },
    ],
  },
  {
    title: 'Pages',
    items: [
      { path: '/pages/pricing', label: 'Pricing', icon: Icons.creditCard, isPro: true },
      { path: '/pages/account-settings', label: 'Account Settings', icon: Icons.settings },
      { path: '/pages/gallery', label: 'Gallery', icon: Icons.photo, isPro: true },
      { path: '/pages/faq', label: 'FAQ', icon: Icons.help, isPro: true },
      { path: '/pages/typography', label: 'Typography', icon: Icons.heading },
    ],
  },
  {
    title: 'Forms',
    items: [
      { path: '/forms/layout', label: 'Form Layout', icon: Icons.layoutGrid },
      { path: '/forms/validation', label: 'Form Validation', icon: Icons.checklist },
      { path: '/forms/editor', label: 'Editor', icon: Icons.edit, isPro: true },
    ],
  },
  {
    title: 'Table',
    items: [
      { path: '/tables/simple', label: 'Simple Table', icon: Icons.table },
      { path: '/tables/data', label: 'Data Table', icon: Icons.database },
      { path: '/tables/crud', label: 'CRUD Table', icon: Icons.edit, isPro: true },
    ],
  },
  {
    title: 'Charts',
    items: [
      { path: '/charts/line', label: 'Line', icon: Icons.chartLine, isPro: true },
      { path: '/charts/area', label: 'Area', icon: Icons.chartArea, isPro: true },
      { path: '/charts/columns', label: 'Columns', icon: Icons.chartBar, isPro: true },
      { path: '/charts/pie', label: 'Pie & Doughnut', icon: Icons.chartPie, isPro: true },
      { path: '/charts/radar', label: 'Radar', icon: Icons.chartRadar, isPro: true },
      { path: '/charts/candlestick', label: 'Candlestick', icon: Icons.chartCandle, isPro: true },
    ],
  },
]
