export interface Testimonial {
  name: string
  roleKey: string
  quoteKey: string
  initials: string
  avatar: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Ayesha Khan',
    roleKey: 'landing.testimonials.items.ayesha.role',
    quoteKey: 'landing.testimonials.items.ayesha.quote',
    initials: 'AK',
    avatar: '/assets/avatars/avatar1.jpg',
  },
  {
    name: 'Daniel Roberts',
    roleKey: 'landing.testimonials.items.daniel.role',
    quoteKey: 'landing.testimonials.items.daniel.quote',
    initials: 'DR',
    avatar: '/assets/avatars/avatar2.jpg',
  },
  {
    name: 'Meera Patel',
    roleKey: 'landing.testimonials.items.meera.role',
    quoteKey: 'landing.testimonials.items.meera.quote',
    initials: 'MP',
    avatar: '/assets/avatars/avatar3.jpg',
  },
  {
    name: 'James Wilson',
    roleKey: 'landing.testimonials.items.james.role',
    quoteKey: 'landing.testimonials.items.james.quote',
    initials: 'JW',
    avatar: '/assets/avatars/avatar4.jpg',
  },
  {
    name: 'Sarah Chen',
    roleKey: 'landing.testimonials.items.sarah.role',
    quoteKey: 'landing.testimonials.items.sarah.quote',
    initials: 'SC',
    avatar: '/assets/avatars/avatar5.jpg',
  },
  {
    name: 'Michael Brown',
    roleKey: 'landing.testimonials.items.michael.role',
    quoteKey: 'landing.testimonials.items.michael.quote',
    initials: 'MB',
    avatar: '/assets/avatars/avatar6.jpg',
  },
]
