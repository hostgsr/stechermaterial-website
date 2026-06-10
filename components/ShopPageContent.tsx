'use client'

import BuyButton from '@/components/BuyButton'
import {urlForImage} from '@/sanity/lib/utils'
import {PortableText} from 'next-sanity'
import {useEffect, useRef, useState} from 'react'

interface ShopProduct {
  _id: string
  title?: string | null
  slug?: string | null
  price?: number | null
  description?: any[] | null
  productPhotos?: any[] | null
}

interface ShopCollection {
  _key: string
  title?: string | null
  products?: ShopProduct[] | null
}

interface ShopPageContentProps {
  data: {
    _id?: string | null
    title?: string | null
    collections?: ShopCollection[] | null
  } | null
}

const getProductCoverUrl = (product: ShopProduct) => {
  const photos = product?.productPhotos || []
  return photos[0]
    ? urlForImage(photos[0])?.width(600).height(600).fit('crop').url()
    : null
}

function CollectionGrid({collection}: {collection: ShopCollection}) {
  const products = collection.products || []
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const [lastExpanded, setLastExpanded] = useState<string | null>(null)
  const productRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const scrollPositions = useRef<Record<string, number>>({})

  const isExpanded = (key: string) => expandedKeys.includes(key)

  const expandProduct = (key: string) => {
    scrollPositions.current[key] = window.scrollY
    setExpandedKeys((prev) => (prev.includes(key) ? prev : [...prev, key]))
    setLastExpanded(key)
  }

  const collapseProduct = (key: string) => {
    setExpandedKeys((prev) => prev.filter((k) => k !== key))
    setLastExpanded(null)
    const savedY = scrollPositions.current[key]
    if (savedY != null) {
      window.scrollTo({top: savedY, behavior: 'smooth'})
    }
  }

  useEffect(() => {
    if (lastExpanded === null) return
    const el = productRefs.current[lastExpanded]
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'})
    }
  }, [lastExpanded, expandedKeys])

  const renderExpandedProduct = (
    product: ShopProduct,
    key: string,
    variant: 'mobile' | 'desktop',
  ) => {
    const photos = product.productPhotos || []
    return (
      <div
        key={`expanded-${key}`}
        ref={(el) => {
          productRefs.current[key] = el
        }}
        className={
          variant === 'desktop'
            ? 'col-span-4 overflow-hidden scroll-mt-4'
            : 'overflow-hidden scroll-mt-4'
        }
      >
        <button
          className="mb-2 underline underline-offset-2"
          onClick={(e) => {
            e.stopPropagation()
            collapseProduct(key)
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
          <p>{product.title}</p>
          {product.price != null && <p>€{product.price.toFixed(2)}</p>}
          {product.description && (
            <div className="mt-2 whitespace-pre-line">
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
  }

  const renderProductThumbnail = (
    product: ShopProduct,
    key: string,
    variant: 'mobile' | 'desktop',
  ) => {
    const coverImageUrl = getProductCoverUrl(product)
    const className =
      variant === 'desktop'
        ? 'col-span-1 overflow-hidden group cursor-pointer'
        : 'overflow-hidden cursor-pointer'

    return (
      <div
        key={`thumb-${key}`}
        className={className}
        onClick={(e) => {
          e.stopPropagation()
          expandProduct(key)
        }}
      >
        {coverImageUrl && (
          <div className="w-full overflow-hidden">
            <img
              src={coverImageUrl}
              alt={product.title || 'Product'}
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

  if (products.length === 0) return null

  return (
    <div className="mb-12">
      {collection.title && (
        <h2 className="text-[14px] mb-4 border-b border-black pb-2">{collection.title}</h2>
      )}

      {/* Mobile Layout */}
      <div className="md:hidden grid grid-cols-2 gap-2">
        {products.map((product, index) => {
          const key = `${product._id}-${index}`
          return isExpanded(key)
            ? renderExpandedProduct(product, key, 'mobile')
            : renderProductThumbnail(product, key, 'mobile')
        })}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-4 gap-4 items-start grid-flow-row-dense">
        {products.map((product, index) => {
          const key = `${product._id}-${index}`
          return isExpanded(key)
            ? renderExpandedProduct(product, key, 'desktop')
            : renderProductThumbnail(product, key, 'desktop')
        })}
      </div>
    </div>
  )
}

export default function ShopPageContent({data}: ShopPageContentProps) {
  const collections = data?.collections || []

  return (
    <div className="relative bg-white text-black min-h-screen">
      <div className="px-4 py-8">
        {collections.length === 0 ? (
          <div className="text-center py-8">
            <p>No products found.</p>
          </div>
        ) : (
          collections.map((collection) => (
            <CollectionGrid key={collection._key} collection={collection} />
          ))
        )}
      </div>
    </div>
  )
}
