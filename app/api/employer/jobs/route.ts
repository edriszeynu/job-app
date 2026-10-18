import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { JobType, ExperienceLevel } from "@prisma/client";

const jobSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(50),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  salaryMin: z.coerce.number().min(0).optional().nullable(),
  salaryMax: z.coerce.number().min(0).optional().nullable(),
  currency: z.string().default("USD"),
  isNegotiable: z.boolean().default(false),
  jobType: z.nativeEnum(JobType),
  experienceLevel: z.nativeEnum(ExperienceLevel),
  location: z.string().optional(),
  isRemote: z.boolean().default(false),
  isHybrid: z.boolean().default(false),
  category: z.string().optional(),
  skills: z.array(z.string()).default([]),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "EMPLOYER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const company = await prisma.company.findFirst({ where: { ownerId: session.user.id } });
  if (!company) return NextResponse.json({ error: "Create a company profile first" }, { status: 400 });

  const body = await request.json();
  const validated = jobSchema.parse(body);

  const job = await prisma.job.create({
    data: {
      ...validated,
      companyId: company.id,
      isActive: true,
      isApproved: false, // requires admin approval before going public
    },
  });

  return NextResponse.json({ data: job }, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const company = await prisma.company.findFirst({ where: { ownerId: session.user.id } });
  if (!company) return NextResponse.json({ data: [] });

  const jobs = await prisma.job.findMany({
    where: { companyId: company.id },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: jobs });
}
