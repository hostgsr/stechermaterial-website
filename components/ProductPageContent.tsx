'use client'

import {urlForImage} from '@/sanity/lib/utils'
import {PortableText} from 'next-sanity'
import Image from 'next/image'
import {useState} from 'react'

interface ProductPageContentProps {
  data: {
    _id?: string | null
    _type?: string | null
    title?: string | null
    slug?: string | null
    price?: number | null
    description?: any[] | null
    photos?: any[] | null
  }
}

export default function ProductPageContent({data}: ProductPageContentProps) {
  const {title, price, description, photos} = data
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const selectedImage = photos?.[selectedImageIndex]
  const selectedImageUrl = selectedImage
    ? urlForImage(selectedImage)?.width(1400).height(1400).fit('max').url()
    : null

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-8 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {/* Main Image - spans 2 columns */}
          {selectedImageUrl && (
            <div className="col-span-1 md:col-span-2">
              <Image
                src={selectedImageUrl}
                alt={selectedImage?.alt || title || 'Product image'}
                width={1400}
                height={1400}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          )}

          {/* Product Info - spans 2 columns */}
          <div className="col-span-1 md:col-span-2 text-black text-sm self-start">
            <h1 className="text-sm font-normal">{title}</h1>

            {price != null && (
              <p className="mt-2">€{price.toFixed(2)}</p>
            )}

            {description && (
              <div className="mt-4 whitespace-pre-line">
                <PortableText value={description} />
              </div>
            )}

            <button
              disabled
              className="mt-6 border border-black px-4 py-2 text-[10px] uppercase tracking-wider opacity-50 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>

          {/* Additional Images */}
          {photos && photos.length > 1 && (
            photos.slice(1).map((photo, index) => {
              const imageUrl = urlForImage(photo)?.width(1400).height(1400).fit('max').url()
              if (!imageUrl) return null
              return (
                <div
                  key={index}
                  className="overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImageIndex(index + 1)}
                >
                  <Image
                    src={imageUrl}
                    alt={photo?.alt || `${title} - ${index + 2}`}
                    width={1400}
                    height={1400}
                    className="w-full h-auto object-contain"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
