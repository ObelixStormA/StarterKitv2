import { Icon, Icons } from '@/components/common'
import { AreaChart } from '@/components/charts'
import '@/components/charts/chartConfig'
import type { ChartOptions, ScriptableContext } from 'chart.js'
import { useLocale } from '@/i18n'

const widgets = [
	{
		titleKey: 'landing.widgets.items.total_users',
		value: '12,845',
		delta: '+12%',
		deltaUp: true,
		icon: Icons.users,
		color: 'text-blue-500',
		bg: 'bg-blue-50',
	},
	{
		titleKey: 'landing.widgets.items.revenue',
		value: '$48,295',
		delta: '+8%',
		deltaUp: true,
		icon: Icons.currencyDollar,
		color: 'text-emerald-500',
		bg: 'bg-emerald-50',
	},
	{
		titleKey: 'landing.widgets.items.orders',
		value: '1,234',
		delta: '-3%',
		deltaUp: false,
		icon: Icons.shopping,
		color: 'text-violet-500',
		bg: 'bg-violet-50',
	},
	{
		titleKey: 'landing.widgets.items.avg_response',
		value: '2m 18s',
		delta: '+4%',
		deltaUp: true,
		icon: Icons.clock,
		color: 'text-amber-500',
		bg: 'bg-amber-50',
	},
] as const

