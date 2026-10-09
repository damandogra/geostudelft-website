import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="rounded-lg bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-8 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* GEOS Address */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">GEOS</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Julianalaan 132-134</p>
              <p>2628BL, Delft</p>
              <p>Zuid Holland, Nederland</p>
            </div>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex space-x-2">
                <div>© {siteMetadata.author}</div>
                <div>{`${new Date().getFullYear()}`}</div>
              </div>
            </div>
          </div>

          {/* Follow */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Get in touch</h3>
            <div className="flex space-x-4">
              <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
              <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={5} />
              <SocialIcon kind="instagram" href={siteMetadata.instagram} size={5} />
            </div>
          </div>

          {/* Map */}
          <div className="md:col-span-2">
            {/* <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Location</h3> */}
            <div className="h-60 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
              <iframe
                width="100%"
                height="100%"
                src="https://www.openstreetmap.org/export/embed.html?bbox=4.3668454,52.003677,4.3748454,52.007677&layer=mapnik&marker=52.005677,4.3708454"
                title="GEOS Location Map"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
