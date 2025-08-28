// @ts-nocheck
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import Marquee from './Marquee'

interface WorksNavigationProps {
  marqueeText?: string
}

export const WorksNavigation: React.FC<WorksNavigationProps> = ({marqueeText}) => {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  return (
    <header className="sticky top-0 z-10 flex flex-wrap overflow-hidden items-center justify-between bg-black px-3 pt-5 lg:px-10">
      <Link href="/" className="">
        Alexandre Diop
      </Link>
      <div className="flex-1 ">
        <Marquee
          text={
            marqueeText ||
            'Contemporary African Art • Mixed Media Sculpture • Found Objects • Cultural Heritage'
          }
          speed={25}
        />
      </div>
      <div className="flex flex-row">
        <Link
          href="/biography"
          className={`hover:underline hover:underline-offset-4 ${isActive('/biography') ? 'underline underline-offset-4' : ''}`}
        >
          Biography
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/works"
          className={`hover:underline hover:underline-offset-4 ${isActive('/works') ? 'underline underline-offset-4' : ''}`}
        >
          Works
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/exhibitions"
          className={`hover:underline hover:underline-offset-4 ${isActive('/exhibitions') ? 'underline underline-offset-4' : ''}`}
        >
          Exhibitions
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/collections"
          className={`hover:underline hover:underline-offset-4 ${isActive('/collections') ? 'underline underline-offset-4' : ''}`}
        >
          Collections
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/publications"
          className={`hover:underline hover:underline-offset-4 ${isActive('/publications') ? 'underline underline-offset-4' : ''}`}
        >
          Publications
        </Link>
      </div>
      <div className="h-[1px] bg-white w-full mt-4"></div>
    </header>
  )
}
