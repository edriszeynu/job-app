import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await prisma.job.updateMany({
    where: { isApproved: false },
    data: { isApproved: true },
  });
  return NextResponse.json({ success: true, updated: result.count });
}
