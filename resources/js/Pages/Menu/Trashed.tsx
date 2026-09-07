import Pagination from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLocale } from '@/i18n/LocaleProvider';
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
            text: t('common.force_delete_confirm', { name: menu.name }),
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

            <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                    <Link href={route('menus.index')} className="text-sm text-theme-primary hover:underline font-medium">
                        ← {t('menus.title')}
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-secondary-500 border-b border-surface-200">
                                <th className="py-3 pr-4 font-semibold">{t('menus.field.key')}</th>
                                <th className="py-3 pr-4 font-semibold">{t('menus.field.name')}</th>
                                <th className="py-3 pr-4 font-semibold text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menus.data.map((menu) => (
                                <tr key={menu.id} className="border-b border-surface-100 last:border-0">
                                    <td className="py-3 pr-4 font-mono text-xs text-secondary-500">{menu.key}</td>
                                    <td className="py-3 pr-4 text-secondary-900 font-medium">{menu.name}</td>
                                    <td className="py-3 pr-4 text-right space-x-2 whitespace-nowrap">
                                        <button onClick={() => restore(menu)} className="text-theme-primary hover:underline text-sm font-medium">
                                            {t('common.restore')}
                                        </button>
                                        <button onClick={() => forceDelete(menu)} className="text-red-600 hover:underline text-sm font-medium">
                                            {t('common.delete_forever')}
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {menus.data.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-secondary-500">
                                        {t('common.trash_empty')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination paginator={menus} />
            </div>
        </AuthenticatedLayout>
    );
}
