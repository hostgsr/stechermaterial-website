import {urlForImage} from '@/sanity/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
  product: {
    _id?: string
    title?: string | null
    slug?: string | null
    price?: number | null
    photos?: any[] | null
  }
}

export default function ProductCard({product}: ProductCardProps) {
  const {title, slug, price, photos} = product
  const photo = photos
  const imageUrl = photo ? urlForImage(photo)?.width(600).height(600).fit('crop').url() : null

  if (!slug) return null

  return (
    <Link
      href={`/products/${slug}`}
      className="group block overflow-hidden border border-gray-200 transition-shadow hover:shadow-md"
    >
      {imageUrl && (
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
          <Image
            src={imageUrl}
            alt={title || 'Product'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 300px"
          />
        </div>
      )}
      <div className="p-3">
        <h3 className="text-sm font-medium group-hover:underline">{title}</h3>
        {price != null && (
          <p className="mt-1 text-sm text-gray-600">€{price.toFixed(2)}</p>
        )}
      </div>
    </Link>
  )
}
