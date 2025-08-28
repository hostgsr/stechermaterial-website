// @ts-nocheck
import React, {useCallback, useEffect, useRef, useState} from 'react'

interface MusicFile {
  musicFile: string
  musicTitle: string
}

const MusicBlock = ({
  block,
}: {
  block: {
    fixedPosition: boolean
    musicFiles: MusicFile[]
    playlistTitle: string
  }
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1) // Default volume: 100%
  const [isMuted, setIsMuted] = useState(false) // Track mute state
  const [isMusicOpen, setIsMusicOpen] = useState(false)
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(true) // New state for playlist visibility

  // Autoplay on component mount
  useEffect(() => {
    if (audioRef.current && block.musicFiles.length > 0) {
      // Set a small delay to ensure the audio element is properly loaded
      const timer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true)
            })
            .catch((error) => {
              // Autoplay might be blocked by browser policy
              console.log('Autoplay blocked:', error)
            })
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [block.musicFiles.length])

  const playPauseHandler = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const nextHandler = useCallback(() => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === block.musicFiles.length - 1 ? 0 : prevIndex + 1,
    )
  }, [block.musicFiles.length])

  const prevHandler = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? block.musicFiles.length - 1 : prevIndex - 1,
    )
  }

  // New function to handle track selection by clicking on title
  const selectTrackHandler = (index: number) => {
    if (index !== currentTrackIndex) {
      setCurrentTrackIndex(index)
      // If track was already playing, the new track will start playing automatically due to the useEffect
    }
  }

  const timeUpdateHandler = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const loadedMetadataHandler = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  // Volume control handler
  const volumeChangeHandler = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value
      setVolume(value)

      // If user increases volume from 0, unmute
      if (value > 0 && isMuted) {
        setIsMuted(false)
      }

      // If user sets volume to 0, mute
      if (value === 0 && !isMuted) {
        setIsMuted(true)
      }
    }
  }

  // Toggle mute handler
  const toggleMuteHandler = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume > 0 ? volume : 0.5 // Restore to previous volume, or 50% if it was 0
        audioRef.current.muted = false
      } else {
        audioRef.current.muted = true
      }
      setIsMuted(!isMuted)
    }
  }

  // Toggle playlist visibility
  const togglePlaylistVisibility = () => {
    setIsPlaylistVisible((prevState) => !prevState)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const endedHandler = () => {
        nextHandler()
      }
      audio.addEventListener('ended', endedHandler)
      return () => {
        audio.removeEventListener('ended', endedHandler)
      }
    }
  }, [nextHandler])

  useEffect(() => {
    if (audioRef.current) {
      // Only reload when track index changes, not when play state changes
      audioRef.current.volume = volume
      audioRef.current.muted = isMuted
    }
  }, [volume, isMuted])

  // Separate effect for track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load()
      audioRef.current.volume = volume
      audioRef.current.muted = isMuted
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentTrackIndex, volume, isMuted, isPlaying])

  // Separate effect for play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  const seekHandler = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  const toggleMusicOpen = () => {
    setIsMusicOpen((prevState) => !prevState)
  }

  const fixed = block.fixedPosition
  if (fixed) {
    return (
      <div
        className={`${!isMusicOpen ? '' : 'border border-[#252525] bg-white dark:bg-black dark:text-black dark:border-white '} fixed w-full lg:w-fit flex-col flex items-end justify-end bottom-0 right-0 lg:right-[74px] z-[999999] `}
      >
        <div
          className={`${isMusicOpen ? 'justify-between' : ' justify-end'} flex  items-center w-full`}
        >
          {isMusicOpen ? (
            <div className="text-black dark:text-white  px-2">{block.playlistTitle}</div>
          ) : null}
          <button
            className="align-right  px-2 cursor-pointer text-white border-[#252525] bg-[#252525] dark:text-black dark:border-white dark:bg-white m-2 w-fit"
            onClick={toggleMusicOpen}
          >
            {!isMusicOpen ? 'Audio' : 'Close '}
          </button>
        </div>

        <div className="w-full lg:w-[400px]">
          <div
            className={` ${isMusicOpen ? '' : 'hidden '} w-full border-t border-[#252525]  dark:border-white    `}
          >
            <audio
              ref={audioRef}
              src={block.musicFiles[currentTrackIndex].musicFile}
              onTimeUpdate={timeUpdateHandler}
              onLoadedMetadata={loadedMetadataHandler}
            />
            <div className="flex px-2  flex-col w-full">
              <button
                className="w-fit my-2 bg-[#252525] dark:text-black  dark:bg-white px-2 cursor-pointer text-white"
                onClick={playPauseHandler}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <div className="flex flex-row justify-between">
                <button
                  className=" bg-[#252525] dark:text-black  dark:bg-white  px-2 cursor-pointer text-white"
                  onClick={prevHandler}
                >
                  Previous
                </button>
                <button
                  className=" bg-[#252525] dark:text-black  dark:bg-white  px-2 cursor-pointer text-white"
                  onClick={nextHandler}
                >
                  Next
                </button>
              </div>
            </div>
            <div className="px-2 mt-2 dark:text-white ">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={(e) => seekHandler(parseInt(e.target.value))}
              className="custom-range  bg-[#252525] dark:bg-white  px-2 w-full"
            />

            {/* Volume Control Section */}
            <div className="flex items-center px-2 mt-2 mb-3">
              <button
                className="bg-[#252525] dark:text-black  dark:bg-white  px-2 cursor-pointer text-white mr-2"
                onClick={toggleMuteHandler}
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => volumeChangeHandler(parseFloat(e.target.value))}
                className="custom-range bg-[#252525] dark:bg-white   flex-grow"
              />
              <span className="ml-2 dark:text-white ">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>

            <div className=" flex flex-col items-center justify-center w-full  border-t-[0px]">
              {block.musicFiles.map((file, index) => (
                <p
                  className="border-t hover:font-bold musicTitle w-full border-t-[2px] border-t-[#252525] dark:border-t-[#ffffff] dark:text-white px-1 cursor-pointer "
                  key={index}
                  style={{
                    fontWeight: currentTrackIndex === index ? '700' : '',
                  }}
                  onClick={() => selectTrackHandler(index)}
                >
                  {file.musicTitle}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div>
        <button className="cursor-pointer hover:font-bold" onClick={togglePlaylistVisibility}>
          Playlist <span className="text-[10px] ml-2">{isPlaylistVisible ? '▼' : '▶'}</span>
        </button>
      </div>
      {isPlaylistVisible && (
        <div className=" w-full">
          <div className="  ">
            <audio
              ref={audioRef}
              src={block.musicFiles[currentTrackIndex].musicFile}
              onTimeUpdate={timeUpdateHandler}
              onLoadedMetadata={loadedMetadataHandler}
            />
            <div className="flex flex-col ">
              <button
                className="w-fit bg-[#252525] dark:text-black  dark:bg-white  px-2 cursor-pointer text-white my-2"
                onClick={playPauseHandler}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <div className="flex flex-row justify-between">
                <button
                  className="bg-[#252525] dark:text-black  dark:bg-white  px-2 cursor-pointer text-white "
                  onClick={prevHandler}
                >
                  Previous
                </button>
                <button
                  className="bg-[#252525] dark:text-black  dark:bg-white  px-2 cursor-pointer text-white "
                  onClick={nextHandler}
                >
                  Next
                </button>
              </div>
            </div>
            <div className="my-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={(e) => seekHandler(parseInt(e.target.value))}
              className="custom-range bg-[#252525] dark:bg-white  w-full"
            />

            {/* Volume Control Section */}
            <div className="flex items-center mt-2 mb-3">
              <button
                className="bg-[#252525] dark:text-black  dark:bg-white  px-2  cursor-pointer text-white mr-2"
                onClick={toggleMuteHandler}
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => volumeChangeHandler(parseFloat(e.target.value))}
                className="custom-range bg-[#252525] dark:bg-white flex-grow"
              />
              <span className="ml-2">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
            </div>

            <div className="border flex flex-col items-center justify-center w-full border-[white] dark:text-white dark:border-white border-[1px] border-t-[0px]">
              {block.musicFiles.map((file, index) => (
                <p
                  className="border-t musicTitle w-full border-t-[1px] border-t-[white] dark:border-t-[#ffffff] px-1 cursor-pointer hover:font-bold"
                  key={index}
                  style={{fontWeight: currentTrackIndex === index ? '700' : ''}}
                  onClick={() => selectTrackHandler(index)}
                >
                  {file.musicTitle}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MusicBlock
