import { Metadata } from 'next'
import PartnerCard from '@/components/PartnerCard'
import partnersData from '@/data/partnersData'

export const metadata: Metadata = {
  title: 'Partners',
  description: 'Our valued partners and collaborators in geotechnical engineering and related fields.',
}

export default function PartnersPage() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">Partners</h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">Meet our valued partners and collaborators in geotechnical engineering and related fields.</p>
      </div>

      <div className="container py-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {partnersData.map((partner, index) => (
            <PartnerCard key={index} partner={partner} />
          ))}
        </div>

        <div className="prose dark:prose-invert mt-12 max-w-none">
          <h2>Become a Partner</h2>
          <p>Interested in partnering with us? We're always looking for new collaborations that align with our mission and values.</p>
          <a href="mailto:geos@tudelft.nl" className="bg-primary-500 hover:bg-primary-600 rounded-md px-4 py-2 text-white">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
