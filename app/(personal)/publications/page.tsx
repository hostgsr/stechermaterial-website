// @ts-nocheck
import {PublicationContentPage} from '@/components/PublicationContentPage'
import {sanityFetch} from '@/sanity/lib/live'
import {allPublicationsQuery, homePageQuery} from '@/sanity/lib/queries'

export default async function PublicationsPage() {
  // Fetch publications from publication documents
  const {data: publicationsData} = await sanityFetch({query: allPublicationsQuery})

  // Fetch home page data for marquee text and publication text
  const {data: homeData} = await sanityFetch({query: homePageQuery})

  if (!publicationsData) {
    return <div>No publications found</div>
  }

  // Filter out null values and cast to Publication[]
  const publications = (publicationsData || []).filter((pub): pub is any => pub !== null)

  return (
    <PublicationContentPage
      publications={publications}
      publicationText={(homeData?.publicationText as any) || undefined}
      marqueeText={homeData?.marqueeText}
    />
  )
}
