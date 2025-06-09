import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // adjust based on your setup

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const bookmarks = await prisma.bookmarkedEvent.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: 'desc' },
    });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const events = bookmarks.map((b: any) => ({
      ...b.event,
      isBookmarked: true,
    }));

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching bookmarked events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId, eventId } = await req.json();

  if (!userId || !eventId) {
    return NextResponse.json({ error: 'Missing userId or eventId' }, { status: 400 });
  }

  try {
    const bookmark = await prisma.bookmarkedEvent.create({
      data: { userId, eventId },
    });

    return NextResponse.json(bookmark, { status: 201 });
  }catch (error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  ) {
    return NextResponse.json({ message: 'Already bookmarked' }, { status: 200 });
  }

    console.error('POST /api/bookmark error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: { userId, eventId }
export async function DELETE(req: NextRequest) {
  const { userId, eventId } = await req.json();

  if (!userId || !eventId) {
    return NextResponse.json({ error: 'Missing userId or eventId' }, { status: 400 });
  }

  try {
    await prisma.bookmarkedEvent.deleteMany({
      where: { userId, eventId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/bookmark error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}