import { Link } from 'react-router'
import { Icon, Icons, Logo, SidebarProBanner } from '@/components/common'
import type { NavGroup as NavGroupType } from './types'
import { NavGroup } from './NavGroup'
import { useLocale } from '@/i18n'

interface SidebarProps {
  navGroups: NavGroupType[]
  width: number
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

/**
 * Sidebar Component
 * Main vertical navigation sidebar
 */
export function Sidebar({ navGroups, width, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const { t } = useLocale()

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[1025] lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed top-[var(--pro-banner-height)] bottom-0 left-0 bg-white border-e border-surface-200 flex flex-col z-[1030] transition-all duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ width }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-surface-200 px-4">
          <Link to="/" className="flex items-center gap-2">
            <Logo width={120} height={24} />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-thin">
          <div onClick={onMobileClose}>
            {navGroups.map((group, groupIndex) => (
              <NavGroup
                key={`${group.title}-${groupIndex}`}
                group={group}
              />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-surface-200 space-y-3">
          <SidebarProBanner />
          <Link
            to="/auth/login"
            onClick={onMobileClose}
            className="flex items-center gap-3 rounded-xl text-sm font-medium text-secondary-600 hover:bg-surface-100 transition-colors px-4 py-2.5"
          >
            <Icon icon={Icons.logout} className="w-5 h-5 flex-shrink-0" />
            <span>{t('common.logout')}</span>
          </Link>
        </div>
      </aside>
    </>
  )
}
