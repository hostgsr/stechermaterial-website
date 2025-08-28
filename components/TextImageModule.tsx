// @ts-nocheck
'use client'

import React from 'react'
import {CustomPortableText} from './CustomPortableText'
import ImageComponent from './ImageComponent'

interface TextImageModuleProps {
  layout: 'text-left' | 'image-left' | 'text-only' | 'image-only'
  text?: any[]
  image?: any
  imageCaption?: string
}

export const TextImageModule: React.FC<TextImageModuleProps> = ({
  layout,
  text,
  image,
  imageCaption,
}) => {
  const renderText = () => {
    if (!text || text.length === 0) return null

    return (
      <div className="flex flex-col justify-center">
        <CustomPortableText value={text} />
      </div>
    )
  }

  const renderImage = () => {
    if (!image) return null

    return (
      <div className="flex flex-col">
        <ImageComponent
          image={image}
          placeholderSrc={image}
          classname="w-full h-auto object-cover"
        />
        {imageCaption && <p className="text-sm text-gray-400 mt-2 italic">{imageCaption}</p>}
      </div>
    )
  }

  // Handle different layouts
  switch (layout) {
    case 'text-left':
      return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          <div className="w-full lg:w-1/2">{renderText()}</div>
          <div className="w-full lg:w-1/2">{renderImage()}</div>
        </div>
      )

    case 'image-left':
      return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          <div className="w-full lg:w-1/2">{renderImage()}</div>
          <div className="w-full lg:w-1/2">{renderText()}</div>
        </div>
      )

    case 'text-only':
      return <div className="w-full max-w-4xl mx-auto">{renderText()}</div>

    case 'image-only':
      return <div className="w-full max-w-4xl mx-auto">{renderImage()}</div>

    default:
      return null
  }
}
