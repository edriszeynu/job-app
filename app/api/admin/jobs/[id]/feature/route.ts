// app/api/admin/jobs/[id]/feature/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { featured } = body;

    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    await prisma.job.update({
      where: { id },
      data: { isFeatured: featured },
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: auth.session.user.id,
        action: featured ? "FEATURE_JOB" : "UNFEATURE_JOB",
        details: { jobId: id, title: job.title },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Job feature error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}