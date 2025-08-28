// @ts-nocheck
import CollectionSlugContent from '@/components/CollectionSlugContent'
import {sanityFetch} from '@/sanity/lib/live'
import {collectionBySlugQuery, marqueeTextQuery, slugsByTypeQuery} from '@/sanity/lib/queries'
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
  const {data} = await sanityFetch({query: collectionBySlugQuery, params})
  const {title} = data ?? {}

  return {
    title: title ? `${title} | Alexandre Diop` : 'Collection | Alexandre Diop',
  }
}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: slugsByTypeQuery,
    params: {type: 'collection'},
    stega: false,
    perspective: 'published',
  })
  return data
}

export default async function CollectionSlugRoute({params}: Props) {
  const [{data}, {data: marqueeData}] = await Promise.all([
    sanityFetch({query: collectionBySlugQuery, params}),
    sanityFetch({query: marqueeTextQuery}),
  ])

  // Only show the 404 page if we're in production, when in draft mode we might be about to create a page on this slug, and live reload won't work on the 404 route
  if (!data?._id && !(await draftMode()).isEnabled) {
    notFound()
  }

  // If the collection is private, show 404
  if (data?.isPrivate && !(await draftMode()).isEnabled) {
    notFound()
  }

  // Normalize isPrivate to undefined if null
  const normalizedData = data
    ? {...data, isPrivate: data.isPrivate === null ? undefined : data.isPrivate}
    : {}

  return <CollectionSlugContent data={normalizedData} marqueeText={marqueeData?.marqueeText} />
}
