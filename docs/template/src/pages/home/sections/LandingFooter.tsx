import { Link } from 'react-router'
import { Logo } from '@/components/common'
import { useLocale } from '@/i18n'
import { PRO_DEMO_BASE_URL } from '@/config/pro'

export function LandingFooter() {
  const { t } = useLocale()
  const year = new Date().getFullYear()

  return (
    <footer className="px-4 py-12 bg-surface-50 border-t border-surface-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
              <Logo width={140} height={28} />
            </Link>
            <p className="text-sm text-secondary-600 mt-4 max-w-sm">
              {t('landing.footer.description')}
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <p className="text-sm font-semibold text-secondary-900">{t('landing.footer.product')}</p>
              <div className="mt-3 space-y-2 text-sm">
                <Link className="block text-secondary-600 hover:text-secondary-900" to="/dashboard">
                  {t('landing.footer.links.live_demo')}
                </Link>
                <a
                  className="block text-secondary-600 hover:text-secondary-900"
                  href={`${PRO_DEMO_BASE_URL}/charts/line`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('nav.charts')}
                </a>
                <Link className="block text-secondary-600 hover:text-secondary-900" to="/tables/data">
                  {t('header.components.tables')}
                </Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-secondary-900">{t('landing.footer.pages')}</p>
              <div className="mt-3 space-y-2 text-sm">
                <Link className="block text-secondary-600 hover:text-secondary-900" to="/pages/account-settings">
                  {t('pages.account_settings')}
                </Link>
                <Link className="block text-secondary-600 hover:text-secondary-900" to="/pages/typography">
                  {t('nav.typography')}
                </Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-secondary-900">{t('landing.footer.auth')}</p>
              <div className="mt-3 space-y-2 text-sm">
                <Link className="block text-secondary-600 hover:text-secondary-900" to="/auth/login">
                  {t('landing.footer.links.login')}
                </Link>
                <Link className="block text-secondary-600 hover:text-secondary-900" to="/auth/register">
                  {t('landing.footer.links.register')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-surface-200 flex flex-col sm:flex-row justify-center gap-4">
          <p className="text-sm text-secondary-500">{t('landing.footer.copyright', { year })}</p>
        </div>
      </div>
    </footer>
  )
}
