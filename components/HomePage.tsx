// @ts-nocheck
'use client'

import type {HomePageQueryResult} from '@/sanity.types'
import {client} from '@/sanity/lib/client'
import {allProjectsQuery} from '@/sanity/lib/queries'
import {urlForImage} from '@/sanity/lib/utils'
import React, {useEffect, useState} from 'react'
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
  photos: any[]
}

// Project item component with grid layout
const ProjectItem = ({project}: {project: Project}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-t border-black">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
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

          {/* Year and Expand Button */}
          <div className="flex justify-between items-center col-span-1 md:col-span-1">
            <span className="hidden md:block">{project.year || '—'}</span>
            <span className="ml-auto md:ml-2">{isExpanded ? '−' : '+'}</span>
          </div>
        </div>
      </button>

      {/* Expanded Photos Section */}
      {isExpanded && (
        <div className="pb-4 pt-2">
          {/* Project Photos */}
          {project.photos && project.photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
              {project.photos.map((photo, index) => (
                <div key={index} className="overflow-hidden">
                  <ImageComponent
                    image={photo}
                    placeholderSrc={photo}
                    classname="w-full h-auto object-contain transition-transform duration-300"
                    fullQuality={true}
                  />
                  {photo.caption && <p className="text-sm mt-1 md:mt-2">{photo.caption}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-black italic">No photos available</p>
          )}
        </div>
      )}
    </div>
  )
}

export function HomePage({data}: HomePageProps) {
  const {imageGallery = [], imageGalleryMobile = []} = data ?? {}
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await client.fetch(allProjectsQuery)
        console.log(
          'Raw projects data:',
          projectsData?.map((p) => ({id: p._id, artNumber: p.artNumber, title: p.title})),
        )

        // Sort projects by artNumber (handle both numeric and alphabetic)
        const sortedProjects = (projectsData || []).sort((a: Project, b: Project) => {
          const aArtNumber = (a.artNumber || '').toString().trim()
          const bArtNumber = (b.artNumber || '').toString().trim()

          console.log('Sorting:', aArtNumber, 'vs', bArtNumber) // Debug log

          // Check if both are purely numeric
          const aIsNumeric = /^\d+$/.test(aArtNumber)
          const bIsNumeric = /^\d+$/.test(bArtNumber)

          if (aIsNumeric && bIsNumeric) {
            // Both are numeric, compare as numbers
            const result = parseInt(aArtNumber, 10) - parseInt(bArtNumber, 10)
            console.log('Numeric comparison:', aArtNumber, bArtNumber, '=', result)
            return result
          } else if (aIsNumeric && !bIsNumeric) {
            // Numbers come before letters
            return -1
          } else if (!aIsNumeric && bIsNumeric) {
            // Numbers come before letters
            return 1
          } else {
            // Both are strings, compare alphabetically
            return aArtNumber.localeCompare(bArtNumber)
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
        <ScrollImageGallery images={imageGallery} mobileImages={imageGalleryMobile} />
      )}

      {/* Projects List Section - Appears after image gallery */}
      <div className="relative z-10 bg-white">
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
