import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

export function registerCharts() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  )
}

export const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
}

export function getThemeColors() {
  const root = document.documentElement
  const primary = getComputedStyle(root).getPropertyValue('--theme-primary').trim() || '59 130 246'
  const accent = getComputedStyle(root).getPropertyValue('--theme-accent').trim() || '99 102 241'

  return {
    primary: `rgb(${primary})`,
    primaryLight: `rgb(${primary} / 0.1)`,
    primaryMedium: `rgb(${primary} / 0.5)`,
    accent: `rgb(${accent})`,
    accentLight: `rgb(${accent} / 0.1)`,
  }
}

export const chartColors = {
  blue: { solid: '#3b82f6', light: 'rgba(59, 130, 246, 0.1)' },
  purple: { solid: '#8b5cf6', light: 'rgba(139, 92, 246, 0.1)' },
  green: { solid: '#22c55e', light: 'rgba(34, 197, 94, 0.1)' },
  orange: { solid: '#f97316', light: 'rgba(249, 115, 22, 0.1)' },
  red: { solid: '#ef4444', light: 'rgba(239, 68, 68, 0.1)' },
  cyan: { solid: '#06b6d4', light: 'rgba(6, 182, 212, 0.1)' },
  pink: { solid: '#ec4899', light: 'rgba(236, 72, 153, 0.1)' },
  yellow: { solid: '#eab308', light: 'rgba(234, 179, 8, 0.1)' },
}
