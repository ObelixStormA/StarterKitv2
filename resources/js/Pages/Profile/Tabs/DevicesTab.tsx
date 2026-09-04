import { useLocale } from '@/i18n/LocaleProvider';

export default function DevicesTab() {
    const { t } = useLocale();

    const devices = [
        { name: 'Windows PC', type: 'Desktop', lastActive: t('account.last_active_now'), current: true },
        { name: 'iPhone', type: 'Mobile', lastActive: '2 soat oldin', current: false },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-secondary-900 mb-1">{t('account.connected_devices')}</h2>
                <p className="text-sm text-secondary-500">{t('account.devices_desc')}</p>
            </div>

            <div className="space-y-3">
                {devices.map((device) => (
                    <div
                        key={device.name}
                        className="p-4 border border-surface-200 rounded-xl flex items-center justify-between"
                    >
                        <div>
                            <div className="font-medium text-secondary-900 flex items-center gap-2">
                                {device.name}
                                {device.current && (
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                        {t('account.current')}
                                    </span>
                                )}
                            </div>
                            <div className="text-sm text-secondary-500 mt-1">
                                {device.type} • {device.lastActive}
                            </div>
                        </div>
                        {!device.current && (
                            <button className="text-sm text-red-600 hover:underline font-medium">
                                {t('account.remove')}
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <p className="text-xs text-secondary-400 text-center">{t('account.demo_note')}</p>
        </div>
    );
}
