import Pagination from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLocale } from '@/i18n/LocaleProvider';
import { AuditLog, Paginated } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const ACTION_COLORS: Record<string, string> = {
    created: 'bg-green-100 text-green-700',
    updated: 'bg-amber-100 text-amber-700',
    deleted: 'bg-red-100 text-red-700',
    restored: 'bg-blue-100 text-blue-700',
};

export default function Index({
    logs,
    filters,
}: {
    logs: Paginated<AuditLog>;
    filters: { search?: string; action?: string };
}) {
    const { t } = useLocale();
    const [search, setSearch] = useState(filters.search ?? '');
    const [action, setAction] = useState(filters.action ?? '');

    const apply = (overrides: Partial<{ search: string; action: string }> = {}) => {
        router.get(
            route('audit.index'),
            { search, action, ...overrides },
            { preserveState: true },
        );
    };

    const shortType = (type: string) => type.split('\\').pop();

    return (
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('audit.title')}</h2>}>
            <Head title={t('audit.title')} />

            <div className="card p-6">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <input
                        type="text"
                        placeholder={t('common.search')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && apply()}
                        className="input-theme max-w-xs"
                    />
                    <select
                        value={action}
                        onChange={(e) => {
                            setAction(e.target.value);
                            apply({ action: e.target.value });
                        }}
                        className="input-theme max-w-[160px]"
                    >
                        <option value="">{t('audit.all_actions')}</option>
                        <option value="created">{t('audit.action.created')}</option>
                        <option value="updated">{t('audit.action.updated')}</option>
                        <option value="deleted">{t('audit.action.deleted')}</option>
                        <option value="restored">{t('audit.action.restored')}</option>
                    </select>
                    <button
                        onClick={() => apply()}
                        className="px-4 py-2.5 btn-theme-primary font-semibold rounded-xl text-sm"
                    >
                        {t('common.search')}
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-secondary-500 border-b border-surface-200">
                                <th className="py-3 pr-4 font-semibold">{t('audit.column.user')}</th>
                                <th className="py-3 pr-4 font-semibold">{t('audit.column.action')}</th>
                                <th className="py-3 pr-4 font-semibold">{t('audit.column.model')}</th>
                                <th className="py-3 pr-4 font-semibold">{t('audit.column.changes')}</th>
                                <th className="py-3 pr-4 font-semibold">{t('audit.column.date')}</th>
                                <th className="py-3 pr-4 font-semibold">IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.data.map((log) => (
                                <tr key={log.id} className="border-b border-surface-100 last:border-0 align-top">
                                    <td className="py-3 pr-4 text-secondary-900 font-medium whitespace-nowrap">
                                        {log.user?.name ?? t('audit.system')}
                                    </td>
                                    <td className="py-3 pr-4">
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${ACTION_COLORS[log.action]}`}>
                                            {t(`audit.action.${log.action}` as never)}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-4 text-secondary-500 whitespace-nowrap">
                                        {shortType(log.auditable_type)} #{log.auditable_id}
                                        {log.auditable_label && (
                                            <span className="text-secondary-900 font-medium"> — {log.auditable_label}</span>
                                        )}
                                    </td>
                                    <td className="py-3 pr-4 text-secondary-500 max-w-xs">
                                        {log.changes ? (
                                            <code className="text-xs break-all">
                                                {Object.keys(log.changes).join(', ')}
                                            </code>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                    <td className="py-3 pr-4 text-secondary-500 whitespace-nowrap">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="py-3 pr-4 text-secondary-400 text-xs whitespace-nowrap">
                                        {log.ip_address ?? '—'}
                                    </td>
                                </tr>
                            ))}

                            {logs.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-secondary-500">
                                        {t('audit.none_found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination paginator={logs} />
            </div>
        </AuthenticatedLayout>
    );
}
