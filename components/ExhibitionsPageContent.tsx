// @ts-nocheck
'use client'

import type {Exhibition} from '@/types'
import Link from 'next/link'
import {useSearchParams} from 'next/navigation'
import React, {useEffect, useMemo, useState} from 'react'
import {WorksNavigation} from './WorksNavigation'

interface ExhibitionsPageContentProps {
  exhibitions: Exhibition[]
  marqueeText?: string
}

// Filter Component
interface FilterProps {
  years: string[]
  selectedFilter: string
  onFilterChange: (filter: string) => void
}

const Filter: React.FC<FilterProps> = ({years, selectedFilter, onFilterChange}) => {
  const handleCurrentClick = () => {
    if (selectedFilter === 'current') {
      onFilterChange('all')
    } else {
      onFilterChange('current')
    }
  }

  const handleSoloClick = () => {
    if (selectedFilter === 'solo') {
      onFilterChange('all')
    } else {
      onFilterChange('solo')
    }
  }

  const handleGroupClick = () => {
    if (selectedFilter === 'group') {
      onFilterChange('all')
    } else {
      onFilterChange('group')
    }
  }

  return (
    <div className="">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <button
          onClick={() => onFilterChange('all')}
          className={` ${selectedFilter === 'all' ? 'underline underline-offset-4' : ''} ${selectedFilter === 'all' ? '' : ''} hidden`}
        >
          All
        </button>
        <button
          onClick={handleCurrentClick}
          className={` ${selectedFilter === 'current' ? 'underline underline-offset-4' : ''} hover:underline hover:underline-offset-4`}
        >
          Current
        </button>
        <span className="text-white my-2"> / </span>
        <button
          onClick={() => onFilterChange('past')}
          className={` ${selectedFilter === 'past' ? 'underline underline-offset-4' : ''} hover:underline hover:underline-offset-4 hidden`}
        >
          Past
        </button>
        <button
          onClick={handleSoloClick}
          className={` ${selectedFilter === 'solo' ? 'underline underline-offset-4' : ''} hover:underline hover:underline-offset-4`}
        >
          Solo
        </button>
        <span className="text-white my-2"> / </span>
        <button
          onClick={handleGroupClick}
          className={` ${selectedFilter === 'group' ? 'underline underline-offset-4' : ''} hover:underline hover:underline-offset-4`}
        >
          Group
        </button>
        <span className="text-white my-2"> / </span>
        <span>Past exhibitions by year:</span>
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
                className={` ${selectedFilter === year ? 'underline underline-offset-4' : ''} hover:underline hover:underline-offset-4`}
              >
                {year}
              </button>
            )
          })}
      </div>
    </div>
  )
}

