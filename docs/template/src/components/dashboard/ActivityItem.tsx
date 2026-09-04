/**
 * Activity Item Component
 * Display activity feed items
 */
import { Icon, Icons } from '@/components/common'

interface ActivityItemProps {
  title: string
  subtitle?: string
  time: string
  icon: string
  iconBg?: string
  iconColor?: string
}

export function ActivityItem({
  title,
  subtitle,
  time,
  icon,
  iconBg = 'bg-primary-100',
  iconColor = 'text-primary-600',
}: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon icon={icon} className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-label text-secondary-900">
          {title}
        </p>
        {subtitle && (
          <p className="text-caption text-secondary-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 text-caption text-secondary-400">
        <Icon icon={Icons.clock} className="w-3 h-3" />
        {time}
      </div>
    </div>
  )
}
