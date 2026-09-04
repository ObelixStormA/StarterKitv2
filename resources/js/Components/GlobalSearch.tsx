import { SearchIcon } from '@/Components/Icons';
import { useLocale } from '@/i18n/LocaleProvider';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type SearchResult = {
    type: 'user' | 'role' | 'setting' | 'file';
    label: string;
    description: string | null;
    url: string;
};

const TYPE_LABEL_KEY: Record<SearchResult['type'], string> = {
    user: 'nav.users',
    role: 'nav.roles',
    setting: 'nav.settings',
    file: 'nav.files',
};

export default function GlobalSearch() {
    const { t } = useLocale();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<number | null>(null);

    useEffect(() => {
        if (debounceRef.current) window.clearTimeout(debounceRef.current);

        if (query.trim().length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        debounceRef.current = window.setTimeout(() => {
            fetch(`${route('search')}?q=${encodeURIComponent(query)}`, {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            })
                .then((res) => res.json())
                .then((data) => setResults(data.results))
                .finally(() => setLoading(false));
        }, 300);

        return () => {
            if (debounceRef.current) window.clearTimeout(debounceRef.current);
        };
    }, [query]);

    const select = (result: SearchResult) => {
        setOpen(false);
        setQuery('');
        router.visit(result.url);
    };

    return (
        <div className="relative">
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                    type="text"
                    placeholder={t('nav.search_placeholder')}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setOpen(true)}
                    className="w-72 pl-10 pr-4 py-2 bg-surface-100 border-0 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20"
                />
            </div>

            {open && query.trim().length >= 2 && (
                <>
                    <div className="fixed inset-0 z-[1034]" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-surface-200 bg-white shadow-xl p-2 z-[1035]">
                        {loading && <p className="text-sm text-secondary-500 text-center py-4">…</p>}

                        {!loading &&
                            results.map((result, i) => (
                                <button
                                    key={`${result.type}-${i}`}
                                    onClick={() => select(result)}
                                    className="w-full text-left flex items-center justify-between gap-2 px-3 py-2 rounded-xl hover:bg-surface-50"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-secondary-900 truncate">{result.label}</p>
                                        {result.description && (
                                            <p className="text-xs text-secondary-500 truncate">{result.description}</p>
                                        )}
                                    </div>
                                    <span className="text-[10px] uppercase tracking-wide text-secondary-400 flex-shrink-0">
                                        {t(TYPE_LABEL_KEY[result.type] as never)}
                                    </span>
                                </button>
                            ))}

                        {!loading && results.length === 0 && (
                            <p className="text-sm text-secondary-500 text-center py-4">{t('common.not_found')}</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
