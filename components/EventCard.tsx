'use client'

import { useState } from 'react'
import Link from '@/components/Link'
import Image from 'next/image'
import { parseISO, format } from 'date-fns'

interface EventCardProps {
  event: {
    slug: string
    title: string
    date: string
    endDate?: string
    time?: string
    eventType?: 'single' | 'multi-day' | 'all-day'
    location: string
    excerpt?: string
    image?: string
  }
  // Computed on the server (see lib/events.ts) so the card renders fully in the static HTML
  isPast: boolean
}

export default function EventCard({ event, isPast }: EventCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="relative flex flex-col rounded-lg border border-gray-200 p-6 md:flex-row dark:border-gray-700">
      {event.image && !imageError && (
        <div className="relative mb-4 h-48 w-full flex-shrink-0 md:mr-6 md:mb-0 md:w-64">
          <Image src={event.image} alt={event.title} fill style={{ objectFit: 'cover' }} className="rounded" onError={() => setImageError(true)} />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="mb-2 flex items-center">
            <span className="text-lg font-bold">{event.title}</span>
            {isPast && <span className="ml-2 rounded bg-gray-300 px-2 py-1 text-xs text-gray-700">Past Event</span>}
          </div>
          <div className="mb-2 text-sm text-gray-500">
            {event.eventType === 'multi-day' && event.endDate
              ? `${format(parseISO(event.date), 'MMM dd')} - ${format(parseISO(event.endDate), 'MMM dd, yyyy')}`
              : format(parseISO(event.date), 'MMM dd, yyyy')}
            {event.time && ` • ${event.time}`}
            {event.eventType === 'all-day' && ' • All Day'}
            {` • ${event.location}`}
          </div>
          {event.excerpt && <p className="mb-4 text-gray-700">{event.excerpt}</p>}
        </div>
        <div>
          <Link href={`/events/${event.slug}`}>
            <button className={`cursor-pointer rounded px-4 py-2 text-white ${isPast ? 'bg-gray-500 hover:bg-gray-600' : 'bg-primary-500 hover:bg-primary-600'}`}>
              {isPast ? 'Event Ended' : 'View Event →'}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
