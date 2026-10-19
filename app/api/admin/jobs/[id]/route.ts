// app/api/admin/jobs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await params;

    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Delete job and related applications
    await prisma.$transaction([
      prisma.application.deleteMany({ where: { jobId: id } }),
      prisma.savedJob.deleteMany({ where: { jobId: id } }),
      prisma.job.delete({ where: { id } }),
    ]);

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: auth.session?.user?.id ?? "",
        action: "DELETE_JOB",
        details: { jobId: id, title: job.title },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Job delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}