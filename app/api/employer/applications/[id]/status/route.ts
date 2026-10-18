import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await request.json();

  const company = await prisma.company.findFirst({ where: { ownerId: session.user.id } });
  if (!company) return NextResponse.json({ error: "No company" }, { status: 403 });

  const app = await prisma.application.findFirst({
    where: { id, job: { companyId: company.id } },
  });
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.application.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}
