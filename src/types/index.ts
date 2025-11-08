export type FeedbackCategory = 'body-language' | 'vocal' | 'speech'

export interface FeedbackMarker {
  category: FeedbackCategory
  timestamp: number // in seconds
  feedback: string
  transcriptStartIndex: number
  transcriptEndIndex: number
}

export interface AnalysisData {
  overallScore: number
  bodyLanguageScore: number
  vocalScore: number
  speechScore: number
  transcript: string
  markers: FeedbackMarker[]
  videoUrl?: string
}

export interface CategoryToggle {
  'body-language': boolean
  vocal: boolean
  speech: boolean
}

// Backend API Types
export interface UploadVideoResponse {
  status: string
  job_id: string
}

export interface TranscriptionWord {
  text: string
  start: number
  end: number
  start_formatted: string
  end_formatted: string
  metrics: {
    wrist_velocity: number
    audio_intensity: number
    pitch: number
  }
}

export interface TranscriptionData {
  status: string
  full_text: string
  words: TranscriptionWord[]
  error: string | null
}

export interface EnrichedWord {
  text: string
  tags: string[]
  confidence_score: number
}

export interface SentenceAnalysis {
  avg_confidence: number
  fluency_score: number
  disfluency_count: number
  speaking_rate: number
  tag_distribution: Record<string, number>
  patterns: string[]
  word_count: number
  total_duration: number
}

export interface EnrichedTranscript {
  words: EnrichedWord[]
  sentence_analysis: SentenceAnalysis
}

export interface JobStatusResponse {
  status: string
  job_id?: string
  modal_id?: string
  transcription?: TranscriptionData
  vision?: any
  prosody?: any
  enriched_transcript?: EnrichedTranscript
  detail?: string
}

