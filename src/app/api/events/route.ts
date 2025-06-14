import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get('userId');
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const fromDate = searchParams.get('fromDate'); // ISO format
  const toDate = searchParams.get('toDate');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: any = {
    status: 'APPROVED',
  };

  if (category) {
    filters.category = category;
  }

  if (search) {
    filters.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (fromDate || toDate) {
    filters.startDate = {};
    if (fromDate) filters.startDate.gte = new Date(fromDate);
    if (toDate) filters.startDate.lte = new Date(toDate);
  }

  const events = await prisma.event.findMany({
    where: filters,
    orderBy: { startDate: 'asc' },
    include: {
      bookmarkedEvents: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
  });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = events.map((event: any) => ({
    ...event,
    isBookmarked: userId ? event.bookmarkedEvents.length > 0 : false,
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
 try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await req.json();
    const {
      title,
      description,
      location,
      latitude,
      longitude,
      startDate,
      endDate,
      imageUrl,
      category,
      ticketClasses,
    } = body;

    // Basic validation
    if (
      !title ||
      !description ||
      !location ||
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      !startDate ||
      !category ||
      !ticketClasses ||
      !Array.isArray(ticketClasses) ||
      ticketClasses.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        latitude,
        longitude,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        imageUrl,
        category,
        creatorId: userId,
        ticketClasses: {
          create: ticketClasses.map((tc) => ({
            name: tc.name,
            price: parseFloat(tc.price),
            quantity: parseInt(tc.quantity),
          })),
        },
      },
      include: {
        ticketClasses: true,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("[EVENT_CREATION_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}