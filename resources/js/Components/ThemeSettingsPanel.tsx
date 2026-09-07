import { MoonIcon, SettingsIcon, SunIcon, XIcon } from '@/Components/Icons';
import { THEME_COLORS, useThemeSettings } from '@/Contexts/ThemeSettingsContext';
import { useLocale } from '@/i18n/LocaleProvider';
import { useState } from 'react';

const colorSwatchClass: Record<string, string> = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    cyan: 'bg-cyan-500',
};

function OptionButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                active
                    ? 'border-theme-primary text-theme-primary bg-theme-primary/5'
                    : 'border-surface-200 text-secondary-500 hover:bg-surface-50'
            }`}
        >
            {children}
        </button>
    );
}

export default function ThemeSettingsPanel() {
    const { t } = useLocale();
    const [open, setOpen] = useState(false);
    const {
        mode,
        direction,
        colorKey,
        sidebarStyle,
        container,
        cardStyle,
        setMode,
        setDirection,
        setColorKey,
        setSidebarStyle,
        setContainer,
        setCardStyle,
        reset,
    } = useThemeSettings();

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="fixed right-0 top-1/2 -translate-y-1/2 z-[1040] bg-white dark:bg-surface-100 border border-surface-200 border-e-0 text-theme-primary p-2.5 rounded-s-xl shadow-lg hover:bg-surface-50 transition-all"
                title={t('theme_settings.title')}
            >
                <SettingsIcon className="w-5 h-5" />
            </button>

            {open && (
                <div className="fixed inset-0 bg-black/50 z-[1049]" onClick={() => setOpen(false)} />
            )}

            <div
                className={`fixed top-0 bottom-0 right-0 w-full max-w-sm bg-white dark:bg-surface-100 z-[1050] shadow-2xl transition-transform duration-300 overflow-y-auto ${
                    open ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between p-5 border-b border-surface-200">
                    <h3 className="text-lg font-bold text-secondary-900">{t('theme_settings.title')}</h3>
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-surface-100 transition-colors"
                    >
                        <XIcon className="w-5 h-5 text-secondary-500" />
                    </button>
                </div>

                <div className="p-5 space-y-6">
                    <div>
                        <p className="text-sm font-semibold text-secondary-900 mb-3">
                            {t('theme_settings.mode')}
                        </p>
                        <div className="flex gap-3">
                            <OptionButton active={mode === 'light'} onClick={() => setMode('light')}>
                                <SunIcon className="w-4 h-4" />
                                {t('theme_settings.mode_light')}
                            </OptionButton>
                            <OptionButton active={mode === 'dark'} onClick={() => setMode('dark')}>
                                <MoonIcon className="w-4 h-4" />
                                {t('theme_settings.mode_dark')}
                            </OptionButton>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-secondary-900 mb-3">
                            {t('theme_settings.direction')}
                        </p>
                        <div className="flex gap-3">
                            <OptionButton active={direction === 'ltr'} onClick={() => setDirection('ltr')}>
                                {t('theme_settings.direction_ltr')}
                            </OptionButton>
                            <OptionButton active={direction === 'rtl'} onClick={() => setDirection('rtl')}>
                                {t('theme_settings.direction_rtl')}
                            </OptionButton>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-secondary-900 mb-3">
                            {t('theme_settings.colors')}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {THEME_COLORS.map((color) => (
                                <button
                                    key={color.key}
                                    type="button"
                                    onClick={() => setColorKey(color.key)}
                                    title={color.key}
                                    className={`w-9 h-9 rounded-full ${colorSwatchClass[color.key]} transition-transform ${
                                        colorKey === color.key
                                            ? 'ring-2 ring-offset-2 ring-secondary-900 scale-105'
                                            : 'hover:scale-105'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-secondary-900 mb-3">
                            {t('theme_settings.sidebar_style')}
                        </p>
                        <div className="flex gap-3">
                            <OptionButton active={sidebarStyle === 'full'} onClick={() => setSidebarStyle('full')}>
                                {t('theme_settings.sidebar_full')}
                            </OptionButton>
                            <OptionButton active={sidebarStyle === 'mini'} onClick={() => setSidebarStyle('mini')}>
                                {t('theme_settings.sidebar_mini')}
                            </OptionButton>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-secondary-900 mb-3">
                            {t('theme_settings.container')}
                        </p>
                        <div className="flex gap-3">
                            <OptionButton active={container === 'full'} onClick={() => setContainer('full')}>
                                {t('theme_settings.container_full')}
                            </OptionButton>
                            <OptionButton active={container === 'boxed'} onClick={() => setContainer('boxed')}>
                                {t('theme_settings.container_boxed')}
                            </OptionButton>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-secondary-900 mb-3">
                            {t('theme_settings.card_style')}
                        </p>
                        <div className="flex gap-3">
                            <OptionButton active={cardStyle === 'shadow'} onClick={() => setCardStyle('shadow')}>
                                {t('theme_settings.card_shadow')}
                            </OptionButton>
                            <OptionButton active={cardStyle === 'border'} onClick={() => setCardStyle('border')}>
                                {t('theme_settings.card_border')}
                            </OptionButton>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={reset}
                        className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                    >
                        {t('theme_settings.reset')}
                    </button>
                </div>
            </div>
        </>
    );
}
