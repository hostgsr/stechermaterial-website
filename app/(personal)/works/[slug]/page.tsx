// @ts-nocheck
import WorkSlugContent from '@/components/WorkSlugContent'
import {sanityFetch} from '@/sanity/lib/live'
import {marqueeTextQuery, slugsByTypeQuery, workBySlugQuery} from '@/sanity/lib/queries'
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
  const {data} = await sanityFetch({query: workBySlugQuery, params})
  const {title} = data ?? {}

  return {
    title: title ? `${title} | Alexandre Diop` : 'Work | Alexandre Diop',
  }
}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: slugsByTypeQuery,
    params: {type: 'work'},
    stega: false,
    perspective: 'published',
  })
  return data
}

export default async function WorkSlugRoute({params}: Props) {
  const [{data}, {data: marqueeData}] = await Promise.all([
    sanityFetch({query: workBySlugQuery, params}),
    sanityFetch({query: marqueeTextQuery}),
  ])

  // Only show the 404 page if we're in production, when in draft mode we might be about to create a page on this slug, and live reload won't work on the 404 route
  if (!data?._id && !(await draftMode()).isEnabled) {
    notFound()
  }

  return <WorkSlugContent data={data ?? {}} marqueeText={marqueeData?.marqueeText} />
}
