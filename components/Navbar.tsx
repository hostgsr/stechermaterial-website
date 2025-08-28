// @ts-nocheck
import {OptimisticSortOrder} from '@/components/OptimisticSortOrder'
import type {SettingsQueryResult} from '@/sanity.types'
import {studioUrl} from '@/sanity/lib/api'
import {resolveHref} from '@/sanity/lib/utils'
import {createDataAttribute, stegaClean} from 'next-sanity'
import Link from 'next/link'

interface NavbarProps {
  data: SettingsQueryResult
}
export function Navbar(props: NavbarProps) {
  const {data} = props

  return (
    <>
      <header className="sticky top-0 z-10 flex bg-black flex-wrap items-center justify-between px-3 pt-5   lg:px-10 ">
        <div>Alexandre Diop</div>
        <div className="flex flex-row gap-x-5">
          <OptimisticSortOrder id={data?._id!} path="menuItems">
            {data?.menuItems?.map((menuItem) => {
              const href = resolveHref(menuItem?._type, menuItem?.slug)
              if (!href) {
                return null
              }
              return (
                <Link
                  key={menuItem._key}
                  // className={`text-lg hover:text-black md:text-xl ${
                  //   menuItem?._type === 'home' ? 'font-extrabold text-black' : 'text-gray-600'
                  // }`}

                  href={href}
                >
                  {stegaClean(menuItem.title)}
                </Link>
              )
            })}
          </OptimisticSortOrder>
        </div>
        <div className="h-[1px] bg-white w-full mt-4 "></div>
      </header>
    </>
  )
}
