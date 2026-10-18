"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approveJob(jobId: string, approved: boolean) {
  await prisma.job.update({
    where: { id: jobId },
    data: { isApproved: approved },
  });
  revalidatePath("/dashboard/admin/jobs");
  revalidatePath("/");
}

export async function changeUserRole(userId: string, role: "JOB_SEEKER" | "EMPLOYER") {
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  revalidatePath("/dashboard/admin/users");
}

export async function makeUserAdmin(userId: string, isAdmin: boolean) {
  await prisma.user.update({
    where: { id: userId },
    data: { isAdmin },
  });
  revalidatePath("/dashboard/admin/users");
}

export async function deleteUser(userId: string) {
  // Delete companies owned by user (and their jobs/applications first)
  const companies = await prisma.company.findMany({ where: { ownerId: userId }, select: { id: true } });
  for (const company of companies) {
    const jobs = await prisma.job.findMany({ where: { companyId: company.id }, select: { id: true } });
    for (const job of jobs) {
      await prisma.application.deleteMany({ where: { jobId: job.id } });
      await prisma.savedJob.deleteMany({ where: { jobId: job.id } });
    }
    await prisma.job.deleteMany({ where: { companyId: company.id } });
    await prisma.review.deleteMany({ where: { companyId: company.id } });
    await prisma.savedCompany.deleteMany({ where: { companyId: company.id } });
    await prisma.company.delete({ where: { id: company.id } });
  }
  await prisma.application.deleteMany({ where: { userId } });
  await prisma.savedJob.deleteMany({ where: { userId } });
  await prisma.savedCompany.deleteMany({ where: { userId } });
  await prisma.notification.deleteMany({ where: { userId } });
  await prisma.review.deleteMany({ where: { userId } });
  await prisma.report.deleteMany({ where: { reporterId: userId } });
  await prisma.auditLog.deleteMany({ where: { userId } });
  await prisma.payment.deleteMany({ where: { userId } });
  await prisma.blog.deleteMany({ where: { authorId: userId } });
  await prisma.message.deleteMany({ where: { OR: [{ senderId: userId }, { receiverId: userId }] } });
  await prisma.userProfile.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/dashboard/admin/users");
}

export async function approveCompany(companyId: string, approved: boolean) {
  await prisma.company.update({
    where: { id: companyId },
    data: { isApproved: approved },
  });
  revalidatePath("/dashboard/admin/employers");
}

export async function deleteUserAdmin(userId: string) {
  await prisma.application.deleteMany({ where: { userId } });
  await prisma.savedJob.deleteMany({ where: { userId } });
  await prisma.notification.deleteMany({ where: { userId } });
  await prisma.userProfile.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/dashboard/admin/users");
}
