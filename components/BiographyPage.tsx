// @ts-nocheck
'use client'

import {urlForImage} from '@/sanity/lib/utils'
import type {PortableTextBlock} from 'next-sanity'
import React from 'react'
import {CustomPortableText} from './CustomPortableText'
import ImageComponent from './ImageComponent'
import {TextImageModule} from './TextImageModule'
import {WorksNavigation} from './WorksNavigation'

interface BiographyPageProps {
  bioModules?: any[]
  marqueeText?: string
}

export const BiographyPage: React.FC<BiographyPageProps> = ({bioModules, marqueeText}) => {
  return (
    <>
      <WorksNavigation marqueeText={marqueeText} />
      <div className="min-h-[80vh] bg-black text-white lg:px-10 px-5">
        <div className="py-10 space-y-16">
          {/* Bio Modules */}
          {bioModules && bioModules.length > 0 ? (
            bioModules.map((module, index) => (
              <div key={index} className="w-full">
                <TextImageModule
                  layout={module.layout}
                  text={module.text}
                  image={module.image}
                  imageCaption={module.imageCaption}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400">
              No biography content available. Please add bio modules in the CMS.
            </div>
          )}

          {/* Contact Links - Always at the bottom */}
          <div className="flex flex-row justify-start items-end mt-16 pt-8 border-t border-white">
            <a
              href="mailto:lejeunediable@gmail.com"
              className="hover:underline hover:underline-offset-4"
            >
              Contact
            </a>
            <span className="mx-2">/</span>
            <a
              href="https://www.instagram.com/lejeunediable/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:underline-offset-4"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
