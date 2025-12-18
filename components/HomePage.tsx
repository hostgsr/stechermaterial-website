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
  videoUrl?: string
  videoPoster?: any
}

// Project item component with grid layout
const ProjectItem = ({project}: {project: Project}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Get audio URL if audioFile exists and is valid
  const audioUrl = project.audioFile ? urlForFile(project.audioFile) : null
  const hasValidAudio = Boolean(audioUrl)

  // Get video poster URL if videoPoster exists
  const videoPosterUrl = project.videoPoster ? urlForImage(project.videoPoster) : null

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
        <div className="grid grid-cols-3 md:grid-cols-12 gap-2 md:gap-4 items-center">
          {/* Art Nr. - Hidden on mobile */}
          <div className="hidden md:block col-span-1">{project.artNumber || '—'}</div>

          {/* Project/Title */}
          <div className="col-span-1 md:col-span-3">{project.title || 'Untitled'}</div>

          {/* Technique - Hidden on mobile */}
          <div className="hidden md:block md:col-span-2">{project.technique || '—'}</div>

          {/* Location - Hidden on mobile */}
          <div className="hidden md:block md:col-span-2">{project.location || '—'}</div>

          {/* Material */}
          <div className="col-span-1 md:col-span-2 ">{project.material || '—'}</div>

          {/* Year and Controls */}
          <div className="flex justify-between items-center col-span-1 md:col-span-2">
            <span className="hidden md:block  ">{project.year || '—'}</span>
            <div className="flex items-center gap-2 ml-auto md:ml-2">
              <span>{isExpanded ? '−' : '+'}</span>
            </div>
          </div>
        </div>
      </button>

      {/* Expanded Content Section */}
      {isExpanded && (
        <div className="pb-4 pt-2">
          {/* Mobile Layout */}
          <div className="md:hidden">
            {/* Description first on mobile */}
            {project.description && <div className="text-sm mb-4">{project.description}</div>}

            {/* Main video */}
            {project.videoUrl && (
              <div className="mb-4">
                <video
                  controls
                  className="w-full h-auto"
                  preload="metadata"
                  poster={videoPosterUrl || undefined}
                >
                  <source src={project.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* Media Gallery (Photos & Videos) */}
            {project.photos && project.photos.length > 0 && (
              <div className="space-y-2">
                {project.photos.map((mediaItem, index) => {
                  // Check if it's a video object
                  if (mediaItem._type === 'video') {
                    const posterUrl = mediaItem.poster ? urlForImage(mediaItem.poster) : null
                    return (
                      <div key={index} className="w-full">
                        <video
                          controls
                          className="w-full h-auto"
                          preload="metadata"
                          poster={posterUrl || undefined}
                        >
                          <source src={mediaItem.videoSrc} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        {mediaItem.caption && (
                          <p className="text-[10px] mt-1">{mediaItem.caption}</p>
                        )}
                      </div>
                    )
                  }

                  // It's an image
                  return (
                    <div key={index} className="overflow-hidden">
                      <ImageComponent
                        image={mediaItem}
                        placeholderSrc={mediaItem}
                        classname="w-full h-auto object-contain transition-transform duration-300"
                        fullQuality={true}
                      />
                      {mediaItem.caption && <p className="text-[10px]">{mediaItem.caption}</p>}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-4 gap-4 items-start">
              {/* Main video first - spans 2 columns minimum */}
              {project.videoUrl && (
                <div className="col-span-2 mb-4">
                  <video
                    controls
                    className="w-full h-auto"
                    preload="metadata"
                    poster={videoPosterUrl || undefined}
                  >
                    <source src={project.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* Media Gallery with smart description insertion */}
              {project.photos &&
                project.photos.length > 0 &&
                (() => {
                  const hasVideos = project.photos.some((item) => item._type === 'video')
                  const elements = []
                  let descriptionInserted = false

                  // Separate videos and images
                  const videos = project.photos.filter((item) => item._type === 'video')
                  const images = project.photos.filter((item) => item._type !== 'video')

                  // Add videos first
                  videos.forEach((videoItem, index) => {
                    const posterUrl = videoItem.poster ? urlForImage(videoItem.poster) : null
                    elements.push(
                      <div key={`video-${index}`} className="col-span-2 overflow-hidden">
                        <video
                          controls
                          className="w-full h-auto"
                          preload="metadata"
                          poster={posterUrl || undefined}
                        >
                          <source src={videoItem.videoSrc} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        {videoItem.caption && (
                          <p className="text-[10px] mt-1">{videoItem.caption}</p>
                        )}
                      </div>,
                    )
                  })

                  // Add description after videos (if there are videos)
                  if (project.description && hasVideos) {
                    elements.push(
                      <div key="description" className="col-span-2 text-sm self-start">
                        {project.description}
                      </div>,
                    )
                    descriptionInserted = true
                  }

                  // Add images after description
                  images.forEach((imageItem, index) => {
                    elements.push(
                      <div key={`image-${index}`} className="overflow-hidden">
                        <ImageComponent
                          image={imageItem}
                          placeholderSrc={imageItem}
                          classname="w-full h-auto object-contain transition-transform duration-300"
                          fullQuality={true}
                        />
                        {imageItem.caption && (
                          <p className="text-[10px] mt-1">{imageItem.caption}</p>
                        )}
                      </div>,
                    )

                    // If no videos, insert description after 2nd image
                    if (project.description && !hasVideos && !descriptionInserted && index === 1) {
                      elements.push(
                        <div key="description" className="col-span-2 text-sm self-start">
                          {project.description}
                        </div>,
                      )
                      descriptionInserted = true
                    }
                  })

                  // If description wasn't inserted and there's no main video, show it at the beginning
                  if (
                    project.description &&
                    !descriptionInserted &&
                    !project.videoUrl &&
                    !hasVideos
                  ) {
                    elements.unshift(
                      <div key="description-fallback" className="col-span-2 text-sm self-start">
                        {project.description}
                      </div>,
                    )
                  }

                  return elements
                })()}
            </div>
          </div>

          {/* Fallback if no content */}
          {!project.videoUrl &&
            (!project.photos || project.photos.length === 0) &&
            !project.description && <p className="text-black italic">No content available</p>}
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
    <div className="relative bg-white text-black">
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
              <div className="grid grid-cols-3 md:grid-cols-12 gap-2 md:gap-4 py-3 border-black">
                <div className="hidden md:block col-span-1">[Art Nr.]</div>
                <div className="col-span-1 md:col-span-3">[Project/Title]</div>
                <div className="hidden md:block md:col-span-2">[Technique]</div>
                <div className="hidden md:block md:col-span-2">[Location]</div>
                <div className="col-span-1 md:col-span-2">[Material]</div>
                <div className="col-span-1 md:col-span-2 hidden md:block">[Year]</div>
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
