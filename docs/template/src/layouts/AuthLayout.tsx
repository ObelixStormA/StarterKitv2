import { Outlet, Link } from 'react-router'
import { Logo } from '@/components/common'
import { useLocale } from '@/i18n'

/**
 * Auth Layout Component - Centered Card Layout
 */
export function AuthLayout() {
  const { t } = useLocale()
  const year = new Date().getFullYear()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-100 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgb(var(--theme-primary)) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgb(var(--theme-accent)) 0%, transparent 70%)' }}
        />
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-[480px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center">
            <Logo width={160} height={32} />
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-surface-200">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-secondary-500">
            {t('footer.copyright_all_rights', { year })}
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <Link to="#" className="text-secondary-500 hover:text-theme-primary transition-colors">{t('pages.privacy_policy')}</Link>
            <span className="text-surface-300">•</span>
            <Link to="#" className="text-secondary-500 hover:text-theme-primary transition-colors">{t('pages.terms_of_service')}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
