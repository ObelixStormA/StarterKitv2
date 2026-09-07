import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';
export type ThemeDirection = 'ltr' | 'rtl';
export type SidebarStyle = 'full' | 'mini';
export type ContainerStyle = 'full' | 'boxed';
export type CardStyle = 'shadow' | 'border';

export interface ThemeColor {
    key: string;
    primary: string;
    accent: string;
}

export const THEME_COLORS: ThemeColor[] = [
    { key: 'blue', primary: '59 130 246', accent: '99 102 241' },
    { key: 'purple', primary: '168 85 247', accent: '192 132 252' },
    { key: 'green', primary: '34 197 94', accent: '74 222 128' },
    { key: 'orange', primary: '249 115 22', accent: '251 146 60' },
    { key: 'red', primary: '239 68 68', accent: '248 113 113' },
    { key: 'cyan', primary: '6 182 212', accent: '34 211 238' },
];

interface ThemeSettings {
    mode: ThemeMode;
    direction: ThemeDirection;
    colorKey: string;
    sidebarStyle: SidebarStyle;
    container: ContainerStyle;
    cardStyle: CardStyle;
}

const DEFAULT_SETTINGS: ThemeSettings = {
    mode: 'light',
    direction: 'ltr',
    colorKey: 'blue',
    sidebarStyle: 'full',
    container: 'full',
    cardStyle: 'shadow',
};

const STORAGE_KEY = 'theme-settings';

interface ThemeSettingsContextValue extends ThemeSettings {
    setMode: (mode: ThemeMode) => void;
    setDirection: (direction: ThemeDirection) => void;
    setColorKey: (colorKey: string) => void;
    setSidebarStyle: (style: SidebarStyle) => void;
    setContainer: (container: ContainerStyle) => void;
    setCardStyle: (style: CardStyle) => void;
    reset: () => void;
}

const ThemeSettingsContext = createContext<ThemeSettingsContextValue | null>(null);

function loadSettings(): ThemeSettings {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_SETTINGS;

        return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

/**
 * `resources/views/app.blade.php`dagi inline skript sahifa render
 * bo'lishidan oldin xuddi shu mantiq bilan DOM'ga class/atribut qo'yadi
 * (FOUC oldini olish uchun) — bu yerda esa React holatini o'sha holat
 * bilan sinxronlab, keyingi o'zgarishlarni real vaqtda qo'llaydi.
 */
function applyToDocument(settings: ThemeSettings): void {
    const root = document.documentElement;
    const color = THEME_COLORS.find((c) => c.key === settings.colorKey) ?? THEME_COLORS[0];

    root.classList.toggle('dark', settings.mode === 'dark');
    root.setAttribute('dir', settings.direction);
    root.setAttribute('data-sidebar-style', settings.sidebarStyle);
    root.setAttribute('data-container', settings.container);
    root.setAttribute('data-card-style', settings.cardStyle);
    root.style.setProperty('--theme-primary', color.primary);
    root.style.setProperty('--theme-accent', color.accent);
}

export function ThemeSettingsProvider({ children }: PropsWithChildren) {
    const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        const loaded = loadSettings();
        setSettings(loaded);
        applyToDocument(loaded);
    }, []);

    const update = useCallback((patch: Partial<ThemeSettings>) => {
        setSettings((prev) => {
            const next = { ...prev, ...patch };
            applyToDocument(next);
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {
                // localStorage yo'q bo'lsa ham UI ishlashda davom etadi
            }
            return next;
        });
    }, []);

    const value: ThemeSettingsContextValue = {
        ...settings,
        setMode: (mode) => update({ mode }),
        setDirection: (direction) => update({ direction }),
        setColorKey: (colorKey) => update({ colorKey }),
        setSidebarStyle: (sidebarStyle) => update({ sidebarStyle }),
        setContainer: (container) => update({ container }),
        setCardStyle: (cardStyle) => update({ cardStyle }),
        reset: () => update(DEFAULT_SETTINGS),
    };

    return <ThemeSettingsContext.Provider value={value}>{children}</ThemeSettingsContext.Provider>;
}

export function useThemeSettings(): ThemeSettingsContextValue {
    const ctx = useContext(ThemeSettingsContext);
    if (!ctx) {
        throw new Error('useThemeSettings must be used within ThemeSettingsProvider');
    }

    return ctx;
}
