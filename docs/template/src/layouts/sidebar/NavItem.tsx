import { Link, useLocation } from 'react-router'
import { Icon } from '@/components/common'
import type { NavItem as NavItemType } from './types'
import { useLocale } from '@/i18n'
import { PRO_DEMO_BASE_URL } from '@/config/pro'

const NAV_ITEM_KEY_BY_LABEL: Record<string, string> = {
  Overview: 'nav.overview',
  Analytics: 'nav.analytics',
  eCommerce: 'nav.ecommerce',
  CRM: 'nav.crm',
  Email: 'nav.email',
  Chat: 'nav.chat',
  Calendar: 'nav.calendar',
  Contacts: 'nav.contacts',
  Blog: 'nav.blog',
  'E-commerce': 'nav.ecommerce_title',
  Notes: 'nav.notes',
  'Kanban Board': 'nav.kanban_board',
  'Rule Engine': 'nav.rule_engine',
  'Query Builder': 'nav.query_builder',
  'Real-Time Simulation': 'nav.simulation',
  'Smart Insights': 'nav.smart_insights',
  'Workflow Builder': 'nav.workflow_builder',
  'Task Scheduler': 'nav.task_scheduler',
  Login: 'nav.login',
  Register: 'nav.register',
  'Forgot Password': 'nav.forgot_password',
  Pricing: 'nav.pricing',
  'Account Settings': 'nav.account_settings',
  Gallery: 'nav.gallery',
  FAQ: 'nav.faq',
  Typography: 'nav.typography',
  'Form Layout': 'nav.form_layout',
  'Form Validation': 'nav.form_validation',
  Editor: 'nav.editor',
  'Simple Table': 'nav.simple_table',
  'Data Table': 'nav.data_table',
  'CRUD Table': 'nav.crud_table',
  Line: 'nav.chart_line',
  Area: 'nav.chart_area',
  Columns: 'nav.chart_columns',
  'Pie & Doughnut': 'nav.chart_pie_doughnut',
  Radar: 'nav.chart_radar',
  Candlestick: 'nav.chart_candlestick',
}

interface NavItemProps {
  item: NavItemType
}

export function NavItem({ item }: NavItemProps) {
  const location = useLocation()
  const { t } = useLocale()

  const label = NAV_ITEM_KEY_BY_LABEL[item.label] ? t(NAV_ITEM_KEY_BY_LABEL[item.label]) : item.label

  const isActive = !item.isPro && (
    item.path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  )

  const proBadge = item.isPro && (
    <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded bg-theme-primary/10 text-theme-primary">
      PRO
    </span>
  )

  const content = (
    <>
      <Icon icon={item.icon} className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1">{label}</span>
      {proBadge}
      {!item.isPro && item.badge && (
        <span className={`
          px-2 py-0.5 text-xs font-medium rounded-full
          ${isActive
            ? 'bg-white/20 text-white'
            : typeof item.badge === 'number'
              ? 'bg-danger-100 text-danger-600'
              : 'bg-theme-primary-light text-theme-primary'
          }
        `}>
          {item.badge}
        </span>
      )}
    </>
  )

  const className = `
    group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
    ${isActive
      ? 'bg-theme-primary text-white'
      : 'text-secondary-600 hover:bg-surface-100'
    }
  `

  if (item.isPro) {
    return (
      <a href={`${PRO_DEMO_BASE_URL}${item.path}`} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link to={item.path} className={className}>
      {content}
    </Link>
  )
}
