'use client';

import { useState } from 'react';
import { parseCSV, parseJSON, validateDataset, analyzeDataset, UserDataSet, DataPoint } from '@/lib/dataAnalysis';

interface DataUploaderProps {
  onDataLoaded: (dataset: UserDataSet) => void;
  currentDataset: UserDataSet | null;
}

const EXAMPLE_DATASETS = {
  'quarterly-revenue': {
    name: 'Quarterly Revenue by Department (7 categories)',
    data: [
      { label: 'Sales', value: 45 },
      { label: 'Marketing', value: 32 },
      { label: 'Engineering', value: 28 },
      { label: 'Operations', value: 22 },
      { label: 'HR', value: 15 },
      { label: 'Finance', value: 18 },
      { label: 'Legal', value: 12 },
    ],
  },
  'temperature-trend': {
    name: 'Monthly Temperature (Sequential)',
    data: [
      { label: 'Jan', value: 5 },
      { label: 'Feb', value: 7 },
      { label: 'Mar', value: 12 },
      { label: 'Apr', value: 18 },
      { label: 'May', value: 23 },
    ],
  },
  'profit-loss': {
    name: 'Quarterly Profit/Loss (Diverging)',
    data: [
      { label: 'Q1', value: -15 },
      { label: 'Q2', value: -8 },
      { label: 'Q3', value: 5 },
      { label: 'Q4', value: 12 },
      { label: 'Q5', value: 18 },
    ],
  },
};

export default function DataUploader({ onDataLoaded, currentDataset }: DataUploaderProps) {
  const [inputMethod, setInputMethod] = useState<'file' | 'paste' | 'example'>('example');
  const [pasteValue, setPasteValue] = useState('');
  const [pasteFormat, setPasteFormat] = useState<'csv' | 'json'>('csv');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const processData = (data: DataPoint[], format: 'csv' | 'json' | 'manual', fileName?: string) => {
    setError(null);
    setLoading(true);

    try {
      // Validate dataset
      const validation = validateDataset(data);
      if (!validation.valid) {
        setError(validation.error || 'Invalid dataset');
        setLoading(false);
        return;
      }

      // Analyze dataset
      const characteristics = analyzeDataset(data);

      // Create UserDataSet
      const dataset: UserDataSet = {
        raw: data,
        characteristics,
        metadata: {
          fileName,
          uploadedAt: new Date(),
          format,
        },
      };

      onDataLoaded(dataset);
      setLoading(false);
    } catch (err) {
      console.error('Data processing error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process data');
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const format = file.name.endsWith('.json') ? 'json' : 'csv';

      try {
        const data = format === 'json' ? parseJSON(text) : parseCSV(text);
        processData(data, format, file.name);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse file');
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setLoading(false);
    };

    reader.readAsText(file);
  };

  const handlePaste = () => {
    if (!pasteValue.trim()) {
      setError('Please paste your data');
      return;
    }

    try {
      const data = pasteFormat === 'json' ? parseJSON(pasteValue) : parseCSV(pasteValue);
      processData(data, pasteFormat);
      setPasteValue(''); // Clear after successful parse
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse data');
    }
  };

  const handleExampleSelect = (key: string) => {
    const example = EXAMPLE_DATASETS[key as keyof typeof EXAMPLE_DATASETS];
    if (!example) return;
    processData(example.data, 'manual', example.name);
  };

  // Reserved for future use - allow users to clear pasted data
  // const handleClearData = () => {
  //   setPasteValue('');
  //   setError(null);
  // };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="text-3xl">📊</div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Your Data
          </h2>
          <p className="text-sm text-gray-600">
            Upload or paste your dataset to generate a palette tailored to your actual data
          </p>
        </div>
      </div>

      {/* Current Dataset Info */}
      {currentDataset && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">
                ✓ Dataset Loaded
              </p>
              <p className="text-xs text-green-700 mt-1">
                {currentDataset.characteristics.numDataPoints} data points,{' '}
                {currentDataset.characteristics.numUniqueCategories} categories
                {currentDataset.metadata.fileName && ` • ${currentDataset.metadata.fileName}`}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Recommended: {currentDataset.characteristics.recommendedType} palette with{' '}
                {currentDataset.characteristics.recommendedColorCount} colors
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Input Method Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        <button
          onClick={() => setInputMethod('example')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            inputMethod === 'example'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📚 Examples
        </button>
        <button
          onClick={() => setInputMethod('file')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            inputMethod === 'file'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📁 Upload File
        </button>
        <button
          onClick={() => setInputMethod('paste')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            inputMethod === 'paste'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          📋 Paste Data
        </button>
      </div>

      {/* Example Datasets */}
      {inputMethod === 'example' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">
            Try these example datasets to see how palette generation works:
          </p>
          {Object.entries(EXAMPLE_DATASETS).map(([key, example]) => (
            <button
              key={key}
              onClick={() => handleExampleSelect(key)}
              disabled={loading}
              className="w-full px-4 py-3 text-left border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <p className="text-sm font-medium text-gray-800">{example.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {example.data.length} data points
              </p>
            </button>
          ))}
        </div>
      )}

      {/* File Upload */}
      {inputMethod === 'file' && (
        <div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              disabled={loading}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-4xl mb-2">📤</div>
              <p className="text-sm font-medium text-gray-700">
                Click to upload CSV or JSON file
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Max 100 data points • CSV format: label,value or JSON: [{`{label, value}`}]
              </p>
            </label>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600 font-medium mb-2">CSV Format Example:</p>
            <pre className="text-xs text-gray-700 bg-white p-2 rounded border border-gray-200 overflow-x-auto">
{`label,value
Sales,45
Marketing,32
Engineering,28`}
            </pre>
          </div>
        </div>
      )}

      {/* Paste Data */}
      {inputMethod === 'paste' && (
        <div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Format
            </label>
            <div className="flex gap-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="csv"
                  checked={pasteFormat === 'csv'}
                  onChange={(e) => setPasteFormat(e.target.value as 'csv')}
                  className="mr-2"
                />
                <span className="text-sm">CSV</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="json"
                  checked={pasteFormat === 'json'}
                  onChange={(e) => setPasteFormat(e.target.value as 'json')}
                  className="mr-2"
                />
                <span className="text-sm">JSON</span>
              </label>
            </div>
          </div>

          <textarea
            value={pasteValue}
            onChange={(e) => setPasteValue(e.target.value)}
            placeholder={
              pasteFormat === 'csv'
                ? 'label,value\nSales,45\nMarketing,32\nEngineering,28'
                : '[{"label":"Sales","value":45},{"label":"Marketing","value":32}]'
            }
            className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />

          <button
            onClick={handlePaste}
            disabled={loading || !pasteValue.trim()}
            className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Load Data'}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>💡 How it works:</strong> Your data is analyzed locally to extract characteristics
          like number of categories, value range, and distribution. The AI uses these insights to
          generate a palette optimally suited to your specific dataset.
        </p>
      </div>
    </div>
  );
}
