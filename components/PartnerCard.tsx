'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Partner } from '@/data/partnersData'

interface PartnerCardProps {
  partner: Partner
}

export default function PartnerCard({ partner }: PartnerCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className="card transition-shadow hover:shadow-md">
      <a href={partner.website} target="_blank" rel="noopener noreferrer" className="flex h-48 flex-col hover:bg-gray-50">
        <div className="flex h-28 w-full items-center justify-center bg-white p-3">
          {!imageError ? (
            <Image src={partner.logo} alt={`${partner.name} logo`} width={160} height={120} className="max-h-20 max-w-40 object-contain" onError={handleImageError} />
          ) : (
            <div className="flex h-20 w-40 items-center justify-center text-gray-500">
              <span className="text-3xl font-semibold">{partner.name.charAt(0)}</span>
            </div>
          )}
        </div>
        <div className="flex h-20 items-center justify-between px-4 py-2">
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-gray-900">{partner.name}</h2>
            {partner.description && <p className="text-xs text-gray-600">{partner.description}</p>}
          </div>
          <div className="ml-2 flex-shrink-0">
            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
      </a>
    </div>
  )
}
