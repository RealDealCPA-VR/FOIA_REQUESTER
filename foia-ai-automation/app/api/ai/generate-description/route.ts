import { NextRequest, NextResponse } from 'next/server';
import { generateRequestDescription } from '@/lib/ai/openai';

export async function POST(request: NextRequest) {
  try {
    const { topic, context } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const description = await generateRequestDescription(topic, context);

    return NextResponse.json({ description });
  } catch (error) {
    console.error('Error generating description:', error);
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    );
  }
}