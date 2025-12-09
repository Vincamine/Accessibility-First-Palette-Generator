/**
 * Data Analysis Utilities
 * Analyzes user-uploaded datasets to extract characteristics for AI palette generation
 */

export interface DataPoint {
  label: string;
  value: number;
  category?: string;
}

export interface DataCharacteristics {
  // Basic statistics
  numDataPoints: number;
  numUniqueCategories?: number;
  categoryNames?: string[];

  // Numerical statistics
  valueRange?: [number, number];
  mean?: number;
  median?: number;
  stdDev?: number;

  // Distribution analysis
  distribution?: 'uniform' | 'skewed' | 'bimodal' | 'normal';
  skewness?: number;

  // Data quality
  hasNulls: boolean;
  nullPercentage: number;
  hasOutliers: boolean;
  outlierIndices?: number[];

  // Trend analysis (for sequential data)
  trend?: 'increasing' | 'decreasing' | 'fluctuating' | 'stable';

  // Recommended palette type
  recommendedType: 'categorical' | 'sequential' | 'diverging';
  recommendedColorCount: number;
}

export interface UserDataSet {
  raw: DataPoint[];
  characteristics: DataCharacteristics;
  metadata: {
    fileName?: string;
    uploadedAt: Date;
    format: 'csv' | 'json' | 'manual';
  };
}

/**
 * Analyze uploaded dataset and extract characteristics
 */
export function analyzeDataset(data: DataPoint[]): DataCharacteristics {
  // Filter out null/invalid values
  const validData = data.filter(d => d.value !== null && d.value !== undefined && !isNaN(d.value));
  const hasNulls = validData.length < data.length;
  const nullPercentage = ((data.length - validData.length) / data.length) * 100;

  // Extract values and categories
  const values = validData.map(d => d.value);
  const categories = validData.map(d => d.label);
  const uniqueCategories = Array.from(new Set(categories));

  // Basic statistics
  const min = Math.min(...values);
  const max = Math.max(...values);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  // Standard deviation
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Skewness (simple measure)
  const skewness = calculateSkewness(values, mean, stdDev);

  // Distribution classification
  const distribution = classifyDistribution(values, skewness);

  // Outlier detection (IQR method)
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  const outlierIndices = validData
    .map((d, i) => (d.value < lowerBound || d.value > upperBound) ? i : -1)
    .filter(i => i !== -1);
  const hasOutliers = outlierIndices.length > 0;

  // Trend analysis (for sequential data)
  const trend = analyzeTrend(values);

  // Recommend palette type based on data characteristics
  const { recommendedType, recommendedColorCount } = recommendPaletteType(
    uniqueCategories.length,
    trend,
    values
  );

  return {
    numDataPoints: validData.length,
    numUniqueCategories: uniqueCategories.length,
    categoryNames: uniqueCategories,
    valueRange: [min, max],
    mean,
    median,
    stdDev,
    distribution,
    skewness,
    hasNulls,
    nullPercentage,
    hasOutliers,
    outlierIndices: hasOutliers ? outlierIndices : undefined,
    trend,
    recommendedType,
    recommendedColorCount,
  };
}

/**
 * Calculate skewness
 */
function calculateSkewness(values: number[], mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  const n = values.length;
  const skew = values.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0);
  return skew / n;
}

/**
 * Classify distribution type
 */
function classifyDistribution(
  values: number[],
  skewness: number
): 'uniform' | 'skewed' | 'bimodal' | 'normal' {
  // Simple classification based on skewness
  if (Math.abs(skewness) < 0.5) return 'uniform';
  if (Math.abs(skewness) > 1) return 'skewed';

  // Check for bimodal (very simple check - look for two peaks)
  const histogram = createHistogram(values, 10);
  const peaks = findPeaks(histogram);
  if (peaks.length >= 2) return 'bimodal';

  return 'normal';
}

/**
 * Analyze trend in sequential data
 */
