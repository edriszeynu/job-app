// app/api/admin/companies/[id]/route.ts
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

    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Delete company and related jobs
    await prisma.$transaction([
      prisma.job.deleteMany({ where: { companyId: id } }),
      prisma.savedCompany.deleteMany({ where: { companyId: id } }),
      prisma.review.deleteMany({ where: { companyId: id } }),
      prisma.company.delete({ where: { id } }),
    ]);

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: auth.session?.user?.id ?? "",
        action: "DELETE_COMPANY",
        details: { companyId: id, name: company.name },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Company delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
