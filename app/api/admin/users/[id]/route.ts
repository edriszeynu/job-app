// app/api/admin/users/[id]/route.ts
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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Delete user and all related data in correct order
    const companies = await prisma.company.findMany({
      where: { ownerId: id },
      select: { id: true },
    });

    for (const company of companies) {
      const jobs = await prisma.job.findMany({
        where: { companyId: company.id },
        select: { id: true },
      });
      for (const job of jobs) {
        await prisma.application.deleteMany({ where: { jobId: job.id } });
        await prisma.savedJob.deleteMany({ where: { jobId: job.id } });
      }
      await prisma.job.deleteMany({ where: { companyId: company.id } });
      await prisma.review.deleteMany({ where: { companyId: company.id } });
      await prisma.savedCompany.deleteMany({ where: { companyId: company.id } });
      await prisma.company.delete({ where: { id: company.id } });
    }

    await prisma.application.deleteMany({ where: { userId: id } });
    await prisma.savedJob.deleteMany({ where: { userId: id } });
    await prisma.savedCompany.deleteMany({ where: { userId: id } });
    await prisma.notification.deleteMany({ where: { userId: id } });
    await prisma.review.deleteMany({ where: { userId: id } });
    await prisma.report.deleteMany({ where: { reporterId: id } });
    await prisma.auditLog.deleteMany({ where: { userId: id } });
    await prisma.payment.deleteMany({ where: { userId: id } });
    await prisma.blog.deleteMany({ where: { authorId: id } });
    await prisma.message.deleteMany({ where: { OR: [{ senderId: id }, { receiverId: id }] } });
    await prisma.userProfile.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}