import { CategoryToggle } from '../types'

interface AnalysisDashboardProps {
  overallScore: number
  bodyLanguageScore: number
  vocalScore: number
  speechScore: number
  toggles: CategoryToggle
  onToggle: (category: keyof CategoryToggle) => void
}

interface ScoreItem {
  label: string
  score: number
  category: keyof CategoryToggle
  color: string
}

export default function AnalysisDashboard({
  overallScore,
  bodyLanguageScore,
  vocalScore,
  speechScore,
  toggles,
  onToggle,
}: AnalysisDashboardProps) {
  const scores: ScoreItem[] = [
    { label: 'Body Language', score: bodyLanguageScore, category: 'body-language', color: 'green' },
    { label: 'Vocal', score: vocalScore, category: 'vocal', color: 'blue' },
    { label: 'Speech', score: speechScore, category: 'speech', color: 'red' },
  ]

  // Sort by score (highest to lowest)
  const sortedScores = [...scores].sort((a, b) => b.score - a.score)

  const getToggleButtonClass = (isOn: boolean, color: string) => {
    const baseClass = 'px-4 py-2 rounded-lg font-medium transition-all'
    if (isOn) {
      const colorClasses = {
        green: 'bg-green-100 text-green-800 border-2 border-green-300',
        blue: 'bg-blue-100 text-blue-800 border-2 border-blue-300',
        red: 'bg-red-100 text-red-800 border-2 border-red-300',
      }
      return `${baseClass} ${colorClasses[color as keyof typeof colorClasses]}`
    }
    return `${baseClass} bg-gray-100 text-gray-600 border-2 border-gray-300`
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Analysis Dashboard</h2>

      {/* Overall Score */}
      <div className="mb-8">
        <div className="text-sm text-gray-600 mb-2">Overall Score</div>
        <div className="text-4xl font-bold text-gray-900">
          {overallScore.toFixed(1)} <span className="text-2xl text-gray-500">/ 10</span>
        </div>
      </div>

      {/* Sub-Scores */}
      <div className="mb-8 space-y-4">
        <div className="text-sm text-gray-600 mb-3">Sub-Scores</div>
        {sortedScores.map((item) => (
          <div key={item.category} className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">{item.label}</span>
            <span className="text-lg font-semibold text-gray-900">
              {item.score.toFixed(1)} / 10
            </span>
          </div>
        ))}
      </div>

      {/* Toggle Buttons */}
      <div className="space-y-3">
        <div className="text-sm text-gray-600 mb-3">Filter Categories</div>
        {scores.map((item) => (
          <button
            key={item.category}
            onClick={() => onToggle(item.category)}
            className={`w-full ${getToggleButtonClass(toggles[item.category], item.color)}`}
          >
            {item.label} {toggles[item.category] ? '[ON]' : '[OFF]'}
          </button>
        ))}
      </div>
    </div>
  )
}

