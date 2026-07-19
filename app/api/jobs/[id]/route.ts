// app/api/jobs/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: job });
  } catch (error) {
    console.error("API /jobs/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}