// app/api/admin/companies/[id]/verify/route.ts
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
    const { approved } = body;

    const company = await prisma.company.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    await prisma.company.update({
      where: { id },
      data: { isApproved: approved },
    });

    // Log action
    await prisma.auditLog.create({
      data: {
        userId: auth.session?.user?.id ?? "",
        action: approved ? "APPROVE_COMPANY" : "REJECT_COMPANY",
        details: {
          companyId: id,
          name: company.name,
          ownerEmail: company.owner?.email,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Company verify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}