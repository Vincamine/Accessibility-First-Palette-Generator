import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

// Request body interface
interface GeneratePreviewRequest {
  description: string;
  colors: string[];
  dataType: 'categorical' | 'sequential' | 'diverging';
  paletteName: string;
}

// AI Response interface
interface PreviewResponse {
  chartType: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  data: Array<{
    label: string;
    value: number;
    category?: string;
  }>;
  description: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: GeneratePreviewRequest = await request.json();
    const { description, colors, dataType, paletteName } = body;

    // Validate input
    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: 'Description must be at least 10 characters' },
        { status: 400 }
      );
    }

    if (!colors || !Array.isArray(colors) || colors.length < 3) {
      return NextResponse.json(
        { error: 'At least 3 colors are required' },
        { status: 400 }
      );
    }

    if (!['categorical', 'sequential', 'diverging'].includes(dataType)) {
      return NextResponse.json(
        { error: 'Invalid data type' },
        { status: 400 }
      );
    }

    // Check API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Build prompt for Gemini
    const prompt = buildPreviewPrompt(description, colors, dataType, paletteName);

    // Call Gemini 2.5 Flash
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON response
    let previewData: PreviewResponse;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      previewData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, responseText);
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    // Validate AI response
    if (!previewData.chartType || !['bar', 'line', 'pie', 'area'].includes(previewData.chartType)) {
      return NextResponse.json(
        { error: 'Invalid chart type in AI response' },
        { status: 500 }
      );
    }

    if (!previewData.data || !Array.isArray(previewData.data)) {
      return NextResponse.json(
        { error: 'Invalid data format in AI response' },
        { status: 500 }
      );
    }

    if (previewData.data.length !== colors.length) {
      return NextResponse.json(
        { error: `AI returned ${previewData.data.length} data points instead of ${colors.length}` },
        { status: 500 }
      );
    }

    // Validate data points
    for (const point of previewData.data) {
      if (!point.label || typeof point.value !== 'number') {
        return NextResponse.json(
          { error: 'Invalid data point structure' },
          { status: 500 }
        );
      }
    }

    // Return successful response
    return NextResponse.json(previewData);

  } catch (error) {
    console.error('Error in /api/generate-preview:', error);
    return NextResponse.json(
      { error: 'Failed to generate preview. Please try again.' },
      { status: 500 }
    );
  }
}

