import { allCareers } from 'contentlayer/generated'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-static'
export const revalidate = 60

export async function generateStaticParams() {
  return allCareers.map((career) => ({
    slug: career.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const career = allCareers.find((c) => c.slug === slug)
  if (!career) return {}
  return {
    title: career.title,
    description: career.description,
  }
}

export default async function CareerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const career = allCareers.find((c) => c.slug === slug)
  if (!career) notFound()

  const deadline = career.applicationDeadline ? new Date(career.applicationDeadline).toLocaleDateString() : null

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <div className="flex items-center space-x-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-lg">
            <Image src={career.companyLogo} alt={`${career.company} logo`} fill className="object-contain" sizes="96px" />
          </div>
          <div>
            <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">{career.title}</h1>
            <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
              {career.company} • {career.location}
            </p>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="prose dark:prose-invert max-w-none">
          <div className="mb-8">
            <h2>About the Role</h2>
            <p>{career.description}</p>
          </div>

          {/* 将 CTA 与 prose 隔离，避免排版样式影响按钮文字可见性 */}
          <div className="not-prose mb-8">
            <h2 className="mb-2 text-2xl font-bold">How to Apply</h2>
            {deadline && <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">Please submit your application before {deadline}</p>}
            {career.applicationLink && (
              <Link
                href={career.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Apply now on company website"
                className="focus-visible:ring-primary-600 dark:focus-visible:ring-primary-400 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-gray-300 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                Apply now
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 opacity-90">
                  <path d="M13 5h6v6h-2V8.41l-8.29 8.3-1.42-1.42L15.59 7H13V5z"></path>
                </svg>
              </Link>
            )}
          </div>

          <MDXLayoutRenderer code={career.body.code} />
        </div>
      </div>
    </div>
  )
}
