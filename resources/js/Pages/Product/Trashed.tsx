import { FileIcon, RestoreIcon, TrashIcon } from '@/Components/Icons';
import { EmptyState, TableActionButton, TableActions, TableBody, TableCard, TableHead, Td, Th, Tr } from '@/Components/DataTable';
import Pagination from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLocale } from '@/i18n/LocaleProvider';
import { confirmDelete } from '@/lib/swal';
import { Product, Paginated } from '@/types';
import { Head, router } from '@inertiajs/react';

export default function Trashed({ products }: { products: Paginated<Product> }) {
    const { t } = useLocale();

    const restore = (item: Product) => router.post(route('products.restore', item.id));

    const forceDelete = async (item: Product) => {
        const confirmed = await confirmDelete({
            title: t('common.are_you_sure'),
            text: t('common.force_delete_confirm', { name: String(item.name) }),
            confirmText: t('common.delete_forever'),
            cancelText: t('common.cancel'),
        });

        if (confirmed) {
            router.delete(route('products.force-delete', item.id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('common.trash')} — {t('products.title')}</h2>}>
            <Head title={t('common.trash')} />

            <div className="space-y-4">
                {products.data.length === 0 ? (
                    <div className="card rounded-xl">
                        <EmptyState icon={FileIcon} title={t('common.trash_empty')} />
                    </div>
                ) : (
                    <TableCard>
                        <TableHead>
                            <Th>{t('products.field.name')}</Th>
                            <Th align="right">{t('common.actions')}</Th>
                        </TableHead>
                        <TableBody>
                            {products.data.map((item) => (
                                <Tr key={item.id}>
                                    <Td>
                                        <span className="text-sm font-medium text-secondary-900">{item.name}</span>
                                    </Td>
                                    <Td align="right">
                                        <TableActions>
                                            <TableActionButton icon={RestoreIcon} onClick={() => restore(item)} title={t('common.restore')} />
                                            <TableActionButton
                                                icon={TrashIcon}
                                                onClick={() => forceDelete(item)}
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

                <Pagination paginator={products} />
            </div>
        </AuthenticatedLayout>
    );
}
