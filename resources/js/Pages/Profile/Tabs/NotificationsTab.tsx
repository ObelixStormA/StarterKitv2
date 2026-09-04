import { useLocale } from '@/i18n/LocaleProvider';
import { useState } from 'react';

export default function NotificationsTab() {
    const { t } = useLocale();

    const [enabled, setEnabled] = useState<Record<string, boolean>>({
        email: true,
        push: true,
        sms: false,
        marketing: false,
        mentions: true,
        updates: true,
    });

    const settings = [
        { id: 'email', label: t('account.email_notifications'), description: t('account.email_notifications_desc') },
        { id: 'push', label: t('account.push_notifications'), description: t('account.push_notifications_desc') },
        { id: 'sms', label: t('account.sms_notifications'), description: t('account.sms_notifications_desc') },
        { id: 'marketing', label: t('account.marketing_emails'), description: t('account.marketing_emails_desc') },
        { id: 'mentions', label: t('account.mentions_comments'), description: t('account.mentions_comments_desc') },
        { id: 'updates', label: t('account.product_updates'), description: t('account.product_updates_desc') },
    ];

    const toggle = (id: string) => setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-secondary-900 mb-1">{t('account.notification_preferences')}</h2>
                <p className="text-sm text-secondary-500">{t('account.notification_desc')}</p>
            </div>

            <div className="space-y-1">
                {settings.map((setting) => (
                    <div
                        key={setting.id}
                        className="flex items-start justify-between py-3 border-b border-surface-100 last:border-0"
                    >
                        <div className="flex-1 pr-4">
                            <p className="font-medium text-secondary-900 mb-0.5">{setting.label}</p>
                            <p className="text-sm text-secondary-500">{setting.description}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => toggle(setting.id)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                                enabled[setting.id] ? 'bg-theme-primary' : 'bg-surface-200'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                                    enabled[setting.id] ? 'translate-x-5' : 'translate-x-0.5'
                                }`}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
