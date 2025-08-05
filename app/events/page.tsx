import { allEvents } from 'contentlayer/generated'
import EventCard from '@/components/EventCard'
import { compareDesc, parseISO } from 'date-fns'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming and past events',
}

export default function EventsPage() {
  // Sort events by date, newest first
  const events = allEvents.sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)))

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">Events</h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">Discover our upcoming events and browse through our past events.</p>
      </div>
      <div className="container py-12">
        <div className="flex flex-col gap-8">
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event.slug} event={event} />)
          ) : (
            <div className="py-16 text-center">
              <div className="mx-auto mb-6 h-24 w-24 text-gray-300 dark:text-gray-600">
                <svg fill="currentColor" viewBox="0 0 24 24" className="h-full w-full">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">No Events Available</h3>
              <p className="text-gray-500 dark:text-gray-400">Check back soon for upcoming events and activities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
