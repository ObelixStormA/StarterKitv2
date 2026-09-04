import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { useLocale } from '@/i18n/LocaleProvider';
import { confirmDelete, toastSuccess } from '@/lib/swal';
import { User } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';

export default function SecurityTab() {
    const { t } = useLocale();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-lg font-bold text-secondary-900 mb-1">{t('account.security_settings')}</h2>
                <p className="text-sm text-secondary-500">{t('account.security_desc')}</p>
            </div>

            <ChangePasswordSection />

            <TwoFactorSection />

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

function TwoFactorSection() {
    const { t } = useLocale();
    const { auth, flash } = usePage().props as unknown as {
        auth: { user: User & { two_factor_enabled: boolean } };
        flash: { recovery_codes?: string[] | null };
    };

    const [enabling, setEnabling] = useState(false);
    const [qrSvg, setQrSvg] = useState<string | null>(null);
    const [secret, setSecret] = useState<string | null>(null);
    const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({ code: '' });

    useEffect(() => {
        if (flash.recovery_codes) {
            setRecoveryCodes(flash.recovery_codes);
        }
    }, [flash.recovery_codes]);

    const startEnabling = () => {
        setEnabling(true);
        fetch(route('two-factor.enable'), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
            },
            credentials: 'same-origin',
        })
            .then((res) => res.json())
            .then((json) => {
                setQrSvg(json.svg);
                setSecret(json.secret);
            });
    };

    const confirm: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('two-factor.confirm'), {
            preserveScroll: true,
            onSuccess: () => {
                setEnabling(false);
                setQrSvg(null);
                reset();
            },
        });
    };

    const disable = async () => {
        const confirmed = await confirmDelete({
            title: t('common.are_you_sure'),
            text: t('two_factor.disable_confirm'),
            confirmText: t('common.confirm_delete_button'),
            cancelText: t('common.cancel'),
        });

        if (confirmed) {
            router.delete(route('two-factor.disable'), {
                preserveScroll: true,
                onSuccess: () => toastSuccess(t('two_factor.disabled')),
            });
        }
    };

    return (
        <div className="pt-6 border-t border-surface-200">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-secondary-900 mb-1 flex items-center gap-2">
                        {t('account.two_factor_auth')}
                        {auth.user.two_factor_enabled && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                {t('two_factor.enabled_badge')}
                            </span>
                        )}
                    </h3>
                    <p className="text-sm text-secondary-500">{t('account.two_factor_desc')}</p>
                </div>

                {auth.user.two_factor_enabled ? (
                    <button
                        type="button"
                        onClick={disable}
                        className="px-4 py-2 rounded-lg font-medium text-sm border border-red-200 text-red-600 hover:bg-red-50"
                    >
                        {t('two_factor.disable')}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={startEnabling}
                        className="px-4 py-2 rounded-lg font-medium text-sm border border-surface-200 text-secondary-700 hover:bg-surface-100"
                    >
                        {t('account.enable')}
                    </button>
                )}
            </div>

            <Modal show={enabling} onClose={() => setEnabling(false)}>
                <form onSubmit={confirm} className="p-6">
                    <h2 className="text-lg font-bold text-secondary-900 mb-4">{t('two_factor.setup_title')}</h2>

                    {qrSvg ? (
                        <>
                            <p className="text-sm text-secondary-500 mb-4">{t('two_factor.scan_hint')}</p>
                            <div
                                className="flex justify-center mb-4 [&_svg]:w-48 [&_svg]:h-48"
                                dangerouslySetInnerHTML={{ __html: qrSvg }}
                            />
                            {secret && (
                                <p className="text-center text-xs text-secondary-500 mb-4">
                                    {t('two_factor.manual_key')}: <code className="font-mono">{secret}</code>
                                </p>
                            )}

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

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEnabling(false)}
                                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-secondary-500 hover:bg-surface-100"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm"
                                >
                                    {t('two_factor.verify')}
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-secondary-500">{t('files.uploading')}</p>
                    )}
                </form>
            </Modal>

            <Modal show={!!recoveryCodes} onClose={() => setRecoveryCodes(null)}>
                <div className="p-6">
                    <h2 className="text-lg font-bold text-secondary-900 mb-2">{t('two_factor.recovery_codes_title')}</h2>
                    <p className="text-sm text-secondary-500 mb-4">{t('two_factor.recovery_codes_desc')}</p>
                    <div className="grid grid-cols-2 gap-2 bg-surface-50 rounded-xl p-4 font-mono text-sm">
                        {recoveryCodes?.map((code) => <div key={code}>{code}</div>)}
                    </div>
                    <button
                        type="button"
                        onClick={() => setRecoveryCodes(null)}
                        className="mt-6 w-full px-4 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm"
                    >
                        {t('two_factor.recovery_codes_saved')}
                    </button>
                </div>
            </Modal>
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
