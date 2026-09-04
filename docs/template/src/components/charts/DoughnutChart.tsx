/**
 * Doughnut Chart Component
 * Circular chart with hole in center
 */
import { Doughnut } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'

interface DoughnutChartProps {
  data: ChartData<'doughnut'>
  options?: ChartOptions<'doughnut'>
  height?: number
  centerText?: string
  centerSubtext?: string
}

export function DoughnutChart({ data, options, height = 250, centerText, centerSubtext }: DoughnutChartProps) {
  const defaultOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        cornerRadius: 8,
      },
    },
  }

  return (
    <div className="relative" style={{ height }}>
      <Doughnut data={data} options={{ ...defaultOptions, ...options }} />
      {(centerText || centerSubtext) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerText && (
            <span className="heading-3 text-secondary-900">
              {centerText}
            </span>
          )}
          {centerSubtext && (
            <span className="text-sm text-secondary-500">
              {centerSubtext}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
