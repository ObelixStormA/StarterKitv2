import Pagination from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePermission } from '@/hooks/usePermission';
import { useLocale } from '@/i18n/LocaleProvider';
import { confirmDelete } from '@/lib/swal';
import { Paginated, Role } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ roles }: { roles: Paginated<Role> }) {
    const { can } = usePermission();
    const { t } = useLocale();

    const destroy = async (role: Role) => {
        const confirmed = await confirmDelete({
            title: t('common.are_you_sure'),
            text: t('roles.delete_confirm', { name: role.name }),
            confirmText: t('common.confirm_delete_button'),
            cancelText: t('common.cancel'),
        });

        if (confirmed) {
            router.delete(route('roles.destroy', role.id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('roles.title')}</h2>}>
            <Head title={t('roles.title')} />

            <div className="card p-6">
                <div className="flex items-center justify-end mb-6">
                    {can('roles.create') && (
                        <Link
                            href={route('roles.create')}
                            className="px-4 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm"
                        >
                            + {t('roles.new')}
                        </Link>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-secondary-500 border-b border-surface-200">
                                <th className="py-3 pr-4 font-semibold">{t('roles.table.name')}</th>
                                <th className="py-3 pr-4 font-semibold">{t('roles.table.permissions_count')}</th>
                                <th className="py-3 pr-4 font-semibold text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.data.map((role) => (
                                <tr key={role.id} className="border-b border-surface-100 last:border-0">
                                    <td className="py-3 pr-4 text-secondary-900 font-medium capitalize">{role.name}</td>
                                    <td className="py-3 pr-4 text-secondary-500">{role.permissions_count}</td>
                                    <td className="py-3 pr-4 text-right space-x-2 whitespace-nowrap">
                                        {can('roles.edit') && (
                                            <Link
                                                href={route('roles.edit', role.id)}
                                                className="text-theme-primary hover:underline text-sm font-medium"
                                            >
                                                {t('common.edit')}
                                            </Link>
                                        )}
                                        {can('roles.delete') && role.name !== 'admin' && (
                                            <button
                                                onClick={() => destroy(role)}
                                                className="text-red-600 hover:underline text-sm font-medium"
                                            >
                                                {t('common.delete')}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination paginator={roles} />
            </div>
        </AuthenticatedLayout>
    );
}
