// @ts-nocheck
'use client'

import type {HomePageQueryResult} from '@/sanity.types'
import {client} from '@/sanity/lib/client'
import {allProjectsQuery} from '@/sanity/lib/queries'
import {urlForFile, urlForImage} from '@/sanity/lib/utils'
import {PortableText} from 'next-sanity'
import Link from 'next/link'
import React, {useEffect, useRef, useState} from 'react'
import BuyButton from './BuyButton'
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
  links?: {title: string; url: string}[]
  photos: any[]
  audioFile?: any
  videoUrl?: string
  videoPoster?: any
}

// Lightbox Modal Component
const Lightbox = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: {
  images: any[]
  currentIndex: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}) => {
  const currentImage = images[currentIndex]

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrev])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const imageUrl = urlForImage(currentImage)?.url()

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl z-50 w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
        aria-label="Close lightbox"
      >
        ✕
      </button>

      {/* Image counter */}
      <div className="absolute top-4 left-4 text-white text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Main image container - click to go to next */}
      <div
        className="w-full h-full flex items-center justify-center p-4 md:p-12 cursor-pointer"
        onClick={onNext}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={currentImage.caption || 'Gallery image'}
            className="max-w-full max-h-full object-contain"
          />
        )}
      </div>

      {/* Caption */}
      {currentImage.caption && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded">
          {currentImage.caption}
        </div>
      )}
    </div>
  )
}

