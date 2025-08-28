// @ts-nocheck
import {WorksPageContent} from '@/components/WorksPageContent'
import {sanityFetch} from '@/sanity/lib/live'
import {marqueeTextQuery, worksByYearQuery} from '@/sanity/lib/queries'
import {Suspense} from 'react'

export default async function WorksPage() {
  const [{data: worksData}, {data: marqueeData}] = await Promise.all([
    sanityFetch({query: worksByYearQuery}),
    sanityFetch({query: marqueeTextQuery}),
  ])

  if (!worksData) {
    return (
      <div className="text-center py-8">
        <p>No works found.</p>
      </div>
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorksPageContent worksData={worksData} marqueeText={marqueeData?.marqueeText} />
    </Suspense>
  )
}
