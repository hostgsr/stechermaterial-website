// @ts-nocheck
'use client'

import {urlForFullQualityImage, urlForImage, urlForUltraQualityImage} from '@/sanity/lib/utils'
import {motion} from 'framer-motion'
import React, {useEffect, useRef, useState} from 'react'
import {useInView} from 'react-intersection-observer'

const ImageComponent = ({
  image,
  placeholderSrc,
  classname = '',
  fullQuality = false, // High quality with 100% quality + format optimization
  ultraQuality = false, // Ultra quality with original format and no compression
}) => {
  const [imgIsLoading, setImgIsLoading] = useState(true)
  const imgRef = useRef(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      setImgIsLoading(false)
    }
  }, [inView])

  // Guard clause to prevent render if image is undefined
  if (!image) {
    return (
      <div className={`relative  ${classname} `}>
        <div className="w-full h-full bg-gray-200 rounded-lg"></div>
      </div>
    )
  }

  // Safely access dimensions
  const width =
    placeholderSrc?.metadata?.dimensions?.width || placeholderSrc?.dimensions?.width || 800 // fallback width
  const height =
    placeholderSrc?.metadata?.dimensions?.height || placeholderSrc?.dimensions?.height || 600 // fallback height

  // Safely access LQIP
  const lqip = placeholderSrc?.metadata?.lqip || placeholderSrc?.lqip || null

  // Get image URLs - conditional logic for quality levels
  let imageUrl, imageUrl1600, imageUrl1920, imageUrl2560, imageUrl1024, imageUrl1200, imageUrl1400

  if (ultraQuality) {
    // For ultra quality, use original format with no compression
    const baseUrl = urlForUltraQualityImage(image)
    imageUrl = baseUrl?.url() // Original quality and format
    imageUrl1600 = baseUrl?.width(1600).url()
    imageUrl1920 = baseUrl?.width(1920).url()
    imageUrl2560 = baseUrl?.width(2560).url()
    imageUrl1024 = baseUrl?.width(1024).url()
    imageUrl1200 = baseUrl?.width(1200).url()
    imageUrl1400 = baseUrl?.width(1400).url()
  } else if (fullQuality) {
    // For full quality, use original dimensions or very high quality
    const baseUrl = urlForFullQualityImage(image)
    imageUrl = baseUrl?.url() // Maximum quality, no width constraint
    imageUrl1600 = baseUrl?.width(1600).url()
    imageUrl1920 = baseUrl?.width(1920).url()
    imageUrl2560 = baseUrl?.width(2560).url()
    imageUrl1024 = baseUrl?.width(1024).url()
    imageUrl1200 = baseUrl?.width(1200).url()
    imageUrl1400 = baseUrl?.width(1400).url()
  } else {
    // Default behavior for regular images
    imageUrl = urlForImage(image)?.width(1920).url()
    imageUrl1600 = urlForImage(image)?.width(1600).url()
    imageUrl1920 = urlForImage(image)?.width(1920).url()
    imageUrl2560 = urlForImage(image)?.width(2560).url()
    imageUrl1024 = urlForImage(image)?.width(1024).url()
    imageUrl1200 = urlForImage(image)?.width(1200).url()
    imageUrl1400 = urlForImage(image)?.width(1400).url()
  }

  // If no valid image URL, show placeholder
  if (!imageUrl) {
    return (
      <div className={`relative  ${classname} `}>
        <div className="w-full h-full bg-gray-200 rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className={`relative  ${classname} `}>
      {lqip && (
        <motion.img
          initial={{opacity: 1}}
          src={lqip}
          alt="Loading..."
          width={width}
          height={height}
          loading="lazy"
          className={`${classname} absolute h-full w-full z-[-1]`}
          ref={ref}
        />
      )}
      <picture>
        {/* Only include these sources if image exists */}
        {image && (
          <>
            <source
              media="(min-width: 1440px)"
              srcSet={`${imageUrl1600 || imageUrl} 1600w,
                 ${imageUrl1920 || imageUrl} 1920w,
                 ${imageUrl2560 || imageUrl} 2560w`}
              sizes={
                fullQuality || ultraQuality
                  ? '(min-width: 1440px) 100vw, 100vw'
                  : '(min-width: 1440px) 1390px, 100vw'
              }
            />
            <source
              media="(min-width: 1024px)"
              srcSet={`${imageUrl1024 || imageUrl} 1024w,
                 ${imageUrl1200 || imageUrl} 1200w,
                 ${imageUrl1400 || imageUrl} 1400w`}
              sizes={
                fullQuality || ultraQuality
                  ? '(min-width: 1024px) 100vw, 100vw'
                  : '(min-width: 1024px) calc((100vw - 50px) / 12 * 3), 100vw'
              }
            />

            <motion.img
              ref={imgRef}
              initial={{opacity: 1}}
              animate={{opacity: imgIsLoading ? 1 : 1}}
              src={imageUrl}
              width={width}
              height={height}
              alt="alt text"
              className={`w-full h-full  ${classname}`}
              loading="lazy"
            />
          </>
        )}
      </picture>
    </div>
  )
}

export default ImageComponent
