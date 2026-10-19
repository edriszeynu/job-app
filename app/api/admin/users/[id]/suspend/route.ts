// app/api/admin/users/[id]/suspend/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Suspend by setting emailVerified to false (disables login effectively)
    await prisma.user.update({
      where: { id },
      data: { emailVerified: false },
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: auth.session?.user?.id ?? "",
        action: "SUSPEND_USER",
        details: { userId: id, email: user.email },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User suspend error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}