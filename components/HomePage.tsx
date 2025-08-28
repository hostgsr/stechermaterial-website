// @ts-nocheck
'use client'

import type {HomePageQueryResult} from '@/sanity.types'
import {sanityFetch} from '@/sanity/lib/client'
import {allProjectsQuery} from '@/sanity/lib/queries'
import Link from 'next/link'
import React, {useEffect, useState} from 'react'
import ImageGallery from './ImageGallery'

export interface HomePageProps {
  data: HomePageQueryResult | null
}

interface Project {
  _id: string
  _type: string
  title: string
  slug: string
  year: string
  description: string
  locationPhotos: any[]
}

export function HomePage({data}: HomePageProps) {
  const {title = '', imageGallery = []} = data ?? {}
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const {data: projectsData} = await sanityFetch({query: allProjectsQuery})
        setProjects(projectsData || [])
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      {title && (
        <div className="text-center">
          <h1 className="text-4xl font-bold">{title}</h1>
        </div>
      )}

      {/* Image Gallery */}
      {imageGallery && imageGallery.length > 0 && (
        <div className="mb-8">
          <ImageGallery images={imageGallery} />
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>

        {projects.length === 0 ? (
          <div className="text-center py-8">
            <p>No projects found.</p>
          </div>
        ) : (
          <div className="flex flex-col border-b border-black">
            {projects.map((project, index) => (
              <div key={project._id} className={`${index > 0 ? '' : ''} border-t border-black`}>
                <Link href={project.slug ? `/projects/${project.slug}` : '#'} className="block">
                  <div className="flex flex-col py-2 hover:italic">
                    <div className="flex flex-row justify-between">
                      <h3 className="font-medium">{project.title || 'Untitled'}</h3>
                      {project.year && <p className="text-gray-600">{project.year}</p>}
                    </div>
                    {project.description && (
                      <div className="flex flex-row justify-between">
                        <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
