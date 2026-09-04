import { Locale, useLocale } from '@/i18n/LocaleProvider';
import { useState } from 'react';

const LOCALES: { value: Locale; flag: string }[] = [
    { value: 'uz', flag: '🇺🇿' },
    { value: 'ru', flag: '🇷🇺' },
    { value: 'en', flag: '🇬🇧' },
];

export default function LanguageSwitcher() {
    const { locale, setLocale, t } = useLocale();
    const [open, setOpen] = useState(false);
    const current = LOCALES.find((l) => l.value === locale)!;

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium text-secondary-500 hover:bg-surface-100 transition-colors"
            >
                <span>{current.flag}</span>
                <span className="hidden sm:inline">{t(`language.${current.value}` as never)}</span>
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-[1034]" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 mt-2 w-40 rounded-xl border border-surface-200 bg-white shadow-xl p-1.5 z-[1035]">
                        {LOCALES.map((l) => (
                            <button
                                key={l.value}
                                type="button"
                                onClick={() => {
                                    setLocale(l.value);
                                    setOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left ${
                                    l.value === locale
                                        ? 'bg-theme-primary/10 text-theme-primary font-semibold'
                                        : 'text-secondary-500 hover:bg-surface-50'
                                }`}
                            >
                                <span>{l.flag}</span>
                                {t(`language.${l.value}` as never)}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
