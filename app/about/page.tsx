import { Metadata } from 'next'
import BoardMembers from '@/components/BoardMembers'
import boardMembers from '@/data/boardMembers'
import PageHeader from '@/components/PageHeader'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'GEOS organizes events, provides study materials, and creates a community for students interested in geomatics and geosciences.',
}

export default function AboutPage() {
  return (
    <div className="divide-y divide-gray-200">
      <PageHeader title="About Us" description="We organize events, provide study materials, and create a community for students interested in geomatics and geosciences." />
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
