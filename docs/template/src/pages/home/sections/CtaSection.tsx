import { Link } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'

export function CtaSection() {
	const { t } = useLocale()

  return (
    <section id="cta" className="py-16 px-4 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl border border-surface-200 bg-gradient-to-r from-theme-primary/10 via-indigo-500/10 to-cyan-500/10 p-10 overflow-hidden relative">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-theme-primary/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <h2 className="heading-2 text-secondary-900">{t('landing.cta.title')}</h2>
              <p className="text-body text-secondary-600 mt-3 max-w-2xl">
                {t('landing.cta.subtitle')}
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth/register"
                  className="btn-theme-primary px-8 py-4 rounded-xl font-semibold inline-flex items-center justify-center gap-2"
                >
                  {t('landing.cta.primary')}
                  <Icon icon={Icons.arrowRight} className="w-5 h-5" />
                </Link>
                <Link
                  to="/dashboard"
                  className="px-8 py-4 rounded-xl font-semibold border border-surface-200 bg-white/80 hover:border-theme-primary transition-colors text-secondary-900 text-center"
                >
                  {t('landing.cta.secondary')}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white/70 border border-surface-200 p-6">
                <p className="text-sm font-semibold text-secondary-900">{t('landing.cta.highlights.title')}</p>
                <ul className="mt-4 space-y-3 text-sm text-secondary-700">
                  <li className="flex items-center justify-between">
                    <span>{t('landing.cta.highlights.items.forms')}</span>
                    <span className="px-2 py-0.5 rounded-full bg-theme-primary/10 text-theme-primary text-xs font-semibold">{t('landing.cta.highlights.ready')}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>{t('landing.cta.highlights.items.tables')}</span>
                    <span className="px-2 py-0.5 rounded-full bg-theme-primary/10 text-theme-primary text-xs font-semibold">{t('landing.cta.highlights.ready')}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>{t('landing.cta.highlights.items.charts')}</span>
                    <span className="px-2 py-0.5 rounded-full bg-theme-primary/10 text-theme-primary text-xs font-semibold">{t('landing.cta.highlights.ready')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
