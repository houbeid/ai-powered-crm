import type { AiAdvice } from '../types/deal.types'

interface AiAdviceCardProps {
  advice: AiAdvice
  onClose: () => void
}

const AiAdviceCard = ({ advice, onClose }: AiAdviceCardProps) => {
  return (
    <div className="space-y-4">

      {/* Analysis */}
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-blue-600 text-lg"></span>
          <h3 className="font-semibold text-blue-800 text-sm">Analysis</h3>
        </div>
        <p className="text-blue-700 text-sm leading-relaxed">
          {advice.analysis}
        </p>
      </div>

      {/* Obstacles */}
      <div className="bg-red-50 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-red-600 text-lg"></span>
          <h3 className="font-semibold text-red-800 text-sm">Obstacles</h3>
        </div>
        <p className="text-red-700 text-sm leading-relaxed">
          {advice.obstacles}
        </p>
      </div>

      {/* Recommendations */}
      <div className="bg-green-50 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-green-600 text-lg"></span>
          <h3 className="font-semibold text-green-800 text-sm">Recommendations</h3>
        </div>
        <p className="text-green-700 text-sm leading-relaxed">
          {advice.recommendations}
        </p>
      </div>

      {/* Closing Argument */}
      <div className="bg-purple-50 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-purple-600 text-lg"></span>
          <h3 className="font-semibold text-purple-800 text-sm">Closing Argument</h3>
        </div>
        <p className="text-purple-700 text-sm leading-relaxed">
          {advice.closingArgument}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
      >
        Close
      </button>

    </div>
  )
}

export default AiAdviceCard