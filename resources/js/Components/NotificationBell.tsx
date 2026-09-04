import { BellIcon } from '@/Components/Icons';
import { useLocale } from '@/i18n/LocaleProvider';
import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type NotificationItem = {
    id: string;
    title: string;
    message: string;
    url: string | null;
    read_at: string | null;
    created_at: string;
};

export default function NotificationBell() {
    const { t } = useLocale();
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const timerRef = useRef<number | null>(null);

    const load = () => {
        fetch(route('notifications.index'), {
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
        })
            .then((res) => res.json())
            .then((data) => {
                setItems(data.notifications);
                setUnreadCount(data.unread_count);
            })
            .catch(() => {});
    };

    useEffect(() => {
        load();
        timerRef.current = window.setInterval(load, 30000);
        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current);
        };
    }, []);

    const openNotification = (item: NotificationItem) => {
        router.post(route('notifications.read', item.id), {}, {
            preserveScroll: true,
            onFinish: () => {
                load();
                if (item.url) router.visit(item.url);
            },
        });
        setOpen(false);
    };

    const markAllRead = () => {
        router.post(route('notifications.read-all'), {}, {
            preserveScroll: true,
            onFinish: load,
        });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="relative p-2 hover:bg-surface-100 rounded-lg transition-colors"
                aria-label={t('nav.notifications')}
            >
                <BellIcon className="w-5 h-5 text-secondary-500" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                )}
            </button>

            {open && <div className="fixed inset-0 z-[1034]" onClick={() => setOpen(false)} />}

            {open && (
                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-surface-200 bg-white shadow-xl p-3 z-[1035]">
                    <div className="flex items-center justify-between px-1 py-1 mb-2">
                        <p className="text-sm font-semibold text-secondary-900">{t('nav.notifications')}</p>
                        {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-theme-primary hover:underline">
                                {t('notifications.mark_all_read')}
                            </button>
                        )}
                    </div>

                    <div className="space-y-1 max-h-96 overflow-y-auto">
                        {items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => openNotification(item)}
                                className={`w-full text-left rounded-xl p-3 transition-colors ${
                                    item.read_at ? 'hover:bg-surface-50' : 'bg-theme-primary/5 hover:bg-theme-primary/10'
                                }`}
                            >
                                <p className="text-sm font-medium text-secondary-900">{item.title}</p>
                                <p className="text-xs text-secondary-500 mt-0.5">{item.message}</p>
                            </button>
                        ))}

                        {items.length === 0 && (
                            <p className="text-sm text-secondary-500 text-center py-6">{t('notifications.none')}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
