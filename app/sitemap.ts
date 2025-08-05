import { MetadataRoute } from 'next'
import { allEvents, allCareers } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const eventRoutes = allEvents.map((event) => ({
    url: `${siteUrl}/events/${event.slug}`,
    lastModified: event.date,
  }))

  const careerRoutes = allCareers.map((career) => ({
    url: `${siteUrl}/careers/${career.slug}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const routes = ['', 'events', 'about', 'gallery', 'careers', 'partners'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...eventRoutes, ...careerRoutes]
}
