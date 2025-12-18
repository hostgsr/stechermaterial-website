'use client'

import {urlForImage} from '@/sanity/lib/utils'
import {useScroll} from 'framer-motion'
import {useEffect, useMemo, useRef, useState} from 'react'
import {ScrollControlledAudio} from './ScrollControlledAudio'

interface ScrollImageGalleryProps {
  images: any[]
  mobileImages: any[]
  audioFile?: any
}

// Preloader component - shown while images load
function ImagePreloader({
  images,
  onComplete,
}: {
  images: any[]
  onComplete: (loadedImages: Map<string, HTMLImageElement>) => void
}) {
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    if (!images || images.length === 0) {
      onComplete(new Map())
      return
    }

    const imageMap = new Map<string, HTMLImageElement>()
    let loadedCount = 0
    const totalImages = images.length

    const loadImage = (image: any, index: number) => {
      return new Promise<void>((resolve) => {
        const imageUrl = urlForImage(image)?.url()
        if (!imageUrl) {
          loadedCount++
          setLoadingProgress((loadedCount / totalImages) * 100)
          resolve()
          return
        }

        const img = new Image()
        img.onload = () => {
          imageMap.set(imageUrl, img)
          loadedCount++
          setLoadingProgress((loadedCount / totalImages) * 100)
          resolve()
        }
        img.onerror = () => {
          console.warn(`Failed to load image ${index + 1}`)
          loadedCount++
          setLoadingProgress((loadedCount / totalImages) * 100)
          resolve()
        }
        img.src = imageUrl
      })
    }

    const loadAllImages = async () => {
      const batchSize = 15

      for (let i = 0; i < images.length; i += batchSize) {
        const batch = images.slice(i, i + batchSize)
        const promises = batch.map((image, batchIndex) => loadImage(image, i + batchIndex))
        await Promise.all(promises)
      }

      onComplete(imageMap)
    }

    loadAllImages()
  }, [images, onComplete])

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-white">
      <div className="text-center text-black">
        <div className="mb-4">
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-300 ease-out"
              style={{width: `${loadingProgress}%`}}
            />
          </div>
        </div>
        <p className="text-sm opacity-75">Loading images... {Math.round(loadingProgress)}%</p>
        <p className="text-xs opacity-50 mt-1">
          {Math.round((loadingProgress / 100) * images.length)} of {images.length} images
        </p>
      </div>
    </div>
  )
}

// Gallery component - only renders after images are loaded
function ScrollGallery({
  images,
  preloadedImages,
  audioFile,
  isMobile,
}: {
  images: any[]
  preloadedImages: Map<string, HTMLImageElement>
  audioFile?: any
  isMobile: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)

  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Track scroll and update current frame
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      const scrollCompression = 0.8
      const newIndex = Math.floor((progress / scrollCompression) * images.length)
      const clampedIndex = Math.max(0, Math.min(newIndex, images.length - 1))
      if (clampedIndex !== currentFrameIndex) {
        setCurrentFrameIndex(clampedIndex)
      }
    })

    return unsubscribe
  }, [scrollYProgress, images.length, currentFrameIndex])

  // Calculate scroll height - reduced by 20% for faster animation
  const scrollHeight = Math.max(250, images.length * 6.4)

  // Get current image URL
  const currentImage = images[currentFrameIndex]
  const currentImageUrl = useMemo(() => urlForImage(currentImage)?.url(), [currentImage])

  return (
    <div ref={containerRef} style={{height: `${scrollHeight}vh`}} className="relative w-full">
      {/* Scroll-controlled audio */}
      {audioFile && (
        <ScrollControlledAudio
          audioFile={audioFile}
          scrollYProgress={scrollYProgress}
          isActive={true}
        />
      )}

      <div className="sticky top-0 w-full h-screen overflow-hidden bg-white">
        {currentImageUrl && preloadedImages.has(currentImageUrl) && (
          <img
            key={currentFrameIndex}
            src={currentImageUrl}
            alt={`Gallery image ${currentFrameIndex + 1}`}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="sync"
          />
        )}
      </div>
    </div>
  )
}

// Main component - handles state and switches between preloader and gallery
export function ScrollImageGallery({images, mobileImages, audioFile}: ScrollImageGalleryProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [preloadedImages, setPreloadedImages] = useState<Map<string, HTMLImageElement>>(new Map())
  const [isMounted, setIsMounted] = useState(false)

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Check screen size
  useEffect(() => {
    if (!isMounted) return

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [isMounted])

  // Choose images based on screen size
  const validImages = useMemo(() => {
    if (!isMounted) return images
    return isMobile ? (mobileImages && mobileImages.length > 0 ? mobileImages : images) : images
  }, [isMobile, mobileImages, images, isMounted])

  // Handle preload complete
  const handlePreloadComplete = (loadedImages: Map<string, HTMLImageElement>) => {
    setPreloadedImages(loadedImages)
    setIsReady(true)
  }

  if (!validImages || validImages.length === 0) {
    return null
  }

  // Show nothing during SSR
  if (!isMounted) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center bg-white">
        <div className="text-center text-black">
          <p className="text-sm opacity-75">Loading...</p>
        </div>
      </div>
    )
  }

  // Show preloader while loading images
  if (!isReady) {
    return <ImagePreloader images={validImages} onComplete={handlePreloadComplete} />
  }

  // Show gallery after images are loaded
  return (
    <ScrollGallery
      images={validImages}
      preloadedImages={preloadedImages}
      audioFile={audioFile}
      isMobile={isMobile}
    />
  )
}
