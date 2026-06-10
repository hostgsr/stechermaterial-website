'use client'

import {useCart} from './CartContext'

export default function CartButton() {
  const {totalQuantity, openCart, isOpen} = useCart()

  if (isOpen) return null

  return (
    <button
      onClick={openCart}
      className="hidden bottom-4 right-4 z-30 border border-black bg-white px-4 py-2 text-[14px] uppercase tracking-wider text-black transition-colors hover:bg-black hover:text-white"
    >
      Cart ({totalQuantity})
    </button>
  )
}
