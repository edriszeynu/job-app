import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const session = await getServerSession(authOptions);
  const { id, ...data } = await request.json();

  if (id) {
    const blog = await prisma.blog.update({ where: { id }, data });
    return NextResponse.json(blog);
  }

  const blog = await prisma.blog.create({
    data: { ...data, authorId: session!.user.id },
  });
  return NextResponse.json(blog);
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { id, ...data } = await request.json();
  const blog = await prisma.blog.update({ where: { id }, data });
  return NextResponse.json(blog);
}
