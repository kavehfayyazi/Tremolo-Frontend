import { AnalysisData } from '../types'
import { mockAnalysisData } from '../mockData'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export async function analyzeVideo(file: File): Promise<AnalysisData> {
  // For demo/testing: use mock data if backend is not available
  // Remove this try-catch block when backend is ready
  try {
    const formData = new FormData()
    formData.append('video', file)

    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to analyze video')
    }

    const data = await response.json()
    return data
  } catch (error) {
    // Fallback to mock data for demo purposes
    console.warn('Backend not available, using mock data:', error)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return mockAnalysisData
  }
}

// Helper to create a video URL from file
export function createVideoUrl(file: File): string {
  return URL.createObjectURL(file)
}

