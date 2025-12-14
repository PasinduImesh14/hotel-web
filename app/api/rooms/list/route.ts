import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      select: {
        id: true,
        name: true,
        cost: true,
        offer: true,
        size: true,
        capacity: true,

        // Amenities
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

        // EXCLUDE images & video for speed
        img1: false,
        img2: false,
        img3: false,
        img4: false,
        video: false,

        // Relations
        bedrooms: true,
        bathrooms: true,
        kitchen: true,
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ rooms });
  } catch (err) {
    console.error("FAST GET Rooms Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
