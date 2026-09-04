import { Link, useRouteError, isRouteErrorResponse } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'

/**
 * 404 Not Found Page Component
 */
export function NotFoundPage() {
  const { t } = useLocale()
  const error = useRouteError()
  
  let errorMessage = t('errors.404_message')
  
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorMessage = t('errors.404_message')
    } else if (error.status === 500) {
      errorMessage = t('common.something_went_wrong')
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decorations */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="text-center relative z-10 max-w-lg mx-auto animate-fade-in">
        {/* Icon Illustration */}
        <div className="mb-8 relative inline-block">
          <div className="w-32 h-32 bg-surface-100 rounded-full flex items-center justify-center mx-auto relative z-10 shadow-xl border border-surface-200">
            <Icon icon={Icons.search} width={64} height={64} className="text-accent-500" />
          </div>
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 p-3 bg-white rounded-xl shadow-lg border border-surface-100 animate-bounce delay-100">
            <Icon icon={Icons.help} width={24} height={24} className="text-warning-500" />
          </div>
          <div className="absolute -bottom-2 -left-4 p-3 bg-white rounded-xl shadow-lg border border-surface-100 animate-bounce delay-300">
            <Icon icon={Icons.alertTriangle} width={24} height={24} className="text-danger-500" />
          </div>
        </div>

        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-accent-600 mb-2">
          404
        </h1>
        <h2 className="heading-4 text-secondary-900 mb-4">
          {t('errors.404_title')}
        </h2>
        <p className="text-body text-secondary-600 mb-8 leading-relaxed">
          {errorMessage}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-accent-500/20 hover:shadow-accent-500/40 hover:-translate-y-0.5"
          >
            <Icon icon={Icons.home} width={20} height={20} />
            {t('errors.go_home')}
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-6 py-3 bg-white text-secondary-900 rounded-xl font-semibold border border-surface-200 hover:border-accent-500 transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md"
          >
            <Icon icon={Icons.dashboard} width={20} height={20} />
            {t('header.top.dashboard')}
          </Link>
        </div>
      </div>
    </div>
  )
}
