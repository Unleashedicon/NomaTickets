import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // adjust based on your setup

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const events = await prisma.event.findMany({
      where: {
        creatorId: userId,
      },
        include: {
    ticketClasses: true, // ⬅️ Add this line to include ticket info
  },
orderBy: { startDate: 'desc' }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching created events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
