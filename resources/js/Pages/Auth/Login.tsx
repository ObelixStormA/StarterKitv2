import InputError from '@/Components/InputError';
import AuthLayout from '@/Layouts/AuthLayout';
import { useLocale } from '@/i18n/LocaleProvider';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { t } = useLocale();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout>
            <Head title={t('auth.login.submit')} />

            <div className="animate-fade-in">
                <div className="mb-8">
                    <h1 className="heading-2 text-secondary-900 mb-2">
                        {t('auth.login.title')} 👋
                    </h1>
                    <p className="text-body-sm text-secondary-500">
                        {t('auth.login.subtitle')}
                    </p>
                </div>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-secondary-900 mb-2">
                            {t('common.email')}
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            placeholder="name@example.com"
                            className="input-theme w-full"
                            autoComplete="username"
                            autoFocus
                            required
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-secondary-900">
                                {t('common.password')}
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-medium text-theme-primary hover:opacity-80 transition-colors"
                                >
                                    {t('auth.login.forgot_password')}
                                </Link>
                            )}
                        </div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            placeholder="••••••••"
                            className="input-theme w-full"
                            autoComplete="current-password"
                            required
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex items-center">
                        <input
                            id="remember"
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            className="checkbox-theme"
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-secondary-500">
                            {t('auth.login.remember_me')}
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 px-4 btn-theme-primary font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                    >
                        {t('auth.login.submit')}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-secondary-500">
                    {t('auth.login.no_account')}{' '}
                    <Link href={route('register')} className="text-theme-primary font-bold hover:opacity-80 hover:underline transition-colors">
                        {t('auth.login.create_account')}
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
