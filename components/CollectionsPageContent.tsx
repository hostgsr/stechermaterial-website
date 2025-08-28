// @ts-nocheck
'use client'

import type {Collection} from '@/types'
import Link from 'next/link'
import {useSearchParams} from 'next/navigation'
import React, {useEffect, useMemo, useState} from 'react'
import {WorksNavigation} from './WorksNavigation'

interface CollectionsPageContentProps {
  collections: Collection[]
  marqueeText?: string
}

// Filter Component
interface FilterProps {
  years: string[]
  selectedFilter: string
  onFilterChange: (filter: string) => void
}

const Filter: React.FC<FilterProps> = ({years, selectedFilter, onFilterChange}) => {
  return (
    <div className="">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <button
          onClick={() => onFilterChange('all')}
          className={` ${selectedFilter === 'all' ? 'underline underline-offset-4' : ''}`}
        >
          All
        </button>
        <span>Collections by year:</span>
        {years
          .filter((year) => year !== 'all')
          .map((year) => {
            const handleYearClick = () => {
              if (selectedFilter === year) {
                onFilterChange('all')
              } else {
                onFilterChange(year)
              }
            }

            return (
              <button
                key={year}
                onClick={handleYearClick}
                className={` ${selectedFilter === year ? 'underline underline-offset-4' : ''}`}
              >
                {year}
              </button>
            )
          })}
      </div>
    </div>
  )
}

export const CollectionsPageContent: React.FC<CollectionsPageContentProps> = ({
  collections,
  marqueeText,
}) => {
  const searchParams = useSearchParams()
  const [selectedFilter, setSelectedFilter] = useState<string>('all')

  // Handle URL parameters on component mount
  useEffect(() => {
    const yearParam = searchParams.get('year')
    if (yearParam) {
      setSelectedFilter(yearParam)
    }
  }, [searchParams])

  // Normalize collectionPhotos to always be an array
  const normalizedCollections = useMemo(() => {
    return collections.map((collection) => ({
      ...collection,
      collectionPhotos: Array.isArray(collection.collectionPhotos)
        ? collection.collectionPhotos
        : collection.collectionPhotos
          ? [collection.collectionPhotos]
          : [],
    }))
  }, [collections])

  // Get unique years from collections, sorted in descending order
  const years = useMemo(() => {
    const uniqueYears = [
      ...new Set(
        normalizedCollections
          .map((collection) => {
            if (collection.date) {
              return new Date(collection.date).getFullYear().toString()
            }
            return null
          })
          .filter((year): year is string => year !== null),
      ),
    ]
    return ['all', ...uniqueYears.sort((a, b) => parseInt(b) - parseInt(a))]
  }, [normalizedCollections])

  // Filter collections based on selected filter
  const filteredCollections = useMemo(() => {
    let filtered = normalizedCollections

    if (selectedFilter === 'all') {
      // No filtering needed
    } else {
      // Filter by specific year
      filtered = filtered.filter((collection) => {
        if (collection.date) {
          return new Date(collection.date).getFullYear().toString() === selectedFilter
        }
        return false
      })
    }

    // Sort collections alphabetically by title
    return filtered.sort((a, b) => {
      const titleA = (a.title || 'Untitled').toLowerCase()
      const titleB = (b.title || 'Untitled').toLowerCase()
      return titleA.localeCompare(titleB)
    })
  }, [normalizedCollections, selectedFilter])

  // Group collections by year for display
  const collectionsByYear = useMemo(() => {
    const grouped = filteredCollections.reduce(
      (acc, collection) => {
        const year = collection.date
          ? new Date(collection.date).getFullYear().toString()
          : 'Unknown'
        if (!acc[year]) {
          acc[year] = []
        }
        acc[year].push(collection)
        return acc
      },
      {} as Record<string, Collection[]>,
    )

    // Sort years in descending order
    return Object.entries(grouped).sort(([a], [b]) => parseInt(b) - parseInt(a))
  }, [filteredCollections])

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
      <div className="min-h-screen bg-black text-white lg:px-10 px-5 ">
        <div className="">
          {/* Header */}
          <div className=""></div>
          <div className="flex flex-row justify-start ">
            {/* Collections */}
            <div className="w-full lg:w-1/2 ">
              <div className="hidden">
                <Filter
                  years={years}
                  selectedFilter={selectedFilter}
                  onFilterChange={setSelectedFilter}
                />
              </div>
              {selectedFilter === 'all' ? (
                // Single list for all collections
                <div className="border-b border-white mt-5">
                  {/* All Collections List */}
                  <div className="flex flex-col border-b border-white">
                    {filteredCollections.map((collection, index) => (
                      <div
                        key={collection._id}
                        className={`${index > 0 ? 'border-t border-white' : ''}  `}
                      >
                        <Link
                          href={collection.slug ? `/collections/${collection.slug}` : '#'}
                          className="block"
                        >
                          <div className="flex flex-col  py-1 hover:italic ">
                            <div className="flex flex-row justify-between">
                              <h3 className="">{collection.title || 'Untitled'}</h3>
                              {collection.date && (
                                <p className="hidden">{formatDate(collection.date)}</p>
                              )}
                            </div>
                            <div className="flex flex-row justify-between">
                              {collection.location && <p className="">{collection.location}</p>}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Grouped by year when a specific year is selected
                collectionsByYear
                  .filter(([year]) => year === selectedFilter)
                  .map(([year, yearCollections]) => (
                    <div key={year} className="">
                      {/* Year Header */}
                      <div className="border-b border-white hidden">
                        <h2 className="">{year}</h2>
                        <p className="">
                          {yearCollections.length} collection
                          {yearCollections.length !== 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Collections List */}
                      <div className="flex flex-col">
                        {yearCollections.map((collection, index) => (
                          <div
                            key={collection._id}
                            className={`${index > 0 ? 'border-t border-white' : ''} `}
                          >
                            <Link
                              href={collection.slug ? `/collections/${collection.slug}` : '#'}
                              className="block"
                            >
                              <div className="flex flex-col ">
                                <div className="flex flex-row justify-between">
                                  <h3 className="">{collection.title || 'Untitled'}</h3>
                                  {collection.date && (
                                    <p className="">{formatDate(collection.date)}</p>
                                  )}
                                </div>
                                <div className="flex flex-row justify-between">
                                  {collection.location && <p className="">{collection.location}</p>}
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* No collections message */}
          {filteredCollections.length === 0 && (
            <div className="text-center   ">
              <p className="">
                No collections found for{' '}
                {selectedFilter !== 'all' ? `year ${selectedFilter}` : 'the selected filters'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
