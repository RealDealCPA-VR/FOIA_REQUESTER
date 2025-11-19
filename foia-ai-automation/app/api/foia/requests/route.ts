import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { foiaRequests } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const requests = await db
      .select()
      .from(foiaRequests)
      .orderBy(desc(foiaRequests.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      requests,
      count: requests.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching FOIA requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FOIA requests' },
      { status: 500 }
    );
  }
}