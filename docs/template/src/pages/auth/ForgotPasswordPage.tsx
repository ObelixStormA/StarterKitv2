import { Link, useNavigate } from 'react-router'
import { useLocale } from '@/i18n'
import { Icon, Icons } from '@/components/common'

/**
 * Forgot Password Page Component
 */
export function ForgotPasswordPage() {
  const { t } = useLocale()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logic to send reset email would go here
    navigate('/auth/login')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="heading-2 text-secondary-900 mb-2">
          {t('auth.forgot_password.title')} 🔒
        </h1>
        <p className="text-body-sm text-secondary-500">
          {t('auth.forgot_password.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
            placeholder="name@example.com"
            className="input-theme w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 btn-theme-primary font-bold rounded-xl shadow-lg shadow-theme-primary/25 hover:shadow-theme-primary/40 transform hover:-translate-y-0.5 transition-all"
        >
          {t('auth.forgot_password.submit')}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link 
          to="/auth/login" 
          className="inline-flex items-center gap-2 text-sm font-medium text-secondary-600 hover:text-secondary-900 transition-colors"
        >
          <Icon icon={Icons.chevronLeft} width={16} height={16} />
          {t('auth.forgot_password.back_to_login')}
        </Link>
      </div>
    </div>
  )
}
