import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useLocale } from '@/i18n/LocaleProvider';
import { toastSuccess } from '@/lib/swal';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function SecurityTab() {
    const { t } = useLocale();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-lg font-bold text-secondary-900 mb-1">{t('account.security_settings')}</h2>
                <p className="text-sm text-secondary-500">{t('account.security_desc')}</p>
            </div>

            <ChangePasswordSection />

            <div className="pt-6 border-t border-surface-200">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="font-semibold text-secondary-900 mb-1">{t('account.two_factor_auth')}</h3>
                        <p className="text-sm text-secondary-500">{t('account.two_factor_desc')}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => toastSuccess(t('account.upload_coming_soon'))}
                        className="px-4 py-2 rounded-lg font-medium text-sm border border-surface-200 text-secondary-700 hover:bg-surface-100"
                    >
                        {t('account.enable')}
                    </button>
                </div>
            </div>

            <div className="pt-6 border-t border-surface-200">
                <h3 className="font-semibold text-secondary-900 mb-3">{t('account.active_sessions')}</h3>
                <div className="p-4 border border-surface-200 rounded-xl">
                    <div className="font-medium text-secondary-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        {t('account.current_session')}
                    </div>
                    <div className="text-sm text-secondary-500 mt-1">{t('account.last_active_now')}</div>
                </div>
            </div>

            <DeleteAccountSection />
        </div>
    );
}

function ChangePasswordSection() {
    const { t } = useLocale();
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toastSuccess(t('account.saved'));
            },
            onError: (formErrors) => {
                if (formErrors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (formErrors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <div>
            <h3 className="font-semibold text-secondary-900 mb-3">{t('account.change_password')}</h3>
            <form onSubmit={submit} className="space-y-4 max-w-lg">
                <div>
                    <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('account.current_password')}</label>
                    <input
                        ref={currentPasswordInput}
                        type="password"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        className="input-theme w-full"
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} className="mt-2" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('account.new_password')}</label>
                    <input
                        ref={passwordInput}
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="input-theme w-full"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('account.confirm_new_password')}</label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="input-theme w-full"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>
                <button
                    type="submit"
                    disabled={processing}
                    className="px-5 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm"
                >
                    {t('account.update_password')}
                </button>
            </form>
        </div>
    );
}

function DeleteAccountSection() {
    const { t } = useLocale();
    const [confirming, setConfirming] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirming(false);
        clearErrors();
        reset();
    };

    return (
        <div className="pt-6 border-t border-surface-200">
            <h3 className="font-semibold text-red-600 mb-1">{t('account.delete_account')}</h3>
            <p className="text-sm text-secondary-500 mb-4">{t('account.delete_account_desc')}</p>

            <button
                type="button"
                onClick={() => setConfirming(true)}
                className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-red-600 text-white hover:bg-red-700"
            >
                {t('account.delete_account_button')}
            </button>

            <Modal show={confirming} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-bold text-secondary-900">{t('account.delete_confirm_title')}</h2>
                    <p className="mt-1 text-sm text-secondary-500">{t('account.delete_confirm_desc')}</p>

                    <div className="mt-6">
                        <input
                            ref={passwordInput}
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="input-theme w-full"
                            placeholder={t('common.password')}
                            autoFocus
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-secondary-500 hover:bg-surface-100"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-red-600 text-white hover:bg-red-700"
                        >
                            {t('account.delete_account_button')}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
