import InputError from '@/Components/InputError';
import SocialLoginButtons from '@/Components/SocialLoginButtons';
import AuthLayout from '@/Layouts/AuthLayout';
import { useLocale } from '@/i18n/LocaleProvider';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { t } = useLocale();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout>
            <Head title={t('auth.register.submit')} />

            <div className="animate-fade-in">
                <div className="mb-8">
                    <h1 className="heading-2 text-secondary-900 mb-2">
                        {t('auth.register.title')} 🚀
                    </h1>
                    <p className="text-body-sm text-secondary-500">
                        {t('auth.register.subtitle')}
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-secondary-900 mb-2">
                            {t('auth.register.full_name')}
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            placeholder="Ism Familiya"
                            className="input-theme w-full"
                            autoComplete="name"
                            autoFocus
                            required
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

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
                            required
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-secondary-900 mb-2">
                            {t('common.password')}
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            placeholder="••••••••"
                            className="input-theme w-full"
                            autoComplete="new-password"
                            required
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                        <p className="mt-1 text-xs text-secondary-500">{t('auth.register.password_hint')}</p>
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-semibold text-secondary-900 mb-2">
                            {t('common.confirm_password')}
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            placeholder="••••••••"
                            className="input-theme w-full"
                            autoComplete="new-password"
                            required
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 px-4 btn-theme-primary font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                    >
                        {t('auth.register.submit')}
                    </button>
                </form>

                <SocialLoginButtons />

                <div className="mt-8 text-center text-sm text-secondary-500">
                    {t('auth.register.already_have_account')}{' '}
                    <Link href={route('login')} className="text-theme-primary font-bold hover:opacity-80 hover:underline transition-colors">
                        {t('auth.register.sign_in')}
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
