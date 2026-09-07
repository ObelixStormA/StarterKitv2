import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLocale } from '@/i18n/LocaleProvider';
import { ICON_MAP } from '@/lib/iconMap';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Index() {
    const { t } = useLocale();
    const [copied, setCopied] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const names = Object.keys(ICON_MAP).filter((name) =>
        name.toLowerCase().includes(search.toLowerCase()),
    );

    const copy = (name: string) => {
        navigator.clipboard?.writeText(name).catch(() => {});
        setCopied(name);
        setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200);
    };

    return (
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('icons.title')}</h2>}>
            <Head title={t('icons.title')} />

            <div className="max-w-5xl mx-auto space-y-4">
                <p className="text-secondary-500 text-sm">{t('icons.subtitle')}</p>

                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('icons.search_placeholder')}
                    className="input-theme w-full max-w-sm"
                />

                <div className="card p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {names.map((name) => {
                            const Icon = ICON_MAP[name];
                            return (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => copy(name)}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-surface-200 hover:border-theme-primary hover:bg-theme-primary/5 transition-colors"
                                    title={t('icons.click_to_copy')}
                                >
                                    <Icon className="w-6 h-6 text-secondary-700" />
                                    <span className="text-xs text-secondary-500 font-mono text-center break-all">
                                        {copied === name ? t('icons.copied') : name}
                                    </span>
                                </button>
                            );
                        })}

                        {names.length === 0 && (
                            <p className="col-span-full text-center text-sm text-secondary-400 py-8">
                                {t('common.not_found')}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
