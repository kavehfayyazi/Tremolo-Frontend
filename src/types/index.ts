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

