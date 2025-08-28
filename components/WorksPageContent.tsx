// @ts-nocheck
'use client'

import {motion} from 'framer-motion'
import Link from 'next/link'
import {useRouter, useSearchParams} from 'next/navigation'
import React, {useEffect, useMemo, useRef, useState} from 'react'
import ImageComponent from './ImageComponent'
import {WorksNavigation} from './WorksNavigation'

interface Work {
  _id: string
  _type: string
  title: string
  slug: string
  images: any[] // This is now an array of images
  year: string
  classification: string
  size: string
  location: string
}

interface WorksData {
  works2018?: Work[]
  works2019?: Work[]
  works2020?: Work[]
  works2021?: Work[]
  works2022?: Work[]
  works2023?: Work[]
  works2024?: Work[]
  works2025?: Work[]
  objectImagesWorks?: Work[]
  paintingsWorks?: Work[]
  drawingsWorks?: Work[]
  sculpturesWorks?: Work[]
}

interface WorksPageContentProps {
  worksData: WorksData
  marqueeText?: string
}

// Type Filter Component
interface TypeFilterProps {
  classifications: string[]
  selectedClassification: string
  onClassificationChange: (classification: string) => void
}

const TypeFilter: React.FC<TypeFilterProps> = ({
  classifications,
  selectedClassification,
  onClassificationChange,
}) => {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center">
        {classifications.map((classification, index) => (
          <React.Fragment key={classification}>
            <button
              onClick={() => onClassificationChange(classification)}
              className={`${selectedClassification === classification ? 'underline underline-offset-4  ' : ''} `}
            >
              {classification === 'all'
                ? 'All'
                : classification === 'object-images' || classification === 'objectimages'
                  ? 'Object Images'
                  : classification.charAt(0).toUpperCase() + classification.slice(1)}
            </button>
            {index < classifications.length - 1 && <span className="mx-2">/</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// Year Filter Component
interface YearFilterProps {
  years: string[]
  selectedYear: string
  onYearChange: (year: string) => void
}

const YearFilter: React.FC<YearFilterProps> = ({years, selectedYear, onYearChange}) => {
  return (
    <div className="">
      <div className="flex flex-wrap items-center">
        {years.map((year, index) => (
          <React.Fragment key={year}>
            <button
              onClick={() => onYearChange(year)}
              className={`${selectedYear === year ? 'underline underline-offset-4' : ''} `}
            >
              {year === 'all' ? 'All Years' : year}
            </button>
            {index < years.length - 1 && <span className="mx-2">/</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// View Filter Component
interface ViewFilterProps {
  selectedView: string
  onViewChange: (view: string) => void
}

const ViewFilter: React.FC<ViewFilterProps> = ({selectedView, onViewChange}) => {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center">
        <button
          onClick={() => onViewChange('grid')}
          className={`${selectedView === 'grid' ? 'underline underline-offset-4' : ''} `}
        >
          Grid
        </button>
        <span className="mx-2">/</span>
        <button
          onClick={() => onViewChange('list')}
          className={`${selectedView === 'list' ? 'underline underline-offset-4' : ''} `}
        >
          List
        </button>
      </div>
    </div>
  )
}

export const WorksPageContent: React.FC<WorksPageContentProps> = ({worksData, marqueeText}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedClassification, setSelectedClassification] = useState<string>('all')
  const [selectedView, setSelectedView] = useState<string>('grid')
  const [showScrollHint, setShowScrollHint] = useState<boolean>(true)
  const allWorksScrollRef = useRef<HTMLDivElement>(null)
  const yearWorksScrollRef = useRef<HTMLDivElement>(null)

  // Initialize filter state from URL parameters
  useEffect(() => {
    const yearParam = searchParams.get('year')
    const classificationParam = searchParams.get('classification')
    const filterParam = searchParams.get('filter')
    const viewParam = searchParams.get('view')

    if (yearParam) {
      setSelectedYear(yearParam)
    } else {
      setSelectedYear('all')
    }

    // Prioritize classification param over filter param to avoid conflicts
    if (classificationParam) {
      setSelectedClassification(classificationParam)
    } else if (filterParam) {
      setSelectedClassification(filterParam)
    } else {
      setSelectedClassification('all')
    }

    if (viewParam) {
      setSelectedView(viewParam)
    } else {
      setSelectedView('grid')
    }
  }, [searchParams])

  // Show scroll hint animation on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollHint(false)
    }, 2000) // Remove the hint after 2 seconds

    return () => clearTimeout(timer)
  }, [])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (selectedYear !== 'all') {
      params.set('year', selectedYear)
    } else {
      params.delete('year')
    }

    if (selectedClassification !== 'all') {
      params.set('classification', selectedClassification)
    } else {
      params.delete('classification')
    }

    if (selectedView !== 'grid') {
      params.set('view', selectedView)
    } else {
      params.delete('view')
    }

    // Also clear the old 'filter' parameter to prevent conflicts
    params.delete('filter')

    // Update URL without page reload
    router.replace(`/works?${params.toString()}`, {scroll: false})
  }, [selectedYear, selectedClassification, selectedView, router, searchParams])

  // Save scroll position when user scrolls
  useEffect(() => {
    const scrollContainer =
      selectedYear === 'all' ? allWorksScrollRef.current : yearWorksScrollRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      const scrollKey = `works-scroll-${selectedYear}-${selectedClassification}`
      sessionStorage.setItem(scrollKey, scrollContainer.scrollLeft.toString())
    }

    scrollContainer.addEventListener('scroll', handleScroll)
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [selectedYear, selectedClassification])

  // Restore scroll position when filters change or component mounts
  useEffect(() => {
    const scrollContainer =
      selectedYear === 'all' ? allWorksScrollRef.current : yearWorksScrollRef.current
    if (!scrollContainer) return

    const scrollKey = `works-scroll-${selectedYear}-${selectedClassification}`
    const savedScrollPosition = sessionStorage.getItem(scrollKey)

    if (savedScrollPosition) {
      // Use requestAnimationFrame to ensure the DOM is ready
      requestAnimationFrame(() => {
        scrollContainer.scrollLeft = parseInt(savedScrollPosition)
      })
    } else {
      // If no saved position, scroll to start
      scrollContainer.scrollLeft = 0
    }
  }, [selectedYear, selectedClassification])

  // Process works data to create a flat array and organize by year/type
  const processedWorks = useMemo(() => {
    const allWorks: Work[] = []
    const worksByYear: Record<string, Work[]> = {}
    const worksByType: Record<string, Work[]> = {}
    const seenWorkIds = new Set<string>()

    // Process year-based works
    const yearFields = [
      'works2025',
      'works2024',
      'works2023',
      'works2022',
      'works2021',
      'works2020',
      'works2019',
      'works2018',
    ]
    yearFields.forEach((yearField) => {
      const works = (worksData[yearField as keyof WorksData] as Work[]) || []
      const year = yearField.replace('works', '')
      const validWorks = works.filter((work) => work.images && work.images.length > 0)
      worksByYear[year] = validWorks

      // Add to allWorks only if not already seen
      validWorks.forEach((work) => {
        if (!seenWorkIds.has(work._id)) {
          allWorks.push(work)
          seenWorkIds.add(work._id)
        }
      })
    })

    // Process type-based works
    const typeFields = ['objectImagesWorks', 'paintingsWorks', 'drawingsWorks', 'sculpturesWorks']
    typeFields.forEach((typeField) => {
      const works = (worksData[typeField as keyof WorksData] as Work[]) || []
      const type = typeField.replace('Works', '').toLowerCase()
      const validWorks = works.filter((work) => work.images && work.images.length > 0)
      worksByType[type] = validWorks

      // Add to allWorks only if not already seen
      validWorks.forEach((work) => {
        if (!seenWorkIds.has(work._id)) {
          allWorks.push(work)
          seenWorkIds.add(work._id)
        }
      })
    })

    return {
      allWorks: allWorks
        .filter((work) => work.images && work.images.length > 0)
        .sort((a, b) => {
          // Sort by year in descending order (2025 to 2018)
          const yearA = a.year || 'Unknown'
          const yearB = b.year || 'Unknown'
          if (yearA === 'Unknown') return 1
          if (yearB === 'Unknown') return -1
          return parseInt(yearB) - parseInt(yearA)
        }),
      worksByYear,
      worksByType,
    }
  }, [worksData])

  // Filter works based on selected year and classification
  const filteredWorks = useMemo(() => {
    let filtered: Work[] = []

    if (selectedYear === 'all' && selectedClassification === 'all') {
      // When both filters are "all", prioritize year-based works to avoid duplicates
      // from category-based collections that contain the same works
      const allYearWorks: Work[] = []
      Object.values(processedWorks.worksByYear).forEach((yearWorks) => {
        allYearWorks.push(...yearWorks)
      })
      // Sort by year in descending order (2025 to 2018)
      filtered = allYearWorks.sort((a, b) => {
        const yearA = a.year || 'Unknown'
        const yearB = b.year || 'Unknown'
        if (yearA === 'Unknown') return 1
        if (yearB === 'Unknown') return -1
        return parseInt(yearB) - parseInt(yearA)
      })
    } else if (selectedYear !== 'all' && selectedClassification === 'all') {
      // Show works from specific year
      filtered = processedWorks.worksByYear[selectedYear] || []
    } else if (selectedYear === 'all' && selectedClassification !== 'all') {
      // Show works from specific type
      filtered = processedWorks.worksByType[selectedClassification] || []
    } else {
      // Show works that match both year and type
      const typeWorks = processedWorks.worksByType[selectedClassification] || []
      filtered = typeWorks.filter((work) => work.year === selectedYear)
    }

    // Deduplicate filtered works to prevent React key conflicts
    const seenIds = new Set<string>()
    const deduplicatedWorks = filtered.filter((work) => {
      if (seenIds.has(work._id)) {
        return false
      }
      seenIds.add(work._id)
      return true
    })

    return deduplicatedWorks
  }, [processedWorks, selectedYear, selectedClassification])

  // Get unique years from works data
  const years = useMemo(() => {
    const availableYears = Object.keys(processedWorks.worksByYear).filter(
      (year) => processedWorks.worksByYear[year].length > 0,
    )
    return ['all', ...availableYears.sort((a, b) => parseInt(b) - parseInt(a))]
  }, [processedWorks])

  // Get unique classifications from works data
  const classifications = useMemo(() => {
    const availableTypes = Object.keys(processedWorks.worksByType).filter(
      (type) => processedWorks.worksByType[type].length > 0,
    )
    return ['all', ...availableTypes.sort()]
  }, [processedWorks])

  // Function to determine image orientation and return appropriate width
  const getImageWidth = (work: Work) => {
    if (!work.images || !work.images[0]) return 'w-[450px]'

    const image = work.images[0]
    // Access dimensions through imageData (Sanity metadata structure)
    const width = image?.imageData?.dimensions?.width || 800
    const height = image?.imageData?.dimensions?.height || 600

    // If width is greater than height, it's landscape
    const isLandscape = width > height

    return isLandscape ? 'w-[800px]' : 'w-[450px]'
  }

  // Group works by year for display
  const worksByYear = useMemo(() => {
    const grouped = filteredWorks.reduce(
      (acc, work) => {
        const year = work.year || 'Unknown'
        if (!acc[year]) {
          acc[year] = []
        }
        acc[year].push(work)
        return acc
      },
      {} as Record<string, Work[]>,
    )

    // Sort years in descending order (2025 to 2018)
    return Object.entries(grouped).sort(([a], [b]) => {
      // Handle 'Unknown' year by placing it at the end
      if (a === 'Unknown') return 1
      if (b === 'Unknown') return -1
      return parseInt(b) - parseInt(a)
    })
  }, [filteredWorks])

  return (
    <div className="bg-black">
      {/* Navigation */}
      <WorksNavigation marqueeText={marqueeText} />

      <div className=" mt-5">
        {/* Works Content */}
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.8, delay: 0.2}}
          className=""
        >
          {selectedView === 'list' ? (
            // List view - show titles as text links
            <motion.div
              initial={{opacity: 0, y: 30}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6}}
              className=" px-3 pb-20 lg:px-10"
            >
              <div className="text-lg leading-relaxed">
                {filteredWorks.map((work, index) => (
                  <React.Fragment key={work._id}>
                    <Link
                      href={`/works/${work.slug}`}
                      className="hover:underline underline-offset-4 transition-all duration-200"
                    >
                      {work.title}
                    </Link>
                    {index < filteredWorks.length - 1 && <span className="mx-2">/</span>}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          ) : selectedYear === 'all' ? (
            // Single horizontal scroll for all works when "All Years" is selected
            <motion.div
              initial={{opacity: 0, y: 30}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6}}
              className="space-y-6"
            >
              {/* All Works Horizontal Scroll */}
              <div ref={allWorksScrollRef} className="overflow-x-auto pb-4 ml-3 lg:ml-12">
                <div
                  className={`flex gap-2 min-w-max transition-transform duration-1000 ease-out ${showScrollHint ? 'translate-x-5' : 'translate-x-0'}`}
                >
                  {filteredWorks.map((work, workIndex) => (
                    <div
                      key={work._id}
                      // initial={{opacity: 0, scale: 0.95}}
                      // animate={{opacity: 1, scale: 1}}
                      // transition={{duration: 0.5, delay: workIndex * 0.05}}
                      className={`group flex-shrink-0 ${getImageWidth(work)}`}
                    >
                      <Link href={`/works/${work.slug}`} className="block">
                        {/* Work Image */}
                        <div className="mb-4 overflow-hidden">
                          <div className="transition-transform duration-300 ease-out hover:scale-105">
                            <ImageComponent
                              image={work.images[0]}
                              placeholderSrc={work.images[0]}
                              classname="w-full h-full object-contain"
                            />
                          </div>
                        </div>

                        {/* Work Title Only - Show on Hover */}
                        <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className="">{work.title}</h3>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            // Grouped by year when a specific year is selected
            worksByYear
              .filter(([year]) => year === selectedYear)
              .map(([year, yearWorks], yearIndex) => (
                <motion.div
                  key={year}
                  initial={{opacity: 0, y: 30}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.6, delay: yearIndex * 0.1}}
                  className=""
                >
                  {/* Works Horizontal Scroll */}
                  <div ref={yearWorksScrollRef} className="overflow-x-auto">
                    <div
                      className={`flex gap-2 ml-12 transition-transform duration-1000 ease-out ${showScrollHint ? 'translate-x-5' : 'translate-x-0'}`}
                    >
                      {yearWorks.map((work, workIndex) => (
                        <motion.div
                          key={work._id}
                          initial={{opacity: 0, scale: 0.95}}
                          animate={{opacity: 1, scale: 1}}
                          transition={{duration: 0.5, delay: workIndex * 0.05}}
                          className={`group flex-shrink-0 ${getImageWidth(work)}`}
                        >
                          <Link href={`/works/${work.slug}`} className="block">
                            {/* Work Image */}
                            <div className="overflow-hidden">
                              <div className="transition-transform duration-300 ease-out hover:scale-105">
                                <ImageComponent
                                  image={work.images[0]}
                                  placeholderSrc={work.images[0]}
                                  classname="w-full h-full object-contain"
                                />
                              </div>
                            </div>

                            {/* Work Title Only - Show on Hover */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <h3 className="">{work.title}</h3>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
          )}
        </motion.div>
        {/* No works message */}
        {filteredWorks.length === 0 && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center py-16">
            <p className="text-xl text-gray-400">
              No works found for{' '}
              {selectedClassification !== 'all' && selectedYear !== 'all'
                ? `${selectedClassification} from ${selectedYear}`
                : selectedClassification !== 'all'
                  ? selectedClassification
                  : selectedYear !== 'all'
                    ? `year ${selectedYear}`
                    : 'the selected filters'}
            </p>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6}}
        className="mb-12 px-3 lg:px-10 pb-5"
      >
        <ViewFilter selectedView={selectedView} onViewChange={setSelectedView} />
        <TypeFilter
          classifications={classifications}
          selectedClassification={selectedClassification}
          onClassificationChange={setSelectedClassification}
        />
        <YearFilter years={years} selectedYear={selectedYear} onYearChange={setSelectedYear} />
      </motion.div>
    </div>
  )
}
