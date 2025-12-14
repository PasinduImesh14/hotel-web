import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fromDate = searchParams.get("from"); // YYYY-MM-DD (today's date)

    if (!fromDate) {
      return NextResponse.json(
        { error: "from date is required" },
        { status: 400 }
      );
    }

    // Get all bookings for all rooms from the specified date onwards
    const bookings = await prisma.booking.findMany({
      where: {
        checkOut: {
          gte: new Date(fromDate), // Only get bookings that end on or after the specified date
        },
      },
      select: {
        roomId: true,
        checkIn: true,
        checkOut: true,
      },
      orderBy: [
        { roomId: 'asc' },
        { checkIn: 'asc' },
      ],
    });

    // Group bookings by roomId
    const bookingsByRoom = bookings.reduce((acc, booking) => {
      const roomId = booking.roomId.toString();
      
      if (!acc[roomId]) {
        acc[roomId] = [];
      }
      
      acc[roomId].push({
        checkIn: booking.checkIn.toISOString().split('T')[0],
        checkOut: booking.checkOut.toISOString().split('T')[0],
      });
      
      return acc;
    }, {} as Record<string, Array<{ checkIn: string; checkOut: string }>>);

    // Return booked slots grouped by room
    return NextResponse.json({ 
      bookingsByRoom,
      
    });
  } catch (err) {
    console.error("Fetch all booked dates error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}