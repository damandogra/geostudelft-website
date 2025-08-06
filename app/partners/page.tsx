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
          <div className="mt-4 flex gap-4">
            <button className="bg-primary-500 hover:bg-primary-600 rounded-md px-4 py-2 text-white">Contact Us</button>
            <a
              href="https://www.figma.com/deck/8B3lAoguLeBv7Z97mQDBEM/GEOS_sponsor_deck?node-id=46-161&viewport=-72%2C-34%2C0.49&t=cExM2ajh3ucjUBxA-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-gray-500 px-4 py-2 text-white no-underline hover:bg-gray-600"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
