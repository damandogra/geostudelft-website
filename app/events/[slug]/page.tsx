import { allEvents } from 'contentlayer/generated'
import { useMDXComponent } from 'pliny/mdx-components'
import { notFound } from 'next/navigation'
import Image from 'next/image'

type Props = { params: { slug: string } }

export default function EventPage({ params }: Props) {
  const event = allEvents.find((e) => e.slug === params.slug)

  const MDXContent = useMDXComponent(event?.body.code ?? '')

  if (!event) return notFound()

  return (
    <article className="prose dark:prose-invert mx-auto max-w-3xl py-12">
      <h1>{event.title}</h1>

      {event.image && <Image src={event.image} alt={event.title} width={800} height={400} className="mb-6 rounded" />}

      <div className="mb-4 text-gray-500">
        {new Date(event.date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}{' '}
        &middot; {event.time} &middot; {event.location}
      </div>

      <MDXContent />
    </article>
  )
}
