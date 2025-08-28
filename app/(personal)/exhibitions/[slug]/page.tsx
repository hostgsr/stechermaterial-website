// @ts-nocheck
import ExhibitionSlugContent from '@/components/ExhibitionSlugContent'
import {sanityFetch} from '@/sanity/lib/live'
import {exhibitionBySlugQuery, marqueeTextQuery, slugsByTypeQuery} from '@/sanity/lib/queries'
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
  const {data} = await sanityFetch({query: exhibitionBySlugQuery, params})
  const {title} = data ?? {}

  return {
    title: title ? `${title} | Alexandre Diop` : 'Exhibition | Alexandre Diop',
  }
}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: slugsByTypeQuery,
    params: {type: 'exhibition'},
    stega: false,
    perspective: 'published',
  })
  return data
}

export default async function ExhibitionSlugRoute({params}: Props) {
  const [{data}, {data: marqueeData}] = await Promise.all([
    sanityFetch({query: exhibitionBySlugQuery, params}),
    sanityFetch({query: marqueeTextQuery}),
  ])

  // Only show the 404 page if we're in production, when in draft mode we might be about to create a page on this slug, and live reload won't work on the 404 route
  if (!data?._id && !(await draftMode()).isEnabled) {
    notFound()
  }

  return <ExhibitionSlugContent data={data ?? {}} marqueeText={marqueeData?.marqueeText} />
}
