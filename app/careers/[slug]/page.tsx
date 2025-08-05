import { allCareers } from 'contentlayer/generated'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import Image from 'next/image'

export const dynamic = 'force-static'
export const revalidate = 60

export async function generateStaticParams() {
  return allCareers.map((career) => ({
    slug: career.slug,
  }))
}

export async function generateMetadata({ params }) {
  const career = allCareers.find((career) => career.slug === params.slug)
  if (!career) {
    return {}
  }

  return {
    title: career.title,
    description: career.description,
  }
}

export default function CareerPage({ params }) {
  const career = allCareers.find((career) => career.slug === params.slug)

  if (!career) {
    notFound()
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <div className="flex items-center space-x-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-lg">
            <Image src={career.companyLogo} alt={career.company} fill className="object-contain" sizes="96px" />
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

          <div className="mb-8">
            <h2>How to Apply</h2>
            <p>Please submit your application before {new Date(career.applicationDeadline).toLocaleDateString()}</p>
            <a href={career.applicationLink} target="_blank" rel="noopener noreferrer" className="bg-primary-500 hover:bg-primary-600 inline-block rounded-md px-4 py-2 text-white">
              Apply Now
            </a>
          </div>

          <MDXLayoutRenderer code={career.body.code} />
        </div>
      </div>
    </div>
  )
}
