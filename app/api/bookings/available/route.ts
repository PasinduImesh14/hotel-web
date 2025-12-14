import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");
    const fromDate = searchParams.get("from"); // YYYY-MM-DD (today's date)

    if (!roomId || !fromDate) {
      return NextResponse.json(
        { error: "roomId and from date are required" },
        { status: 400 }
      );
    }

    // Get all bookings for this room from today onwards
    const bookings = await prisma.booking.findMany({
      where: {
        roomId: Number(roomId),
        checkOut: {
          gte: new Date(fromDate), // Only get bookings that end on or after today
        },
      },
      select: {
        checkIn: true,
        checkOut: true,
      },
      orderBy: {
        checkIn: 'asc',
      },
    });

    // Return booked slots
    return NextResponse.json({ 
      bookedSlots: bookings.map(booking => ({
        checkIn: booking.checkIn.toISOString().split('T')[0],
        checkOut: booking.checkOut.toISOString().split('T')[0],
      }))
    });
  } catch (err) {
    console.error("Fetch booked dates error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}