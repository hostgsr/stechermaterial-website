// @ts-nocheck
'use client'

import {motion} from 'framer-motion'
import {PortableTextBlock} from 'next-sanity'
import Link from 'next/link'
import React, {useState} from 'react'
import CurrentShows from './CurrentShows'
import {CustomPortableText} from './CustomPortableText'
import ImageGallery from './ImageGallery'
import Marquee from './Marquee'
import MusicBlock from './MusicBlock' // Add this import

import SpecialProjects from './SpecialProjects'
import StackedImagesReveal from './StackedImagesReveal'

const HomePageContent = (data) => {
  const content = data.data

  // Console.log removed to prevent ISR write issues

  const [imagesAnimationComplete, setImagesAnimationComplete] = useState(true) // Set to true to disable animation

  // Listen for animation completion from StackedImagesReveal
  const handleImagesAnimationComplete = () => {
    setImagesAnimationComplete(true)
  }

  // ANIMATION TIMING CONFIGURATION - Change these values to adjust timing
  const ANIMATION_DELAYS = {
    // Step 1: Images (handled by StackedImagesReveal component)
    IMAGES: 0, // First (assuming this takes about 1s to complete)

    // Step 2: Alexandre Diop appears right after images complete
    ALEXANDRE_DIOP: 0, // No delay after images complete

    // Step 3: Lines appear after Alexandre Diop animation (0.6s) + 1000ms pause
    LINES: 1.6, // 0.6s (Alexandre animation) + 1.0s pause = 1.6s

    // Step 4: Navigation and content after lines animation (0.8s) + 300ms pause
    NAVIGATION_AND_CONTENT: 2, // 1.6s (lines start) + 0.8s (lines animation) + 0.3s pause = 2.7s
  }

  // Animation variants for reusable animations
  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delay between each child animation
        delayChildren: 0, // Additional delay before children start
      },
    },
  }

  const listItemVariants = {
    hidden: {opacity: 0, y: 20},
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1, // Stagger each item by 100ms
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  }

  return (
    <>
      <header className="sticky bg-blur bg-[#000000] overflow-hidden top-0 z-10 flex flex-wrap items-center justify-between px-3 pt-5 lg:px-10 min-h-[60px]">
        {/* STEP 2: Alexandre Diop - Appears immediately after images complete */}
        <motion.div
          initial={{opacity: 0}}
          animate={{
            opacity: imagesAnimationComplete ? 1 : 0,
          }}
          transition={{
            duration: 0.9,
            delay: ANIMATION_DELAYS.ALEXANDRE_DIOP,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          Alexandre Diop
        </motion.div>

        {/* Marquee - Appears with Alexandre Diop */}
        <motion.div
          className="flex-1 "
          initial={{opacity: 0}}
          animate={{
            opacity: imagesAnimationComplete ? 1 : 0,
          }}
          transition={{
            duration: 0.9,
            delay: ANIMATION_DELAYS.ALEXANDRE_DIOP + 0.3, // Slight delay after Alexandre Diop
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <Marquee
            text={
              content.marqueeText ||
              'Contemporary African Art • Mixed Media Sculpture • Found Objects • Cultural Heritage'
            }
            speed={30}
          />
        </motion.div>

        {/* STEP 4: Navigation Menu - Appears after lines + 300ms pause */}
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: imagesAnimationComplete ? 1 : 0}}
          transition={{
            duration: 0.6,
            delay: ANIMATION_DELAYS.NAVIGATION_AND_CONTENT,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <ul className="flex flex-row gap-x-2">
            {[
              {name: 'Biography', href: '/biography'},
              {name: 'Works', href: '/works'},
              {name: 'Exhibitions', href: '/exhibitions'},
              {name: 'Collections', href: '/collections'},
              {name: 'Publications', href: '/publications'},
            ].map((item, index, array) => (
              <React.Fragment key={item.name}>
                <motion.li
                  initial={{opacity: 0}}
                  animate={{
                    opacity: imagesAnimationComplete ? 1 : 0,
                    y: imagesAnimationComplete ? 0 : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: ANIMATION_DELAYS.NAVIGATION_AND_CONTENT,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <Link href={item.href} className="hover:underline hover:underline-offset-4">
                    {item.name}
                  </Link>
                </motion.li>
                {index < array.length - 1 && (
                  <motion.span
                    initial={{opacity: 0}}
                    animate={{
                      opacity: imagesAnimationComplete ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: ANIMATION_DELAYS.NAVIGATION_AND_CONTENT,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    /
                  </motion.span>
                )}
              </React.Fragment>
            ))}
          </ul>
        </motion.div>

        {/* STEP 3: Header Line - Appears after Alexandre Diop + 1000ms pause */}
        <motion.div
          className="h-[1px] bg-white w-full mt-4"
          initial={{scaleX: 0}}
          animate={{scaleX: imagesAnimationComplete ? 1 : 0}}
          transition={{
            duration: 0.8,
            delay: ANIMATION_DELAYS.LINES,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{transformOrigin: 'left'}}
        />
      </header>

      <div className="px-3 lg:px-10 mt-4 lg:grid lg:grid-cols-12">
        <motion.div
          initial={{scaleY: 0}}
          animate={{scaleY: imagesAnimationComplete ? 1 : 0}}
          transition={{
            duration: 0.8,
            delay: ANIMATION_DELAYS.LINES,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="absolute h-screen w-[1px] hidden lg:block left-[26.5vw] bg-white"
          style={{transformOrigin: 'bottom'}}
        ></motion.div>
        <div className="flex flex-col gap-y-2 lg:col-span-3 lg:pr-4">
          {/* STEP 4: Sidebar Menu - Appears with navigation (after lines + 300ms pause) */}
          <ul className="text-lg">
            {(
              content.sidebarMenuItems || [
                {name: 'Paintings', href: '/works?filter=paintings', color: '#FBBF24'},
                {
                  name: 'Object Images',
                  href: '/works?filter=object-images',
                  color: '#60A5FA',
                },
                {name: 'Drawings', href: '/works?filter=drawings', color: '#F87171'},
                {name: 'Sculptures', href: '/works?filter=sculptures', color: '#34D399'},
              ]
            ).map((item, index) => (
              <motion.li
                key={item.name}
                initial={{opacity: 0, y: 20}}
                animate={{
                  opacity: imagesAnimationComplete ? 1 : 0,
                  y: imagesAnimationComplete ? 0 : 20,
                }}
                transition={{
                  duration: 0.5,
                  delay: ANIMATION_DELAYS.NAVIGATION_AND_CONTENT + index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <Link
                  href={item.href}
                  className="hover:underline hover:underline-offset-4"
                  style={{color: item.color}}
                >
                  {item.name}
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* STEP 4: Contact Text - Appears with other content */}
          <motion.div
            className="mt-5"
            initial={{opacity: 0, y: 20}}
            animate={{
              opacity: imagesAnimationComplete ? 1 : 0,
              y: imagesAnimationComplete ? 0 : 20,
            }}
            transition={{
              duration: 0.6,
              delay: ANIMATION_DELAYS.NAVIGATION_AND_CONTENT,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <p className="hover:underline hover:underline-offset-4">
              <a href="mailto:info@alexandrediopartist.com">Contact</a>
            </p>
          </motion.div>

          {/* STEP 3: Sidebar Line - Appears with other lines */}
          <motion.div
            className="h-[1px] bg-white w-full"
            initial={{scaleX: 0}}
            animate={{scaleX: imagesAnimationComplete ? 1 : 0}}
            transition={{
              duration: 0.8,
              delay: ANIMATION_DELAYS.LINES,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{transformOrigin: 'left'}}
          />

          {/* STEP 4: Current Shows Component - Appears with other content */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{
              opacity: imagesAnimationComplete ? 1 : 0,
              y: imagesAnimationComplete ? 0 : 20,
            }}
            transition={{
              duration: 0.6,
              delay: ANIMATION_DELAYS.NAVIGATION_AND_CONTENT + 0.2, // Slight delay after other content
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <CurrentShows shows={content.currentShows} />
            <SpecialProjects projects={content.specialProjects} />
          </motion.div>
          <motion.div
            className="h-[1px] bg-white w-full"
            initial={{scaleX: 0}}
            animate={{scaleX: imagesAnimationComplete ? 1 : 0}}
            transition={{
              duration: 0.8,
              delay: ANIMATION_DELAYS.LINES,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{transformOrigin: 'left'}}
          />

          {/* STEP 4: Music Playlist Component - Appears at the bottom */}
          <motion.div
            className="h-full flex items-end"
            initial={{opacity: 0, y: 20}}
            animate={{
              opacity: imagesAnimationComplete ? 1 : 0,
              y: imagesAnimationComplete ? 0 : 20,
            }}
            transition={{
              duration: 0.6,
              delay: ANIMATION_DELAYS.NAVIGATION_AND_CONTENT + 0.4, // Slight delay after other content
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <div className="w-full">
              {content.musicFiles && content.musicFiles.length > 0 ? (
                <MusicBlock
                  block={{
                    fixedPosition: false, // Set to false for inline display
                    musicFiles: content.musicFiles,
                    playlistTitle: 'Music Playlist',
                  }}
                />
              ) : (
                <div>Music Playlist</div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="lg:pl-5 max-h-[85vh] overflow-scroll lg:col-span-9 lg:flex lg:flex-col">
          <div className="pl-3 schrink-0 pt-4 lg:flex lg:flex-col pb-4">
            <ImageGallery
              showcaseWorks={content.showcaseWorks}
              imagesAnimationComplete={imagesAnimationComplete}
              animationDelay={ANIMATION_DELAYS.NAVIGATION_AND_CONTENT}
            />
          </div>

          {/* STEP 3: Bottom Line - Appears with other lines */}
          <motion.div
            className="h-[1px] shrink-0 bg-white w-full mt-4"
            initial={{scaleX: 0}}
            animate={{scaleX: imagesAnimationComplete ? 1 : 0}}
            transition={{
              duration: 0.8,
              delay: ANIMATION_DELAYS.LINES,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{transformOrigin: 'left'}}
          />

          <div className="flex pt-12 flex-col lg:flex-row">
            <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
              {/* STEP 1: Images - First to appear, controls when other animations start */}
              <StackedImagesReveal
                images={content.bioImages}
                className="w-full"
                animationType="fade"
                onAnimationComplete={handleImagesAnimationComplete}
              />
            </div>

            {/* STEP 4: Bio Text - Appears with other content (after lines + 300ms pause) */}
            <motion.div
              className="w-full lg:w-2/3 lg:pl-6"
              initial={{opacity: 0, y: 0}}
              animate={{
                opacity: imagesAnimationComplete ? 1 : 0,
                y: imagesAnimationComplete ? 0 : 0,
              }}
              transition={{
                duration: 0.8,
                delay: ANIMATION_DELAYS.NAVIGATION_AND_CONTENT,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <CustomPortableText
                paragraphClasses=""
                value={content.bio as unknown as PortableTextBlock[]}
              />
            </motion.div>
          </div>
        </div>
      </div>
      <div className="px-3 lg:px-10 mt-4 lg:grid lg:grid-cols-12"></div>
    </>
  )
}

export default HomePageContent
