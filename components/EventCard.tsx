'use client'

import { useState, useEffect } from 'react'
import Link from '@/components/Link'
import Image from 'next/image'
import { parseISO, isBefore, setHours, setMinutes, format } from 'date-fns'

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
}

export default function EventCard({ event }: EventCardProps) {
  const [isPast, setIsPast] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const now = new Date()

    // Determine which date to use for comparison
    let comparisonDate: Date

    if (event.eventType === 'multi-day' && event.endDate) {
      // For multi-day events, use end date
      comparisonDate = parseISO(event.endDate)
    } else {
      // For single day events, use start date
      comparisonDate = parseISO(event.date)
    }

    // If event has specific time, parse it for more accurate comparison
    if (event.time && event.time.includes(':') && (event.time.includes('AM') || event.time.includes('PM'))) {
      try {
        const [hours, minutes] = event.time.split('–')[0].trim().split(':')
        const isPM = event.time.includes('PM')
        const parsedHours = parseInt(hours) + (isPM && hours !== '12' ? 12 : 0)
        const parsedMinutes = parseInt(minutes?.replace(' PM', '').replace(' AM', '') || '0')

        comparisonDate = setMinutes(setHours(comparisonDate, parsedHours), parsedMinutes)
      } catch (error) {
        // Fallback to date-only comparison if time parsing fails
        console.warn('Failed to parse event time:', event.time)
      }
    }

    setIsPast(isBefore(comparisonDate, now))
  }, [event.date, event.endDate, event.time, event.eventType])

  // Show skeleton state during SSR to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="relative flex animate-pulse flex-col rounded-lg border border-gray-200 p-6 md:flex-row dark:border-gray-700">
        {event.image && <div className="relative mb-4 h-48 w-full flex-shrink-0 rounded bg-gray-300 md:mr-6 md:mb-0 md:w-64 dark:bg-gray-600"></div>}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="mb-2 flex items-center">
              <div className="h-6 w-3/4 rounded bg-gray-300 dark:bg-gray-600"></div>
              <div className="ml-2 h-5 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="mb-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
            {event.excerpt && (
              <div className="mb-4 space-y-2">
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            )}
          </div>
          <div>
            <div className="h-10 w-32 rounded bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </div>
      </div>
    )
  }

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
