// @ts-nocheck
'use client'

import type {HomePageQueryResult} from '@/sanity.types'
import {client} from '@/sanity/lib/client'
import {allProjectsQuery} from '@/sanity/lib/queries'
import {urlForFile, urlForImage} from '@/sanity/lib/utils'
import React, {useEffect, useRef, useState} from 'react'
import {CustomPortableText} from './CustomPortableText'
import ImageComponent from './ImageComponent'
import {ScrollImageGallery} from './ScrollImageGallery'

export interface HomePageProps {
  data: HomePageQueryResult | null
}

interface Project {
  _id: string
  _type: string
  artNumber: string
  title: string
  slug: string
  technique: string
  location: string
  material: string
  year: string
  description: string
  photos: any[]
  audioFile?: any
}

// Project item component with grid layout
const ProjectItem = ({project}: {project: Project}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Get audio URL if audioFile exists and is valid
  const audioUrl = project.audioFile ? urlForFile(project.audioFile) : null
  const hasValidAudio = Boolean(audioUrl)

  const handleExpand = () => {
    setIsExpanded(!isExpanded)

    // Play audio when expanding if audio file exists
    if (!isExpanded && hasValidAudio && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log('Audio play failed:', error)
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering expand/collapse

    if (!audioRef.current || !hasValidAudio) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch((error) => {
        console.log('Audio play failed:', error)
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }

  // Handle audio ended event
  const handleAudioEnded = () => {
    setIsPlaying(false)
  }

  return (
    <div className="border-t border-black">
      {/* Hidden audio element */}
      {hasValidAudio && (
        <audio ref={audioRef} src={audioUrl} onEnded={handleAudioEnded} preload="metadata" />
      )}

      <button
        onClick={handleExpand}
        className="w-full text-left py-3 text-black focus:outline-none "
      >
        {/* Project Information Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 items-center">
          {/* Art Nr. - Hidden on mobile */}
          <div className="hidden md:block">{project.artNumber || '—'}</div>

          {/* Project/Title */}
          <div className="col-span-1 md:col-span-1">{project.title || 'Untitled'}</div>

          {/* Technique - Hidden on mobile */}
          <div className="hidden md:block">{project.technique || '—'}</div>

          {/* Location - Hidden on mobile */}
          <div className="hidden md:block">{project.location || '—'}</div>

          {/* Material */}
          <div className="col-span-1 md:col-span-1">{project.material || '—'}</div>

          {/* Year and Controls */}
          <div className="flex justify-between items-center col-span-1 md:col-span-1">
            <span className="hidden md:block">{project.year || '—'}</span>
            <div className="flex items-center gap-2 ml-auto md:ml-2">
              <span>{isExpanded ? '−' : '+'}</span>
            </div>
          </div>
        </div>
      </button>

      {/* Expanded Photos Section */}
      {isExpanded && (
        <div className="pb-4 pt-2">
          {/* Project Photos */}
          {project.photos && project.photos.length > 0 ? (
            <>
              {/* Mobile Layout - Original grid layout */}
              <div className="md:hidden">
                {project.description && <div className="text-sm mt-2">{project.description}</div>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.photos.map((photo, index) => (
                    <div key={index} className="overflow-hidden">
                      <ImageComponent
                        image={photo}
                        placeholderSrc={photo}
                        classname="w-full h-auto object-contain transition-transform duration-300"
                        fullQuality={true}
                      />
                      {photo.caption && <p className="text-[10px]">{photo.caption}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Layout - Images with interspersed description */}
              <div className="hidden md:block">
                <div className="grid grid-cols-4 gap-4 items-start">
                  {project.photos.map((photo, index) => {
                    // Show description after every 2 images, starting after the 2nd image
                    const showDescriptionAfter = index === 1 && project.description

                    return (
                      <React.Fragment key={index}>
                        <div className="overflow-hidden">
                          <ImageComponent
                            image={photo}
                            placeholderSrc={photo}
                            classname="w-full h-auto object-contain transition-transform duration-300"
                            fullQuality={true}
                          />
                          {photo.caption && <p className="text-[10px] mt-1">{photo.caption}</p>}
                        </div>

                        {showDescriptionAfter && (
                          <div className="col-span-2 text-sm self-start">{project.description}</div>
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            <p className="text-black italic">No photos available</p>
          )}
        </div>
      )}
    </div>
  )
}

export function HomePage({data}: HomePageProps) {
  const {imageGallery = [], imageGalleryMobile = [], audioFile} = data ?? {}
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showInfo, setShowInfo] = useState(false)

  const toggleInfo = () => {
    setShowInfo(!showInfo)
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await client.fetch(allProjectsQuery)
        console.log(
          'Raw projects data:',
          projectsData?.map((p) => ({id: p._id, artNumber: p.artNumber, title: p.title})),
        )

        // Sort projects by artNumber from highest to lowest (handle both numeric and alphabetic)
        const sortedProjects = (projectsData || []).sort((a: Project, b: Project) => {
          const aArtNumber = (a.artNumber || '').toString().trim()
          const bArtNumber = (b.artNumber || '').toString().trim()

          console.log('Sorting:', aArtNumber, 'vs', bArtNumber) // Debug log

          // Check if both are purely numeric
          const aIsNumeric = /^\d+$/.test(aArtNumber)
          const bIsNumeric = /^\d+$/.test(bArtNumber)

          if (aIsNumeric && bIsNumeric) {
            // Both are numeric, compare as numbers (reversed for highest to lowest)
            const result = parseInt(bArtNumber, 10) - parseInt(aArtNumber, 10)
            console.log('Numeric comparison:', aArtNumber, bArtNumber, '=', result)
            return result
          } else if (aIsNumeric && !bIsNumeric) {
            // Numbers come before letters
            return -1
          } else if (!aIsNumeric && bIsNumeric) {
            // Numbers come before letters
            return 1
          } else {
            // Both are strings, compare alphabetically (reversed for highest to lowest)
            return bArtNumber.localeCompare(aArtNumber)
          }
        })

        setProjects(sortedProjects)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="relative text-black">
      {/* Scroll-based Image Gallery */}
      {imageGallery && imageGallery.length > 0 && (
        <ScrollImageGallery
          images={imageGallery}
          mobileImages={imageGalleryMobile}
          audioFile={audioFile}
        />
      )}

      {/* Projects List Section - Appears after image gallery */}
      <div className="relative z-10 bg-white">
        <div className="bg-whtie text-black px-4">
          <div className="flex flex-row gap-2">
            <button
              onClick={toggleInfo}
              className="cursor-pointer hover:underline hover:underline-offset-4"
            >
              {showInfo ? 'Close' : 'Info'}
            </button>
            <div>
              {data?.contactEmail && (
                <a
                  className="hover:underline hover:underline-offset-4"
                  href={`mailto:${data.contactEmail}`}
                >
                  Contact
                </a>
              )}
            </div>
          </div>
          {showInfo && (
            <div className="mt-2">
              {data?.description && <CustomPortableText value={data.description} />}
            </div>
          )}
        </div>

        <div className="px-4 py-8 min-h-screen">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <p>No projects found.</p>
            </div>
          ) : (
            <div>
              {/* Header Row */}
              <div className="hidden grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 py-3 border-black">
                <div className="hidden md:block">
                  <div className="flex flex-row gap-2 ">
                    <span>Info</span> <span>Contact</span> <span>Mute</span>{' '}
                  </div>
                </div>
              </div>
              {/* Header Row */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 py-3 border-black">
                <div className="hidden md:block">[Art Nr.]</div>
                <div className="col-span-1 md:col-span-1">[Project/Title]</div>
                <div className="hidden md:block">[Technique]</div>
                <div className="hidden md:block">[Location]</div>
                <div className="col-span-1 md:col-span-1">[Material]</div>
                <div className="col-span-1 md:col-span-1 hidden md:block">[Year]</div>
              </div>

              {/* Projects List */}
              <div className="border-b border-black">
                {projects.map((project) => (
                  <ProjectItem key={project._id} project={project} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