function analyzeTrend(values: number[]): 'increasing' | 'decreasing' | 'fluctuating' | 'stable' {
  if (values.length < 3) return 'stable';

  let increases = 0;
  let decreases = 0;

  for (let i = 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    if (Math.abs(diff) < 0.01) continue; // Consider as stable
    if (diff > 0) increases++;
    else decreases++;
  }

  const total = increases + decreases;
  if (total === 0) return 'stable';

  const increaseRatio = increases / total;

  if (increaseRatio > 0.7) return 'increasing';
  if (increaseRatio < 0.3) return 'decreasing';
  return 'fluctuating';
}

/**
 * Recommend palette type based on data characteristics
 */
function recommendPaletteType(
  numCategories: number,
  trend: string | undefined,
  values: number[]
): { recommendedType: 'categorical' | 'sequential' | 'diverging'; recommendedColorCount: number } {
  // If trend exists and is clear, suggest sequential
  if (trend && (trend === 'increasing' || trend === 'decreasing')) {
    return {
      recommendedType: 'sequential',
      recommendedColorCount: Math.min(numCategories, 9),
    };
  }

  // If values cross zero (positive and negative), suggest diverging
  const hasPositive = values.some(v => v > 0);
  const hasNegative = values.some(v => v < 0);
  if (hasPositive && hasNegative) {
    return {
      recommendedType: 'diverging',
      recommendedColorCount: Math.min(numCategories, 11),
    };
  }

  // Default to categorical
  return {
    recommendedType: 'categorical',
    recommendedColorCount: Math.min(numCategories, 12),
  };
}

/**
 * Create histogram
 */
function createHistogram(values: number[], bins: number): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binWidth = (max - min) / bins;
  const histogram = new Array(bins).fill(0);

  values.forEach(val => {
    const binIndex = Math.min(Math.floor((val - min) / binWidth), bins - 1);
    histogram[binIndex]++;
  });

  return histogram;
}

/**
 * Find peaks in histogram
 */
function findPeaks(histogram: number[]): number[] {
  const peaks: number[] = [];
  for (let i = 1; i < histogram.length - 1; i++) {
    if (histogram[i] > histogram[i - 1] && histogram[i] > histogram[i + 1]) {
      peaks.push(i);
    }
  }
  return peaks;
}

/**
 * Parse CSV string to DataPoint array
 */
export function parseCSV(csvText: string): DataPoint[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim());

  // Expect format: label, value or category, value
  if (headers.length < 2) {
    throw new Error('CSV must have at least 2 columns (label, value)');
  }

  const data: DataPoint[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length < 2) continue;

    const label = values[0];
    const value = parseFloat(values[1]);
    const category = values[2] || undefined;

    if (isNaN(value)) {
      console.warn(`Invalid value at line ${i + 1}: ${values[1]}`);
      continue;
    }

    data.push({ label, value, category });
  }

  return data;
}

/**
 * Parse JSON to DataPoint array
 */
export function parseJSON(jsonText: string): DataPoint[] {
  try {
    const parsed = JSON.parse(jsonText);

    if (!Array.isArray(parsed)) {
      throw new Error('JSON must be an array of objects');
    }

    return parsed.map((item, index) => {
      if (!item.label || item.value === undefined) {
        throw new Error(`Invalid data point at index ${index}: must have 'label' and 'value' fields`);
      }

      return {
        label: String(item.label),
        value: Number(item.value),
        category: item.category ? String(item.category) : undefined,
      };
    });
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate dataset
 */
export function validateDataset(data: DataPoint[]): { valid: boolean; error?: string } {
  if (!data || data.length === 0) {
    return { valid: false, error: 'Dataset is empty' };
  }

  if (data.length < 3) {
    return { valid: false, error: 'Dataset must have at least 3 data points' };
  }

  if (data.length > 100) {
    return { valid: false, error: 'Dataset must have at most 100 data points (for performance)' };
  }

  const validPoints = data.filter(d => d.value !== null && d.value !== undefined && !isNaN(d.value));
  if (validPoints.length < 3) {
    return { valid: false, error: 'Dataset must have at least 3 valid numerical values' };
  }

  return { valid: true };
}
