import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

// Convert Base64 → Buffer
function base64ToBuffer(base64?: string) {
  if (!base64) return undefined;
  const clean = base64.split(",")[1] || base64;
  return Buffer.from(clean, "base64");
}

// ---------------------------------------------------------
// GET ROOMS (single or all)
// ---------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const include = {
      bedrooms: true,
      bathrooms: true,
      kitchen: true,
      bookings: false,
    };

    if (id) {
      const room = await prisma.room.findUnique({
        where: { id: Number(id) },
        include,
      });

      if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
      }

      const roomWithBase64 = {
        ...room,
        img1: room.img1 ? `data:image/jpeg;base64,${room.img1.toString("base64")}` : null,
        img2: room.img2 ? `data:image/jpeg;base64,${room.img2.toString("base64")}` : null,
        img3: room.img3 ? `data:image/jpeg;base64,${room.img3.toString("base64")}` : null,
        img4: room.img4 ? `data:image/jpeg;base64,${room.img4.toString("base64")}` : null,
      };

      return NextResponse.json({ room: roomWithBase64 });
    }

    const rooms = await prisma.room.findMany({
      include,
      orderBy: { id: "asc" },
    });

    const roomsWithImages = rooms.map((room) => ({
      ...room,
      img1: room.img1 ? `data:image/jpeg;base64,${room.img1.toString("base64")}` : null,
      img2: room.img2 ? `data:image/jpeg;base64,${room.img2.toString("base64")}` : null,
      img3: room.img3 ? `data:image/jpeg;base64,${room.img3.toString("base64")}` : null,
      img4: room.img4 ? `data:image/jpeg;base64,${room.img4.toString("base64")}` : null,
    }));

    return NextResponse.json({ rooms: roomsWithImages });
  } catch (err) {
    console.error("GET Rooms Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------
// CREATE ROOM
// ---------------------------------------------------------
export async function POST(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();

    const room = await prisma.room.create({
      data: {
        name: data.name,
        cost: data.cost,
        offer: data.offer,
        size: data.size,
        capacity: data.capacity, // ✅ manual capacity input

        // Amenities
        ac: data.ac,
        wifi: data.wifi,
        fan: data.fan,
        balcony: data.balcony,
        gardenView: data.gardenView,
        tv: data.tv,
        iron: data.iron,
        locker: data.locker,
        parking: data.parking,
        sittingArea: data.sittingArea,
        dryingRack: data.dryingRack,
        clothRack: data.clothRack,

        // Media
        img1: base64ToBuffer(data.img1),
        img2: base64ToBuffer(data.img2),
        img3: base64ToBuffer(data.img3),
        img4: base64ToBuffer(data.img4),
        video: base64ToBuffer(data.video),

        // Bedrooms
        bedrooms: {
          create: data.bedrooms?.map((b: any) => ({
            bedType: b.bedType,
            count: b.count,
          })) || [],
        },

        // Bathrooms
        bathrooms: {
          create: data.bathrooms?.map((b: any) => ({
            shower: b.shower,
            slipper: b.slipper,
            soap: b.soap,
            bidet: b.bidet,
            towels: b.towels,
            toiletPaper: b.toiletPaper,
            hotWater: b.hotWater,
            privateBathroom: b.privateBathroom,
          })) || [],
        },

        // Kitchen
        kitchen: data.kitchen
          ? {
              create: {
                diningTable: data.kitchen.diningTable,
                gasCooker: data.kitchen.gasCooker,
                riceCooker: data.kitchen.riceCooker,
                woodStove: data.kitchen.woodStove,
                fridge: data.kitchen.fridge,
                electricKettle: data.kitchen.electricKettle,
                waterBottle: data.kitchen.waterBottle,
              },
            }
          : undefined,
      },
      include: { bedrooms: true, bathrooms: true, kitchen: true },
    });

    return NextResponse.json({ message: "Room created", room });
  } catch (err) {
    console.error("POST Room Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------
// UPDATE ROOM
// ---------------------------------------------------------
export async function PATCH(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const id = Number(data.id);

    if (!id) return NextResponse.json({ error: "Room id required" }, { status: 400 });

    // Delete old bedrooms, bathrooms, and kitchen
    await prisma.bedroom.deleteMany({ where: { roomId: id } });
    await prisma.bathroom.deleteMany({ where: { roomId: id } });
    await prisma.kitchen.deleteMany({ where: { roomId: id } });

    const room = await prisma.room.update({
      where: { id },
      data: {
        name: data.name,
        cost: data.cost,
        offer: data.offer,
        size: data.size,
        capacity: data.capacity, // ✅ manual capacity input

        ac: data.ac,
        wifi: data.wifi,
        fan: data.fan,
        balcony: data.balcony,
        gardenView: data.gardenView,
        tv: data.tv,
        iron: data.iron,
        locker: data.locker,
        parking: data.parking,
        sittingArea: data.sittingArea,
        dryingRack: data.dryingRack,
        clothRack: data.clothRack,

        img1: data.img1 ? base64ToBuffer(data.img1) : undefined,
        img2: data.img2 ? base64ToBuffer(data.img2) : undefined,
        img3: data.img3 ? base64ToBuffer(data.img3) : undefined,
        img4: data.img4 ? base64ToBuffer(data.img4) : undefined,
        video: data.video ? base64ToBuffer(data.video) : undefined,

        bedrooms: {
          create: data.bedrooms?.map((b: any) => ({
            bedType: b.bedType,
            count: b.count,
          })) || [],
        },

        bathrooms: {
          create: data.bathrooms?.map((b: any) => ({
            shower: b.shower,
            slipper: b.slipper,
            soap: b.soap,
            bidet: b.bidet,
            towels: b.towels,
            toiletPaper: b.toiletPaper,
            hotWater: b.hotWater,
            privateBathroom: b.privateBathroom,
          })) || [],
        },

        kitchen: data.kitchen
          ? {
              create: {
                diningTable: data.kitchen.diningTable,
                gasCooker: data.kitchen.gasCooker,
                riceCooker: data.kitchen.riceCooker,
                woodStove: data.kitchen.woodStove,
                fridge: data.kitchen.fridge,
                electricKettle: data.kitchen.electricKettle,
                waterBottle: data.kitchen.waterBottle,
              },
            }
          : undefined,
      },
      include: { bedrooms: true, bathrooms: true, kitchen: true },
    });

    return NextResponse.json({ message: "Room updated", room });
  } catch (err) {
    console.error("PATCH Room Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------
// DELETE ROOM
// ---------------------------------------------------------
export async function DELETE(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "Room id required" }, { status: 400 });

    await prisma.room.delete({ where: { id } });

    return NextResponse.json({ message: "Room deleted" });
  } catch (err) {
    console.error("DELETE Room Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
