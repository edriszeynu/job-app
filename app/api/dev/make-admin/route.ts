import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== (process.env.ADMIN_SECRET || "jobhub-admin-2024")) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 403 });
  }

  const email = "admin@jobhub.com";
  const password = "Admin@123456";

  try {
    // Upsert admin user
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.upsert({
      where: { email },
      update: { isAdmin: true, isSuperAdmin: true },
      create: {
        email,
        name: "Super Admin",
        password: hashed,
        role: "JOB_SEEKER",
        emailVerified: true,
        isAdmin: true,
        isSuperAdmin: true,
      },
      select: { id: true, name: true, email: true, role: true, isAdmin: true },
    });

    return NextResponse.json({
      success: true,
      user,
      credentials: { email, password },
      message: "Sign in at /auth/signin with these credentials",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
