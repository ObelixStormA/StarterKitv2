import { Link, useNavigate } from 'react-router'
import { useLocale } from '@/i18n'

/**
 * Register Page Component
 */
export function RegisterPage() {
  const { t } = useLocale()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="heading-2 text-secondary-900 mb-2">
          {t('auth.register.title')} 🚀
        </h1>
        <p className="text-body-sm text-secondary-500">
          {t('auth.register.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="firstName" 
              className="block text-sm font-semibold text-secondary-900 mb-2"
            >
              {t('common.first_name')}
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="John"
              value="John"
              className="input-theme w-full"
              required
            />
          </div>
          <div>
            <label 
              htmlFor="lastName" 
              className="block text-sm font-semibold text-secondary-900 mb-2"
            >
              {t('common.last_name')}
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Doe"
              value="Doe"
              className="input-theme w-full"
              required
            />
          </div>
        </div>

        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-semibold text-secondary-900 mb-2"
          >
            {t('auth.email_address')}
          </label>
          <input
            id="email"
            type="email"
            value="john@example.com"
            placeholder="name@example.com"
            className="input-theme w-full"
            required
          />
        </div>

        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-semibold text-secondary-900 mb-2"
          >
            {t('common.password')}
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value="123456789"
            className="input-theme w-full"
            required
          />
          <p className="mt-1 text-xs text-secondary-500">
            {t('auth.register.password_hint_min8')}
          </p>
        </div>

        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            className="checkbox-theme mt-1"
          />
          <label 
            htmlFor="terms" 
            className="ml-2 text-sm text-secondary-500 leading-relaxed"
          >
            {t('auth.register.agree_prefix')}{' '}
            <Link to="/terms" className="text-theme-primary font-medium hover:text-theme-primary/80 hover:underline transition-colors">
              {t('auth.register.terms_of_service')}
            </Link>
            {' '}{t('auth.register.and')}{' '}
            <Link to="/privacy" className="text-theme-primary font-medium hover:text-theme-primary/80 hover:underline transition-colors">
              {t('auth.register.privacy_policy')}
            </Link>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 btn-theme-primary font-bold rounded-xl shadow-lg shadow-theme-primary/25 hover:shadow-theme-primary/40 transform hover:-translate-y-0.5 transition-all"
        >
          {t('auth.register.create_account')}
        </button>
      </form>

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-surface-200" />
        <span className="text-sm text-secondary-500 font-medium">{t('auth.register.or_sign_up_with')}</span>
        <div className="h-px flex-1 bg-surface-200" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-surface-200 hover:bg-surface-50 transition-colors group">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-sm font-semibold text-secondary-900 group-hover:text-theme-primary transition-colors">Google</span>
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-surface-200 hover:bg-surface-50 transition-colors group">
          <svg className="w-5 h-5 text-secondary-900 group-hover:text-theme-primary transition-colors" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span className="text-sm font-semibold text-secondary-900 group-hover:text-theme-primary transition-colors">GitHub</span>
        </button>
      </div>

      <div className="mt-8 text-center text-sm text-secondary-500">
        {t('auth.register.already_have_account')}{' '}
        <Link to="/auth/login" className="text-theme-primary font-bold hover:text-theme-primary/80 hover:underline transition-colors">
          {t('auth.register.sign_in')}
        </Link>
      </div>
    </div>
  )
}
