import { useLocale } from '@/i18n/LocaleProvider';

export default function BillingTab() {
    const { t } = useLocale();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-secondary-900 mb-1">{t('account.billing_subscription')}</h2>
                <p className="text-sm text-secondary-500">{t('account.billing_desc')}</p>
            </div>

            <div className="p-6 bg-theme-primary/5 border border-theme-primary/20 rounded-xl">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-base font-bold text-secondary-900 mb-1">{t('account.free_plan')}</h3>
                        <p className="text-sm text-secondary-500">{t('account.free_plan_desc')}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-secondary-900">$0</div>
                        <div className="text-sm text-secondary-500">{t('account.per_month')}</div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-secondary-900 mb-3">{t('account.payment_method')}</h3>
                <div className="p-4 border border-surface-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-7 rounded bg-surface-100 flex items-center justify-center text-secondary-400 text-xs font-bold">
                            VISA
                        </div>
                        <div>
                            <div className="font-medium text-secondary-900">•••• •••• •••• 4242</div>
                            <div className="text-sm text-secondary-500">{t('account.expires')}</div>
                        </div>
                    </div>
                    <button className="text-sm text-theme-primary hover:underline font-medium">{t('account.edit')}</button>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-secondary-900 mb-3">{t('account.billing_history')}</h3>
                <div className="border border-surface-200 rounded-xl overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-surface-50">
                            <tr className="text-left text-xs font-semibold text-secondary-500">
                                <th className="px-4 py-3">{t('account.date')}</th>
                                <th className="px-4 py-3">{t('account.description_col')}</th>
                                <th className="px-4 py-3 text-right">{t('account.amount')}</th>
                                <th className="px-4 py-3 text-right">{t('account.status_col')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            <tr>
                                <td className="px-4 py-3 text-secondary-900">01.09.2026</td>
                                <td className="px-4 py-3 text-secondary-500">{t('account.free_plan')}</td>
                                <td className="px-4 py-3 text-right text-secondary-900">$0.00</td>
                                <td className="px-4 py-3 text-right">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                        {t('account.active')}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-secondary-900">01.08.2026</td>
                                <td className="px-4 py-3 text-secondary-500">{t('account.free_plan')}</td>
                                <td className="px-4 py-3 text-right text-secondary-900">$0.00</td>
                                <td className="px-4 py-3 text-right">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                        {t('account.paid')}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="text-xs text-secondary-400 text-center">{t('account.demo_note')}</p>
        </div>
    );
}
