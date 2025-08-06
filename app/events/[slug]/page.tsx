import { allEvents } from 'contentlayer/generated'
import { useMDXComponent } from 'pliny/mdx-components'
import { notFound } from 'next/navigation'
import Image from 'next/image'

export default function EventPage({ params }) {
  const event = allEvents.find((e) => e.slug === params.slug)

  // ❌ Can't return early with hooks below, so use flag instead
  const isNotFound = !event
  const MDXContent = useMDXComponent(event?.body.code || '')

  if (isNotFound) return notFound()

  return (
    <article className="prose dark:prose-invert mx-auto max-w-3xl py-12">
      <h1>{event.title}</h1>
      {event.image && <Image src={event.image} alt={event.title} width={800} height={400} className="mb-6 rounded" />}
      <div className="mb-4 text-gray-500">
        {event.date} &middot; {event.time} &middot; {event.location}
      </div>
      <MDXContent />
    </article>
  )
}
