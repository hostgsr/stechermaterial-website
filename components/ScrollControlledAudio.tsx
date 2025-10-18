'use client'

import {urlForFile} from '@/sanity/lib/utils'
import {useEffect, useRef, useState} from 'react'

interface ScrollControlledAudioProps {
  audioFile: any
  scrollYProgress: any
  isActive: boolean
}

export function ScrollControlledAudio({
  audioFile,
  scrollYProgress,
  isActive,
}: ScrollControlledAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [duration, setDuration] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const lastScrollTime = useRef(0)
  const lastScrollValue = useRef(0)
  const playbackRate = useRef(1)

  const audioUrl = audioFile ? urlForFile(audioFile) : null

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioUrl) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoaded(true)
      console.log('Audio loaded, duration:', audio.duration)
    }

    const handleCanPlayThrough = () => {
      setIsLoaded(true)
    }

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('canplaythrough', handleCanPlayThrough)

    // Preload the audio
    audio.load()

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('canplaythrough', handleCanPlayThrough)
    }
  }, [audioUrl])

  useEffect(() => {
    if (!isLoaded || !isActive || !audioRef.current || duration === 0) return

    const unsubscribe = scrollYProgress.on('change', (latest: number) => {
      const audio = audioRef.current
      if (!audio) return

      const currentTime = Date.now()
      const timeDelta = currentTime - lastScrollTime.current
      const scrollDelta = latest - lastScrollValue.current

      // Calculate scroll speed (how fast user is scrolling)
      const scrollSpeed = timeDelta > 0 ? Math.abs(scrollDelta) / (timeDelta / 1000) : 0

      // Map scroll progress (0-1) to audio time (0-duration)
      const targetTime = latest * duration

      // Determine if scrolling forward or backward
      const isScrollingForward = scrollDelta > 0
      const isScrollingBackward = scrollDelta < 0

      // Only update if there's significant scroll movement
      if (Math.abs(scrollDelta) > 0.001) {
        // Set the audio current time to match scroll position
        audio.currentTime = Math.max(0, Math.min(targetTime, duration))

        // Calculate playback rate based on scroll speed
        // Faster scrolling = faster playback rate
        const baseRate = Math.min(Math.max(scrollSpeed * 10, 0.1), 3)
        playbackRate.current = baseRate

        // Set playback rate and direction
        if (isScrollingForward || isScrollingBackward) {
          audio.playbackRate = playbackRate.current

          // Play audio if not already playing
          if (audio.paused) {
            audio.play().catch((error) => {
              console.log('Audio play failed:', error)
            })
          }
        }

        // Stop audio if scroll stops (with a small delay)
        clearTimeout((audio as any).stopTimeout)
        ;(audio as any).stopTimeout = setTimeout(() => {
          if (audio && !audio.paused) {
            audio.pause()
          }
        }, 100)
      }

      lastScrollTime.current = currentTime
      lastScrollValue.current = latest
    })

    return () => {
      unsubscribe()
    }
  }, [scrollYProgress, isLoaded, isActive, duration])

  // Handle audio ending
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      // Reset to beginning when audio ends
      audio.currentTime = 0
    }

    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  if (!audioUrl) return null

  return <audio ref={audioRef} src={audioUrl} preload="auto" style={{display: 'none'}} />
}
