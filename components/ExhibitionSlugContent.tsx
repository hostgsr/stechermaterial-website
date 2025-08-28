// @ts-nocheck
'use client'

import {Header} from '@/components/Header'
import ImageComponent from '@/components/ImageComponent'
import {motion} from 'framer-motion'
import Link from 'next/link'
import type {PathSegment} from 'sanity'
import {WorksNavigation} from './WorksNavigation'

interface ExhibitionSlugContentProps {
  data: {
    _id?: string | null
    _type?: string | null
    title?: string | null
    slug?: string | null
    date?: string | null
    endDate?: string | null
    shortDescription?: string | null
    description?: string | null
    location?: string | null
    photoCredits?: string | null
    assignedWorks?: Array<{
      _id: string
      title: string | null
      slug: string | null
      images: any[] | null
      year: string | null
      classification: string | null
    }> | null
    exhibitionPhotos?: any[] | null
  }
  marqueeText?: string
}

export default function ExhibitionSlugContent({data, marqueeText}: ExhibitionSlugContentProps) {
  const {
    title,
    date,
    endDate,
    shortDescription,
    description,
    location,
    photoCredits,
    assignedWorks,
    exhibitionPhotos,
  } = data

  // Normalize exhibitionPhotos to always be an array
  const normalizedExhibitionPhotos = Array.isArray(exhibitionPhotos)
    ? exhibitionPhotos
    : exhibitionPhotos
      ? [exhibitionPhotos]
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
              {date && (
                <p>
                  {formatDate(date)}
                  {endDate && ` - ${formatDate(endDate)}`}
                </p>
              )}

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

              {/* Assigned Works */}
              {normalizedAssignedWorks.length > 0 && (
                <div className="mt-5">
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

            {/* Images - Right Column */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-2 pb-20 ">
              {normalizedExhibitionPhotos.length > 0 ? (
                normalizedExhibitionPhotos.map((photo: any, index: number) => (
                  <div
                    className={`${index % 4 === 0 ? 'col-span-2' : index % 4 === 3 ? 'col-span-2' : ''}`}
                    key={index}
                  >
                    <ImageComponent image={photo} placeholderSrc={photo} classname="" />
                  </div>
                ))
              ) : (
                <div>
                  <span>No Exhibition Photos Available</span>
                </div>
              )}

              {/* Photo Credits */}
              {photoCredits && (
                <div className="col-span-2 mt-2 ">
                  <p>Photo Credits: {photoCredits}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
