import { NextRequest, NextResponse } from 'next/server';
import { generateFeeWaiverJustification } from '@/lib/ai/openai';

export async function POST(request: NextRequest) {
  try {
    const { requestDescription, requesterCategory, reason } = await request.json();

    if (!requestDescription || !requesterCategory) {
      return NextResponse.json(
        { error: 'Request description and requester category are required' },
        { status: 400 }
      );
    }

    const justification = await generateFeeWaiverJustification(
      requestDescription,
      requesterCategory,
      reason
    );

    return NextResponse.json({ justification });
  } catch (error) {
    console.error('Error generating fee waiver justification:', error);
    return NextResponse.json(
      { error: 'Failed to generate fee waiver justification' },
      { status: 500 }
    );
  }
}