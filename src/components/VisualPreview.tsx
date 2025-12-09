'use client';

import { useState } from 'react';
import { simulatePaletteCVD, CVDType, analyzePalettePairs } from '@/lib/colorUtils';
import { UserDataSet } from '@/lib/dataAnalysis';
import BarChart from './charts/BarChart';
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';
import AreaChart from './charts/AreaChart';

interface VisualPreviewProps {
  description: string;
  colors: string[];
  dataType: 'categorical' | 'sequential' | 'diverging';
  paletteName: string;
  userData: UserDataSet | null;
}

interface PreviewData {
  chartType: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  data: Array<{
    label: string;
    value: number;
  }>;
  description: string;
}

interface CVDInfo {
  type: CVDType | 'normal';
  name: string;
  description: string;
}

const cvdTypes: CVDInfo[] = [
  {
    type: 'normal',
    name: 'Normal Vision',
    description: 'Standard trichromatic color vision',
  },
  {
    type: 'protanopia',
    name: 'Protanopia',
    description: 'Red-blind (L-cone deficiency)',
  },
  {
    type: 'deuteranopia',
    name: 'Deuteranopia',
    description: 'Green-blind (M-cone deficiency)',
  },
  {
    type: 'tritanopia',
    name: 'Tritanopia',
    description: 'Blue-blind (S-cone deficiency)',
  },
];

export default function VisualPreview({
  description,
  colors,
  dataType,
  paletteName,
  userData,
}: VisualPreviewProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/generate-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          colors,
          dataType,
          paletteName,
          userData: userData?.raw, // NEW: Pass actual user data!
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate preview');
      }

      setPreviewData(data);
    } catch (err) {
      console.error('Preview generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate preview');
    } finally {
      setLoading(false);
    }
  };

  const renderChart = (colors: string[]) => {
    if (!previewData) return null;

    const chartProps = {
      data: previewData.data,
      colors,
      title: previewData.title,
      xAxisLabel: previewData.xAxisLabel,
      yAxisLabel: previewData.yAxisLabel,
    };

    switch (previewData.chartType) {
      case 'bar':
        return <BarChart {...chartProps} />;
      case 'line':
        return <LineChart {...chartProps} />;
      case 'pie':
        return <PieChart {...chartProps} />;
      case 'area':
        return <AreaChart {...chartProps} />;
      default:
        return <BarChart {...chartProps} />;
    }
  };

  const checkColorDistinguishability = (simulatedColors: string[]): { isDistinct: boolean; message: string } => {
    const pairs = analyzePalettePairs(simulatedColors);
    const problematicPairs = pairs.filter(p => p.deltaE < 5);

    if (problematicPairs.length === 0) {
      return { isDistinct: true, message: 'All colors are clearly distinct' };
    }

    const pairDescriptions = problematicPairs
      .slice(0, 2)
      .map(p => `${p.index1 + 1} & ${p.index2 + 1}`)
      .join(', ');

    return {
      isDistinct: false,
      message: `Colors ${pairDescriptions} may be difficult to distinguish`,
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="text-3xl">📊</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Visual Preview
          </h3>
          <p className="text-sm text-gray-600">
            See your palette in action with real-world examples across different color vision types
          </p>
        </div>
      </div>

      {/* Generate Button (Initial State) */}
      {!previewData && !loading && (
        <div className="text-center py-8">
          <button
            onClick={handleGenerate}
            disabled={colors.length < 3}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              colors.length < 3
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            💡 Generate Visual Example
          </button>
          {colors.length < 3 && (
            <p className="mt-2 text-sm text-gray-500">
              Generate a palette first to see visual preview
            </p>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12" role="status" aria-live="polite">
          <div className="inline-flex items-center gap-3">
            <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-600">Generating visual example...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md" role="alert">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error}
          </p>
          <button
            onClick={handleGenerate}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Preview Display */}
      {previewData && !loading && (
        <div>
          {/* Description */}
          <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Visualization:</strong> {previewData.description}
            </p>
          </div>

          {/* CVD Grid (2x2 on desktop, stacked on mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {cvdTypes.map((cvd) => {
              const simulatedColors = cvd.type === 'normal'
                ? colors
                : simulatePaletteCVD(colors, cvd.type as CVDType);

              const distinctCheck = checkColorDistinguishability(simulatedColors);

              return (
                <div
                  key={cvd.type}
                  className={`border rounded-lg p-4 ${
                    distinctCheck.isDistinct
                      ? 'border-green-200 bg-green-50/30'
                      : 'border-yellow-200 bg-yellow-50/30'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm">{cvd.name}</h4>
                      <p className="text-xs text-gray-500">{cvd.description}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        distinctCheck.isDistinct
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {distinctCheck.isDistinct ? '✓ Clear' : '⚠ Check'}
                    </span>
                  </div>

                  {/* Chart */}
                  <div className="h-48 mb-2">
                    {renderChart(simulatedColors)}
                  </div>

                  {/* Status Message */}
                  <p className={`text-xs ${
                    distinctCheck.isDistinct ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {distinctCheck.message}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              🔄 Regenerate Example
            </button>
          </div>

          {/* Info Note */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600">
              <strong>Note:</strong> This preview shows how your palette performs in real data visualization scenarios.
              Each view simulates different types of color vision deficiency to ensure your colors remain distinguishable for all users.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
