import { Outlet } from 'react-router'
import { useState } from 'react'
import { Sidebar, navGroups } from './sidebar'
import { AppHeader } from './header'

const SIDEBAR_WIDTH = 260

/**
 * Full Layout Component
 * Admin layout with a fixed vertical sidebar
 */
export function FullLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface-50">
      <AppHeader
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <Sidebar
        navGroups={navGroups}
        width={SIDEBAR_WIDTH}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300 lg:ml-[260px]"
        style={{ paddingTop: 'calc(4rem + var(--pro-banner-height))' }}
      >
        <div className="layout-container p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
