import Pagination from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePermission } from '@/hooks/usePermission';
import { useLocale } from '@/i18n/LocaleProvider';
import { confirmDelete } from '@/lib/swal';
import { Paginated, User } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Index({
    users,
    filters,
}: {
    users: Paginated<User>;
    filters: { search?: string };
}) {
    const { can } = usePermission();
    const { t } = useLocale();
    const { data, setData } = useForm({ search: filters.search ?? '' });

    const search: FormEventHandler = (e) => {
        e.preventDefault();
        router.get(route('users.index'), { search: data.search }, { preserveState: true });
    };

    const destroy = async (user: User) => {
        const confirmed = await confirmDelete({
            title: t('common.are_you_sure'),
            text: t('users.delete_confirm', { name: user.name }),
            confirmText: t('common.confirm_delete_button'),
            cancelText: t('common.cancel'),
        });

        if (confirmed) {
            router.delete(route('users.destroy', user.id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('users.title')}</h2>}>
            <Head title={t('users.title')} />

            <div className="card p-6">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <form onSubmit={search} className="flex-1 max-w-sm">
                        <input
                            type="text"
                            placeholder={t('common.search')}
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            className="input-theme w-full"
                        />
                    </form>

                    {can('users.create') && (
                        <Link
                            href={route('users.create')}
                            className="px-4 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm whitespace-nowrap"
                        >
                            + {t('users.new')}
                        </Link>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-secondary-500 border-b border-surface-200">
                                <th className="py-3 pr-4 font-semibold">{t('users.table.name')}</th>
                                <th className="py-3 pr-4 font-semibold">{t('users.table.email')}</th>
                                <th className="py-3 pr-4 font-semibold">{t('users.table.roles')}</th>
                                <th className="py-3 pr-4 font-semibold text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user) => (
                                <tr key={user.id} className="border-b border-surface-100 last:border-0">
                                    <td className="py-3 pr-4 text-secondary-900 font-medium">{user.name}</td>
                                    <td className="py-3 pr-4 text-secondary-500">{user.email}</td>
                                    <td className="py-3 pr-4">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles?.map((role) => (
                                                <span
                                                    key={role.id}
                                                    className="px-2 py-0.5 text-xs font-medium rounded-full bg-theme-primary/10 text-theme-primary"
                                                >
                                                    {role.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-3 pr-4 text-right space-x-2 whitespace-nowrap">
                                        {can('users.edit') && (
                                            <Link
                                                href={route('users.edit', user.id)}
                                                className="text-theme-primary hover:underline text-sm font-medium"
                                            >
                                                {t('common.edit')}
                                            </Link>
                                        )}
                                        {can('users.delete') && (
                                            <button
                                                onClick={() => destroy(user)}
                                                className="text-red-600 hover:underline text-sm font-medium"
                                            >
                                                {t('common.delete')}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {users.data.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-secondary-500">
                                        {t('users.none_found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination paginator={users} />
            </div>
        </AuthenticatedLayout>
    );
}
