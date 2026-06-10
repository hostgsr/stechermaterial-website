'use client'

import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react'

export interface CartItem {
  id: string
  title: string
  price: number
  slug?: string | null
  image?: string | null
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  totalQuantity: number
  totalPrice: number
  addItem: (item: Omit<CartItem, 'quantity'> & {quantity?: number}) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
}

const STORAGE_KEY = 'cart'

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({children}: {children: React.ReactNode}) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore malformed storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore quota / availability errors
    }
  }, [items, hydrated])

  const addItem = useCallback<CartContextValue['addItem']>((item) => {
    const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? {...i, quantity: i.quantity + quantity} : i))
      }
      return [...prev, {...item, quantity}]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? {...i, quantity} : i)),
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const totalQuantity = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      totalQuantity,
      totalPrice,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      openCart,
      closeCart,
    }),
    [items, isOpen, totalQuantity, totalPrice, addItem, removeItem, updateQuantity, clear, openCart, closeCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
