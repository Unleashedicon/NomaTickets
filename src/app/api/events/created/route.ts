import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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
        ticketClasses: true,
      },
      orderBy: { startDate: 'desc' }
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching created events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE event by ID
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const eventId = body.eventId;

    if (!eventId) {
      return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });
    }
    await prisma.ticket.deleteMany({
      where: { eventId },
    });

    // 2. Delete related ticket classes
    await prisma.ticketClass.deleteMany({
      where: { eventId },
    });

    // 3. Delete related bookmarks
    await prisma.bookmarkedEvent.deleteMany({
      where: { eventId },
    });

    // Then delete the event
    await prisma.event.delete({
      where: { id: eventId },
    });

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Could not delete event' }, { status: 500 });
  }
}
