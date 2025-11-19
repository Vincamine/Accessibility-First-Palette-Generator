// Color utility functions using culori library
import {
  parse,
  formatHex,
  wcagContrast,
  differenceCiede2000,
  filterDeficiencyProt,
  filterDeficiencyDeuter,
  filterDeficiencyTrit,
  converter,
  type Color,
} from 'culori';

// CVD Types
export type CVDType = 'protanopia' | 'deuteranopia' | 'tritanopia';

// Simulate color vision deficiency
export function simulateCVD(color: string, type: CVDType): string {
  const parsed = parse(color);
  if (!parsed) return color;

  let simulated: Color | undefined;
  switch (type) {
    case 'protanopia':
      simulated = filterDeficiencyProt(1)(parsed);
      break;
    case 'deuteranopia':
      simulated = filterDeficiencyDeuter(1)(parsed);
      break;
    case 'tritanopia':
      simulated = filterDeficiencyTrit(1)(parsed);
      break;
  }

  return simulated ? formatHex(simulated) : color;
}

// Simulate entire palette for CVD
export function simulatePaletteCVD(colors: string[], type: CVDType): string[] {
  return colors.map(color => simulateCVD(color, type));
}

// Calculate WCAG contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const c1 = parse(color1);
  const c2 = parse(color2);
  if (!c1 || !c2) return 0;
  return wcagContrast(c1, c2);
}

// Check WCAG compliance level
export type WCAGLevel = 'AAA' | 'AA' | 'Fail';

export function getWCAGLevel(contrastRatio: number, isLargeText: boolean = false): WCAGLevel {
  if (isLargeText) {
    if (contrastRatio >= 4.5) return 'AAA';
    if (contrastRatio >= 3) return 'AA';
  } else {
    if (contrastRatio >= 7) return 'AAA';
    if (contrastRatio >= 4.5) return 'AA';
  }
  return 'Fail';
}

// Calculate Delta E (CIE2000) color difference
export function getDeltaE(color1: string, color2: string): number {
  const c1 = parse(color1);
  const c2 = parse(color2);
  if (!c1 || !c2) return 0;
  return differenceCiede2000()(c1, c2);
}

// Check if two colors are distinguishable
// Delta E < 1: Not perceptible
// Delta E 1-2: Perceptible through close observation
// Delta E 2-10: Perceptible at a glance
// Delta E > 10: Colors are more similar than opposite
export function getDistinguishabilityLevel(deltaE: number): 'excellent' | 'good' | 'poor' | 'indistinguishable' {
  if (deltaE >= 10) return 'excellent';
  if (deltaE >= 5) return 'good';
  if (deltaE >= 2) return 'poor';
  return 'indistinguishable';
}

// Calculate all pairwise color differences in a palette
export interface ColorPairAnalysis {
  color1: string;
  color2: string;
  index1: number;
  index2: number;
  deltaE: number;
  contrastRatio: number;
  wcagLevel: WCAGLevel;
  distinguishability: 'excellent' | 'good' | 'poor' | 'indistinguishable';
}

export function analyzePalettePairs(colors: string[]): ColorPairAnalysis[] {
  const pairs: ColorPairAnalysis[] = [];

  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const deltaE = getDeltaE(colors[i], colors[j]);
      const contrastRatio = getContrastRatio(colors[i], colors[j]);

      pairs.push({
        color1: colors[i],
        color2: colors[j],
        index1: i,
        index2: j,
        deltaE,
        contrastRatio,
        wcagLevel: getWCAGLevel(contrastRatio),
        distinguishability: getDistinguishabilityLevel(deltaE),
      });
    }
  }

  return pairs;
}

// Get overall palette accessibility score
export interface PaletteAccessibilityScore {
  overallScore: number; // 0-100
  minDeltaE: number;
  avgDeltaE: number;
  minContrast: number;
  avgContrast: number;
  problematicPairs: number;
  totalPairs: number;
  cvdSafe: {
    protanopia: boolean;
    deuteranopia: boolean;
    tritanopia: boolean;
  };
}

