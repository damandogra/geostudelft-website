import Link from '@/components/Link'
import Image from 'next/image'
import { Metadata } from 'next'
import { allEvents, allCareers } from 'contentlayer/generated'
import partnersData from '@/data/partnersData'
import { compareDesc, parseISO, isAfter, format } from 'date-fns'

export const metadata: Metadata = {
  title: 'GEOS - Geomatics Student Association',
  description: 'GEOS is the study association of the Geomatics masters programme at Delft University of Technology',
}

export default function HomePage() {
  // Get future events only
  const now = new Date()
  const futureEvents = allEvents
    .filter((event) => isAfter(parseISO(event.date), now))
    .sort((a, b) => compareDesc(parseISO(b.date), parseISO(a.date)))
    .slice(0, 2)
  const latestCareers = allCareers.sort((a, b) => compareDesc(parseISO(a.applicationDeadline), parseISO(b.applicationDeadline))).slice(0, 2)

  return (
    <>
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden rounded-lg">
        <div className="absolute inset-0">
          <Image src="/images/home/pointcloud.jpg" alt="GEOS Banner" fill className="object-cover object-bottom" priority />
          <div className="bg-opacity-40 absolute inset-0"></div>
        </div>
        <div className="relative container mx-auto px-4 py-24">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">GEOS</h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl">Geomatics Student Association</p>
            <div className="mt-10 flex justify-center gap-4">
              <Link href="/about" className="bg-primary-500 hover:bg-primary-600 rounded-md px-6 py-3 text-white transition-colors">
                About Us
              </Link>
              <Link href="/gallery" className="rounded-md border border-white px-6 py-3 text-white transition-colors hover:bg-white hover:text-gray-900">
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative h-64 lg:h-80">
              <Image src="/images/home/events.jpg" alt="Events" fill className="rounded-lg object-cover" />
            </div>
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Events</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Take a look at past and future events organised by and for the Geomatics students. From lunch lectures to networking events, we provide opportunities for learning and connection.
              </p>
              {futureEvents.length > 0 && (
                <div className="mb-6 space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upcoming Events:</h3>
                  {futureEvents.map((event) => (
                    <div key={event.slug} className="border-primary-500 border-l-4 pl-4">
                      <Link href={`/events/${event.slug}`} className="hover:text-primary-600 block">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{event.title}</h4>
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
