import ShopPageContent from '@/components/ShopPageContent'
import {sanityFetch} from '@/sanity/lib/live'
import {shopQuery} from '@/sanity/lib/queries'
import type {Metadata} from 'next'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({query: shopQuery, stega: false})
  return {
    title: data?.title ? `${data.title} | Shop` : 'Shop',
  }
}

export default async function ShopRoute() {
  const {data} = await sanityFetch({query: shopQuery})

  return <ShopPageContent data={data ?? null} />
}
