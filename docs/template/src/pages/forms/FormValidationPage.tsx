import { useMemo, useState } from 'react'
import { useLocale } from '@/i18n'

type Values = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

type Errors = Partial<Record<keyof Values, string>>

const inputClassName =
  'w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all'

const labelClassName = 'block text-sm font-medium text-secondary-700 mb-1'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: Values, t: (key: string) => string): Errors {
  const errors: Errors = {}

  if (!values.fullName.trim()) errors.fullName = t('forms.validation.errors.full_name_required')

  if (!values.email.trim()) errors.email = t('forms.validation.errors.email_required')
  else if (!emailRegex.test(values.email)) errors.email = t('forms.validation.errors.email_invalid')

  if (!values.password) errors.password = t('forms.validation.errors.password_required')
  else if (values.password.length < 8) errors.password = t('forms.validation.errors.password_min8')

  if (!values.confirmPassword) errors.confirmPassword = t('forms.validation.errors.confirm_password_required')
  else if (values.confirmPassword !== values.password) errors.confirmPassword = t('forms.validation.errors.passwords_no_match')

  if (!values.acceptTerms) errors.acceptTerms = t('forms.validation.errors.accept_terms_required')

  return errors
}

export function FormValidationPage() {
  const { t } = useLocale()
  const [values, setValues] = useState<Values>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })

  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(false)

  const errors = useMemo(() => validate(values, t), [values, t])

  const showError = (field: keyof Values) => {
    if (submitted) return !!errors[field]
    return !!touched[field] && !!errors[field]
  }

  const setField = <K extends keyof Values>(field: K, value: Values[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setSuccess(false)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    const currentErrors = validate(values, t)
    if (Object.keys(currentErrors).length > 0) {
      setSuccess(false)
      return
    }

    setSuccess(true)
    setSubmitted(false)
    setTouched({})
    setValues({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2 text-secondary-900">
          {t('nav.form_validation')}
        </h1>
        <p className="text-body-sm mt-1 text-secondary-500">
          {t('forms.validation.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card rounded-xl p-6">
          <h2 className="heading-5 text-secondary-900">{t('forms.validation.registration_title')}</h2>
          <p className="text-sm text-secondary-500 mt-1">
            {t('forms.validation.registration_desc')}
          </p>

          {success && (
            <div className="mt-4 rounded-xl border border-success-200 bg-success-50/60 p-4">
              <p className="text-sm text-success-800">
                {t('forms.validation.success')}
              </p>
            </div>
          )}

          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className={labelClassName} htmlFor="val_fullName">{t('common.full_name')}</label>
              <input
                id="val_fullName"
                value={values.fullName}
                onChange={(e) => setField('fullName', e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                className={`${inputClassName} ${showError('fullName') ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : ''}`}
                placeholder="John Doe"
              />
              {showError('fullName') && (
                <p className="mt-1 text-xs text-danger-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className={labelClassName} htmlFor="val_email">{t('common.email')}</label>
              <input
                id="val_email"
                type="email"
                value={values.email}
                onChange={(e) => setField('email', e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                className={`${inputClassName} ${showError('email') ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : ''}`}
                placeholder="john@example.com"
              />
              {showError('email') && (
                <p className="mt-1 text-xs text-danger-600">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClassName} htmlFor="val_password">{t('common.password')}</label>
                <input
                  id="val_password"
                  type="password"
                  value={values.password}
                  onChange={(e) => setField('password', e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  className={`${inputClassName} ${showError('password') ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : ''}`}
                  placeholder={t('forms.validation.password_placeholder_min8')}
                />
                {showError('password') && (
                  <p className="mt-1 text-xs text-danger-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label className={labelClassName} htmlFor="val_confirmPassword">{t('forms.validation.confirm_password')}</label>
                <input
                  id="val_confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={(e) => setField('confirmPassword', e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                  className={`${inputClassName} ${showError('confirmPassword') ? 'border-danger-500 focus:ring-danger-500/20 focus:border-danger-500' : ''}`}
                  placeholder={t('forms.validation.confirm_password_placeholder')}
                />
                {showError('confirmPassword') && (
                  <p className="mt-1 text-xs text-danger-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={values.acceptTerms}
                  onChange={(e) => setField('acceptTerms', e.target.checked)}
                  onBlur={() => setTouched((t) => ({ ...t, acceptTerms: true }))}
                  className="mt-1 h-4 w-4 rounded border-surface-300 text-theme-primary focus:ring-theme-primary/20"
                />
                <span className="text-sm text-secondary-700">
                  {t('forms.validation.accept_terms_label')}
                </span>
              </label>
              {showError('acceptTerms') && (
                <p className="mt-1 text-xs text-danger-600">{errors.acceptTerms}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setValues({ fullName: '', email: '', password: '', confirmPassword: '', acceptTerms: false })
                  setTouched({})
                  setSubmitted(false)
                  setSuccess(false)
                }}
                className="px-4 py-2 bg-surface-100 hover:bg-surface-200 text-secondary-700 rounded-lg font-medium transition-colors"
              >
                {t('common.clear')}
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
          <h2 className="heading-5 text-secondary-900">{t('forms.validation.notes_title')}</h2>
          <p className="text-sm text-secondary-500 mt-1">
            {t('forms.validation.notes_subtitle')}
          </p>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-surface-200 p-4">
              <p className="text-sm text-secondary-700">
                - {t('forms.validation.notes_item_1')}
                <br />
                - {t('forms.validation.notes_item_2')}
                <br />
                - {t('forms.validation.notes_item_3')}
              </p>
            </div>

            <div className="rounded-xl border border-surface-200 p-4">
              <p className="text-sm text-secondary-700">
                {t('forms.validation.notes_library')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormValidationPage
