import { TZDate } from '@date-fns/tz'
import { isBefore } from 'date-fns'

// Event dates and times in frontmatter are local to Delft, whatever time zone the server runs in
const EVENT_TIME_ZONE = 'Europe/Amsterdam'

interface EventTiming {
  date: string
  endDate?: string
  time?: string
  eventType?: string
}

// Minutes after midnight for '1:45 PM' or '18:00', or undefined when there is no clock time
function parseClockTime(text?: string): number | undefined {
  const match = text?.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
  if (!match) return undefined

  let hours = parseInt(match[1])
  const minutes = parseInt(match[2])
  const meridiem = match[3]?.toUpperCase()
  if (meridiem === 'PM' && hours !== 12) hours += 12
  if (meridiem === 'AM' && hours === 12) hours = 0

  return hours * 60 + minutes
}

// The moment an event ends: the end time of `time` strings like '1:45 PM – 6:00 PM' on the last day
// (endDate for multi-day events), or midnight after the last day when no end time is given
function getEventEnd(event: EventTiming): Date {
  // Contentlayer serialises dates as UTC midnight ('2025-11-07T00:00:00.000Z'), so the first 10 characters are the authored date
  const lastDay = (event.eventType === 'multi-day' && event.endDate ? event.endDate : event.date).slice(0, 10)
  const [year, month, day] = lastDay.split('-').map(Number)

  const [startText, endText] = (event.time ?? '').split(/\s*[–—-]\s*|\s+to\s+/i)
  const start = parseClockTime(startText)
  const end = parseClockTime(endText)

  if (end === undefined) return new TZDate(year, month - 1, day + 1, 0, 0, EVENT_TIME_ZONE)

  // An end time at or before the start time means the event runs past midnight
  const endDay = start !== undefined && end <= start ? day + 1 : day
  return new TZDate(year, month - 1, endDay, Math.floor(end / 60), end % 60, EVENT_TIME_ZONE)
}

export function isEventPast(event: EventTiming, now: Date = new Date()): boolean {
  return !isBefore(now, getEventEnd(event))
}
