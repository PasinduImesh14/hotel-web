import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Use a secret from environment variables
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "supersecretkey";

// POST: Admin login
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Find admin by username
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" } // token valid for 7 days
    );

    // Remove password from response
    const { password: _, ...adminData } = admin;

    return NextResponse.json({
      message: "Login successful",
      admin: adminData,
      token,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
