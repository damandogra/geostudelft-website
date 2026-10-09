import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Image from 'next/image'
import Link from './Link'
import MobileNav from './MobileNav'

const Header = () => {
  let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            <Image src="/images/geos_logo_text.webp" alt="GEOS Logo" height={60} width={160} />
          </div>
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link key={link.title} href={link.href} className="hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-gray-900 dark:text-gray-100">
                {link.title}
              </Link>
            ))}
        </div>
        <a href="mailto:geos@tudelft.nl" className="bg-primary-500 hover:bg-primary-600 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors">
          Contact Us
        </a>
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
