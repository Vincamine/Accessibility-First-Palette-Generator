import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

// Request body interface
interface GenerateRequest {
  description: string;
  dataType: 'categorical' | 'sequential' | 'diverging';
  colorCount: number;
}

// AI Response interface
interface AIResponse {
  colors: string[];
  name: string;
  description: string;
  accessibility_notes: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: GenerateRequest = await request.json();
    const { description, dataType, colorCount } = body;

    // Validate input
    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: 'Description must be at least 10 characters' },
        { status: 400 }
      );
    }

    if (description.length > 500) {
      return NextResponse.json(
        { error: 'Description must be less than 500 characters' },
        { status: 400 }
      );
    }

    if (!['categorical', 'sequential', 'diverging'].includes(dataType)) {
      return NextResponse.json(
        { error: 'Invalid data type' },
        { status: 400 }
      );
    }

    if (colorCount < 3 || colorCount > 9) {
      return NextResponse.json(
        { error: 'Color count must be between 3 and 9' },
        { status: 400 }
      );
    }

    // Check API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    // Build prompt for Gemini
    const prompt = buildPrompt(description, dataType, colorCount);

    // Call Gemini 2.5 Flash (fast and cost-effective)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON response
    let aiResponse: AIResponse;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      aiResponse = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, responseText);
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    // Validate AI response
    if (!aiResponse.colors || !Array.isArray(aiResponse.colors)) {
      return NextResponse.json(
        { error: 'Invalid AI response format: missing colors array' },
        { status: 500 }
      );
    }

    if (aiResponse.colors.length !== colorCount) {
      return NextResponse.json(
        { error: `AI returned ${aiResponse.colors.length} colors instead of ${colorCount}` },
        { status: 500 }
      );
    }

    // Validate hex colors
    const hexRegex = /^#[0-9a-f]{6}$/i;
    const invalidColors = aiResponse.colors.filter(color => !hexRegex.test(color));
    if (invalidColors.length > 0) {
      return NextResponse.json(
        { error: `Invalid color format: ${invalidColors.join(', ')}` },
        { status: 500 }
      );
    }

    // Return successful response
    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error('Error in /api/generate:', error);
    return NextResponse.json(
      { error: 'Failed to generate palette. Please try again.' },
      { status: 500 }
    );
  }
}

// Build optimized prompt for Gemini
function buildPrompt(description: string, dataType: string, colorCount: number): string {
  const dataTypeDescriptions = {
    categorical: 'distinct categories without inherent order (e.g., different products, categories)',
    sequential: 'ordered data from low to high values (e.g., temperature, population density)',
    diverging: 'data with a meaningful midpoint, showing deviation in two directions (e.g., profit/loss, temperature anomaly)',
  };

  return `You are an expert data visualization designer specializing in accessible color palettes.

Generate a color palette based on these requirements:

**User's Description:** ${description}

**Data Type:** ${dataType} (${dataTypeDescriptions[dataType as keyof typeof dataTypeDescriptions]})

**Number of Colors:** ${colorCount}

**Accessibility Requirements:**
1. All colors must be suitable for data visualization
2. Must be color blindness accessible (CVD-safe)
3. Delta E (CIELAB ΔE2000) should be > 10 between adjacent colors for clear distinction
4. Consider the context from the user's description (industry, mood, target audience)
5. For sequential palettes: use a progression from light to dark or vice versa
6. For categorical palettes: use maximally distinct hues
7. For diverging palettes: use two contrasting hues with a neutral midpoint

**Context Understanding:**
- Analyze the user's description to understand the industry, purpose, and audience
- Choose colors that match the emotional tone (professional, playful, serious, calm, etc.)
- Respect domain conventions (e.g., red/yellow/green for risk, blue for corporate)

**Output Format (MUST BE VALID JSON ONLY):**
{
  "colors": ["#hex1", "#hex2", "#hex3", ...],
  "name": "Descriptive Palette Name",
  "description": "2-3 sentences explaining why these colors work for this specific context and how they create visual hierarchy or distinction",
  "accessibility_notes": "1-2 sentences explaining how this palette ensures accessibility (CVD safety, Delta E values, contrast)"
}

CRITICAL INSTRUCTIONS:
- Return ONLY the JSON object, no other text before or after
- Ensure exactly ${colorCount} colors in the array
- All colors must be in 6-digit lowercase hex format (e.g., #1f77b4)
- Make colors contextually appropriate for: "${description}"

Generate the palette now:`;
}
