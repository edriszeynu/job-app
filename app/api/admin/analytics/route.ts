import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const [totalUsers, totalJobs, totalCompanies, totalApplications] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.company.count(),
    prisma.application.count(),
  ]);

  // User growth — last 7 days
  const userGrowth = await Promise.all(
    Array.from({ length: 7 }).map(async (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const next = new Date(date);
      next.setDate(next.getDate() + 1);
      const count = await prisma.user.count({ where: { createdAt: { gte: date, lt: next } } });
      return { date: date.toLocaleDateString("en", { month: "short", day: "numeric" }), count };
    })
  );

  // Application growth — last 7 days
  const appGrowth = await Promise.all(
    Array.from({ length: 7 }).map(async (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const next = new Date(date);
      next.setDate(next.getDate() + 1);
      const count = await prisma.application.count({ where: { createdAt: { gte: date, lt: next } } });
      return { date: date.toLocaleDateString("en", { month: "short", day: "numeric" }), count };
    })
  );

  // Job types distribution
  const jobTypes = await prisma.job.groupBy({ by: ["jobType"], _count: true });

  return NextResponse.json({
    stats: { totalUsers, totalJobs, totalCompanies, totalApplications },
    userGrowth,
    appGrowth,
    jobTypes,
  });
}
