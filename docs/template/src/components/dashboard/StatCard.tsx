/**
 * Stat Card Component
 * Display statistics with icon and change indicator
 */
import { Icon, Icons } from '@/components/common'

interface StatCardProps {
  label: string
  value: string
  change?: string
  isPositive?: boolean
  icon: string
  iconBg?: string
  iconColor?: string
  showMenu?: boolean
}

export function StatCard({
  label,
  value,
  change,
  isPositive = true,
  icon,
  iconBg = 'bg-primary-100',
  iconColor = 'text-primary-600',
  showMenu = true,
}: StatCardProps) {
  return (
    <div className="card rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon icon={icon} className={`w-5 h-5 ${iconColor}`} />
        </div>
        {showMenu && (
          <button className="p-1 hover:bg-surface-100 rounded-lg transition-colors">
            <Icon icon={Icons.dotsVertical} className="w-4 h-4 text-secondary-400" />
          </button>
        )}
      </div>
      <p className="text-sm text-secondary-500 font-medium">
        {label}
      </p>
      <div className="flex items-end justify-between mt-1">
        <p className="heading-3 text-secondary-900">
          {value}
        </p>
        {change && (
          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
            isPositive 
              ? 'bg-success-100 text-success-700' 
              : 'bg-danger-100 text-danger-700'
          }`}>
            {isPositive ? (
              <Icon icon={Icons.arrowUpRight} className="w-3 h-3" />
            ) : (
              <Icon icon={Icons.arrowDownRight} className="w-3 h-3" />
            )}
            {change}
          </span>
        )}
      </div>
    </div>
  )
}
