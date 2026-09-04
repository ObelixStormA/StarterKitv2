import InputError from '@/Components/InputError';
import PermissionMatrix from '@/Components/PermissionMatrix';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLocale } from '@/i18n/LocaleProvider';
import { Role } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Edit({
    role,
    groupedPermissions,
}: {
    role: Role;
    groupedPermissions: Record<string, string[]>;
}) {
    const { t } = useLocale();
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions?.map((p) => p.name) ?? ([] as string[]),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('roles.update', role.id));
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
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('roles.edit.title')}</h2>}>
            <Head title={t('roles.edit.title')} />

            <div className="card p-6 max-w-3xl">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-secondary-900 mb-2">{t('roles.field.name')}</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="input-theme w-full max-w-sm"
                            disabled={role.name === 'admin'}
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