export const ExhibitionsPageContent: React.FC<ExhibitionsPageContentProps> = ({
  exhibitions,
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

  // Normalize exhibitionPhotos to always be an array
  const normalizedExhibitions = useMemo(() => {
    return exhibitions.map((exhibition) => ({
      ...exhibition,
      exhibitionPhotos: Array.isArray(exhibition.exhibitionPhotos)
        ? exhibition.exhibitionPhotos
        : exhibition.exhibitionPhotos
          ? [exhibition.exhibitionPhotos]
          : [],
    }))
  }, [exhibitions])

  // Get unique years from exhibitions, sorted in descending order
  const years = useMemo(() => {
    const uniqueYears = [
      ...new Set(
        normalizedExhibitions
          .map((exhibition) => {
            if (exhibition.date) {
              return new Date(exhibition.date).getFullYear().toString()
            }
            return null
          })
          .filter((year): year is string => year !== null),
      ),
    ]
    return ['all', ...uniqueYears.sort((a, b) => parseInt(b) - parseInt(a))]
  }, [normalizedExhibitions])

  // Filter exhibitions based on selected filter
  const filteredExhibitions = useMemo(() => {
    let filtered = normalizedExhibitions

    if (selectedFilter === 'current') {
      // Filter by isCurrent field (not by year)
      filtered = filtered.filter((exhibition) => {
        return exhibition.isCurrent === true
      })
    } else if (selectedFilter === 'past') {
      // Filter by isCurrent field being false
      filtered = filtered.filter((exhibition) => {
        return exhibition.isCurrent === false
      })
    } else if (selectedFilter === 'solo') {
      // Filter by isSolo field being true
      filtered = filtered.filter((exhibition) => {
        return exhibition.isSolo === true
      })
    } else if (selectedFilter === 'group') {
      // Filter by isSolo field being false or undefined (all non-solo exhibitions)
      filtered = filtered.filter((exhibition) => {
        return exhibition.isSolo !== true
      })
    } else if (selectedFilter !== 'all') {
      // Filter by specific year
      filtered = filtered.filter((exhibition) => {
        if (exhibition.date) {
          return new Date(exhibition.date).getFullYear().toString() === selectedFilter
        }
        return false
      })
    }

    return filtered
  }, [normalizedExhibitions, selectedFilter])

  // Group exhibitions by year for display
  const exhibitionsByYear = useMemo(() => {
    const grouped = filteredExhibitions.reduce(
      (acc, exhibition) => {
        const year = exhibition.date
          ? new Date(exhibition.date).getFullYear().toString()
          : 'Unknown'
        if (!acc[year]) {
          acc[year] = []
        }
        acc[year].push(exhibition)
        return acc
      },
      {} as Record<string, Exhibition[]>,
    )

    // Sort years in descending order
    return Object.entries(grouped).sort(([a], [b]) => parseInt(b) - parseInt(a))
  }, [filteredExhibitions])

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
          <div className="flex flex-row justify-start">
            {/* Exhibitions */}
            <div className="w-full lg:w-1/2 ">
              <div>
                <Filter
                  years={years}
                  selectedFilter={selectedFilter}
                  onFilterChange={setSelectedFilter}
                />
              </div>
              {selectedFilter === 'all' ||
              selectedFilter === 'current' ||
              selectedFilter === 'past' ||
              selectedFilter === 'solo' ||
              selectedFilter === 'group' ? (
                // Single list for all exhibitions, current exhibitions, past exhibitions, solo exhibitions, or group exhibitions
                <div className="">
                  {/* All/Current/Past Exhibitions List */}
                  <div className="flex flex-col border-b border-white ">
                    {filteredExhibitions.map((exhibition, index) => (
                      <div
                        key={exhibition._id}
                        className={`${index > 0 ? '' : ''}  border-t border-white `}
                      >
                        <Link
                          href={exhibition.slug ? `/exhibitions/${exhibition.slug}` : '#'}
                          className="block"
                        >
                          <div className="flex flex-col py-1 hover:italic">
                            <div className="flex flex-row justify-between">
                              <h3 className="">{exhibition.title || 'Untitled'}</h3>
                              {exhibition.date && <p className="">{formatDate(exhibition.date)}</p>}
                            </div>
                            <div className="flex flex-row justify-between">
                              {exhibition.location && <p className="">{exhibition.location}</p>}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Grouped by year when a specific year is selected
                exhibitionsByYear
                  .filter(([year]) => year === selectedFilter)
                  .map(([year, yearExhibitions]) => (
                    <div key={year} className="">
                      {/* Year Header */}
                      <div className="border-b border-white hidden">
                        <h2 className="">{year}</h2>
                        <p className="">
                          {yearExhibitions.length} exhibition
                          {yearExhibitions.length !== 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Exhibitions List */}
                      <div className="flex flex-col border-b border-white">
                        {yearExhibitions.map((exhibition, index) => (
                          <div
                            key={exhibition._id}
                            className={`${index > 0 ? '' : ''} border-t border-white py-1`}
                          >
                            <Link
                              href={exhibition.slug ? `/exhibitions/${exhibition.slug}` : '#'}
                              className="block"
                            >
                              <div className="flex flex-col ">
                                <div className="flex flex-row justify-between">
                                  <h3 className="">{exhibition.title || 'Untitled'}</h3>
                                  {exhibition.date && (
                                    <p className="">{formatDate(exhibition.date)}</p>
                                  )}
                                </div>
                                <div className="flex flex-row justify-between">
                                  {exhibition.location && <p className="">{exhibition.location}</p>}
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

            <div></div>
          </div>

          {/* No exhibitions message */}
          {filteredExhibitions.length === 0 && (
            <div className="text-center   ">
              <p className="">
                No exhibitions found for{' '}
                {selectedFilter === 'current'
                  ? 'current exhibitions'
                  : selectedFilter === 'past'
                    ? 'past exhibitions'
                    : selectedFilter === 'solo'
                      ? 'solo exhibitions'
                      : selectedFilter === 'group'
                        ? 'group exhibitions'
                        : selectedFilter !== 'all'
                          ? `year ${selectedFilter}`
                          : 'the selected filters'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
