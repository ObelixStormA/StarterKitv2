import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'
import { PRO_DEMO_BASE_URL } from '@/config/pro'

type HeaderProps = {
  isMobileSidebarOpen?: boolean
  onToggleMobileSidebar?: () => void
}

type MegaItem = {
  to: string
  title: string
  description: string
  icon: string
  badge?: string
  isPro?: boolean
}

type MegaMenu = {
  id: string
  label: string
  items: MegaItem[]
  footer?: {
    label: string
    to: string
  }
}

function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = ref.current
      if (!el) return
      if (e.target instanceof Node && el.contains(e.target)) return
      onOutside()
    }

    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [onOutside])

  return ref
}

function TopLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          isActive
            ? 'bg-theme-primary/10 text-theme-primary'
            : 'text-secondary-600 hover:bg-surface-100 hover:text-secondary-900',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

export function AppHeader({ onToggleMobileSidebar }: HeaderProps) {
  const location = useLocation()
  const { t } = useLocale()
  const [openMega, setOpenMega] = useState<string | null>(null)
  const [userOpen, setUserOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const megaCloseTimerRef = useRef<number | null>(null)

  const clearMegaCloseTimer = () => {
    if (megaCloseTimerRef.current) {
      window.clearTimeout(megaCloseTimerRef.current)
      megaCloseTimerRef.current = null
    }
  }

  const openMegaMenu = (id: string) => {
    clearMegaCloseTimer()
    setOpenMega(id)
  }

  const scheduleMegaClose = () => {
    clearMegaCloseTimer()
    megaCloseTimerRef.current = window.setTimeout(() => setOpenMega(null), 180)
  }

  const megaRef = useClickOutside<HTMLDivElement>(() => {
    clearMegaCloseTimer()
    setOpenMega(null)
  })
  const userRef = useClickOutside<HTMLDivElement>(() => setUserOpen(false))
  const notifRef = useClickOutside<HTMLDivElement>(() => setNotifOpen(false))

  const menus = useMemo<MegaMenu[]>(
    () => [
      {
        id: 'apps',
        label: t('header.menu.apps'),
        items: [
          { to: '/app/calendar', title: t('nav.calendar'), description: t('header.apps.calendar_desc'), icon: Icons.calendar },
          { to: '/app/contacts', title: t('nav.contacts'), description: t('header.apps.contacts_desc'), icon: Icons.contacts },
        ],
        footer: { label: t('header.footer.all_apps'), to: '/dashboard' },
      },
      {
        id: 'components',
        label: t('header.menu.components'),
        items: [
          { to: '/forms/layout', title: t('header.components.forms'), description: t('header.components.forms_desc'), icon: Icons.layoutGrid },
          { to: '/tables/data', title: t('header.components.tables'), description: t('header.components.tables_desc'), icon: Icons.table },
          { to: `${PRO_DEMO_BASE_URL}/charts/line`, title: t('header.components.charts'), description: t('header.components.charts_desc'), icon: Icons.chartLine, isPro: true },
          { to: '/pages/account-settings', title: t('header.components.settings_pages'), description: t('header.components.settings_pages_desc'), icon: Icons.settings },
        ],
        footer: { label: t('header.footer.explore_pages'), to: '/pages/typography' },
      },
    ],
    [t],
  )

  return (
    <header className="fixed top-[var(--pro-banner-height)] left-0 right-0 lg:left-[260px] h-16 bg-white/95 backdrop-blur border-b border-surface-200 z-[1020] transition-all duration-300">
      <div className="w-full px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 hover:bg-surface-100 rounded-lg transition-colors"
            aria-label={t('header.aria.toggle_mobile_menu')}
          >
            <Icon icon={Icons.menu} className="w-5 h-5 text-secondary-600" />
          </button>

          <div className="hidden xl:flex items-center gap-1" ref={megaRef}>
            <TopLink to="/dashboard" label={t('header.top.dashboard')} />
            <TopLink to="/pages/account-settings" label={t('header.top.pages')} />

            {menus.map((m) => (
              <div key={m.id} className="relative">
                <button
                  type="button"
                  className={
                    openMega === m.id
                      ? 'px-3 py-2 rounded-lg text-sm font-medium bg-surface-100 text-secondary-900 inline-flex items-center gap-1'
                      : 'px-3 py-2 rounded-lg text-sm font-medium text-secondary-600 hover:bg-surface-100 hover:text-secondary-900 inline-flex items-center gap-1'
                  }
                  aria-haspopup="menu"
                  aria-expanded={openMega === m.id}
                  onMouseEnter={() => openMegaMenu(m.id)}
                  onMouseLeave={scheduleMegaClose}
                  onClick={() => {
                    clearMegaCloseTimer()
                    setOpenMega((cur) => (cur === m.id ? null : m.id))
                  }}
                >
                  {m.label}
                  <Icon icon={Icons.chevronDown} className="w-4 h-4" />
                </button>

                {openMega === m.id && (
                  <div
                    className="absolute left-0 mt-2 w-[860px] rounded-3xl border border-surface-200/80 bg-white shadow-2xl p-5 z-[1035]"
                    onMouseEnter={() => openMegaMenu(m.id)}
                    onMouseLeave={scheduleMegaClose}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-secondary-500">{m.label}</p>
                        <p className="text-sm text-secondary-600 mt-1">{t('header.quick_access')}</p>
                      </div>
                      <button
                        type="button"
                        className="text-sm text-secondary-500 hover:text-secondary-900"
                        onClick={() => setOpenMega(null)}
                      >
                        {t('common.close')}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {m.items.map((it) => {
                        const itemContent = (
                          <>
                            <div className="w-11 h-11 rounded-2xl bg-theme-primary/10 text-theme-primary flex items-center justify-center flex-shrink-0">
                              <Icon icon={it.icon} className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-ui font-semibold text-secondary-900 truncate">{it.title}</p>
                                {it.isPro && (
                                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded bg-theme-primary/10 text-theme-primary">
                                    PRO
                                  </span>
                                )}
                                {it.badge && (
                                  <span className="px-2 py-0.5 text-ui-xs rounded-full bg-danger-100 text-danger-600">
                                    {it.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-secondary-600 mt-1 line-clamp-2">{it.description}</p>
                            </div>
                          </>
                        )
                        const itemClassName =
                          'group flex items-start gap-3 rounded-2xl p-4 hover:bg-surface-50 transition-colors border border-transparent hover:border-surface-200/70 ' +
                          (location.pathname.startsWith(it.to) ? 'bg-surface-50 border-surface-200/70' : '')

                        if (it.isPro) {
                          return (
                            <a
                              key={it.to}
                              href={it.to}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={itemClassName}
                              onClick={() => setOpenMega(null)}
                            >
                              {itemContent}
                            </a>
                          )
                        }

                        return (
                          <Link
                            key={it.to}
                            to={it.to}
                            className={itemClassName}
                            onClick={() => setOpenMega(null)}
                          >
                            {itemContent}
                          </Link>
                        )
                      })}
                    </div>

                    {m.footer && (
                      <div className="mt-4 pt-4 border-t border-surface-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-secondary-500">{t('header.shortcuts')}</span>
                          <Link
                            to="/forms/layout"
                            className="text-xs px-2.5 py-1 rounded-full bg-surface-100 text-secondary-700 hover:bg-surface-200"
                            onClick={() => setOpenMega(null)}
                          >
                            {t('header.components.forms')}
                          </Link>
                          <Link
                            to="/tables/data"
                            className="text-xs px-2.5 py-1 rounded-full bg-surface-100 text-secondary-700 hover:bg-surface-200"
                            onClick={() => setOpenMega(null)}
                          >
                            {t('header.components.tables')}
                          </Link>
                          <a
                            href={`${PRO_DEMO_BASE_URL}/charts/line`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-2.5 py-1 rounded-full bg-surface-100 text-secondary-700 hover:bg-surface-200 inline-flex items-center gap-1"
                            onClick={() => setOpenMega(null)}
                          >
                            {t('header.components.charts')}
                            <span className="text-[9px] font-bold uppercase tracking-wide text-theme-primary">PRO</span>
                          </a>
                        </div>

                        <Link
                          to={m.footer.to}
                          className="text-sm font-semibold text-theme-primary hover:underline"
                          onClick={() => setOpenMega(null)}
                        >
                          {m.footer.label}
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-2 hover:bg-surface-100 rounded-lg transition-colors"
            aria-label={t('common.search')}
          >
            <Icon icon={Icons.search} className="w-5 h-5 text-secondary-600" />
          </button>

          <div className="hidden lg:flex items-center">
            <div className="relative">
              <Icon icon={Icons.search} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                className="w-48 xl:w-72 pl-10 pr-4 py-2 bg-surface-100 border-0 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-2 hover:bg-surface-100 rounded-lg transition-colors"
            aria-label={t('common.search')}
          >
            <Icon icon={Icons.search} className="w-5 h-5 text-secondary-600" />
          </button>

          <div className="relative" ref={notifRef}>
            <button
              className="relative p-2 hover:bg-surface-100 rounded-lg transition-colors"
              onClick={() => setNotifOpen((v) => !v)}
              aria-label={t('header.notifications')}
              aria-expanded={notifOpen}
            >
              <Icon icon={Icons.bell} className="w-5 h-5 text-secondary-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-white"></span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-surface-200 bg-white shadow-xl p-3 z-[1035]">
                <div className="flex items-center justify-between px-2 py-1">
                  <p className="text-sm font-semibold text-secondary-900">{t('header.notifications')}</p>
                  <Link
                    to="/pages/account-settings"
                    className="text-xs text-theme-primary hover:underline"
                    onClick={() => setNotifOpen(false)}
                  >
                    {t('common.manage')}
                  </Link>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="rounded-xl p-3 bg-surface-50">
                    <p className="text-sm text-secondary-900">New message in Chat</p>
                    <p className="text-xs text-secondary-500 mt-0.5">2 minutes ago</p>
                  </div>
                  <div className="rounded-xl p-3 bg-surface-50">
                    <p className="text-sm text-secondary-900">Order #1024 paid</p>
                    <p className="text-xs text-secondary-500 mt-0.5">Today</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserOpen((v) => !v)}
              className="flex items-center gap-3 ps-2 border-s border-surface-200 ms-2"
              aria-label={t('header.user_menu')}
              aria-expanded={userOpen}
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-secondary-900">John Doe</p>
                <p className="text-xs text-secondary-500">Admin</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-theme-primary flex items-center justify-center text-white text-sm font-semibold">
                JD
              </div>
            </button>

            {userOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-surface-200 bg-white shadow-xl p-2 z-[1035]">
                <Link
                  to="/pages/account-settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-secondary-700 hover:bg-surface-50"
                  onClick={() => setUserOpen(false)}
                >
                  <Icon icon={Icons.user} className="w-5 h-5" />
                  {t('common.profile')}
                </Link>
                <Link
                  to="/pages/account-settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-secondary-700 hover:bg-surface-50"
                  onClick={() => setUserOpen(false)}
                >
                  <Icon icon={Icons.settings} className="w-5 h-5" />
                  {t('common.settings')}
                </Link>
                <Link
                  to="/pages/typography"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-secondary-700 hover:bg-surface-50"
                  onClick={() => setUserOpen(false)}
                >
                  <Icon icon={Icons.help} className="w-5 h-5" />
                  {t('nav.typography')}
                </Link>
                <div className="my-2 border-t border-surface-200" />
                <Link
                  to="/auth/login"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-danger-600 hover:bg-danger-50"
                  onClick={() => setUserOpen(false)}
                >
                  <Icon icon={Icons.logout} className="w-5 h-5" />
                  {t('common.logout')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {searchOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-surface-200 p-4 shadow-lg z-[1019]">
          <div className="relative">
            <Icon icon={Icons.search} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-surface-100 border-0 rounded-lg text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20"
            />
          </div>
        </div>
      )}
    </header>
  )
}
