// @ts-nocheck
'use client'

import {dataset, projectId} from '@/sanity/lib/api'
import {urlForImage} from '@/sanity/lib/utils'
import type {Publication} from '@/types'
import type {PortableTextBlock} from 'next-sanity'
import Image from 'next/image'
import React, {useMemo, useState} from 'react'
import {CustomPortableText} from './CustomPortableText'
import {WorksNavigation} from './WorksNavigation'

interface PublicationContentPageProps {
  publications: Publication[]
  publicationText?: PortableTextBlock[]
  marqueeText?: string
}

export const PublicationContentPage: React.FC<PublicationContentPageProps> = ({
  publications,
  publicationText,
  marqueeText,
}) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  // Get unique publication types
  const allPublicationTypes = useMemo(() => {
    const types = new Set<string>()
    publications.forEach((pub) => {
      if (pub.publicationTypes) {
        pub.publicationTypes.forEach((type) => types.add(type))
      }
    })
    return Array.from(types).sort()
  }, [publications])

  // Filter publications based on selected types
  const filteredPublications = useMemo(() => {
    if (selectedTypes.length === 0) {
      return publications
    }
    return publications.filter((pub) =>
      pub.publicationTypes?.some((type) => selectedTypes.includes(type)),
    )
  }, [publications, selectedTypes])

  // Use filtered publications directly to maintain original order
  const publicationsToDisplay = useMemo(() => {
    return filteredPublications
  }, [filteredPublications])

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }

  const handlePublicationClick = (publication: Publication) => {
    if (publication.link) {
      window.open(publication.link, '_blank')
    } else if (publication.file?.asset?._ref) {
      // Construct Sanity file URL and open in new tab
      const assetRef = publication.file.asset._ref
      const fileUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetRef.replace('file-', '').replace('-', '.')}`
      window.open(fileUrl, '_blank')
    }
  }

  return (
    <>
      <WorksNavigation marqueeText={marqueeText} />
      <div className="min-h-screen bg-black text-white lg:px-10 px-5">
        <div className="">
          {/* Header */}
          <div className=""></div>
          <div className="flex lg:flex-row flex-col justify-end mt-5">
            <div className="w-full lg:w-1/2">
              {publicationText && publicationText.length > 0 && (
                <div className="mb-8">
                  <CustomPortableText value={publicationText} />
                </div>
              )}
            </div>
            {/* Publications */}
            <div className="w-full lg:w-1/2">
              {/* Type Filter */}
              <div className="mb-6">
                <div className="flex flex-wrap ">
                  {allPublicationTypes.map((type, index) => (
                    <label key={type} className="">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeToggle(type)}
                        className="hidden"
                      />
                      <span
                        className={`${selectedTypes.includes(type) ? 'underline underline-offset-4' : ''}`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                      {index < allPublicationTypes.length - 1 && <span className="mx-2">/</span>}
                    </label>
                  ))}
                  {/* {selectedTypes.length > 0 && (
                    <button
                      onClick={() => setSelectedTypes([])}
                      className="px-4 py-2 text-sm border border-gray-600 text-gray-300 rounded-full transition-colors hover:border-white hover:text-white"
                    >
                      Clear All
                    </button>
                  )} */}
                </div>
              </div>

              {/* Publications List */}
              <div className="">
                <div className="flex flex-col">
                  {publicationsToDisplay.map((publication, index) => (
                    <div
                      key={publication._key || index}
                      className={`${index > 0 ? '' : ''} border-t border-white py-4`}
                    >
                      <div
                        className={`block ${publication.link || publication.file ? 'cursor-pointer hover:opacity-80' : ''}`}
                        onClick={() =>
                          (publication.link || publication.file) &&
                          handlePublicationClick(publication)
                        }
                      >
                        <div className="flex flex-col lg:flex-row gap-4">
                          {/* Publication Image */}
                          {publication.image && (
                            <div className="lg:w-1/3">
                              <Image
                                src={urlForImage(publication.image)?.url() || ''}
                                alt={publication.title || 'Publication'}
                                width={400}
                                height={300}
                                className="w-full h-48 object-cover"
                              />
                            </div>
                          )}

                          {/* Publication Details */}
                          <div className={`flex-1 ${publication.image ? 'lg:w-2/3' : 'w-full'}`}>
                            <div className="flex flex-col">
                              <div className="flex flex-col">
                                <h3 className="text-lg font-medium">
                                  {publication.title || 'Untitled'}
                                </h3>
                                {publication.year && <p className="  mt-2">{publication.year}</p>}
                                {/* {(publication.link || publication.file) && (
                                  <span className="text-sm text-blue-400">
                                    {publication.link ? 'View →' : 'Download →'}
                                  </span>
                                )} */}
                              </div>
                              {/* {publication.publicationTypes &&
                                publication.publicationTypes.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {publication.publicationTypes.map((type, typeIndex) => (
                                      <span
                                        key={typeIndex}
                                        className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded"
                                      >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                      </span>
                                    ))}
                                  </div>
                                )} */}
                              {publication.description && (
                                <p className="  mt-2">{publication.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* No publications message */}
          {publications.length === 0 && (
            <div className="text-center">
              <p className="text-gray-400">No publications found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
