import { allGalleries } from 'contentlayer/generated'
import { compareDesc, parseISO, format } from 'date-fns'
import Image from 'next/image'
import { useMDXComponent } from 'pliny/mdx-components'

function GalleryItem({ gallery }) {
  const MDXContent = useMDXComponent(gallery.body.code)

  return (
    <a href={gallery.link} target="_blank" rel="noopener noreferrer" className="group block">
      <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-all group-hover:shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col md:flex-row">
          <div className="relative h-48 overflow-hidden md:h-auto md:w-1/3">
            <Image src={gallery.image} alt={gallery.title} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
          </div>
          <div className="flex-1 p-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{gallery.title}</h2>
              <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">{format(parseISO(gallery.date), 'MMM dd, yyyy')}</p>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <MDXContent />
            </div>
          </div>
        </div>
      </article>
    </a>
  )
}

export default function GalleryPage() {
  const galleries = allGalleries.sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)))

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">Gallery</h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">Explore our memories and highlights from GEOS activities and events.</p>
      </div>
      <div className="container py-12">
        <div className="space-y-6">
          {galleries.map((gallery) => (
            <GalleryItem key={gallery.slug} gallery={gallery} />
          ))}
        </div>
      </div>
    </div>
  )
}
