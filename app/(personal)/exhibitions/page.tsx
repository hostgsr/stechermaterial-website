// @ts-nocheck
import {ExhibitionsPageContent} from '@/components/ExhibitionsPageContent'
import {sanityFetch} from '@/sanity/lib/live'
import {allExhibitionsQuery, marqueeTextQuery} from '@/sanity/lib/queries'
import {Suspense} from 'react'

// ISR configuration to prevent excessive regeneration
export const revalidate = 1800 // Revalidate at most once per 30 minutes

export default async function ExhibitionsPage() {
  const [{data: exhibitions}, {data: marqueeData}] = await Promise.all([
    sanityFetch({query: allExhibitionsQuery}),
    sanityFetch({query: marqueeTextQuery}),
  ])

  if (!exhibitions || exhibitions.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No exhibitions found.</p>
      </div>
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExhibitionsPageContent exhibitions={exhibitions} marqueeText={marqueeData?.marqueeText} />
    </Suspense>
  )
}
