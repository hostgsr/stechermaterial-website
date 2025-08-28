// @ts-nocheck
'use client'

import {AnimatePresence, motion} from 'framer-motion'
import {useEffect, useState} from 'react'
import ImageComponent from './ImageComponent'

const StackedImagesReveal = ({
  images,
  className = '',
  onAnimationComplete,
  animationType = 'slide', // 'slide' or 'fade'
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showComponent, setShowComponent] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    if (!images?.length) return

    // First fade in the entire component
    const fadeInDelay = setTimeout(() => {
      setShowComponent(true)
    }, 100)

    // Then start the reveal sequence after fade-in completes
    const startDelay = setTimeout(() => {
      setIsLoading(false)
    }, 800) // Increased delay to allow fade-in to complete

    return () => {
      clearTimeout(fadeInDelay)
      clearTimeout(startDelay)
    }
  }, [images])

  useEffect(() => {
    if (isLoading || !images?.length) return

    // Cycle through images with staggered timing
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        if (prev < images.length - 1) {
          return prev + 1
        } else {
          // Animation is complete when we've reached the last image
          if (!animationComplete) {
            setAnimationComplete(true)
            // Notify parent component that animation is complete
            if (onAnimationComplete) {
              // Add a small delay to ensure the last image animation finishes
              setTimeout(() => {
                onAnimationComplete()
              }, 600) // Match the transition duration
            }
          }
        }
        return prev // Stop at the last image
      })
    }, 800) // 800ms delay between each image reveal

    return () => clearInterval(interval)
  }, [isLoading, images?.length, animationComplete, onAnimationComplete])

  if (!images?.length) return null

  const getImageAnimationProps = (index) => {
    if (animationType === 'fade') {
      return {
        initial: {opacity: 0},
        animate: {opacity: index === currentImageIndex ? 1 : 0},
        transition: {
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: isLoading ? 0 : 0,
        },
      }
    } else {
      // Default slide animation
      return {
        initial: {y: '0%'},
        animate: {y: index < currentImageIndex ? '100%' : '0%'},
        transition: {
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: isLoading ? 0 : 0,
        },
      }
    }
  }

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{opacity: 0}}
      animate={{opacity: showComponent ? 1 : 0}}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Loading placeholder */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.3}}
            className="absolute inset-0 bg-black flex items-center justify-center"
          ></motion.div>
        )}
      </AnimatePresence>

      {/* Stacked Images */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        {images.map((imageItem, index) => (
          <motion.div
            key={imageItem._key || index}
            className="absolute inset-0"
            style={{
              zIndex:
                animationType === 'fade'
                  ? index === currentImageIndex
                    ? images.length
                    : 0
                  : images.length - index, // Stack in reverse for slide, current image on top for fade
            }}
            {...getImageAnimationProps(index)}
          >
            <ImageComponent
              image={imageItem}
              placeholderSrc={imageItem}
              classname="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default StackedImagesReveal
