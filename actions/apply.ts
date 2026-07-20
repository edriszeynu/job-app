// actions/apply.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const applySchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().optional(),
});

export async function applyToJob(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: "You must be signed in to apply" };

  const userId = session.user.id;
  const jobId = formData.get("jobId") as string;
  const coverLetter = formData.get("coverLetter") as string;

  const validation = applySchema.safeParse({ jobId, coverLetter });
  if (!validation.success) return { error: "Invalid data" };

  const existing = await prisma.application.findFirst({
    where: { jobId, userId },
  });
  if (existing) return { error: "You have already applied to this job" };

  const file = formData.get("resume") as File | null;
  if (!file || file.size === 0) return { error: "Please upload your resume" };

  const validTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!validTypes.includes(file.type)) {
    return { error: "Please upload a PDF or Word document" };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: "File size must be less than 5MB" };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  let resumeUrl = "";
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "resumes",
        },
        (error, result) => (error ? reject(error) : resolve(result))
      ).end(buffer);
    });
    resumeUrl = (result as any).secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return { error: "Failed to upload resume. Try again." };
  }

  try {
    await prisma.application.create({
      data: {
        jobId,
        userId,
        resume: resumeUrl,
        coverLetter: coverLetter || undefined,
        status: "PENDING",
      },
    });
    return { success: true };
  } catch {
    return { error: "Failed to submit application." };
  }
}