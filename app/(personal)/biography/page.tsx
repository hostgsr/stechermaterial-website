// @ts-nocheck
import {BiographyPage} from '@/components/BiographyPage'
import {sanityFetch} from '@/sanity/lib/live'
import {homePageQuery} from '@/sanity/lib/queries'

export default async function BiographyPageRoute() {
  const {data} = await sanityFetch({query: homePageQuery})

  if (!data) {
    return <div className="text-center text-white">No biography data found</div>
  }

  return <BiographyPage bioModules={data.bioModules} marqueeText={data.marqueeText} />
}
