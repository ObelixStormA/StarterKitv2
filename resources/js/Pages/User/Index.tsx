import { EditIcon, TrashIcon, UsersIcon } from '@/Components/Icons';
import { EmptyState, TableActionButton, TableActions, TableBody, TableCard, TableHead, Td, Th, Tr } from '@/Components/DataTable';
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

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <form onSubmit={search} className="flex-1 max-w-sm">
                        <input
                            type="text"
                            placeholder={t('common.search')}
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            className="input-theme w-full"
                        />
                    </form>

                    <div className="flex items-center gap-3">
                        {can('users.delete') && (
                            <Link
                                href={route('users.trashed')}
                                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-secondary-500 border border-surface-200 hover:bg-surface-100 whitespace-nowrap"
                            >
                                {t('common.trash')}
                            </Link>
                        )}

                        {can('users.create') && (
                            <Link
                                href={route('users.create')}
                                className="px-4 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm whitespace-nowrap"
                            >
                                + {t('users.new')}
                            </Link>
                        )}
                    </div>
                </div>

                <TableCard>
                    <TableHead>
                        <Th>{t('users.table.name')}</Th>
                        <Th>{t('users.table.email')}</Th>
                        <Th>{t('users.table.roles')}</Th>
                        <Th align="right">{t('common.actions')}</Th>
                    </TableHead>
                    <TableBody>
                        {users.data.map((user) => (
                            <Tr key={user.id}>
                                <Td>
                                    <span className="text-sm font-medium text-secondary-900">{user.name}</span>
                                </Td>
                                <Td>
                                    <span className="text-sm text-secondary-600">{user.email}</span>
                                </Td>
                                <Td>
                                    <div className="flex flex-wrap gap-1">
                                        {user.roles?.map((role) => (
                                            <span
                                                key={role.id}
                                                className="px-2.5 py-1 text-xs font-medium rounded-full bg-theme-primary/10 text-theme-primary"
                                            >
                                                {role.name}
                                            </span>
                                        ))}
                                    </div>
                                </Td>
                                <Td align="right">
                                    <TableActions>
                                        {can('users.edit') && (
                                            <TableActionButton
                                                icon={EditIcon}
                                                href={route('users.edit', user.id)}
                                                title={t('common.edit')}
                                            />
                                        )}
                                        {can('users.delete') && (
                                            <TableActionButton
                                                icon={TrashIcon}
                                                onClick={() => destroy(user)}
                                                title={t('common.delete')}
                                                variant="danger"
                                            />
                                        )}
                                    </TableActions>
                                </Td>
                            </Tr>
                        ))}
                    </TableBody>
                </TableCard>

                {users.data.length === 0 && (
                    <div className="card rounded-xl">
                        <EmptyState icon={UsersIcon} title={t('users.none_found')} />
                    </div>
                )}

                <Pagination paginator={users} />
            </div>
        </AuthenticatedLayout>
    );
}
