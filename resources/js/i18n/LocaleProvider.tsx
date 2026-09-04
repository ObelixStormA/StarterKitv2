import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from './locales/en';
import ru from './locales/ru';
import uz from './locales/uz';

export type Locale = 'uz' | 'ru' | 'en';
export type MessageKey = keyof typeof uz;
type TranslateVars = Record<string, string | number>;

const dictionaries: Record<Locale, Record<string, string>> = { uz, ru, en };
const STORAGE_KEY = 'app_locale';

type LocaleContextValue = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: MessageKey, vars?: TranslateVars) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getInitialLocale(): Locale {
    if (typeof window === 'undefined') return 'uz';

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === 'uz' || stored === 'ru' || stored === 'en') {
            return stored;
        }
    } catch {
        // localStorage unavailable — fall back to default
    }

    return 'uz';
}

function syncLocaleCookie(locale: Locale) {
    try {
        document.cookie = `${STORAGE_KEY}=${locale};path=/;max-age=31536000;samesite=lax`;
    } catch {
        // ignore (SSR or cookies disabled)
    }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

    // Keep the backend's validation-message locale in sync with the client on first load too.
    useEffect(() => syncLocaleCookie(locale), []); // eslint-disable-line react-hooks/exhaustive-deps

    const setLocale = useCallback((next: Locale) => {
        setLocaleState(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // ignore write failures (private mode etc.)
        }
        syncLocaleCookie(next);
        document.documentElement.lang = next;
    }, []);

    const t = useCallback(
        (key: MessageKey, vars?: TranslateVars) => {
            const template = dictionaries[locale][key] ?? dictionaries.uz[key] ?? key;
            if (!vars) return template;
            return template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, rawName) => {
                const value = vars[String(rawName).trim()];
                return value === undefined ? match : String(value);
            });
        },
        [locale],
    );

    const value = useMemo<LocaleContextValue>(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
    const ctx = useContext(LocaleContext);
    if (!ctx) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return ctx;
}
