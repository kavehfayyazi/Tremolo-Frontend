import { AnalysisData } from './types'

// Mock data for testing when backend is not available
export const mockAnalysisData: AnalysisData = {
  overallScore: 8.5,
  bodyLanguageScore: 9.0,
  vocalScore: 8.0,
  speechScore: 8.5,
  transcript:
    "Hello everyone, thank you for being here today. I'm excited to present our new product. Um, it's a revolutionary solution that, uh, addresses a key problem in the market. So, let me start by explaining the problem we're solving. The current solutions are, um, inefficient and expensive. Our product, on the other hand, provides a cost-effective alternative that, uh, really makes a difference.",
  markers: [
    {
      category: 'speech',
      timestamp: 12.5,
      feedback: "Filler word 'um' detected",
      transcriptStartIndex: 67,
      transcriptEndIndex: 69,
    },
    {
      category: 'speech',
      timestamp: 18.2,
      feedback: "Filler word 'uh' detected",
      transcriptStartIndex: 120,
      transcriptEndIndex: 122,
    },
    {
      category: 'vocal',
      timestamp: 25.8,
      feedback: 'Monotonous tone detected',
      transcriptStartIndex: 180,
      transcriptEndIndex: 200,
    },
    {
      category: 'body-language',
      timestamp: 30.5,
      feedback: 'Good eye contact maintained',
      transcriptStartIndex: 220,
      transcriptEndIndex: 240,
    },
    {
      category: 'speech',
      timestamp: 35.2,
      feedback: "Filler word 'um' detected",
      transcriptStartIndex: 280,
      transcriptEndIndex: 282,
    },
    {
      category: 'speech',
      timestamp: 42.1,
      feedback: "Filler word 'uh' detected",
      transcriptStartIndex: 320,
      transcriptEndIndex: 322,
    },
  ],
}

