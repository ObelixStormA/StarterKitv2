import { MenuIcon, RestoreIcon, TrashIcon } from '@/Components/Icons';
import { EmptyState, TableActionButton, TableActions, TableBody, TableCard, TableHead, Td, Th, Tr } from '@/Components/DataTable';
import Pagination from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { MessageKey, useLocale } from '@/i18n/LocaleProvider';
import { confirmDelete } from '@/lib/swal';
import { Menu, Paginated } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

export default function Trashed({ menus }: { menus: Paginated<Menu> }) {
    const { t } = useLocale();

    const restore = (menu: Menu) => {
        router.post(route('menus.restore', menu.id), {}, { preserveScroll: true });
    };

    const forceDelete = async (menu: Menu) => {
        const confirmed = await confirmDelete({
            title: t('common.are_you_sure'),
            text: t('common.force_delete_confirm', { name: t(menu.name as MessageKey) }),
            confirmText: t('common.confirm_delete_button'),
            cancelText: t('common.cancel'),
        });

        if (confirmed) {
            router.delete(route('menus.force-delete', menu.id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('common.trash')} — {t('menus.title')}</h2>}>
            <Head title={`${t('common.trash')} — ${t('menus.title')}`} />

            <div className="space-y-4">
                <Link href={route('menus.index')} className="text-sm text-theme-primary hover:underline font-medium">
                    ← {t('menus.title')}
                </Link>

                {menus.data.length === 0 ? (
                    <div className="card rounded-xl">
                        <EmptyState icon={MenuIcon} title={t('common.trash_empty')} />
                    </div>
                ) : (
                    <TableCard>
                        <TableHead>
                            <Th>{t('menus.field.key')}</Th>
                            <Th>{t('menus.field.name')}</Th>
                            <Th align="right">{t('common.actions')}</Th>
                        </TableHead>
                        <TableBody>
                            {menus.data.map((menu) => (
                                <Tr key={menu.id}>
                                    <Td>
                                        <span className="font-mono text-xs text-secondary-500">{menu.key}</span>
                                    </Td>
                                    <Td>
                                        <span className="text-sm font-medium text-secondary-900">{t(menu.name as MessageKey)}</span>
                                    </Td>
                                    <Td align="right">
                                        <TableActions>
                                            <TableActionButton icon={RestoreIcon} onClick={() => restore(menu)} title={t('common.restore')} />
                                            <TableActionButton
                                                icon={TrashIcon}
                                                onClick={() => forceDelete(menu)}
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

                <Pagination paginator={menus} />
            </div>
        </AuthenticatedLayout>
    );
}
