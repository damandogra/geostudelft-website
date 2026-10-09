import { Metadata } from 'next'
import PartnerCard from '@/components/PartnerCard'
import partnersData from '@/data/partnersData'
import { sponsorshipPackages } from '@/data/sponsorshipPackages'

export const metadata: Metadata = {
  title: 'Partners',
  description: 'Our valued partners and collaborators in geomatics and geosciences.',
}

export default function PartnersPage() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">Partners</h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">Meet our valued partners and collaborators in geomatics and geosciences.</p>
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

          <h3>Sponsorship Packages</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Benefits</th>
                  {sponsorshipPackages.map((pkg) => (
                    <th key={pkg.name} className="text-center">
                      {pkg.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold">Contribution</td>
                  {sponsorshipPackages.map((pkg) => (
                    <td key={pkg.name} className="text-center">
                      {pkg.contribution}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td colSpan={5} className="pt-4 font-semibold">
                    Logo on
                  </td>
                </tr>
                <tr>
                  <td className="pl-4">Website</td>
                  {sponsorshipPackages.map((pkg) => (
                    <td key={pkg.name} className="text-center">
                      {pkg.logoOn.website}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="pl-4">Geolab*</td>
                  {sponsorshipPackages.map((pkg) => (
                    <td key={pkg.name} className="text-center">
                      {pkg.logoOn.geolab}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="pl-4">Other material</td>
                  {sponsorshipPackages.map((pkg) => (
                    <td key={pkg.name} className="text-center">
                      {pkg.logoOn.otherMaterial}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td colSpan={5} className="pt-4 font-semibold">
                    Vacancy posts on
                  </td>
                </tr>
                <tr>
                  <td className="pl-4">Website</td>
                  {sponsorshipPackages.map((pkg) => (
                    <td key={pkg.name} className="text-center">
                      {pkg.vacancyPosts.website}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="pl-4">Geolab</td>
                  {sponsorshipPackages.map((pkg) => (
                    <td key={pkg.name} className="text-center">
                      {pkg.vacancyPosts.geolab}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="pl-4">Social media</td>
                  {sponsorshipPackages.map((pkg) => (
                    <td key={pkg.name} className="text-center">
                      {pkg.vacancyPosts.socialMedia}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td colSpan={5} className="pt-4 font-semibold">
                    Promotional text on
                  </td>
                </tr>
                <tr>
                  <td className="pl-4">Website</td>
                  {sponsorshipPackages.map((pkg) => (
                    <td key={pkg.name} className="text-center">
                      {pkg.promotionalText.website}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="pl-4">Geolab</td>
                  {sponsorshipPackages.map((pkg) => (
                    <td key={pkg.name} className="text-center">
                      {pkg.promotionalText.geolab}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="pl-4">Social media</td>
                  {sponsorshipPackages.map((pkg) => (
                    <td key={pkg.name} className="text-center">
                      {pkg.promotionalText.socialMedia}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="pt-4 font-semibold">Events collab</td>
                  {sponsorshipPackages.map((pkg) => (
                    <td key={pkg.name} className="text-center">
                      {pkg.eventsCollab}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 space-x-4">
          <a
            href="https://www.figma.com/deck/8B3lAoguLeBv7Z97mQDBEM/GEOS_sponsor_deck?node-id=1-23&viewport=-72%2C-34%2C0.49&t=3c1Mppq02FWYQ07F-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-500 hover:bg-primary-600 inline-block rounded-md px-4 py-2 text-white no-underline transition-colors duration-200"
          >
            Learn More
          </a>
          <a href="mailto:geos@tudelft.nl" className="bg-primary-500 hover:bg-primary-600 inline-block rounded-md px-4 py-2 text-white no-underline transition-colors duration-200">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
