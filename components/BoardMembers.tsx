'use client'

import Image from 'next/image'
import { BoardYear } from '@/data/boardMembers'
import { useState } from 'react'

interface BoardMembersProps {
  boardYear: BoardYear
}

export default function BoardMembers({ boardYear }: BoardMembersProps) {
  const [groupPhotoError, setGroupPhotoError] = useState(false)
  const [groupPhotoFallbackError, setGroupPhotoFallbackError] = useState(false)
  const [memberPhotoErrors, setMemberPhotoErrors] = useState<{ [key: string]: boolean }>({})

  const handleGroupPhotoError = () => {
    setGroupPhotoError(true)
  }

  const handleGroupPhotoFallbackError = () => {
    setGroupPhotoFallbackError(true)
  }

  const handleMemberPhotoError = (memberName: string) => {
    setMemberPhotoErrors((prev) => ({ ...prev, [memberName]: true }))
  }

  return (
    <div className="mb-16">
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Board of {boardYear.year}</h2>
        <p className="text-gray-600 dark:text-gray-400">
          The board of {boardYear.year} was installed on {boardYear.installationDate}.
        </p>
      </div>

      {/* Group Photo */}
      {boardYear.groupPhotoName && (
        <div className="mb-8">
          <div className="relative w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
            {!groupPhotoError ? (
              <Image src={`/images/board/${boardYear.groupPhotoName}`} alt={`Board members ${boardYear.year}`} width={1200} height={800} className="h-auto w-full" onError={handleGroupPhotoError} />
            ) : !groupPhotoFallbackError ? (
              <Image
                src="/images/board/groupfoto_fallback.jpg"
                alt={`Board members ${boardYear.year} (fallback)`}
                width={1200}
                height={800}
                className="h-auto w-full"
                onError={handleGroupPhotoFallbackError}
              />
            ) : (
              <div className="flex h-48 items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <div className="mb-2 text-4xl">📸</div>
                  <div>Group photo coming soon</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Individual Members */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {boardYear.members.map((member, index) => (
          <div key={index} className={`overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800 ${memberPhotoErrors[member.name] ? 'h-32' : ''}`}>
            {!memberPhotoErrors[member.name] ? (
              <>
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  <Image src={`/images/board/${member.imageName}`} alt={member.name} fill className="object-cover" onError={() => handleMemberPhotoError(member.name)} />
                </div>
                <div className="p-4">
                  <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-4 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{member.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{member.role}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
