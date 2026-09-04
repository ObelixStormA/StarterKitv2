import Logo from '@/Components/Logo';
import { useLocale } from '@/i18n/LocaleProvider';
import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const MESSAGES: Record<number, { title: string; uz: string; ru: string; en: string }> = {
    403: { title: '403', uz: "Ruxsat yo'q", ru: 'Доступ запрещён', en: 'Forbidden' },
    404: { title: '404', uz: 'Sahifa topilmadi', ru: 'Страница не найдена', en: 'Page not found' },
    419: { title: '419', uz: 'Sahifa muddati tugadi', ru: 'Страница устарела', en: 'Page expired' },
    429: { title: '429', uz: "Juda ko'p so'rov", ru: 'Слишком много запросов', en: 'Too many requests' },
    500: { title: '500', uz: 'Server xatosi', ru: 'Ошибка сервера', en: 'Server error' },
    503: { title: '503', uz: 'Xizmat vaqtincha ishlamayapti', ru: 'Сервис недоступен', en: 'Service unavailable' },
};

export default function Error({ status }: { status: number }) {
    const { locale } = useLocale();
    const { site } = usePage<PageProps>().props;
    const info = MESSAGES[status] ?? MESSAGES[500];
    const message = info[locale];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-surface-100 relative overflow-hidden">
            <Head title={info.title} />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full opacity-20 blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgb(var(--theme-primary)) 0%, transparent 70%)' }}
                />
            </div>

            <div className="relative w-full max-w-md text-center">
                <div className="mb-6 flex justify-center">
                    <Logo site={site} />
                </div>

                <p className="text-7xl font-bold text-theme-primary mb-4">{info.title}</p>
                <p className="text-lg font-semibold text-secondary-900 mb-2">{message}</p>

                <Link
                    href="/"
                    className="inline-block mt-6 px-6 py-3 btn-theme-primary font-semibold rounded-xl text-sm"
                >
                    {locale === 'uz' ? 'Bosh sahifaga qaytish' : locale === 'ru' ? 'На главную' : 'Back to home'}
                </Link>
            </div>
        </div>
    );
}
