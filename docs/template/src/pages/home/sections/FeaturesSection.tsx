import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'

const features = [
  {
    icon: Icons.bolt,
    titleKey: 'landing.features.items.lightning_fast.title',
    descriptionKey: 'landing.features.items.lightning_fast.desc',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Icons.palette,
    titleKey: 'landing.features.items.modern_design.title',
    descriptionKey: 'landing.features.items.modern_design.desc',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Icons.deviceMobile,
    titleKey: 'landing.features.items.fully_responsive.title',
    descriptionKey: 'landing.features.items.fully_responsive.desc',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Icons.heart,
    titleKey: 'landing.features.items.free_forever.title',
    descriptionKey: 'landing.features.items.free_forever.desc',
    color: 'text-slate-500',
    bg: 'bg-slate-500/10',
  },
  {
    icon: Icons.lock,
    titleKey: 'landing.features.items.auth_ready.title',
    descriptionKey: 'landing.features.items.auth_ready.desc',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: Icons.package,
    titleKey: 'landing.features.items.typescript.title',
    descriptionKey: 'landing.features.items.typescript.desc',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    icon: Icons.brandReact,
    titleKey: 'landing.features.items.react19.title',
    descriptionKey: 'landing.features.items.react19.desc',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Icons.rocket,
    titleKey: 'landing.features.items.production_ui.title',
    descriptionKey: 'landing.features.items.production_ui.desc',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
] as const

export function FeaturesSection() {
  const { t } = useLocale()

  return (
    <section id="features" className="py-24 px-4 bg-white scroll-mt-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-theme-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-theme-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-surface-200 shadow-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-theme-primary"></span>
            </span>
            <span className="text-sm font-semibold text-secondary-600">
              {t('landing.features.badge')}
            </span>
          </div>
          <h2 className="text-display-section text-secondary-900 mb-6">
            {t('landing.features.title_prefix')} <span className="text-gradient">{t('landing.features.title_emphasis')}</span>
          </h2>
          <p className="text-lead text-secondary-600 mt-4 max-w-2xl mx-auto">
            {t('landing.features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div
              key={f.titleKey}
              className="group p-8 rounded-[2rem] bg-surface-50 border border-surface-100 hover:border-theme-primary/20 hover:shadow-xl hover:shadow-theme-primary/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon icon={f.icon} className={`w-7 h-7 ${f.color}`} />
              </div>
              <h3 className="heading-5 text-secondary-900 mb-3 group-hover:text-theme-primary transition-colors">
                {t(f.titleKey)}
              </h3>
              <p className="text-body-sm text-secondary-600 leading-relaxed">
                {t(f.descriptionKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
