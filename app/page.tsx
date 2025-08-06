import Link from '@/components/Link'
import Image from 'next/image'
import { Metadata } from 'next'
import { allEvents, allCareers } from 'contentlayer/generated'
import partnersData from '@/data/partnersData'
import { compareDesc, parseISO, isAfter, format } from 'date-fns'
import BannerCarousel from '@/components/BannerCarousel'

export const metadata: Metadata = {
  title: 'GEOS - Geomatics Student Association',
  description: 'GEOS is the study association of the Geomatics masters programme at Delft University of Technology',
}

export default function HomePage() {
  // Get the 3 most recent events (past or future)
  const recentEvents = allEvents.sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date))).slice(0, 3)

  // Check if each event is in the future
  const now = new Date()
  const eventsWithStatus = recentEvents.map((event) => ({
    ...event,
    isFuture: isAfter(parseISO(event.date), now),
  }))

  const latestCareers = allCareers.sort((a, b) => compareDesc(parseISO(a.applicationDeadline), parseISO(b.applicationDeadline))).slice(0, 2)

  // Slides for the hero carousel
  const slides = [
    {
      image: '/images/home/pointcloud.jpg',
      title: 'Welcome to GEOS!',
      subtitle: 'The Study Association of Geomatics Master Programme TU Delft',
      description: 'We organize events, provide study materials, and create a community for students interested in geosciences and related fields.',
      primary: { href: '/about', label: 'About Us' },
      secondary: { href: '/gallery', label: 'View Gallery' },
      imagePosition: 'bottom' as const,
    },
    {
      image: '/images/home/kickoff.jpg',
      title: 'BK MSc Kick-off',
      subtitle: 'The GEOS Board of 2025 wishes you a wonderful summer break! New Geomatics students: Mark your calendars for the BK MSc Kick-off Programme from Aug 25-29!',
      imagePosition: 'center' as const,
      primary: { href: '/events/kick-off', label: 'About' },
      secondary: { href: 'https://www.tudelft.nl/en/student/a-be-student-portal/education/master-of-science/a-good-start-of-your-master/msc-kick-off-programme', label: 'More Info' },
    },
  ]

  return (
    <>
      {/* Hero Banner Section => Carousel */}
      <BannerCarousel slides={slides} className="h-[420px] sm:h-[520px] md:h-[400px]" />

      {/* Events Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative h-64 lg:h-120">
              <Image src="/images/home/events.jpg" alt="Events" fill className="rounded-lg object-cover" />
            </div>
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Events</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Take a look at past and future events organised by and for the Geomatics students. From lunch lectures to networking events, we provide opportunities for learning and connection.
              </p>
              {eventsWithStatus.length > 0 && (
                <div className="mb-6 space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Events:</h3>
                  {eventsWithStatus.map((event) => (
                    <div key={event.slug} className="border-primary-500 border-l-4 pl-4">
                      <Link href={`/events/${event.slug}`} className="hover:text-primary-600 block">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{event.title}</h4>
                          {event.isFuture && (
                            <span className="ml-2 inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">Upcoming</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {format(parseISO(event.date), 'MMM dd, yyyy')} {event.time && `• ${event.time}`} • {event.location}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/events" className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center">
                View all events →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Careers Section */}
      <div className="rounded-lg bg-gray-50 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Careers</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Find Geomatics related internships and graduate job offers. GEOS provides a platform for companies and research institutes to post their opportunities and connect with talented
                students.
              </p>
              {latestCareers.length > 0 && (
                <div className="mb-6 space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Opportunities:</h3>
                  {latestCareers.map((career) => (
                    <div key={career.slug} className="border-primary-500 border-l-4 pl-4">
                      <Link href={`/careers/${career.slug}`} className="hover:text-primary-600 block">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{career.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {career.company} • {career.location}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/careers" className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center">
                View all opportunities →
              </Link>
            </div>
            <div className="relative h-64 lg:h-80">
              <Image src="/images/home/career.jpg" alt="Careers" fill className="rounded-lg object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Our Partners</h2>
            <p className="mx-auto mb-12 max-w-2xl text-gray-600 dark:text-gray-400">Connect with our valued partners who support the Geomatics community and provide opportunities for our students.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
            {partnersData.slice(0, 5).map((partner) => (
              <Link
                key={partner.name}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center rounded-lg border border-gray-200 bg-white p-6 transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <Image src={partner.logo} alt={partner.name} width={120} height={60} className="h-12 w-auto object-contain transition-transform group-hover:scale-105" />
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/partners" className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center">
              Meet all our partners →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
