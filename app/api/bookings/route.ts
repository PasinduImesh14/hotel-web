// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  sendBookingNotification,
  sendBookingConfirmationToCustomer,
} from "@/lib/email";

/* ---------------------------------
   CREATE BOOKING
----------------------------------*/
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { customer, roomId, checkIn, checkOut, otherDetails } = data;

    /* -------- Validation -------- */
    if (!customer || !roomId || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: "Customer, roomId, checkIn, and checkOut are required" },
        { status: 400 }
      );
    }

    if (
      (!customer.nicNumber?.trim()) &&
      (!customer.passportNumber?.trim())
    ) {
      return NextResponse.json(
        { error: "NIC or Passport number is required" },
        { status: 400 }
      );
    }

    /* -------- Room check -------- */
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json(
        { error: `Room ${roomId} does not exist` },
        { status: 400 }
      );
    }

    /* -------- Booking conflict -------- */
    const conflict = await prisma.booking.findFirst({
      where: {
        roomId,
        checkIn: { lte: new Date(checkOut) },
        checkOut: { gte: new Date(checkIn) },
      },
    });

    if (conflict) {
      return NextResponse.json(
        {
          error: `Room already booked from ${conflict.checkIn.toISOString()} to ${conflict.checkOut.toISOString()}`,
        },
        { status: 400 }
      );
    }

    /* -------- Find / Create customer -------- */
    const filters: any[] = [];

    if (customer.nicNumber?.trim()) {
      filters.push({ nicNumber: customer.nicNumber.trim() });
    }

    if (customer.passportNumber?.trim()) {
      filters.push({ passportNumber: customer.passportNumber.trim() });
    }

    let customerRecord = null;

    if (filters.length > 0) {
      customerRecord = await prisma.customer.findFirst({
        where: { OR: filters },
      });
    }

    if (!customerRecord) {
      customerRecord = await prisma.customer.create({
        data: {
          name: customer.name,
          nicNumber: customer.nicNumber?.trim() || null,
          passportNumber: customer.passportNumber?.trim() || null,
          address: customer.address,
          contactNumber: customer.contactNumber,
        },
      });
    }

    /* -------- Create booking -------- */
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

    /* ---------------------------------
       NON-BLOCKING EMAILS (CRITICAL FIX)
    ----------------------------------*/

    // Admin notification (fire-and-forget)
    sendBookingNotification(
      customer.name,
      room.name,
      checkIn,
      checkOut,
      customer.contactNumber
    ).catch((err) =>
      console.error("Admin email failed:", err)
    );

    // Customer confirmation (only if valid email)
    if (
      typeof data.customerEmail === "string" &&
      data.customerEmail.includes("@")
    ) {
      sendBookingConfirmationToCustomer(
        customer.name,
        data.customerEmail,
        room.name,
        checkIn,
        checkOut
      ).catch((err) =>
        console.error("Customer email failed:", err)
      );
    }

    /* -------- Success -------- */
    return NextResponse.json({
      message: "Booking created successfully",
      booking,
    });

  } catch (err) {
    console.error("Booking creation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* ---------------------------------
   GET ALL BOOKINGS
----------------------------------*/
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
        room: {
          select: {
            id: true,
            name: true,
            cost: true,
            offer: true,
            size: true,
            capacity: true,
            ac: true,
            wifi: true,
            fan: true,
            balcony: true,
            gardenView: true,
            tv: true,
            iron: true,
            locker: true,
            parking: true,
            sittingArea: true,
            dryingRack: true,
            clothRack: true,
            // exclude img1-4 and video
          },
        },
        otherDetails: true,
      },
      orderBy: { checkIn: "asc" },
    });

    const formatted = bookings.map((b) => ({
      ...b,
      checkIn: b.checkIn.toISOString(),
      checkOut: b.checkOut.toISOString(),
    }));

    return NextResponse.json({ bookings: formatted });
  } catch (err) {
    console.error("Fetch bookings error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
/* ---------------------------------
   DELETE BOOKING
----------------------------------*/
export async function DELETE(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Booking id required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    await prisma.booking.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({
      message: "Booking deleted successfully",
    });

  } catch (err) {
    console.error("Delete booking error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
