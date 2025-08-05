import { writeFileSync } from 'fs'
import { escape } from 'pliny/utils/htmlEscaper.js'
import siteMetadata from '../data/siteMetadata.js'
import { allEvents, allGalleries } from '../.contentlayer/generated/index.mjs'
import { sortPosts } from 'pliny/utils/contentlayer.js'

const outputFolder = process.env.EXPORT ? 'out' : 'public'

const generateRssItem = (config, item, type = 'event') => {
  const url = type === 'gallery' ? `${config.siteUrl}/gallery` : `${config.siteUrl}/events/${item.slug}`

  const description = type === 'gallery' ? item.body?.raw || item.title : item.body?.raw || item.excerpt || item.title

  return `
  <item>
    <guid>${url}#${item.slug}</guid>
    <title>${escape(item.title)}</title>
    <link>${url}</link>
    <description>${escape(description)}</description>
    <pubDate>${new Date(item.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${type === 'gallery' ? `<category>Gallery</category>` : `<category>Event</category>`}
  </item>
`
}

const generateRss = (config, items, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${new Date(items[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${items.map((item) => generateRssItem(config, item, item._type)).join('')}
    </channel>
  </rss>
`

async function generateRSS(config, allEvents, allGalleries, page = 'feed.xml') {
  // Add type identifier to items
  const eventsWithType = allEvents.map((event) => ({ ...event, _type: 'event' }))
  const galleriesWithType = allGalleries.map((gallery) => ({ ...gallery, _type: 'gallery' }))

  // Combine and sort all items by date
  const allItems = [...eventsWithType, ...galleriesWithType]
  const sortedItems = sortPosts(allItems)

  const rss = generateRss(config, sortedItems)
  writeFileSync(`./${outputFolder}/${page}`, rss)
}

const rss = () => {
  generateRSS(siteMetadata, allEvents, allGalleries)
  console.log('RSS feed generated...')
}
export default rss
