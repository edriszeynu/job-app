import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "6");

    const companies = await prisma.company.findMany({
      where: { isApproved: true },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: companies });
  } catch (error) {
    console.error("API /companies error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}