// Project item component with grid layout
const ProjectItem = ({project}: {project: Project}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [expandedProductIndices, setExpandedProductIndices] = useState<number[]>([])
  const [lastExpandedProduct, setLastExpandedProduct] = useState<number | null>(null)
  const productRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const scrollPositions = useRef<Record<number, number>>({})
  const audioRef = useRef<HTMLAudioElement>(null)
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  
  // Get all images (excluding videos) for lightbox navigation
  const lightboxImages = (project.photos || []).filter((item) => item._type !== 'video' && item._type !== 'descriptionBlock' && item._type !== 'productBlock' && item._type !== 'spacerBlock')
  
  const openLightbox = (imageIndex: number) => {
    setLightboxIndex(imageIndex)
    setLightboxOpen(true)
  }
  
  const closeLightbox = () => {
    setLightboxOpen(false)
  }
  
  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)
  }
  
  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)
  }

  // Get audio URL if audioFile exists and is valid
  const audioUrl = project.audioFile ? urlForFile(project.audioFile) : null
  const hasValidAudio = Boolean(audioUrl)

  // Get video poster URL if videoPoster exists
  const videoPosterUrl = project.videoPoster ? urlForImage(project.videoPoster) : null

  const getColSpanClass = (span: number) => {
    switch (span) {
      case 2: return 'col-span-2'
      case 3: return 'col-span-3'
      case 4: return 'col-span-4'
      default: return 'col-span-1'
    }
  }

  const getProductCoverUrl = (product: any) => {
    const photos = product?.productPhotos || []
    return photos[0]
      ? urlForImage(photos[0])?.width(600).height(600).fit('crop').url()
      : null
  }

  const expandProduct = (index: number) => {
    scrollPositions.current[index] = window.scrollY
    setExpandedProductIndices((prev) =>
      prev.includes(index) ? prev : [...prev, index],
    )
    setLastExpandedProduct(index)
  }

  useEffect(() => {
    if (lastExpandedProduct === null) return
    const el = productRefs.current[lastExpandedProduct]
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'})
    }
  }, [lastExpandedProduct, expandedProductIndices])

  const collapseProduct = (index: number) => {
    setExpandedProductIndices((prev) => prev.filter((i) => i !== index))
    setLastExpandedProduct(null)
    const savedY = scrollPositions.current[index]
    if (savedY != null) {
      window.scrollTo({top: savedY, behavior: 'smooth'})
    }
  }

  const isProductExpanded = (index: number) => expandedProductIndices.includes(index)

  const renderExpandedProduct = (
    product: any,
    index: number,
    photos: any[],
    variant: 'mobile' | 'desktop',
    key?: string,
  ) => (
    <div
      key={key}
      ref={(el) => {
        productRefs.current[index] = el
      }}
      className={variant === 'desktop' ? 'col-span-4 overflow-hidden scroll-mt-4' : 'overflow-hidden scroll-mt-4'}
    >
      <button
        className=" mb-2 underline underline-offset-2"
        onClick={(e) => {
          e.stopPropagation()
          collapseProduct(index)
        }}
      >
        Close
      </button>
      {photos.length > 0 && (
        <div className={`grid gap-2 ${variant === 'desktop' ? 'grid-cols-4 gap-4' : 'grid-cols-2'}`}>
          {photos.map((photo, photoIdx) => {
            const photoUrl = urlForImage(photo)?.width(600).height(600).fit('crop').url()
            if (!photoUrl) return null
            return (
              <div key={photoIdx} className="overflow-hidden">
                <img
                  src={photoUrl}
                  alt={photo.alt || `${product.title} - ${photoIdx + 1}`}
                  className="w-full h-auto object-contain"
                />
              </div>
            )
          })}
        </div>
      )}
      <div className="mt-2 text-[14px]">
        <p className="  ">{product.title}</p>
        {product.price != null && (
          <p className="">€{product.price.toFixed(2)}</p>
        )}
        {product.description && (
          <div className=" mt-2 whitespace-pre-line">
            <PortableText value={product.description} />
          </div>
        )}
        <BuyButton
          title={product.title}
          price={product.price}
          productId={product._id}
          slug={product.slug}
          image={getProductCoverUrl(product)}
          className="mt-3 border border-black px-3 py-1.5 uppercase tracking-wider transition-colors hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  )

  const renderProductThumbnail = (
    product: any,
    index: number,
    span = 1,
    variant: 'mobile' | 'desktop' = 'desktop',
  ) => {
    const coverImageUrl = getProductCoverUrl(product)
    const className =
      variant === 'desktop'
        ? `${getColSpanClass(span)} overflow-hidden group cursor-pointer`
        : 'overflow-hidden cursor-pointer'

    return (
      <div
        key={`product-thumb-${index}`}
        className={className}
        onClick={(e) => {
          e.stopPropagation()
          expandProduct(index)
        }}
      >
        {coverImageUrl && (
          <div className="w-full overflow-hidden">
            <img
              src={coverImageUrl}
              alt={product.title}
              className={`w-full h-auto object-contain ${variant === 'desktop' ? 'transition-transform duration-300 group-hover:scale-105' : ''}`}
            />
          </div>
        )}
        <p className={`text-[14px] mt-1 ${variant === 'desktop' ? 'group-hover:underline' : ''}`}>
          {product.title}
        </p>
      </div>
    )
  }

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
            {project.description && <div className="text-sm mb-4 whitespace-pre-line">{project.description}</div>}
            {project.links && project.links.length > 0 && (
              <div className="flex flex-col text-sm mb-4 ">
                {project.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-t border-black py-1   last:border-b"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            )}

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
                {(() => {
                  let imageIndexCounter = 0
                  return project.photos.map((mediaItem, index) => {
                    if (mediaItem._type === 'descriptionBlock' || mediaItem._type === 'spacerBlock') {
                      return null
                    }

                    if (mediaItem._type === 'productBlock') {
                      const product = mediaItem.product
                      if (!product) return null
                      const photos = product.productPhotos || []

                      if (isProductExpanded(index)) {
                        return renderExpandedProduct(
                          product,
                          index,
                          photos,
                          'mobile',
                          `mobile-product-${index}`,
                        )
                      }

                      return renderProductThumbnail(product, index, 1, 'mobile')
                    }

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

                    const currentImageIndex = imageIndexCounter
                    imageIndexCounter++
                    
                    return (
                      <div
                        key={index}
                        className="overflow-hidden cursor-pointer"
                        onClick={() => openLightbox(currentImageIndex)}
                      >
                        <ImageComponent
                          image={mediaItem}
                          placeholderSrc={mediaItem}
                          classname="w-full h-auto object-contain transition-transform duration-300"
                          fullQuality={true}
                        />
                        {mediaItem.caption && <p className="text-[10px]">{mediaItem.caption}</p>}
                      </div>
                    )
                  })
                })()}
              </div>
            )}
          </div>

  {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="grid grid-cols-4 gap-4 items-start grid-flow-row-dense">
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

              {/* Media Gallery - renders blocks in order with colSpan */}
              {project.photos &&
                project.photos.length > 0 &&
                (() => {
                  const colSpanClass = (span: number) => {
                    switch (span) {
                      case 2: return 'col-span-2'
                      case 3: return 'col-span-3'
                      case 4: return 'col-span-4'
                      default: return 'col-span-1'
                    }
                  }

                  const elements: React.ReactNode[] = []
                  let imageIndexCounter = 0

                  project.photos.forEach((mediaItem, index) => {
                    const span = mediaItem.colSpan || 1

                    if (mediaItem._type === 'spacerBlock') {
                      if (expandedProductIndices.length > 0) {
                        return
                      }
                      elements.push(
                        <div key={`spacer-${index}`} className={colSpanClass(span)} />,
                      )
                      return
                    }

                    if (mediaItem._type === 'descriptionBlock') {
                      elements.push(
                        <div key={`desc-${index}`} className={`${colSpanClass(span)} text-sm self-start whitespace-pre-line`}>
                          {project.description}
                          {project.links && project.links.length > 0 && (
                            <div className="flex flex-col">
                              {project.links.map((link, i) => (
                                <a
                                  key={i}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="border-t border-black py-1 last:border-b"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {link.title}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>,
                      )
                    } else if (mediaItem._type === 'productBlock') {
                      const product = mediaItem.product
                      if (!product) return
                      const photos = product.productPhotos || []

                      if (isProductExpanded(index)) {
                        elements.push(
                          renderExpandedProduct(
                            product,
                            index,
                            photos,
                            'desktop',
                            `product-${index}`,
                          ),
                        )
                      } else {
                        elements.push(renderProductThumbnail(product, index, span, 'desktop'))
                      }
                    } else if (mediaItem._type === 'video') {
                      const posterUrl = mediaItem.poster ? urlForImage(mediaItem.poster) : null
                      elements.push(
                        <div key={`video-${index}`} className={`${colSpanClass(span)} overflow-hidden`}>
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
                        </div>,
                      )
                    } else {
                      const currentImageIndex = imageIndexCounter
                      imageIndexCounter++
                      elements.push(
                        <div
                          key={`image-${index}`}
                          className={`${colSpanClass(span)} overflow-hidden cursor-pointer`}
                          onClick={() => openLightbox(currentImageIndex)}
                        >
                          <ImageComponent
                            image={mediaItem}
                            placeholderSrc={mediaItem}
                            classname="w-full h-auto object-contain transition-transform duration-300"
                            fullQuality={true}
                          />
                          {mediaItem.caption && (
                            <p className="text-[10px] mt-1">{mediaItem.caption}</p>
                          )}
                        </div>,
                      )
                    }
                  })

                  return elements
                })()}
            </div>
          </div>

          {/* Fallback if no content */}
          {!project.videoUrl &&
            (!project.photos || project.photos.length === 0) &&
            !project.description && <p className="text-black italic">No content available</p>}

          {/* Lightbox Modal */}
          {lightboxOpen && lightboxImages.length > 0 && (
            <Lightbox
              images={lightboxImages}
              currentIndex={lightboxIndex}
              onClose={closeLightbox}
              onNext={nextImage}
              onPrev={prevImage}
            />
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
            <Link
              href="/shop"
              className="hover:underline hidden hover:underline-offset-4"
            >
              Shop
            </Link>
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
