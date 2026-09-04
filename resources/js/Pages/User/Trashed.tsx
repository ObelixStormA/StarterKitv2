import Pagination from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLocale } from '@/i18n/LocaleProvider';
import { confirmDelete } from '@/lib/swal';
import { Paginated, User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

export default function Trashed({ users, filters }: { users: Paginated<User>; filters: { search?: string } }) {
    const { t } = useLocale();

    const restore = (user: User) => {
        router.post(route('users.restore', user.id), {}, { preserveScroll: true });
    };

    const forceDelete = async (user: User) => {
        const confirmed = await confirmDelete({
            title: t('common.are_you_sure'),
            text: t('common.force_delete_confirm', { name: user.name }),
            confirmText: t('common.confirm_delete_button'),
            cancelText: t('common.cancel'),
        });

        if (confirmed) {
            router.delete(route('users.force-delete', user.id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('common.trash')} — {t('users.title')}</h2>}>
            <Head title={`${t('common.trash')} — ${t('users.title')}`} />

            <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                    <Link href={route('users.index')} className="text-sm text-theme-primary hover:underline font-medium">
                        ← {t('users.title')}
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-secondary-500 border-b border-surface-200">
                                <th className="py-3 pr-4 font-semibold">{t('users.table.name')}</th>
                                <th className="py-3 pr-4 font-semibold">{t('users.table.email')}</th>
                                <th className="py-3 pr-4 font-semibold text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((user) => (
                                <tr key={user.id} className="border-b border-surface-100 last:border-0">
                                    <td className="py-3 pr-4 text-secondary-900 font-medium">{user.name}</td>
                                    <td className="py-3 pr-4 text-secondary-500">{user.email}</td>
                                    <td className="py-3 pr-4 text-right space-x-2 whitespace-nowrap">
                                        <button
                                            onClick={() => restore(user)}
                                            className="text-theme-primary hover:underline text-sm font-medium"
                                        >
                                            {t('common.restore')}
                                        </button>
                                        <button
                                            onClick={() => forceDelete(user)}
                                            className="text-red-600 hover:underline text-sm font-medium"
                                        >
                                            {t('common.delete_forever')}
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {users.data.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-secondary-500">
                                        {t('common.trash_empty')}
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
