import { GitHubIcon, GoogleIcon } from '@/Components/Icons';
import { useLocale } from '@/i18n/LocaleProvider';

export default function SocialLoginButtons() {
    const { t } = useLocale();

    return (
        <>
            <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-surface-200" />
                <span className="text-sm text-secondary-500 font-medium">{t('auth.or_continue_with')}</span>
                <div className="h-px flex-1 bg-surface-200" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <a
                    href={route('social.redirect', 'google')}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-surface-200 hover:bg-surface-50 transition-colors"
                >
                    <GoogleIcon className="w-5 h-5" />
                    <span className="text-sm font-semibold text-secondary-900">Google</span>
                </a>
                <a
                    href={route('social.redirect', 'github')}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-surface-200 hover:bg-surface-50 transition-colors"
                >
                    <GitHubIcon className="w-5 h-5 text-secondary-900" />
                    <span className="text-sm font-semibold text-secondary-900">GitHub</span>
                </a>
            </div>
        </>
    );
}
