import { Icon, Icons } from './Icon'
import { useLocale } from '@/i18n'
import { PRO_PURCHASE_URL } from '@/config/pro'

/**
 * Small promotional card pinned to the bottom of the sidebar
 */
export function SidebarProBanner() {
  const { t } = useLocale()

  return (
    <a
      href={PRO_PURCHASE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl p-3 bg-gradient-to-r from-secondary-900 via-secondary-800 to-primary-700 hover:opacity-90 transition-opacity"
    >
      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
        <Icon icon={Icons.sparkles} className="w-4 h-4 text-amber-400" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-white truncate">{t('sidebar.pro_banner.title')}</span>
        <span className="block text-[11px] text-white/70 truncate">{t('sidebar.pro_banner.cta')}</span>
      </span>
      <Icon icon={Icons.arrowRight} className="w-3.5 h-3.5 text-white/70 flex-shrink-0" />
    </a>
  )
}
