import { allEvents } from 'contentlayer/generated'
import { useMDXComponent } from 'pliny/mdx-components'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'

export default function EventPage({ params }: { params: { slug: string } }) {
  const event = allEvents.find((e) => e.slug === params.slug)

  const MDXContent = useMDXComponent(event?.body?.code ?? '')

  if (!event) return notFound()

  const prettyDate = event.date ? format(parseISO(event.date), 'MMM dd, yyyy') : ''

  return (
    <article className="prose dark:prose-invert mx-auto max-w-3xl py-12">
      <h1>{event.title}</h1>
      {event.image && <Image src={event.image} alt={event.title} width={800} height={400} className="mb-6 rounded" />}
      <div className="mb-4 text-gray-500">
        {prettyDate}
        {event.time && <> &middot; {event.time}</>}
        {event.location && <> &middot; {event.location}</>}
      </div>
      <MDXContent />
    </article>
  )
}
