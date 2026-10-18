import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id, ...data } = await request.json();
  if (id) return NextResponse.json(await prisma.fAQ.update({ where: { id }, data }));
  return NextResponse.json(await prisma.fAQ.create({ data }));
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id, ...data } = await request.json();
  return NextResponse.json(await prisma.fAQ.update({ where: { id }, data }));
}
