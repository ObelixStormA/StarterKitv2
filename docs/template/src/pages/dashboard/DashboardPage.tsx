import { Icon, Icons } from '@/components/common'
import { AreaChart } from '@/components/charts'
import { chartColors } from '@/components/charts/chartConfig'
import { useLocale } from '@/i18n'

/**
 * Dashboard Page Component
 * Main dashboard with stats and widgets
 */
export function DashboardPage() {
  const { t } = useLocale()
  // Revenue chart data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [18500, 22400, 19800, 28200, 32100, 28800, 35200, 38400, 42100, 39500, 45200, 48295],
        fill: true,
        borderColor: chartColors.blue.solid,
        backgroundColor: chartColors.blue.light,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: chartColors.blue.solid,
      },
    ],
  }
  const stats = [
    { 
      labelKey: 'dashboard.visitors', 
      value: '12,845', 
      change: '+12%', 
      isPositive: true,
      icon: Icons.users, 
      bgColor: 'bg-primary-50', 
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600' 
    },
    { 
      labelKey: 'dashboard.revenue', 
      value: '$48,295', 
      change: '+8%', 
      isPositive: true,
      icon: Icons.currencyDollar, 
      bgColor: 'bg-success-50', 
      iconBg: 'bg-success-100',
      iconColor: 'text-success-600' 
    },
    { 
      labelKey: 'dashboard.orders', 
      value: '1,234', 
      change: '-3%', 
      isPositive: false,
      icon: Icons.package, 
      bgColor: 'bg-warning-50', 
      iconBg: 'bg-warning-100',
      iconColor: 'text-warning-600' 
    },
    { 
      labelKey: 'dashboard.growth', 
      value: '18.2%', 
      change: '+4%', 
      isPositive: true,
      icon: Icons.trendingUp, 
      bgColor: 'bg-info-50', 
      iconBg: 'bg-info-100',
      iconColor: 'text-info-600' 
    },
  ]

  const activities = [
    { action: 'New user registered', time: '2 min ago', user: 'Sarah Connor', icon: Icons.user, iconBg: 'bg-primary-100', iconColor: 'text-primary-600' },
    { action: 'Order #1234 completed', time: '15 min ago', user: 'John Smith', icon: Icons.circleCheck, iconBg: 'bg-success-100', iconColor: 'text-success-600' },
    { action: 'Payment received', time: '1 hour ago', user: 'Mike Johnson', icon: Icons.creditCard, iconBg: 'bg-accent-100', iconColor: 'text-accent-600' },
    { action: 'New review posted', time: '2 hours ago', user: 'Emily Davis', icon: Icons.star, iconBg: 'bg-warning-100', iconColor: 'text-warning-600' },
  ]

  const topProducts = [
    { name: 'Widget Kit', sales: 2453, revenue: '$12,450', progress: 85 },
    { name: 'Starter Bundle', sales: 1832, revenue: '$8,200', progress: 65 },
    { name: 'Growth Pack', sales: 945, revenue: '$6,500', progress: 45 },
    { name: 'Essentials', sales: 632, revenue: '$3,150', progress: 30 },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-2 text-secondary-900">{t('header.top.dashboard')}</h1>
          <p className="text-body-sm text-secondary-500 mt-1">{t('dashboard.welcome_back')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-surface-200 rounded-lg text-sm font-medium text-secondary-700 hover:bg-surface-50 transition-colors">
            <Icon icon={Icons.calendar} width={16} height={16} />
            {t('dashboard.last_30_days')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            {t('dashboard.download_report')}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.labelKey} className="card rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                <Icon icon={stat.icon} width={20} height={20} className={stat.iconColor} />
              </div>
              <button className="p-1 hover:bg-surface-100 rounded-lg transition-colors">
                <Icon icon={Icons.dotsVertical} width={16} height={16} className="text-secondary-400" />
              </button>
            </div>
            <p className="text-sm text-secondary-500 font-medium">
              {t(stat.labelKey)}
            </p>
            <div className="flex items-end justify-between mt-1">
              <p className="heading-3 text-secondary-900">
                {stat.value}
              </p>
              <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
                stat.isPositive 
                  ? 'bg-success-100 text-success-700' 
                  : 'bg-danger-100 text-danger-700'
              }`}>
                {stat.isPositive ? (
                  <Icon icon={Icons.arrowUpRight} width={12} height={12} />
                ) : (
                  <Icon icon={Icons.arrowDownRight} width={12} height={12} />
                )}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <div className="xl:col-span-2 card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                {t('dashboard.revenue_overview')}
              </h3>
              <p className="text-sm text-secondary-500 mt-0.5">{t('dashboard.monthly_revenue_statistics')}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs font-medium bg-theme-primary text-white rounded-lg">
                {t('dashboard.monthly')}
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-secondary-600 hover:bg-surface-100 rounded-lg transition-colors">
                {t('dashboard.weekly')}
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-secondary-600 hover:bg-surface-100 rounded-lg transition-colors">
                {t('dashboard.daily')}
              </button>
            </div>
          </div>
          <div className="h-72">
            <AreaChart data={revenueData} height={288} />
          </div>
        </div>

        {/* Top Products */}
        <div className="card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">
              {t('dashboard.top_products')}
            </h3>
            <button className="text-sm text-theme-primary font-medium hover:underline">
              {t('dashboard.view_all')}
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-secondary-900">{product.name}</span>
                  <span className="text-sm text-secondary-500">{product.revenue}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-theme-primary rounded-full transition-all duration-500"
                      style={{ width: `${product.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-secondary-400 w-8">{product.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity - Updated */}
        <div className="card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">
              {t('dashboard.recent_activity')}
            </h3>
            <button className="text-sm text-theme-primary font-medium hover:underline">
              {t('dashboard.view_all')}
            </button>
          </div>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors">
                <div className={`w-10 h-10 rounded-xl ${activity.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <Icon icon={activity.icon} width={20} height={20} className={activity.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900">
                    {activity.action}
                  </p>
                  <p className="text-xs text-secondary-500 mt-0.5">
                    by {activity.user}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-secondary-400">
                  <Icon icon={Icons.clock} width={12} height={12} />
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">
              {t('dashboard.performance')}
            </h3>
            <span className="text-xs text-secondary-400">{t('dashboard.last_7_days')}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-50">
              <p className="heading-3 text-secondary-900">89%</p>
              <p className="text-sm text-secondary-500 mt-1">{t('dashboard.task_completion')}</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-50">
              <p className="heading-3 text-secondary-900">4.8</p>
              <p className="text-sm text-secondary-500 mt-1">{t('dashboard.customer_rating')}</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-50">
              <p className="heading-3 text-secondary-900">2.4k</p>
              <p className="text-sm text-secondary-500 mt-1">{t('dashboard.active_sessions')}</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-50">
              <p className="heading-3 text-secondary-900">98%</p>
              <p className="text-sm text-secondary-500 mt-1">{t('dashboard.uptime')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
