'use client';

import { simulatePaletteCVD, CVDType, getTextColor, getDeltaE } from '@/lib/colorUtils';

interface CVDSimulationProps {
  colors: string[];
}

interface CVDInfo {
  type: CVDType;
  name: string;
  description: string;
  prevalence: string;
}

const cvdTypes: CVDInfo[] = [
  {
    type: 'protanopia',
    name: 'Protanopia',
    description: 'Red-blind (L-cone deficiency)',
    prevalence: '~1% of males',
  },
  {
    type: 'deuteranopia',
    name: 'Deuteranopia',
    description: 'Green-blind (M-cone deficiency)',
    prevalence: '~6% of males',
  },
  {
    type: 'tritanopia',
    name: 'Tritanopia',
    description: 'Blue-blind (S-cone deficiency)',
    prevalence: '~0.01% of population',
  },
];

export default function CVDSimulation({ colors }: CVDSimulationProps) {
  if (colors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Vision Simulations</h2>
        <p className="text-gray-500 text-center py-8">
          Generate a palette above to see how it appears to people with color vision deficiencies.
        </p>
      </div>
    );
  }

  // Check for problematic color pairs in each CVD type
  const checkDistinguishability = (simulatedColors: string[]): boolean => {
    for (let i = 0; i < simulatedColors.length; i++) {
      for (let j = i + 1; j < simulatedColors.length; j++) {
        const deltaE = getDeltaE(simulatedColors[i], simulatedColors[j]);
        if (deltaE < 3) {
          return false;
        }
      }
    }
    return true;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Vision Simulations</h2>
      <p className="text-sm text-gray-600 mb-6">
        See how your palette appears to people with different types of color vision deficiency (CVD).
      </p>

      <div className="space-y-6">
        {/* Normal Vision */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-800">Normal Vision</h3>
              <p className="text-xs text-gray-500">Trichromatic color vision</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Reference
            </span>
          </div>
          <div className="flex gap-2">
            {colors.map((color, index) => (
              <div
                key={index}
                className="flex-1 h-12 rounded-md shadow-sm flex items-center justify-center"
                style={{ backgroundColor: color }}
              >
                <span
                  className="text-[10px] font-mono font-medium"
                  style={{ color: getTextColor(color) }}
                >
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CVD Simulations */}
        {cvdTypes.map((cvd) => {
          const simulatedColors = simulatePaletteCVD(colors, cvd.type);
          const isDistinguishable = checkDistinguishability(simulatedColors);

          return (
            <div
              key={cvd.type}
              className={`border rounded-lg p-4 ${
                isDistinguishable ? 'border-gray-200' : 'border-red-300 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{cvd.name}</h3>
                  <p className="text-xs text-gray-500">
                    {cvd.description} • {cvd.prevalence}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    isDistinguishable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isDistinguishable ? 'Safe' : 'Warning'}
                </span>
              </div>
              <div className="flex gap-2">
                {simulatedColors.map((color, index) => (
                  <div
                    key={index}
                    className="flex-1 h-12 rounded-md shadow-sm flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    <span
                      className="text-[10px] font-mono font-medium"
                      style={{ color: getTextColor(color) }}
                    >
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
              {!isDistinguishable && (
                <p className="mt-2 text-xs text-red-600">
                  Some colors may be difficult to distinguish for people with {cvd.name.toLowerCase()}.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 p-3 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Understanding CVD Types</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li><strong>Protanopia:</strong> Difficulty distinguishing red from green, red appears darker</li>
          <li><strong>Deuteranopia:</strong> Difficulty distinguishing red from green, most common CVD</li>
          <li><strong>Tritanopia:</strong> Difficulty distinguishing blue from yellow, very rare</li>
        </ul>
      </div>
    </div>
  );
}
