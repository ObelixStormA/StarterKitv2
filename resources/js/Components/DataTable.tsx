import { ComponentType, PropsWithChildren, ReactNode, SVGProps } from 'react';

/**
 * docs/template ("Adminex") dagi CRUD jadval uslubi — barcha modullar
 * (Users, Roles, Files, Menus, generator orqali yaratilgan modullar va h.k.)
 * shu bir xil ko'rinishdan foydalanadi.
 */

export function TableCard({ children }: PropsWithChildren) {
    return (
        <div className="card rounded-xl overflow-hidden p-0">
            <div className="overflow-x-auto">
                <table className="w-full">{children}</table>
            </div>
        </div>
    );
}

export function TableHead({ children }: PropsWithChildren) {
    return (
        <thead>
            <tr className="bg-surface-50">{children}</tr>
        </thead>
    );
}

export function Th({ children, align = 'left' }: PropsWithChildren<{ align?: 'left' | 'right' }>) {
    return (
        <th
            className={`px-6 py-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider ${
                align === 'right' ? 'text-right' : 'text-left'
            }`}
        >
            {children}
        </th>
    );
}

export function TableBody({ children }: PropsWithChildren) {
    return <tbody className="divide-y divide-surface-200">{children}</tbody>;
}

export function Tr({ children }: PropsWithChildren) {
    return <tr className="hover:bg-surface-50 transition-colors">{children}</tr>;
}

export function Td({ children, align = 'left' }: PropsWithChildren<{ align?: 'left' | 'right' }>) {
    return <td className={`px-6 py-4 ${align === 'right' ? 'text-right' : ''}`}>{children}</td>;
}

export function TableActions({ children }: PropsWithChildren) {
    return <div className="flex items-center justify-end gap-1">{children}</div>;
}

const actionColors = {
    default: 'text-secondary-500 hover:text-theme-primary hover:bg-surface-100',
    danger: 'text-secondary-500 hover:text-red-600 hover:bg-red-50',
};

export function TableActionButton({
    icon: Icon,
    onClick,
    href,
    title,
    variant = 'default',
}: {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    onClick?: () => void;
    href?: string;
    title: string;
    variant?: 'default' | 'danger';
}) {
    const className = `p-2 rounded-lg transition-colors ${actionColors[variant]}`;

    if (href) {
        return (
            <a href={href} className={className} title={title}>
                <Icon className="w-4 h-4" />
            </a>
        );
    }

    return (
        <button type="button" onClick={onClick} className={className} title={title}>
            <Icon className="w-4 h-4" />
        </button>
    );
}

export function EmptyState({
    icon: Icon,
    title,
    description,
}: {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    title: string;
    description?: ReactNode;
}) {
    return (
        <div className="py-12 text-center">
            <Icon className="w-12 h-12 mx-auto text-secondary-300 mb-3" />
            <p className="text-secondary-500">{title}</p>
            {description && <p className="text-sm text-secondary-400 mt-1">{description}</p>}
        </div>
    );
}
