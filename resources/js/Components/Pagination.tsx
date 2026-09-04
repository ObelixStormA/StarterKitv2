import { Paginated } from '@/types';
import { Link } from '@inertiajs/react';

export default function Pagination<T>({ paginator }: { paginator: Paginated<T> }) {
    if (paginator.last_page <= 1) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-1 mt-4">
            {paginator.links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url ?? '#'}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        link.active
                            ? 'bg-theme-primary text-white'
                            : link.url
                              ? 'text-secondary-500 hover:bg-surface-100'
                              : 'text-surface-300 cursor-not-allowed'
                    }`}
                    preserveScroll
                />
            ))}
        </div>
    );
}
