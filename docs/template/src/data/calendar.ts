export interface CalendarEvent {
  id: number
  title: string
  description: string
  start: Date
  end: Date
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
  allDay?: boolean
  location?: string
  attendees?: string[]
}

// Helper to get dates relative to today
const today = new Date()
const getDate = (daysOffset: number, hours = 0, minutes = 0) => {
  const date = new Date(today)
  date.setDate(date.getDate() + daysOffset)
  date.setHours(hours, minutes, 0, 0)
  return date
}

export const calendarEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'Team Standup',
    description: 'Daily team sync meeting',
    start: getDate(0, 9, 0),
    end: getDate(0, 9, 30),
    color: 'primary',
    location: 'Zoom',
    attendees: ['Sarah', 'Michael', 'Emily'],
  },
  {
    id: 2,
    title: 'Project Review',
    description: 'Q4 project milestone review with stakeholders',
    start: getDate(0, 14, 0),
    end: getDate(0, 15, 30),
    color: 'success',
    location: 'Conference Room A',
    attendees: ['David', 'Lisa', 'James'],
  },
  {
    id: 3,
    title: 'Client Call',
    description: 'Weekly sync with Acme Corp',
    start: getDate(1, 10, 0),
    end: getDate(1, 11, 0),
    color: 'warning',
    location: 'Google Meet',
    attendees: ['John Doe'],
  },
  {
    id: 4,
    title: 'Design Workshop',
    description: 'UX improvement brainstorming session',
    start: getDate(1, 13, 0),
    end: getDate(1, 16, 0),
    color: 'purple',
    location: 'Design Lab',
    attendees: ['Emily', 'Robert'],
  },
  {
    id: 5,
    title: 'Sprint Planning',
    description: 'Plan tasks for the upcoming sprint',
    start: getDate(2, 9, 0),
    end: getDate(2, 11, 0),
    color: 'info',
    location: 'Main Office',
    attendees: ['Team'],
  },
  {
    id: 6,
    title: 'Product Launch',
    description: 'New feature release',
    start: getDate(3, 0, 0),
    end: getDate(3, 23, 59),
    color: 'danger',
    allDay: true,
  },
  {
    id: 7,
    title: 'Training Session',
    description: 'New employee onboarding',
    start: getDate(4, 10, 0),
    end: getDate(4, 12, 0),
    color: 'success',
    location: 'Training Room',
    attendees: ['HR Team', 'New Hires'],
  },
  {
    id: 8,
    title: 'Team Lunch',
    description: 'Monthly team bonding',
    start: getDate(5, 12, 0),
    end: getDate(5, 13, 30),
    color: 'warning',
    location: 'Italian Restaurant',
  },
  {
    id: 9,
    title: 'Code Review',
    description: 'Review pull requests',
    start: getDate(-1, 15, 0),
    end: getDate(-1, 16, 0),
    color: 'primary',
    location: 'Online',
  },
  {
    id: 10,
    title: 'Board Meeting',
    description: 'Quarterly board presentation',
    start: getDate(7, 9, 0),
    end: getDate(7, 12, 0),
    color: 'danger',
    location: 'Executive Suite',
    attendees: ['CEO', 'CFO', 'Board Members'],
  },
]

// Event color configurations
export const eventColors: Record<CalendarEvent['color'], { bg: string; text: string; border: string }> = {
  primary: { bg: 'bg-primary-100', text: 'text-primary-700', border: 'border-primary-500' },
  success: { bg: 'bg-success-100', text: 'text-success-700', border: 'border-success-500' },
  warning: { bg: 'bg-warning-100', text: 'text-warning-700', border: 'border-warning-500' },
  danger: { bg: 'bg-danger-100', text: 'text-danger-700', border: 'border-danger-500' },
  info: { bg: 'bg-info-100', text: 'text-info-700', border: 'border-info-500' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-500' },
}
