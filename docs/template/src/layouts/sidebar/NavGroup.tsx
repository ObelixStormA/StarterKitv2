import type { NavGroup as NavGroupType } from './types'
import { NavItem } from './NavItem'
import { useLocale } from '@/i18n'

const NAV_GROUP_KEY_BY_TITLE: Record<string, string> = {
  Dashboards: 'nav.dashboards',
  Apps: 'nav.apps',
  Authentication: 'nav.authentication',
  Pages: 'nav.pages',
  Forms: 'nav.forms',
  Table: 'nav.table',
  Charts: 'nav.charts',
}

interface NavGroupProps {
  group: NavGroupType
}

/**
 * Navigation Group Component
 * Renders a group of navigation items with an optional title
 */
export function NavGroup({ group }: NavGroupProps) {
  const { t } = useLocale()
  const title = NAV_GROUP_KEY_BY_TITLE[group.title] ? t(NAV_GROUP_KEY_BY_TITLE[group.title]) : group.title

  return (
    <div className="mb-4">
      {/* Group Title */}
      <p className="px-4 mb-2 text-xs font-semibold text-secondary-400 uppercase tracking-wider">
        {title}
      </p>

      {/* Group Items */}
      <div className="px-3 space-y-1">
        {group.items.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </div>
    </div>
  )
}
