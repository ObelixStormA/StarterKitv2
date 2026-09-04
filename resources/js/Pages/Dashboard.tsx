import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useLocale } from '@/i18n/LocaleProvider';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    const { t } = useLocale();

    return (
        <AuthenticatedLayout header={<h2 className="heading-2 text-secondary-900">{t('dashboard.title')}</h2>}>
            <Head title={t('dashboard.title')} />

            <div className="card p-6">{t('dashboard.welcome')}</div>
        </AuthenticatedLayout>
    );
}
