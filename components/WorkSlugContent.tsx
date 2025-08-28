// @ts-nocheck
'use client'

import {Header} from '@/components/Header'
import ImageComponent from '@/components/ImageComponent'
import {urlForImage} from '@/sanity/lib/utils'
import {motion} from 'framer-motion'
import {useEffect, useState} from 'react'
import type {PathSegment} from 'sanity'
import {WorksNavigation} from './WorksNavigation'

interface WorkSlugContentProps {
  data: {
    _id?: string | null
    _type?: string | null
    title?: string | null
    images?: any[] | null
    descriptionMedium?: string | null
    description?: string | null
    year?: string | null
    size?: string | null
    location?: string | null
    classification?: string | null
  }
  marqueeText?: string
}

export default function WorkSlugContent({data, marqueeText}: WorkSlugContentProps) {
  const {title, images, descriptionMedium, description, year, size, location, classification} = data
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setIsLightboxOpen(true)
  }

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false)
    setSelectedImageIndex(null)
  }

  const handlePrevious = () => {
    if (selectedImageIndex !== null && images && images.length > 0) {
      const newIndex = selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1
      setSelectedImageIndex(newIndex)
    }
  }

  const handleNext = () => {
    if (selectedImageIndex !== null && images && images.length > 0) {
      const newIndex = selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1
      setSelectedImageIndex(newIndex)
    }
  }

  const handleImageClickInLightbox = () => {
    handleNext()
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isLightboxOpen) return

      switch (event.key) {
        case 'Escape':
          handleCloseLightbox()
          break
        case 'ArrowLeft':
          handlePrevious()
          break
        case 'ArrowRight':
        case ' ':
          event.preventDefault()
          handleNext()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, selectedImageIndex, images])

  const currentImage = selectedImageIndex !== null && images ? images[selectedImageIndex] : null

  return (
    <>
      <WorksNavigation marqueeText={marqueeText} />
      <div className="min-h-screen bg-black text-white lg:px-10 px-5  mt-5 ">
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images Section */}
            <motion.div
              initial={{opacity: 0, x: -30}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.8, delay: 0.2}}
              className="space-y-6"
            >
              {images && images.length > 0 ? (
                images.map((image: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{opacity: 0, scale: 0.95}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration: 0.6, delay: 0.3 + index * 0.1}}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleImageClick(index)}
                  >
                    <ImageComponent
                      image={image}
                      placeholderSrc={image}
                      ultraQuality={true}
                      classname="w-full h-full object-contain"
                    />
                  </motion.div>
                ))
              ) : (
                <div className="flex items-center justify-center">
                  <span className="text-gray-500">No Images Available</span>
                </div>
              )}
            </motion.div>

            {/* Details Section */}
            <motion.div
              initial={{opacity: 0, x: 30}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.8, delay: 0.4}}
              className=""
            >
              {/* Work Details */}
              <div className="">
                {title && (
                  <div>
                    <p className="">{title}</p>
                  </div>
                )}
                {/* Description Medium */}
                {descriptionMedium && (
                  <div>
                    <p className="">{descriptionMedium}</p>
                  </div>
                )}

                {size && (
                  <div>
                    <p className="">{size}</p>
                  </div>
                )}

                {year && (
                  <div className="flex flex-row">
                    <span>Year: </span> <p className="ml-1">{year}</p>
                  </div>
                )}

                {location && (
                  <div className="flex flex-row">
                    <span>Location: </span> <p className="ml-1">{location}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {description && (
                <div>
                  <p className="">{description}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Full Screen Lightbox */}
      {isLightboxOpen && currentImage && images && (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={handleCloseLightbox}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={handleCloseLightbox}
              className="absolute top-4 right-4 text-white z-10 hover:text-gray-300 transition-colors w-8 h-8"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              >
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            </button>

            {/* Pagination Counter */}
            <div className="absolute top-4 left-4 text-white z-10 bg-black bg-opacity-50 px-3 py-1 rounded">
              <span className="text-sm font-mono">
                {selectedImageIndex !== null ? selectedImageIndex + 1 : 1}/{images.length}
              </span>
            </div>

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevious()
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10 hover:text-gray-300 transition-colors w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                >
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
              </button>
            )}

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext()
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10 hover:text-gray-300 transition-colors w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                >
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </button>
            )}

            {/* Main Image */}
            <div
              className="w-full h-full overflow-auto cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                handleImageClickInLightbox()
              }}
            >
              <ImageComponent
                image={currentImage}
                placeholderSrc={currentImage}
                classname="w-full h-auto object-contain min-h-full"
                ultraQuality={true}
              />
            </div>

            {/* Navigation Hint */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded">
                Click image or use ← → keys to navigate
              </div>
            )}
          </div>
        </motion.div>
      )}
    </>
  )
}
