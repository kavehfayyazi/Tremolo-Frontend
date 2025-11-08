import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnalysisData, CategoryToggle } from '../types'
import VideoPlayer, { VideoPlayerRef } from '../components/VideoPlayer'
import Transcript from '../components/Transcript'
import ScoreDisplay from '../components/ScoreDisplay'
import Timeline from '../components/Timeline'
import DetailedFeedbackPanel from '../components/DetailedFeedbackPanel'
import { feedbackData, formatTimeForFeedback } from '../data/feedbackData'
import { callAI } from '../services/api'

export default function AnalysisPage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [toggles, setToggles] = useState<CategoryToggle>({
    'body-language': true,
    vocal: true,
    speech: true,
  })
  const [leftWidth, setLeftWidth] = useState(65) // Percentage width for left column
  const [isResizing, setIsResizing] = useState(false)
  const [selectedTimestamp, setSelectedTimestamp] = useState<number | null>(null)
  const [aiFeedbackData, setAiFeedbackData] = useState<any>(feedbackData) // Start with default feedbackData
  const [isLoadingAI, setIsLoadingAI] = useState(false) // Loading state for AI response
  const videoRef = useRef<VideoPlayerRef>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Load data from sessionStorage
    const storedData = sessionStorage.getItem('analysisData')
    const storedVideoUrl = sessionStorage.getItem('videoUrl')

    if (!storedData || !storedVideoUrl) {
      navigate('/')
      return
    }

    try {
      const data = JSON.parse(storedData)
      setAnalysisData(data)
      setVideoUrl(storedVideoUrl)
      
      // Call AI API and add markers to analysis data
      console.log("Calling AI API...")
      setIsLoadingAI(true)
      callAI(data)
        .then((response) => {
          console.log('AI API Response received:', response)
          
          // Update feedback data with AI response - transform to match feedbackData format
          if (response.feedback && Array.isArray(response.feedback)) {
            const transformedFeedback: Record<string, {type: string, issue: string, suggestion: string}> = {}
            
            response.feedback.forEach((item: any) => {
              const mins = Math.floor(item.timestamp / 60)
              const secs = Math.floor(item.timestamp % 60)
              const timeKey = `${mins}:${secs.toString().padStart(2, '0')}`
              
              transformedFeedback[timeKey] = {
                type: 'Speech',
                issue: 'Speech Issue Detected',
                suggestion: item.feedback
              }
            })
            console.log('TRANSFORMED FEEDBACK:', transformedFeedback)
            setAiFeedbackData(transformedFeedback)
          }
          
          setAnalysisData((prev) => {
            if (!prev) return prev
            
            // Transform AI response to match FeedbackMarker format
            let responseArray = []
            if (Array.isArray(response)) {
              responseArray = response
            } else if (response.feedback && Array.isArray(response.feedback)) {
              responseArray = response.feedback
            } else if (response.markers && Array.isArray(response.markers)) {
              responseArray = response.markers
            } else if (response) {
              console.warn('Unexpected AI response format:', response)
              return prev
            }
            
            const aiMarkers = responseArray.map((item: any) => ({
              timestamp: item.timestamp,
              feedback: item.feedback,
              category: 'speech', // Default category for AI-generated feedback
              transcriptStartIndex: 4,
              transcriptEndIndex: 6,
            }))
            
            return {
              ...prev,
              markers: [...prev.markers, ...aiMarkers]
            }
          })
        })
        .catch((error) => {
          console.error('AI API Error:', error)
        })
        .finally(() => {
          setIsLoadingAI(false)
        })
    } catch (error) {
      console.error('Failed to load analysis data:', error)
      navigate('/')
    }
  }, [navigate])

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time)
  }

  const handleDurationChange = (duration: number) => {
    setVideoDuration(duration)
  }

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.seek(time)
      setCurrentTime(time)
      setSelectedTimestamp(time) // Update selected timestamp when seeking
    }
  }

  // Sync video player when selectedTimestamp changes (from clicks on timeline/transcript)
  useEffect(() => {
    if (selectedTimestamp !== null && videoRef.current) {
      videoRef.current.seek(selectedTimestamp)
      setCurrentTime(selectedTimestamp)
    }
  }, [selectedTimestamp])

  const handleToggle = (category: keyof CategoryToggle) => {
    setToggles((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const containerWidth = window.innerWidth
      const newLeftWidth = (e.clientX / containerWidth) * 100

      // Constrain between 30% and 80%
      const constrainedWidth = Math.max(30, Math.min(80, newLeftWidth))
      setLeftWidth(constrainedWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  if (!analysisData || !videoUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="flex h-full">
        {/* Column 1: Media Column (Left, adjustable width) */}
        <div className="flex flex-col flex-shrink-0 overflow-hidden" style={{ width: `${leftWidth}%` }}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white flex-shrink-0">
            <h1 className="text-3xl font-bold text-gray-900">Analysis Report</h1>
            <button
              onClick={() => {
                sessionStorage.clear()
                navigate('/')
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Upload New Video
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Video Player */}
            <div className="p-4">
              <div style={{ maxHeight: '400px' }} className="flex items-center justify-center overflow-hidden">
                <VideoPlayer
                  ref={videoRef}
                  videoUrl={videoUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onDurationChange={handleDurationChange}
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="px-4 pb-4">
              <Timeline
                duration={videoDuration}
                currentTime={currentTime}
                markers={analysisData.markers}
                toggles={toggles}
                onMarkerClick={handleSeek}
                onSeek={handleSeek}
              />
            </div>

            {/* Detailed Feedback Panel */}
            <div className="px-4 pb-4">
              <DetailedFeedbackPanel
                selectedTimestamp={selectedTimestamp}
                feedbackData={aiFeedbackData}
                formatTime={formatTimeForFeedback}
              />
            </div>

            {/* AI Loading Indicator */}
            {isLoadingAI && (
              <div className="px-4 pb-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600 text-sm">Loading AI-generated feedback...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resizer */}
        <div
          onMouseDown={handleMouseDown}
          className={`w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors flex-shrink-0 ${
            isResizing ? 'bg-blue-500' : ''
          }`}
          style={{ minWidth: '4px' }}
        />

        {/* Column 2: Analysis Column (Right, adjustable width, scrollable) */}
        <div
          className="flex flex-col overflow-y-auto bg-gray-50"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <div className="p-6 space-y-6">
            {/* Score Display with Integrated Toggles */}
            <ScoreDisplay
              overallScore={analysisData.overallScore}
              bodyLanguageScore={analysisData.bodyLanguageScore}
              vocalScore={analysisData.vocalScore}
              speechScore={analysisData.speechScore}
              toggles={toggles}
              onToggle={handleToggle}
            />

            {/* Transcript */}
            <Transcript
              transcript={analysisData.transcript}
              markers={analysisData.markers}
              videoDuration={videoDuration}
              toggles={toggles}
              onWordClick={handleSeek}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

