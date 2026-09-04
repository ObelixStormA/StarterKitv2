import InputError from '@/Components/InputError';
import { useLocale } from '@/i18n/LocaleProvider';
import { User } from '@/types';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function AccountTab({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { t } = useLocale();
    const { auth } = usePage().props as unknown as { auth: { user: User } };
    const user = auth.user;
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, patch, errors, processing } = useForm({
        name: user.name,
        email: user.email,
    });

    const avatarForm = useForm<{ avatar: File | null }>({ avatar: null });

    const initials = user.name
        .split(' ')
        .map((part: string) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const pickAvatar = (file: File | undefined) => {
        if (!file) return;

        avatarForm.setData('avatar', file);
        router.post(route('profile.avatar'), { avatar: file }, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-secondary-900 mb-1">{t('account.personal_info')}</h2>
                <p className="text-sm text-secondary-500">{t('account.personal_info_desc')}</p>
            </div>

            <div>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('account.profile_photo')}</label>
                <div className="flex items-center gap-4">
                    {user.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt={user.name}
                            className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-theme-primary flex items-center justify-center text-white text-2xl font-semibold flex-shrink-0">
                            {initials}
                        </div>
                    )}

                    <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => pickAvatar(e.target.files?.[0])}
                    />
                    <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={avatarForm.processing}
                        className="px-4 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm disabled:opacity-60"
                    >
                        {avatarForm.processing ? t('files.uploading') : t('account.upload_new_photo')}
                    </button>
                </div>
                <InputError message={avatarForm.errors.avatar} className="mt-2" />
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('common.name')}</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="input-theme w-full"
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('common.email')}</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="input-theme w-full"
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-xl bg-surface-50 p-4">
                        <p className="text-sm text-secondary-700">
                            {t('account.email_unverified')}{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="text-theme-primary font-semibold hover:underline"
                            >
                                {t('account.resend_verification')}
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <p className="mt-2 text-sm font-medium text-green-600">{t('account.verification_sent')}</p>
                        )}
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm"
                    >
                        {t('common.save')}
                    </button>
                </div>
            </form>
        </div>
    );
}
