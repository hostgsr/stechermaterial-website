import ProductPageContent from '@/components/ProductPageContent'
import {sanityFetch} from '@/sanity/lib/live'
import {productBySlugQuery, slugsByTypeQuery} from '@/sanity/lib/queries'
import type {Metadata, ResolvingMetadata} from 'next'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateMetadata(
  {params}: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const {data} = await sanityFetch({query: productBySlugQuery, params, stega: false})
  const {title, price} = data ?? {}

  return {
    title: title ? `${title} | Shop` : 'Product | Shop',
    description: price ? `€${price}` : undefined,
  }
}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: slugsByTypeQuery,
    params: {type: 'product'},
    stega: false,
    perspective: 'published',
  })
  return data
}

export default async function ProductSlugRoute({params}: Props) {
  const {data} = await sanityFetch({query: productBySlugQuery, params})

  if (!data?._id && !(await draftMode()).isEnabled) {
    notFound()
  }

  return <ProductPageContent data={data ?? {}} />
}
