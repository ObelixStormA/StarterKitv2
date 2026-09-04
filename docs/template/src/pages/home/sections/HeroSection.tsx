import { Link } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'

export function HeroSection() {
  const { t } = useLocale()

  return (
    <section id="top" className="relative min-h-screen overflow-hidden flex items-center justify-center pt-20">
      <div className="absolute inset-0 bg-surface-50 transition-colors duration-300" />
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <div className="h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-[rgb(var(--theme-primary)/0.2)] blur-3xl animate-hero-glow" aria-hidden="true" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-20">
        <div className="animate-fade-in flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-surface-200 text-sm text-secondary-700 backdrop-blur-xl mb-8 shadow-sm">
            <Icon icon={Icons.sparkles} className="w-4 h-4 text-theme-primary" />
            <span className="font-medium">{t('landing.hero.badge')}</span>
          </div>

          <h1 className="text-display-hero text-secondary-900 mb-8">
            {t('landing.hero.title_prefix')}
            <br />
            <span className="text-gradient">
              {t('landing.hero.title_emphasis')}
            </span>
          </h1>

          <p className="text-lead text-secondary-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('landing.hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto btn-theme-primary px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-theme-primary/20 hover:scale-105 transition-transform duration-200 inline-flex items-center justify-center gap-2"
            >
              {t('landing.hero.view_preview')}
              <Icon icon={Icons.arrowRight} className="w-5 h-5" />
            </Link>

            <Link
              to="/auth/login"
              className="w-full sm:w-auto px-8 py-4 bg-white text-secondary-900 rounded-2xl font-bold text-lg border border-surface-200 hover:border-theme-primary hover:bg-surface-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Icon icon={Icons.user} className="w-5 h-5" />
              {t('auth.login.sign_in')}
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-3xl">
            {[
              { k: '20+', v: t('landing.hero.stats.pages') },
              { k: '2', v: t('landing.hero.stats.apps') },
              { k: '100%', v: t('landing.hero.stats.typescript') },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl bg-white/60 backdrop-blur-md border border-surface-200 p-6 flex flex-col items-center hover:bg-white transition-all duration-300">
                <p className="heading-2 text-secondary-900">{s.k}</p>
                <p className="text-sm font-medium text-secondary-500 mt-1 uppercase tracking-wider">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
