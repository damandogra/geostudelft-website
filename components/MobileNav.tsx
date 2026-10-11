'use client'

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from './Link'
import { isCurrentPath } from './NavLinks'
import headerNavLinks from '@/data/headerNavLinks'

// Headless UI's Dialog locks page scroll and traps focus while open, so no scroll-lock library is needed
const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)
  const pathname = usePathname()

  const closeNav = () => setNavShow(false)

  return (
    <>
      <button type="button" aria-label="Open menu" aria-expanded={navShow} onClick={() => setNavShow(true)} className="hover:text-primary-700 rounded text-gray-900 md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-8 w-8">
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <Transition appear show={navShow} as={Fragment} unmount={false}>
        <Dialog as="div" onClose={closeNav} unmount={false}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            unmount={false}
          >
            <div className="fixed inset-0 z-60 bg-black/25" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="transition ease-in duration-200 transform"
            leaveFrom="translate-x-0 opacity-100"
            leaveTo="translate-x-full opacity-0"
            unmount={false}
          >
            <DialogPanel className="fixed top-0 left-0 z-70 h-full w-full bg-white">
              <DialogTitle className="sr-only">Menu</DialogTitle>
              <nav aria-label="Main" className="mt-8 flex h-full basis-0 flex-col items-start overflow-y-auto pt-2 pl-12 text-left">
                {headerNavLinks.map((link) => {
                  const current = isCurrentPath(pathname, link.href)
                  return (
                    <Link
                      key={link.title}
                      href={link.href}
                      aria-current={current ? 'page' : undefined}
                      className={`hover:text-primary-700 mb-4 py-2 pr-4 text-2xl font-bold tracking-widest ${current ? 'text-primary-700 underline decoration-2 underline-offset-8' : 'text-gray-900'}`}
                      onClick={closeNav}
                    >
                      {link.title}
                    </Link>
                  )
                })}
              </nav>

              <button type="button" className="hover:text-primary-700 fixed top-7 right-4 z-80 h-16 w-16 rounded p-4 text-gray-900" aria-label="Close menu" onClick={closeNav}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileNav
