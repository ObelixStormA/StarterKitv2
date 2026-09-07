import { EditIcon, FileIcon, TrashIcon } from '@/Components/Icons';
import { EmptyState, TableActionButton, TableActions, TableBody, TableCard, TableHead, Td, Th, Tr } from '@/Components/DataTable';
import Pagination from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePermission } from '@/hooks/usePermission';
import { useLocale } from '@/i18n/LocaleProvider';
import { confirmDelete } from '@/lib/swal';
import { Product, Paginated } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ products }: { products: Paginated<Product> }) {
    const { can } = usePermission();
    const { t } = useLocale();

    const destroy = async (item: Product) => {
        const confirmed = await confirmDelete({
            title: t('common.are_you_sure'),
            text: t('products.delete_confirm', { name: String(item.id) }),
            confirmText: t('common.confirm_delete_button'),
            cancelText: t('common.cancel'),
        });

        if (confirmed) {
            router.delete(route('products.destroy', item.id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('products.title')}</h2>}>
            <Head title={t('products.title')} />

            <div className="space-y-4">
                <div className="flex items-center justify-end gap-4">
                    {can('products.delete') && (
                        <Link href={route('products.trashed')} className="text-sm font-medium text-secondary-500 hover:underline">
                            {t('common.trash')}
                        </Link>
                    )}
                    {can('products.create') && (
                        <Link
                            href={route('products.create')}
                            className="px-4 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm"
                        >
                            + {t('products.new')}
                        </Link>
                    )}
                </div>

                {products.data.length === 0 ? (
                    <div className="card rounded-xl">
                        <EmptyState icon={FileIcon} title={t('common.not_found')} />
                    </div>
                ) : (
                    <TableCard>
                        <TableHead>
                            <Th>{t('products.field.name')}</Th>
                            <Th>{t('products.field.price')}</Th>
                            <Th align="right">{t('common.actions')}</Th>
                        </TableHead>
                        <TableBody>
                            {products.data.map((item) => (
                                <Tr key={item.id}>
                                    <Td>
                                        <span className="text-sm font-medium text-secondary-900">{item.name}</span>
                                    </Td>
                                    <Td>
                                        <span className="text-sm text-secondary-600">{item.price}</span>
                                    </Td>
                                    <Td align="right">
                                        <TableActions>
                                            {can('products.edit') && (
                                                <TableActionButton icon={EditIcon} href={route('products.edit', item.id)} title={t('common.edit')} />
                                            )}
                                            {can('products.delete') && (
                                                <TableActionButton
                                                    icon={TrashIcon}
                                                    onClick={() => destroy(item)}
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
                )}

                <Pagination paginator={products} />
            </div>
        </AuthenticatedLayout>
    );
}
