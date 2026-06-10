'use client'

import {useCart} from '@/components/cart/CartContext'

interface BuyButtonProps {
  title?: string | null
  price?: number | null
  productId?: string | null
  slug?: string | null
  image?: string | null
  className?: string
}

const defaultClassName =
  'mt-6 border border-black px-4 py-2 uppercase tracking-wider transition-colors hover:bg-black hover:text-white'

export default function BuyButton({title, price, productId, slug, image, className}: BuyButtonProps) {
  const {addItem, openCart} = useCart()

  if (price == null || !title) return null

  const handleAdd = () => {
    addItem({
      id: productId || slug || title,
      title,
      price,
      slug,
      image,
    })
    openCart()
  }

  return (
    <button onClick={handleAdd} className={className ?? defaultClassName}>
      Add to Cart
    </button>
  )
}
