import { RestoreIcon, TrashIcon, UsersIcon } from '@/Components/Icons';
import { EmptyState, TableActionButton, TableActions, TableBody, TableCard, TableHead, Td, Th, Tr } from '@/Components/DataTable';
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

            <div className="space-y-4">
                <Link href={route('users.index')} className="text-sm text-theme-primary hover:underline font-medium">
                    ← {t('users.title')}
                </Link>

                {users.data.length === 0 ? (
                    <div className="card rounded-xl">
                        <EmptyState icon={UsersIcon} title={t('common.trash_empty')} />
                    </div>
                ) : (
                    <TableCard>
                        <TableHead>
                            <Th>{t('users.table.name')}</Th>
                            <Th>{t('users.table.email')}</Th>
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
                                    <Td align="right">
                                        <TableActions>
                                            <TableActionButton icon={RestoreIcon} onClick={() => restore(user)} title={t('common.restore')} />
                                            <TableActionButton
                                                icon={TrashIcon}
                                                onClick={() => forceDelete(user)}
                                                title={t('common.delete_forever')}
                                                variant="danger"
                                            />
                                        </TableActions>
                                    </Td>
                                </Tr>
                            ))}
                        </TableBody>
                    </TableCard>
                )}

                <Pagination paginator={users} />
            </div>
        </AuthenticatedLayout>
    );
}
