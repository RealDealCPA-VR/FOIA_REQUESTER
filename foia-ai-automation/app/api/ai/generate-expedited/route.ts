import { NextRequest, NextResponse } from 'next/server';
import { generateExpeditedProcessingJustification } from '@/lib/ai/openai';

export async function POST(request: NextRequest) {
  try {
    const { requestDescription, urgencyReason } = await request.json();

    if (!requestDescription || !urgencyReason) {
      return NextResponse.json(
        { error: 'Request description and urgency reason are required' },
        { status: 400 }
      );
    }

    const justification = await generateExpeditedProcessingJustification(
      requestDescription,
      urgencyReason
    );

    return NextResponse.json({ justification });
  } catch (error) {
    console.error('Error generating expedited processing justification:', error);
    return NextResponse.json(
      { error: 'Failed to generate expedited processing justification' },
      { status: 500 }
    );
  }
}