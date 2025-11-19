// ColorBrewer palettes - scientifically validated color schemes for data visualization
// Based on research by Cynthia Brewer: https://colorbrewer2.org/

export type PaletteType = 'sequential' | 'diverging' | 'categorical';

export interface PaletteInfo {
  name: string;
  colors: { [key: number]: string[] };
  type: PaletteType;
  colorBlindSafe: boolean;
}

// Sequential palettes - for ordered data from low to high
export const sequentialPalettes: PaletteInfo[] = [
  {
    name: 'Blues',
    type: 'sequential',
    colorBlindSafe: true,
    colors: {
      3: ['#deebf7', '#9ecae1', '#3182bd'],
      4: ['#eff3ff', '#bdd7e7', '#6baed6', '#2171b5'],
      5: ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c'],
      6: ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c'],
      7: ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594'],
      8: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#084594'],
      9: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
    },
  },
  {
    name: 'Greens',
    type: 'sequential',
    colorBlindSafe: true,
    colors: {
      3: ['#e5f5e0', '#a1d99b', '#31a354'],
      4: ['#edf8e9', '#bae4b3', '#74c476', '#238b45'],
      5: ['#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c'],
      6: ['#edf8e9', '#c7e9c0', '#a1d99b', '#74c476', '#31a354', '#006d2c'],
      7: ['#edf8e9', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#005a32'],
      8: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#005a32'],
      9: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
    },
  },
  {
    name: 'Oranges',
    type: 'sequential',
    colorBlindSafe: true,
    colors: {
      3: ['#fee6ce', '#fdae6b', '#e6550d'],
      4: ['#feedde', '#fdbe85', '#fd8d3c', '#d94701'],
      5: ['#feedde', '#fdbe85', '#fd8d3c', '#e6550d', '#a63603'],
      6: ['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#e6550d', '#a63603'],
      7: ['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#8c2d04'],
      8: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#8c2d04'],
      9: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
    },
  },
  {
    name: 'Purples',
    type: 'sequential',
    colorBlindSafe: true,
    colors: {
      3: ['#efedf5', '#bcbddc', '#756bb1'],
      4: ['#f2f0f7', '#cbc9e2', '#9e9ac8', '#6a51a3'],
      5: ['#f2f0f7', '#cbc9e2', '#9e9ac8', '#756bb1', '#54278f'],
      6: ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f'],
      7: ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#4a1486'],
      8: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#4a1486'],
      9: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
    },
  },
  {
    name: 'Reds',
    type: 'sequential',
    colorBlindSafe: true,
    colors: {
      3: ['#fee0d2', '#fc9272', '#de2d26'],
      4: ['#fee5d9', '#fcae91', '#fb6a4a', '#cb181d'],
      5: ['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15'],
      6: ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15'],
      7: ['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#99000d'],
      8: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#99000d'],
      9: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
    },
  },
  {
    name: 'Viridis',
    type: 'sequential',
    colorBlindSafe: true,
    colors: {
      3: ['#440154', '#21918c', '#fde725'],
      4: ['#440154', '#31688e', '#35b779', '#fde725'],
      5: ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725'],
      6: ['#440154', '#414487', '#2a788e', '#22a884', '#7ad151', '#fde725'],
      7: ['#440154', '#443983', '#31688e', '#21918c', '#35b779', '#90d743', '#fde725'],
      8: ['#440154', '#46327e', '#365c8d', '#277f8e', '#1fa187', '#4ac16d', '#a0da39', '#fde725'],
      9: ['#440154', '#472d7b', '#3b528b', '#2c728e', '#21918c', '#28ae80', '#5ec962', '#addc30', '#fde725'],
    },
  },
];

// Diverging palettes - for data with a meaningful midpoint
export const divergingPalettes: PaletteInfo[] = [
  {
    name: 'RdBu',
    type: 'diverging',
    colorBlindSafe: true,
    colors: {
      3: ['#ef8a62', '#f7f7f7', '#67a9cf'],
      4: ['#ca0020', '#f4a582', '#92c5de', '#0571b0'],
      5: ['#ca0020', '#f4a582', '#f7f7f7', '#92c5de', '#0571b0'],
      6: ['#b2182b', '#ef8a62', '#fddbc7', '#d1e5f0', '#67a9cf', '#2166ac'],
      7: ['#b2182b', '#ef8a62', '#fddbc7', '#f7f7f7', '#d1e5f0', '#67a9cf', '#2166ac'],
      8: ['#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac'],
      9: ['#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac'],
    },
  },
  {
    name: 'PiYG',
    type: 'diverging',
    colorBlindSafe: true,
    colors: {
      3: ['#e9a3c9', '#f7f7f7', '#a1d76a'],
      4: ['#d01c8b', '#f1b6da', '#b8e186', '#4dac26'],
      5: ['#d01c8b', '#f1b6da', '#f7f7f7', '#b8e186', '#4dac26'],
      6: ['#c51b7d', '#e9a3c9', '#fde0ef', '#e6f5d0', '#a1d76a', '#4d9221'],
      7: ['#c51b7d', '#e9a3c9', '#fde0ef', '#f7f7f7', '#e6f5d0', '#a1d76a', '#4d9221'],
      8: ['#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221'],
      9: ['#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221'],
    },
  },
  {
    name: 'PRGn',
    type: 'diverging',
    colorBlindSafe: true,
    colors: {
      3: ['#af8dc3', '#f7f7f7', '#7fbf7b'],
      4: ['#7b3294', '#c2a5cf', '#a6dba0', '#008837'],
      5: ['#7b3294', '#c2a5cf', '#f7f7f7', '#a6dba0', '#008837'],
      6: ['#762a83', '#af8dc3', '#e7d4e8', '#d9f0d3', '#7fbf7b', '#1b7837'],
      7: ['#762a83', '#af8dc3', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#7fbf7b', '#1b7837'],
      8: ['#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837'],
      9: ['#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837'],
    },
  },
  {
    name: 'BrBG',
    type: 'diverging',
    colorBlindSafe: true,
    colors: {
      3: ['#d8b365', '#f5f5f5', '#5ab4ac'],
      4: ['#a6611a', '#dfc27d', '#80cdc1', '#018571'],
      5: ['#a6611a', '#dfc27d', '#f5f5f5', '#80cdc1', '#018571'],
      6: ['#8c510a', '#d8b365', '#f6e8c3', '#c7eae5', '#5ab4ac', '#01665e'],
      7: ['#8c510a', '#d8b365', '#f6e8c3', '#f5f5f5', '#c7eae5', '#5ab4ac', '#01665e'],
      8: ['#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#c7eae5', '#80cdc1', '#35978f', '#01665e'],
      9: ['#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e'],
    },
  },
  {
    name: 'RdYlBu',
    type: 'diverging',
    colorBlindSafe: true,
    colors: {
      3: ['#fc8d59', '#ffffbf', '#91bfdb'],
      4: ['#d7191c', '#fdae61', '#abd9e9', '#2c7bb6'],
      5: ['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#2c7bb6'],
      6: ['#d73027', '#fc8d59', '#fee090', '#e0f3f8', '#91bfdb', '#4575b4'],
      7: ['#d73027', '#fc8d59', '#fee090', '#ffffbf', '#e0f3f8', '#91bfdb', '#4575b4'],
      8: ['#d73027', '#f46d43', '#fdae61', '#fee090', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4'],
      9: ['#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4'],
    },
  },
];

// Categorical/Qualitative palettes - for nominal data without inherent ordering
export const categoricalPalettes: PaletteInfo[] = [
  {
    name: 'Set1',
    type: 'categorical',
    colorBlindSafe: false,
    colors: {
      3: ['#e41a1c', '#377eb8', '#4daf4a'],
      4: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3'],
      5: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'],
      6: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33'],
      7: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628'],
      8: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf'],
      9: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
    },
  },
  {
    name: 'Set2',
    type: 'categorical',
    colorBlindSafe: true,
    colors: {
      3: ['#66c2a5', '#fc8d62', '#8da0cb'],
      4: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3'],
      5: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854'],
      6: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f'],
      7: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494'],
      8: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
      9: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3', '#8dd3c7'],
    },
  },
  {
    name: 'Paired',
    type: 'categorical',
    colorBlindSafe: true,
    colors: {
      3: ['#a6cee3', '#1f78b4', '#b2df8a'],
      4: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c'],
      5: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
      6: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c'],
      7: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f'],
      8: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00'],
      9: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6'],
    },
  },
  {
    name: 'Dark2',
    type: 'categorical',
    colorBlindSafe: true,
    colors: {
      3: ['#1b9e77', '#d95f02', '#7570b3'],
      4: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a'],
      5: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e'],
      6: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02'],
      7: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d'],
      8: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
      9: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666', '#8dd3c7'],
    },
  },
  {
    name: 'Accent',
    type: 'categorical',
    colorBlindSafe: false,
    colors: {
      3: ['#7fc97f', '#beaed4', '#fdc086'],
      4: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99'],
      5: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0'],
      6: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f'],
      7: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17'],
      8: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
      9: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666', '#8dd3c7'],
    },
  },
  {
    name: 'Tableau10',
    type: 'categorical',
    colorBlindSafe: true,
    colors: {
      3: ['#4e79a7', '#f28e2b', '#e15759'],
      4: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2'],
      5: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f'],
      6: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948'],
      7: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1'],
      8: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7'],
      9: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7', '#9c755f'],
    },
  },
];

// Get all palettes by type
export function getPalettesByType(type: PaletteType): PaletteInfo[] {
  switch (type) {
    case 'sequential':
      return sequentialPalettes;
    case 'diverging':
      return divergingPalettes;
    case 'categorical':
      return categoricalPalettes;
  }
}

// Get a specific palette
export function getPalette(type: PaletteType, name: string, numColors: number): string[] | null {
  const palettes = getPalettesByType(type);
  const palette = palettes.find(p => p.name === name);
  if (!palette) return null;
  return palette.colors[numColors] || null;
}

// Get all available palette names by type
export function getPaletteNames(type: PaletteType): string[] {
  return getPalettesByType(type).map(p => p.name);
}