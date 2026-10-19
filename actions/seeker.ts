"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function withdrawApplication(applicationId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return;

  const app = await prisma.application.findFirst({
    where: { id: applicationId, userId: session.user.id },
  });
  if (!app) return;
  if (app.status !== "PENDING") return;

  await prisma.application.delete({ where: { id: applicationId } });
  revalidatePath("/dashboard/seeker/applications");
}

export async function unsaveJob(savedJobId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return;

  await prisma.savedJob.deleteMany({
    where: { id: savedJobId, userId: session.user.id },
  });
  revalidatePath("/dashboard/seeker/saved-jobs");
}
