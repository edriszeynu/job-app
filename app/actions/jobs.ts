"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const applySchema = z.object({
  jobId: z.string(),
  resume: z.string().url(),
  coverLetter: z.string().optional(),
});

export async function applyToJob(formData: FormData) {
  // Get user from session (you'll need to implement auth later)
  // const session = await getServerSession();
  // if (!session?.user) throw new Error("Unauthorized");

  const raw = {
    jobId: formData.get("jobId"),
    resume: formData.get("resume"),
    coverLetter: formData.get("coverLetter"),
  };

  const result = applySchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { jobId, resume, coverLetter } = result.data;

  // Check if already applied
  const existing = await prisma.application.findFirst({
    where: { jobId, userId: "USER_ID_FROM_SESSION" },
  });

  if (existing) {
    return { error: "You have already applied to this job" };
  }

  await prisma.application.create({
    data: {
      jobId,
      userId: "USER_ID_FROM_SESSION",
      resume,
      coverLetter,
      status: "PENDING",
    },
  });

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/jobs");

  return { success: true };
}