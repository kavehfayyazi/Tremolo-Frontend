import { FeedbackMarker, CategoryToggle } from '../types'

interface TimelineProps {
  duration: number
  currentTime: number
  markers: FeedbackMarker[]
  toggles: CategoryToggle
  onMarkerClick: (time: number) => void
  onSeek: (time: number) => void
}

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'body-language':
      return 'bg-green-500'
    case 'vocal':
      return 'bg-blue-500'
    case 'speech':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function Timeline({
  duration,
  currentTime,
  markers,
  toggles,
  onMarkerClick,
  onSeek,
}: TimelineProps) {
  const filteredMarkers = markers.filter(
    (marker) => toggles[marker.category as keyof CategoryToggle]
  )

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newTime = percentage * duration
    onSeek(newTime)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>

      {/* Timeline Bar */}
      <div className="relative mb-4">
        <div
          className="w-full h-12 bg-gray-200 rounded-lg cursor-pointer relative overflow-hidden"
          onClick={handleTimelineClick}
        >
          {/* Current Time Indicator */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-gray-900 z-10"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          />

          {/* Markers */}
          {filteredMarkers.map((marker, idx) => {
            const position = (marker.timestamp / duration) * 100
            return (
              <div
                key={idx}
                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${getCategoryColor(
                  marker.category
                )} cursor-pointer hover:scale-125 transition-transform z-20`}
                style={{ left: `${position}%` }}
                onClick={(e) => {
                  e.stopPropagation()
                  onMarkerClick(marker.timestamp)
                }}
                title={`${formatTime(marker.timestamp)}: ${marker.feedback}`}
              />
            )
          })}
        </div>

        {/* Time Labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{formatTime(0)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600">Body Language</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">Vocal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Speech</span>
        </div>
      </div>
    </div>
  )
}

