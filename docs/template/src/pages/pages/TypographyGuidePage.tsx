import { useLocale } from '@/i18n'

export default function TypographyGuidePage() {
  const { t } = useLocale()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2 text-secondary-900">{t('typography.title')}</h1>
        <p className="text-body-sm text-secondary-600 mt-2">
          {t('typography.subtitle')}
        </p>
        <p className="text-caption text-secondary-500 mt-1">
          {t('brand.name')} - {t('typography.route_info')} <code>/pages/typography</code>
        </p>
      </div>

      <div className="card rounded-xl p-6 space-y-5">
        <h2 className="heading-4 text-secondary-900">{t('typography.marketing_display')}</h2>
        <div className="space-y-6">
          <div>
            <div className="text-caption text-secondary-500">.text-display-hero</div>
            <div className="text-display-hero text-secondary-900">{t('typography.display_hero')}</div>
          </div>

          <div>
            <div className="text-caption text-secondary-500">.text-display-section</div>
            <div className="text-display-section text-secondary-900">{t('typography.display_section')}</div>
          </div>

          <div>
            <div className="text-caption text-secondary-500">.text-display-price</div>
            <div className="text-display-price text-secondary-900">{t('typography.display_price')}</div>
          </div>

          <div>
            <div className="text-caption text-secondary-500">.text-lead</div>
            <p className="text-lead text-secondary-600 max-w-3xl">
              {t('typography.lead_text')}
            </p>
          </div>
        </div>
      </div>

      <div className="card rounded-xl p-6 space-y-5">
        <h2 className="heading-4 text-secondary-900">{t('typography.headings')}</h2>

        <div className="space-y-4">
          <div>
            <div className="text-caption text-secondary-500">.heading-1</div>
            <div className="heading-1 text-secondary-900">{t('typography.heading_1')}</div>
          </div>
          <div>
            <div className="text-caption text-secondary-500">.heading-2</div>
            <div className="heading-2 text-secondary-900">{t('typography.heading_2')}</div>
          </div>
          <div>
            <div className="text-caption text-secondary-500">.heading-3</div>
            <div className="heading-3 text-secondary-900">{t('typography.heading_3')}</div>
          </div>
          <div>
            <div className="text-caption text-secondary-500">.heading-4</div>
            <div className="heading-4 text-secondary-900">{t('typography.heading_4')}</div>
          </div>
          <div>
            <div className="text-caption text-secondary-500">.heading-5</div>
            <div className="heading-5 text-secondary-900">{t('typography.heading_5')}</div>
          </div>
        </div>
      </div>

      <div className="card rounded-xl p-6 space-y-5">
        <h2 className="heading-4 text-secondary-900">{t('typography.body_ui_text')}</h2>

        <div className="space-y-3">
          <div>
            <div className="text-caption text-secondary-500">.text-body</div>
            <p className="text-body text-secondary-600">
              {t('typography.body_text')}
            </p>
          </div>

          <div>
            <div className="text-caption text-secondary-500">.text-body-sm</div>
            <p className="text-body-sm text-secondary-600">
              {t('typography.body_sm_text')}
            </p>
          </div>

          <div>
            <div className="text-caption text-secondary-500">.text-caption</div>
            <p className="text-caption text-secondary-500">
              {t('typography.caption_text')}
            </p>
          </div>

          <div className="pt-2">
            <div className="text-caption text-secondary-500 mb-2">{t('typography.ui_micro_sizes')}</div>
            <div className="flex flex-wrap gap-3">
              <span className="text-ui px-3 py-1 rounded-lg bg-surface-100 text-secondary-700">.text-ui</span>
              <span className="text-ui-sm px-3 py-1 rounded-lg bg-surface-100 text-secondary-700">.text-ui-sm</span>
              <span className="text-ui-xs px-3 py-1 rounded-lg bg-surface-100 text-secondary-700">.text-ui-xs</span>
              <span className="text-ui-2xs px-3 py-1 rounded-lg bg-surface-100 text-secondary-700">.text-ui-2xs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card rounded-xl p-6 space-y-5">
        <h2 className="heading-4 text-secondary-900">{t('typography.emphasis')}</h2>

        <p className="text-body text-secondary-600">
          {t('typography.emphasis_sentence')} <strong>{t('typography.strong')}</strong>, <b>{t('typography.bold')}</b>, and{' '}
          <span className="text-strong text-secondary-900">{t('typography.span_with_strong')}</span>.
        </p>

        <p className="text-body-sm text-secondary-600">
          {t('typography.emphasis_note')}
        </p>
      </div>
    </div>
  )
}
