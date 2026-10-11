import { MetadataRoute } from 'next'
import { allEvents, allCareers } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import { isCareerOpen } from '@/lib/careers'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const eventRoutes = allEvents.map((event) => ({
    url: `${siteUrl}/events/${event.slug}`,
    lastModified: event.date,
  }))

  // Closed postings keep their page but aren't worth indexing
  const careerRoutes = allCareers
    .filter((career) => isCareerOpen(career))
    .map((career) => ({
      url: `${siteUrl}/careers/${career.slug}`,
      lastModified: new Date().toISOString().split('T')[0],
    }))

  const routes = ['', 'events', 'about', 'gallery', 'careers', 'partners'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...eventRoutes, ...careerRoutes]
}
