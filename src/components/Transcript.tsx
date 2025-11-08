import { useRef } from 'react'
import { FeedbackMarker, CategoryToggle } from '../types'

interface TranscriptProps {
  transcript: string
  markers: FeedbackMarker[]
  videoDuration: number
  toggles: CategoryToggle
  onWordClick: (time: number) => void
}

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'body-language':
      return 'bg-green-200 text-green-800 border-green-300'
    case 'vocal':
      return 'bg-blue-200 text-blue-800 border-blue-300'
    case 'speech':
      return 'bg-red-200 text-red-800 border-red-300'
    default:
      return 'bg-gray-200 text-gray-800'
  }
}

export default function Transcript({
  transcript,
  markers,
  videoDuration,
  toggles,
  onWordClick,
}: TranscriptProps) {
  const transcriptRef = useRef<HTMLDivElement>(null)

  // Estimate timestamp for a given character position in the transcript
  const estimateTimestamp = (charIndex: number): number => {
    if (markers.length === 0 || videoDuration === 0) {
      // If no markers, estimate uniformly based on transcript position
      return (charIndex / transcript.length) * videoDuration
    }

    // Sort markers by transcript position
    const sortedMarkers = [...markers].sort(
      (a, b) => a.transcriptStartIndex - b.transcriptStartIndex
    )

    // Find the markers before and after this position
    let beforeMarker = null
    let afterMarker = null

    for (let i = 0; i < sortedMarkers.length; i++) {
      if (sortedMarkers[i].transcriptStartIndex <= charIndex) {
        beforeMarker = sortedMarkers[i]
      } else {
        afterMarker = sortedMarkers[i]
        break
      }
    }

    // If before first marker, estimate based on position relative to first marker
    if (!beforeMarker && afterMarker) {
      const ratio = charIndex / afterMarker.transcriptStartIndex
      return ratio * afterMarker.timestamp
    }

    // If after last marker, estimate based on remaining duration
    if (beforeMarker && !afterMarker) {
      const remainingChars = transcript.length - beforeMarker.transcriptStartIndex
      const remainingTime = videoDuration - beforeMarker.timestamp
      const charsAfterMarker = charIndex - beforeMarker.transcriptStartIndex
      return beforeMarker.timestamp + (charsAfterMarker / remainingChars) * remainingTime
    }

    // Interpolate between two markers
    if (beforeMarker && afterMarker) {
      const charsBetween = afterMarker.transcriptStartIndex - beforeMarker.transcriptStartIndex
      const timeBetween = afterMarker.timestamp - beforeMarker.timestamp
      const charsFromBefore = charIndex - beforeMarker.transcriptStartIndex
      return beforeMarker.timestamp + (charsFromBefore / charsBetween) * timeBetween
    }

    // Fallback: uniform distribution
    return (charIndex / transcript.length) * videoDuration
  }

  // Find markers that should be highlighted
  const getHighlightedRanges = () => {
    const ranges: Array<{
      start: number
      end: number
      category: string
      timestamp: number
      feedback: string
    }> = []

    markers.forEach((marker) => {
      if (toggles[marker.category as keyof CategoryToggle]) {
        ranges.push({
          start: marker.transcriptStartIndex,
          end: marker.transcriptEndIndex,
          category: marker.category,
          timestamp: marker.timestamp,
          feedback: marker.feedback,
        })
      }
    })

    return ranges.sort((a, b) => a.start - b.start)
  }

  // Check if a character index is within any highlighted range
  const isInHighlightedRange = (
    charIndex: number,
    ranges: Array<{
      start: number
      end: number
      category: string
      timestamp: number
      feedback: string
    }>
  ): { inRange: boolean; category?: string; timestamp?: number; feedback?: string } => {
    for (const range of ranges) {
      if (charIndex >= range.start && charIndex < range.end) {
        return {
          inRange: true,
          category: range.category,
          timestamp: range.timestamp,
          feedback: range.feedback,
        }
      }
    }
    return { inRange: false }
  }

  const renderTranscript = () => {
    const highlightedRanges = getHighlightedRanges()
    
    // Split transcript into words while preserving spaces and punctuation
    const words: Array<{ text: string; startIndex: number; endIndex: number }> = []
    
    // Match words and whitespace/punctuation
    const wordRegex = /\S+|\s+/g
    let match
    
    while ((match = wordRegex.exec(transcript)) !== null) {
      words.push({
        text: match[0],
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
      })
    }

    return words.map((word, idx) => {
      const wordStartIndex = word.startIndex
      const wordEndIndex = word.endIndex
      const wordMiddleIndex = Math.floor((wordStartIndex + wordEndIndex) / 2)
      
      // Check if this word is highlighted
      const highlightInfo = isInHighlightedRange(wordMiddleIndex, highlightedRanges)
      const estimatedTimestamp = estimateTimestamp(wordMiddleIndex)
      
      // Use marker timestamp if in highlighted range, otherwise use estimated
      const timestamp = highlightInfo.inRange && highlightInfo.timestamp 
        ? highlightInfo.timestamp 
        : estimatedTimestamp

      if (highlightInfo.inRange) {
        const colorClass = getCategoryColor(highlightInfo.category!)
        return (
          <span
            key={`word-${idx}`}
            className={`${colorClass} border-b-2 cursor-pointer hover:opacity-80 transition-opacity px-1 rounded`}
            onClick={() => onWordClick(timestamp)}
            title={highlightInfo.feedback || `Jump to ${timestamp.toFixed(1)}s`}
          >
            {word.text}
          </span>
        )
      } else {
        return (
          <span
            key={`word-${idx}`}
            className="text-gray-800 cursor-pointer hover:bg-gray-100 hover:rounded px-1 transition-colors"
            onClick={() => onWordClick(timestamp)}
            title={`Jump to ${timestamp.toFixed(1)}s`}
          >
            {word.text}
          </span>
        )
      }
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Transcript</h2>
      <div
        ref={transcriptRef}
        className="flex-1 overflow-y-auto text-base leading-relaxed"
        style={{ maxHeight: '500px' }}
      >
        {renderTranscript()}
      </div>
    </div>
  )
}