export function calculateAccessibilityScore(colors: string[]): PaletteAccessibilityScore {
  const pairs = analyzePalettePairs(colors);
  const totalPairs = pairs.length;

  if (totalPairs === 0) {
    return {
      overallScore: 100,
      minDeltaE: 0,
      avgDeltaE: 0,
      minContrast: 0,
      avgContrast: 0,
      problematicPairs: 0,
      totalPairs: 0,
      cvdSafe: { protanopia: true, deuteranopia: true, tritanopia: true },
    };
  }

  const deltaEs = pairs.map(p => p.deltaE);
  const contrasts = pairs.map(p => p.contrastRatio);

  const minDeltaE = Math.min(...deltaEs);
  const avgDeltaE = deltaEs.reduce((a, b) => a + b, 0) / totalPairs;
  const minContrast = Math.min(...contrasts);
  const avgContrast = contrasts.reduce((a, b) => a + b, 0) / totalPairs;
  const problematicPairs = pairs.filter(p => p.deltaE < 5).length;

  // Check CVD safety
  const cvdTypes: CVDType[] = ['protanopia', 'deuteranopia', 'tritanopia'];
  const cvdSafe = {
    protanopia: true,
    deuteranopia: true,
    tritanopia: true,
  };

  for (const cvdType of cvdTypes) {
    const simulatedColors = simulatePaletteCVD(colors, cvdType);
    const simulatedPairs = analyzePalettePairs(simulatedColors);
    const hasIndistinguishable = simulatedPairs.some(p => p.deltaE < 3);
    cvdSafe[cvdType] = !hasIndistinguishable;
  }

  // Calculate overall score (weighted)
  // Delta E score: 40 points (min 10 = 40, min 0 = 0)
  // Contrast score: 30 points (avg 4.5 = 30, avg 1 = 0)
  // CVD safety: 30 points (10 per type)

  const deltaEScore = Math.min(40, (minDeltaE / 10) * 40);
  const contrastScore = Math.min(30, ((avgContrast - 1) / 3.5) * 30);
  const cvdScore =
    (cvdSafe.protanopia ? 10 : 0) +
    (cvdSafe.deuteranopia ? 10 : 0) +
    (cvdSafe.tritanopia ? 10 : 0);

  const overallScore = Math.round(deltaEScore + contrastScore + cvdScore);

  return {
    overallScore,
    minDeltaE,
    avgDeltaE,
    minContrast,
    avgContrast,
    problematicPairs,
    totalPairs,
    cvdSafe,
  };
}

// Convert color to different formats
export function getColorInfo(color: string) {
  const parsed = parse(color);
  if (!parsed) return null;

  const toLab = converter('lab');
  const toHsl = converter('hsl');
  const toRgb = converter('rgb');

  const lab = toLab(parsed);
  const hsl = toHsl(parsed);
  const rgb = toRgb(parsed);

  return {
    hex: formatHex(parsed),
    rgb: rgb ? { r: Math.round((rgb.r || 0) * 255), g: Math.round((rgb.g || 0) * 255), b: Math.round((rgb.b || 0) * 255) } : null,
    hsl: hsl ? { h: Math.round(hsl.h || 0), s: Math.round((hsl.s || 0) * 100), l: Math.round((hsl.l || 0) * 100) } : null,
    lab: lab ? { l: Math.round(lab.l || 0), a: Math.round(lab.a || 0), b: Math.round(lab.b || 0) } : null,
  };
}

// Get luminance of a color (for determining text color)
export function getLuminance(color: string): number {
  const parsed = parse(color);
  if (!parsed) return 0;

  const toRgb = converter('rgb');
  const rgb = toRgb(parsed);
  if (!rgb) return 0;

  // Calculate relative luminance
  const rVal = rgb.r || 0;
  const gVal = rgb.g || 0;
  const bVal = rgb.b || 0;
  const r = rVal <= 0.03928 ? rVal / 12.92 : Math.pow((rVal + 0.055) / 1.055, 2.4);
  const g = gVal <= 0.03928 ? gVal / 12.92 : Math.pow((gVal + 0.055) / 1.055, 2.4);
  const b = bVal <= 0.03928 ? bVal / 12.92 : Math.pow((bVal + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Determine if text should be light or dark on a given background
export function getTextColor(backgroundColor: string): string {
  const luminance = getLuminance(backgroundColor);
  return luminance > 0.179 ? '#000000' : '#ffffff';
}