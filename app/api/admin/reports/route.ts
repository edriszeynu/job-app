import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const status = request.nextUrl.searchParams.get("status") || "ALL";

  const where: any = {};
  if (status !== "ALL") where.status = status;

  const reports = await prisma.report.findMany({
    where,
    include: {
      reporter: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reports);
}
