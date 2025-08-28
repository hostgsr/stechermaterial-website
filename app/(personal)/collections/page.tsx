// @ts-nocheck
import {CollectionsPageContent} from '@/components/CollectionsPageContent'
import {sanityFetch} from '@/sanity/lib/live'
import {allCollectionsQuery, marqueeTextQuery} from '@/sanity/lib/queries'
import {Suspense} from 'react'

export default async function CollectionsPage() {
  const [{data: collections}, {data: marqueeData}] = await Promise.all([
    sanityFetch({query: allCollectionsQuery}),
    sanityFetch({query: marqueeTextQuery}),
  ])

  if (!collections || collections.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No collections found.</p>
      </div>
    )
  }

  // Normalize isPrivate to undefined if null for each collection
  const normalizedCollections = collections.map((col: any) => ({
    ...col,
    isPrivate: col.isPrivate === null ? undefined : col.isPrivate,
  }))

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CollectionsPageContent
        collections={normalizedCollections}
        marqueeText={marqueeData?.marqueeText}
      />
    </Suspense>
  )
}
