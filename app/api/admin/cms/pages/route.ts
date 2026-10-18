import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const body = await request.json();
  const { id, ...data } = body;
  if (id) {
    const page = await prisma.page.update({ where: { id }, data });
    return NextResponse.json(page);
  }
  const page = await prisma.page.create({ data });
  return NextResponse.json(page);
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const body = await request.json();
  const { id, ...data } = body;
  const page = await prisma.page.update({ where: { id }, data });
  return NextResponse.json(page);
}
