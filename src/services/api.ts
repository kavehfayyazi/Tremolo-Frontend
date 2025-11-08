import { AnalysisData, UploadVideoResponse, JobStatusResponse, TranscriptionData, FeedbackMarker, SentenceAnalysis } from '../types'
import { mockAnalysisData } from '../mockData'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Poll for job status until complete
async function pollJobStatus(jobId: string, maxAttempts: number = 120): Promise<JobStatusResponse> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(`${API_BASE_URL}/api/status/${jobId}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Job not found')
      }
      throw new Error(`Failed to check job status: ${response.statusText}`)
    }

    const data: JobStatusResponse = await response.json()

    if (data.status === 'complete') {
      return data
    }

    if (data.status === 'error') {
      throw new Error(data.detail || 'Job processing failed')
    }

    // If still processing, wait 2 seconds before next poll
    if (data.status === 'processing') {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      continue
    }

    // Wait 2 seconds before next poll
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  throw new Error('Job timeout: exceeded maximum polling attempts')
}

// Analyze transcription data and create markers
// Uses enriched_transcript if available, otherwise falls back to basic analysis
function analyzeTranscription(
  transcription: TranscriptionData,
  enrichedTranscript?: { words: Array<{ text: string; tags: string[] }> }
): {
  transcript: string
  markers: FeedbackMarker[]
} {
  if (!transcription || transcription.status !== 'completed') {
    throw new Error('Transcription not completed')
  }

  const transcript = transcription.full_text
  const markers: FeedbackMarker[] = []
  
  // Build a map of word positions in the transcript
  let currentIndex = 0
  const wordPositions = new Map<number, { start: number; end: number }>()

  transcription.words.forEach((word, wordIndex) => {
    const wordText = word.text.trim()
    const searchStart = currentIndex
    const wordStart = transcript.indexOf(wordText, searchStart)
    
    if (wordStart !== -1) {
      const wordEnd = wordStart + wordText.length
      wordPositions.set(wordIndex, { start: wordStart, end: wordEnd })
      currentIndex = wordEnd
    }
  })

  // Use enriched_transcript if available (more accurate)
  if (enrichedTranscript && enrichedTranscript.words.length === transcription.words.length) {
    transcription.words.forEach((word, index) => {
      const enrichedWord = enrichedTranscript.words[index]
      const position = wordPositions.get(index)
      
      if (!position) return

      // Check for filler words from enriched tags
      if (enrichedWord.tags.includes('filler_word')) {
        markers.push({
          category: 'speech',
          timestamp: word.start,
          feedback: `Filler word "${word.text.trim()}" detected`,
          transcriptStartIndex: position.start,
          transcriptEndIndex: position.end,
        })
      }

      // Check for body language issues (low gesture energy)
      if (enrichedWord.tags.includes('low_gesture_energy') || 
          (!enrichedWord.tags.some(tag => tag.includes('gesture')) && word.start > 2)) {
        // Only add if we don't have too many body language markers already
        const existingBodyLangMarkers = markers.filter(m => m.category === 'body-language').length
        if (existingBodyLangMarkers < 3) {
          markers.push({
            category: 'body-language',
            timestamp: word.start,
            feedback: 'Limited gesture usage detected',
            transcriptStartIndex: position.start,
            transcriptEndIndex: position.end,
          })
        }
      }

      // Check for vocal issues
      if (enrichedWord.tags.includes('pitch_wobble') || 
          enrichedWord.tags.includes('falling_intonation')) {
        if (!markers.some(m => 
          Math.abs(m.timestamp - word.start) < 0.5 && m.category === 'vocal'
        )) {
          markers.push({
            category: 'vocal',
            timestamp: word.start,
            feedback: enrichedWord.tags.includes('pitch_wobble') 
              ? 'Pitch wobble detected' 
              : 'Falling intonation detected',
            transcriptStartIndex: position.start,
            transcriptEndIndex: position.end,
          })
        }
      }
    })
  } else {
    // Fallback to basic analysis if enriched_transcript not available
    transcription.words.forEach((word, index) => {
      const fillerWords = ['um', 'uh', 'er', 'ah', 'like', 'you know']
      const cleanedWord = word.text.toLowerCase().replace(/[.,!?;:]/, '').trim()
      const isFillerWord = fillerWords.some(filler => cleanedWord === filler)

      if (isFillerWord) {
        const position = wordPositions.get(index)
        if (position) {
          markers.push({
            category: 'speech',
            timestamp: word.start,
            feedback: `Filler word "${cleanedWord}" detected`,
            transcriptStartIndex: position.start,
            transcriptEndIndex: position.end,
          })
        }
      }

      // Analyze pitch variations (monotonous tone detection)
      if (index > 0 && index < transcription.words.length - 1) {
        const prevPitch = transcription.words[index - 1].metrics.pitch
        const currPitch = word.metrics.pitch
        const nextPitch = transcription.words[index + 1].metrics.pitch
        const avgPitch = (prevPitch + currPitch + nextPitch) / 3
        const pitchVariation = avgPitch > 0 ? Math.abs(currPitch - avgPitch) / avgPitch : 0

        if (pitchVariation < 0.1 && word.start > 5) {
          const position = wordPositions.get(index)
          
          if (position && !markers.some(m => 
            Math.abs(m.timestamp - word.start) < 0.5 && m.category === 'vocal'
          )) {
            markers.push({
              category: 'vocal',
              timestamp: word.start,
              feedback: 'Monotonous tone detected',
              transcriptStartIndex: position.start,
              transcriptEndIndex: position.end,
            })
          }
        }
      }
    })
  }

  return { transcript, markers }
}

// Calculate scores from transcription data
function calculateScores(
  markers: FeedbackMarker[],
  words: TranscriptionData['words'],
  enrichedTranscript?: { sentence_analysis?: SentenceAnalysis }
): {
  overallScore: number
  bodyLanguageScore: number
  vocalScore: number
  speechScore: number
} {
  const speechMarkers = markers.filter(m => m.category === 'speech')
  const vocalMarkers = markers.filter(m => m.category === 'vocal')
  const bodyLanguageMarkers = markers.filter(m => m.category === 'body-language')

  // Calculate speech score
  // Use enriched_transcript fluency_score if available, otherwise calculate from markers
  let speechScore: number
  if (enrichedTranscript?.sentence_analysis?.fluency_score !== undefined) {
    // Fluency score is likely 0-1, convert to 0-10 scale
    speechScore = enrichedTranscript.sentence_analysis.fluency_score * 10
  } else {
    // Fallback: calculate from filler word ratio
    const fillerWordCount = speechMarkers.length
    const totalWords = words.length
    const fillerWordRatio = totalWords > 0 ? fillerWordCount / totalWords : 0
    speechScore = Math.max(0, 10 - (fillerWordRatio * 20))
  }

  // Calculate vocal score (penalize vocal issues)
  const vocalIssueCount = vocalMarkers.length
  const vocalScore = Math.max(0, 10 - (vocalIssueCount * 0.5))

  // Calculate body language score
  // Use gesture data from enriched_transcript if available
  let bodyLanguageScore: number
  if (enrichedTranscript?.sentence_analysis) {
    const tagDist = enrichedTranscript.sentence_analysis.tag_distribution || {}
    const gestureTags = (tagDist['high_gesture_energy'] || 0) + 
                       (tagDist['moderate_gesture'] || 0)
    const totalWords = words.length
    const gestureRatio = totalWords > 0 ? gestureTags / totalWords : 0
    // Base score on gesture usage (more gestures = better score)
    bodyLanguageScore = Math.min(10, 5 + (gestureRatio * 20))
  } else {
    // Fallback: base score on body language markers
    const bodyLangIssueCount = bodyLanguageMarkers.length
    bodyLanguageScore = Math.max(0, 10 - (bodyLangIssueCount * 0.3))
  }

  // Overall score (weighted average)
  const overallScore = (speechScore * 0.4 + vocalScore * 0.3 + bodyLanguageScore * 0.3)

  return {
    overallScore: Math.round(overallScore * 10) / 10,
    bodyLanguageScore: Math.round(bodyLanguageScore * 10) / 10,
    vocalScore: Math.round(vocalScore * 10) / 10,
    speechScore: Math.round(speechScore * 10) / 10,
  }
}

export async function analyzeVideo(file: File): Promise<AnalysisData> {
  try {
    // Step 1: Upload video and get job_id
    const formData = new FormData()
    formData.append('video', file)

    const uploadResponse = await fetch(`${API_BASE_URL}/api/upload-video`, {
      method: 'POST',
      body: formData,
    })

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => ({}))
      throw new Error(errorData.detail || 'Failed to upload video')
    }

    const uploadData: UploadVideoResponse = await uploadResponse.json()
    const jobId = uploadData.job_id

    if (!jobId) {
      throw new Error('No job_id received from upload endpoint')
    }

    // Step 2: Poll for job status until complete
    const jobStatus = await pollJobStatus(jobId)

    // Step 3: Check if transcription is available
    if (!jobStatus.transcription) {
      throw new Error('Transcription data not available')
    }

    // Step 4: Analyze transcription and create markers (use enriched_transcript if available)
    const { transcript, markers } = analyzeTranscription(
      jobStatus.transcription,
      jobStatus.enriched_transcript
    )

    // Step 5: Calculate scores (use enriched_transcript data if available for better accuracy)
    const scores = calculateScores(
      markers, 
      jobStatus.transcription.words,
      jobStatus.enriched_transcript
    )

    // Step 6: Return AnalysisData
    return {
      ...scores,
      transcript,
      markers,
    }
  } catch (error) {
    // Fallback to mock data for demo purposes
    console.warn('Backend error, using mock data:', error)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return mockAnalysisData
  }
}

// Helper to create a video URL from file
export function createVideoUrl(file: File): string {
  return URL.createObjectURL(file)
}

