// @ts-nocheck
'use client'

import {Header} from '@/components/Header'
import ImageComponent from '@/components/ImageComponent'
import {motion} from 'framer-motion'
import Link from 'next/link'
import type {PathSegment} from 'sanity'
import {WorksNavigation} from './WorksNavigation'

interface CollectionSlugContentProps {
  data: {
    _id?: string | null
    _type?: string | null
    title?: string | null
    slug?: string | null
    date?: string | null
    isPrivate?: boolean
    shortDescription?: string | null
    description?: string | null
    location?: string | null
    assignedWorks?: Array<{
      _id: string
      title: string | null
      slug: string | null
      images: any[] | null
      year: string | null
      classification: string | null
    }> | null
    collectionPhotos?: any[] | null
  }
  marqueeText?: string
}

export default function CollectionSlugContent({data, marqueeText}: CollectionSlugContentProps) {
  const {
    title,
    date,
    endDate,
    shortDescription,
    description,
    location,
    assignedWorks,
    collectionPhotos,
  } = data

  // Debug statements removed to prevent ISR write issues

  // Normalize collectionPhotos to always be an array
  const normalizedCollectionPhotos = Array.isArray(collectionPhotos)
    ? collectionPhotos
    : collectionPhotos
      ? [collectionPhotos]
      : []

  // Normalize assignedWorks.images to always be arrays
  const normalizedAssignedWorks = (assignedWorks || []).map((work) => ({
    ...work,
    images: Array.isArray(work.images) ? work.images : work.images ? [work.images] : [],
  }))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <>
      <WorksNavigation marqueeText={marqueeText} />
      <div className=" px-5 mt-10 lg:px-10">
        <div>
          <div className="flex flex-col lg:grid gap-5 lg:grid-cols-2">
            {/* Text Information - Left Column */}
            <div>
              {title && (
                <div>
                  <p>{title}</p>
                </div>
              )}
              {/* {date && <p>{formatDate(date)}</p>}
              {endDate && <p> - {formatDate(endDate)}</p>} */}

              {/* {shortDescription && (
              <div>
                <h3>Short Description</h3>
                <p>{shortDescription}</p>
              </div>
            )} */}

              {description && (
                <div className="my-4">
                  {(() => {
                    const processedHtml = description
                      .replace(/\n/g, '<br>')
                      .replace(/&lt;br&gt;/g, '<br>')
                    // Console.log removed to prevent ISR write issues
                    return (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: processedHtml,
                        }}
                      />
                    )
                  })()}
                </div>
              )}

              {location && (
                <div>
                  <p>{location}</p>
                </div>
              )}
            </div>

            {/* Images - Right Column */}
            {/* <div className="flex flex-col lg:grid lg:grid-cols-2 gap-2 pb-20 lg:max-h-[90vh] lg:overflow-y-scroll">
              {normalizedCollectionPhotos.length > 0 ? (
                normalizedCollectionPhotos.map((photo: any, index: number) => (
                  <div
                    className={`${index % 4 === 0 ? 'col-span-2' : index % 4 === 3 ? 'col-span-2' : ''}`}
                    key={index}
                  >
                    <ImageComponent image={photo} placeholderSrc={photo} classname="" />
                  </div>
                ))
              ) : (
                <div>
                  <span>No Collection Photos Available</span>
                </div>
              )}
            </div> */}
            {/* Assigned Works */}
            {normalizedAssignedWorks.length > 0 && (
              <div className="">
                <h3 className="mb-2">Featured Works</h3>
                <div className="border-b border-white">
                  {normalizedAssignedWorks.map((work) => (
                    <Link key={work._id} href={work.slug ? `/works/${work.slug}` : '#'}>
                      {/* <div >
                        {work.images && work.images.length > 0 ? (
                          <ImageComponent
                            image={work.images[0]}
                            placeholderSrc={work.images[0]}
                            classname=""
                          />
                        ) : (
                          <div>
                            <span>No Image</span>
                          </div>
                        )}
                      </div> */}
                      <div className="border-t border-white">
                        <h4>{work.title || 'Untitled'}</h4>
                        {work.year && <p>{work.year}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
