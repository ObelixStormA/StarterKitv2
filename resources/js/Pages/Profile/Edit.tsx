import { BellIcon, CreditCardIcon, DevicesIcon, ShieldIcon, UserIcon } from '@/Components/Icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLocale } from '@/i18n/LocaleProvider';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { ComponentType, SVGProps, useState } from 'react';
import AccountTab from './Tabs/AccountTab';
import BillingTab from './Tabs/BillingTab';
import DevicesTab from './Tabs/DevicesTab';
import NotificationsTab from './Tabs/NotificationsTab';
import SecurityTab from './Tabs/SecurityTab';

type Tab = 'account' | 'notifications' | 'billing' | 'security' | 'devices';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const { t } = useLocale();
    const [activeTab, setActiveTab] = useState<Tab>('account');

    const tabs: { id: Tab; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
        { id: 'account', label: t('account.tab.account'), icon: UserIcon },
        { id: 'notifications', label: t('account.tab.notifications'), icon: BellIcon },
        { id: 'billing', label: t('account.tab.billing'), icon: CreditCardIcon },
        { id: 'security', label: t('account.tab.security'), icon: ShieldIcon },
        { id: 'devices', label: t('account.tab.devices'), icon: DevicesIcon },
    ];

    return (
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('account.title')}</h2>}>
            <Head title={t('account.title')} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <div className="card rounded-xl p-2 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-theme-primary text-white'
                                        : 'text-secondary-700 hover:bg-surface-100'
                                }`}
                            >
                                <tab.icon className="w-5 h-5 flex-shrink-0" />
                                <span className="font-medium text-sm">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="card rounded-xl p-6">
                        {activeTab === 'account' && (
                            <AccountTab mustVerifyEmail={mustVerifyEmail} status={status} />
                        )}
                        {activeTab === 'notifications' && <NotificationsTab />}
                        {activeTab === 'billing' && <BillingTab />}
                        {activeTab === 'security' && <SecurityTab />}
                        {activeTab === 'devices' && <DevicesTab />}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
