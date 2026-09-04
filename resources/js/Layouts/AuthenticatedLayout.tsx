import {
    AuditIcon,
    DashboardIcon,
    FolderIcon,
    LogoutIcon,
    MenuIcon,
    SettingsIcon,
    ShieldIcon,
    UserIcon,
    UsersIcon,
} from '@/Components/Icons';
import GlobalSearch from '@/Components/GlobalSearch';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import Logo from '@/Components/Logo';
import NotificationBell from '@/Components/NotificationBell';
import { useFlashToasts } from '@/hooks/useFlashToasts';
import { usePermission } from '@/hooks/usePermission';
import { useLocale } from '@/i18n/LocaleProvider';
import { Link, usePage } from '@inertiajs/react';
import { ComponentType, PropsWithChildren, ReactNode, SVGProps, useState } from 'react';

type NavItem = {
    label: string;
    href: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    active: boolean;
};

type NavGroup = {
    title: string;
    items: NavItem[];
};

export default function AuthenticatedLayout({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, site } = usePage().props as unknown as {
        auth: { user: { name: string; email: string; avatar_url?: string | null }; roles: string[] };
        site: { name: string; logo: string; favicon: string };
    };
    const user = auth.user;
    const { can, canAny } = usePermission();
    const { t } = useLocale();
    useFlashToasts();

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navGroups: NavGroup[] = [
        {
            title: t('nav.dashboard'),
            items: [
                {
                    label: t('nav.dashboard'),
                    href: route('dashboard'),
                    icon: DashboardIcon,
                    active: route().current('dashboard'),
                },
            ],
        },
        {
            title: t('nav.administrator'),
            items: [
                ...(canAny(['users.view', 'users.ownview'])
                    ? [{
                          label: t('nav.users'),
                          href: route('users.index'),
                          icon: UsersIcon,
                          active: route().current('users.*'),
                      }]
                    : []),
                ...(can('roles.view')
                    ? [{
                          label: t('nav.roles'),
                          href: route('roles.index'),
                          icon: ShieldIcon,
                          active: route().current('roles.*'),
                      }]
                    : []),
                ...(canAny(['files.view', 'files.ownview'])
                    ? [{
                          label: t('nav.files'),
                          href: route('files.index'),
                          icon: FolderIcon,
                          active: route().current('files.*'),
                      }]
                    : []),
                ...(canAny(['settings.view', 'settings.ownview'])
                    ? [{
                          label: t('nav.settings'),
                          href: route('settings.index'),
                          icon: SettingsIcon,
                          active: route().current('settings.*'),
                      }]
                    : []),
                ...(can('audit.view')
                    ? [{
                          label: t('nav.audit'),
                          href: route('audit.index'),
                          icon: AuditIcon,
                          active: route().current('audit.*'),
                      }]
                    : []),
            ],
        },
        {
            title: t('nav.account'),
            items: [
                {
                    label: t('nav.profile'),
                    href: route('profile.edit'),
                    icon: UserIcon,
                    active: route().current('profile.edit'),
                },
            ],
        },
    ].filter((group) => group.items.length > 0);

    const initials = user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="min-h-screen bg-surface-50">
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[1025] lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 bottom-0 left-0 w-[260px] bg-white border-e border-surface-200 flex flex-col z-[1030] transition-transform duration-300 ${
                    isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="h-16 flex items-center justify-center border-b border-surface-200 px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo site={site} />
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
                    {navGroups.map((group) => (
                        <div key={group.title} className="px-3 mb-4">
                            <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-secondary-500">
                                {group.title}
                            </p>
                            <div className="space-y-1">
                                {group.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileSidebarOpen(false)}
                                        className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                            item.active
                                                ? 'bg-theme-primary text-white'
                                                : 'text-secondary-500 hover:bg-surface-100'
                                        }`}
                                    >
                                        <item.icon className="w-5 h-5 flex-shrink-0" />
                                        <span className="flex-1">{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="p-3 border-t border-surface-200">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 rounded-xl text-sm font-medium text-secondary-500 hover:bg-surface-100 transition-colors px-4 py-2.5"
                    >
                        <LogoutIcon className="w-5 h-5 flex-shrink-0" />
                        <span>{t('nav.logout')}</span>
                    </Link>
                </div>
            </aside>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 lg:left-[260px] h-16 bg-white/95 backdrop-blur border-b border-surface-200 z-[1020] transition-all duration-300">
                <div className="w-full px-4 h-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                            className="lg:hidden p-2 hover:bg-surface-100 rounded-lg transition-colors"
                            aria-label={t('nav.menu')}
                        >
                            <MenuIcon className="w-5 h-5 text-secondary-500" />
                        </button>

                        <div className="hidden lg:flex items-center">
                            <GlobalSearch />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <NotificationBell />
                        <LanguageSwitcher />

                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen((v) => !v)}
                                className="flex items-center gap-3 ps-2 border-s border-surface-200 ms-2"
                            >
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-medium text-secondary-900">{user.name}</p>
                                    <p className="text-xs text-secondary-500">{user.email}</p>
                                </div>
                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt={user.name}
                                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-theme-primary flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                        {initials}
                                    </div>
                                )}
                            </button>

                            {userMenuOpen && (
                                <div
                                    className="fixed inset-0 z-[1034]"
                                    onClick={() => setUserMenuOpen(false)}
                                />
                            )}

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-surface-200 bg-white shadow-xl p-2 z-[1035]">
                                    <Link
                                        href={route('profile.edit')}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-secondary-500 hover:bg-surface-50"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <SettingsIcon className="w-5 h-5" />
                                        {t('nav.profile_settings')}
                                    </Link>
                                    <div className="my-2 border-t border-surface-200" />
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <LogoutIcon className="w-5 h-5" />
                                        {t('nav.logout')}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-16 lg:pl-[260px] transition-all duration-300">
                {header && (
                    <div className="bg-white border-b border-surface-200">
                        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">{header}</div>
                    </div>
                )}
                <div className="p-4 md:p-6">{children}</div>
            </main>
        </div>
    );
}
