import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const jobUpdateSchema = z.object({
  title: z.string().min(5).optional(),
  jobType: z.string().optional(),
  category: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  isRemote: z.boolean().optional(),
  isHybrid: z.boolean().optional(),
  salaryMin: z.number().nullable().optional(),
  salaryMax: z.number().nullable().optional(),
  currency: z.string().default("USD"),
  isNegotiable: z.boolean().optional(),
  description: z.string().min(50).optional(),
  responsibilities: z.string().optional().nullable(),
  requirements: z.string().optional().nullable(),
  experienceLevel: z.string().optional(),
  skills: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // 👈 Promise here
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;   // 👈 await the Promise

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        _count: { select: { applications: true } },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const company = await prisma.company.findFirst({
      where: { id: job.companyId, ownerId: session.user.id },
    });

    if (!company) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("GET /api/employer/jobs/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // 👈 Promise here
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;   // 👈 await the Promise
    const body = await request.json();
    const validated = jobUpdateSchema.parse(body);

    const job = await prisma.job.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const company = await prisma.company.findFirst({
      where: { id: job.companyId, ownerId: session.user.id },
    });

    if (!company) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        title: validated.title,
        jobType: validated.jobType as any,
        category: validated.category,
        location: validated.location,
        isRemote: validated.isRemote,
        isHybrid: validated.isHybrid,
        salaryMin: validated.salaryMin,
        salaryMax: validated.salaryMax,
        currency: validated.currency,
        isNegotiable: validated.isNegotiable,
        description: validated.description,
        responsibilities: validated.responsibilities,
        requirements: validated.requirements,
        experienceLevel: validated.experienceLevel as any,
        skills: validated.skills,
        isActive: validated.isActive,
      },
    });

    return NextResponse.json({ success: true, data: updatedJob });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("PUT /api/employer/jobs/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // 👈 Promise here
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;   // 👈 await the Promise

    const job = await prisma.job.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const company = await prisma.company.findFirst({
      where: { id: job.companyId, ownerId: session.user.id },
    });

    if (!company) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.$transaction([
      prisma.application.deleteMany({ where: { jobId: id } }),
      prisma.savedJob.deleteMany({ where: { jobId: id } }),
      prisma.job.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/employer/jobs/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}