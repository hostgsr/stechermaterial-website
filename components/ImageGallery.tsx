// @ts-nocheck
'use client'

import {resolveHref} from '@/sanity/lib/utils'
import {AnimatePresence, motion} from 'framer-motion'
import Link from 'next/link'
import React, {useEffect, useMemo, useRef, useState} from 'react'
import ImageComponent from './ImageComponent'

const ImageGallery = ({showcaseWorks, imagesAnimationComplete, animationDelay = 0}) => {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedWorkIndex, setSelectedWorkIndex] = useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Ref to store the interval ID for cleanup
  const intervalRef = useRef(null)

  // Get unique classifications for filtering
  const classifications = [
    'all',
    ...new Set(showcaseWorks?.map((work) => work.classification) || []),
  ]

  // Filter works based on selected classification
  const filteredWorks = useMemo(() => {
    return selectedFilter === 'all'
      ? showcaseWorks
      : showcaseWorks?.filter((work) => work.classification === selectedFilter) || []
  }, [selectedFilter, showcaseWorks])

  // Get currently selected work
  const currentWork = filteredWorks[selectedWorkIndex]
  const currentImages = currentWork?.images || []

  // Debug: Log the current work to see its structure
  // Console.log removed to prevent ISR write issues

  // Create a flat array of all images with their work indices
  const allImages = filteredWorks.flatMap((work, workIndex) =>
    work.images.map((image, imageIndex) => ({
      image,
      workIndex,
      imageIndex,
      workId: work._id,
    })),
  )

  // Auto-cycling effect - cycle through ALL images
  useEffect(() => {
    if (allImages.length > 0) {
      intervalRef.current = setInterval(() => {
        // Find current image in the flat array
        const currentFlatIndex = allImages.findIndex(
          (item) => item.workIndex === selectedWorkIndex && item.imageIndex === selectedImageIndex,
        )

        // Get next image index (wrap around to 0 if at end)
        const nextFlatIndex = (currentFlatIndex + 1) % allImages.length
        const nextImage = allImages[nextFlatIndex]

        // Update both work and image indices
        setSelectedWorkIndex(nextImage.workIndex)
        setSelectedImageIndex(nextImage.imageIndex)
      }, 10000) // Change every 10 second
    }

    // Cleanup function to clear interval
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [allImages, selectedWorkIndex, selectedImageIndex, filteredWorks])

  // Animation variants
  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: {opacity: 0, y: 30},
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const imageVariants = {
    hidden: {opacity: 0, scale: 0.95},
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      transition: {
        duration: 0.3,
      },
    },
  }

  // Handle work selection
  const handleWorkSelect = (workIndex) => {
    setSelectedWorkIndex(workIndex)
    setSelectedImageIndex(0) // Reset to first image when changing works

    // Clear and restart the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  // Handle image selection within current work
  const handleImageSelect = (imageIndex) => {
    setSelectedImageIndex(imageIndex)

    // Clear and restart the interval when manually selecting an image
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  // Handle filter change
  const handleFilterChange = (classification) => {
    setSelectedFilter(classification)
    setSelectedWorkIndex(0)
    setSelectedImageIndex(0)
  }

  if (!showcaseWorks || showcaseWorks.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <p>No works to display</p>
      </div>
    )
  }

  if (filteredWorks.length === 0) {
    return (
      <motion.div
        className="w-full text-center py-8"
        initial={{opacity: 0}}
        animate={{opacity: imagesAnimationComplete ? 1 : 0}}
        transition={{
          duration: 0.8,
          delay: animationDelay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <p>No works found for &quot;{selectedFilter}&quot;</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="w-full"
      initial={{opacity: 0}}
      animate={{opacity: imagesAnimationComplete ? 1 : 0}}
      transition={{
        duration: 0.8,
        delay: animationDelay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate={imagesAnimationComplete ? 'visible' : 'hidden'}
      >
        {/* Selected Work Details - Right Column */}
        <motion.div className="lg:col-span-12" variants={itemVariants}>
          {currentWork && (
            <>
              {/* Main Image - Smaller Size */}
              <div className="mb-4 w-full max-h-[70vh]">
                <AnimatePresence mode="wait">
                  {currentImages[selectedImageIndex] && (
                    <motion.div
                      key={`${currentWork._id}-${selectedImageIndex}`}
                      variants={imageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="w-full "
                    >
                      {currentWork.slug ? (
                        <Link
                          href={resolveHref('work', currentWork.slug)}
                          className="block cursor-pointer"
                          onClick={() => {
                            // Console.log removed to prevent ISR write issues
                          }}
                        >
                          <ImageComponent
                            image={currentImages[selectedImageIndex]}
                            placeholderSrc={currentImages[selectedImageIndex]}
                            classname="w-full h-full max-h-[65vh] object-contain"
                            ultraQuality={true}
                          />
                        </Link>
                      ) : (
                        <ImageComponent
                          image={currentImages[selectedImageIndex]}
                          placeholderSrc={currentImages[selectedImageIndex]}
                          classname="w-full h-full max-h-[65vh] object-contain"
                          ultraQuality={true}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Works Grid - Left Column */}
              <motion.div className="lg:col-span-12 space-y-4" variants={itemVariants}>
                <div className="grid grid-cols-9 gap-4">
                  {filteredWorks.map((work, index) => (
                    <button
                      key={work._id}
                      onClick={() => handleWorkSelect(index)}
                      className={`group text-left transition-all duration-200 ${
                        selectedWorkIndex === index ? '' : ''
                      }`}
                    >
                      {/* Work Preview Image */}
                      <div className=" mb-2 overflow-hidden">
                        {work.images && work.images[0] && (
                          <ImageComponent
                            image={work.images[0]}
                            placeholderSrc={work.images[0]}
                            classname="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Thumbnails */}
              {currentImages.length > 1 && (
                <motion.div className="space-y-2" variants={itemVariants}>
                  <div className="text-sm font-medium">All Images ({currentImages.length})</div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {currentImages.map((image, imageIndex) => (
                      <button
                        key={imageIndex}
                        onClick={() => handleImageSelect(imageIndex)}
                        className={`flex-shrink-0 w-16 h-16 transition-all duration-200 ${
                          selectedImageIndex === imageIndex ? '' : ''
                        }`}
                      >
                        <ImageComponent
                          image={image}
                          placeholderSrc={image}
                          classname="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default ImageGallery
