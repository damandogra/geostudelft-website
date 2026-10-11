import siteMetadata from '@/data/siteMetadata'
import Image from 'next/image'
import Link from './Link'
import MobileNav from './MobileNav'
import NavLinks from './NavLinks'

const Header = () => {
  let headerClass = 'flex items-center w-full bg-white justify-between gap-4 py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={`${siteMetadata.headerTitle} home`} className="shrink-0">
        <Image src="/images/geos_logo_text.webp" alt="" height={60} width={160} priority />
      </Link>
      {/* Inline links from md (768px) up; below that the menu button opens MobileNav */}
      <nav aria-label="Main" className="flex items-center gap-x-5 lg:gap-x-7">
        <NavLinks />
        <a href={`mailto:${siteMetadata.email}`} className="btn-primary px-4 py-2 text-sm whitespace-nowrap">
          Contact Us
        </a>
        <MobileNav />
      </nav>
    </header>
  )
}

export default Header
