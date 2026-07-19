import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [totalJobs, totalCompanies, totalUsers] = await Promise.all([
      prisma.job.count({ where: { isActive: true, isApproved: true } }),
      prisma.company.count({ where: { isApproved: true } }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      data: { totalJobs, totalCompanies, totalUsers },
    });
  } catch (error) {
    console.error("API /stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}