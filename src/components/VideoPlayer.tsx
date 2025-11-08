import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

interface VideoPlayerProps {
  videoUrl: string
  onTimeUpdate: (time: number) => void
  onDurationChange: (duration: number) => void
}

export interface VideoPlayerRef {
  seek: (time: number) => void
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ videoUrl, onTimeUpdate, onDurationChange }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null)

    useImperativeHandle(ref, () => ({
      seek: (time: number) => {
        if (videoRef.current) {
          videoRef.current.currentTime = time
        }
      },
    }))

    useEffect(() => {
      const video = videoRef.current
      if (!video) return

      const handleTimeUpdate = () => {
        onTimeUpdate(video.currentTime)
      }

      const handleLoadedMetadata = () => {
        onDurationChange(video.duration)
      }

      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('loadedmetadata', handleLoadedMetadata)

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }, [onTimeUpdate, onDurationChange])

    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-full h-auto"
        />
      </div>
    )
  }
)

VideoPlayer.displayName = 'VideoPlayer'

export default VideoPlayer

