import DonutChart from '@/Components/DonutChart';
import {
    ArchiveIcon,
    DownloadIcon,
    FileIcon,
    ImageIcon,
    MusicIcon,
    UploadIcon,
    VideoIcon,
} from '@/Components/Icons';
import Pagination from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePermission } from '@/hooks/usePermission';
import { useLocale } from '@/i18n/LocaleProvider';
import { formatBytes } from '@/lib/format';
import { confirmDelete } from '@/lib/swal';
import { FileCategory, FileItem, FileStats, Paginated } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ComponentType, DragEvent, FormEventHandler, SVGProps, useRef, useState } from 'react';

const CATEGORY_META: Record<FileCategory, { icon: ComponentType<SVGProps<SVGSVGElement>>; bg: string; fg: string; chart: string }> = {
    image: { icon: ImageIcon, bg: 'bg-green-50', fg: 'text-green-600', chart: '#22c55e' },
    video: { icon: VideoIcon, bg: 'bg-pink-50', fg: 'text-pink-600', chart: '#ec4899' },
    audio: { icon: MusicIcon, bg: 'bg-blue-50', fg: 'text-blue-600', chart: '#3b82f6' },
    document: { icon: FileIcon, bg: 'bg-amber-50', fg: 'text-amber-600', chart: '#f59e0b' },
    archive: { icon: ArchiveIcon, bg: 'bg-purple-50', fg: 'text-purple-600', chart: '#a855f7' },
    other: { icon: FileIcon, bg: 'bg-surface-100', fg: 'text-secondary-500', chart: '#94a3b8' },
};

