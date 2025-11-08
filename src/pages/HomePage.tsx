import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeVideo, createVideoUrl } from '../services/api'
import { AnalysisData } from '../types'

export default function HomePage() {
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('video/')) {
        setSelectedFile(file)
      } else {
        alert('Please upload a video file')
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    try {
      const analysisData = await analyzeVideo(selectedFile)
      const videoUrl = createVideoUrl(selectedFile)
      
      // Store data in sessionStorage to pass to analysis page
      sessionStorage.setItem('analysisData', JSON.stringify(analysisData))
      sessionStorage.setItem('videoUrl', videoUrl)
      sessionStorage.setItem('videoFileName', selectedFile.name)
      
      navigate('/analysis')
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Failed to analyze video. Please try again.')
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">Tremolo</h1>
        <p className="text-lg text-gray-600">
          Bridge the gap between your ideas and the world
        </p>
      </div>

      <div
        className={`w-full max-w-2xl border-2 border-dashed rounded-lg p-16 transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : selectedFile
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 bg-white hover:border-gray-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-center">
          {selectedFile ? (
            <>
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAnalyze()
                }}
                disabled={isAnalyzing}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drag and drop your video here
              </p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <p className="text-sm text-blue-600 font-medium cursor-pointer">
                Click to browse files
              </p>
            </>
          )}
        </div>
      </div>

      {isAnalyzing && (
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Analyzing your speech...</p>
        </div>
      )}
    </div>
  )
}

