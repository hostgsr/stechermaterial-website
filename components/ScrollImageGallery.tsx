'use client'

import {urlForImage} from '@/sanity/lib/utils'
import {motion, useScroll, useTransform} from 'framer-motion'
import {useEffect, useRef, useState} from 'react'

interface ScrollImageGalleryProps {
  images: any[]
  mobileImages: any[]
}

interface ImageItemProps {
  image: any
  index: number
  totalImages: number
  scrollYProgress: any
  isMobile: boolean
}

function ImageItem({image, index, totalImages, scrollYProgress, isMobile}: ImageItemProps) {
  // Calculate when this image should be visible based on scroll
  const start = index / totalImages
  const end = (index + 1) / totalImages
  const isLastImage = index === totalImages - 1

  const opacity = useTransform(
    scrollYProgress,
    isLastImage
      ? [Math.max(0, start - 0.1), start, 1] // Last image stays visible until end
      : [Math.max(0, start - 0.1), start, end, Math.min(1, end + 0.1)],
    isLastImage
      ? [0, 1, 1] // Last image stays at full opacity
      : [0, 1, 1, 0],
  )

  const scale = useTransform(scrollYProgress, [start, end], [1, 1.05])

  return (
    <motion.div
      key={`${isMobile ? 'mobile' : 'desktop'}-${index}`}
      className="absolute inset-0 w-full h-screen"
      style={{opacity}}
    >
      <motion.img
        src={urlForImage(image)?.url()}
        alt={`Gallery image ${index + 1}`}
        className="w-full h-full object-cover"
        style={{scale}}
      />
    </motion.div>
  )
}

export function ScrollImageGallery({images, mobileImages}: ScrollImageGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Check screen size and set mobile state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check initial screen size
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize)

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Choose images based on screen size
  const validImages = isMobile
    ? mobileImages && mobileImages.length > 0
      ? mobileImages
      : images
    : images

  if (!validImages || validImages.length === 0) {
    return null
  }

  return (
    <div
      ref={containerRef}
      style={{height: `${validImages.length * 100}vh`}}
      className="relative w-full"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {validImages.map((image, index) => (
          <ImageItem
            key={`${isMobile ? 'mobile' : 'desktop'}-${index}`}
            image={image}
            index={index}
            totalImages={validImages.length}
            scrollYProgress={scrollYProgress}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  )
}