export default function Index({
    files,
    stats,
    filters,
}: {
    files: Paginated<FileItem>;
    stats: FileStats;
    filters: { search?: string; category?: FileCategory };
}) {
    const { can } = usePermission();
    const { t } = useLocale();
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState(filters.search ?? '');

    const { data, setData, post, processing, progress } = useForm<{ files: File[] }>({ files: [] });

    const goTo = (params: { search?: string; category?: string }) => {
        router.get(route('files.index'), params, { preserveState: true });
    };

    const submitSearch: FormEventHandler = (e) => {
        e.preventDefault();
        goTo({ search, category: filters.category });
    };

    const selectCategory = (category?: FileCategory) => {
        goTo({ search: filters.search, category });
    };

    const uploadFiles = (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;
        setData('files', Array.from(fileList));
    };

    const doUpload = () => {
        if (data.files.length === 0) return;
        post(route('files.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => setData('files', []),
        });
    };

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        uploadFiles(e.dataTransfer.files);
    };

    const destroy = async (file: FileItem) => {
        const confirmed = await confirmDelete({
            title: t('common.are_you_sure'),
            text: t('files.delete_confirm', { name: file.name }),
            confirmText: t('common.confirm_delete_button'),
            cancelText: t('common.cancel'),
        });

        if (confirmed) {
            router.delete(route('files.destroy', file.id), { preserveScroll: true });
        }
    };

    const chartSegments = stats.byCategory
        .filter((c) => c.size > 0)
        .map((c) => ({
            label: t(`files.category.${c.category}`),
            value: c.size,
            color: CATEGORY_META[c.category].chart,
        }));

    return (
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('files.title')}</h2>}>
            <Head title={t('files.title')} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    {/* All Media */}
                    <div className="card p-6">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <h3 className="text-base font-bold text-secondary-900">{t('files.all_media')}</h3>
                            <form onSubmit={submitSearch} className="flex-1 max-w-xs">
                                <input
                                    type="text"
                                    placeholder={t('common.search')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="input-theme w-full"
                                />
                            </form>
                            {can('files.delete') && (
                                <Link
                                    href={route('files.trashed')}
                                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-secondary-500 border border-surface-200 hover:bg-surface-100 whitespace-nowrap"
                                >
                                    {t('common.trash')}
                                </Link>
                            )}
                            {can('files.create') && (
                                <button
                                    type="button"
                                    onClick={() => inputRef.current?.click()}
                                    className="px-4 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm whitespace-nowrap"
                                >
                                    + {t('files.upload')}
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => selectCategory(undefined)}
                                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-colors ${
                                    !filters.category ? 'border-theme-primary bg-theme-primary/5' : 'border-surface-200 hover:bg-surface-50'
                                }`}
                            >
                                <div className="w-10 h-10 rounded-lg bg-theme-primary/10 text-theme-primary flex items-center justify-center flex-shrink-0">
                                    <UploadIcon className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-secondary-900">{t('files.all_categories')}</p>
                                    <p className="text-xs text-secondary-500">{t('files.files_count', { count: stats.totalCount })}</p>
                                </div>
                            </button>

                            {stats.byCategory.map((stat) => {
                                const meta = CATEGORY_META[stat.category];
                                return (
                                    <button
                                        key={stat.category}
                                        onClick={() => selectCategory(stat.category)}
                                        className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-colors ${
                                            filters.category === stat.category
                                                ? 'border-theme-primary bg-theme-primary/5'
                                                : 'border-surface-200 hover:bg-surface-50'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg ${meta.bg} ${meta.fg} flex items-center justify-center flex-shrink-0`}>
                                            <meta.icon className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-secondary-900">
                                                {t(`files.category.${stat.category}`)}
                                            </p>
                                            <p className="text-xs text-secondary-500">
                                                {t('files.files_count', { count: stat.count })} · {formatBytes(stat.size)}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Upload dropzone (only visible once user starts a drag or clicks upload) */}
                    {can('files.create') && (
                        <div
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={onDrop}
                            onClick={() => inputRef.current?.click()}
                            className={`card rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                                isDragging ? 'border-theme-primary bg-theme-primary/5' : 'border-surface-200 hover:bg-surface-50'
                            }`}
                        >
                            <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => uploadFiles(e.target.files)} />
                            <UploadIcon className="w-7 h-7 mx-auto mb-2 text-secondary-400" />
                            <p className="text-sm text-secondary-500">{t('files.upload_hint')}</p>

                            {data.files.length > 0 && (
                                <div className="mt-4 flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                    <p className="text-sm text-secondary-900 font-medium">{data.files.length}</p>
                                    <button
                                        type="button"
                                        onClick={doUpload}
                                        disabled={processing}
                                        className="px-5 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm"
                                    >
                                        {processing
                                            ? `${t('files.uploading')} ${progress?.percentage ?? 0}%`
                                            : `${t('files.upload')} (${data.files.length})`}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Files grid */}
                    <div className="card p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                            {files.data.map((file) => {
                                const meta = CATEGORY_META[file.category];
                                return (
                                    <div
                                        key={file.id}
                                        className="group relative rounded-xl border border-surface-200 p-3 hover:shadow-md transition-shadow"
                                    >
                                        <div className="aspect-square rounded-lg bg-surface-50 flex items-center justify-center overflow-hidden mb-2">
                                            {file.is_image ? (
                                                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <meta.icon className={`w-10 h-10 ${meta.fg}`} />
                                            )}
                                        </div>
                                        <p className="text-xs font-medium text-secondary-900 truncate" title={file.name}>
                                            {file.name}
                                        </p>
                                        <p className="text-[11px] text-secondary-500">{formatBytes(file.size)}</p>

                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a
                                                href={route('files.download', file.id)}
                                                className="w-7 h-7 rounded-lg bg-white shadow flex items-center justify-center text-secondary-500 hover:text-theme-primary"
                                                title={t('files.download')}
                                            >
                                                <DownloadIcon className="w-4 h-4" />
                                            </a>
                                            {can('files.delete') && (
                                                <button
                                                    onClick={() => destroy(file)}
                                                    className="w-7 h-7 rounded-lg bg-white shadow flex items-center justify-center text-red-500 hover:text-red-700"
                                                    title={t('common.delete')}
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {files.data.length === 0 && (
                                <p className="col-span-full py-8 text-center text-secondary-500 text-sm">{t('files.none_found')}</p>
                            )}
                        </div>

                        <Pagination paginator={files} />
                    </div>
                </div>

                {/* Storage Details */}
                <div className="lg:col-span-1">
                    <div className="card p-6 sticky top-20">
                        <h3 className="text-base font-bold text-secondary-900 mb-1">{t('files.storage_details')}</h3>
                        {stats.diskFreeBytes !== null && (
                            <p className="text-sm text-secondary-500 mb-4">
                                {t('files.free_space', { size: formatBytes(stats.diskFreeBytes) })}
                            </p>
                        )}

                        <DonutChart
                            segments={chartSegments}
                            centerLabel={t('files.total_used')}
                            centerValue={formatBytes(stats.totalSize)}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
