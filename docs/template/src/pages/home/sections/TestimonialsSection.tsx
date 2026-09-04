import { Icon, Icons } from '@/components/common'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { useLocale } from '@/i18n'
import { testimonials } from '@/data'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

export function TestimonialsSection() {
	const { t } = useLocale()


	return (
		<section
			id="testimonials"
			className="py-24 px-4 bg-surface-50 scroll-mt-24 overflow-hidden relative"
		>
			{/* Background - Grid Pattern matching WidgetsSection */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

			{/* Soft gradient blobs */}
			<div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-theme-primary/5 rounded-full blur-[100px] -translate-x-1/2 pointer-events-none" />
			<div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-theme-accent/5 rounded-full blur-[100px] translate-x-1/2 pointer-events-none" />

			<div className="max-w-7xl mx-auto relative z-10">
				<div className="text-center mb-20">
					<div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white border border-surface-200 shadow-sm mb-6">
						<Icon icon={Icons.heartFilled} className="w-4 h-4 text-rose-500" />
						<span className="text-sm font-semibold text-secondary-600">
							{t('landing.testimonials.badge')}
						</span>
					</div>
					<h2 className="text-display-section text-secondary-900 mb-6">
						{t('landing.testimonials.title_prefix')} <span className="text-theme-primary">{t('landing.testimonials.title_emphasis')}</span> {t('landing.testimonials.title_suffix')}
					</h2>
					<p className="text-lead text-secondary-600 max-w-2xl mx-auto leading-relaxed">
						{t('landing.testimonials.subtitle')}
					</p>
				</div>

				<Swiper
					modules={[Autoplay, Pagination]}
					spaceBetween={24}
					slidesPerView={1}
					pagination={{
						clickable: true,
						dynamicBullets: true,
					}}
					autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
					breakpoints={{
						640: { slidesPerView: 1, spaceBetween: 24 },
						768: { slidesPerView: 2, spaceBetween: 32 },
						1024: { slidesPerView: 3, spaceBetween: 32 },
					}}
					className="!pb-16 !overflow-visible testimonials-swiper"
				>
					{testimonials.map((testimonial, index) => (
						<SwiperSlide key={index} className="h-auto">
							<div className="group h-full rounded-[2rem] bg-white border border-surface-100 p-8 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
								<div className="absolute top-8 right-8 text-surface-100 group-hover:text-theme-primary/10 transition-colors duration-300 transform group-hover:scale-110">
									<Icon icon={Icons.quote} className="w-20 h-20 rotate-12" />
								</div>

								<div className="relative z-10 flex flex-col h-full">
									<div className="mb-6 flex gap-1">
										{Array.from({ length: 5 }).map((_, i) => (
											<Icon key={i} icon={Icons.starFilled} className="w-4 h-4 text-amber-400" />
										))}
									</div>

									<div className="flex-grow mb-8">
										<p className="text-body font-medium text-secondary-700 leading-relaxed font-display">
											"{t(testimonial.quoteKey)}"
										</p>
									</div>

									<div className="flex items-center gap-4 mt-auto border-t border-surface-100 pt-6">
										<img 
											src={testimonial.avatar} 
											alt={testimonial.name}
											className="w-12 h-12 rounded-full object-cover ring-4 ring-surface-50"
										/>
										<div>
											<p className="font-bold text-secondary-900 text-sm">{testimonial.name}</p>
											<p className="text-xs text-secondary-500 font-medium bg-surface-100 px-2 py-0.5 rounded-full inline-block mt-1">
												{t(testimonial.roleKey)}
											</p>
										</div>
									</div>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</section>
	)
}
