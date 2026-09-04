import InputError from '@/Components/InputError';
import PermissionMatrix from '@/Components/PermissionMatrix';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLocale } from '@/i18n/LocaleProvider';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Create({ groupedPermissions }: { groupedPermissions: Record<string, string[]> }) {
    const { t } = useLocale();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as string[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('roles.store'));
    };

    const togglePermission = (permission: string) => {
        setData(
            'permissions',
            data.permissions.includes(permission)
                ? data.permissions.filter((p) => p !== permission)
                : [...data.permissions, permission],
        );
    };

    return (
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('roles.create.title')}</h2>}>
            <Head title={t('roles.create.title')} />

            <div className="card p-6 max-w-3xl">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('roles.field.name')}</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="input-theme w-full max-w-sm"
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-secondary-900 mb-3">{t('roles.field.permissions')}</label>
                        <PermissionMatrix
                            groupedPermissions={groupedPermissions}
                            selected={data.permissions}
                            onToggle={togglePermission}
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm"
                        >
                            {t('common.save')}
                        </button>
                        <Link
                            href={route('roles.index')}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-secondary-500 hover:bg-surface-100"
                        >
                            {t('common.cancel')}
                        </Link>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
