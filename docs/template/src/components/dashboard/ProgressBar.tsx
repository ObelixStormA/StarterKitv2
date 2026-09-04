/**
 * Progress Bar Component
 * Horizontal progress indicator
 */

interface ProgressBarProps {
  label: string
  value: number
  max?: number
  showValue?: boolean
  color?: string
  size?: 'sm' | 'md' | 'lg'
  rightLabel?: string
}

export function ProgressBar({
  label,
  value,
  max = 100,
  showValue = true,
  color = 'bg-theme-primary',
  size = 'md',
  rightLabel,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-label text-secondary-900">
          {label}
        </span>
        <span className="text-body-sm text-secondary-500">
          {rightLabel || (showValue ? `${Math.round(percentage)}%` : '')}
        </span>
      </div>
      <div className={`w-full bg-surface-100 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div 
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
