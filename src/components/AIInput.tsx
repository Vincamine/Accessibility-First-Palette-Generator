'use client';

import { useState } from 'react';

interface AIInputProps {
  dataType: 'categorical' | 'sequential' | 'diverging';
  colorCount: number;
  onGenerate: (colors: string[]) => void;
}

interface AIResponse {
  colors: string[];
  name: string;
  description: string;
  accessibility_notes: string;
}

const EXAMPLE_PROMPTS = [
  'Financial dashboard for quarterly earnings, professional and trustworthy',
  'Ocean animals learning app for ages 5-8, fun and engaging',
  'Medical patient risk levels, calm and clinical',
  'Environmental data showing climate change, serious and informative',
];

export default function AIInput({ dataType, colorCount, onGenerate }: AIInputProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);

  const handleGenerate = async () => {
    // Validate input
    if (description.trim().length < 10) {
      setError('Please enter at least 10 characters describing your visualization needs');
      return;
    }

    if (description.length > 500) {
      setError('Description must be less than 500 characters');
      return;
    }

    setError(null);
    setLoading(true);
    setAiResponse(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description.trim(),
          dataType,
          colorCount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate palette');
      }

      // Store AI response for display
      setAiResponse(data);

      // Trigger parent callback with colors
      onGenerate(data.colors);

    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate palette. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setDescription(example);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleGenerate();
    }
  };

  const isValid = description.trim().length >= 10 && description.length <= 500;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-6 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="text-3xl">🤖</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            AI Palette Generation
          </h3>
          <p className="text-sm text-gray-600">
            Describe your visualization needs and let AI generate an accessible palette for you
          </p>
        </div>
      </div>

      {/* Text Input */}
      <div className="mb-4">
        <label htmlFor="ai-description" className="block text-sm font-medium text-gray-700 mb-2">
          Describe Your Visualization
        </label>
        <textarea
          id="ai-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., Financial dashboard for quarterly reports, professional and trustworthy..."
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[96px] max-h-[192px]"
          disabled={loading}
          aria-describedby="char-count description-help"
        />

        {/* Character Counter */}
        <div className="flex items-center justify-between mt-2">
          <p id="description-help" className="text-xs text-gray-500">
            Tip: Press Ctrl/Cmd + Enter to generate
          </p>
          <span
            id="char-count"
            className={`text-xs font-medium ${
              description.length > 500 ? 'text-red-600' :
              description.length >= 10 ? 'text-green-600' :
              'text-gray-400'
            }`}
          >
            {description.length} / 500
          </span>
        </div>
      </div>

      {/* Example Prompts */}
      <div className="mb-4">
        <p className="text-xs text-gray-600 mb-2">💡 Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              disabled={loading}
              className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example.split(',')[0]}...
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!isValid || loading}
        className={`w-full py-3 px-4 rounded-md font-medium transition-all ${
          loading
            ? 'bg-blue-400 cursor-wait'
            : isValid
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        aria-live="polite"
        aria-busy={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating palette...
          </span>
        ) : (
          '✨ Generate with AI'
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div
          className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"
          role="alert"
          aria-live="assertive"
        >
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* AI Response Display */}
      {aiResponse && (
        <div
          className="mt-4 p-4 bg-white rounded-md border border-green-200 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-2 mb-2">
            <span className="text-green-600 text-xl">✓</span>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{aiResponse.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{aiResponse.description}</p>
            </div>
          </div>

          {aiResponse.accessibility_notes && (
            <div className="mt-3 p-2 bg-green-50 rounded-md">
              <p className="text-xs text-green-800">
                <span className="font-medium">♿ Accessibility:</span> {aiResponse.accessibility_notes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!aiResponse && !loading && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-xs text-blue-800">
            <strong>How it works:</strong> AI will analyze your description and generate a palette that matches your
            context (industry, mood, audience) while ensuring accessibility. The selected data type ({dataType}) and
            number of colors ({colorCount}) above will guide the generation.
          </p>
        </div>
      )}
    </div>
  );
}
