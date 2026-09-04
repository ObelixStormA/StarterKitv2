import { useState } from 'react'
import { Icon, Icons } from '@/components/common'
import { calendarEvents, eventColors } from '@/data/calendar'
import type { CalendarEvent } from '@/data/calendar'
import { useLocale } from '@/i18n'

type ViewType = 'month' | 'week' | 'day'

// Empty event form data
const emptyFormData = {
  title: '',
  description: '',
  location: '',
  color: 'primary' as CalendarEvent['color'],
  allDay: false,
  startTime: '09:00',
  endTime: '10:00',
}

/**
 * Calendar Page Component
 * Full-featured calendar with month/week/day views and event management
 */
export function CalendarPage() {
  const { t, locale } = useLocale()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<ViewType>('month')
  const [events, setEvents] = useState<CalendarEvent[]>(calendarEvents)
  
  // Modal states
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null)
  
  // Form states
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [formData, setFormData] = useState(emptyFormData)

  // Calendar navigation
  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => setCurrentDate(new Date())

  // Get calendar data
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days: { date: Date; isCurrentMonth: boolean }[] = []

    // Previous month days
    const prevMonth = new Date(year, month, 0)
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false,
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      })
    }

    // Next month days
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      })
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const getWeekDays = (date: Date) => {
    const start = new Date(date)
    start.setDate(start.getDate() - start.getDay())
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(day.getDate() + i)
      days.push(day)
    }
    return days
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Event handlers
  const handleEventClick = (event: CalendarEvent, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSelectedEvent(event)
    setIsViewModalOpen(true)
  }

  const handleAddNew = () => {
    setIsEditMode(false)
    setSelectedDate(new Date())
    setFormData(emptyFormData)
    setIsFormModalOpen(true)
  }

  const handleDateClick = (date: Date) => {
    setIsEditMode(false)
    setSelectedDate(date)
    setFormData(emptyFormData)
    setIsFormModalOpen(true)
  }

  const handleEditEvent = (event: CalendarEvent) => {
    setIsEditMode(true)
    setSelectedEvent(event)
    setSelectedDate(event.start)
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location || '',
      color: event.color,
      allDay: event.allDay || false,
      startTime: `${event.start.getHours().toString().padStart(2, '0')}:${event.start.getMinutes().toString().padStart(2, '0')}`,
      endTime: `${event.end.getHours().toString().padStart(2, '0')}:${event.end.getMinutes().toString().padStart(2, '0')}`,
    })
    setIsViewModalOpen(false)
    setIsFormModalOpen(true)
  }

  const handleDeleteClick = (event: CalendarEvent) => {
    setEventToDelete(event)
    setIsViewModalOpen(false)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      setEvents(events.filter((e) => e.id !== eventToDelete.id))
      setIsDeleteDialogOpen(false)
      setEventToDelete(null)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !selectedDate) return

    const start = new Date(selectedDate)
    const end = new Date(selectedDate)

    if (!formData.allDay) {
      const [startHour, startMin] = formData.startTime.split(':').map(Number)
      const [endHour, endMin] = formData.endTime.split(':').map(Number)
      start.setHours(startHour, startMin, 0, 0)
      end.setHours(endHour, endMin, 0, 0)
    } else {
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
    }

    if (isEditMode && selectedEvent) {
      setEvents(events.map((e) =>
        e.id === selectedEvent.id
          ? { ...e, ...formData, start, end }
          : e
      ))
    } else {
      const newEvent: CalendarEvent = {
        id: Math.max(...events.map((e) => e.id), 0) + 1,
        title: formData.title,
        description: formData.description,
        location: formData.location || undefined,
        color: formData.color,
        allDay: formData.allDay,
        start,
        end,
      }
      setEvents([...events, newEvent])
    }

    setIsFormModalOpen(false)
    setFormData(emptyFormData)
    setSelectedDate(null)
  }

  const days = getDaysInMonth(currentDate)
  const weekDays = getWeekDays(currentDate)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
  }

  const weekDayNames = Array.from({ length: 7 }, (_, idx) => {
    // 2021-08-01 is a Sunday.
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2021, 7, 1 + idx))
  })

  const monthYear = currentDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const colorOptions: CalendarEvent['color'][] = ['primary', 'success', 'warning', 'danger', 'info', 'purple']

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-2 text-secondary-900 flex items-center gap-2">
            <Icon icon={Icons.calendar} width={28} height={28} />
            {t('apps.calendar.calendar')}
          </h1>
          <p className="text-body-sm text-secondary-500 mt-1">
            {t('apps.calendar.manage_schedule')}
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-theme-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Icon icon={Icons.plus} width={16} height={16} />
          {t('apps.calendar.new_event')}
        </button>
      </div>

      {/* Calendar Card */}
      <div className="card rounded-xl overflow-hidden">
        {/* Calendar Header */}
        <div className="p-4 border-b border-surface-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('prev')}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors text-secondary-600"
            >
              <Icon icon={Icons.chevronLeft} width={20} height={20} />
            </button>
            <button
              onClick={() => navigate('next')}
              className="p-2 hover:bg-surface-100 rounded-lg transition-colors text-secondary-600"
            >
              <Icon icon={Icons.chevronRight} width={20} height={20} />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 ms-2 bg-surface-100 hover:bg-surface-200 rounded-lg text-sm font-medium text-secondary-700 transition-colors"
            >
              {t('apps.calendar.today')}
            </button>
            <h2 className="text-lg font-semibold text-secondary-900 ms-4">{monthYear}</h2>
          </div>
          <div className="flex bg-surface-100 rounded-xl p-1">
            {(['month', 'week', 'day'] as ViewType[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === v
                    ? 'bg-white text-theme-primary shadow-sm'
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                {t(`apps.calendar.${v}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Month View */}
        {view === 'month' && (
          <div className="p-4">
            {/* Week day headers */}
            <div className="grid grid-cols-7 mb-2">
              {weekDayNames.map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-secondary-500 py-3">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px bg-surface-200 rounded-xl overflow-hidden">
              {days.map((day, index) => {
                const dayEvents = getEventsForDate(day.date)
                return (
                  <div
                    key={index}
                    onClick={() => handleDateClick(day.date)}
                    className={`min-h-28 p-2 bg-white cursor-pointer transition-colors hover:bg-surface-50 ${
                      !day.isCurrentMonth ? 'bg-surface-50' : ''
                    }`}
                  >
                    <div
                      className={`text-sm font-medium mb-1.5 w-7 h-7 flex items-center justify-center rounded-full ${
                        isToday(day.date)
                          ? 'bg-theme-primary text-white'
                          : day.isCurrentMonth
                          ? 'text-secondary-900'
                          : 'text-secondary-400'
                      }`}
                    >
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => {
                        const colorConfig = eventColors[event.color]
                        return (
                          <div
                            key={event.id}
                            onClick={(e) => handleEventClick(event, e)}
                            className={`text-xs px-2 py-1 rounded-md truncate cursor-pointer font-medium ${colorConfig.bg} ${colorConfig.text} border-s-2 ${colorConfig.border} hover:opacity-80 transition-opacity`}
                          >
                            {event.title}
                          </div>
                        )
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-secondary-500 px-2 font-medium">
                          {t('apps.calendar.more_count', { count: dayEvents.length - 3 })}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Week View */}
        {view === 'week' && (
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Week header */}
              <div className="grid grid-cols-8 border-b border-surface-200">
                <div className="p-3 border-e border-surface-200"></div>
                {weekDays.map((day, index) => (
                  <div
                    key={index}
                    className={`p-3 text-center border-e border-surface-200 last:border-e-0 ${
                      isToday(day) ? 'bg-theme-primary/5' : ''
                    }`}
                  >
                    <div className="text-xs font-medium text-secondary-500 uppercase">
                      {weekDayNames[day.getDay()]}
                    </div>
                    <div
                      className={`text-xl font-bold mt-1 ${
                        isToday(day) ? 'text-theme-primary' : 'text-secondary-900'
                      }`}
                    >
                      {day.getDate()}
                    </div>
                  </div>
                ))}
              </div>
              {/* Time grid */}
              <div className="max-h-[600px] overflow-y-auto">
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 border-b border-surface-100">
                    <div className="p-2 text-xs font-medium text-secondary-500 border-e border-surface-200 text-right pe-3">
                      {hour.toString().padStart(2, '0')}:00
                    </div>
                    {weekDays.map((day, dayIndex) => {
                      const dayEvents = events.filter((event) => {
                        const eventDate = new Date(event.start)
                        return (
                          eventDate.getDate() === day.getDate() &&
                          eventDate.getMonth() === day.getMonth() &&
                          eventDate.getFullYear() === day.getFullYear() &&
                          eventDate.getHours() === hour
                        )
                      })
                      return (
                        <div
                          key={dayIndex}
                          onClick={() => handleDateClick(day)}
                          className="min-h-14 p-1 border-e border-surface-100 last:border-e-0 hover:bg-surface-50 cursor-pointer transition-colors"
                        >
                          {dayEvents.map((event) => {
                            const colorConfig = eventColors[event.color]
                            return (
                              <div
                                key={event.id}
                                onClick={(e) => handleEventClick(event, e)}
                                className={`text-xs px-2 py-1 rounded-md cursor-pointer font-medium ${colorConfig.bg} ${colorConfig.text} hover:opacity-80 transition-opacity`}
                              >
                                {event.title}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Day View */}
        {view === 'day' && (
          <div className="p-4">
            <div className="text-center mb-6 pb-4 border-b border-surface-200">
              <div className="text-sm font-medium text-secondary-500 uppercase">
                {weekDayNames[currentDate.getDay()]}
              </div>
              <div
                className={`heading-1 mt-1 ${
                  isToday(currentDate) ? 'text-theme-primary' : 'text-secondary-900'
                }`}
              >
                {currentDate.getDate()}
              </div>
              <div className="text-sm text-secondary-500 mt-1">
                {currentDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
              </div>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {hours.map((hour) => {
                const hourEvents = events.filter((event) => {
                  const eventDate = new Date(event.start)
                  return (
                    eventDate.getDate() === currentDate.getDate() &&
                    eventDate.getMonth() === currentDate.getMonth() &&
                    eventDate.getFullYear() === currentDate.getFullYear() &&
                    eventDate.getHours() === hour
                  )
                })
                return (
                  <div
                    key={hour}
                    className="flex border-b border-surface-100 min-h-16"
                  >
                    <div className="w-20 p-3 text-sm font-medium text-secondary-500 border-e border-surface-200 flex-shrink-0 text-right pe-4">
                      {hour.toString().padStart(2, '0')}:00
                    </div>
                    <div
                      onClick={() => handleDateClick(currentDate)}
                      className="flex-1 p-2 hover:bg-surface-50 cursor-pointer transition-colors"
                    >
                      {hourEvents.map((event) => {
                        const colorConfig = eventColors[event.color]
                        return (
                          <div
                            key={event.id}
                            onClick={(e) => handleEventClick(event, e)}
                            className={`px-4 py-3 rounded-xl cursor-pointer ${colorConfig.bg} ${colorConfig.text} border-s-4 ${colorConfig.border} hover:opacity-80 transition-opacity`}
                          >
                            <div className="font-semibold">{event.title}</div>
                            <div className="text-sm opacity-80 mt-1">
                              {formatTime(event.start)} - {formatTime(event.end)}
                            </div>
                            {event.location && (
                              <div className="text-sm opacity-80 flex items-center gap-1 mt-1">
                                <Icon icon={Icons.mapPin} width={12} height={12} />
                                {event.location}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Events */}
      <div className="card rounded-xl p-5">
        <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
          <Icon icon={Icons.calendarEvent} width={20} height={20} />
          {t('apps.calendar.upcoming_events')}
        </h3>
        <div className="space-y-3">
          {events
            .filter((event) => new Date(event.start) >= new Date())
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
            .slice(0, 5)
            .map((event) => {
              const colorConfig = eventColors[event.color]
              return (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className={`p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01] ${colorConfig.bg} border-s-4 ${colorConfig.border}`}
                >
                  <div className={`font-semibold ${colorConfig.text}`}>{event.title}</div>
                  <div className="text-sm text-secondary-600 mt-1.5">
                    {event.allDay
                      ? formatDate(event.start)
                      : `${formatShortDate(event.start)} ${t('apps.calendar.at')} ${formatTime(event.start)}`}
                  </div>
                  {event.location && (
                    <div className="text-sm text-secondary-500 flex items-center gap-1.5 mt-1.5">
                      <Icon icon={Icons.mapPin} width={16} height={16} />
                      {event.location}
                    </div>
                  )}
                </div>
              )
            })}
          {events.filter((event) => new Date(event.start) >= new Date()).length === 0 && (
            <div className="text-center py-8">
              <Icon icon={Icons.calendarEvent} width={48} height={48} className="mx-auto text-secondary-300 mb-3" />
              <p className="text-secondary-500">{t('apps.calendar.no_upcoming')}</p>
              <button
                onClick={handleAddNew}
                className="mt-3 text-sm text-theme-primary hover:underline font-medium"
              >
                {t('apps.calendar.create_event')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* View Event Modal */}
      {isViewModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsViewModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-fade-in overflow-hidden">
            {/* Colored Header */}
            <div className={`h-20 ${
              selectedEvent.color === 'primary' ? 'bg-gradient-to-r from-primary-500 to-primary-600' :
              selectedEvent.color === 'success' ? 'bg-gradient-to-r from-success-500 to-success-600' :
              selectedEvent.color === 'warning' ? 'bg-gradient-to-r from-warning-500 to-warning-600' :
              selectedEvent.color === 'danger' ? 'bg-gradient-to-r from-danger-500 to-danger-600' :
              selectedEvent.color === 'info' ? 'bg-gradient-to-r from-info-500 to-info-600' :
              'bg-gradient-to-r from-purple-500 to-purple-600'
            } relative`}>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
              >
                <Icon icon={Icons.close} width={20} height={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-secondary-900 mb-2">
                {selectedEvent.title}
              </h2>
              
              {selectedEvent.description && (
                <p className="text-secondary-600 mb-4">
                  {selectedEvent.description}
                </p>
              )}

              {/* Event Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-theme-primary/10 flex items-center justify-center">
                    <Icon icon={Icons.clock} width={20} height={20} className="text-theme-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500">{t('apps.calendar.date_time')}</p>
                    <p className="text-sm font-medium text-secondary-900">
                      {selectedEvent.allDay 
                        ? `${t('apps.calendar.all_day')} - ${formatDate(selectedEvent.start)}`
                        : `${formatDate(selectedEvent.start)}, ${formatTime(selectedEvent.start)} - ${formatTime(selectedEvent.end)}`
                      }
                    </p>
                  </div>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-warning-100 flex items-center justify-center">
                      <Icon icon={Icons.mapPin} width={20} height={20} className="text-warning-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500">{t('apps.calendar.location')}</p>
                      <p className="text-sm font-medium text-secondary-900">
                        {selectedEvent.location}
                      </p>
                    </div>
                  </div>
                )}

                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-info-100 flex items-center justify-center">
                      <Icon icon={Icons.users} width={20} height={20} className="text-info-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500">{t('apps.calendar.attendees')}</p>
                      <p className="text-sm font-medium text-secondary-900">
                        {selectedEvent.attendees.join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-surface-200">
                <button
                  onClick={() => handleDeleteClick(selectedEvent)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-danger-50 text-danger-600 rounded-xl text-sm font-medium hover:bg-danger-100 transition-colors"
                >
                  <Icon icon={Icons.trash} width={16} height={16} />
                  {t('common.delete')}
                </button>
                <button
                  onClick={() => handleEditEvent(selectedEvent)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-theme-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Icon icon={Icons.edit} width={16} height={16} />
                  {t('apps.calendar.edit_event')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Event Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsFormModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-fade-in overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-surface-200 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-bold text-secondary-900">
                  {isEditMode ? t('apps.calendar.edit_event') : t('apps.calendar.create_event')}
                </h2>
                <p className="text-sm text-secondary-500 mt-0.5">
                  {selectedDate ? formatDate(selectedDate) : t('apps.calendar.select_date')}
                </p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 hover:bg-surface-100 rounded-lg text-secondary-500 transition-colors"
              >
                <Icon icon={Icons.close} width={20} height={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                  {t('apps.calendar.title')} <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all"
                  placeholder={t('apps.calendar.event_title_placeholder')}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                  {t('apps.calendar.description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all resize-none"
                  placeholder={t('apps.calendar.event_description_placeholder')}
                />
              </div>

              {/* All Day Toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, allDay: !formData.allDay })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    formData.allDay ? 'bg-theme-primary' : 'bg-surface-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                      formData.allDay ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-secondary-700">{t('apps.calendar.all_day_toggle')}</span>
              </div>

              {/* Time Inputs */}
              {!formData.allDay && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                      {t('apps.calendar.start_time_label')}
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                      {t('apps.calendar.end_time_label')}
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                  {t('apps.calendar.location')}
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary transition-all"
                  placeholder={t('apps.calendar.event_location_placeholder')}
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  {t('apps.calendar.color')}
                </label>
                <div className="flex gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-9 h-9 rounded-full transition-all flex items-center justify-center ${
                        formData.color === c ? 'ring-2 ring-offset-2 ring-secondary-400' : ''
                      } ${
                        c === 'primary' ? 'bg-primary-500' :
                        c === 'success' ? 'bg-success-500' :
                        c === 'warning' ? 'bg-warning-500' :
                        c === 'danger' ? 'bg-danger-500' :
                        c === 'info' ? 'bg-info-500' :
                        'bg-purple-500'
                      }`}
                    >
                      {formData.color === c && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-surface-200">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-surface-100 text-secondary-700 rounded-xl text-sm font-medium hover:bg-surface-200 transition-colors"
                >
                  {t('apps.calendar.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-theme-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {isEditMode ? t('apps.calendar.update_event') : t('apps.calendar.add_event')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && eventToDelete && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsDeleteDialogOpen(false)}
          />
          
          {/* Dialog Content */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-fade-in p-6">
            {/* Icon */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-danger-100 flex items-center justify-center">
              <Icon icon={Icons.alertTriangle} width={28} height={28} className="text-danger-600" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-secondary-900 text-center mb-2">
              {t('apps.calendar.delete_event')}
            </h3>

            {/* Message */}
            <p className="text-sm text-secondary-500 text-center mb-6">
              {t('apps.calendar.delete_confirm_message', { title: eventToDelete.title })}
            </p>

            {/* Event Preview */}
            <div className={`p-4 rounded-xl mb-6 ${eventColors[eventToDelete.color].bg} border-s-4 ${eventColors[eventToDelete.color].border}`}>
              <div className={`font-semibold ${eventColors[eventToDelete.color].text}`}>
                {eventToDelete.title}
              </div>
              <div className="text-sm text-secondary-600 mt-1">
                {formatShortDate(eventToDelete.start)} {t('apps.calendar.at')} {formatTime(eventToDelete.start)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1 px-4 py-2.5 bg-surface-100 text-secondary-700 rounded-xl text-sm font-medium hover:bg-surface-200 transition-colors"
              >
                {t('apps.calendar.cancel')}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 bg-danger-600 text-white rounded-xl text-sm font-medium hover:bg-danger-700 transition-colors"
              >
                {t('apps.calendar.delete_event')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarPage
