'use client'

import { usePathname } from 'next/navigation'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'

// A section counts as current on its own pages too, e.g. /events/kick-off marks Events
export function isCurrentPath(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
}

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <ul className="hidden items-center gap-x-5 md:flex lg:gap-x-7">
      {headerNavLinks
        .filter((link) => link.href !== '/')
        .map((link) => {
          const current = isCurrentPath(pathname, link.href)
          return (
            <li key={link.title}>
              <Link
                href={link.href}
                aria-current={current ? 'page' : undefined}
                className={`hover:text-primary-700 border-b-2 py-1 font-medium transition-colors ${current ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-900'}`}
              >
                {link.title}
              </Link>
            </li>
          )
        })}
    </ul>
  )
}
