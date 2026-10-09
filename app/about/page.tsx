import { Metadata } from 'next'
import BoardMembers from '@/components/BoardMembers'
import boardMembers from '@/data/boardMembers'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'GEOS organizes events, provides study materials, and creates a community for students interested in geomatics and geosciences.',
}

export default function AboutPage() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">About Us</h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          {/* Learn more about our organization, our mission, and the team behind our work. */}
          We organize events, provide study materials, and create a community for students interested in geomatics and geosciences.
        </p>
      </div>
      <div className="container py-12">
        <div className="space-y-16">
          {boardMembers.map((boardYear, index) => (
            <BoardMembers key={index} boardYear={boardYear} />
          ))}
        </div>
      </div>
    </div>
  )
}