export function WidgetsSection() {
	const { locale, t } = useLocale()
	const monthLabels = Array.from({ length: 7 }, (_, i) =>
		new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(2024, i, 1)),
	)

	const chartData = {
		labels: monthLabels,
		datasets: [
			{
				fill: true,
				label: t('charts.dataset.revenue'),
				data: [25, 35, 38, 55, 65, 75, 82],
				borderColor: '#3B82F6',
				backgroundColor: (context: ScriptableContext<'line'>) => {
					const ctx = context.chart.ctx
					const gradient = ctx.createLinearGradient(0, 0, 0, 300)
					gradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)')
					gradient.addColorStop(1, 'rgba(59, 130, 246, 0.01)')
					return gradient
				},
				borderWidth: 3,
				tension: 0.4,
				pointRadius: 0,
				pointHoverRadius: 4,
				pointBackgroundColor: '#3B82F6',
				pointBorderColor: '#fff',
				pointBorderWidth: 2,
			},
		],
	}

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			tooltip: {
				enabled: true,
				backgroundColor: '#1e293b',
				titleColor: '#fff',
				bodyColor: '#fff',
				padding: 10,
				cornerRadius: 8,
				displayColors: false,
			},
		},
		scales: {
			x: { display: false },
			y: { display: false, min: 0 },
		},
		layout: {
			padding: {
				left: -10,
				right: -10,
				bottom: -10,
			},
		},
	}

	return (
		<section
			id="widgets"
			className="py-32 px-4 bg-surface-50 scroll-mt-24 relative overflow-hidden"
		>
			{/* Refined Background - Subtle Grid only */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

			<div className="max-w-7xl mx-auto relative z-10">
				<div className="text-center mb-20 max-w-3xl mx-auto">
					<div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-surface-200 shadow-sm mb-6">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-primary opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-theme-primary"></span>
						</span>
						<span className="text-sm font-semibold text-secondary-600">
							{t('landing.widgets.badge')}
						</span>
					</div>

					<h2 className="text-display-section text-secondary-900 mb-6">
						{t('landing.widgets.title_prefix')} <span className="text-theme-primary">{t('landing.widgets.title_emphasis')}</span>
					</h2>
					<p className="text-lead text-secondary-600 leading-relaxed">
						{t('landing.widgets.subtitle')}
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
					{/* Left Column: Stats Grid */}
					<div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
						{widgets.map((w) => (
							<div
								key={w.titleKey}
								className="group relative rounded-[2rem] border border-surface-100 bg-white p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
							>
								<div className="relative flex items-start justify-between mb-8">
									<div
										className={`w-12 h-12 rounded-full ${w.bg} flex items-center justify-center ${w.color}`}
									>
										<Icon icon={w.icon} className="w-6 h-6" />
									</div>
									<span
										className={
											'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ' +
											(w.deltaUp
												? 'bg-emerald-50 text-emerald-600'
												: 'bg-rose-50 text-rose-600')
										}
									>
										{w.deltaUp ? (
											<Icon icon={Icons.arrowUpRight} className="w-3.5 h-3.5" />
										) : (
											<Icon icon={Icons.arrowDownRight} className="w-3.5 h-3.5" />
										)}
										{w.delta}
									</span>
								</div>

								<div>
									<p className="text-secondary-500 text-sm font-medium mb-1">
										{t(w.titleKey)}
									</p>
									<p className="heading-2 text-secondary-900">
										{w.value}
									</p>
								</div>
							</div>
						))}
					</div>

					{/* Right Column: Complex Widgets */}
					<div className="lg:col-span-5 space-y-6">
						{/* Revenue Card */}
						<div className="rounded-[2rem] border border-surface-100 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 h-[340px] flex flex-col">
							<div className="flex items-start justify-between mb-2">
								<div>
									<div className="flex items-center gap-2 mb-1">
										<p className="text-secondary-500 font-medium">{t('landing.widgets.revenue_overview.title')}</p>
										<span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
									</div>
									<p className="heading-4 text-secondary-900">{t('landing.widgets.revenue_overview.subtitle')}</p>
								</div>
								<button className="w-10 h-10 rounded-full border border-surface-200 flex items-center justify-center text-secondary-400 hover:text-secondary-600 transition-colors">
									<Icon icon={Icons.moreHorizontal} className="w-5 h-5 rotate-90" />
								</button>
							</div>
							
							<div className="flex-1 w-full relative -mx-4 overflow-hidden flex items-end">
                <div className="w-[110%] -ml-2 h-[220px]">
                  <AreaChart data={chartData} options={chartOptions as ChartOptions<'line'>} height={220} />
                </div>
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="grid grid-cols-2 gap-6">
							<div className="rounded-[2rem] bg-white border border-surface-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden h-[180px] flex flex-col justify-between">
								{/* Decorative Icon Watermark */}
								<div className="absolute -right-4 -bottom-4 text-cyan-500/5">
									<Icon icon={Icons.activity} width={80} height={80} />
								</div>

								<div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-500">
									<Icon icon={Icons.activity} width={20} height={20} />
								</div>

								<div className="relative z-10">
									<p className="text-sm text-secondary-500 font-medium mb-1">{t('charts.source.organic')}</p>
									<div className="flex items-baseline gap-2 mb-3">
										<p className="heading-3 text-secondary-900">42%</p>
										<span className="text-xs font-semibold text-emerald-500">+12.5%</span>
									</div>
									<div className="h-1.5 w-full bg-surface-100 rounded-full overflow-hidden">
										<div className="h-full bg-cyan-500 w-[42%] rounded-full" />
									</div>
								</div>
							</div>

							<div className="rounded-[2rem] bg-white border border-surface-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden h-[180px] flex flex-col justify-between">
								{/* Decorative Icon Watermark */}
								<div className="absolute -right-4 -bottom-4 text-purple-500/5">
									<Icon icon={Icons.creditCard} width={80} height={80} />
								</div>

								<div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
									<Icon icon={Icons.creditCard} width={20} height={20} />
								</div>

								<div className="relative z-10">
									<p className="text-sm text-secondary-500 font-medium mb-1">{t('charts.source.paid')}</p>
									<div className="flex items-baseline gap-2 mb-3">
										<p className="heading-3 text-secondary-900">28%</p>
										<span className="text-xs font-semibold text-rose-500">-2.4%</span>
									</div>
									<div className="h-1.5 w-full bg-surface-100 rounded-full overflow-hidden">
										<div className="h-full bg-purple-500 w-[28%] rounded-full" />
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Bottom Banner */}
					<div className="lg:col-span-12 rounded-[2.5rem] border border-surface-100 bg-white p-10 relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
						<div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
							<div className="w-20 h-20 rounded-[2.5rem] bg-surface-50 flex items-center justify-center shadow-inner">
								<Icon icon={Icons.trendingUp} className="w-8 h-8 text-secondary-400" />
							</div>

							<div className="text-center md:text-left flex-1">
								<h3 className="text-display-subhero text-secondary-900 mb-3">
									{t('landing.widgets.banner.title')}
								</h3>
								<p className="text-body text-secondary-600 max-w-2xl">
									{t('landing.widgets.banner.subtitle')}
								</p>
							</div>

							<div className="md:ml-auto">
								<button className="px-8 py-4 rounded-xl bg-secondary-900 text-white font-bold shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
									{t('landing.widgets.banner.button')}
									<Icon icon={Icons.arrowRight} className="w-4 h-4" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}


