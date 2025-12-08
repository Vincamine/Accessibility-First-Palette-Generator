'use client';

import { useState } from 'react';
import PaletteGenerator from '@/components/PaletteGenerator';
import CVDSimulation from '@/components/CVDSimulation';
import AccessibilityReport from '@/components/AccessibilityReport';
import VisualPreview from '@/components/VisualPreview';

export default function Home() {
  const [colors, setColors] = useState<string[]>([]);
  const [paletteMetadata, setPaletteMetadata] = useState<{
    description: string;
    paletteName: string;
    dataType: 'categorical' | 'sequential' | 'diverging';
  } | null>(null);

  const handlePaletteGenerated = (newColors: string[]) => {
    setColors(newColors);
  };

  const handleAIPaletteGenerated = (
    newColors: string[],
    metadata: { description: string; paletteName: string; dataType: 'categorical' | 'sequential' | 'diverging' }
  ) => {
    setColors(newColors);
    setPaletteMetadata(metadata);
  };

  const handleColorChange = (index: number, newColor: string) => {
    const updatedColors = [...colors];
    updatedColors[index] = newColor;
    setColors(updatedColors);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Accessibility-First Palette Generator
          </h1>
          <p className="mt-2 text-gray-600">
            Generate scientifically-validated color palettes with built-in accessibility guarantees
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Section 1: Palette Generator */}
          <section>
            <PaletteGenerator
              onPaletteGenerated={handlePaletteGenerated}
              onAIPaletteGenerated={handleAIPaletteGenerated}
              currentPalette={colors}
              onColorChange={handleColorChange}
            />
          </section>

          {/* Section 2: Visual Preview (AI-generated examples) */}
          {paletteMetadata && colors.length > 0 && (
            <section>
              <VisualPreview
                description={paletteMetadata.description}
                colors={colors}
                dataType={paletteMetadata.dataType}
                paletteName={paletteMetadata.paletteName}
              />
            </section>
          )}

          {/* Section 3: Vision Simulations */}
          <section>
            <CVDSimulation colors={colors} />
          </section>

          {/* Section 4: Accessibility Report */}
          <section>
            <AccessibilityReport colors={colors} />
          </section>
        </div>

        {/* Footer Info */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            Built with ColorBrewer research and the culori library for accurate color science calculations.
          </p>
          <p className="mt-1">
            Supports WCAG 2.1 guidelines and CIELAB ΔE color difference metrics.
          </p>
        </footer>
      </div>
    </main>
  );
}
