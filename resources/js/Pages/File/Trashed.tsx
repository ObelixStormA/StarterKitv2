import { FileIcon } from '@/Components/Icons';
import Pagination from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLocale } from '@/i18n/LocaleProvider';
import { confirmDelete } from '@/lib/swal';
import { formatBytes } from '@/lib/format';
import { FileItem, Paginated } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

export default function Trashed({ files }: { files: Paginated<FileItem> }) {
    const { t } = useLocale();

    const restore = (file: FileItem) => {
        router.post(route('files.restore', file.id), {}, { preserveScroll: true });
    };

    const forceDelete = async (file: FileItem) => {
        const confirmed = await confirmDelete({
            title: t('common.are_you_sure'),
            text: t('common.force_delete_confirm', { name: file.name }),
            confirmText: t('common.confirm_delete_button'),
            cancelText: t('common.cancel'),
        });

        if (confirmed) {
            router.delete(route('files.force-delete', file.id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('common.trash')} — {t('files.title')}</h2>}>
            <Head title={`${t('common.trash')} — ${t('files.title')}`} />

            <div className="card p-6">
                <div className="mb-6">
                    <Link href={route('files.index')} className="text-sm text-theme-primary hover:underline font-medium">
                        ← {t('files.title')}
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {files.data.map((file) => (
                        <div key={file.id} className="rounded-xl border border-surface-200 p-3">
                            <div className="aspect-square rounded-lg bg-surface-50 flex items-center justify-center overflow-hidden mb-2">
                                {file.is_image ? (
                                    <img src={file.url} alt={file.name} className="w-full h-full object-cover opacity-60" />
                                ) : (
                                    <FileIcon className="w-10 h-10 text-secondary-400" />
                                )}
                            </div>
                            <p className="text-xs font-medium text-secondary-900 truncate" title={file.name}>
                                {file.name}
                            </p>
                            <p className="text-[11px] text-secondary-500 mb-2">{formatBytes(file.size)}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => restore(file)}
                                    className="flex-1 text-xs font-semibold text-theme-primary hover:underline"
                                >
                                    {t('common.restore')}
                                </button>
                                <button
                                    onClick={() => forceDelete(file)}
                                    className="flex-1 text-xs font-semibold text-red-600 hover:underline"
                                >
                                    {t('common.delete_forever')}
                                </button>
                            </div>
                        </div>
                    ))}

                    {files.data.length === 0 && (
                        <p className="col-span-full py-8 text-center text-secondary-500 text-sm">{t('common.trash_empty')}</p>
                    )}
                </div>

                <Pagination paginator={files} />
            </div>
        </AuthenticatedLayout>
    );
}
