// app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const [
      totalUsers,
      totalEmployers,
      totalJobSeekers,
      totalJobs,
      totalCompanies,
      totalApplications,
      pendingJobs,
      pendingCompanies,
      activeJobs,
      featuredJobs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "EMPLOYER" } }),
      prisma.user.count({ where: { role: "JOB_SEEKER" } }),
      prisma.job.count(),
      prisma.company.count(),
      prisma.application.count(),
      prisma.job.count({ where: { isApproved: false } }),
      prisma.company.count({ where: { isApproved: false } }),
      prisma.job.count({ where: { isActive: true } }),
      prisma.job.count({ where: { isFeatured: true } }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalEmployers,
      totalJobSeekers,
      totalJobs,
      totalCompanies,
      totalApplications,
      pendingJobs,
      pendingCompanies,
      activeJobs,
      featuredJobs,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
