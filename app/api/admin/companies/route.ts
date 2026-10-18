// app/api/admin/companies/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    if (status === "pending") {
      where.isApproved = false;
    } else if (status === "approved") {
      where.isApproved = true;
    } else if (status === "rejected") {
      where.isApproved = false;
      // You might want to add a "rejected" status field
    }

    const companies = await prisma.company.findMany({
      where,
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: { jobs: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error("Companies fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}