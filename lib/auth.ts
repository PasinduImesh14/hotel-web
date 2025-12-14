import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "supersecretkey";

export interface AdminPayload {
  id: number;
  username: string;
}

export function verifyAdmin(req: NextRequest): AdminPayload | null {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AdminPayload;
    return payload;
  } catch {
    return null;
  }
}
