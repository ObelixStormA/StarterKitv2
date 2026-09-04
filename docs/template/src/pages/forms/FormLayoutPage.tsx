import { useState } from 'react'
import { useLocale } from '@/i18n'

const inputClassName =
  'w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all'

const labelClassName = 'block text-sm font-medium text-secondary-700 mb-1'

export function FormLayoutPage() {
  const { t } = useLocale()
  const [lastSubmit, setLastSubmit] = useState<string | null>(null)

  const handleSubmit = () => (e: React.FormEvent) => {
    e.preventDefault()
    setLastSubmit(t('forms.submitted'))
    window.setTimeout(() => setLastSubmit(null), 2500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2 text-secondary-900">
          {t('nav.form_layout')}
        </h1>
        <p className="text-body-sm mt-1 text-secondary-500">
          {t('forms.layout.subtitle')}
        </p>
      </div>

      {lastSubmit && (
        <div className="card rounded-xl p-4 border border-success-200 bg-success-50/60">
          <p className="text-sm text-success-800">{lastSubmit}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card rounded-xl p-6">
          <div className="mb-5">
            <h2 className="heading-5 text-secondary-900">{t('forms.layout.stacked_title')}</h2>
            <p className="text-sm text-secondary-500 mt-1">
              {t('forms.layout.stacked_desc')}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit()}>
            <div>
              <label className={labelClassName} htmlFor="stacked_fullName">{t('common.full_name')}</label>
              <input id="stacked_fullName" className={inputClassName} placeholder="John Doe" />
            </div>

            <div>
              <label className={labelClassName} htmlFor="stacked_email">{t('common.email')}</label>
              <input id="stacked_email" type="email" className={inputClassName} placeholder="john@example.com" />
            </div>

            <div>
              <label className={labelClassName} htmlFor="stacked_company">{t('common.company')}</label>
              <input id="stacked_company" className={inputClassName} placeholder="Adminex Inc." />
            </div>

            <div>
              <label className={labelClassName} htmlFor="stacked_message">{t('common.message')}</label>
              <textarea
                id="stacked_message"
                rows={4}
                className={`${inputClassName} resize-none`}
                placeholder={t('forms.layout.message_placeholder')}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                className="px-4 py-2 bg-surface-100 hover:bg-surface-200 text-secondary-700 rounded-lg font-medium transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-theme-primary hover:bg-theme-primary/90 text-white rounded-lg font-medium transition-colors"
              >
                {t('common.submit')}
              </button>
            </div>
          </form>
        </div>

        <div className="card rounded-xl p-6">
          <div className="mb-5">
            <h2 className="heading-5 text-secondary-900">{t('forms.layout.two_column_title')}</h2>
            <p className="text-sm text-secondary-500 mt-1">
              {t('forms.layout.two_column_desc')}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClassName} htmlFor="two_firstName">{t('common.first_name')}</label>
                <input id="two_firstName" className={inputClassName} placeholder="John" />
              </div>
              <div>
                <label className={labelClassName} htmlFor="two_lastName">{t('common.last_name')}</label>
                <input id="two_lastName" className={inputClassName} placeholder="Doe" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClassName} htmlFor="two_email">{t('common.email')}</label>
                <input id="two_email" type="email" className={inputClassName} placeholder="john@example.com" />
              </div>
              <div>
                <label className={labelClassName} htmlFor="two_phone">{t('common.phone')}</label>
                <input id="two_phone" className={inputClassName} placeholder="+1 (555) 123-4567" />
              </div>
            </div>

            <div>
              <label className={labelClassName} htmlFor="two_address">{t('common.address')}</label>
              <input id="two_address" className={inputClassName} placeholder="123 Main St" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClassName} htmlFor="two_city">{t('common.city')}</label>
                <input id="two_city" className={inputClassName} placeholder="San Francisco" />
              </div>
              <div>
                <label className={labelClassName} htmlFor="two_state">{t('common.state')}</label>
                <input id="two_state" className={inputClassName} placeholder="CA" />
              </div>
              <div>
                <label className={labelClassName} htmlFor="two_zip">{t('common.zip')}</label>
                <input id="two_zip" className={inputClassName} placeholder="94105" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                className="px-4 py-2 bg-surface-100 hover:bg-surface-200 text-secondary-700 rounded-lg font-medium transition-colors"
              >
                {t('common.reset')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-theme-primary hover:bg-theme-primary/90 text-white rounded-lg font-medium transition-colors"
              >
                {t('common.save_changes')}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card rounded-xl p-6">
        <div className="mb-5">
          <h2 className="heading-5 text-secondary-900">{t('forms.layout.inline_title')}</h2>
          <p className="text-sm text-secondary-500 mt-1">
            {t('forms.layout.inline_desc')}
          </p>
        </div>

        <form onSubmit={handleSubmit()} className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="flex-1">
            <label className={labelClassName} htmlFor="inline_search">{t('common.search')}</label>
            <input id="inline_search" className={inputClassName} placeholder={t('forms.layout.inline_search_placeholder')} />
          </div>

          <div className="w-full lg:w-56">
            <label className={labelClassName} htmlFor="inline_status">{t('common.status')}</label>
            <select id="inline_status" className={inputClassName} defaultValue="all">
              <option value="all">{t('common.all')}</option>
              <option value="active">{t('common.active')}</option>
              <option value="paused">{t('common.paused')}</option>
              <option value="archived">{t('common.archived')}</option>
            </select>
          </div>

          <div className="w-full lg:w-56">
            <label className={labelClassName} htmlFor="inline_sort">{t('common.sort')}</label>
            <select id="inline_sort" className={inputClassName} defaultValue="newest">
              <option value="newest">{t('common.sort_newest')}</option>
              <option value="oldest">{t('common.sort_oldest')}</option>
              <option value="az">{t('common.sort_az')}
              </option>
              <option value="za">{t('common.sort_za')}
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2.5 bg-theme-primary hover:bg-theme-primary/90 text-white rounded-xl font-medium transition-colors"
          >
            {t('common.apply')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default FormLayoutPage
