import { allEvents } from 'contentlayer/generated'
import EventCard from '@/components/EventCard'
import { isEventPast } from '@/lib/events'
import { compareDesc, parseISO } from 'date-fns'
import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming and past events',
}

// Re-render hourly so "Past Event" labels flip without a redeploy
export const revalidate = 3600

export default function EventsPage() {
  // Sort events by date, newest first
  const events = allEvents.sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)))
  const now = new Date()

  return (
    <div className="divide-y divide-gray-200">
      <PageHeader title="Events" description="Discover our upcoming events and browse through our past events." />
      <div className="container py-12">
        <div className="flex flex-col gap-8">
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event.slug} event={event} isPast={isEventPast(event, now)} />)
          ) : (
            <div className="py-16 text-center">
              <div className="mx-auto mb-6 h-24 w-24 text-gray-300" aria-hidden="true">
                <svg fill="currentColor" viewBox="0 0 24 24" className="h-full w-full">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
              </div>
              <h2 className="mb-2 text-lg font-medium text-gray-900">No Events Available</h2>
              <p className="text-gray-500">Check back soon for upcoming events and activities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
