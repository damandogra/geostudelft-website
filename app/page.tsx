import Link from '@/components/Link'
import Image from 'next/image'
import { Metadata } from 'next'
import { allEvents, allCareers } from 'contentlayer/generated'
import partnersData from '@/data/partnersData'
import { compareDesc, parseISO, isAfter, format, setHours, setMinutes } from 'date-fns'
import BannerCarousel from '@/components/BannerCarousel'

export const metadata: Metadata = {
  title: 'GEOS - Geomatics Student Association',
  description: 'GEOS is the study association of the Geomatics masters programme at Delft University of Technology',
}

export default function HomePage() {
  // Get the 3 most recent events (past or future)
  const recentEvents = allEvents.sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date))).slice(0, 3)

  // Check if each event is in the future with proper logic
  const now = new Date()
  const eventsWithStatus = recentEvents.map((event) => {
    let comparisonDate: Date

    // 对于多天活动，使用结束日期
    if (event.eventType === 'multi-day' && event.endDate) {
      comparisonDate = parseISO(event.endDate)
    } else {
      // 对于单天活动，使用开始日期
      comparisonDate = parseISO(event.date)
    }

    // 如果有具体时间，解析时间以获得更准确的比较
    if (event.time && event.time.includes(':')) {
      try {
        // 处理时间格式，例如 "1:45 PM – 6:00 PM"
        const timeStr = event.time.split('–')[0].trim() // 取开始时间
        const timeParts = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
        
        if (timeParts) {
          let hours = parseInt(timeParts[1])
          const minutes = parseInt(timeParts[2])
          const isPM = timeParts[3] && timeParts[3].toUpperCase() === 'PM'
          
          // 转换为24小时制
          if (isPM && hours !== 12) {
            hours += 12
          } else if (!isPM && hours === 12) {
            hours = 0
          }
          
          comparisonDate = setMinutes(setHours(comparisonDate, hours), minutes)
        }
      } catch (error) {
        console.warn('Failed to parse event time:', event.time)
      }
    }

    return {
      ...event,
      isFuture: isAfter(comparisonDate, now),
    }
  })

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
      image: '/images/events/geoday_24.jpeg',
      title: 'Geomatics Day',
      subtitle: 'Mark your calendars for the annual Geomatics Day at TU Delft! ',
      description: 'Press "Sign Up" to register',
      primary: { href: '/events/geoday_25', label: 'About' },
      secondary: { href: 'https://tudelft3d.typeform.com/to/EvpqL6e7', label: 'Sign Up' },
      imagePosition: 'center' as const,
    },
    {
      image: '/images/gallery/2025-26/intergeo2025.jpg',
      title: 'INTERGEO @Frankfurt',
      subtitle: 'Check out our trip to INTERGEO!',
      description: 'This year, GEOS took 40 Geomatics students to  Frankfurt for the annual INTERGEO trip 🇩🇪',
      primary: { href: 'https://www.instagram.com/p/DPs_Q9hDJ00/', label: 'Photos' },
      secondary: { href: '/gallery', label: 'View Gallery' },
      imagePosition: 'center' as const,
    },
  ]

  return (
    <>
      {/* Hero Banner Section => Carousel */}
      <BannerCarousel slides={slides} className="h-[420px] sm:h-[520px] md:h-[430px]" />

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
