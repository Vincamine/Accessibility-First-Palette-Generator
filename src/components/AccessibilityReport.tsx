'use client';

import {
  calculateAccessibilityScore,
  analyzePalettePairs,
  ColorPairAnalysis,
} from '@/lib/colorUtils';

interface AccessibilityReportProps {
  colors: string[];
}

export default function AccessibilityReport({ colors }: AccessibilityReportProps) {
  if (colors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Accessibility Report</h2>
        <p className="text-gray-500 text-center py-8">
          Generate a palette above to see the accessibility analysis.
        </p>
      </div>
    );
  }

  const score = calculateAccessibilityScore(colors);
  const pairs = analyzePalettePairs(colors);

  // Sort pairs by delta E (lowest first - most problematic)
  const sortedPairs = [...pairs].sort((a, b) => a.deltaE - b.deltaE);
  const problematicPairs = sortedPairs.filter(p => p.deltaE < 10).slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Accessibility Report</h2>

      {/* Overall Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Accessibility Score</span>
          <span
            className={`text-2xl font-bold ${
              score.overallScore >= 70
                ? 'text-green-600'
                : score.overallScore >= 40
                ? 'text-yellow-600'
                : 'text-red-600'
            }`}
          >
            {score.overallScore}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              score.overallScore >= 70
                ? 'bg-green-500'
                : score.overallScore >= 40
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${score.overallScore}%` }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Min ΔE"
          value={score.minDeltaE.toFixed(1)}
          status={score.minDeltaE >= 10 ? 'good' : score.minDeltaE >= 5 ? 'warning' : 'error'}
          tooltip="Minimum color difference between any two colors"
        />
        <MetricCard
          label="Avg ΔE"
          value={score.avgDeltaE.toFixed(1)}
          status={score.avgDeltaE >= 15 ? 'good' : score.avgDeltaE >= 8 ? 'warning' : 'error'}
          tooltip="Average color difference across all pairs"
        />
        <MetricCard
          label="Problematic"
          value={`${score.problematicPairs}/${score.totalPairs}`}
          status={score.problematicPairs === 0 ? 'good' : score.problematicPairs <= 2 ? 'warning' : 'error'}
          tooltip="Number of color pairs with ΔE < 5"
        />
        <MetricCard
          label="Min Contrast"
          value={score.minContrast.toFixed(2)}
          status={score.minContrast >= 4.5 ? 'good' : score.minContrast >= 3 ? 'warning' : 'error'}
          tooltip="Minimum WCAG contrast ratio"
        />
      </div>

      {/* CVD Safety */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Color Vision Deficiency Safety</h3>
        <div className="flex gap-3">
          <CVDBadge
            label="Protanopia"
            safe={score.cvdSafe.protanopia}
          />
          <CVDBadge
            label="Deuteranopia"
            safe={score.cvdSafe.deuteranopia}
          />
          <CVDBadge
            label="Tritanopia"
            safe={score.cvdSafe.tritanopia}
          />
        </div>
      </div>

      {/* Problematic Pairs */}
      {problematicPairs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Colors That Need Attention
          </h3>
          <div className="space-y-2">
            {problematicPairs.map((pair, index) => (
              <PairWarning key={index} pair={pair} />
            ))}
          </div>
        </div>
      )}

      {/* All Pairs Analysis */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          All Color Pairs ({pairs.length} total)
        </h3>
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Pair</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">ΔE</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Contrast</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedPairs.map((pair, index) => (
                <tr key={index} className={pair.deltaE < 5 ? 'bg-red-50' : ''}>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <div
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: pair.color1 }}
                        title={pair.color1}
                      />
                      <span className="text-gray-400">↔</span>
                      <div
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: pair.color2 }}
                        title={pair.color2}
                      />
                      <span className="text-xs text-gray-500 ml-1">
                        {pair.index1 + 1}-{pair.index2 + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {pair.deltaE.toFixed(1)}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {pair.contrastRatio.toFixed(2)}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        pair.distinguishability === 'excellent'
                          ? 'bg-green-100 text-green-800'
                          : pair.distinguishability === 'good'
                          ? 'bg-blue-100 text-blue-800'
                          : pair.distinguishability === 'poor'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {pair.distinguishability}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WCAG Guidelines */}
      <div className="mt-6 p-3 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Understanding the Metrics</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li><strong>ΔE (Delta E):</strong> Perceptual color difference. Values &gt;10 are clearly different, &lt;5 may be confused.</li>
          <li><strong>Contrast Ratio:</strong> WCAG luminance ratio. 4.5:1 for AA (normal text), 3:1 for AA (large text).</li>
          <li><strong>CVD Safe:</strong> Colors remain distinguishable for people with color vision deficiency.</li>
        </ul>
      </div>
    </div>
  );
}

// Helper Components

function MetricCard({
  label,
  value,
  status,
  tooltip,
}: {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'error';
  tooltip: string;
}) {
  return (
    <div
      className={`p-3 rounded-lg border ${
        status === 'good'
          ? 'bg-green-50 border-green-200'
          : status === 'warning'
          ? 'bg-yellow-50 border-yellow-200'
          : 'bg-red-50 border-red-200'
      }`}
      title={tooltip}
    >
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p
        className={`text-lg font-bold ${
          status === 'good'
            ? 'text-green-700'
            : status === 'warning'
            ? 'text-yellow-700'
            : 'text-red-700'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function CVDBadge({ label, safe }: { label: string; safe: boolean }) {
  return (
    <div
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        safe
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {safe ? '✓' : '✗'} {label}
    </div>
  );
}

function PairWarning({ pair }: { pair: ColorPairAnalysis }) {
  return (
    <div className="flex items-center gap-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
      <div className="flex items-center gap-1">
        <div
          className="w-6 h-6 rounded border border-gray-300"
          style={{ backgroundColor: pair.color1 }}
        />
        <span className="text-gray-400">↔</span>
        <div
          className="w-6 h-6 rounded border border-gray-300"
          style={{ backgroundColor: pair.color2 }}
        />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-700">
          Colors {pair.index1 + 1} and {pair.index2 + 1} have ΔE of{' '}
          <strong>{pair.deltaE.toFixed(1)}</strong>
        </p>
        <p className="text-xs text-gray-500">
          {pair.deltaE < 2
            ? 'Nearly indistinguishable - consider changing one color significantly'
            : pair.deltaE < 5
            ? 'May be confused - consider increasing color difference'
            : 'Borderline - acceptable but could be improved'}
        </p>
      </div>
    </div>
  );
}
