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
    <article className="card flex flex-col p-6 md:flex-row">
      {event.image && !imageError && (
        <div className="relative mb-4 h-48 w-full flex-shrink-0 md:mr-6 md:mb-0 md:w-64">
          <Image src={event.image} alt="" fill sizes="(min-width: 768px) 256px, 100vw" className="rounded object-cover" onError={() => setImageError(true)} />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">{event.title}</h2>
            {isPast && <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">Past event</span>}
          </div>
          <p className="mb-2 text-sm text-gray-500">
            {event.eventType === 'multi-day' && event.endDate
              ? `${format(parseISO(event.date), 'MMM dd')} - ${format(parseISO(event.endDate), 'MMM dd, yyyy')}`
              : format(parseISO(event.date), 'MMM dd, yyyy')}
            {event.time && ` • ${event.time}`}
            {event.eventType === 'all-day' && ' • All Day'}
            {` • ${event.location}`}
          </p>
          {event.excerpt && <p className="mb-4 text-gray-700">{event.excerpt}</p>}
        </div>
        <div>
          {/* One link styled as a button (no <button> inside a link). The hidden title gives each link a unique name */}
          <Link href={`/events/${event.slug}`} className={isPast ? 'btn-muted' : 'btn-primary'}>
            View event<span className="sr-only">: {event.title}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
