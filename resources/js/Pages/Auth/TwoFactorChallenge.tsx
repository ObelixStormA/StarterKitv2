import InputError from '@/Components/InputError';
import AuthLayout from '@/Layouts/AuthLayout';
import { useLocale } from '@/i18n/LocaleProvider';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function TwoFactorChallenge() {
    const { t } = useLocale();
    const { data, setData, post, processing, errors } = useForm({ code: '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('two-factor.challenge.store'));
    };

    return (
        <AuthLayout>
            <Head title={t('two_factor.title')} />

            <div className="animate-fade-in">
                <div className="mb-8">
                    <h1 className="heading-2 text-secondary-900 mb-2">{t('two_factor.title')} 🔐</h1>
                    <p className="text-body-sm text-secondary-500">{t('two_factor.challenge_subtitle')}</p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">
                            {t('two_factor.code_label')}
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            autoFocus
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            placeholder="123456"
                            className="input-theme w-full text-center text-lg tracking-[0.5em]"
                        />
                        <InputError message={errors.code} className="mt-2" />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 px-4 btn-theme-primary font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                    >
                        {t('two_factor.verify')}
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
}
