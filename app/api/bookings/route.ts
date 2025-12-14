// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  sendBookingNotification,
  sendBookingConfirmationToCustomer,
} from "@/lib/email";

// ---------------- CREATE BOOKING ----------------
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { customer, roomId, checkIn, checkOut, otherDetails } = data;

    // Validate required fields
    if (!customer || !roomId || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Customer info, roomId, checkIn, and checkOut are required" },
        { status: 400 }
      );
    }

    // Require NIC or Passport
    if (
      (!customer.nicNumber || customer.nicNumber.trim() === "") &&
      (!customer.passportNumber || customer.passportNumber.trim() === "")
    ) {
      return NextResponse.json(
        { error: "Either NIC Number or Passport Number is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Check if room exists
    const roomExists = await prisma.room.findUnique({ where: { id: roomId } });

    if (!roomExists) {
      return NextResponse.json(
        { error: `Room with id ${roomId} does not exist` },
        { status: 400 }
      );
    }

    // 2️⃣ Check for booking conflict
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        checkIn: { lte: new Date(checkOut) },
        checkOut: { gte: new Date(checkIn) },
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        {
          error: `Room is already booked from ${conflictingBooking.checkIn.toISOString()} to ${conflictingBooking.checkOut.toISOString()}`,
        },
        { status: 400 }
      );
    }

    // 3️⃣ SAFE OR filter — prevents Prisma TS error + UNIQUE constraint error
    const filters: any[] = [];

    if (customer.nicNumber && customer.nicNumber.trim() !== "") {
      filters.push({ nicNumber: customer.nicNumber });
    }

    if (customer.passportNumber && customer.passportNumber.trim() !== "") {
      filters.push({ passportNumber: customer.passportNumber });
    }

    let customerRecord = null;

    // Only apply OR if we actually have filters
    if (filters.length > 0) {
      customerRecord = await prisma.customer.findFirst({
        where: { OR: filters },
      });
    }

    // 4️⃣ Create customer only if not found
    if (!customerRecord) {
      customerRecord = await prisma.customer.create({
        data: {
          name: customer.name,
          nicNumber:
            customer.nicNumber && customer.nicNumber.trim() !== ""
              ? customer.nicNumber
              : null, // prevents storing empty string → UNIQUE error

          passportNumber:
            customer.passportNumber && customer.passportNumber.trim() !== ""
              ? customer.passportNumber
              : null,

          address: customer.address,
          contactNumber: customer.contactNumber,
        },
      });
    }

    // 5️⃣ Create booking + otherDetails
    const booking = await prisma.booking.create({
      data: {
        roomId,
        customerId: customerRecord.id,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),

        otherDetails: otherDetails
          ? {
              create: {
                vehicleSupport: otherDetails.vehicleSupport,
                meal: otherDetails.meal,
                guide: otherDetails.guide,
                vehicleType: otherDetails.vehicleType,
                vehicleNumber: otherDetails.vehicleNumber,
                driver: otherDetails.driver,
              },
            }
          : undefined,
      },

      include: {
        customer: true,
        room: true,
        otherDetails: true,
      },
    });

    await sendBookingNotification(
      customer.name,
      roomExists.name,
      checkIn,
      checkOut,
      customer.contactNumber
    );
    if (data.customerEmail) {
      await sendBookingConfirmationToCustomer(
        customer.name,
        data.customerEmail,
        roomExists.name,
        checkIn,
        checkOut
      );
    }

    return NextResponse.json({
      message: "Booking created successfully",
      booking,
    });
  } catch (err) {
    console.error("Booking creation error:", err);
    return NextResponse.json(
      { error: "Something went wrong", details: String(err) },
      { status: 500 }
    );
  }
}

// ---------------- GET ALL BOOKINGS ----------------
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
        room: true,
        otherDetails: true,
      },
      orderBy: {
        checkIn: "asc", // Orders bookings by check-in date
      },
    });

    // Optional: convert dates to ISO strings for JSON
    const bookingsFormatted = bookings.map((b) => ({
      ...b,
      checkIn: b.checkIn.toISOString(),
      checkOut: b.checkOut.toISOString(),
    }));

    return NextResponse.json({ bookings: bookingsFormatted });
  } catch (err) {
    console.error("Fetch bookings error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
// ---------------- DELETE BOOKING ----------------
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Booking id is required" },
        { status: 400 }
      );
    }

    // Check if booking exists
    const bookingExists = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });

    if (!bookingExists) {
      return NextResponse.json(
        { error: `Booking with id ${id} does not exist` },
        { status: 404 }
      );
    }

    // Delete the booking (also deletes otherDetails because of Prisma relation)
    await prisma.booking.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Delete booking error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
