import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma"; // ✅ correct import
import bcrypt from "bcrypt";

// Use a secret to protect this route
const ADMIN_API_SECRET = process.env.ADMIN_API_SECRET;

export async function POST(req: NextRequest) {
  try {
    // 🔒 Check secret header
    const secret = req.headers.get("x-api-secret");
    if (secret !== ADMIN_API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username, password } = await req.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // ✅ Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // Remove password from response
    const { password: _, ...adminData } = admin;

    return NextResponse.json({
      message: "Admin created successfully",
      admin: adminData,
    });
  } catch (err) {
    console.error("Admin creation error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// 🔹 Optional: Auto-create default admin on first access
export async function GET() {
  try {
    const adminExists = await prisma.admin.findFirst();
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await prisma.admin.create({
        data: { username: "admin", password: hashedPassword },
      });
      console.log("✅ Default admin created: admin / admin123");
    }
    return NextResponse.json({ message: "Default admin checked/created" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
