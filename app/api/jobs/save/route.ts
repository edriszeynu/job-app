import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// POST /api/jobs/save — save a job
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await request.json();
  if (!jobId) return NextResponse.json({ error: "jobId required" }, { status: 400 });

  const existing = await prisma.savedJob.findFirst({
    where: { jobId, userId: session.user.id },
  });
  if (existing) return NextResponse.json({ error: "Already saved" }, { status: 409 });

  const saved = await prisma.savedJob.create({
    data: { jobId, userId: session.user.id },
  });

  return NextResponse.json({ data: saved }, { status: 201 });
}

// DELETE /api/jobs/save — unsave a job
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await request.json();
  if (!jobId) return NextResponse.json({ error: "jobId required" }, { status: 400 });

  await prisma.savedJob.deleteMany({
    where: { jobId, userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}

// GET /api/jobs/save?jobId=xxx — check if a job is saved
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ saved: false });

  const jobId = request.nextUrl.searchParams.get("jobId");
  if (!jobId) return NextResponse.json({ saved: false });

  const existing = await prisma.savedJob.findFirst({
    where: { jobId, userId: session.user.id },
  });

  return NextResponse.json({ saved: !!existing });
}
