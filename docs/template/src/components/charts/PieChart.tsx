/**
 * Pie Chart Component
 * Circular chart without center cutout
 */
import { Pie } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'

interface PieChartProps {
  data: ChartData<'pie'>
  options?: ChartOptions<'pie'>
  height?: number
}

export function PieChart({ data, options, height = 250 }: PieChartProps) {
  const defaultOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
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
      <Pie data={data} options={{ ...defaultOptions, ...options }} />
    </div>
  )
}
