import {NextResponse, type NextRequest} from 'next/server'
import Stripe from 'stripe'

interface CheckoutItem {
  title?: string
  price?: number
  productId?: string
  slug?: string
  image?: string
  quantity?: number
}

interface CheckoutRequestBody extends CheckoutItem {
  items?: CheckoutItem[]
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    return NextResponse.json(
      {error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to your environment.'},
      {status: 500},
    )
  }

  const stripe = new Stripe(secretKey)

  try {
    const body: CheckoutRequestBody = await req.json()
    // Accept either a list of items (cart) or a single product (backward compatible).
    const rawItems: CheckoutItem[] = body.items && body.items.length > 0 ? body.items : [body]

    const lineItems = rawItems
      .filter(
        (item) =>
          item.title && typeof item.price === 'number' && Number.isFinite(item.price) && item.price > 0,
      )
      .map((item) => ({
        quantity: item.quantity && item.quantity > 0 ? Math.floor(item.quantity) : 1,
        price_data: {
          currency: 'eur',
          unit_amount: Math.round((item.price as number) * 100),
          product_data: {
            name: item.title as string,
            ...(item.image ? {images: [item.image]} : {}),
          },
        },
      }))

    if (lineItems.length === 0) {
      return NextResponse.json({error: 'Invalid product data.'}, {status: 400})
    }

    const origin =
      req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${origin}/shop?checkout=success`,
      cancel_url: `${origin}/shop?checkout=cancelled`,
    })

    return NextResponse.json({url: session.url})
  } catch (err) {
    console.error('Stripe checkout error', err)
    return NextResponse.json({error: 'Unable to start checkout.'}, {status: 500})
  }
}
