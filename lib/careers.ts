import { TZDate } from '@date-fns/tz'
import { isBefore } from 'date-fns'

// Application deadlines in frontmatter are local to Delft, whatever time zone the server runs in
const CAREER_TIME_ZONE = 'Europe/Amsterdam'

// A posting stays open through the whole deadline day, until midnight after it
export function isCareerOpen(career: { applicationDeadline: string }, now: Date = new Date()): boolean {
  const [year, month, day] = career.applicationDeadline.slice(0, 10).split('-').map(Number)
  return isBefore(now, new TZDate(year, month - 1, day + 1, 0, 0, CAREER_TIME_ZONE))
}
