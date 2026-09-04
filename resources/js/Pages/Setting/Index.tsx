import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePermission } from '@/hooks/usePermission';
import { useLocale } from '@/i18n/LocaleProvider';
import { Setting } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AddSettingForm from './AddSettingForm';
import BrandingCard from './BrandingCard';
import SettingRow from './SettingRow';

type Tab = 'admin' | 'site';

export default function Index({
    adminSettings,
    siteSettings,
}: {
    adminSettings: Setting[];
    siteSettings: Setting[];
}) {
    const { can } = usePermission();
    const { t } = useLocale();
    const [tab, setTab] = useState<Tab>('admin');

    const tabs: { key: Tab; label: string; settings: Setting[] }[] = [
        { key: 'site', label: t('settings.tab_site'), settings: siteSettings },
        { key: 'admin', label: t('settings.tab_admin'), settings: adminSettings },
    ];

    const active = tabs.find((tabItem) => tabItem.key === tab)!;

    return (
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('settings.title')}</h2>}>
            <Head title={t('settings.title')} />

            {tab === 'admin' && <BrandingCard settings={adminSettings} />}

            <div className="card p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-surface-200">
                    {tabs.map((tabItem) => (
                        <button
                            key={tabItem.key}
                            onClick={() => setTab(tabItem.key)}
                            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                                tab === tabItem.key
                                    ? 'border-theme-primary text-theme-primary'
                                    : 'border-transparent text-secondary-500 hover:text-secondary-900'
                            }`}
                        >
                            {tabItem.label}
                            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-surface-100">
                                {tabItem.settings.length}
                            </span>
                        </button>
                    ))}
                </div>

                {active.settings.length > 0 && (
                    <div className="grid grid-cols-12 gap-3 px-0 pb-2 text-xs font-semibold uppercase tracking-wider text-secondary-500">
                        <div className="col-span-3">{t('settings.key')}</div>
                        <div className="col-span-3">{t('settings.label')}</div>
                        <div className="col-span-4">{t('settings.value')}</div>
                        <div className="col-span-2">{t('common.actions')}</div>
                    </div>
                )}

                <div className="mb-4">
                    {active.settings.map((setting) => (
                        <SettingRow key={setting.id} setting={setting} />
                    ))}

                    {active.settings.length === 0 && (
                        <p className="py-8 text-center text-secondary-500 text-sm">
                            {t('settings.no_items')}
                        </p>
                    )}
                </div>

                {can('settings.create') && <AddSettingForm key={tab} group={tab} />}
            </div>
        </AuthenticatedLayout>
    );
}
