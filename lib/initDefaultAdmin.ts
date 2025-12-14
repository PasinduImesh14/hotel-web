import prisma from "./prisma";
import bcrypt from "bcrypt";

export async function initDefaultAdmin() {
  try {
    // Check if any admin exists
    const adminExists = await prisma.admin.findFirst();
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await prisma.admin.create({
        data: {
          username: "admin",
          password: hashedPassword,
        },
      });

      console.log("✅ Default admin created: admin / admin123");
    }
  } catch (error) {
    console.error("❌ Failed to create default admin:", error);
  }
}
