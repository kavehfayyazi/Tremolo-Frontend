import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnalysisData, CategoryToggle } from '../types'
import VideoPlayer, { VideoPlayerRef } from '../components/VideoPlayer'
import Transcript from '../components/Transcript'
import AnalysisDashboard from '../components/AnalysisDashboard'
import Timeline from '../components/Timeline'

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
    }
  }

  const handleToggle = (category: keyof CategoryToggle) => {
    setToggles((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  if (!analysisData || !videoUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Top Left: Video Player */}
          <div className="col-span-1">
            <VideoPlayer
              ref={videoRef}
              videoUrl={videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onDurationChange={handleDurationChange}
            />
          </div>

          {/* Top Right: Transcript */}
          <div className="col-span-1">
            <Transcript
              transcript={analysisData.transcript}
              markers={analysisData.markers}
              videoDuration={videoDuration}
              toggles={toggles}
              onWordClick={handleSeek}
            />
          </div>
        </div>

        {/* Bottom: Dashboard and Timeline */}
        <div className="grid grid-cols-2 gap-6">
          {/* Analysis Dashboard */}
          <div>
            <AnalysisDashboard
              overallScore={analysisData.overallScore}
              bodyLanguageScore={analysisData.bodyLanguageScore}
              vocalScore={analysisData.vocalScore}
              speechScore={analysisData.speechScore}
              toggles={toggles}
              onToggle={handleToggle}
            />
          </div>

          {/* Timeline */}
          <div>
            <Timeline
              duration={videoDuration}
              currentTime={currentTime}
              markers={analysisData.markers}
              toggles={toggles}
              onMarkerClick={handleSeek}
              onSeek={handleSeek}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

