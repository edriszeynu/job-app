import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "6");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      isApproved: true,
    };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: { company: true },
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      prisma.job.count({ where }),
    ]);

    return NextResponse.json({
      data: jobs,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("API /jobs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}