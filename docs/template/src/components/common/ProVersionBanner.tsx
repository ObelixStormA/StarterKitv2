import { Icon, Icons } from './Icon'
import { useLocale } from '@/i18n'
import { PRO_PURCHASE_URL } from '@/config/pro'

export function ProVersionBanner() {
  const { t } = useLocale()

  return (
    <div
      className="fixed top-0 inset-x-0 z-[1090] h-[var(--pro-banner-height)] bg-gradient-to-r from-secondary-900 via-secondary-800 to-primary-700 flex items-center justify-center gap-3 px-4 border-b border-white/10"
      role="banner"
    >
      <Icon icon={Icons.sparkles} className="hidden sm:block w-4 h-4 text-amber-400 shrink-0" />
      <p className="text-xs sm:text-sm text-white/90 text-center truncate">
        {t('pro_banner.message')}
      </p>
      <a
        href={PRO_PURCHASE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-secondary-900 text-xs sm:text-sm font-semibold hover:bg-surface-100 transition-colors"
      >
        {t('pro_banner.cta')}
        <Icon icon={Icons.arrowRight} className="w-3.5 h-3.5" />
      </a>
    </div>
  )
}