// Build optimized prompt for Gemini
function buildPreviewPrompt(
  description: string,
  colors: string[],
  dataType: string,
  paletteName: string
): string {
  // Smart chart type recommendation based on context keywords
  const contextKeywords = description.toLowerCase();

  let chartTypeGuidance: string;
  let recommendedType: string;

  if (dataType === 'categorical') {
    // Detect distribution/composition context → prefer pie
    if (contextKeywords.includes('distribution') ||
        contextKeywords.includes('composition') ||
        contextKeywords.includes('breakdown') ||
        contextKeywords.includes('proportion') ||
        contextKeywords.includes('share')) {
      recommendedType = 'pie';
      chartTypeGuidance = 'STRONGLY RECOMMENDED: Use "pie" chart to show parts of a whole. Alternative: "bar" for comparing categories.';
    } else {
      recommendedType = 'bar';
      chartTypeGuidance = 'RECOMMENDED: Use "bar" for comparing categories, or "pie" for showing proportions.';
    }
  } else if (dataType === 'sequential') {
    // Detect time series/trend context → prefer line
    if (contextKeywords.includes('trend') ||
        contextKeywords.includes('time') ||
        contextKeywords.includes('over') ||
        contextKeywords.includes('progress') ||
        contextKeywords.includes('growth') ||
        contextKeywords.includes('change')) {
      recommendedType = 'line';
      chartTypeGuidance = 'STRONGLY RECOMMENDED: Use "line" chart to show trends over time. Alternative: "area" for cumulative view.';
    } else if (contextKeywords.includes('cumulative') ||
               contextKeywords.includes('total') ||
               contextKeywords.includes('accumulation')) {
      recommendedType = 'area';
      chartTypeGuidance = 'STRONGLY RECOMMENDED: Use "area" chart for cumulative trends. Alternative: "line" for simple trends.';
    } else {
      recommendedType = 'line';
      chartTypeGuidance = 'RECOMMENDED: Use "line" for trends, "area" for cumulative, or "bar" for ordered progression.';
    }
  } else { // diverging
    // Detect comparison/contrast context
    if (contextKeywords.includes('comparison') ||
        contextKeywords.includes('versus') ||
        contextKeywords.includes('vs') ||
        contextKeywords.includes('contrast')) {
      recommendedType = 'bar';
      chartTypeGuidance = 'STRONGLY RECOMMENDED: Use "bar" chart to show positive/negative divergence. Alternative: "area" for contrasting trends.';
    } else {
      recommendedType = 'area';
      chartTypeGuidance = 'RECOMMENDED: Use "area" for contrasting trends, or "bar" for showing divergence.';
    }
  }

  return `You are a data visualization expert.

**User's Context:**
- Original Description: "${description}"
- Palette Name: "${paletteName}"
- Data Type: ${dataType}
- Number of Colors: ${colors.length}
- Colors: ${colors.join(', ')}

**Task:** Design a realistic data visualization example that demonstrates this palette in a real-world context.

**Requirements:**

1. **Chart Type Selection:**
   ${chartTypeGuidance}

   Context Analysis:
   - Data Type: ${dataType}
   - Recommended Chart: ${recommendedType}
   - You MUST choose a chart type that matches the user's context
   - Vary your selection based on the description keywords
   - Don't always default to "bar" - use "line", "pie", or "area" when appropriate

2. **Mock Data Generation:**
   - Generate EXACTLY ${colors.length} data points (one per color)
   - Data must relate to the user's description context
   - Use realistic values and labels
   - Labels should be concise (1-3 words)
   - Values should be reasonable numbers (avoid extremes)

3. **Labels and Titles:**
   - Title should reflect the context (e.g., "Quarterly Revenue by Department")
   - X-axis and Y-axis labels should be clear and relevant
   - Everything should match the description's domain

4. **Chart Type Examples (USE VARIETY):**
   - Sequential + "trend over time" → LINE chart (e.g., "Monthly Sales Growth")
   - Sequential + "cumulative" → AREA chart (e.g., "Total Revenue Accumulation")
   - Categorical + "distribution/breakdown" → PIE chart (e.g., "Market Share by Vendor")
   - Categorical + "comparison" → BAR chart (e.g., "Sales by Region")
   - Diverging + "positive/negative" → BAR chart (e.g., "Profit vs Loss by Quarter")

5. **Context-Specific Examples:**
   - "Financial dashboard, quarterly" + sequential → LINE chart: "Stock Price Trend Q1-Q4"
   - "Ocean animals learning" + categorical → PIE chart: "Marine Species Distribution"
   - "Medical risk levels over time" + sequential → AREA chart: "Patient Risk Progression"
   - "Environmental climate change" + sequential → LINE chart: "Temperature Change 2020-2024"

**Output Format (MUST BE VALID JSON ONLY):**
{
  "chartType": "${recommendedType}",
  "title": "Meaningful Chart Title Related to Context",
  "xAxisLabel": "X Axis Label (optional for pie charts)",
  "yAxisLabel": "Y Axis Label (optional for pie charts)",
  "data": [
    {"label": "Label 1", "value": 42},
    {"label": "Label 2", "value": 35}
  ],
  "description": "Brief 1-2 sentence explanation of what this visualization shows and why it's appropriate"
}

**CRITICAL INSTRUCTIONS:**
- Return ONLY the JSON object, no other text before or after
- chartType MUST be one of: bar, line, pie, area
- STRONGLY PREFER "${recommendedType}" based on context analysis above
- Ensure EXACTLY ${colors.length} data points in the "data" array
- Use realistic, contextually appropriate data
- Match the chart type to the user's context: "${description}"
- IMPORTANT: Vary chart types - don't always use "bar"!

Generate the preview data now:`;
}
