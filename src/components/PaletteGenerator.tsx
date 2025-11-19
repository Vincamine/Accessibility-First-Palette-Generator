'use client';

import { useState } from 'react';
import {
  PaletteType,
  getPalettesByType,
  getPalette,
} from '@/lib/colorBrewerPalettes';
import { getTextColor, getColorInfo } from '@/lib/colorUtils';

interface PaletteGeneratorProps {
  onPaletteGenerated: (colors: string[]) => void;
  currentPalette: string[];
  onColorChange: (index: number, color: string) => void;
}

export default function PaletteGenerator({
  onPaletteGenerated,
  currentPalette,
  onColorChange,
}: PaletteGeneratorProps) {
  const [paletteType, setPaletteType] = useState<PaletteType>('categorical');
  const [numColors, setNumColors] = useState<number>(5);
  const [selectedPalette, setSelectedPalette] = useState<string>('Tableau10');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const availablePalettes = getPalettesByType(paletteType);

  const handleGenerate = () => {
    const colors = getPalette(paletteType, selectedPalette, numColors);
    if (colors) {
      onPaletteGenerated(colors);
    }
  };

  const handleTypeChange = (type: PaletteType) => {
    setPaletteType(type);
    // Reset to first available palette of new type
    const palettes = getPalettesByType(type);
    if (palettes.length > 0) {
      setSelectedPalette(palettes[0].name);
    }
  };

  const handleColorClick = (index: number) => {
    setEditingIndex(editingIndex === index ? null : index);
  };

  const handleColorInputChange = (index: number, value: string) => {
    onColorChange(index, value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Smart Palette Generation</h2>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Data Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Type
          </label>
          <select
            value={paletteType}
            onChange={(e) => handleTypeChange(e.target.value as PaletteType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="categorical">Categorical</option>
            <option value="sequential">Sequential</option>
            <option value="diverging">Diverging</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            {paletteType === 'categorical' && 'For distinct categories without order'}
            {paletteType === 'sequential' && 'For ordered data from low to high'}
            {paletteType === 'diverging' && 'For data with a meaningful midpoint'}
          </p>
        </div>

        {/* Number of Colors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Colors
          </label>
          <select
            value={numColors}
            onChange={(e) => setNumColors(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[3, 4, 5, 6, 7, 8, 9].map((n) => (
              <option key={n} value={n}>
                {n} colors
              </option>
            ))}
          </select>
        </div>

        {/* Palette Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Palette
          </label>
          <select
            value={selectedPalette}
            onChange={(e) => setSelectedPalette(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {availablePalettes.map((palette) => (
              <option key={palette.name} value={palette.name}>
                {palette.name} {palette.colorBlindSafe ? '(CVD Safe)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium mb-6"
      >
        Generate Palette
      </button>

      {/* Generated Palette Display */}
      {currentPalette.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Generated Palette (click to edit)
          </h3>
          <div className="flex flex-wrap gap-3">
            {currentPalette.map((color, index) => {
              const colorInfo = getColorInfo(color);
              const textColor = getTextColor(color);
              const isEditing = editingIndex === index;

              return (
                <div key={index} className="relative">
                  <button
                    onClick={() => handleColorClick(index)}
                    className={`w-20 h-20 rounded-lg shadow-md border-2 transition-all ${
                      isEditing ? 'border-blue-500 scale-105' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    <span
                      className="text-xs font-mono font-medium"
                      style={{ color: textColor }}
                    >
                      {color.toUpperCase()}
                    </span>
                  </button>

                  {/* Color Picker Popup */}
                  {isEditing && (
                    <div className="absolute top-full left-0 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200 z-10 min-w-[200px]">
                      <div className="mb-2">
                        <label className="block text-xs text-gray-600 mb-1">
                          Hex Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => handleColorInputChange(index, e.target.value)}
                            className="w-10 h-8 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={color}
                            onChange={(e) => handleColorInputChange(index, e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded font-mono"
                          />
                        </div>
                      </div>
                      {colorInfo && (
                        <div className="text-xs text-gray-500 space-y-1">
                          {colorInfo.rgb && (
                            <p>RGB: {colorInfo.rgb.r}, {colorInfo.rgb.g}, {colorInfo.rgb.b}</p>
                          )}
                          {colorInfo.hsl && (
                            <p>HSL: {colorInfo.hsl.h}°, {colorInfo.hsl.s}%, {colorInfo.hsl.l}%</p>
                          )}
                          {colorInfo.lab && (
                            <p>Lab: {colorInfo.lab.l}, {colorInfo.lab.a}, {colorInfo.lab.b}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Palette Info */}
      {currentPalette.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Tip:</strong> Click on any color swatch to edit it. The accessibility report
            below will update in real-time to show how your changes affect accessibility.
          </p>
        </div>
      )}
    </div>
  );
}
