import { CategoryToggle } from '../types'

interface ScoreDisplayProps {
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

export default function ScoreDisplay({
  overallScore,
  bodyLanguageScore,
  vocalScore,
  speechScore,
  toggles,
  onToggle,
}: ScoreDisplayProps) {
  const scores: ScoreItem[] = [
    { label: 'Body Language', score: bodyLanguageScore, category: 'body-language', color: 'green' },
    { label: 'Vocal', score: vocalScore, category: 'vocal', color: 'blue' },
    { label: 'Speech', score: speechScore, category: 'speech', color: 'red' },
  ]

  // Sort by score (highest to lowest)
  const sortedScores = [...scores].sort((a, b) => b.score - a.score)

  const getToggleButtonClass = (isOn: boolean, color: string) => {
    const baseClass = 'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
    if (isOn) {
      const colorClasses = {
        green: 'bg-green-500 focus:ring-green-400',
        blue: 'bg-blue-500 focus:ring-blue-400',
        red: 'bg-red-500 focus:ring-red-400',
      }
      return `${baseClass} ${colorClasses[color as keyof typeof colorClasses]}`
    }
    return `${baseClass} bg-gray-300 focus:ring-gray-400`
  }

  const getToggleDotClass = (isOn: boolean) => {
    const baseClass = 'inline-block h-4 w-4 transform rounded-full bg-white transition-transform'
    if (isOn) {
      return `${baseClass} translate-x-4`
    }
    return `${baseClass} translate-x-0.5`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-tight">Analysis Dashboard</h2>

      {/* Overall Score */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Overall Score</div>
        <div className="text-3xl font-semibold text-gray-900">
          {overallScore.toFixed(1)}<span className="text-lg font-normal text-gray-500 ml-1">/ 10</span>
        </div>
      </div>

      {/* Sub-Scores with Toggles */}
      <div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">Sub-Scores</div>
        <div className="space-y-4">
          {sortedScores.map((item, index) => (
            <div key={item.category}>
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                </div>
                <button
                  onClick={() => onToggle(item.category)}
                  className={getToggleButtonClass(toggles[item.category], item.color)}
                  aria-label={`Toggle ${item.label} filter`}
                >
                  <span className={getToggleDotClass(toggles[item.category])} />
                </button>
                <div className="text-right">
                  <span className="text-base font-semibold text-gray-900">
                    {(item.score * 10).toFixed(0)}%
                  </span>
                </div>
              </div>
              {index < sortedScores.length - 1 && (
                <div className="mt-4 border-t border-gray-100" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

