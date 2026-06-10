'use client'

import {useState} from 'react'
import {useCart} from './CartContext'

export default function CartDrawer() {
  const {items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, clear} = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (items.length === 0) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          items: items.map((i) => ({
            title: i.title,
            price: i.price,
            productId: i.id,
            slug: i.slug,
            image: i.image,
            quantity: i.quantity,
          })),
        }),
      })
      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
        return
      }
      setError(data.error || 'Checkout is currently unavailable.')
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!isOpen}
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Drawer */}
      <aside
        aria-hidden={!isOpen}
        className={`fixed inset-x-0 bottom-0 z-50 flex flex-col bg-white text-black border-t border-black transition-transform duration-300 ease-out
          h-full md:h-[30vh]
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black px-4 py-3 text-[14px]">
          <span className="uppercase tracking-wider">Cart</span>
          <button onClick={closeCart} className="underline underline-offset-2">
            Close
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <p className="py-6 text-[14px]">Your cart is empty.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3 text-[14px]"
                >
                  <span className="truncate">{item.title}</span>

                  <div className="flex items-center gap-2">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-6 w-6 border border-black leading-none"
                    >
                      −
                    </button>
                    <span className="w-6 text-center tabular-nums">{item.quantity}</span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-6 w-6 border border-black leading-none"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-3 justify-self-end">
                    <span className="tabular-nums">€{(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      aria-label="Remove item"
                      onClick={() => removeItem(item.id)}
                      className="text-gray-500 underline underline-offset-2"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer / totals */}
        <div className="border-t border-black px-4 py-3 text-[14px]">
          {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="uppercase tracking-wider">Total</span>
              {items.length > 0 && (
                <button onClick={clear} className="text-gray-500 underline underline-offset-2">
                  Clear
                </button>
              )}
            </div>
            <span className="tabular-nums">€{totalPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={items.length === 0 || loading}
            className="mt-3 w-full border border-black px-4 py-2 uppercase tracking-wider transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Checkout'}
          </button>
        </div>
      </aside>
    </>
  )
}
