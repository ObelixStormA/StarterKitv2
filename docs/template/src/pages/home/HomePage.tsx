import {
  LandingHeader,
  HeroSection,
  DemosSection,
  FeaturesSection,
  WidgetsSection,
  TestimonialsSection,
  CtaSection,
  LandingFooter,
} from './sections'

export function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <HeroSection />
      <DemosSection />
      <FeaturesSection />
      <WidgetsSection />
      <TestimonialsSection />
      <CtaSection />
      <LandingFooter />
    </div>
  )
}
