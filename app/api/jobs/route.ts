import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const q = searchParams.get("q") || "";
    const location = searchParams.get("location") || "";
    const jobType = searchParams.get("jobType") || "";
    const experienceLevel = searchParams.get("experienceLevel") || "";
    const minSalary = searchParams.get("minSalary");
    const maxSalary = searchParams.get("maxSalary");
    const isRemote = searchParams.get("isRemote");
    const category = searchParams.get("category") || "";

    const where: any = {
      isActive: true,
      isApproved: true,
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { skills: { has: q } },
        ],
      }),
      ...(location && { location: { contains: location, mode: "insensitive" } }),
      ...(jobType && { jobType }),
      ...(experienceLevel && { experienceLevel }),
      ...(category && { category: { contains: category, mode: "insensitive" } }),
      ...(isRemote === "true" && { isRemote: true }),
      ...(minSalary && { salaryMin: { gte: parseFloat(minSalary) } }),
      ...(maxSalary && { salaryMax: { lte: parseFloat(maxSalary) } }),
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}