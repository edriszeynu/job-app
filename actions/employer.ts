"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleJobActive(jobId: string, isActive: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return;

  const company = await prisma.company.findFirst({ where: { ownerId: session.user.id } });
  if (!company) return;

  const job = await prisma.job.findFirst({ where: { id: jobId, companyId: company.id } });
  if (!job) return;

  await prisma.job.update({ where: { id: jobId }, data: { isActive } });
  revalidatePath("/dashboard/employer/jobs");
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "Not authenticated" };

  const company = await prisma.company.findFirst({ where: { ownerId: session.user.id } });
  if (!company) return { error: "No company found" };

  const app = await prisma.application.findFirst({
    where: { id: applicationId, job: { companyId: company.id } },
  });
  if (!app) return { error: "Application not found" };

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: status as any },
  });
  revalidatePath("/dashboard/employer/applicants");
  return { success: true };
}